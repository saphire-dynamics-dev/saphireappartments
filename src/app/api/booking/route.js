import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BookingRequest from "@/models/BookingRequest";
import Apartment from "@/models/Apartment";
import cloudinary from "@/lib/cloudinary";
import {
  sendBookingConfirmationEmail,
  sendBookingNotificationEmail,
} from "@/lib/email";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    // Extract form data
    const property = JSON.parse(formData.get("property"));
    const bookingDetails = JSON.parse(formData.get("bookingDetails"));
    const personalDetails = JSON.parse(formData.get("personalDetails"));
    const emergencyContact = JSON.parse(formData.get("emergencyContact"));
    const paymentMethod = formData.get("paymentMethod") || "online"; // Default to online payment
    const ninImage = formData.get("ninImage");

    // Validate required fields
    if (!property || !bookingDetails || !personalDetails) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking information",
        },
        { status: 400 }
      );
    }

    // Validate booking details
    const { checkInDate, checkOutDate, guests } = bookingDetails;
    const { firstName, lastName, email, phone } = personalDetails;

    if (
      !checkInDate ||
      !checkOutDate ||
      !guests ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Validate emergency contact
    if (
      !emergencyContact ||
      !emergencyContact.name ||
      !emergencyContact.phone ||
      !emergencyContact.relationship
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Emergency contact information is required",
        },
        { status: 400 }
      );
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return NextResponse.json(
        {
          success: false,
          error: "Check-in date cannot be in the past",
        },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        {
          success: false,
          error: "Check-out date must be after check-in date",
        },
        { status: 400 }
      );
    }

    // Calculate booking details
    const diffTime = checkOut - checkIn;
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerNight = parseInt(property.price.replace(/[^\d]/g, ""));
    const totalAmount = numberOfNights * pricePerNight;

    let ninImageData = null;

    // Upload NIN image to Cloudinary if provided
    console.log('NIN Image:', ninImage.size);
    if (ninImage && ninImage.size > 0) {
      try {
        const bytes = await ninImage.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "saphire-apartments/nin-documents",
                resource_type: "image",
                transformation: [
                  { quality: "auto:good" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
                if (error) console.log("Cloudinary upload error:", error);
              }
            )
            .end(buffer);
        });

        ninImageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };

        console.log("NIN image uploaded successfully:", uploadResult.public_id);
      } catch (uploadError) {
        console.error("Error uploading NIN image:", uploadError);
        // Continue without NIN image if upload fails
      }
    }

    // Create booking request with emergency contact
    const bookingRequest = new BookingRequest({
      property: property._id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      guestDetails: {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        email: personalDetails.email,
        phone: personalDetails.phone,
        nin: personalDetails.nin || undefined,
        ninImage: ninImageData,
      },
      emergencyContact: {
        name: emergencyContact.name,
        phone: emergencyContact.phone,
        relationship: emergencyContact.relationship,
      },
      bookingDetails: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        numberOfNights,
        pricePerNight,
        totalAmount,
      },
      source: "Website",
      // Add payment method to admin notes
      adminNotes:
        paymentMethod === "bank_transfer"
          ? "Payment method: Bank Transfer - Awaiting confirmation"
          : undefined,
    });

    // Save booking request
    const savedBookingRequest = await bookingRequest.save();

    // Add initial communication log
    const paymentNote =
      paymentMethod === "bank_transfer"
        ? "Booking request submitted via website with bank transfer payment - awaiting payment confirmation"
        : "Booking request submitted via website";

    await savedBookingRequest.addCommunication("Note", paymentNote, "System");

    // Send emails based on payment method
    try {
      // Regular booking confirmation email
      await sendBookingConfirmationEmail({
        guestEmail: email,
        guestName: `${firstName} ${lastName}`,
        property,
        bookingDetails: {
          checkInDate,
          checkOutDate,
          guests,
          numberOfNights,
          totalAmount,
        },
        bookingId: savedBookingRequest._id,
      });

      // Log email sent
      await savedBookingRequest.addCommunication(
        "Email",
        paymentMethod === "bank_transfer"
          ? "Bank transfer booking notification email sent"
          : "Booking confirmation email sent to guest",
        "System"
      );
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    // Send notification email to admin
    try {
      await sendBookingNotificationEmail({
        property,
        guestDetails: personalDetails,
        bookingDetails: {
          checkInDate,
          checkOutDate,
          guests,
          numberOfNights,
          totalAmount,
        },
        bookingId: savedBookingRequest._id,
      });

      // Log admin notification
      await savedBookingRequest.addCommunication(
        "Email",
        "Booking notification email sent to admin",
        "System"
      );
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message:
        paymentMethod === "bank_transfer"
          ? "Booking request submitted successfully. Please confirm your payment on WhatsApp."
          : "Booking request submitted successfully",
      data: {
        bookingId: savedBookingRequest._id,
        status: savedBookingRequest.status,
        totalAmount,
        ninImageUploaded: !!ninImageData,
        paymentMethod: paymentMethod,
      },
    });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit booking request",
      },
      { status: 500 }
    );
  }
}
