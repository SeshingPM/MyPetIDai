/**
 * Schema.org utility functions for generating structured data
 * This helps with SEO by providing search engines with structured information about our pages
 */

type SchemaType = 
  | 'WebSite' 
  | 'WebPage' 
  | 'Organization'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'Article'
  | 'Product'
  | 'Service'
  | 'ItemList'
  | 'WebApplication';

/**
 * Generate schema.org structured data for different page types
 * @param pageType The type of page we're generating schema for
 * @returns Array of schema.org structured data objects
 */
export function generateSchemaByPageType(pageType: string): any[] {
  // Common schemas that should be on most pages
  const baseSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MyPetID",
      "url": "https://mypetid.vercel.app",
      "description": "Securely store and manage your pet's health records, vaccination history, and medical documents in one place.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://mypetid.vercel.app/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MyPetID",
      "url": "https://mypetid.vercel.app",
      "logo": "https://mypetid.vercel.app/logo.png",
      "sameAs": [
        "https://facebook.com/mypetid",
        "https://twitter.com/mypetid",
        "https://instagram.com/mypetid"
      ]
    }
  ];

  // Page-specific schema additions
  const pageSpecificSchemas: Record<string, any[]> = {
    home: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "MyPetID - Pet Digital Identity Management System",
        "description": "MyPetID offers modern digital identity management for pets, combining health records, care tools, and secure access—all in one place.",
        "url": "https://mypetid.vercel.app/",
        "publisher": {
          "@type": "Organization",
          "url": "https://mypetid.vercel.app"
        },
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      }
    ],
    features: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Features - MyPetID",
        "description": "Discover the key features of MyPetID - secure document storage, vaccination tracking, and health records management for your pets.",
        "url": "https://mypetid.vercel.app/features",
        "publisher": {
          "@type": "Organization",
          "url": "https://mypetid.vercel.app"
        },
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "MyPetID Features",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Secure Document Storage",
            "description": "Keep all your pet's documents secure and accessible anytime, anywhere."
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Vaccination Tracking",
            "description": "Never miss an important vaccination with reminders and history tracking."
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Health Records",
            "description": "Store complete medical histories, vet visit notes, and prescriptions."
          }
        ]
      }
    ],
    pricing: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Pricing - MyPetID",
        "description": "Choose the right MyPetID plan for your needs. Compare our Free and Premium plans.",
        "url": "https://mypetid.vercel.app/pricing",
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "MyPetID Premium",
        "description": "Advanced pet document management with unlimited storage and priority support",
        "offers": {
          "@type": "Offer",
          "price": "9.99",
          "priceCurrency": "USD",
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
          "availability": "https://schema.org/InStock"
        }
      }
    ],
    about: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "About MyPetID",
        "description": "Learn about MyPetID's mission to simplify pet document management for pet owners.",
        "url": "https://mypetid.vercel.app/about",
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      }
    ],
    contact: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Contact MyPetID",
        "description": "Contact the MyPetID team for support, feedback, or partnership inquiries.",
        "url": "https://mypetid.vercel.app/contact",
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact MyPetID",
        "description": "Contact information for MyPetID support and inquiries",
        "url": "https://mypetid.vercel.app/contact"
      }
    ],
    faq: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Frequently Asked Questions - MyPetID",
        "description": "Find answers to common questions about MyPetID's features, pricing, and account management.",
        "url": "https://mypetid.vercel.app/faq",
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://mypetid.vercel.app"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is MyPetID?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MyPetID is a secure platform for storing and managing your pet's documents, including health records, vaccination certificates, and important information."
            }
          },
          {
            "@type": "Question",
            "name": "How much does MyPetID cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MyPetID offers a free plan with basic features and a premium plan starting at $9.99/month with advanced features like unlimited storage and priority support."
            }
          }
        ]
      }
    ]
  };

  // Return combined schemas
  return [...baseSchemas, ...(pageSpecificSchemas[pageType] || [])];
}
