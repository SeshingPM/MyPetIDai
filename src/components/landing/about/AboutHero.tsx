
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const AboutHero: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-40" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container-max relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl mb-6">
              <Heart className="w-8 h-8" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionizing Pet Care with
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Digital Pet Identity
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              MyPetID was born from a simple belief: every pet deserves a permanent digital identity 
              that travels with them throughout their lifetime. We're creating the world's first comprehensive 
              My Pet ID System that gives your furry family members the recognition and care management they deserve.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/60 border border-blue-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600 text-center">
                  Bank-level encryption protects your pet's My Pet ID and all associated data
                </p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/60 border border-blue-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Pet-First Design</h3>
                <p className="text-sm text-gray-600 text-center">
                  Every feature built with your pet's health and safety as the top priority
                </p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/60 border border-blue-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600 text-center">
                  Built by pet owners, for pet owners, with continuous community feedback
                </p>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg">
              <Link to="/onboarding" className="flex items-center gap-2">
                Start Creating Pet Identities
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;