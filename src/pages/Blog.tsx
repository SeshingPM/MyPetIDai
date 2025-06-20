import React, { useState, useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogLayout from '@/components/blog/BlogLayout';
import { blogData } from '@/data/blogData';
import { toast } from 'sonner';
import { generateSchemaByPageType } from '@/lib/schema';
import { Navigate } from 'react-router-dom';

const Blog = () => {
  // Redirect to homepage since this section is temporarily removed
  return <Navigate to="/" replace />;

  // Keep the original implementation commented out for future use
  /*
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [posts, setPosts] = useState(blogData || []);

  // Generate structured data for blog listing page
  const blogSchema = generateSchemaByPageType('blog');

  // Define language alternatives
  const alternateLanguages = [
    { lang: 'es-ES', url: 'https://mypetid.vercel.app/es/blog' },
    { lang: 'fr-FR', url: 'https://mypetid.vercel.app/fr/blog' },
    { lang: 'de-DE', url: 'https://mypetid.vercel.app/de/blog' }
  ];

  // Define mobile app configuration
  const mobileAppConfig = {
    appName: 'MyPetID',
    appUrl: 'mypetid://blog'
  };

  useEffect(() => {
    console.log("Blog component mounted");
    console.log("Raw blogData:", blogData);
    console.log("BlogData type:", typeof blogData);
    
    try {
      if (!blogData) {
        console.error("Blog data is undefined");
        setHasError(true);
        toast.error("Error loading blog posts");
      } else if (!Array.isArray(blogData)) {
        console.error("Blog data is not an array:", blogData);
        setHasError(true);
        toast.error("Error loading blog posts");
      } else {
        console.log("Blog data array length:", blogData.length);
        if (blogData.length > 0) {
          console.log("First post sample:", blogData[0]);
          setPosts(blogData);
        } else {
          console.warn("Blog data array is empty");
        }
      }
    } catch (error) {
      console.error("Error processing blog data:", error);
      setHasError(true);
      toast.error("Error loading blog posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <>
        <SEO 
          title="Pet Care Blog | MyPetID" 
          description="Loading our pet care articles and resources..."
          canonicalUrl="https://mypetid.vercel.app/blog"
          ogType="blog"
          schema={blogSchema}
          lang="en-US"
          alternateLanguages={alternateLanguages}
          mobileAppConfig={mobileAppConfig}
        />
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Blog Posts</h1>
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Show error state
  if (hasError || posts.length === 0) {
    return (
      <>
        <SEO 
          title="Pet Care Blog | MyPetID" 
          description="Expert pet care tips, health advice, and the latest news from the MyPetID team."
          keywords="pet care, pet health, pet tips, MyPetID blog"
          canonicalUrl="https://mypetid.vercel.app/blog"
          ogType="blog"
          schema={blogSchema}
          lang="en-US"
          alternateLanguages={alternateLanguages}
          mobileAppConfig={mobileAppConfig}
        />
        <Header />
        <main className="pt-20 min-h-screen">
          <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Blog</h1>
            <p className="mb-4">No blog posts are currently available. Please check back later.</p>
            <p className="text-sm text-gray-500">Technical info: {hasError ? "Error loading data" : "No posts found in data source"}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Normal render with data
  return (
    <>
      <SEO 
        title="Pet Care Blog | MyPetID" 
        description="Expert pet care tips, health advice, and the latest news from the MyPetID team."
        keywords="pet care, pet health, pet tips, MyPetID blog"
        canonicalUrl="https://mypetid.vercel.app/blog"
        ogType="blog"
        schema={blogSchema}
        lang="en-US"
        alternateLanguages={alternateLanguages}
        mobileAppConfig={mobileAppConfig}
      />
      <Header />
      <main className="pt-20 min-h-screen">
        <BlogLayout posts={posts} />
      </main>
      <Footer />
    </>
  );
  */
};

export default Blog;
