
import React, { useMemo } from "react";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { getPageSeoConfig, defaultSeoConfig } from "@/config/seo-config";
import { generateSchemaByPageType } from "@/lib/schema";

const Contact: React.FC = () => {
  const location = useLocation();
  
  // Create SEO props using our consistent pattern
  const seoProps = useMemo(() => {
    // Get base configuration for the page
    const pageConfig = getPageSeoConfig('contact');
    
    // Define structured data for the contact page - optimized for pet document related searches
    const baseSchema = generateSchemaByPageType("contact");
    
    const contactStructuredData = [
      ...baseSchema,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact My Pet ID Support",
        "description": "Get in touch with the My Pet ID team for any questions about pet document management, veterinary record keeping, or vaccination tracking.",
        "url": "https://mypetid.ai/contact"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "My Pet ID",
        "url": "https://mypetid.ai",
        "logo": "https://mypetid.ai/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-123-4567",
          "contactType": "customer service",
          "availableLanguage": ["English"],
          "contactOption": "TollFree",
          "areaServed": "Worldwide",
          "productSupported": "Pet document management system, pet health records, vaccination tracking"
        }
      }
    ];

    // Create the full canonical URL
    const canonicalUrl = pageConfig.canonicalUrl || `${defaultSeoConfig.canonicalUrl}${location.pathname}`;
    
    // Add breadcrumbs for the page
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" }
    ];
    
    // FAQ items for the Contact page
    const faqItems = [
      {
        question: "How can I contact My Pet ID support?",
        answer: "You can contact our support team by filling out the contact form on this page, emailing us at support@mypetid.ai, or calling our toll-free number at +1-555-123-4567."
      },
      {
        question: "What are your support hours?",
        answer: "Our support team is available Monday through Friday from 9 AM to 6 PM Eastern Time. We typically respond to all inquiries within 24 hours."
      },
      {
        question: "Can I request a feature for My Pet ID?",
        answer: "Absolutely! We welcome feature requests and feedback from our users. Please use the contact form and select 'Feature Request' from the dropdown menu."
      }
    ];
    
    // Assets to preload
    const preloadAssets = [
      {
        href: "/images/contact-support.jpg",
        as: "image" as const,
        fetchPriority: "high" as const
      }
    ];

    // Compile all SEO props
    return {
      title: pageConfig.title || "Contact My Pet ID Support - Pet Document Management Assistance",
      description: pageConfig.description || "Need help with your pet documents, veterinary records, or vaccination tracking? Contact the My Pet ID support team for assistance with all your pet health management needs.",
      keywords: pageConfig.keywords || "pet document contact, pet health records help, veterinary document assistance, vaccination tracking support, pet document customer service, pet medical records help",
      canonicalUrl,
      ogType: "website",
      ogImage: pageConfig.ogImage || "/images/contact-support.jpg",
      structuredData: contactStructuredData.map(schema => ({
        type: schema["@type"],
        data: { ...schema }
      })),
      breadcrumbs,
      alternateLanguages: [
        { lang: "es", url: "https://mypetid.ai/es/contact" },
        { lang: "fr", url: "https://mypetid.ai/fr/contact" },
        { lang: "de", url: "https://mypetid.ai/de/contact" }
      ],
      faqItems,
      preloadAssets
    };
  }, [location.pathname]);
  
  return (
    <>
      <EnhancedSEO {...seoProps} />

      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="container-max px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Contact Us
            </h1>

            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in">
              Have questions, suggestions, or feedback about My Pet ID? We'd
              love to hear from you! We welcome all input on features you'd like
              to see or how we can improve. We're here to support your pet care
              journey and grow together.
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="md:w-1/3 w-full">
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-gradient-to-br from-white to-blue-50">
                  <ContactInfoSection />
                </Card>
              </div>
              <div className="md:w-2/3 w-full">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-gradient-to-br from-white to-purple-50/80">
                  <ContactForm />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
