import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Apartment from "../../../models/Apartment";

export async function GET() {
  try {
    await connectDB();

    const apartments = await Apartment.find({
      images: { $exists: true, $ne: [] },
    }).select("title location type images");

    const galleryImages = apartments.flatMap((apartment) =>
      apartment.images.map((image) => ({
        image,
        apartmentId: apartment._id,
        title: apartment.title,
        location: apartment.location,
        type: apartment.type,
      }))
    );

    // Randomize gallery order
    galleryImages.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      data: galleryImages,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery images",
      },
      { status: 500 }
    );
  }
}