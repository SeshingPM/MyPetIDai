
import { WebSite } from 'schema-dts';

export const generateWebsiteSchema = (): WebSite => {
  // Create a properly typed SearchAction object but with the additional properties we need
  const searchAction = {
    '@type': 'SearchAction',
    target: 'https://petdocument.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  };

  // Create the base website schema
  const websiteSchema: WebSite = {
    '@type': 'WebSite',
    '@id': 'https://petdocument.com/#website',
    name: 'PetDocument',
    url: 'https://petdocument.com/',
    description: 'Secure pet document management system for storing and organizing your pet\'s medical records, vaccinations, and important documents.',
    publisher: {
      '@id': 'https://petdocument.com/#organization'
    },
    potentialAction: [searchAction] as any,
    inLanguage: 'en-US'
  };

  // Add additional properties using type assertion
  // This allows us to include Schema.org properties that aren't in the TypeScript definitions
  return {
    ...websiteSchema,
    additionalType: 'https://schema.org/SoftwareApplication',
    applicationCategory: 'LifestyleApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'PetDocument Features',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Document Storage',
          description: 'Securely store vaccination records, medical history, and important documents in one place.'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Smart Reminders',
          description: 'Set and receive timely reminders for vet appointments, medication schedules, and vaccinations.'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Health Timeline',
          description: 'Visualize your pet\'s complete health history chronologically.'
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Secure Access',
          description: 'Access your pet\'s complete health profile from anywhere, on any device.'
        }
      ]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://petdocument.com/#webpage'
    }
  } as WebSite;
};
