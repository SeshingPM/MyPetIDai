
/**
 * Generate blog post schema
 */
export const generateBlogPostSchema = (post: {
  title: string,
  description: string,
  publishDate: string,
  modifiedDate?: string,
  imageUrl: string,
  authorName: string,
  url: string
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.imageUrl,
    "datePublished": post.publishDate,
    "dateModified": post.modifiedDate || post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "PetDocument",
      "logo": {
        "@type": "ImageObject",
        "url": "https://petdocument.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url
    }
  };
};
