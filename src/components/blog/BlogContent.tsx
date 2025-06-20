
import React from 'react';
import { BlogPost } from '@/data/blogData';
import BlogPostPage from '@/components/blog/BlogPost';
import BlogSEO from '@/components/blog/BlogSEO';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface BlogContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const BlogContent: React.FC<BlogContentProps> = ({ post, relatedPosts }) => {
  return (
    <>
      <BlogSEO post={post} />
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        <BlogPostPage post={post} relatedPosts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
};

export default BlogContent;
