
import React, { useMemo } from "react";
import SEO from "@/components/seo/SEO";
import { BlogPost } from "@/data/blogData";
import { generateBlogPostSchema } from "@/lib/schema/blog";

interface BlogSEOProps {
  post: BlogPost;
}

const BlogSEO: React.FC<BlogSEOProps> = ({ post }) => {
  // Generate optimized schema markup for the blog post
  const blogPostSchema = useMemo(() => {
    if (!post) return [];

    // Create a combined schema object with enhanced metadata
    return [generateBlogPostSchema({
      title: post.title,
      description: post.excerpt,
      publishDate: post.date, // Use 'date' property from BlogPost
      modifiedDate: new Date().toISOString().split("T")[0],
      imageUrl: post.image,
      authorName: typeof post.author === 'string' ? post.author : post.author.name, // Handle BlogAuthor type
      url: `https://petdocument.com/blog/${post.slug}`
    })];
  }, [post]);

  // Define language alternatives based on the post slug
  const alternateLanguages = useMemo(() => {
    if (!post) return [];
    return [
      { lang: "es-ES", url: `https://petdocument.com/es/blog/${post.slug}` },
      { lang: "fr-FR", url: `https://petdocument.com/fr/blog/${post.slug}` },
      { lang: "de-DE", url: `https://petdocument.com/de/blog/${post.slug}` },
    ];
  }, [post]);

  // Define mobile app configuration with deep linking
  const mobileAppConfig = useMemo(() => {
    if (!post) return undefined;
    return {
      appName: "PetDocument",
      appUrl: `petdocument://blog/${post.slug}`,
    };
  }, [post]);

  // Define assets to preload for performance optimization
  const preloadAssets = useMemo(() => {
    if (!post) return [];
    return [
      {
        href: post.image,
        as: "image" as const,
        crossOrigin: true,
        priority: "prefetch" as const,
      },
    ];
  }, [post]);

  return (
    <SEO
      title={`${post.title} | PetDocument Blog`}
      description={post.excerpt}
      keywords={post.tags.join(", ")}
      canonicalUrl={`https://petdocument.com/blog/${post.slug}`}
      ogType="article"
      ogImage={post.image}
      schema={blogPostSchema}
      lang="en-US"
      alternateLanguages={alternateLanguages}
      mobileAppConfig={mobileAppConfig}
      preloadAssets={preloadAssets}
      preconnectUrls={[
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ]}
    />
  );
};

export default BlogSEO;
