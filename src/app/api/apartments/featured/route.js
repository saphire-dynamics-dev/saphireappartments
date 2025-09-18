import { NextResponse } from 'next/server';
import Apartment from '../../../../models/Apartment';
import connectMongo from '../../../../lib/mongodb';

export async function GET() {
  try {
    await connectMongo();
    
    // Fetch featured apartments (available shortlets)
    const apartments = await Apartment.find({
      type: 'Shortlet',
      status: 'Available'
    })
    .select('title location price bedrooms bathrooms area type description images amenities contact')
    .limit(6) // Limit to 6 featured properties
    .sort({ createdAt: -1 }); // Sort by newest first

    // Transform data to match frontend expectations
    const featuredProperties = apartments.map(apt => ({
      id: apt._id.toString(),
      title: apt.title,
      location: apt.location,
      price: apt.price,
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      area: apt.area,
      type: apt.type,
      description: apt.description,
      images: apt.images.length > 0 ? apt.images : ['/images/placeholder-apartment.jpg'],
      amenities: apt.amenities || [],
      contact: apt.contact
    }));

    return NextResponse.json({ 
      success: true, 
      data: featuredProperties 
    });

  } catch (error) {
    console.error('Error fetching featured apartments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured properties' 
      },
      { status: 500 }
    );
  }
}
