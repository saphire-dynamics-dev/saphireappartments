import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Tenant from '@/models/Tenant';

export async function POST(request, { params }) {
  try {
    // Await params before accessing properties
    const resolvedParams = await params;
    const apartmentId = resolvedParams.id;

    // Validate apartment ID
    if (!ObjectId.isValid(apartmentId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid apartment ID'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Get request body
    const { checkInDate, checkOutDate } = await request.json();

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json({
        success: false,
        error: 'Check-in and check-out dates are required'
      }, { status: 400 });
    }

    // Use the Tenant model's checkDateConflict method
    const conflictingBooking = await Tenant.checkDateConflict(
      apartmentId,
      checkInDate,
      checkOutDate
    );

    if (conflictingBooking) {
      return NextResponse.json({
        success: true,
        available: false,
        conflictDetails: `${conflictingBooking.fullName} from ${new Date(conflictingBooking.stayDetails.checkInDate).toLocaleDateString()} to ${new Date(conflictingBooking.stayDetails.checkOutDate).toLocaleDateString()}`
      });
    }

    return NextResponse.json({
      success: true,
      available: true
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check availability'
    }, { status: 500 });
  }
}
