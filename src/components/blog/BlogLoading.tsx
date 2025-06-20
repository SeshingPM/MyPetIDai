
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';

const BlogLoading: React.FC = () => {
  return (
    <>
      <SEO 
        title="Loading Blog Post | PetDocument" 
        description="Loading blog post content..."
        canonicalUrl="https://petdocument.com/blog"
        ogType="article"
        lang="en-US"
      />
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Blog Post</h1>
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogLoading;
