
import React from 'react';
import { Shield, Award, Heart, CheckCircle, Building2, Users } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const IndustryRecognitionSection: React.FC = () => {
  const recognitions = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Bank-level security standards for protecting sensitive pet health information',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Building2,
      title: 'Veterinary Trusted',
      description: 'Approved by veterinary professionals for seamless digital pet identity management',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Award,
      title: 'Industry Leading',
      description: 'Recognized for innovation in comprehensive pet record management solutions',
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Certified' },
    { name: 'GDPR Compliant', status: 'Verified' },
    { name: 'ISO 27001', status: 'Aligned' },
    { name: 'Veterinary Standards', status: 'Approved' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full border border-indigo-200 mb-6">
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">Industry Recognition & Trust</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trusted Digital Pet Identity Platform
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive pet ID platform meets the highest standards for security, 
              veterinary integration, and pet health data management, trusted by thousands of pet families.
            </p>
          </div>
        </FadeIn>

        {/* Recognition Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {recognitions.map((item, index) => (
            <FadeIn key={item.title} delay={100 + index * 100}>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Certifications & Standards */}
        <FadeIn delay={400}>
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security & Compliance Standards</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our digital pet identity platform adheres to the highest security standards, 
                ensuring your pet's health information is protected and accessible when needed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((cert, index) => (
                <div key={cert.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">{cert.name}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">{cert.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700">Emergency veterinary access to complete pet records</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700">Secure sharing with authorized veterinary professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700">Comprehensive pet health documentation platform</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default IndustryRecognitionSection;