
import React from 'react';
import { Check, Zap, Shield, Clock } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const valueProps = [
  {
    icon: Zap,
    title: "Instant Access",
    value: "60 seconds",
    description: "Get your pet's complete medical history to any vet in under a minute",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Never Lose Documents",
    value: "100% Secure",
    description: "Bank-level encryption ensures your pet's records are always safe and accessible",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Clock,
    title: "Time Saved",
    value: "45 min/visit",
    description: "Skip the paperwork and waiting - vets get everything they need instantly",
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: Check,
    title: "Money Saved",
    value: "$847/year",
    description: "Prevent costly health issues with smart reminders and complete medical tracking",
    color: "from-amber-500 to-orange-500"
  }
];

const FeatureValueGrid: React.FC = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Why Thousands of Pet Parents Choose MyPetID
            </h2>
            <p className="text-gray-600 text-lg">
              Real benefits that make a difference in your pet's care
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {valueProps.map((prop, index) => (
            <FadeIn key={prop.title} delay={index * 100}>
              <GlassCard className="p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${prop.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <prop.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${prop.color} bg-clip-text text-transparent mb-2`}>
                  {prop.value}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureValueGrid;