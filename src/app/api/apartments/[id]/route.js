import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Apartment from '@/models/Apartment';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Await params before accessing properties
    const resolvedParams = await params;
    const apartment = await Apartment.findById(resolvedParams.id);
    
    if (!apartment) {
      return NextResponse.json(
        { success: false, error: 'Apartment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: apartment
    });

  } catch (error) {
    console.error('Error fetching apartment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch apartment' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const apartment = await Apartment.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!apartment) {
      return NextResponse.json(
        { success: false, error: 'Apartment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: apartment
    });
  } catch (error) {
    console.error('Error updating apartment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update apartment' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const apartment = await Apartment.findByIdAndDelete(params.id);
    
    if (!apartment) {
      return NextResponse.json(
        { success: false, error: 'Apartment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Apartment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete apartment' 
      },
      { status: 500 }
    );
  }
}
