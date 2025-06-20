
import React from 'react';
import { Shield, Heart, Share2, FileText, Globe, Smartphone } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const PetIdentitySection: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Complete Records",
      description: "Store all medical history, vaccination certificates, insurance documents, and vet records in one secure digital vault. Never lose important paperwork again and access everything instantly when you need it most.",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      accentColor: "border-purple-200"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your pet's complete profile with veterinarians, pet sitters, boarding facilities, or family members using your unique My Pet ID. Grant temporary or permanent access with just a few clicks.",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      accentColor: "border-orange-200"
    },
    {
      icon: Globe,
      title: "Lifetime Portability",
      description: "Your pet's digital identity travels with you anywhere in the world. Whether you're moving cities, changing vets, or traveling internationally, your pet's complete history is always accessible.",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      accentColor: "border-blue-200"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Access your pet's complete profile from any smartphone, tablet, or computer. Get instant access to vaccination records, medication schedules, and emergency contacts whenever you need them.",
      color: "bg-cyan-500",
      lightColor: "bg-cyan-50",
      accentColor: "border-cyan-200"
    }
  ];

  return (
    <section className="py-6 lg:py-8 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-40" aria-hidden="true">
        <div className="absolute top-0 -left-16 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:pr-6">
            <FadeIn delay={200}>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                Every pet deserves a unique digital identity. With MyPetID, your pet gets their own 
                <span className="font-semibold text-blue-600"> My Pet ID</span> — a secure, permanent identifier 
                that simplifies ownership verification, medical records, and profile sharing for their entire lifetime.
              </p>
            </FadeIn>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="lg:pl-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <FadeIn key={feature.title} delay={200 + index * 100} direction="up">
                    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {/* Top accent bar */}
                      <div className={`h-1 w-full ${feature.color}`}></div>
                      
                      {/* Card content */}
                      <div className="p-4">
                        {/* Icon container with floating effect */}
                        <div className="relative mb-3">
                          <div className={`inline-flex p-2.5 rounded-xl ${feature.lightColor} ${feature.accentColor} border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`h-5 w-5 text-gray-700`} strokeWidth={1.5} />
                          </div>
                          {/* Floating dot indicator */}
                          <div className={`absolute -top-1 -right-1 w-3 h-3 ${feature.color} rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300`}></div>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm group-hover:text-blue-700 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Subtle gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.lightColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
                      
                      {/* Bottom highlight line */}
                      <div className={`absolute bottom-0 left-0 w-0 h-0.5 ${feature.color} group-hover:w-full transition-all duration-500 ease-out`}></div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetIdentitySection;