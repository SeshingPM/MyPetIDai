import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import DigitalIdentityProcess from "@/components/landing/DigitalIdentityProcess";
import HomeFeatureCards from "@/components/landing/HomeFeatureCards";
import PetIdCreationSection from "@/components/landing/PetIdCreationSection";
import ProblemsSolvedSection from "@/components/landing/problems-solved/ProblemsSolvedSection";
import { Separator } from "@/components/ui/separator";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import { toast } from "sonner";
import { generateSchemaByPageType } from "@/lib/schema";
import { useIsMobile, usePreferReducedMotion } from "@/hooks/use-responsive";
import ErrorBoundary from "@/components/ui-custom/ErrorBoundary";
import logger from "@/utils/logger";

// Lazy-loaded components
const FAQSection = lazy(() => import("@/components/faq/FAQSection"));

// Simple loading component
const LoadingFallback = () => (
  <div className="w-full py-12 flex justify-center">
    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePreferReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  // Create SEO props for the new identity-focused platform
  const seoProps = useMemo(() => {
    const pageConfig = {
      title: "MyPetID | Free Pet Digital Identity Platform",
      description: "Create your pet's free digital identity with a unique My Pet ID. Organize health records, set reminders, and verify ownership - all completely free for pet owners.",
      keywords: "pet digital identity, free My Pet ID, pet ID number, pet ownership verification, digital pet profile, pet health records, free pet platform",
      canonicalUrl: "https://mypetid.ai/",
      ogType: "website",
      ogImage: "/images/og-image.png"
    };
    
    const homeSchema = generateSchemaByPageType("home");
    
    const structuredData = [
      ...homeSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "MyPetID - Free Pet Digital Identity",
        "url": "https://mypetid.ai",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description": "Create your pet's free digital identity with MyPetID. Get a unique My Pet ID, organize health records, and verify ownership - all completely free for pet owners.",
        "screenshot": "https://mypetid.ai/images/app-screenshot.jpg",
        "featureList": "Free My Pet ID assignment, digital identity verification, health records management, ownership proof, reminder system",
      }
    ];
    
    const preloadAssets = [
      {
        href: "/fonts/inter-var.woff2",
        as: "font" as const,
        type: "font/woff2",
        crossOrigin: true,
        priority: "prefetch" as const,
      },
      {
        href: "/og-image.png",
        as: "image" as const,
        priority: "prefetch" as const,
      },
      {
        href: "/logo.png",
        as: "image" as const,
        priority: "prefetch" as const,
      },
    ];
    
    const preconnectUrls = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdn.mypetid.ai",
      "https://api.mypetid.ai",
    ];
    
    const dnsPrefetchUrls = [
      "https://api.mypetid.ai",
      "https://analytics.mypetid.ai",
    ];
    
    const faqItems = [
      {
        question: "Is MyPetID really free?",
        answer: "Yes! MyPetID is completely free for pet owners. Create unlimited pet profiles, assign My Pet IDs, store documents, and use all features at no cost. No hidden fees or subscription required."
      },
      {
        question: "What is a My Pet ID?",
        answer: "A My Pet ID is a unique digital identifier assigned to your pet's profile. It simplifies ownership verification, document sharing, and lifelong record management."
      },
      {
        question: "How secure is my pet's digital identity?",
        answer: "Your pet's digital identity is protected with bank-level encryption. We use industry-standard security protocols and never share your information without permission."
      }
    ];
    
    return {
      title: pageConfig.title,
      description: pageConfig.description,
      keywords: pageConfig.keywords,
      canonicalUrl: pageConfig.canonicalUrl,
      ogType: pageConfig.ogType,
      ogImage: pageConfig.ogImage,
      structuredData: structuredData.map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      })),
      lang: "en-US",
      alternateLanguages: [
        { lang: "es", url: "https://mypetid.ai/es/" },
        { lang: "fr", url: "https://mypetid.ai/fr/" },
        { lang: "de", url: "https://mypetid.ai/de/" },
      ],
      mobileAppConfig: {
        appName: "MyPetID",
        appStoreId: "123456789",
        appStoreUrl: "https://apps.apple.com/app/mypetid/id123456789",
        playStoreId: "com.mypetid.app",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.mypetid.app",
        appUrl: "mypetid://home",
      },
      preloadAssets,
      preconnectUrls,
      dnsPrefetchUrls,
      breadcrumbs: [
        { name: "Home", url: "/" }
      ],
      faqItems
    };
  }, []);

  useEffect(() => {
    try {
      setIsLoaded(true);
      console.log("Index component mounted successfully");

      const queryParams = new URLSearchParams(location.search);
      const registrationStatus = queryParams.get("registration");

      if (registrationStatus === "success") {
        toast.success("Welcome to MyPetID! Let's create your pet's digital identity.");
        navigate("/onboarding", { replace: true });
      }

      if (location.hash) {
        const sectionId = location.hash.substring(1);
        const timer = setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            });
          }
        }, 100);

        return () => clearTimeout(timer);
      } else {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error in Index component useEffect:", error);
    }
  }, [location, navigate, prefersReducedMotion]);

  console.log("Index component rendering, isLoaded:", isLoaded);

  return (
    <>
      <EnhancedSEO {...seoProps} />

      <div className={`min-h-screen bg-white ${isLoaded ? "animate-fade-in" : ""}`}>
        <Header />

        <main className="pt-16">
          <Hero />

          <DigitalIdentityProcess />

          <HomeFeatureCards />

          <ProblemsSolvedSection />

          <Separator />

          <PetIdCreationSection />

          <ErrorBoundary
            fallback={({ error, resetErrorBoundary }) => (
              <div className="max-w-md mx-auto p-4 border border-red-300 rounded bg-red-50 text-center">
                <h3 className="font-medium text-red-700 mb-2">
                  Failed to load FAQ section
                </h3>
                <button
                  onClick={resetErrorBoundary}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          >
            <Suspense fallback={<LoadingFallback />}>
              <FAQSection className="bg-gradient-to-b from-indigo-50/60 to-white" />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;