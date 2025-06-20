
import React from "react";
import AboutPage from "./about/AboutPage";

/**
 * About Page - Refactored wrapper
 * 
 * This component maintains backward compatibility while delegating
 * to the new refactored AboutPage component structure.
 */
const About: React.FC = () => {
  return <AboutPage />;
};

export default About;
