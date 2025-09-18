import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MaintenanceRequest from '@/models/MaintenanceRequest';
import AdminNotification from '@/models/AdminNotification';
import { sendMaintenanceRequestConfirmationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['apartment', 'apartmentTitle', 'apartmentLocation', 'requester', 'issueCategory', 'title', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({
          success: false,
          error: `${field} is required`
        }, { status: 400 });
      }
    }

    // Create maintenance request
    const maintenanceRequest = new MaintenanceRequest(data);
    await maintenanceRequest.save();

    // Create admin notification
    await AdminNotification.createMaintenanceNotification(maintenanceRequest);

    // Add initial communication log
    await maintenanceRequest.addCommunication(
      'Note',
      `Maintenance request submitted by ${data.requester.type.toLowerCase()}: ${data.requester.name}`,
      'System'
    );

    // Send confirmation email to requester
    try {
      await sendMaintenanceRequestConfirmationEmail({
        requesterEmail: data.requester.email,
        requesterName: data.requester.name,
        apartmentTitle: data.apartmentTitle,
        apartmentLocation: data.apartmentLocation,
        issueCategory: data.issueCategory,
        priority: data.priority,
        title: data.title,
        description: data.description,
        requestId: maintenanceRequest._id
      });

      // Log email sent
      await maintenanceRequest.addCommunication(
        'Email',
        'Maintenance request confirmation email sent to requester',
        'System'
      );
    } catch (emailError) {
      console.error('Error sending maintenance confirmation email:', emailError);
      // Continue with success response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Maintenance request created successfully',
      data: maintenanceRequest
    });

  } catch (error) {
    console.error('Error creating maintenance request:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create maintenance request'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const apartment = searchParams.get('apartment');

    let query = {};
    if (status) query.status = status;
    if (apartment) query.apartment = apartment;

    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('apartment', 'title location')
      .populate('requester.tenant', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: maintenanceRequests
    });

  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch maintenance requests'
    }, { status: 500 });
  }
}
