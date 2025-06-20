/**
 * Generate SoftwareApplication schema that emphasizes pet document management features
 * This schema is designed to enhance indexing for key terms like "pet documents",
 * "pet health records", and "vaccination reminders for pets"
 */
export const generateSoftwareAppSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PetDocument - Pet Document Management System",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "256",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Comprehensive pet health records management",
      "Vaccination records and reminders",
      "Secure document storage for pet identification",
      "Medication tracking and alerts",
      "Veterinary appointment scheduling",
      "Health timeline visualization",
    ],
    keywords:
      "pet documents, pet health records, vaccination reminders for pets, pet medical history, pet care reminders, pet document storage, veterinary records management",
    description:
      "PetDocument is a comprehensive pet document management system that securely stores and organizes your pet's health records, vaccination history, medications, and important documents in one place. Get timely reminders for vaccinations, vet appointments, and medications. Access your pet's complete health information anytime, anywhere.",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://petdocument.com/#webpage",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://petdocument.com/#organization",
    },
    url: "https://petdocument.com/",
    downloadUrl: "https://petdocument.com/download",
    screenshot: "https://petdocument.com/images/app-screenshot.jpg",
    softwareHelp: {
      "@type": "CreativeWork",
      url: "https://petdocument.com/faq",
    },
    softwareVersion: "1.5.2",
    releaseNotes: "https://petdocument.com/release-notes",
  };
};
