import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { code, totalAmount, numberOfDays, userId } = body;

    // Validate required fields
    if (!code || !totalAmount || !numberOfDays) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Find the discount code (case-insensitive)
    const discountCodeDoc = await DiscountCode.findOne({ 
      code: code.toUpperCase() 
    });

    if (!discountCodeDoc) {
      return NextResponse.json({
        success: false,
        message: 'Invalid discount code'
      }, { status: 404 });
    }

    // Check if discount code is active
    if (!discountCodeDoc.isActive) {
      return NextResponse.json({
        success: false,
        message: 'This discount code is no longer active'
      }, { status: 400 });
    }

    // Check if discount code has expired
    if (discountCodeDoc.isExpired) {
      return NextResponse.json({
        success: false,
        message: 'This discount code has expired'
      }, { status: 400 });
    }

    // Check if discount code has been fully used
    if (discountCodeDoc.isFullyUsed) {
      return NextResponse.json({
        success: false,
        message: 'This discount code has reached its usage limit'
      }, { status: 400 });
    }

    // Check minimum order amount (days requirement)
    if (numberOfDays < discountCodeDoc.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `This discount code requires a minimum stay of ${discountCodeDoc.minOrderAmount} days`
      }, { status: 400 });
    }

    // If user ID is provided, check if user has already used this code
    if (userId && discountCodeDoc.usedBy.some(usage => usage.userId === userId)) {
      return NextResponse.json({
        success: false,
        message: 'You have already used this discount code'
      }, { status: 400 });
    }

    // Calculate discount amount
    let discountAmount = 0;
    
    if (discountCodeDoc.discountType === 'percentage') {
      discountAmount = (totalAmount * discountCodeDoc.discountValue) / 100;
      
      // Cap the discount amount if maxDiscountAmount is set
      if (discountCodeDoc.maxDiscountAmount && discountAmount > discountCodeDoc.maxDiscountAmount) {
        discountAmount = discountCodeDoc.maxDiscountAmount;
      }
    } else if (discountCodeDoc.discountType === 'fixed') {
      discountAmount = discountCodeDoc.discountValue;
      
      // Ensure discount doesn't exceed total amount
      if (discountAmount > totalAmount) {
        discountAmount = totalAmount;
      }
    }

    // Calculate final amount
    const finalAmount = Math.max(0, totalAmount - discountAmount);

    return NextResponse.json({
      success: true,
      message: 'Discount code is valid',
      discount: {
        code: discountCodeDoc.code,
        description: discountCodeDoc.description,
        discountType: discountCodeDoc.discountType,
        discountValue: discountCodeDoc.discountValue,
        discountAmount: Math.round(discountAmount),
        originalAmount: totalAmount,
        finalAmount: Math.round(finalAmount),
        savings: Math.round(discountAmount)
      }
    });

  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while validating the discount code'
    }, { status: 500 });
  }
}