
import React from 'react';
import { Users, Heart, Award, Globe } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const SocialProofStrip: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Pet Owners",
      description: "Trust MyPetID with their pets' digital identities"
    },
    {
      icon: Heart,
      value: "125,000+",
      label: "My Pet IDs",
      description: "Created for beloved pets worldwide"
    },
    {
      icon: Award,
      value: "2,500+",
      label: "Veterinarians",
      description: "Recommend our digital identity platform"
    },
    {
      icon: Globe,
      value: "65+",
      label: "Countries",
      description: "Where pets have MyPetID digital identities"
    }
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container-max relative z-10">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Join the Digital Pet Identity Revolution
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Thousands of pet families worldwide trust MyPetID for their pets' digital identity management
            </p>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 100}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-white mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-blue-100 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-blue-200 leading-snug">
                  {stat.description}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofStrip;