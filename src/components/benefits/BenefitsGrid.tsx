
import React from 'react';
import { DollarSign, Crown, Heart, Shield } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const benefitCategories = [
  {
    icon: DollarSign,
    title: "Financial Savings",
    description: "Access exclusive discounts and deals that save you money on pet care essentials",
    benefits: [
      "Up to 30% off premium pet food",
      "Discounted veterinary services",
      "Special pricing on medications",
      "Reduced boarding and grooming costs"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Crown,
    title: "Exclusive Access",
    description: "Get early access to new products and premium features before anyone else",
    benefits: [
      "Early product launches",
      "Beta feature testing",
      "Priority customer support",
      "Members-only events"
    ],
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: Heart,
    title: "Enhanced Care",
    description: "Access to premium services and resources for better pet health and wellness",
    benefits: [
      "Free health consultations",
      "Priority booking at clinics",
      "Specialized diet planning",
      "Emergency care discounts"
    ],
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Shield,
    title: "Partner Network",
    description: "Connect with our trusted network of verified pet care professionals",
    benefits: [
      "Vetted service providers",
      "Quality guarantees",
      "Nationwide coverage",
      "24/7 support network"
    ],
    color: "from-blue-500 to-cyan-500"
  }
];

const BenefitsGrid: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Member Benefit Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the full range of exclusive benefits available to MyPetID members across different categories
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {benefitCategories.map((category, index) => (
            <FadeIn key={category.title} delay={index * 100}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`} />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;