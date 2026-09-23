import BookingRequest from '@/models/BookingRequest';
import Tenant from '@/models/Tenant';

export function parseApartmentNightlyPrice(price) {
  const parsed = Number(String(price).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error('This apartment has an invalid nightly price');
  }
  return Math.round(parsed);
}

export function getStay(checkInValue, checkOutValue) {
  const checkIn = new Date(checkInValue);
  const checkOut = new Date(checkOutValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new Error('Please provide valid check-in and check-out dates');
  }
  if (checkIn < today) throw new Error('Check-in date cannot be in the past');
  if (checkOut <= checkIn) throw new Error('Check-out date must be after check-in date');

  const numberOfNights = Math.ceil((checkOut - checkIn) / 86_400_000);
  return { checkIn, checkOut, numberOfNights };
}

export function calculateDiscount(discountCode, baseAmount, numberOfNights) {
  if (!discountCode) return null;
  if (!discountCode.isAvailable) throw new Error('This discount code is no longer available');
  if (numberOfNights < discountCode.minOrderAmount) {
    throw new Error(`This discount code requires a minimum stay of ${discountCode.minOrderAmount} days`);
  }

  let discountAmount = discountCode.discountType === 'percentage'
    ? (baseAmount * discountCode.discountValue) / 100
    : discountCode.discountValue;
  if (discountCode.maxDiscountAmount) discountAmount = Math.min(discountAmount, discountCode.maxDiscountAmount);
  discountAmount = Math.min(baseAmount, Math.round(discountAmount));

  return { discountAmount, finalAmount: baseAmount - discountAmount };
}

export async function hasBookingConflict(propertyId, checkIn, checkOut) {
  const overlap = {
    $lt: checkOut,
  };
  const confirmedTenant = await Tenant.exists({
    apartment: propertyId,
    'stayDetails.checkInDate': overlap,
    'stayDetails.checkOutDate': { $gt: checkIn },
    status: { $in: ['Confirmed', 'Checked In'] },
  });
  if (confirmedTenant) return true;

  // A recently-created unpaid booking is a short hold while its payment starts.
  // Old pending requests do not permanently remove dates from sale.
  const holdStartedAt = new Date(Date.now() - 20 * 60 * 1000);
  return Boolean(await BookingRequest.exists({
    property: propertyId,
    status: 'Pending',
    createdAt: { $gte: holdStartedAt },
    'bookingDetails.checkInDate': overlap,
    'bookingDetails.checkOutDate': { $gt: checkIn },
  }));
}
