#!/usr/bin/env node

/**
 * Enhanced Sitemap Generation Script for PetDocument
 *
 * This script automatically generates a comprehensive sitemap.xml file based on the React Router routes.
 * It includes proper handling of international pages, dynamic routes, and improved metadata.
 *
 * Usage:
 * - Run manually: node scripts/enhanced-sitemap-generator.js
 * - Add to package.json scripts: "generate-sitemap": "node scripts/enhanced-sitemap-generator.js"
 * - Run before build: Update your build script to include this script
 *
 * MIGRATION NOTE: When migrating to Next.js, this script can be replaced with
 * Next.js built-in sitemap generation features. See:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const BASE_URL = "https://petdocument.com";

// Supported languages
const LANGUAGES = ["en", "es", "fr", "de"];

// List of public routes to include in sitemap
// This should be kept in sync with the routes in src/App.tsx
const PUBLIC_ROUTES = [
  {
    path: "/",
    priority: 1.0,
    changefreq: "weekly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
    images: [
      {
        loc: "/images/hero-image.jpg",
        title: "PetDocument Hero Image",
      },
    ],
  },
  {
    path: "/login",
    priority: 0.7,
    changefreq: "monthly",
    languages: ["en"], // Login page doesn't need language variants
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/register",
    priority: 0.7,
    changefreq: "monthly",
    languages: ["en"], // Register page doesn't need language variants
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/features",
    priority: 0.9,
    changefreq: "monthly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
    images: [
      {
        loc: "/images/features-dashboard.jpg",
        title: "PetDocument Features Dashboard",
      },
      {
        loc: "/images/features-mobile.jpg",
        title: "PetDocument Mobile Features",
      },
    ],
  },
  {
    path: "/faq",
    priority: 0.8,
    changefreq: "weekly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/about",
    priority: 0.8,
    changefreq: "monthly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
    images: [
      {
        loc: "/images/about-team.jpg",
        title: "PetDocument Team",
      },
    ],
  },
  {
    path: "/contact",
    priority: 0.8,
    changefreq: "monthly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/terms",
    priority: 0.5,
    changefreq: "monthly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/privacy",
    priority: 0.5,
    changefreq: "monthly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/pricing",
    priority: 0.9,
    changefreq: "weekly",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
    images: [
      {
        loc: "/images/pricing-plans.jpg",
        title: "PetDocument Pricing Plans",
      },
    ],
  },
  // Blog entries - uncomment and update when blog is ready
  /*
  {
    path: "/blog",
    priority: 0.9,
    changefreq: "daily",
    languages: LANGUAGES,
    lastmod: new Date().toISOString().split("T")[0],
  },
  */
  // Add dynamic routes for blog posts if applicable
  // This would be replaced with actual data in a production environment
  /*
  ...getBlogPostRoutes(),
  */
];

// Generate sitemap XML content
function generateSitemapXml() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
`;

  // Add each route to the sitemap
  PUBLIC_ROUTES.forEach((route) => {
    // Skip routes that should not be included
    if (route.exclude) return;

    // For each language supported by this route
    route.languages.forEach((lang) => {
      // Determine the localized path
      const localizedPath =
        lang === "en" ? route.path : `/${lang}${route.path}`;

      sitemap += `  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
`;

      // Add hreflang references for all supported languages
      route.languages.forEach((hrefLang) => {
        const hrefPath =
          hrefLang === "en" ? route.path : `/${hrefLang}${route.path}`;
        sitemap += `    <xhtml:link rel="alternate" hrefLang="${hrefLang}" href="${BASE_URL}${hrefPath}" />
`;
      });

      // Add x-default hreflang
      sitemap += `    <xhtml:link rel="alternate" hrefLang="x-default" href="${BASE_URL}${route.path}" />
`;

      // Add mobile tag
      sitemap += `    <mobile:mobile />
`;

      // Add images if present
      if (route.images && route.images.length > 0) {
        route.images.forEach((image) => {
          sitemap += `    <image:image>
      <image:loc>${BASE_URL}${image.loc}</image:loc>
      <image:title>${image.title}</image:title>
    </image:image>
`;
        });
      }

      sitemap += `  </url>
`;
    });
  });

  sitemap += `</urlset>`;

  return sitemap;
}

async function formatXml(xml) {
  try {
    // Try to format the XML with prettier
    return await prettier.format(xml, {
      parser: "html",
      printWidth: 100,
    });
  } catch (error) {
    console.warn("Warning: Could not format XML with prettier:", error.message);
    return xml;
  }
}

async function main() {
  try {
    // Generate sitemap content
    const sitemapContent = await formatXml(generateSitemapXml());

    // Output path for sitemap.xml
    const outputPath = path.join(__dirname, "../public/sitemap.xml");

    // Write the sitemap file
    fs.writeFileSync(outputPath, sitemapContent);

    console.log(`✅ Enhanced sitemap successfully generated at ${outputPath}`);
    console.log(`ℹ️ Next steps:`);
    console.log(`   1. Validate the sitemap at https://www.xml-sitemaps.com/validate-xml-sitemap.html`);
    console.log(`   2. Submit the sitemap to Google Search Console at https://search.google.com/search-console`);
    console.log(`   3. Set up regular sitemap generation as part of your build process`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

// Run the script
main();
