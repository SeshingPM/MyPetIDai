
import React from 'react';
import { BlogPost } from '@/data/blogData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-responsive';
import { processBlogContent, formatBlogDate } from './utils/BlogContentProcessor';
import BlogPostHeader from './BlogPostHeader';
import TableOfContents from './TableOfContents';
import BlogTagsList from './BlogTagsList';
import AuthorBio from './AuthorBio';
import ShareSection from './ShareSection';
import RelatedPosts from './RelatedPosts';
// BlogSubscribeCard removed - no longer needed

interface BlogPostPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, relatedPosts }) => {
  const isMobile = useIsMobile();
  
  // Process content to extract headings and add IDs
  const { html: processedContent, headings } = processBlogContent(post.content);
  
  return (
    <article className="container-max py-10" itemScope itemType="https://schema.org/BlogPosting">
      <meta itemProp="headline" content={post.title} />
      <meta itemProp="author" content={post.author.name} />
      <meta itemProp="datePublished" content={post.date} />
      <meta itemProp="image" content={post.image} />
      
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Button variant="ghost" asChild className="mb-6 text-gray-600 hover:text-primary">
        <Link to="/blog" className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to blog
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <BlogPostHeader post={post} formatDate={formatBlogDate} />
          
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
              itemProp="image"
              loading="eager" 
              fetchPriority="high"
            />
          </div>
          
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed font-medium bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              {post.excerpt}
            </p>
          </div>
          
          {isMobile && <TableOfContents headings={headings} isMobile={true} />}
          
          <div 
            className="prose prose-lg md:prose-xl max-w-none mb-10 prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-10 prose-headings:mb-5 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-6 prose-li:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-strong:font-bold prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-table:border-collapse prose-th:bg-gray-100 prose-th:p-2 prose-td:border prose-td:p-2 prose-ul:list-disc prose-ol:list-decimal" 
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
          
          <BlogTagsList tags={post.tags} />
          <AuthorBio author={post.author} />
          <ShareSection />
        </div>
        
        {!isMobile && (
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
              {/* Subscribe card removed */}
            </div>
          </aside>
        )}
      </div>
      
      <RelatedPosts posts={relatedPosts} formatDate={formatBlogDate} />
    </article>
  );
};

export default BlogPostPage;
