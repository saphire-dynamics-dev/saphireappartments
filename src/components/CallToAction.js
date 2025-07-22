import Image from "next/image";

export default function CallToAction() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-purple-gradient opacity-90"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
          Ready to Find Your<br />
          Dream Home?
        </h2>
        <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          Let our experts guide you to the perfect property that matches your lifestyle and investment goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <button className="bg-white text-purple-primary px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:bg-purple-lighter transition-colors duration-200 shadow-md text-sm md:text-base">
            Schedule Consultation
          </button>
          <button className="border-2 border-white text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:bg-white hover:text-purple-primary transition-colors duration-200 text-sm md:text-base">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
}
