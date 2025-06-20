
import React from 'react';

export interface ProcessedContent {
  html: string;
  headings: string[];
}

export const processBlogContent = (content: string): ProcessedContent => {
  // Extract headings for table of contents
  const headingRegex = /<h2>(.*?)<\/h2>/g;
  const headings: string[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1]);
  }
  
  // Process content to add IDs to headings for linking
  const processedHtml = content.replace(/<h2>(.*?)<\/h2>/g, (match, heading) => {
    const id = heading.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    return `<h2 id="${id}" class="scroll-mt-24">${heading}</h2>`;
  });
  
  return {
    html: processedHtml,
    headings
  };
};

// Format date helper
export const formatBlogDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
