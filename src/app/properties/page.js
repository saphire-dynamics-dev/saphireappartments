import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import propertiesData from "../../data/properties.json";

export default function Properties() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Apartments"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Premium <span className="text-purple-light">Shortlets</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
              Experience luxury living in our fully furnished apartments at Stargate Estate, Durumi
            </p>
          </div>
        </div>
      </div>

      {/* Properties Blog Section */}
      <div className="py-8 md:py-16">
        <div className="w-[98vw] max-w-[98vw] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {propertiesData.map((property, index) => (
              <article key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-40 md:h-48 lg:h-56">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-gradient text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                      {property.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-purple-primary mb-1 md:mb-2">{property.title}</h2>
                      <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">{property.location}</p>
                      <div className="text-xl md:text-2xl font-bold text-purple-secondary">{property.price}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-xs md:text-sm line-clamp-3">
                    {property.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-black">{property.bedrooms}</div>
                      <div className="text-xs text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-black">{property.bathrooms}</div>
                      <div className="text-xs text-gray-600">Bathrooms</div>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h3 className="text-sm font-semibold text-black mb-2">Key Features</h3>
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 4 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          +{property.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/properties/${property.id}`} className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-colors font-medium text-sm shadow-md text-center">
                      Book Now
                    </Link>
                    <button className="w-full border-2 border-purple-primary text-purple-primary py-2 px-4 rounded-lg hover:bg-purple-primary hover:text-white transition-colors font-medium text-sm">
                      Schedule Viewing
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
