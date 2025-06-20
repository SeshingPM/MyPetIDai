
import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQSidebar from "@/components/faq/FAQSidebar";
import EnhancedFAQContent from "@/components/faq/EnhancedFAQContent";
import { allFAQs as faqData, faqCategories } from "@/data/faqData";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import { motion } from "framer-motion";
import { generateSchemaByPageType } from "@/lib/schema";

const FAQ: React.FC = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Auto-scroll handling
  useEffect(() => {
    if (!location.hash || (location.state && location.state.scrollToTop)) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) setSelectedCategory(null);
  };

  // Filter FAQs based on selected category and search query
  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.answer === "string" &&
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.keywords &&
        faq.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesCategory && matchesSearch;
  });

  // Create SEO props using our enhanced FAQ data
  const seoProps = useMemo(() => {
    const pageConfig = {
      title: "MyPetID FAQ - Pet Digital Identity Questions & Answers",
      description: "Find answers to common questions about creating your pet's digital identity, managing pet health records, and using MyPetID.ai's free pet management platform.",
      keywords: "pet digital identity FAQ, MyPetID questions, pet health records help, free pet management platform, pet care organization, veterinary document sharing",
      canonicalUrl: "https://mypetid.ai/faq",
      ogType: "website",
      ogImage: "/images/faq-cover.jpg"
    };
    
    const baseSchema = generateSchemaByPageType("faq");
    
    const faqItems = filteredFAQs.slice(0, 20).map((faq) => ({
      question: faq.question,
      answer: typeof faq.answer === "string" ? faq.answer.replace(/\n\n/g, " ").replace(/\n•/g, " -") : "See the answer on our website."
    }));
    
    const structuredData = [
      ...baseSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageConfig.title,
        description: pageConfig.description,
        keywords: pageConfig.keywords,
        url: pageConfig.canonicalUrl,
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebSite",
          name: "MyPetID.ai",
          url: "https://mypetid.ai"
        },
        about: {
          "@type": "Thing",
          name: "Pet Digital Identity Management",
          description: "Creating and managing digital identities for pets"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map(item => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ];
    
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "FAQ", url: "/faq" }
    ];
    
    const preloadAssets = [
      {
        href: "/images/faq-cover.jpg",
        as: "image" as const,
        fetchPriority: "high" as const
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
      breadcrumbs,
      alternateLanguages: [
        { lang: "es", url: "https://mypetid.ai/es/faq" },
        { lang: "fr", url: "https://mypetid.ai/fr/faq" }
      ],
      faqItems: faqItems.slice(0, 10),
      preloadAssets
    };
  }, [filteredFAQs]);

  const selectedCategoryData = selectedCategory
    ? faqCategories.find((cat) => cat.id === selectedCategory)
    : null;

  return (
    <>
      <EnhancedSEO {...seoProps} />

      <div className="min-h-screen bg-white">
        <Header />

        {/* Compact Hero Section */}
        <section className="relative py-8 md:py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container-max relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Help Center
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about creating your pet's digital identity, 
                managing health records, and using MyPetID.ai effectively.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main FAQ Content - No extra padding */}
        <main className="container-max py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FAQSidebar
                categories={faqCategories}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={handleSelectCategory}
                onSearch={handleSearch}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <EnhancedFAQContent
                faqs={filteredFAQs}
                allFaqs={faqData}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                categoryTitle={selectedCategoryData?.title}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;