
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/FadeIn";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BenefitsHero from "@/components/benefits/BenefitsHero";
import PartnerDealsCarousel from "@/components/benefits/PartnerDealsCarousel";
import BenefitsGrid from "@/components/benefits/BenefitsGrid";
import PartnerShowcase from "@/components/benefits/PartnerShowcase";
import OptInSection from "@/components/benefits/OptInSection";
import { useMemo } from "react";
import { getPageSeoConfig, defaultSeoConfig } from "@/config/seo-config";
import { useLocation } from "react-router-dom";

const BenefitsPage: React.FC = () => {
  const location = useLocation();
  
  const seoProps = useMemo(() => {
    const pageConfig = getPageSeoConfig('benefits' as any) || {
      title: "Exclusive Member Benefits & Partner Deals | MyPetID",
      description: "Access exclusive deals and discounts from our select partners. Rotating offers on pet care, products, and services available only to MyPetID members.",
      canonicalUrl: `${defaultSeoConfig.canonicalUrl}${location.pathname}`,
      keywords: "pet benefits, exclusive deals, partner discounts, pet care savings, member perks",
      structuredData: []
    };
    
    const canonicalUrl = pageConfig.canonicalUrl || `${defaultSeoConfig.canonicalUrl}${location.pathname}`;
    
    const faqItems = [
      {
        question: "How do I access exclusive partner deals?",
        answer: "Simply create a MyPetID account and opt-in to our partner benefits program. You'll immediately gain access to current rotating offers."
      },
      {
        question: "How often do the deals change?",
        answer: "Our partner deals rotate regularly, with new exclusive offers added monthly to ensure fresh savings opportunities for our members."
      },
      {
        question: "Are there any costs to access these benefits?",
        answer: "Partner benefits are completely free for all MyPetID members. Simply opt-in during registration or in your account settings."
      }
    ];

    // Ensure structured data is always an array
    let structuredData = [];
    try {
      if (typeof pageConfig.structuredData === 'function') {
        structuredData = pageConfig.structuredData() || [];
      } else if (Array.isArray(pageConfig.structuredData)) {
        structuredData = pageConfig.structuredData;
      }
    } catch (error) {
      console.error('Error generating structured data:', error);
      structuredData = [];
    }
    
    return {
      title: pageConfig.title,
      description: pageConfig.description,
      canonicalUrl,
      ogType: 'website',
      ogImage: pageConfig.ogImage || defaultSeoConfig.ogImage,
      structuredData,
      faqItems,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Benefits", url: "/benefits" }
      ],
      lang: 'en-US',
      preloadAssets: [
        {
          href: "/images/benefits-hero.jpg",
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
          <BenefitsHero />
          <PartnerDealsCarousel />
          <BenefitsGrid />
          <PartnerShowcase />
          <OptInSection />

          {/* CTA Section */}
          <section className="py-12 bg-gradient-to-b from-blue-50/80 to-white relative overflow-hidden">
            <div className="absolute inset-0 -z-0 opacity-40">
              <div
                className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft"
                style={{ animationDuration: "9s" }}
              />
              <div
                className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft"
                style={{ animationDuration: "11s", animationDelay: "0.7s" }}
              />
            </div>

            <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
              <FadeIn>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Ready to unlock exclusive benefits?
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Join thousands of pet owners already saving with our exclusive partner deals. Create your free account today and start accessing member-only benefits.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/onboarding">Join & Access Benefits</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <Link to="/features">See All Features</Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BenefitsPage;
