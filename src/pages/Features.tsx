
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import { useIsMobile } from "@/hooks/use-responsive";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import FeatureDetailSection from "@/components/landing/features/FeatureDetailSection";
import TestimonialSection from "@/components/landing/features/TestimonialSection";
import ComparisonSection from "@/components/landing/features/ComparisonSection";
import PricingFAQSection from "@/components/landing/features/PricingFAQSection";
import FeatureValueGrid from "@/components/landing/features/FeatureValueGrid";
import InteractiveFeatureExplorer from "@/components/landing/features/InteractiveFeatureExplorer";
import SocialProofStrip from "@/components/landing/features/SocialProofStrip";
import { useMemo } from "react";
import { getPageSeoConfig, defaultSeoConfig } from "@/config/seo-config";
import { useLocation } from "react-router-dom";

/**
 * Features Page Component
 *
 * Showcases the Digital Pet Identity platform with My Pet ID as the core feature,
 * emphasizing how MyPetID creates permanent digital identities for pets.
 *
 * MIGRATION NOTE: When migrating to Next.js, convert this to use:
 * 1. Next.js App Router metadata configuration
 * 2. Server components for the main content
 * 3. Client components for interactive elements
 */
const FeaturesPage: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Since the usePageSeo hook isn't available, we'll create SEO props directly
  const seoProps = useMemo(() => {
    // Get base configuration for the page
    const pageConfig = getPageSeoConfig('features');
    
    // Get structured data
    let structuredData = Array.isArray(pageConfig.structuredData) 
      ? pageConfig.structuredData 
      : (typeof pageConfig.structuredData === 'function' 
        ? pageConfig.structuredData() 
        : []);
    
    // Add additional structured data
    structuredData = [
      ...structuredData,
      {
        type: "ItemList",
        data: {
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Digital Pet Identity & My Pet ID",
              description: "Unique My Pet ID for permanent identification"
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Identity Verification",
              description: "Instant ownership verification and professional recognition"
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Lifetime Portability",
              description: "Pet identity that travels anywhere in the world"
            }
          ]
        }
      }
    ];
    
    // Create the full canonical URL
    const canonicalUrl = pageConfig.canonicalUrl || `${defaultSeoConfig.canonicalUrl}${location.pathname}`;
    
    // FAQ items for the page
    const faqItems = [
      {
        question: "What is a My Pet ID and how does it work?",
        answer: "A My Pet ID is a unique digital identifier that creates a permanent identity for your pet, enabling instant verification and access to their complete profile."
      },
      {
        question: "Can veterinarians access my pet's digital identity?",
        answer: "Yes, you can securely share your pet's digital identity and records with veterinarians using their My Pet ID for more effective consultations."
      },
      {
        question: "Is my pet's digital identity secure?",
        answer: "Absolutely. MyPetID uses bank-level encryption to protect your pet's digital identity and all associated data."
      }
    ];
    
    return {
      title: "Digital Pet Identity Platform - Create Your Pet's My Pet ID | MyPetID",
      description: "Give your pet a permanent digital identity with their own My Pet ID. Secure document storage, instant verification, and lifetime portability for comprehensive pet care.",
      canonicalUrl,
      ogType: pageConfig.ogType || 'website',
      ogImage: pageConfig.ogImage || defaultSeoConfig.ogImage,
      structuredData,
      faqItems,
      breadcrumbs: pageConfig.breadcrumbs || [],
      lang: 'en-US',
      preloadAssets: [
        {
          href: "/images/features-dashboard.jpg",
          as: "image" as const,
          fetchPriority: "high" as const
        }
      ]
    };
  }, [location.pathname]);
  
  return (
    <>
      <EnhancedSEO {...seoProps} />
      
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="pt-16 flex-grow">
          {/* Interactive Feature Explorer - Moved to First */}
          <InteractiveFeatureExplorer />

          {/* Other Opening Sections */}
          <FeatureValueGrid />
          <SocialProofStrip />

          {/* Features Grid */}
          <section id="all-features" className="py-10 bg-white">
            <FeaturesGrid showCta={false} />
          </section>

          {/* Detailed Features Section */}
          <FeatureDetailSection />

          {/* Comparison Section */}
          <div id="comparison">
            <ComparisonSection />
          </div>

          {/* Testimonials Section */}
          <TestimonialSection />

          {/* Pricing & FAQ Section */}
          <PricingFAQSection />

          {/* CTA Section - Much Smaller with Single Button */}
          <section className="py-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
              <FadeIn>
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">
                  Start creating your pet's digital identity today
                </h2>
                <p className="text-blue-100 mb-4 max-w-lg mx-auto text-sm">
                  Join thousands of pet owners who trust MyPetID - completely free to get started.
                </p>
                <Button asChild size="lg" className="rounded-full bg-white text-blue-600 hover:bg-blue-50 px-8 py-2 font-semibold shadow-lg">
                  <Link to="/onboarding">Get Started Free</Link>
                </Button>
              </FadeIn>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeaturesPage;