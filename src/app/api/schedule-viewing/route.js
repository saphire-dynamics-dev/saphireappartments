import { NextResponse } from 'next/server';
import { sendViewingRequestEmail } from '../../../lib/email';

export async function POST(request) {
  try {
    const viewingData = await request.json();
    
    // Validate required fields
    const { property, viewingDetails } = viewingData;
    
    if (!property || !viewingDetails) {
      return NextResponse.json(
        { success: false, error: 'Missing required viewing data' },
        { status: 400 }
      );
    }

    // Validate viewing details
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'preferredDate', 'preferredTime'];
    const missingFields = requiredFields.filter(field => !viewingDetails[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate date
    const preferredDate = new Date(viewingDetails.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preferredDate < today) {
      return NextResponse.json(
        { success: false, error: 'Preferred date cannot be in the past' },
        { status: 400 }
      );
    }

    // Send viewing request emails
    const emailResult = await sendViewingRequestEmail(viewingData);

    // Log the viewing request
    console.log('New viewing request:', {
      property: property.title,
      guest: `${viewingDetails.firstName} ${viewingDetails.lastName}`,
      email: viewingDetails.email,
      date: viewingDetails.preferredDate,
      time: viewingDetails.preferredTime,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Viewing request sent successfully',
      emailResult
    });

  } catch (error) {
    console.error('Viewing API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process viewing request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
