
import React from "react";
import AboutHeroRedesigned from "@/components/landing/about/AboutHeroRedesigned";
import CombinedTeamSection from "@/components/landing/about/CombinedTeamSection";
import ConsolidatedStorySection from "@/components/landing/about/sections/ConsolidatedStorySection";
import SimplifiedTechnologySection from "@/components/landing/about/sections/SimplifiedTechnologySection";
import IndustryRecognitionSection from "@/components/landing/about/sections/IndustryRecognitionSection";
import ComparisonTool from "@/components/landing/about/ComparisonTool";
import TestimonialsSection from "@/components/landing/about/TestimonialsSection";
import AboutPageSection from "./AboutPageSection";

const AboutPageContent: React.FC = () => {
  return (
    <article itemScope itemType="https://schema.org/AboutPage" className="flex flex-col">
      {/* Hero Section */}
      <AboutPageSection
        id="about-hero"
        className="py-0 relative"
        ariaLabelledBy="hero-heading"
      >
        <AboutHeroRedesigned />
      </AboutPageSection>

      {/* Team Section - Primary focus, builds trust early */}
      <AboutPageSection
        id="our-team"
        className="py-16 bg-white"
        ariaLabelledBy="team-heading"
      >
        <div itemProp="articleSection">
          <CombinedTeamSection />
        </div>
      </AboutPageSection>

      {/* Consolidated Story & Mission - Our why and values */}
      <AboutPageSection
        id="our-story"
        className="py-0"
        ariaLabelledBy="story-heading"
      >
        <div itemProp="mainContentOfPage">
          <ConsolidatedStorySection />
        </div>
      </AboutPageSection>

      {/* Technology Section - How we deliver value */}
      <AboutPageSection
        id="technology"
        className="py-0"
        ariaLabelledBy="technology-heading"
      >
        <div itemProp="articleSection">
          <SimplifiedTechnologySection />
        </div>
      </AboutPageSection>

      {/* Industry Recognition & Trust - New SEO-rich section */}
      <AboutPageSection
        id="industry-recognition"
        className="py-0"
        ariaLabelledBy="recognition-heading"
      >
        <div itemProp="articleSection">
          <IndustryRecognitionSection />
        </div>
      </AboutPageSection>

      {/* Competitive Advantage - Why choose us */}
      <AboutPageSection
        id="why-choose-us"
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
        ariaLabelledBy="comparison-heading"
      >
        <h2
          id="comparison-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Why Pet Families Choose My Pet ID
          </span>
        </h2>
        <div itemProp="articleSection">
          <ComparisonTool />
        </div>
      </AboutPageSection>

      {/* Testimonials - Social proof and closing */}
      <AboutPageSection
        id="testimonials"
        className="py-16 bg-white"
        ariaLabelledBy="testimonials-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              What Pet Families Say
            </span>
          </h2>
          <div itemProp="reviewBody">
            <TestimonialsSection />
          </div>
        </div>
      </AboutPageSection>
    </article>
  );
};

export default AboutPageContent;