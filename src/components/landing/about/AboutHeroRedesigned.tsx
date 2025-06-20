
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Award, Target } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Link } from 'react-router-dom';

const AboutHeroRedesigned: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50/60">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-500/15 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-blue-600/10 rounded-full blur-3xl animate-spin-slow" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-500 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-indigo-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-cyan-500 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-purple-500 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main Hero Content */}
        <div className="text-center mb-8">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Meet the Visionaries Behind
              </span>
              <br />
              <span className="text-gray-800">Your Pet's Digital Future</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={100}>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
              From tech innovators to pet industry veterans, our leadership team combines decades of experience 
              in building scalable platforms, strategic partnerships, and cutting-edge AI solutions.
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <Link to="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 px-6 py-2.5 text-base shadow-md hover:shadow-lg transition-all duration-300">
                <a href="#our-team">Meet Our Team</a>
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced Trust Indicators */}
        <FadeIn delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Expert Leadership</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Combined decades of experience in tech, pets, and healthcare innovation</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Proven Track Record</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Successfully built and scaled multiple tech ventures from startup to success</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Pet-Focused Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Dedicated to revolutionizing pet healthcare and improving owner experiences</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutHeroRedesigned;