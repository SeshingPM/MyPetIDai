
// Export all schema generators from individual files
export * from './blog';
export * from './breadcrumb';
export * from './faq';
export * from './organization';
export * from './software';
export * from './website';

// Import schema generators for use in the generateSchemaByPageType function
import { generateWebsiteSchema } from './website';
import { generateOrganizationSchema } from './organization';
import { generateBreadcrumbSchema } from './breadcrumb';
import { generateBlogPostSchema } from './blog';
import { generateFAQSchema } from './faq';
import { generateSoftwareAppSchema } from './software';

/**
 * Generate schema data based on page type
 */
export const generateSchemaByPageType = (
  pageType: 'home' | 'blog' | 'blogPost' | 'faq' | 'about' | 'contact',
  pageData?: any
) => {
  const schemas = [];
  
  // Always include organization data
  schemas.push(generateOrganizationSchema());
  
  // Add page-specific schema
  switch (pageType) {
    case 'home':
      schemas.push(generateWebsiteSchema());
      schemas.push(generateSoftwareAppSchema());
      break;
      
    case 'blog':
      schemas.push(generateWebsiteSchema());
      // Add breadcrumb
      schemas.push(generateBreadcrumbSchema([
        { name: 'Home', url: 'https://petdocument.com/' },
        { name: 'Blog', url: 'https://petdocument.com/blog' }
      ]));
      break;
      
    case 'blogPost':
      if (pageData?.post) {
        // Add blog post schema
        schemas.push(generateBlogPostSchema({
          title: pageData.post.title,
          description: pageData.post.excerpt,
          publishDate: pageData.post.date,
          imageUrl: pageData.post.image,
          authorName: pageData.post.author.name,
          url: `https://petdocument.com/blog/${pageData.post.slug}`
        }));
        
        // Add breadcrumb
        schemas.push(generateBreadcrumbSchema([
          { name: 'Home', url: 'https://petdocument.com/' },
          { name: 'Blog', url: 'https://petdocument.com/blog' },
          { name: pageData.post.title, url: `https://petdocument.com/blog/${pageData.post.slug}` }
        ]));
      }
      break;
      
    case 'faq':
      if (pageData?.faqs) {
        schemas.push(generateFAQSchema(pageData.faqs));
      }
      // Add breadcrumb
      schemas.push(generateBreadcrumbSchema([
        { name: 'Home', url: 'https://petdocument.com/' },
        { name: 'FAQ', url: 'https://petdocument.com/faq' }
      ]));
      break;
      
    case 'about':
      // Add breadcrumb for about page
      schemas.push(generateBreadcrumbSchema([
        { name: 'Home', url: 'https://petdocument.com/' },
        { name: 'About', url: 'https://petdocument.com/about' }
      ]));
      break;
      
    case 'contact':
      // Add breadcrumb for contact page
      schemas.push(generateBreadcrumbSchema([
        { name: 'Home', url: 'https://petdocument.com/' },
        { name: 'Contact', url: 'https://petdocument.com/contact' }
      ]));
      break;
  }
  
  return schemas;
};
