
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery");
        const result = await response.json();

        if (result.success) {
          setImages(result.data);
        }
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const filteredImages =
    activeFilter === "All"
      ? images
      : images.filter((item) => item.type === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-purple-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-primary via-purple-secondary to-purple-primary opacity-95" />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-6 py-24 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-light">
              Saphire Apartments
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Our
              <span className="block text-purple-light">
                Gallery
              </span>
            </h1>

            <div className="mt-6 h-1 w-20 bg-purple-light" />

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              Take a look at some of the beautiful spaces and properties
              available through Saphire Apartments.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">
        {/* Heading */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-primary">
              Explore
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Spaces That Inspire
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Explore our collection of apartments and discover your next
              perfect space.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Shortlet", "Rental", "Sale"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-purple-gradient text-white shadow-lg"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-purple-primary hover:text-purple-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredImages.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-gray-50">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                No images available
              </h3>

              <p className="mt-2 text-gray-500">
                Check back soon for new properties.
              </p>
            </div>
          </div>
        )}

        {/* Masonry-style gallery */}
        {!loading && filteredImages.length > 0 && (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredImages.map((item, index) => (
              <div
                key={`${item.apartmentId}-${index}`}
                className="group mb-5 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="relative block w-full overflow-hidden rounded-2xl bg-gray-100 text-left shadow-sm"
                >
                  <Image
                    src={item.image}
                    alt={item.title || "Saphire Apartments property"}
                    width={900}
                    height={700}
                    className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-white/70">
                      {item.location}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-purple-gradient px-8 py-14 text-center md:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            Find Your Space
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Ready to find your perfect apartment?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Explore our available properties and find a space that feels
            right for you.
          </p>

          <Link
            href="/properties"
            className="mt-8 inline-flex rounded-lg bg-white px-7 py-3 font-semibold text-purple-primary transition hover:scale-105"
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Close image"
          >
            ×
          </button>

          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.image}
              alt={selectedImage.title || "Property image"}
              width={1400}
              height={1000}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />

            <div className="mt-3 text-center">
              <p className="font-semibold text-white">
                {selectedImage.title}
              </p>

              <p className="text-sm text-white/60">
                {selectedImage.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
