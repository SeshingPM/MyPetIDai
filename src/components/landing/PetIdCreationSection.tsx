
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';

const PetIdCreationSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container-max relative z-10">
        <FadeIn delay={400}>
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Create your pet's digital identity in under 2 minutes. Add photos, documents, and set up their complete profile.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl 
                transition-all duration-300 font-medium"
              >
                <Link to="/onboarding">🆔 Create Free Pet ID Now</Link>
              </Button>
              <Button asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-500 text-blue-600 px-8 py-6 text-lg rounded-xl 
                font-medium hover:bg-blue-50 transition-all duration-300"
              >
                <Link to="/features">See All Features</Link>
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              ✅ No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PetIdCreationSection;