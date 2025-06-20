
import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const partners = [
  {
    name: "VetCare Plus",
    logo: "🏥",
    category: "Veterinary Services",
    rating: 4.9,
    testimonial: "MyPetID members get priority booking and 15% off all services. It's been a game-changer for our practice efficiency.",
    verified: true
  },
  {
    name: "PetNutrition Pro",
    logo: "🥘",
    category: "Premium Pet Food",
    rating: 4.8,
    testimonial: "We're proud to offer exclusive discounts to MyPetID members. Their commitment to pet health aligns perfectly with our values.",
    verified: true
  },
  {
    name: "TailWaggers Resort",
    logo: "🏨",
    category: "Pet Boarding",
    rating: 5.0,
    testimonial: "MyPetID's digital records make check-ins seamless. We offer special rates because we trust their platform completely.",
    verified: true
  },
  {
    name: "PawSpa Grooming",
    logo: "✂️",
    category: "Grooming Services",
    rating: 4.9,
    testimonial: "The detailed pet profiles help us provide better service. We're happy to extend member discounts.",
    verified: true
  }
];

const PartnerShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted Partner Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We carefully select partners who share our commitment to exceptional pet care and member value
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {partners.map((partner, index) => (
            <FadeIn key={partner.name} delay={index * 100}>
              <GlassCard className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{partner.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                      {partner.verified && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{partner.category}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(partner.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{partner.rating}</span>
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "{partner.testimonial}"
                </blockquote>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400}>
          <div className="text-center">
            <div className="inline-flex items-center gap-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Verified Partners</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PartnerShowcase;