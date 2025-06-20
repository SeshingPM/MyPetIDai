import React from "react";
import EnhancedSEO from "../EnhancedSEO";

/**
 * Example implementation of EnhancedSEO for the Features page
 * 
 * This demonstrates how to properly implement the EnhancedSEO component
 * with all necessary SEO elements for a key landing page.
 */
const FeaturePageSEO: React.FC = () => {
  // Define the current language and URL path
  const currentLang = "en"; // This would typically come from a language context or router
  const path = "/features"; // This would typically come from the router

  // Define alternate language URLs
  const alternateLanguages = [
    { lang: "es", url: "https://petdocument.com/es/features" },
    { lang: "fr", url: "https://petdocument.com/fr/features" },
    { lang: "de", url: "https://petdocument.com/de/features" },
  ];

  // Define breadcrumbs for structured data
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Features", url: "/features" },
  ];

  // Define FAQ items for structured data
  const faqItems = [
    {
      question: "What features does PetDocument offer?",
      answer: "PetDocument offers secure storage for pet health records, vaccination tracking, medication reminders, vet appointment scheduling, and document sharing with veterinarians and pet sitters.",
    },
    {
      question: "Can I access my pet's records on mobile devices?",
      answer: "Yes, PetDocument is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android for an enhanced experience.",
    },
    {
      question: "Is my pet's health information secure?",
      answer: "Absolutely. PetDocument uses bank-level encryption to protect all your data. We never share your information with third parties without your explicit consent.",
    },
  ];

  // Define structured data for the page
  const structuredData = [
    {
      type: "WebPage",
      data: {
        name: "PetDocument Features",
        description: "Discover all the powerful features PetDocument offers to help you manage your pet's health records, vaccinations, and more.",
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: "https://petdocument.com/images/features-dashboard.jpg",
        },
        datePublished: "2024-01-15",
        dateModified: "2025-04-20",
      },
    },
  ];

  return (
    <EnhancedSEO
      title="Pet Health Management Features | PetDocument"
      description="Discover all the powerful features PetDocument offers to help you manage your pet's health records, vaccinations, and more. Try it free for 14 days!"
      keywords="pet health records, pet document management, pet vaccination tracker, pet medication reminders, veterinary records"
      canonicalUrl="https://petdocument.com/features"
      ogType="website"
      ogImage="/images/features-social-card.jpg"
      lang={currentLang === "en" ? "en-US" : currentLang}
      alternateLanguages={alternateLanguages}
      breadcrumbs={breadcrumbs}
      faqItems={faqItems}
      structuredData={structuredData}
      preconnectUrls={["https://fonts.googleapis.com", "https://fonts.gstatic.com"]}
      dnsPrefetchUrls={["https://www.googletagmanager.com", "https://connect.facebook.net"]}
      preloadAssets={[
        {
          href: "/fonts/inter-var.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: true,
          priority: "preload",
          fetchPriority: "high",
        },
        {
          href: "/images/features-hero.jpg",
          as: "image",
          fetchPriority: "high",
        },
      ]}
    />
  );
};

export default FeaturePageSEO;
