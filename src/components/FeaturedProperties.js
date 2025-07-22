import Image from "next/image";
import Link from "next/link";
import propertiesData from "../data/properties.json";

export default function FeaturedProperties() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-primary mb-4">
            Featured <span className="text-purple-secondary">Shortlets</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Experience luxury living in our premium shortlet apartments at Stargate Estate, Durumi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {propertiesData.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 md:h-64">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="bg-purple-gradient text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                    {property.type}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-purple-primary mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3 md:mb-4">{property.location}</p>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl font-bold text-purple-secondary">{property.price}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 md:mb-4">
                  <span>{property.bedrooms} bed</span>
                  <span>{property.bathrooms} bath</span>
                  <span>{property.area}</span>
                </div>
                <Link href={`/properties/${property.id}`} className="w-full bg-purple-gradient text-white py-2 px-4 rounded-lg hover:bg-purple-secondary transition-colors font-medium text-sm shadow-md block text-center">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
