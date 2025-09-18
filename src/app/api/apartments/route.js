import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Apartment from '../../../models/Apartment';

export async function GET() {
  try {
    await connectDB();
    
    const apartments = await Apartment.find()
      .select('title location price bedrooms bathrooms area type description images')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to 10 for featured properties
    
    return NextResponse.json({
      success: true,
      data: apartments
    });
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch apartments' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const apartment = new Apartment(body);
    await apartment.save();
    
    return NextResponse.json({
      success: true,
      data: apartment
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating apartment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create apartment' 
      },
      { status: 500 }
    );
  }
}
