
import React from 'react';
import { Gift, Sparkles, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';

const BenefitsHero: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <FadeIn>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Unlock Exclusive
                </span>
                <br />
                Partner Deals & Savings
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                <span className="text-gray-700">Access </span>
                <span className="text-purple-600 font-semibold">rotating exclusive deals</span>
                <span className="text-gray-700"> and </span>
                <span className="text-blue-600 font-semibold">discounts</span>
                <span className="text-gray-700"> from our carefully selected partners.</span>
                <br />
                <span className="text-emerald-600 font-semibold">Save on pet care, products, and services</span>
                <span className="text-gray-700"> - available only to </span>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">MyPetID members</span>
                <span className="text-gray-700">.</span>
              </p>

              {/* CTA Button Section */}
              <div className="mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg">
                  <Link to="/onboarding" className="flex items-center gap-2">
                    Start your profile to claim your deals
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

              {/* Exclusive Member Benefits Header - moved under CTA */}
              <div className="flex items-center gap-2 mb-6">
                <Gift className="w-8 h-8 text-purple-600" />
                <span className="text-purple-600 font-semibold text-lg">Exclusive Member Benefits</span>
              </div>
            </div>
          </FadeIn>

          {/* Right Content - Feature Cards */}
          <FadeIn delay={200}>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Rotating Offers</h3>
                    <p className="text-sm text-gray-600">New exclusive deals added monthly with fresh savings opportunities</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Select Partners</h3>
                    <p className="text-sm text-gray-600">Carefully vetted partners offering premium products and services</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Member Exclusive</h3>
                    <p className="text-sm text-gray-600">Benefits available only to MyPetID community members</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default BenefitsHero;