import { NextResponse } from 'next/server';
import { sendBookingRequestEmail } from '../../../lib/email';

export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const { property, bookingDetails, personalDetails } = bookingData;
    
    if (!property || !bookingDetails || !personalDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking data' },
        { status: 400 }
      );
    }

    // Validate personal details
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !personalDetails[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate booking details
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate || !bookingDetails.guests) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking details' },
        { status: 400 }
      );
    }

    // Validate dates
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return NextResponse.json(
        { success: false, error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { success: false, error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Send booking request emails
    const emailResult = await sendBookingRequestEmail(bookingData);

    // Log the booking request (you might want to save to database here)
    console.log('New booking request:', {
      property: property.title,
      guest: `${personalDetails.firstName} ${personalDetails.lastName}`,
      email: personalDetails.email,
      dates: `${bookingDetails.checkInDate} to ${bookingDetails.checkOutDate}`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Booking request sent successfully',
      emailResult
    });

  } catch (error) {
    console.error('Booking API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process booking request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
