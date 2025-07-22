export default function WhyChooseUs() {
  const features = [
    {
      title: "Expert Guidance",
      description: "Our experienced team provides personalized guidance throughout your property journey.",
      icon: "🏆"
    },
    {
      title: "Prime Locations",
      description: "Access to the most sought-after properties in Nigeria's premier destinations.",
      icon: "📍"
    },
    {
      title: "Trusted Partnership",
      description: "Building lasting relationships through transparency and professional excellence.",
      icon: "🤝"
    },
    {
      title: "Investment Value",
      description: "Properties selected for their strong potential for appreciation and returns.",
      icon: "💎"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4 md:mb-6">
              Why Choose<br />
              <span className="text-purple-secondary">Saphire Apartments?</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md mx-auto lg:mx-0">
              We combine local expertise with international standards to deliver 
              exceptional real estate experiences that exceed expectations.
            </p>
            <button className="bg-purple-gradient text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-purple-secondary transition-colors shadow-md text-sm md:text-base">
              Learn More About Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 lg:mt-0">
            {features.map((feature, index) => (
              <div key={index} className="p-4 md:p-6 rounded-2xl bg-purple-lighter hover:bg-purple-light hover:text-white transition-all duration-200 shadow-sm text-center sm:text-left">
                <div className="text-2xl md:text-3xl mb-3 md:mb-4">{feature.icon}</div>
                <h3 className="text-base md:text-lg font-semibold text-purple-primary mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
