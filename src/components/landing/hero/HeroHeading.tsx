
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';
import { CreditCard, Bell, Folder, Share2, Heart } from 'lucide-react';

interface HeroHeadingProps {
  scrollToFeatures: () => void;
}

const HeroHeading: React.FC<HeroHeadingProps> = ({ scrollToFeatures }) => {
  return (
    <div className="lg:text-left text-center relative max-w-2xl space-y-6">
      <FadeIn delay={200}>
        <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight"
          itemProp="headline"
        >
          <span className="block mb-2">
            Create Your Pet's Free <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Digital Identity</span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
          Give your pet a permanent digital identity with their own My Pet ID. Store documents securely, get smart health reminders, and share instantly with vets and family — all completely free forever.
        </p>
      </FadeIn>
      
      <FadeIn delay={300}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
          <Button asChild 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
            text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl 
            transition-all duration-300 font-medium"
            aria-label="Create your pet's free digital identity"
          >
            <Link to="/onboarding" className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Create Free Pet Identity Now
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            ✅ <span>100% Free Forever</span>
          </div>
        </div>
      </FadeIn>
      
      <FadeIn delay={400}>
        {/* Feature highlights - Enhanced with Pet Identity focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {/* Featured Digital Pet ID - Enhanced with stronger gradient and shadow */}
          <div className="sm:col-span-2 flex items-center gap-4 text-gray-700 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-xl border border-blue-200/80 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <CreditCard className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-base mb-1">Digital Pet Identity & My Pet ID</div>
              <div className="text-sm text-gray-600 leading-relaxed">Unique My Pet ID for permanent identification, instant vet check-ins, and lifetime ownership verification</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Folder className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Secure Document Storage</div>
              <div className="text-xs text-gray-600 leading-relaxed">All your pet's records linked to their digital identity — vet reports, insurance, vaccination history</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bell className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Smart Health Reminders</div>
              <div className="text-xs text-gray-600 leading-relaxed">Automated alerts for vaccinations, medications, and vet appointments tied to your pet's identity</div>
            </div>
          </div>
          
          <div className="sm:col-span-2 flex items-center gap-3 text-gray-700 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Share2 className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Instant Identity Sharing</div>
              <div className="text-xs text-gray-600 leading-relaxed">Share your pet's complete identity and records with vets, sitters, or family in seconds</div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default HeroHeading;