
import React from "react";
import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: string;
  data: Record<string, any>;
}

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: StructuredDataProps[];
  lang?: string;
  alternateLanguages?: Array<{ lang: string; url: string }>;
  noIndex?: boolean;
  noFollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  twitterCardType?: "summary" | "summary_large_image" | "app" | "player";
  mobileAppConfig?: {
    appName?: string;
    appStoreId?: string;
    appStoreUrl?: string;
    playStoreId?: string;
    playStoreUrl?: string;
    appUrl?: string;
  };
  preloadAssets?: Array<{
    href: string;
    as: "font" | "image" | "style" | "script";
    type?: string;
    crossOrigin?: boolean;
    priority?: "preload" | "prefetch";
    fetchPriority?: "high" | "low" | "auto";
  }>;
  preconnectUrls?: string[];
  dnsPrefetchUrls?: string[];
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Enhanced SEO component with improved structured data and meta tags
 * 
 * This component extends the basic SEO component with additional features:
 * - Comprehensive structured data (JSON-LD) support
 * - Improved hreflang implementation for international SEO
 * - Breadcrumb support
 * - FAQ schema support
 * - Enhanced social media tags
 * 
 * @example
 * ```tsx
 * <EnhancedSEO
 *   title="Digital Pet Identity | MyPetID.ai"
 *   description="Create your pet's free digital identity with Pet SSN, secure document storage, and smart health reminders."
 *   canonicalUrl="https://mypetid.ai/features"
 *   alternateLanguages={[
 *     { lang: "es", url: "https://mypetid.ai/es/features" },
 *     { lang: "fr", url: "https://mypetid.ai/fr/features" },
 *     { lang: "de", url: "https://mypetid.ai/de/features" }
 *   ]}
 *   structuredData={[
 *     {
 *       type: "BreadcrumbList",
 *       data: {
 *         itemListElement: [
 *           {
 *             position: 1,
 *             name: "Home",
 *             item: "https://mypetid.ai/"
 *           },
 *           {
 *             position: 2,
 *             name: "Features",
 *             item: "https://mypetid.ai/features"
 *           }
 *         ]
 *       }
 *     }
 *   ]}
 * />
 * ```
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = "/og-image.png",
  structuredData = [],
  lang = "en-US",
  alternateLanguages = [],
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  author = "MyPetID.ai",
  category,
  tags = [],
  twitterCardType = "summary_large_image",
  mobileAppConfig,
  preloadAssets = [],
  preconnectUrls = [],
  dnsPrefetchUrls = [],
  breadcrumbs = [],
  faqItems = [],
}) => {
  // Append site name to title if not already included
  const fullTitle = title.includes("MyPetID.ai")
    ? title
    : `${title} | MyPetID.ai`;

  // Generate absolute URL for OG image
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `https://mypetid.ai${ogImage}`;

  // Generate absolute canonical URL
  const absoluteCanonicalUrl = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `https://mypetid.ai${canonicalUrl}`
    : "https://mypetid.ai";

  // Generate robots meta content
  const robotsContent = `${noIndex ? "noindex" : "index"}, ${
    noFollow ? "nofollow" : "follow"
  }, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;

  // Generate structured data
  const allStructuredData = [...structuredData];

  // Add WebSite schema if not already included
  if (!allStructuredData.some((sd) => sd.type === "WebSite")) {
    allStructuredData.push({
      type: "WebSite",
      data: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "MyPetID.ai",
        url: "https://mypetid.ai",
        description:
          "Create your pet's free digital identity with unique Pet SSN. Secure document storage, smart health reminders, and instant sharing — all completely free forever.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://mypetid.ai/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    });
  }

  // Add Organization schema if not already included
  if (!allStructuredData.some((sd) => sd.type === "Organization")) {
    allStructuredData.push({
      type: "Organization",
      data: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MyPetID.ai",
        url: "https://mypetid.ai",
        logo: "https://mypetid.ai/logo.png",
        sameAs: [
          "https://facebook.com/MyPetIDai",
          "https://twitter.com/mypetidai",
          "https://instagram.com/mypetidai",
        ],
      },
    });
  }

  // Add BreadcrumbList schema if breadcrumbs are provided
  if (
    breadcrumbs.length > 0 &&
    !allStructuredData.some((sd) => sd.type === "BreadcrumbList")
  ) {
    allStructuredData.push({
      type: "BreadcrumbList",
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url.startsWith("http")
            ? crumb.url
            : `https://petdocument.com${crumb.url}`,
        })),
      },
    });
  }

  // Add FAQ schema if FAQ items are provided
  if (
    faqItems.length > 0 &&
    !allStructuredData.some((sd) => sd.type === "FAQPage")
  ) {
    allStructuredData.push({
      type: "FAQPage",
      data: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    });
  }

  return (
    <Helmet htmlAttributes={{ lang: lang.substring(0, 2) }}>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0"
      />
      <meta charSet="UTF-8" />

      {/* Robots Meta Tag */}
      <meta name="robots" content={robotsContent} />

      {/* Performance Optimization - Resource Hints */}
      {preconnectUrls.map((url, index) => (
        <link
          key={`preconnect-${index}`}
          rel="preconnect"
          href={url}
          crossOrigin=""
        />
      ))}

      {dnsPrefetchUrls.map((url, index) => (
        <link key={`dns-prefetch-${index}`} rel="dns-prefetch" href={url} />
      ))}

      {/* Resource loading strategy based on priority */}
      {preloadAssets.map((asset, index) => (
        <link
          key={`resource-${index}`}
          rel={asset.priority || "prefetch"}
          href={asset.href}
          as={asset.as}
          type={asset.type}
          {...(asset.fetchPriority
            ? { fetchPriority: asset.fetchPriority }
            : {})}
          {...(asset.crossOrigin ? { crossOrigin: "" } : {})}
        />
      ))}

      {/* PWA Support */}
      <meta name="application-name" content="MyPetID.ai" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="MyPetID.ai" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#4338ca" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />

      {/* Language */}
      <meta property="og:locale" content={lang} />

      {/* Canonical URL */}
      <link rel="canonical" href={absoluteCanonicalUrl} />

      {/* Language alternatives */}
      {alternateLanguages.map((altLang) => (
        <link
          key={`alt-lang-${altLang.lang}`}
          rel="alternate"
          hrefLang={altLang.lang}
          href={altLang.url}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://mypetid.ai/"
      />

      {/* Open Graph / Facebook - Social Media Cards */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={absoluteCanonicalUrl} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MyPetID.ai" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta
        property="article:publisher"
        content="https://facebook.com/MyPetIDai"
      />

      {/* Article specific Open Graph tags */}
      {ogType === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={`tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:site" content="@mypetidai" />
      <meta name="twitter:creator" content="@mypetidai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={`MyPetID.ai - ${description}`} />
      <meta name="twitter:dnt" content="on" />

      {/* Mobile App Tags - iOS */}
      {mobileAppConfig && (
        <>
          <meta
            name="apple-itunes-app"
            content={`app-id=${mobileAppConfig.appStoreId || "123456789"}${
              mobileAppConfig.appUrl
                ? `, app-argument=${mobileAppConfig.appUrl}`
                : ""
            }`}
          />
          <meta
            property="al:ios:url"
            content={mobileAppConfig.appUrl || "mypetid://app"}
          />
          <meta
            property="al:ios:app_store_id"
            content={mobileAppConfig.appStoreId || "123456789"}
          />
          <meta
            property="al:ios:app_name"
            content={mobileAppConfig.appName || "MyPetID.ai"}
          />

          {/* Mobile App Tags - Android */}
          <meta
            property="al:android:url"
            content={mobileAppConfig.appUrl || "mypetid://app"}
          />
          <meta
            property="al:android:package"
            content={mobileAppConfig.playStoreId || "com.mypetid.app"}
          />
          <meta
            property="al:android:app_name"
            content={mobileAppConfig.appName || "MyPetID.ai"}
          />

          {/* Global App Tags */}
          <meta property="al:web:url" content={absoluteCanonicalUrl} />
        </>
      )}

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* Verification Tags - Use real codes instead of placeholders */}
      <meta name="google-site-verification" content="G-VERIFICATION-12345" />
      <meta name="msvalidate.01" content="MS-VERIFICATION-12345" />
      <meta name="yandex-verification" content="YANDEX-VERIFICATION-12345" />
      <meta name="p:domain_verify" content="PINTEREST-VERIFICATION-12345" />

      {/* Additional SEO tags */}
      <meta name="author" content={author} />
      <meta property="fb:app_id" content="123456789012345" />

      {/* Performance optimization */}
      <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />

      {/* Structured Data / JSON-LD */}
      {allStructuredData.map((data, index) => (
        <script key={`structured-data-${index}`} type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": data.type,
            ...data.data,
          })}
        </script>
      ))}
    </Helmet>
  );
};

export default EnhancedSEO;
