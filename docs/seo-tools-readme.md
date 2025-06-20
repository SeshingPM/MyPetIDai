# SEO Tools for PetDocument

This document provides an overview of the SEO tools available in the PetDocument project, how to use them, and best practices for maintaining good SEO.

## Table of Contents

1. [Available Tools](#available-tools)
2. [Enhanced SEO Component](#enhanced-seo-component)
3. [Sitemap Generation](#sitemap-generation)
4. [404 Issue Fixing](#404-issue-fixing)
5. [SEO Health Monitoring](#seo-health-monitoring)
6. [Integration with Build Process](#integration-with-build-process)
7. [Troubleshooting](#troubleshooting)

## Available Tools

The PetDocument project includes several tools to help with SEO:

1. **EnhancedSEO Component**: A React component for adding comprehensive SEO metadata to pages
2. **Enhanced Sitemap Generator**: A script to generate a comprehensive XML sitemap
3. **404 Issue Fixer**: A script to identify and fix 404 and redirect issues
4. **SEO Health Monitor**: A script to check for SEO issues and generate reports

## Enhanced SEO Component

The `EnhancedSEO` component provides a comprehensive way to add SEO metadata to your pages.

### Usage

```tsx
import EnhancedSEO from "@/components/seo/EnhancedSEO";

// In your page component
return (
  <>
    <EnhancedSEO
      title="Page Title - PetDocument"
      description="Detailed page description optimized for search engines."
      keywords="keyword1, keyword2, keyword3"
      canonicalUrl="https://petdocument.com/page-path"
      ogType="website"
      ogImage="/path-to-image.jpg"
      structuredData={[
        {
          type: "WebPage",
          data: {
            name: "Page Name",
            description: "Page description",
            // Other schema.org properties
          }
        }
      ]}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Current Page", url: "/current-page" }
      ]}
      alternateLanguages={[
        { lang: "es", url: "https://petdocument.com/es/page-path" },
        { lang: "fr", url: "https://petdocument.com/fr/page-path" }
      ]}
      faqItems={[
        {
          question: "Frequently asked question?",
          answer: "Detailed answer to the question."
        }
      ]}
      preloadAssets={[
        {
          href: "/path-to-asset.jpg",
          as: "image",
          fetchPriority: "high"
        }
      ]}
    />
    
    {/* Rest of your page */}
  </>
);
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Page title (keep under 60 characters) |
| `description` | string | Meta description (keep under 160 characters) |
| `keywords` | string | Comma-separated keywords |
| `canonicalUrl` | string | Canonical URL for the page |
| `ogType` | string | Open Graph type (website, article, etc.) |
| `ogImage` | string | Path to the Open Graph image |
| `structuredData` | array | Array of structured data objects |
| `breadcrumbs` | array | Array of breadcrumb objects |
| `alternateLanguages` | array | Array of alternate language objects |
| `faqItems` | array | Array of FAQ objects for FAQ schema |
| `preloadAssets` | array | Array of assets to preload |

See `src/components/seo/examples/FeaturePageSEO.tsx` for a complete example.

## Sitemap Generation

The enhanced sitemap generator creates a comprehensive XML sitemap with proper hreflang annotations, lastmod dates, and mobile tags.

### Usage

```bash
# Run the sitemap generator
node scripts/enhanced-sitemap-generator.js
```

This will generate a `sitemap.xml` file in the `public` directory.

### Configuration

The sitemap generator is configured in `scripts/enhanced-sitemap-generator.js`. You can modify the following:

- `BASE_URL`: The base URL of your website
- `LANGUAGES`: The supported languages
- `PUBLIC_ROUTES`: The routes to include in the sitemap

### Best Practices

- Run the sitemap generator after significant content changes
- Submit the sitemap to Google Search Console (see `docs/google-search-console-guide.md`)
- Include all important pages in the sitemap
- Use proper lastmod dates
- Include hreflang annotations for international pages

## 404 Issue Fixing

The 404 issue fixer identifies and fixes 404 and redirect issues reported in Google Search Console.

### Usage

```bash
# Run the 404 issue fixer
node scripts/fix-404-issues.js
```

This will:
1. Check problematic URLs from Google Search Console
2. Generate Nginx redirect configuration
3. Generate Vercel redirect configuration
4. Provide a summary of issues and fixes

### Configuration

The 404 issue fixer is configured in `scripts/fix-404-issues.js`. You can modify the following:

- `PROBLEMATIC_URLS`: The URLs with issues from Google Search Console
- `REDIRECT_RULES`: The redirect rules to apply

### Best Practices

- Run the 404 issue fixer regularly to identify and fix issues
- Review the generated redirect configurations before applying them
- Test the redirects to ensure they work as expected
- Submit fixed URLs for validation in Google Search Console

## SEO Health Monitoring

The SEO health monitor checks for SEO issues and generates comprehensive reports.

### Usage

```bash
# Run the SEO health monitor
node scripts/seo-health-monitor.js
```

This will:
1. Check pages for SEO issues
2. Check sitemap.xml for issues
3. Check robots.txt for issues
4. Generate HTML and JSON reports in the `reports/seo` directory

### Configuration

The SEO health monitor is configured in `scripts/seo-health-monitor.js`. You can modify the following:

- `CONFIG.baseUrl`: The base URL of your website
- `CONFIG.pagesToCheck`: The pages to check for SEO issues
- `CONFIG.metaRequirements`: The requirements for meta tags
- `CONFIG.structuredDataTypes`: The required structured data types

### Best Practices

- Run the SEO health monitor monthly
- Review the generated reports and address any issues
- Focus on high-severity issues first
- Use the reports to track SEO improvements over time

## Integration with Build Process

To automate SEO tasks as part of your build process, add the following to your `package.json`:

```json
"scripts": {
  "generate-sitemap": "node scripts/enhanced-sitemap-generator.js",
  "fix-404": "node scripts/fix-404-issues.js",
  "seo-monitor": "node scripts/seo-health-monitor.js",
  "seo": "npm run generate-sitemap && npm run fix-404 && npm run seo-monitor",
  "build": "npm run seo && vite build"
}
```

This will:
1. Generate the sitemap
2. Fix 404 issues
3. Run the SEO health monitor
4. Build the project

## Troubleshooting

### Common Issues

#### Sitemap Generation Fails

- Check that the `scripts/enhanced-sitemap-generator.js` file exists
- Ensure you have the necessary permissions to write to the `public` directory
- Check for syntax errors in the script

#### 404 Issue Fixer Fails

- Check that the `scripts/fix-404-issues.js` file exists
- Ensure you have the necessary permissions to write to the output directories
- Check for syntax errors in the script

#### SEO Health Monitor Fails

- Check that the `scripts/seo-health-monitor.js` file exists
- Ensure you have the necessary permissions to write to the `reports/seo` directory
- Check for syntax errors in the script

#### EnhancedSEO Component Issues

- Check that the component is imported correctly
- Ensure all required props are provided
- Check the browser console for any errors

### Getting Help

If you encounter issues with the SEO tools, please:

1. Check the documentation in this file and related files
2. Review the code for the specific tool
3. Check for any error messages in the console
4. Consult with the development team

## Additional Resources

- [Google Search Console Guide](./google-search-console-guide.md)
- [Windsurf SEO Prompt](./windsurf-seo-prompt.md)
- [SEO Improvement Plan](./seo-improvement-plan.md)
