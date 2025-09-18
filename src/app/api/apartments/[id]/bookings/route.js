import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Tenant from '@/models/Tenant';

export async function GET(request, { params }) {
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

    // Use the static method from Tenant model to get unavailable dates
    const unavailableData = await Tenant.getUnavailableDates(apartmentId);

    // Format the ranges for the frontend
    const bookedDateRanges = unavailableData.ranges.map(range => ({
      startDate: range.start,
      endDate: range.end,
      type: 'booking'
    }));

    return NextResponse.json({
      success: true,
      data: bookedDateRanges
    });

  } catch (error) {
    console.error('Error fetching apartment bookings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch apartment bookings'
    }, { status: 500 });
  }
}
