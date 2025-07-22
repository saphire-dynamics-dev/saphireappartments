import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-purple-lighter">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 md:w-8 md:h-8 relative">
                <Image
                  src="/saphireapartmentlogo.jpeg"
                  alt="Saphire Apartments Logo"
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
              <span className="text-lg md:text-xl font-semibold text-purple-primary">Saphire Apartments</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md text-sm md:text-base">
              Your trusted partner in finding the perfect home in Nigeria. 
              We combine expertise with passion to deliver exceptional real estate experiences.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-purple-lighter rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group">
                <Facebook size={18} className="text-purple-primary group-hover:text-white" />
              </div>
              <div className="w-10 h-10 bg-purple-lighter rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group">
                <Linkedin size={18} className="text-purple-primary group-hover:text-white" />
              </div>
              <div className="w-10 h-10 bg-purple-lighter rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group">
                <Instagram size={18} className="text-purple-primary group-hover:text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-purple-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-purple-primary transition-colors text-sm md:text-base">Home</Link></li>
              <li><Link href="/properties" className="text-gray-600 hover:text-purple-primary transition-colors text-sm md:text-base">Properties</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-purple-primary transition-colors text-sm md:text-base">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-purple-primary mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600 text-sm md:text-base">
              <li>Abuja, Nigeria</li>
              <li>+234 901 234 5678</li>
              <li>info@saphireapartments.ng</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-lighter mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs md:text-sm">
            ©2025 Saphire Apartments. All rights reserved.
          </p>
          <div className="flex space-x-4 md:space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-600 text-xs md:text-sm hover:text-purple-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 text-xs md:text-sm hover:text-purple-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
