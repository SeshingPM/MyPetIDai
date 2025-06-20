import React from 'react';
import { FileText, Bell, Shield, Smartphone, IdCard, Share2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import FeatureCard from './FeatureCard';

// Updated features for My Pet ID/digital identity focus
const features = [
  {
    icon: IdCard,
    title: "Unique Pet Identity",
    description: "🆔 Assign your pet a unique My Pet ID number to simplify ownership verification, medical tracking, and profile sharing.",
    color: "bg-pet-purple",
    gradient: "from-purple-300 to-indigo-400"
  },
  {
    icon: FileText,
    title: "Document Storage",
    description: "Securely store vaccination records, medical history, and important documents linked to your pet's digital identity. Never lose critical information again.",
    color: "bg-pet-green",
    gradient: "from-emerald-300 to-teal-400"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Set and receive timely reminders for vet appointments, medication schedules, vaccinations, and grooming sessions tied to your My Pet ID.",
    color: "bg-pet-blue",
    gradient: "from-blue-300 to-cyan-400"
  },
  {
    icon: Shield,
    title: "Verified Access",
    description: "Your pet's digital identity is protected with bank-level encryption. Control exactly who can access which details of their profile.",
    color: "bg-pet-orange",
    gradient: "from-orange-300 to-amber-400"
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Access your pet's complete digital identity from anywhere through our responsive web interface. Share My Pet ID instantly when needed.",
    color: "bg-pet-yellow",
    gradient: "from-amber-300 to-yellow-400"
  },
  {
    icon: Share2,
    title: "Identity Sharing",
    description: "Share your pet's verified digital identity with veterinarians, pet sitters, or boarding facilities using their unique My Pet ID.",
    color: "bg-pet-purple",
    gradient: "from-indigo-300 to-violet-400"
  }
];

const HomeFeatureCards: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50/60 to-indigo-50/40 relative">
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="container-max relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent 
              drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] relative z-10">
                Everything you need for your pet's digital identity
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-lg text-gray-600 mb-6">
              MyPetID provides a comprehensive suite of tools to create and manage your pet's unique digital identity, 
              complete with My Pet ID for streamlined verification and record management.
            </p>
          </FadeIn>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <li key={feature.title}>
              <FadeIn delay={100 + index * 50} direction="up">
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                  color={feature.color} 
                  gradient={feature.gradient}
                />
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeFeatureCards;