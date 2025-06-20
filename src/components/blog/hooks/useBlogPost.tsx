
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogData, BlogPost } from '@/data/blogData';
import { toast } from 'sonner';
import { generateSchemaByPageType } from '@/lib/schema';

export function useBlogPost(slug: string | undefined) {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [posts, setPosts] = useState(blogData || []);
  
  useEffect(() => {
    console.log("BlogPost component loaded with slug:", slug);
    
    try {
      if (!blogData) {
        console.error("Blog data is undefined in BlogPost");
        setHasError(true);
        toast.error("Error loading blog post");
      } else if (!Array.isArray(blogData)) {
        console.error("Blog data is not an array in BlogPost:", blogData);
        setHasError(true);
        toast.error("Error loading blog post");
      } else {
        console.log("Blog data array length:", blogData.length);
        if (blogData.length > 0) {
          console.log("First post sample:", blogData[0]);
          setPosts(blogData);
        }
      }
    } catch (error) {
      console.error("Error processing blog data in BlogPost:", error);
      setHasError(true);
      toast.error("Error loading blog post");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const post = useMemo(() => {
    if (!Array.isArray(posts) || !slug) {
      console.error("Cannot find post: posts is not an array or slug is missing");
      return null;
    }
    
    const foundPost = posts.find(p => p.slug === slug);
    console.log("Found post for slug:", foundPost ? "Yes" : "No");
    return foundPost;
  }, [slug, posts]);

  // Find related posts based on category and tags
  const relatedPosts = useMemo(() => {
    if (!post || !Array.isArray(posts)) {
      return [];
    }

    // Find posts with similar category or tags, excluding the current post
    return posts
      .filter(p => 
        p.id !== post.id && 
        (p.category === post.category || 
         p.tags.some(tag => post.tags.includes(tag)))
      )
      .slice(0, 3); // Limit to 3 related posts
  }, [post, posts]);

  // Check if post exists after loading completes
  useEffect(() => {
    if (!isLoading && (!slug || !post)) {
      console.log("Post not found, redirecting to 404");
      navigate('/not-found', { replace: true });
    }
  }, [slug, post, navigate, isLoading]);

  return {
    post,
    relatedPosts,
    isLoading,
    hasError
  };
}
