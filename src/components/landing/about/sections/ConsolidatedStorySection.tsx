
import React from 'react';
import { Target, Heart, Shield, Users, Lightbulb, CheckCircle, Star, FileText, Clock, Share2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const ConsolidatedStorySection: React.FC = () => {
  const coreValues = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Bank-level encryption protecting your pet\'s digital identity and sensitive health information',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Pet-Centered',
      description: 'Every decision prioritizes comprehensive pet health management and wellbeing',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Family Focused',
      description: 'Connecting pet families with veterinarians through secure digital pet identity sharing',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  const problemSolutions = [
    {
      icon: FileText,
      problem: 'Scattered Pet Records',
      solution: 'Unified Digital Pet Identity',
      description: 'Transform fragmented veterinary records into a comprehensive, searchable pet health profile accessible anywhere.'
    },
    {
      icon: Clock,
      problem: 'Emergency Access Delays',
      solution: 'Instant Medical History',
      description: 'Provide immediate access to complete pet medical history during critical veterinary emergencies.'
    },
    {
      icon: Share2,
      problem: 'Complex Vet Communication',
      solution: 'Seamless Professional Sharing',
      description: 'Enable secure, instant sharing of pet health information with authorized veterinary professionals.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Our Story Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-6">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Our Story & Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Revolutionizing Digital Pet Identity Management
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every pet deserves a comprehensive digital identity that follows them throughout their entire life journey. 
              We're creating the definitive platform for pet health documentation, veterinary communication, and emergency medical access.
            </p>
          </div>
        </FadeIn>

        {/* Enhanced Problem → Solution Story */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problemSolutions.map((item, index) => (
            <FadeIn key={index} delay={100 + index * 100}>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-red-600 font-medium mb-1">Problem: {item.problem}</p>
                    <h3 className="font-bold text-gray-900">{item.solution}</h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Digital pet identity solution</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Expanded Mission & Impact */}
        <FadeIn delay={200}>
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission: Complete Pet Health Transparency</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We believe every pet family should have instant access to their pet's complete medical history, 
                  vaccination records, and health documentation. Our digital pet identity platform creates a 
                  secure, comprehensive profile that travels with your pet everywhere.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Comprehensive pet record management in one secure location</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Emergency access to critical pet health information</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Seamless veterinary communication and record sharing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Smart health reminders and preventive care tracking</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Real Impact Stories</h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 mb-2">
                      "During an emergency vet visit while traveling, having our dog's complete digital pet identity 
                      saved precious time and potentially his life."
                    </p>
                    <p className="text-xs font-medium text-blue-600">- Emergency access success story</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-gray-700 mb-2">
                      "Our veterinarian loves how easy it is to access our cat's complete medical history 
                      and vaccination records through secure sharing."
                    </p>
                    <p className="text-xs font-medium text-green-600">- Veterinary integration feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Core Values */}
        <FadeIn delay={400}>
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3">Our Core Values in Digital Pet Identity</h3>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  The principles that guide every feature we build for comprehensive pet health management and secure veterinary integration
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {coreValues.map((value, index) => (
                  <div key={value.title} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ConsolidatedStorySection;