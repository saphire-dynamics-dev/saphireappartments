import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Phone, Mail, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  const getEmailSubject = () => {
    return encodeURIComponent('Inquiry about Saphire Apartments Services');
  };

  const getEmailBody = () => {
    return encodeURIComponent(`Hello Saphire Apartments Team,

I hope this email finds you well. I am reaching out to inquire about your accommodation services.

[Please describe your inquiry here - e.g., property availability, booking information, pricing, etc.]

I would appreciate any information you can provide and look forward to hearing from you soon.

Best regards,
[Your Name]
[Your Phone Number]
[Preferred contact method]`);
  };

  return (
    <footer className="bg-purple-primary text-white">
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
              <span className="text-lg md:text-xl font-semibold">Saphire Apartments</span>
            </div>
            <p className="text-gray-200 mb-6 max-w-md text-sm md:text-base">
              Your trusted partner in finding the perfect home in Nigeria. 
              We combine expertise with passion to deliver exceptional real estate experiences.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-purple-darker rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group"
              >
                <Facebook size={18} className="text-white group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-purple-darker rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group"
              >
                <Linkedin size={18} className="text-white group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-purple-darker rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group"
              >
                <Instagram size={18} className="text-white group-hover:text-white" />
              </a>
              <a 
                href="https://www.tiktok.com/@saphireapartments2" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-purple-darker rounded-full flex items-center justify-center hover:bg-purple-light hover:text-white cursor-pointer transition-colors group"
              >
                <svg className="w-5 h-5 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-200 hover:text-purple-lighter transition-colors text-sm md:text-base">Home</Link></li>
              <li><Link href="/properties" className="text-gray-200 hover:text-purple-lighter transition-colors text-sm md:text-base">Properties</Link></li>
              <li><Link href="/about" className="text-gray-200 hover:text-purple-lighter transition-colors text-sm md:text-base">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} />
                <a 
                  href="tel:+2348066446777" 
                  className="hover:text-purple-lighter transition-colors"
                >
                  +234 806 644 6777
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} />
                <a 
                  href={`mailto:saphireapartments2@gmail.com?subject=${getEmailSubject()}&body=${getEmailBody()}`}
                  className="hover:text-purple-lighter transition-colors"
                >
                  saphireapartments2@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle size={18} />
                <a 
                  href="https://wa.me/2348066446777?text=Hello%21%20I%27m%20interested%20in%20Saphire%20Apartments%20and%20would%20like%20to%20know%20more%20about%20your%20services.%20Thank%20you%21" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-lighter transition-colors"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} />
                <span>Abuja, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-lighter mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-200 text-xs md:text-sm">
            ©2025 Saphire Apartments. All rights reserved.
          </p>
          <div className="flex space-x-4 md:space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-200 text-xs md:text-sm hover:text-purple-lighter transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-200 text-xs md:text-sm hover:text-purple-lighter transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
