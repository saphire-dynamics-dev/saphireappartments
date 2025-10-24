import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { code, userId, orderId } = body;

    // Validate required fields
    if (!code || !userId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Find the discount code
    const discountCodeDoc = await DiscountCode.findOne({ 
      code: code.toUpperCase() 
    });

    if (!discountCodeDoc) {
      return NextResponse.json({
        success: false,
        message: 'Discount code not found'
      }, { status: 404 });
    }

    // Check if the code is still available
    if (!discountCodeDoc.isAvailable) {
      return NextResponse.json({
        success: false,
        message: 'Discount code is no longer available'
      }, { status: 400 });
    }

    // Check if user has already used this code
    if (discountCodeDoc.usedBy.some(usage => usage.userId === userId)) {
      return NextResponse.json({
        success: false,
        message: 'User has already used this discount code'
      }, { status: 400 });
    }

    // Mark the code as used
    await discountCodeDoc.useCode(userId, orderId);

    return NextResponse.json({
      success: true,
      message: 'Discount code marked as used successfully'
    });

  } catch (error) {
    console.error('Error marking discount code as used:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while marking the discount code as used'
    }, { status: 500 });
  }
}