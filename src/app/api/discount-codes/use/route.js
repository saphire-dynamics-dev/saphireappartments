import { NextRequest, NextResponse } from 'next/server';
export async function POST(request) {
  // Coupon redemption is performed only inside /api/booking after server-side
  // price calculation. A public endpoint here allowed anyone to exhaust codes.
  return NextResponse.json({
    success: false,
    message: 'Discount codes are redeemed when a booking is submitted.'
  }, { status: 403 });
}
