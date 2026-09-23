import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Apartment from '../../../models/Apartment';
import { adminUnauthorizedResponse, requireAdmin } from '@/lib/security';

export async function GET(request) {
  try {
    await connectDB();
    
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit')) || 10, 1), 100);
    const status = request.nextUrl.searchParams.get('status');
    const filter = status && ['Available', 'Occupied', 'Maintenance'].includes(status) ? { status } : {};
    const apartments = await Apartment.find(filter)
      .select('title location price bedrooms bathrooms area type description images')
      .sort({ createdAt: -1 })
      .limit(limit);
    
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
    if (!requireAdmin(request)) return adminUnauthorizedResponse();
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
