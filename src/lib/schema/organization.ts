
/**
 * Generate organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PetDocument",
    "url": "https://petdocument.com",
    "logo": "https://petdocument.com/logo.png",
    "sameAs": [
      "https://twitter.com/petdocument",
      "https://facebook.com/petdocument",
      "https://instagram.com/petdocument"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };
};
