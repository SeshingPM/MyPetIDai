#!/usr/bin/env node

/**
 * Sitemap Generation Script for PetDocument
 *
 * This script automatically generates a sitemap.xml file based on the React Router routes.
 * It's designed to work with a React SPA using React Router v6.
 *
 * Usage:
 * - Run manually: node scripts/generate-sitemap.js
 * - Add to package.json scripts: "generate-sitemap": "node scripts/generate-sitemap.js"
 * - Run before build: Update your build script to include this script
 *
 * MIGRATION NOTE: When migrating to Next.js, this script can be replaced with
 * Next.js built-in sitemap generation features. See:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

// Base URL for the site
const BASE_URL = "https://petdocument.com";

// List of public routes to include in sitemap
// This should be kept in sync with the routes in src/App.tsx
const PUBLIC_ROUTES = [
  {
    path: "/",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/login",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/register",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/features",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/faq",
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    path: "/about",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/terms",
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/pricing",
    priority: 0.9,
    changefreq: "weekly",
  },
];

// Today's date in YYYY-MM-DD format for lastmod
const today = new Date().toISOString().split("T")[0];

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
    sitemap += `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <mobile:mobile />
  </url>
`;
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

    console.log(`✅ Sitemap successfully generated at ${outputPath}`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

// Run the script
main();
