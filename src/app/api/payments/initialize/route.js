import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import BookingRequest from '@/models/BookingRequest';
import AdminNotification from '@/models/AdminNotification';
import { PaystackService } from '@/lib/paystack';

export async function POST(request) {
  try {
    await connectDB();

    const { bookingRequestId, paymentType = 'booking_payment' } = await request.json();

    if (!bookingRequestId) {
      return NextResponse.json({
        success: false,
        error: 'Booking request ID is required'
      }, { status: 400 });
    }

    // Get booking request
    const bookingRequest = await BookingRequest.findById(bookingRequestId);
    if (!bookingRequest) {
      return NextResponse.json({
        success: false,
        error: 'Booking request not found'
      }, { status: 404 });
    }

    // Check if payment already exists
    const existingTransaction = await Transaction.findOne({
      bookingRequest: bookingRequestId,
      status: { $in: ['pending', 'success'] }
    });

    if (existingTransaction && existingTransaction.status === 'success') {
      return NextResponse.json({
        success: false,
        error: 'Payment already completed for this booking'
      }, { status: 400 });
    }

    // Create admin notification for new booking request (if not already created)
    if (bookingRequest.status === 'Pending') {
      await AdminNotification.createBookingRequestNotification(bookingRequest, 'booking_request');
      
      // Update booking request status to indicate payment is being processed
    //   await bookingRequest.updateStatus(
    //     'Pending',
    //     'Payment initialization started',
    //     'System'
    //   );
    }

    // Generate transaction reference
    const reference = Transaction.generateReference();
    
    // Calculate amount (Paystack expects amount in kobo for NGN)
    const amountInKobo = bookingRequest.bookingDetails.totalAmount * 100;

    // Prepare Paystack payload
    const paystackPayload = {
      email: bookingRequest.guestDetails.email,
      amount: amountInKobo,
      reference: reference,
      currency: 'NGN',
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      metadata: {
        bookingRequestId: bookingRequestId,
        propertyId: bookingRequest.property,
        propertyTitle: bookingRequest.propertyTitle,
        checkInDate: bookingRequest.bookingDetails.checkInDate,
        checkOutDate: bookingRequest.bookingDetails.checkOutDate,
        numberOfNights: bookingRequest.bookingDetails.numberOfNights,
        numberOfGuests: bookingRequest.bookingDetails.numberOfGuests,
        paymentType: paymentType
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
    };

    // Initialize payment with Paystack
    const paystackResponse = await PaystackService.initializeTransaction(paystackPayload);

    // Create transaction record
    const transaction = new Transaction({
      reference: reference,
      paystackReference: paystackResponse.data.reference,
      accessCode: paystackResponse.data.access_code,
      amount: amountInKobo,
      currency: 'NGN',
      customer: {
        email: bookingRequest.guestDetails.email,
        firstName: bookingRequest.guestDetails.firstName,
        lastName: bookingRequest.guestDetails.lastName,
        phone: bookingRequest.guestDetails.phone
      },
      bookingRequest: bookingRequestId,
      type: paymentType,
      metadata: {
        propertyId: bookingRequest.property.toString(),
        propertyTitle: bookingRequest.propertyTitle,
        checkInDate: bookingRequest.bookingDetails.checkInDate,
        checkOutDate: bookingRequest.bookingDetails.checkOutDate,
        numberOfNights: bookingRequest.bookingDetails.numberOfNights,
        numberOfGuests: bookingRequest.bookingDetails.numberOfGuests
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent')
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      data: {
        authorizationUrl: paystackResponse.data.authorization_url,
        accessCode: paystackResponse.data.access_code,
        reference: reference,
        transactionId: transaction._id
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize payment'
    }, { status: 500 });
  }
}
