import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import BookingRequest from '@/models/BookingRequest';
import Tenant from '@/models/Tenant';
import AdminNotification from '@/models/AdminNotification';
import { PaystackService } from '@/lib/paystack';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectDB();

    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Transaction reference is required'
      }, { status: 400 });
    }

    // Find transaction in database
    const transaction = await Transaction.findOne({ reference }).populate('bookingRequest');

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    // If already successful, return success
    if (transaction.status === 'success') {
      return NextResponse.json({
        success: true,
        data: {
          status: 'success',
          transaction: transaction,
          message: 'Payment already verified'
        }
      });
    }

    // Verify with Paystack
    const paystackResponse = await PaystackService.verifyTransaction(reference);

    if (paystackResponse.status && paystackResponse.data.status === 'success') {
      // Use a transaction to ensure atomicity
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Mark transaction as successful
          await transaction.markAsSuccessful(paystackResponse.data);

          // Create admin notification for payment received
          await AdminNotification.createPaymentNotification(transaction);

          // Update existing booking request
          const bookingRequest = transaction.bookingRequest;
          
          if (bookingRequest) {
            // Update booking request status to approved and mark as paid
            await bookingRequest.updateStatus(
              'Approved',
              'Payment completed successfully - auto-approved',
              'System'
            );

            // Create admin notification for booking approval
            await AdminNotification.createBookingRequestNotification(bookingRequest, 'booking_approved');

            // Check if tenant already exists for this booking request
            const existingTenant = await Tenant.findOne({
              email: bookingRequest.guestDetails.email,
              apartment: bookingRequest.property,
              'stayDetails.checkInDate': bookingRequest.bookingDetails.checkInDate,
              'stayDetails.checkOutDate': bookingRequest.bookingDetails.checkOutDate
            }).session(session);

            if (!existingTenant) {
              // Create new tenant record
              const tenant = new Tenant({
                firstName: bookingRequest.guestDetails.firstName,
                lastName: bookingRequest.guestDetails.lastName,
                email: bookingRequest.guestDetails.email,
                phone: bookingRequest.guestDetails.phone,
                nin: bookingRequest.guestDetails.nin,
                ninImage: bookingRequest.guestDetails.ninImage,
                apartment: bookingRequest.property,
                stayDetails: {
                  checkInDate: bookingRequest.bookingDetails.checkInDate,
                  checkOutDate: bookingRequest.bookingDetails.checkOutDate,
                  numberOfGuests: bookingRequest.bookingDetails.numberOfGuests,
                  numberOfNights: bookingRequest.bookingDetails.numberOfNights,
                  totalAmount: bookingRequest.bookingDetails.totalAmount,
                  pricePerNight: bookingRequest.bookingDetails.pricePerNight
                },
                paymentDetails: {
                  paymentMethod: 'Online Payment',
                  paymentStatus: 'Paid',
                  amountPaid: bookingRequest.bookingDetails.totalAmount,
                  paymentDate: new Date(),
                  transactionReference: transaction.reference
                },
                status: 'Confirmed',
                emergencyContact: bookingRequest.emergencyContact
              });

              await tenant.save({ session });

              // Update booking request to reference the created tenant
              bookingRequest.convertedToTenant = tenant._id;
              bookingRequest.status = 'Converted';
              await bookingRequest.save({ session });

              // Add communication log about tenant creation
              await bookingRequest.addCommunication(
                'Note',
                'Tenant record created successfully after payment confirmation',
                'System'
              );
              await bookingRequest.save({ session });

              // Create admin notification for new tenant
              await AdminNotification.createNotification({
                title: 'New Tenant Created',
                message: `New tenant ${tenant.firstName} ${tenant.lastName} created after successful payment`,
                type: 'tenant_checkin',
                priority: 'medium',
                relatedRecords: {
                  tenant: tenant._id,
                  apartment: tenant.apartment,
                  bookingRequest: bookingRequest._id,
                  transaction: transaction._id
                },
                actionUrl: '/dashboard/tenants',
                actionText: 'View Tenant'
              });
            }
          } else {
            // This shouldn't happen with the new flow, but handle gracefully
            console.warn('Transaction found without associated booking request:', transaction._id);
          }
        });
      } finally {
        await session.endSession();
      }

      // Refresh transaction data to include the booking request
      const updatedTransaction = await Transaction.findById(transaction._id).populate('bookingRequest');

      return NextResponse.json({
        success: true,
        data: {
          status: 'success',
          transaction: updatedTransaction,
          paystackData: paystackResponse.data,
          message: 'Payment verified successfully and tenant record created'
        }
      });
    } else {
      // Mark transaction as failed
      await transaction.markAsFailed(paystackResponse.data.gateway_response || 'Payment failed');

      // Update booking request status to reflect payment failure
      if (transaction.bookingRequest) {
        await transaction.bookingRequest.updateStatus(
          'Pending',
          'Payment failed - awaiting retry or alternative payment',
          'System'
        );
      }

      return NextResponse.json({
        success: false,
        data: {
          status: 'failed',
          transaction: transaction,
          message: paystackResponse.data.gateway_response || 'Payment verification failed'
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify payment'
    }, { status: 500 });
  }
}
