
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const currentDeals = [
  {
    id: 1,
    partner: "PetCare Plus",
    title: "25% Off Premium Pet Food",
    description: "Save on premium brands including Royal Canin, Hill's Science Diet, and more",
    discount: "25% OFF",
    value: "Save up to $50",
    validUntil: "March 31, 2024",
    category: "Nutrition",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 2,
    partner: "VetCheck Network",
    title: "Free Annual Health Screening",
    description: "Complimentary comprehensive health check at participating veterinary clinics",
    discount: "FREE",
    value: "Worth $150",
    validUntil: "April 15, 2024",
    category: "Healthcare",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    partner: "PetStay Hotels",
    title: "30% Off Pet Boarding",
    description: "Luxury boarding services with 24/7 care and daily updates",
    discount: "30% OFF",
    value: "Save up to $120",
    validUntil: "May 10, 2024",
    category: "Boarding",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    partner: "ToyBox Pets",
    title: "Buy 2 Get 1 Free Toys",
    description: "Premium interactive toys and enrichment products for all pet types",
    discount: "BOGO",
    value: "Save up to $30",
    validUntil: "March 25, 2024",
    category: "Toys & Enrichment",
    color: "from-orange-500 to-red-500"
  }
];

const PartnerDealsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextDeal = () => {
    setCurrentIndex((prev) => (prev + 1) % currentDeals.length);
  };

  const prevDeal = () => {
    setCurrentIndex((prev) => (prev - 1 + currentDeals.length) % currentDeals.length);
  };

  const currentDeal = currentDeals[currentIndex];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Exclusive Deals
            </h2>
            <p className="text-xl text-gray-600">
              Limited-time offers rotating monthly
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <FadeIn key={currentDeal.id} delay={100}>
            <GlassCard className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50/80">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Deal Content */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {currentDeal.category}
                    </span>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Limited Time</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {currentDeal.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-lg">
                    {currentDeal.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${currentDeal.color} text-white font-bold text-lg`}>
                      {currentDeal.discount}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valid until {currentDeal.validUntil}
                    </div>
                  </div>
                  
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Claim This Deal
                  </Button>
                </div>

                {/* Deal Visual */}
                <div className="relative">
                  <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${currentDeal.color} flex items-center justify-center shadow-xl`}>
                    <div className="text-center text-white">
                      <Percent className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <div className="text-3xl font-bold mb-2">{currentDeal.value}</div>
                      <div className="text-lg opacity-90">with {currentDeal.partner}</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeIn>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevDeal}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-2">
              {currentDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextDeal}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerDealsCarousel;