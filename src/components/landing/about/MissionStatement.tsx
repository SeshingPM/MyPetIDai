
import React from 'react';
import { Target, Heart, Globe, Shield } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const MissionStatement: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: "Pet-Centric Innovation",
      description: "Every feature we build starts with one question: How does this improve a pet's life? Our My Pet ID System puts your furry family member at the center of everything."
    },
    {
      icon: Shield,
      title: "Security & Privacy First",
      description: "Your pet's digital identity deserves the highest protection. We use bank-level encryption and never compromise on privacy or data security."
    },
    {
      icon: Globe,
      title: "Universal Accessibility",
      description: "Pet care shouldn't be limited by geography or financial barriers. Our platform works globally and remains completely free for pet owners."
    },
    {
      icon: Target,
      title: "Continuous Improvement",
      description: "We listen to our community of pet owners and continuously evolve our My Pet ID platform based on real-world needs and feedback."
    }
  ];

  return (
    <section className="py-12 lg:py-16">
      <div className="container-max">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Mission & Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to creating the most comprehensive and user-friendly digital pet identity platform, 
              making pet care management accessible to everyone while maintaining the highest standards of security and reliability.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <FadeIn key={value.title} delay={index * 100}>
              <div className="flex items-start space-x-4 p-6 rounded-xl bg-gradient-to-br from-white to-blue-50/30 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;