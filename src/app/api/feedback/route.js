import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { adminUnauthorizedResponse, requireAdmin } from '@/lib/security';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const data = await request.json();
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    const experience = typeof data.experience === 'string' ? data.experience.trim() : '';
    const rating = Number(data.rating);

    if (!name || !email || !experience || !emailPattern.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid name, email, and experience.'
      }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Please choose a rating from 1 to 5.'
      }, { status: 400 });
    }

    if (name.length > 100 || email.length > 254 || experience.length > 2000) {
      return NextResponse.json({
        success: false,
        error: 'One or more fields are too long.'
      }, { status: 400 });
    }

    await connectDB();
    await Feedback.create({ name, email, rating, experience });

    return NextResponse.json({
      success: true,
      message: 'Thank you for sharing your experience.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({
      success: false,
      error: 'Unable to submit feedback right now.'
    }, { status: 500 });
  }
}

export async function GET(request) {
  if (!requireAdmin(request)) return adminUnauthorizedResponse();

  try {
    await connectDB();
    const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 50, 100);
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch feedback.'
    }, { status: 500 });
  }
}