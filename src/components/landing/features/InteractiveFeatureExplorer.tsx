
import React, { useState } from 'react';
import { CreditCard, FileText, Bell, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';
import { 
  IdentityPreview, 
  DocumentsPreview, 
  RemindersPreview, 
  SharingPreview 
} from './previews';

const features = [
  {
    id: 'identity',
    icon: CreditCard,
    title: "Pet Digital Identity & My Pet ID",
    preview: "Create a unique My Pet ID that serves as your pet's permanent digital identity for life",
    component: IdentityPreview,
    colors: {
      gradient: "from-purple-500 to-indigo-500",
      iconBg: "from-purple-600 to-indigo-600"
    }
  },
  {
    id: 'documents',
    icon: FileText,
    title: "Secure Document Vault",
    preview: "Store all vaccination records, medical history, and veterinary certificates in one secure digital vault",
    component: DocumentsPreview,
    colors: {
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "from-emerald-600 to-teal-600"
    }
  },
  {
    id: 'reminders',
    icon: Bell,
    title: "Smart Health Reminders",
    preview: "AI-powered notifications ensure you never miss critical vaccinations, medications, or veterinary check-ups",
    component: RemindersPreview,
    colors: {
      gradient: "from-amber-500 to-orange-500",
      iconBg: "from-amber-600 to-orange-600"
    }
  },
  {
    id: 'sharing',
    icon: Share2,
    title: "Instant Identity Sharing",
    preview: "Share your pet's complete digital profile with veterinarians, pet sitters, or boarding facilities instantly",
    component: SharingPreview,
    colors: {
      gradient: "from-rose-500 to-pink-500",
      iconBg: "from-rose-600 to-pink-600"
    }
  }
];

const InteractiveFeatureExplorer: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('identity');
  const currentFeature = features.find(f => f.id === activeFeature) || features[0];
  const PreviewComponent = currentFeature.component;

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Revolutionary Digital Pet Identity
            </h1>
            <div className="mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-5xl font-bold">
                Platform Features
              </span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-3 leading-relaxed max-w-3xl mx-auto">
              Discover how MyPetID.ai transforms pet care with cutting-edge digital identity technology. 
              <span className="text-blue-600 font-semibold"> Create your pet's permanent digital identity</span> and 
              unlock comprehensive health management tools designed for modern pet owners.
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Click any feature below to see our advanced pet identity management system in action
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Feature Buttons */}
          <div className="space-y-3">
            {features.map((feature) => (
              <FadeIn key={feature.id} delay={100}>
                <button
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                    activeFeature === feature.id
                      ? `bg-gradient-to-r ${feature.colors.gradient} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeFeature === feature.id 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-br ${feature.colors.gradient}`
                    }`}>
                      <feature.icon className={`w-5 h-5 ${
                        activeFeature === feature.id ? 'text-white' : 'text-white'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                      <p className={`text-sm ${
                        activeFeature === feature.id ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {feature.preview}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      activeFeature === feature.id ? 'text-white rotate-90' : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>

          {/* Feature Preview */}
          <div>
            <FadeIn key={activeFeature} delay={200}>
              <GlassCard className="bg-gradient-to-br from-white to-blue-50/80 border-blue-200/50 overflow-hidden">
                <div className="text-center p-4 border-b border-gray-100">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${currentFeature.colors.iconBg} flex items-center justify-center mx-auto mb-3 shadow-xl`}>
                    <currentFeature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {currentFeature.title}
                  </h3>
                </div>

                <div className="h-72 overflow-hidden">
                  <PreviewComponent />
                </div>

                <div className="p-4 text-center border-t border-gray-100">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link to="/pricing">
                      Start Creating Pet Identities Free
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatureExplorer;