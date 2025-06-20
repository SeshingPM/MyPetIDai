
import { generateSchemaByPageType } from "@/lib/schema";

// Default site metadata (fallbacks)
export const defaultSeoConfig = {
  titleTemplate: "%s | MyPetID.ai",
  defaultTitle: "MyPetID.ai - Free Digital Pet Identity & Pet SSN Platform",
  description: "Create your pet's free digital identity with unique Pet SSN. Secure document storage, smart health reminders, and instant sharing with vets — all completely free forever.",
  canonicalUrl: "https://mypetid.ai",
  ogImage: "/og-image.png",
  twitterCardType: "summary_large_image",
  twitterHandle: "@mypetidai",
  twitterSite: "@mypetidai",
};

// Key preconnect and DNS prefetch URLs
export const globalResourceHints = {
  preconnectUrls: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com", 
    "https://cdn.mypetid.ai",
    "https://api.mypetid.ai",
  ],
  dnsPrefetchUrls: [
    "https://api.mypetid.ai",
    "https://analytics.mypetid.ai",
  ],
};

// Common preload assets
export const commonPreloadAssets = [
  {
    href: "/fonts/inter-var.woff2",
    as: "font" as const,
    type: "font/woff2",
    crossOrigin: true,
    fetchPriority: "high" as const,
  },
  {
    href: "/og-image.png",
    as: "image" as const,
    fetchPriority: "low" as const,
  },
];

// Language alternates
export const alternateLanguages = [
  { lang: "es-ES", url: "https://petdocument.com/es/" },
  { lang: "fr-FR", url: "https://petdocument.com/fr/" },
  { lang: "de-DE", url: "https://petdocument.com/de/" },
];

// Mobile app configuration
export const mobileAppConfig = {
  appName: "PetDocument",
  appStoreId: "123456789",
  appStoreUrl: "https://apps.apple.com/app/petdocument/id123456789",
  playStoreId: "com.petdocument.app",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.petdocument.app",
  appUrl: "petdocument://home",
};

// Define the type for page names
export type PageName = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'faq' | 'benefits';

// Page-specific SEO configurations
export const pageSeoConfigs: Record<PageName, any> = {
  home: {
    title: "MyPetID.ai - Free Digital Pet Identity & Pet SSN Platform",
    description: "Create your pet's permanent digital identity with unique Pet SSN. Secure document storage, smart health reminders, and instant sharing with vets — all completely free forever.",
    keywords: "digital pet identity, pet SSN, pet social security number, free pet ID, pet document storage, pet health reminders, pet identity platform",
    canonicalUrl: "https://mypetid.ai/",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" }
    ],
    structuredData: () => [
      {
        type: "WebApplication",
        data: {
          name: "MyPetID.ai - Digital Pet Identity Platform",
          applicationCategory: "HealthApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: "MyPetID.ai creates permanent digital identities for pets with unique Pet SSN, secure document storage, and smart health management.",
          screenshot: "https://mypetid.ai/images/app-screenshot.jpg",
          featureList: "Digital pet identity, Pet SSN assignment, document storage, health reminders",
        },
      },
      ...generateSchemaByPageType("home").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
  features: {
    title: "Features - Digital Pet Identity & Pet SSN System",
    description: "Discover MyPetID.ai's features: unique Pet SSN assignment, secure document storage, smart health reminders, and instant identity sharing — all free forever.",
    keywords: "pet SSN features, digital pet identity features, pet document storage, pet health tracking, pet identity sharing",
    canonicalUrl: "https://mypetid.ai/features",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Features", url: "/features" }
    ],
    structuredData: () => [
      ...generateSchemaByPageType("features").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
  benefits: {
    title: "Exclusive Member Benefits & Partner Deals | MyPetID",
    description: "Access exclusive deals and discounts from our select partners. Rotating offers on pet care, products, and services available only to MyPetID members.",
    keywords: "pet benefits, exclusive deals, partner discounts, pet care savings, member perks",
    canonicalUrl: "https://mypetid.ai/benefits",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Benefits", url: "/benefits" }
    ],
    structuredData: () => [
      {
        type: "WebPage",
        data: {
          name: "Exclusive Member Benefits - MyPetID",
          description: "Access exclusive partner deals and discounts for pet care, products, and services.",
          url: "https://mypetid.ai/benefits",
        },
      }
    ],
  },
  pricing: {
    title: "Pricing - Free Digital Pet Identity Platform",
    description: "MyPetID.ai is completely free forever. Create unlimited pet digital identities, assign Pet SSNs, store documents, and set reminders at no cost.",
    keywords: "free pet SSN, free digital pet identity, no cost pet platform, free pet document storage",
    canonicalUrl: "https://mypetid.ai/pricing",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Pricing", url: "/pricing" }
    ],
    structuredData: () => [
      {
        type: "Product",
        data: {
          name: "MyPetID.ai Digital Pet Identity",
          description: "Free digital pet identity platform with Pet SSN, document storage, and health reminders",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
            availability: "https://schema.org/InStock",
          },
        },
      },
      ...generateSchemaByPageType("pricing").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
  about: {
    title: "About MyPetID.ai - Free Digital Pet Identity Mission",
    description: "Learn about MyPetID.ai's mission to create permanent digital identities for every pet through our free Pet SSN platform and comprehensive care management.",
    keywords: "about mypetid.ai, digital pet identity company, pet SSN platform, free pet identity service",
    canonicalUrl: "https://mypetid.ai/about",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "About", url: "/about" }
    ],
    structuredData: () => [
      ...generateSchemaByPageType("about").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
  contact: {
    title: "Contact MyPetID.ai - Digital Pet Identity Support",
    description: "Contact the MyPetID.ai team for support with your pet's digital identity, Pet SSN questions, or partnership inquiries. We're here to help with your pet identity needs.",
    keywords: "contact mypetid.ai, pet SSN support, digital pet identity help, pet platform support",
    canonicalUrl: "https://mypetid.ai/contact",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" }
    ],
    structuredData: () => [
      {
        type: "ContactPage",
        data: {
          name: "Contact MyPetID.ai",
          description: "Contact information for MyPetID.ai digital pet identity support and inquiries",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-555-123-4567",
            contactType: "customer service",
            availableLanguage: ["English", "Spanish"],
          },
        },
      },
      ...generateSchemaByPageType("contact").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
  faq: {
    title: "FAQ - Digital Pet Identity & Pet SSN Questions",
    description: "Find answers to common questions about MyPetID.ai's digital pet identity platform, Pet SSN system, document storage, and free features.",
    keywords: "pet SSN FAQ, digital pet identity questions, mypetid.ai help, pet identity platform faq",
    canonicalUrl: "https://mypetid.ai/faq",
    ogType: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "FAQ", url: "/faq" }
    ],
    structuredData: () => [
      ...generateSchemaByPageType("faq").map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      }))
    ],
  },
};

// Helper to get specific page SEO config
export const getPageSeoConfig = (pageName: keyof typeof pageSeoConfigs) => {
  return pageSeoConfigs[pageName] || pageSeoConfigs.home;
};
