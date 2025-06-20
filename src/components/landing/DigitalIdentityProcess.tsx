import React from 'react';
import { UserPlus, IdCard, Upload, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const DigitalIdentityProcess: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "1",
      title: "Create Profile",
      description: "Add your pet's basic info, photos, and important details in under 2 minutes.",
      color: "blue"
    },
    {
      icon: IdCard,
      step: "2", 
      title: "Get My Pet ID",
      description: "Receive a unique My Pet ID that serves as your pet's permanent digital identity.",
      color: "teal"
    },
    {
      icon: Upload,
      step: "3",
      title: "Upload Documents",
      description: "Securely store vaccination records, medical documents, and important certificates in your pet's profile.",
      color: "green"
    },
    {
      icon: Share2,
      step: "4",
      title: "Share & Verify",
      description: "Instantly verify ownership and share specific information with vets, sitters, or boarding facilities.",
      color: "purple"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-200/50",
      line: "bg-blue-300"
    },
    teal: {
      bg: "bg-gradient-to-br from-teal-50 to-teal-100", 
      text: "text-teal-700",
      border: "border-teal-300",
      gradient: "from-teal-500 to-teal-600",
      shadow: "shadow-teal-200/50",
      line: "bg-teal-300"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      text: "text-green-700", 
      border: "border-green-300",
      gradient: "from-green-500 to-green-600",
      shadow: "shadow-green-200/50",
      line: "bg-green-300"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      text: "text-purple-700", 
      border: "border-purple-300",
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-200/50",
      line: "bg-purple-300"
    }
  };

  return (
    <section className="py-4 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/60 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-max">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              How Digital Identity Works
            </h2>
            <div className="text-center mb-2">
              <p className="text-base text-slate-600 font-medium">Simple 4-step process:</p>
            </div>
          </div>
        </FadeIn>

        {/* Redesigned steps layout */}
        <div className="relative max-w-5xl mx-auto mb-4">
          {/* Background connecting line for desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-blue-200 via-teal-200 via-green-200 to-purple-200 opacity-40"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {steps.map((step, index) => (
              <FadeIn key={step.step} delay={100 + index * 100}>
                <div className="relative group">
                  {/* Connecting line for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-1/2 bottom-0 w-0.5 h-4 transform -translate-x-1/2 translate-y-full bg-gradient-to-b from-gray-300 to-transparent opacity-50"></div>
                  )}
                  
                  {/* Step content */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-white/60 shadow-sm">
                    {/* Step icon with floating effect */}
                    <div className="flex justify-center mb-3 relative">
                      <div className={`w-16 h-16 rounded-xl ${colorClasses[step.color].bg} ${colorClasses[step.color].border} border-2 flex items-center justify-center ${colorClasses[step.color].shadow} shadow-md relative transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                        <step.icon className={`h-6 w-6 ${colorClasses[step.color].text}`} strokeWidth={2} />
                        {/* Step number badge */}
                        <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${colorClasses[step.color].gradient} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md border border-white z-10`}>
                          {step.step}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-bold text-base mb-2 text-slate-800 group-hover:text-slate-900 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-snug text-xs group-hover:text-slate-700 transition-colors">
                      {step.description}
                    </p>
                    
                    {/* Subtle accent line at bottom */}
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 ${colorClasses[step.color].line} rounded-full opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={500}>
          <div className="relative">
            {/* Enhanced background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-xl" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-xl" />
              <div className="absolute top-1/2 left-0 w-20 h-20 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-lg" />
            </div>
            
            <GlassCard
              variant="gradient"
              color="blue"
              className="text-center p-4 max-w-2xl mx-auto bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/50 border-2 border-blue-200/60 shadow-lg backdrop-blur-sm relative overflow-hidden"
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 via-indigo-600/5 to-purple-600/8 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mb-3 shadow-md">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                  Ready to Create Your Pet's Digital Identity?
                </h3>
                <p className="text-slate-700 mb-3 max-w-xl mx-auto text-sm">
                  Join thousands of pet parents who have created secure digital identities for their pets. Get started today with our simple and secure platform.
                </p>
                <div className="mt-auto">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 border-0"
                  >
                    <Link to="/pricing" className="flex items-center gap-2">
                      Start now for FREE
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default DigitalIdentityProcess;