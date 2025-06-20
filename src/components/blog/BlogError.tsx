
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';
import { Link } from 'react-router-dom';

interface BlogErrorProps {
  hasError: boolean;
}

const BlogError: React.FC<BlogErrorProps> = ({ hasError }) => {
  return (
    <>
      <SEO 
        title="Post Not Found | PetDocument Blog"
        description="The requested blog post could not be found."
        keywords="pet blog"
        canonicalUrl="https://petdocument.com/blog"
        ogType="article"
        lang="en-US"
      />
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-4">The blog post you're looking for could not be found.</p>
          <p className="text-sm text-gray-500">Technical info: {hasError ? "Error loading data" : "Post not found in data source"}</p>
          <div className="mt-8">
            <Link to="/blog" className="text-blue-500 hover:underline">Return to blog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogError;
