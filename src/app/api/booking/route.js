import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Apartment from '@/models/Apartment';
import BookingRequest from '@/models/BookingRequest';
import DiscountCode from '@/models/DiscountCode';
import { uploadNinImage } from '@/lib/imageUpload';
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from '@/lib/email';
import { calculateDiscount, getStay, hasBookingConflict, parseApartmentNightlyPrice } from '@/lib/booking';

const badRequest = (error, status = 400) => NextResponse.json({ success: false, error }, { status });

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const submittedProperty = JSON.parse(formData.get('property'));
    const bookingDetails = JSON.parse(formData.get('bookingDetails'));
    const personalDetails = JSON.parse(formData.get('personalDetails'));
    const emergencyContact = JSON.parse(formData.get('emergencyContact'));
    const submittedDiscount = formData.get('discountCode') ? JSON.parse(formData.get('discountCode')) : null;
    const paymentMethod = formData.get('paymentMethod') === 'bank_transfer' ? 'bank_transfer' : 'online';
    const ninImage = formData.get('ninImage');
    const { checkInDate, checkOutDate, guests } = bookingDetails || {};
    const { firstName, lastName, email, phone } = personalDetails || {};

    if (!submittedProperty?._id || !checkInDate || !checkOutDate || !firstName || !lastName || !email || !phone) {
      return badRequest('Please fill in all required booking information');
    }
    if (!emergencyContact?.name || !emergencyContact?.phone || !emergencyContact?.relationship) return badRequest('Emergency contact information is required');
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1 || Number(guests) > 10) return badRequest('Number of guests must be between 1 and 10');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return badRequest('Please provide a valid email address');

    // The database, never the browser, is the source of truth for rates and availability.
    const property = await Apartment.findById(submittedProperty._id);
    if (!property || property.status !== 'Available') return badRequest('This apartment is not available for booking');
    const { checkIn, checkOut, numberOfNights } = getStay(checkInDate, checkOutDate);
    if (await hasBookingConflict(property._id, checkIn, checkOut)) return badRequest('Those dates are no longer available', 409);

    const pricePerNight = parseApartmentNightlyPrice(property.price);
    const baseAmount = numberOfNights * pricePerNight;
    const discountCodeDoc = submittedDiscount?.code ? await DiscountCode.findOne({ code: String(submittedDiscount.code).trim().toUpperCase() }) : null;
    if (submittedDiscount?.code && !discountCodeDoc) return badRequest('Invalid discount code');
    const customerId = email.trim().toLowerCase();
    if (discountCodeDoc?.usedBy.some((usage) => usage.userId === customerId)) return badRequest('You have already used this discount code');
    const discount = calculateDiscount(discountCodeDoc, baseAmount, numberOfNights);
    const totalAmount = discount?.finalAmount ?? baseAmount;

    let ninImageData = null;
    if (ninImage?.size > 0) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(ninImage.type) || ninImage.size > 5 * 1024 * 1024) return badRequest('NIN image must be a JPG, PNG, or WebP file smaller than 5 MB');
      try { ninImageData = await uploadNinImage(ninImage, `temp-${Date.now()}`); }
      catch (error) { console.error('NIN image upload failed:', error.message); }
    }

    const bookingRequest = await BookingRequest.create({
      property: property._id, propertyTitle: property.title, propertyLocation: property.location,
      guestDetails: { firstName, lastName, email: customerId, phone, nin: personalDetails.nin || undefined, ninImage: ninImageData },
      emergencyContact,
      bookingDetails: { checkInDate: checkIn, checkOutDate: checkOut, numberOfGuests: Number(guests), numberOfNights, pricePerNight, totalAmount, baseAmount, discountAmount: discount?.discountAmount ?? 0, discountCode: discountCodeDoc?.code },
      discountCodeUsed: Boolean(discountCodeDoc),
      discountCodeDetails: discountCodeDoc ? { code: discountCodeDoc.code, discountType: discountCodeDoc.discountType, discountValue: discountCodeDoc.discountValue, discountAmount: discount.discountAmount, originalAmount: baseAmount, finalAmount: totalAmount, appliedAt: new Date() } : undefined,
      source: 'Website',
      adminNotes: [paymentMethod === 'bank_transfer' ? 'Payment method: Bank Transfer - Awaiting confirmation' : undefined, discountCodeDoc ? `Discount applied: ${discountCodeDoc.code} - Saved ₦${discount.discountAmount.toLocaleString()}` : undefined, ninImage?.size > 0 && !ninImageData ? 'Warning: NIN image upload failed - manual follow-up required' : undefined].filter(Boolean).join('. ') || undefined,
    });

    // A conditional update prevents parallel requests from exhausting a code twice.
    if (discountCodeDoc) {
      const redeemed = await DiscountCode.findOneAndUpdate(
        { _id: discountCodeDoc._id, isActive: true, expiryDate: { $gt: new Date() }, $expr: { $lt: ['$currentUsageCount', '$maxUsageCount'] }, 'usedBy.userId': { $ne: customerId } },
        { $inc: { currentUsageCount: 1 }, $push: { usedBy: { userId: customerId, orderId: bookingRequest._id.toString() } } }, { new: true }
      );
      if (!redeemed) {
        await BookingRequest.findByIdAndDelete(bookingRequest._id);
        return badRequest('This discount code is no longer available', 409);
      }
    }

    bookingRequest.addCommunication('Note', paymentMethod === 'bank_transfer' ? 'Booking submitted with bank transfer payment - awaiting confirmation' : 'Booking request submitted via website', 'System');
    await bookingRequest.save();
    const emailBookingDetails = { checkInDate, checkOutDate, guests: Number(guests), numberOfNights, totalAmount };
    try {
      await sendBookingConfirmationEmail({ guestEmail: customerId, guestName: `${firstName} ${lastName}`, property, bookingDetails: emailBookingDetails, bookingId: bookingRequest._id });
      bookingRequest.addCommunication('Email', 'Booking confirmation email sent to guest', 'System');
    } catch (error) { console.error('Booking confirmation email failed:', error); }
    try {
      await sendBookingNotificationEmail({ property, guestDetails: personalDetails, bookingDetails: emailBookingDetails, bookingId: bookingRequest._id });
      bookingRequest.addCommunication('Email', 'Booking notification email sent to admin', 'System');
    } catch (error) { console.error('Booking notification email failed:', error); }
    await bookingRequest.save();

    return NextResponse.json({ success: true, message: paymentMethod === 'bank_transfer' ? 'Booking request submitted successfully. Please confirm your payment on WhatsApp.' : 'Booking request submitted successfully', data: { bookingId: bookingRequest._id, status: bookingRequest.status, totalAmount, ninImageUploaded: Boolean(ninImageData), paymentMethod } });
  } catch (error) {
    console.error('Booking submission error:', error);
    const isClientError = ['Please provide valid', 'Check-in', 'Check-out', 'This discount', 'This apartment'].some((prefix) => error.message?.startsWith(prefix));
    return badRequest(isClientError ? error.message : 'Failed to submit booking request', isClientError ? 400 : 500);
  }
}
