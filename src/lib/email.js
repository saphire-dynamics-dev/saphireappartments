import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send booking request email to admin
export const sendBookingRequestEmail = async (bookingData) => {
  const transporter = createTransporter();

  const { property, bookingDetails, personalDetails } = bookingData;

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request - Saphire Apartments</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, rgb(42, 39, 106) 0%, rgb(73, 75, 158) 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .booking-details {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: rgb(42, 39, 106);
        }
        .detail-value {
          color: #6c757d;
        }
        .guest-info {
          background-color: rgb(230, 231, 248);
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .section-title {
          color: rgb(42, 39, 106);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid rgb(230, 231, 248);
          padding-bottom: 5px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
        .urgent-banner {
          background-color: #dc3545;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: 600;
          margin-bottom: 0;
        }
        @media (max-width: 600px) {
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            margin-bottom: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="urgent-banner">
          🚨 NEW BOOKING REQUEST - IMMEDIATE ATTENTION REQUIRED
        </div>
        
        <div class="header">
          <h1>🏠 Saphire Apartments</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">New Booking Request Received</p>
        </div>

        <div class="content">
          <h2 style="color: rgb(42, 39, 106); margin-top: 0;">Booking Request Details</h2>
          
          <div class="booking-details">
            <h3 class="section-title">📋 Property Information</h3>
            <div class="detail-row">
              <span class="detail-label">Property:</span>
              <span class="detail-value">${property.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${property.location}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price:</span>
              <span class="detail-value">${property.price}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property Type:</span>
              <span class="detail-value">${property.type}</span>
            </div>
          </div>

          <div class="booking-details">
            <h3 class="section-title">📅 Booking Information</h3>
            <div class="detail-row">
              <span class="detail-label">Check-in Date:</span>
              <span class="detail-value">${new Date(bookingDetails.checkInDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out Date:</span>
              <span class="detail-value">${new Date(bookingDetails.checkOutDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${Math.ceil((new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24))} nights</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span>
              <span class="detail-value">${bookingDetails.guests} Guest${bookingDetails.guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div class="guest-info">
            <h3 class="section-title">👤 Guest Information</h3>
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value">${personalDetails.firstName} ${personalDetails.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email Address:</span>
              <span class="detail-value">${personalDetails.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone Number:</span>
              <span class="detail-value">${personalDetails.phone}</span>
            </div>
          </div>

          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #155724; margin-top: 0;">📞 Next Steps:</h4>
            <ul style="color: #155724; margin: 10px 0;">
              <li>Contact the guest within 2 hours to confirm availability</li>
              <li>Verify booking details and discuss payment options</li>
              <li>Send confirmation email with check-in instructions</li>
              <li>Add booking to calendar system</li>
            </ul>
          </div>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d;">
            <strong>Request submitted on:</strong> ${new Date().toLocaleString('en-US', {
              timeZone: 'Africa/Lagos',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} (Lagos Time)
          </p>
        </div>

        <div class="footer">
          <p>This email was automatically generated from your Saphire Apartments booking system.</p>
          <p>Please respond to this booking request promptly to ensure customer satisfaction.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email to admin
  const adminMailOptions = {
    from: `"Saphire Apartments Booking System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 NEW BOOKING REQUEST - ${property.title} | ${personalDetails.firstName} ${personalDetails.lastName}`,
    html: adminEmailHtml,
  };

  // Simple minimalistic email confirmation to guest
  const guestEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
      <h2 style="color: #2a276a; margin-bottom: 20px;">Booking Request Received</h2>
      
      <p>Dear ${personalDetails.firstName},</p>
      
      <p>Thank you for your booking request. We have received your information and an agent will contact you shortly to confirm availability and finalize your reservation.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #2a276a; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2a276a; font-size: 16px;">Booking Summary</h3>
        <p style="margin: 5px 0;"><strong>Property:</strong> ${property.title}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${property.location}</p>
        <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p style="margin: 5px 0;"><strong>Guests:</strong> ${bookingDetails.guests}</p>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will contact you within 2 hours during business hours</li>
        <li>We'll confirm availability for your selected dates</li>
        <li>Payment options and check-in instructions will be provided</li>
      </ul>
      
      <p>If you have any immediate questions, please contact us at <a href="mailto:info@saphireapartments.ng" style="color: #2a276a;">info@saphireapartments.ng</a> or call +234 901 234 5678.</p>
      
      <p>Best regards,<br>
      <strong>Saphire Apartments Team</strong></p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">
        This is an automated confirmation email. Please do not reply to this email.
      </p>
    </div>
  `;

  const guestMailOptions = {
    from: `"Saphire Apartments" <${process.env.SMTP_USER}>`,
    to: personalDetails.email,
    subject: `Booking Request Received - ${property.title} | Saphire Apartments`,
    html: guestEmailHtml,
  };

  try {
    // Send both emails
    const [adminResult, guestResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(guestMailOptions)
    ]);

    return {
      success: true,
      adminMessageId: adminResult.messageId,
      guestMessageId: guestResult.messageId
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw new Error('Failed to send booking emails');
  }
};

// Send viewing request email to admin
export const sendViewingRequestEmail = async (viewingData) => {
  const transporter = createTransporter();

  const { property, viewingDetails } = viewingData;

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Viewing Request - Saphire Apartments</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, rgb(42, 39, 106) 0%, rgb(73, 75, 158) 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          padding: 30px 20px;
        }
        .viewing-details {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: rgb(42, 39, 106);
        }
        .section-title {
          color: rgb(42, 39, 106);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid rgb(230, 231, 248);
          padding-bottom: 5px;
        }
        .urgent-banner {
          background-color: #ffc107;
          color: #212529;
          padding: 10px;
          text-align: center;
          font-weight: 600;
          margin-bottom: 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="urgent-banner">
          👁️ NEW VIEWING REQUEST - SCHEDULE APPOINTMENT
        </div>
        
        <div class="header">
          <h1>🏠 Saphire Apartments</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Property Viewing Request</p>
        </div>

        <div class="content">
          <h2 style="color: rgb(42, 39, 106); margin-top: 0;">Viewing Request Details</h2>
          
          <div class="viewing-details">
            <h3 class="section-title">🏠 Property Information</h3>
            <div class="detail-row">
              <span class="detail-label">Property:</span>
              <span>${property.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span>${property.location}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price:</span>
              <span>${property.price}</span>
            </div>
          </div>

          <div class="viewing-details">
            <h3 class="section-title">📅 Viewing Preferences</h3>
            <div class="detail-row">
              <span class="detail-label">Preferred Date:</span>
              <span>${new Date(viewingDetails.preferredDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Time:</span>
              <span>${new Date(`2000-01-01T${viewingDetails.preferredTime}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Viewing Fee:</span>
              <span style="color: #dc3545; font-weight: 600;">₦2,000 (Refundable with booking)</span>
            </div>
            ${viewingDetails.message ? `
            <div class="detail-row">
              <span class="detail-label">Message:</span>
              <span>${viewingDetails.message}</span>
            </div>
            ` : ''}
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📞 Action Required:</h4>
            <ul style="color: #856404; margin: 10px 0;">
              <li>Contact the client within 4 hours to confirm viewing appointment</li>
              <li>Confirm payment of ₦2,000 viewing fee before viewing</li>
              <li>Verify the requested date and time availability</li>
              <li>Send viewing confirmation with location details and payment instructions</li>
              <li>Prepare property for presentation</li>
            </ul>
          </div>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d;">
            <strong>Request submitted on:</strong> ${new Date().toLocaleString('en-US', {
              timeZone: 'Africa/Lagos',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} (Lagos Time)
          </p>
        </div>

        <div class="footer">
          <p>This email was automatically generated from your Saphire Apartments viewing system.</p>
          <p>Please respond promptly to ensure excellent customer service.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Client confirmation email
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Viewing Request Confirmation - Saphire Apartments</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, rgb(42, 39, 106) 0%, rgb(73, 75, 158) 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .content {
          padding: 30px 20px;
        }
        .viewing-summary {
          background-color: rgb(230, 231, 248);
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🏠 Saphire Apartments</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Viewing Request Confirmation</p>
        </div>

        <div class="content">
          <h2 style="color: rgb(42, 39, 106);">Dear ${viewingDetails.firstName},</h2>
          
          <p>Thank you for your interest in viewing our property! We have received your viewing request and our team will contact you shortly to confirm the appointment.</p>

          <div class="viewing-summary">
            <h3 style="color: rgb(42, 39, 106); margin-top: 0;">📋 Your Viewing Request</h3>
            <p><strong>Property:</strong> ${property.title}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Preferred Date:</strong> ${new Date(viewingDetails.preferredDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Preferred Time:</strong> ${new Date(`2000-01-01T${viewingDetails.preferredTime}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}</p>
            <p><strong>Viewing Fee:</strong> <span style="color: #dc3545; font-weight: 600;">₦2,000</span> (Refundable if you proceed with booking)</p>
          </div>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: rgb(42, 39, 106); margin-top: 0;">💳 Payment Information</h3>
            <p style="margin-bottom: 10px;"><strong>Viewing Fee:</strong> ₦2,000</p>
            <ul style="margin: 10px 0; color: #6c757d;">
              <li>Payment is required to confirm your viewing appointment</li>
              <li>Fee is fully refundable if you proceed with booking the property</li>
              <li>Our agent will provide payment details when they contact you</li>
            </ul>
          </div>

          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: rgb(42, 39, 106); margin-top: 0;">📞 What Happens Next?</h3>
            <ul>
              <li>Our agent will contact you within 4 hours during business hours</li>
              <li>We'll confirm your preferred date and time or suggest alternatives</li>
              <li>Payment instructions for the ₦2,000 viewing fee will be provided</li>
              <li>You'll receive detailed directions and contact information after payment</li>
              <li>We'll be ready to answer all your questions during the viewing</li>
            </ul>
          </div>

          <p>If you need to make any changes or have urgent questions, please contact us:</p>
          <p>📧 Email: info@saphireapartments.ng<br>
          📱 Phone: +234 901 234 5678<br>
          💬 WhatsApp: +234 901 234 5678</p>

          <p>We look forward to showing you around this beautiful property!</p>
        </div>

        <div class="footer">
          <p>Best regards,<br><strong>The Saphire Apartments Team</strong></p>
          <p>Your trusted partner for luxury shortlet accommodations in Abuja.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminMailOptions = {
    from: `"Saphire Apartments Viewing System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `👁️ NEW VIEWING REQUEST - ${property.title} | ${viewingDetails.firstName} ${viewingDetails.lastName}`,
    html: adminEmailHtml,
  };

  const clientMailOptions = {
    from: `"Saphire Apartments" <${process.env.SMTP_USER}>`,
    to: viewingDetails.email,
    subject: `Viewing Request Received - ${property.title} | Saphire Apartments`,
    html: clientEmailHtml,
  };

  try {
    const [adminResult, clientResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    return {
      success: true,
      adminMessageId: adminResult.messageId,
      clientMessageId: clientResult.messageId
    };
  } catch (error) {
    console.error('Error sending viewing emails:', error);
    throw new Error('Failed to send viewing emails');
  }
};

// Email utility functions for booking system

export async function sendBookingConfirmationEmail({
  guestEmail,
  guestName,
  property,
  bookingDetails,
  bookingId
}) {
  // This is a placeholder - implement with your preferred email service
  // (Nodemailer, SendGrid, AWS SES, etc.)
  
  const emailData = {
    to: guestEmail,
    subject: `Booking Confirmation - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Booking Request Received</h2>
        <p>Dear ${guestName},</p>
        <p>Thank you for your booking request. We have received your request and will contact you shortly to confirm availability and payment details.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">Booking Details</h3>
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
          <p><strong>Nights:</strong> ${bookingDetails.numberOfNights}</p>
          <p><strong>Total Amount:</strong> ₦${bookingDetails.totalAmount.toLocaleString()}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        </div>
        
        <p>Our team will contact you within 24 hours to confirm your booking and provide payment instructions.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            Saphire Apartments Team
          </p>
        </div>
      </div>
    `
  };

  // Implement actual email sending here
  console.log('Sending guest confirmation email:', emailData);
  return true;
}

export async function sendBookingNotificationEmail({
  property,
  guestDetails,
  bookingDetails,
  bookingId
}) {
  // This is a placeholder - implement with your preferred email service
  
  const emailData = {
    to: 'admin@saphireapartments.com', // Replace with actual admin email
    subject: `New Booking Request - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">New Booking Request</h2>
        <p>A new booking request has been submitted through the website.</p>
        
        <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">Guest Information</h3>
          <p><strong>Name:</strong> ${guestDetails.firstName} ${guestDetails.lastName}</p>
          <p><strong>Email:</strong> ${guestDetails.email}</p>
          <p><strong>Phone:</strong> ${guestDetails.phone}</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #374151;">Booking Details</h3>
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${bookingDetails.guests}</p>
          <p><strong>Nights:</strong> ${bookingDetails.numberOfNights}</p>
          <p><strong>Total Amount:</strong> ₦${bookingDetails.totalAmount.toLocaleString()}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        </div>
        
        <div style="margin-top: 30px;">
          <p><strong>Action Required:</strong> Please review this booking request and contact the guest to confirm availability and payment details.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            This is an automated notification from the Saphire Apartments booking system.
          </p>
        </div>
      </div>
    `
  };

  // Implement actual email sending here
  console.log('Sending admin notification email:', emailData);
  return true;
}

// Send maintenance request confirmation email to requester
export const sendMaintenanceRequestConfirmationEmail = async (maintenanceData) => {
  const transporter = createTransporter();

  const {
    requesterEmail,
    requesterName,
    apartmentTitle,
    apartmentLocation,
    issueCategory,
    priority,
    title,
    description,
    requestId
  } = maintenanceData;

  // Priority colors for visual feedback
  const priorityColors = {
    'Low': '#28a745',
    'Medium': '#ffc107',
    'High': '#fd7e14',
    'Emergency': '#dc3545'
  };

  const priorityColor = priorityColors[priority] || '#6c757d';

  const confirmationEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Maintenance Request Confirmed - Saphire Apartments</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .request-details {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #ff6b35;
        }
        .detail-value {
          color: #6c757d;
          text-align: right;
          max-width: 60%;
        }
        .priority-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 12px;
          background-color: ${priorityColor};
        }
        .section-title {
          color: #ff6b35;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid #ffe5dc;
          padding-bottom: 5px;
        }
        .next-steps {
          background-color: #e8f5e8;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
        @media (max-width: 600px) {
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            margin-bottom: 5px;
          }
          .detail-value {
            text-align: left;
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔧 Maintenance Request Received</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We're on it!</p>
        </div>

        <div class="content">
          <h2 style="color: #ff6b35; margin-top: 0;">Dear ${requesterName},</h2>
          
          <p>Thank you for submitting your maintenance request. We have received your request and our maintenance team will review it promptly.</p>

          <div class="request-details">
            <h3 class="section-title">🏠 Request Details</h3>
            <div class="detail-row">
              <span class="detail-label">Request ID:</span>
              <span class="detail-value" style="font-family: monospace; color: #495057;">#${requestId.toString().slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property:</span>
              <span class="detail-value">${apartmentTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${apartmentLocation}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category:</span>
              <span class="detail-value">${issueCategory}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Priority:</span>
              <span class="detail-value">
                <span class="priority-badge">${priority}</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Issue:</span>
              <span class="detail-value">${title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">${new Date().toLocaleString('en-US', {
                timeZone: 'Africa/Lagos',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3 style="color: #155724; margin-top: 0;">📋 What Happens Next?</h3>
            <ul style="color: #155724; margin: 10px 0; padding-left: 20px;">
              <li><strong>Review:</strong> Our maintenance team will review your request within 24 hours</li>
              <li><strong>Contact:</strong> We'll contact you to schedule a convenient time for inspection/repair</li>
              <li><strong>Resolution:</strong> Our qualified technicians will address the issue promptly</li>
              <li><strong>Updates:</strong> You'll receive regular updates on the progress</li>
              <li><strong>Completion:</strong> We'll confirm when the work is completed to your satisfaction</li>
            </ul>
          </div>

          ${priority === 'Emergency' ? `
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #721c24; margin-top: 0;">🚨 Emergency Request</h4>
            <p style="color: #721c24; margin-bottom: 0;">
              We understand this is an emergency situation. Our team has been alerted and will prioritize your request. 
              If this is a life-threatening emergency, please contact emergency services immediately at 199.
            </p>
          </div>
          ` : ''}

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📞 Need Immediate Assistance?</h4>
            <p style="color: #856404; margin-bottom: 0;">
              If you have any questions about your request or need immediate assistance, please contact us:
            </p>
            <p style="color: #856404; margin: 10px 0 0 0;">
              📧 Email: maintenance@saphireapartments.ng<br>
              📱 Phone: +234 806 644 6777<br>
              💬 WhatsApp: +234 806 644 6777
            </p>
          </div>

          <p style="margin-top: 25px;">We appreciate your patience and look forward to resolving this issue quickly.</p>
          
          <p style="margin-top: 20px;">
            Best regards,<br>
            <strong>Saphire Apartments Maintenance Team</strong>
          </p>
        </div>

        <div class="footer">
          <p>This is an automated confirmation email. Please keep this email for your records.</p>
          <p>© ${new Date().getFullYear()} Saphire Apartments. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Saphire Apartments Maintenance" <${process.env.SMTP_USER}>`,
    to: requesterEmail,
    subject: `Maintenance Request Confirmed - ${title} | Saphire Apartments`,
    html: confirmationEmailHtml,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending maintenance confirmation email:', error);
    throw new Error('Failed to send maintenance confirmation email');
  }
};
