
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useScrollNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle smooth scroll to sections on any page
  const scrollToSection = (sectionId: string) => {
    // First try to find the element on the current page
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Element exists on current page, scroll to it
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname !== '/') {
      // If we're not on the homepage and the element isn't found,
      // navigate to homepage with hash
      navigate(`/#${sectionId}`);
    }
  };

  return {
    isScrolled,
    scrollToSection
  };
}
