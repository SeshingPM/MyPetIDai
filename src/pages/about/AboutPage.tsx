
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EnhancedSEO from "@/components/seo/EnhancedSEO";
import { useAboutPageSEO } from "./hooks/useAboutPageSEO";
import AboutPageContent from "./components/AboutPageContent";

/**
 * About Page Component - Redesigned
 *
 * This page showcases the team, mission, and story behind My Pet ID,
 * starting with team information to build trust and credibility.
 * Optimized for SEO with comprehensive structured data and metadata.
 */
const AboutPage: React.FC = () => {
  const location = useLocation();
  const seoProps = useAboutPageSEO(location.pathname);

  useEffect(() => {
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
    
    // Add smooth scrolling for anchor links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial hash if present
    if (location.hash) {
      setTimeout(handleHashChange, 100);
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]);

  return (
    <>
      <EnhancedSEO {...seoProps} />
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="pt-16 flex-grow">
          <AboutPageContent />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;