# Next.js Migration Plan: Incremental Approach Starting with Blog

## Overview

This document outlines a comprehensive plan for migrating the PetDocument application from Vite/React to Next.js using an incremental approach. We'll start with the blog section to demonstrate SEO improvements quickly while minimizing risk.

Based on our SEO analysis, we recommend using the subdirectory approach (`petdocument.com/blog`) rather than a subdomain for optimal SEO performance, though we'll outline both implementation methods.

## Migration Strategy

### Phase 1: Blog Migration
Migrate the blog to Next.js while keeping the rest of the application on the current Vite/React stack.

### Phase 2: Marketing Pages
Expand the Next.js application to include static marketing pages (home, about, features, etc.).

### Phase 3: Authentication & User Features
Migrate user authentication and core features to Next.js.

### Phase 4: Complete Migration
Finalize the migration by moving any remaining features and removing the old application.

## Phase 1: Blog Migration - Detailed Plan

### Week 1: Setup and Initial Implementation

#### Day 1-2: Project Setup
- Create new Next.js project with TypeScript and Tailwind CSS
- Configure environment variables
- Set up Supabase client for Next.js
- Configure routing based on chosen approach (subdirectory or subdomain)

#### Day 3-5: Core Blog Functionality
- Implement blog listing page with SSG/ISR
- Implement individual blog post pages
- Set up dynamic metadata for SEO
- Implement structured data (JSON-LD)

### Week 2: Integration and Optimization

#### Day 1-2: Styling and Components
- Migrate shared components needed for blog
- Ensure consistent styling with main application
- Implement responsive design

#### Day 3-4: SEO Optimization
- Implement canonical URLs
- Set up sitemap generation
- Configure metadata for social sharing
- Implement image optimization with Next.js Image

#### Day 5: Testing and QA
- Test all blog functionality
- Verify SEO implementation
- Test performance and Core Web Vitals

### Week 3: Deployment and Monitoring

#### Day 1-2: Deployment Setup
- Configure deployment pipeline (preferably on Vercel)
- Set up environment variables in production
- Configure routing/proxy based on chosen approach

#### Day 3-4: Monitoring and Analytics
- Set up analytics to track blog performance
- Configure monitoring for Core Web Vitals
- Establish SEO performance baseline

#### Day 5: Documentation and Handoff
- Document the implementation
- Create guidelines for content management
- Train team on the new system

## Technical Implementation Options

### Option 1: Subdirectory Approach (Recommended for SEO)

Using this approach, the blog will remain at `petdocument.com/blog` but will be served by the Next.js application.

#### DNS Configuration
- Keep existing DNS configuration pointing to your main server/proxy

#### Proxy Configuration (Nginx Example)
```nginx
server {
  listen 80;
  server_name petdocument.com;
  
  # Route /blog requests to the Next.js application
  location /blog {
    proxy_pass http://nextjs-blog-app:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  
  # Route all other requests to the existing Vite application
  location / {
    proxy_pass http://vite-app:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

#### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  basePath: '/blog',
  trailingSlash: false,
  
  // Optional: Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? '/blog' : '',
}
```

### Option 2: Subdomain Approach (Simpler Implementation)

Using this approach, the blog will be served at `blog.petdocument.com` by the Next.js application.

#### DNS Configuration
```
petdocument.com      → Points to existing Vite application
blog.petdocument.com → Points to Next.js blog application
```

#### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  // No basePath needed
  trailingSlash: false,
  
  // Optional: Configure image domains
  images: {
    domains: ['petdocument.com'],
  },
}
```

## Next.js Blog Implementation

### Directory Structure
```
├── app/
│   ├── layout.tsx           # Main layout with header/footer
│   ├── page.tsx             # Blog index page
│   └── [slug]/              # Dynamic blog post routes
│       └── page.tsx         # Individual blog post page
├── components/              # Shared components
├── lib/
│   └── supabase.ts          # Supabase client
└── public/                  # Static assets
```

### Blog Index Page
```tsx
// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Blog | PetDocument',
  description: 'Latest articles and guides for pet owners',
};

