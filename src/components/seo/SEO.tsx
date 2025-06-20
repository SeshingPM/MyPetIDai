import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schema?: any[];
  structuredData?: any[];
  lang?: string;
  alternateLanguages?: Array<{ lang: string; url: string }>;
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
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl = "https://mypetid.vercel.app",
  ogType = "website",
  ogImage = "/og-image.png",
  schema = [],
  structuredData = [],
  lang = "en-US",
  alternateLanguages = [],
  mobileAppConfig,
  preloadAssets = [],
  preconnectUrls = [],
  dnsPrefetchUrls = [],
}) => {
  // Append site name to title if not already included
  const fullTitle = title.includes("MyPetID")
    ? title
    : `${title} | MyPetID`;

  // Generate absolute URL for OG image
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `https://mypetid.vercel.app${ogImage}`;

  // Combine any provided schema with structured data
  const allStructuredData = [...schema, ...structuredData];

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
      <meta name="application-name" content="MyPetID" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="MyPetID" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#4338ca" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta
        http-equiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />

      {/* Language */}
      <meta property="og:locale" content={lang} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

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
        href="https://mypetid.vercel.app/"
      />

      {/* Open Graph / Facebook - Social Media Cards */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MyPetID" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta
        property="article:publisher"
        content="https://facebook.com/mypetid"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mypetid" />
      <meta name="twitter:creator" content="@mypetid" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={`MyPetID - ${description}`} />
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
            content={mobileAppConfig.appName || "MyPetID"}
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
            content={mobileAppConfig.appName || "MyPetID"}
          />

          {/* Global App Tags */}
          <meta property="al:web:url" content={canonicalUrl} />
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
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="author" content="MyPetID" />
      <meta property="fb:app_id" content="123456789012345" />

      {/* Performance optimization */}
      <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />

      {/* Structured Data / JSON-LD */}
      {allStructuredData.map((data, index) => (
        <script key={`structured-data-${index}`} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
