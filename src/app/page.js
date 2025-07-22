import Image from "next/image";
import Navbar from "../components/Navbar";
import FeaturedProperties from "../components/FeaturedProperties";
import WhyChooseUs from "../components/WhyChooseUs";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/apartmentimg1.png"
            alt="Modern Architecture"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 px-4 md:px-6 pt-16 h-full">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-4 md:pt-8">
              {/* Left Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Beautiful And<br />
                  <span className="text-purple-light">Stunning</span> Properties in<br />
                  Nigeria
                </h1>
              </div>

              {/* Right Content */}
              <div className="lg:mt-16 flex flex-col justify-between h-full">
                <div>
                  <p className="text-white/90 text-sm leading-relaxed mb-4 md:mb-8 max-w-md">
                    With expert guidance and a deep understanding of Nigeria's real estate
                    landscape, we're here to help turn the key to a home that's perfect for you.
                  </p>
                </div>
                
                {/* Copyright text */}
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-white/70">
                    ©2024 SAPHIRE APARTMENTS ALL<br />
                    RIGHT RESERVED
                  </p>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <div className="pb-4 md:pb-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-purple-lighter">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
                  {/* Looking For */}
                  <div>
                    <label className="block text-sm font-medium text-purple-primary mb-2 md:mb-3">
                      Looking For
                    </label>
                    <input
                      type="text"
                      placeholder="What to look for ?"
                      className="w-full px-0 py-2 md:py-3 border-0 border-b-2 border-purple-lighter focus:border-purple-primary focus:outline-none text-sm bg-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-purple-primary mb-2 md:mb-3">
                      Type
                    </label>
                    <select className="w-full px-0 py-2 md:py-3 border-0 border-b-2 border-purple-lighter focus:border-purple-primary focus:outline-none text-sm text-gray-600 bg-transparent appearance-none cursor-pointer">
                      <option>Property Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Penthouse</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-purple-primary mb-2 md:mb-3">
                      Price
                    </label>
                    <select className="w-full px-0 py-2 md:py-3 border-0 border-b-2 border-purple-lighter focus:border-purple-primary focus:outline-none text-sm text-gray-600 bg-transparent appearance-none cursor-pointer">
                      <option>Price</option>
                      <option>Under $100k</option>
                      <option>$100k - $300k</option>
                      <option>$300k - $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M+</option>
                    </select>
                  </div>

                  {/* Location & Search */}
                  <div>
                    <label className="block text-sm font-medium text-purple-primary mb-2 md:mb-3">
                      Location
                    </label>
                    <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-4">
                      <select className="w-full md:flex-1 px-0 py-2 md:py-3 border-0 border-b-2 border-purple-lighter focus:border-purple-primary focus:outline-none text-sm text-gray-600 bg-transparent appearance-none cursor-pointer">
                        <option>All Cities</option>
                        <option>Lagos</option>
                        <option>Abuja</option>
                        <option>Port Harcourt</option>
                        <option>Kano</option>
                        <option>Ibadan</option>
                      </select>
                      <button className="w-full md:w-auto bg-purple-gradient text-white px-6 md:px-8 py-2 md:py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-secondary transition-colors duration-200 font-medium shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-sm">Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedProperties />
      <WhyChooseUs />
      <CallToAction />
      <Footer />
    </div>
  );
}