export default async function BlogIndex() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">PetDocument Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.featured_image && (
              <div className="relative h-48 w-full">
                <Image 
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-2">
                {formatDate(post.published_at)}
              </p>
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link 
                href={`/${post.slug}`} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Blog Post Page
```tsx
// app/[slug]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase.from('blog_posts').select('slug');
  
  return posts?.map(post => ({
    slug: post.slug,
  })) || [];
}

export async function generateMetadata({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} | PetDocument Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      images: [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
    },
  };
}

export default async function BlogPost({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  if (!post) return notFound();
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-8">
          <p className="text-gray-600">
            Published on {formatDate(post.published_at)}
          </p>
          {post.author && (
            <p className="text-gray-600 ml-4">
              by {post.author}
            </p>
          )}
        </div>
        
        {post.featured_image && (
          <div className="relative h-96 w-full mb-8">
            <Image 
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}
```

### Supabase Client Setup
```tsx
// lib/supabase.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createServerSupabase() {
  return createServerComponentClient({ cookies });
}

export function createClientSupabase() {
  return createClientComponentClient();
}
```

## SEO Implementation

### Sitemap Generation
```tsx
// app/sitemap.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function sitemap() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at');
  
  const blogEntries = posts?.map(post => ({
    url: `https://petdocument.com/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || [];
  
  return [
    {
      url: 'https://petdocument.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogEntries,
  ];
}
```

### Structured Data (JSON-LD)
```tsx
// components/BlogJsonLd.tsx
export default function BlogJsonLd({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PetDocument',
      logo: {
        '@type': 'ImageObject',
        url: 'https://petdocument.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://petdocument.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

## Performance Optimization

### Image Optimization
Use Next.js Image component for all images to benefit from:
- Automatic WebP/AVIF conversion
- Responsive sizing
- Lazy loading
- Preventing layout shifts with proper sizing

### Font Optimization
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Deployment Strategy

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Set up custom domain or subdomain
4. Configure build settings

### Custom Server Deployment
1. Build the Next.js application: `next build`
2. Start the production server: `next start`
3. Use PM2 or similar for process management
4. Configure Nginx as described in the implementation options

## Measuring Success

Track these metrics to demonstrate the value of the migration:

### SEO Metrics
- Search engine rankings for key terms
- Organic traffic to blog content
- Click-through rates from search results
- Indexing status in Google Search Console

### Performance Metrics
- Core Web Vitals scores
- Page load times
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

### User Engagement
- Time on page
- Bounce rate
- Pages per session
- Conversion rates from blog traffic

## Estimated Timeline and Resources

### Total Estimated Timeline
- **Phase 1 (Blog Migration)**: 2-3 weeks with 1 developer
- **Phase 2 (Marketing Pages)**: 2-3 weeks with 1 developer
- **Phase 3 (Authentication & User Features)**: 3-4 weeks with 1-2 developers
- **Phase 4 (Complete Migration)**: 2-3 weeks with 1-2 developers

**Total**: 9-13 weeks for complete migration

This timeline can be compressed with additional developers working in parallel.

## Next Steps

1. **Choose implementation approach** (subdirectory vs. subdomain)
2. **Audit current blog implementation** to understand structure and dependencies
3. **Set up development environment** for Next.js
4. **Create proof-of-concept** with a few sample blog posts
5. **Measure current SEO performance** to establish baseline

## Conclusion

This incremental migration approach starting with the blog allows you to:
1. Demonstrate SEO improvements quickly
2. Minimize risk by starting with a contained section
3. Learn Next.js patterns before tackling more complex features
4. Maintain the existing application while migration is in progress

The subdirectory approach (`petdocument.com/blog`) is recommended for optimal SEO performance, though it requires more complex routing configuration. The subdomain approach (`blog.petdocument.com`) offers simpler implementation but with potential SEO trade-offs.

By following this plan, you can provide your client with the "BulletProof SEO" they're looking for while managing the migration in a controlled, low-risk manner.