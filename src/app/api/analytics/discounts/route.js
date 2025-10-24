import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BookingRequest from '@/models/BookingRequest';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit')) || 10;

    const timeframe = {};
    if (from) timeframe.from = from;
    if (to) timeframe.to = to;

    // Get overall discount statistics
    const discountStats = await BookingRequest.getDiscountStats(timeframe);

    // Get top discount codes
    const topDiscountCodes = await BookingRequest.getTopDiscountCodes(limit, timeframe);

    // Calculate discount usage rate
    const discountUsageRate = discountStats.totalBookings > 0 
      ? Math.round((discountStats.bookingsWithDiscount / discountStats.totalBookings) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBookings: discountStats.totalBookings,
          bookingsWithDiscount: discountStats.bookingsWithDiscount,
          discountUsageRate: `${discountUsageRate}%`,
          totalSavings: Math.round(discountStats.totalSavings || 0),
          avgDiscountAmount: Math.round(discountStats.avgDiscountAmount || 0)
        },
        topDiscountCodes: topDiscountCodes.map(code => ({
          code: code._id,
          usageCount: code.usageCount,
          totalSavings: Math.round(code.totalSavings),
          avgSavings: Math.round(code.avgSavings),
          discountType: code.discountType,
          discountValue: code.discountValue
        })),
        timeframe: {
          from: from || 'All time',
          to: to || 'Present'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching discount analytics:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch discount analytics'
    }, { status: 500 });
  }
}