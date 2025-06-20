
import React from 'react';
import { Shield, Smartphone, Clock, Share2, Database, Heart, Zap, Globe } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const SimplifiedTechnologySection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Digital Pet Identity',
      description: 'Bank-level encryption with HIPAA-compliant veterinary integration for complete pet record protection',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Database,
      title: 'Comprehensive Record Management',
      description: 'Complete pet health documentation with smart categorization and searchable medical history',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Real-time Veterinary Access',
      description: 'Instant access to pet medical records across all devices with automatic health data synchronization',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Share2,
      title: 'Professional Health Sharing',
      description: 'Secure, time-limited access links for veterinarians and emergency pet care situations',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Digital Pet Identity',
      description: 'Upload pet information, medical records, and vaccination history to create a comprehensive digital profile.',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200'
    },
    {
      step: '2',
      title: 'Secure Health Data Storage',
      description: 'All pet health information is encrypted and stored with bank-level security standards.',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      step: '3',
      title: 'Veterinary Integration',
      description: 'Share complete pet medical history instantly with authorized veterinary professionals.',
      icon: Globe,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200'
    },
    {
      step: '4',
      title: 'Emergency Access',
      description: 'Get immediate access to critical pet health information during emergency situations.',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Advanced Digital Pet Identity Technology
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform creates a comprehensive digital pet identity with secure health record management, 
              enabling seamless veterinary communication and emergency access to critical pet medical information.
            </p>
          </div>
        </FadeIn>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={100 + index * 100}>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* How Digital Pet Identity Works - Redesigned */}
        <FadeIn delay={300}>
          <div className="mb-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">How Digital Pet Identity Works</h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our comprehensive pet health management platform simplifies veterinary record keeping and ensures 
                your pet's complete medical history is always accessible when needed.
              </p>
            </div>
            
            {/* Process Steps with Flow */}
            <div className="relative">
              {/* Connection Lines for Desktop */}
              <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                <div className="flex justify-between items-center h-1">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-300 to-blue-300 mx-8"></div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300 mx-8"></div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 to-amber-300 mx-8"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {howItWorks.map((step, index) => (
                  <FadeIn key={step.step} delay={400 + index * 150}>
                    <div className={`bg-gradient-to-br ${step.bgGradient} rounded-2xl p-6 border ${step.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative`}>
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                          <span className="text-sm font-bold text-white">{step.step}</span>
                        </div>
                      </div>
                      
                      {/* Icon */}
                      <div className="mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Enhanced Key Benefits */}
        <FadeIn delay={500}>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Why Pet Families Choose Our Digital Identity Platform</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Experience the peace of mind that comes with comprehensive pet health documentation and secure veterinary integration.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Complete pet medical history in one secure digital location</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Automated health reminders and vaccination tracking</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Emergency access to critical pet health information</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Seamless sharing with authorized veterinary professionals</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">HIPAA-compliant security for sensitive pet health data</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Cross-platform access from any device, anywhere</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default SimplifiedTechnologySection;