
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Heart, Zap, Check } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const HeroContent: React.FC = () => {
  return (
    <div className="container-max relative z-10">
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 items-center min-h-[80vh] py-4">
        {/* Content Section - Left Side */}
        <div className="lg:col-span-3 text-center lg:text-left order-1 lg:order-1">
          {/* Power Headline */}
          <FadeIn delay={100}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-2">
              Give Your Pet a{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Digital Identity
              </span>
              {' '}for Life
            </h1>
          </FadeIn>

          {/* Value Proposition */}
          <FadeIn delay={200}>
            <p className="text-lg md:text-xl text-gray-700 mb-2 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Create your pet's unique <strong>Pet ID</strong> and permanent digital profile. 
              Secure document storage, health record management, and easy sharing — 
              <span className="text-green-600 font-semibold"> completely free for pet owners.</span>
            </p>
          </FadeIn>

          {/* Primary CTA with No Credit Card Required text above it */}
          <FadeIn delay={300}>
            <div className="mb-2 flex flex-col items-center lg:items-start">
              {/* No Credit Card Required - Centered above CTA with green check */}
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-sm text-gray-500">
                  No credit card required
                </p>
              </div>
              
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/onboarding" className="flex items-center gap-3">
                  Create Free Pet ID Now
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          {/* Social Proof - Below CTA */}
          <FadeIn delay={350}>
            <div className="mb-3 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-green-200/60 shadow-sm">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    S
                  </div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    J
                  </div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    +
                  </div>
                </div>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-sm">
                  <span className="text-green-600 font-semibold">47 pet owners</span>
                  <span className="text-gray-600 ml-1">joined today</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Key Benefits */}
          <FadeIn delay={400}>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <span>Unique Pet ID</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-green-600" />
                </div>
                <span>Secure Health Vault</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-purple-600" />
                </div>
                <span>Instant Sharing</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Dog Image Section - Right Side */}
        <div className="lg:col-span-2 order-2 lg:order-2">
          <FadeIn delay={600}>
            <div className="relative">
              {/* Dog Image Container */}
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-soft border border-blue-100/50">
                {/* Happy Dog Image */}
                <div className="aspect-square rounded-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80" 
                    alt="Happy golden retriever dog smiling, showcasing the joy and bond between pets and owners that MyPetID helps protect"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full opacity-60"></div>
                <div className="absolute top-1/4 -left-1 w-3 h-3 bg-blue-400 rounded-full opacity-40"></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;