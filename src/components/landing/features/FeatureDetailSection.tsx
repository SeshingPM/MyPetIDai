
import React from 'react';
import { CreditCard, Shield, FileText, Bell, Share2, Globe, Clock, Users, Award, RefreshCw, Check } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

interface FeatureData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const featuresData: FeatureData[] = [
  {
    id: 'identity',
    icon: <CreditCard className="w-6 h-6" />,
    title: "Digital Pet Identity & My Pet ID",
    description: "Give your pet a permanent digital identity with their own unique My Pet ID. This serves as their lifetime identification for instant verification, streamlined vet visits, and ownership proof — just like a human Social Security Number.",
    benefits: [
      "Unique My Pet ID for permanent identification throughout their lifetime",
      "Instant verification and ownership proof anywhere in the world",
      "Streamlined vet check-ins and emergency identification",
      "Secure, encrypted digital identity that travels with your pet globally"
    ],
    color: 'blue'
  },
  {
    id: 'documents',
    icon: <FileText className="w-6 h-6" />,
    title: "Secure Document Vault",
    description: "End the frustration of missing vaccination records during vet visits or insurance claims. Store all your pet's essential documents securely linked to their digital identity with bank-level encryption and instant access when you need it most.",
    benefits: [
      "Save 2-3 hours per vet visit by having all records instantly accessible",
      "Reduce insurance claim processing time from weeks to days",
      "Eliminate $50-200 fees for duplicate vaccination records",
      "Advanced encryption keeps all documents secure and HIPAA-compliant"
    ],
    color: 'emerald'
  },
  {
    id: 'reminders',
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Health Reminders",
    description: "Never miss critical pet care again with intelligent reminders tied to your pet's digital identity. Our smart system prevents expensive health issues and can save you hundreds or thousands in emergency vet bills by keeping your pet's health on track.",
    benefits: [
      "Prevent $500-2000 emergency vet bills through timely preventive care",
      "Reduce medication errors that can cost $200-800 in treatment",
      "Increase pet lifespan by up to 2 years through consistent health maintenance",
      "Peace of mind knowing you'll never miss a critical vaccination or medication"
    ],
    color: 'purple'
  },
  {
    id: 'sharing',
    icon: <Share2 className="w-6 h-6" />,
    title: "Instant Identity Sharing",
    description: "Transform how you share your pet's information with professionals. Generate secure, professional-grade reports instantly using their My Pet ID. No more frantic searches for documents or incomplete medical histories during critical moments.",
    benefits: [
      "Save 30+ minutes per vet visit with instant, complete medical history sharing",
      "Reduce miscommunication that leads to incorrect treatments or medications",
      "Enable faster, more accurate diagnoses with comprehensive health timelines",
      "Professional presentation builds trust with veterinarians and care providers"
    ],
    color: 'amber'
  },
  {
    id: 'verification',
    icon: <Shield className="w-6 h-6" />,
    title: "Identity Verification System",
    description: "Prove pet ownership instantly with their My Pet ID. Perfect for vet visits, boarding facilities, travel, and emergency situations where quick verification is critical for your pet's safety and care.",
    benefits: [
      "Instant ownership verification accepted by veterinary professionals",
      "Streamlined boarding and daycare check-ins",
      "Faster emergency response with immediate access to pet information",
      "Professional recognition system trusted by pet care providers"
    ],
    color: 'green'
  },
  {
    id: 'portability',
    icon: <Globe className="w-6 h-6" />,
    title: "Lifetime Portability",
    description: "Your pet's digital identity and My Pet ID travels with them anywhere in the world. Never lose access to critical information, regardless of location changes, ensuring continuous care throughout your pet's lifetime.",
    benefits: [
      "Global accessibility from any device, anywhere in the world",
      "Seamless veterinary care when traveling or relocating",
      "Permanent digital identity that never expires or gets lost",
      "International recognition for travel and relocation purposes"
    ],
    color: 'cyan'
  }
];

const FeatureDetailSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden" aria-labelledby="feature-details-heading">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '15s', animationDelay: '2s' }} />
      </div>
      
      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl mb-6">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 
              id="feature-details-heading"
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Complete Digital Pet Identity Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              MyPetID provides comprehensive digital identity management for pets with advanced features designed to simplify pet care, improve health outcomes, and ensure your pet's information is always accessible when needed.
            </p>
          </FadeIn>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {featuresData.map((feature, index) => (
            <FadeIn key={feature.id} delay={index * 100}>
              <GlassCard className="p-6 h-full bg-white/90 border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* Benefits Summary */}
        <div className="text-center">
          <FadeIn delay={600}>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Why Pet Owners Choose <span className="text-blue-600">MyPetID Digital Identity</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">$847</div>
                <div className="text-lg font-semibold text-green-700 mb-2">Average Annual Savings</div>
                <div className="text-sm text-gray-600">Through preventive care reminders and faster emergency response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">45 min</div>
                <div className="text-lg font-semibold text-blue-700 mb-2">Time Saved Per Vet Visit</div>
                <div className="text-sm text-gray-600">With instant access to complete medical records and history</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">99.8%</div>
                <div className="text-lg font-semibold text-purple-700 mb-2">Uptime Reliability</div>
                <div className="text-sm text-gray-600">Your pet's digital identity is always accessible when needed</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default FeatureDetailSection;