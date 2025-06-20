import React from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useBlogPost } from '@/components/blog/hooks/useBlogPost';
import BlogLoading from '@/components/blog/BlogLoading';
import BlogError from '@/components/blog/BlogError';
import BlogContent from '@/components/blog/BlogContent';

const BlogPost = () => {
  // Redirect to homepage since this section is temporarily removed
  return <Navigate to="/" replace />;
  
  // Keep original implementation commented out for future use
  /*
  const { slug } = useParams<{ slug: string }>();
  const { post, relatedPosts, isLoading, hasError } = useBlogPost(slug);
  
  if (isLoading) {
    return <BlogLoading />;
  }
  
  if (hasError || !post) {
    return <BlogError hasError={hasError} />;
  }

  return <BlogContent post={post} relatedPosts={relatedPosts} />;
  */
};

export default BlogPost;
