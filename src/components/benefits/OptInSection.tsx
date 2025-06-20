
import React from 'react';
import { CheckCircle, Users, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const steps = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up for MyPetID and add your pet's information",
    icon: Users
  },
  {
    step: 2,
    title: "Opt-In to Benefits",
    description: "Choose to participate in our partner benefits program",
    icon: CheckCircle
  },
  {
    step: 3,
    title: "Start Saving",
    description: "Access exclusive deals and start saving immediately",
    icon: Gift
  }
];

const OptInSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Access Your Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with exclusive member benefits is simple and takes just minutes
            </p>
          </div>
        </FadeIn>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <FadeIn key={step.step} delay={index * 100}>
              <div className="relative">
                <GlassCard className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </GlassCard>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Benefits Overview */}
        <FadeIn delay={300}>
          <GlassCard className="p-8 bg-gradient-to-r from-white to-blue-50/80 border-blue-200/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  What You Get as a Member
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Exclusive partner discounts up to 30% off</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Priority access to new deals and offers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Monthly rotating exclusive opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Free to join with no hidden fees</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                  <div className="text-4xl font-bold mb-2">$500+</div>
                  <div className="text-lg opacity-90">Average Annual Savings</div>
                  <div className="text-sm opacity-75 mt-2">Based on member usage data</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6">
                <Link to="/onboarding">
                  Join Now & Start Saving
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
};

export default OptInSection;