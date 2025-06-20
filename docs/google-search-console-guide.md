# Google Search Console Guide for PetDocument

This guide provides step-by-step instructions for using Google Search Console to improve your website's SEO performance, submit your sitemap, and validate fixes for indexing issues.

## Table of Contents

1. [Setting Up Google Search Console](#setting-up-google-search-console)
2. [Submitting Your Sitemap](#submitting-your-sitemap)
3. [Fixing Indexing Issues](#fixing-indexing-issues)
4. [Validating Fixes](#validating-fixes)
5. [Monitoring Performance](#monitoring-performance)
6. [Regular Maintenance](#regular-maintenance)

## Setting Up Google Search Console

If you haven't already set up Google Search Console for your website, follow these steps:

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Click "Start Now"
3. Choose a property type:
   - **Domain property** (recommended): Covers all subdomains and protocols
   - **URL prefix property**: Covers specific URLs with the selected prefix
4. For domain property, you'll need to verify ownership through your DNS provider
5. For URL prefix property, you can verify through various methods including:
   - HTML file upload
   - HTML tag
   - Google Analytics
   - Google Tag Manager
6. Follow the verification instructions provided by Google
7. Once verified, you'll have access to your Search Console dashboard

## Submitting Your Sitemap

To help Google discover and index your pages properly:

1. In Google Search Console, select your property
2. In the left sidebar, click on "Sitemaps" under "Index" section
3. Enter `sitemap.xml` in the "Add a new sitemap" field
4. Click "Submit"
5. Check the status of your sitemap submission:
   - **Success**: Google has successfully processed your sitemap
   - **Pending**: Google is still processing your sitemap
   - **Error**: There are issues with your sitemap that need to be fixed

### Sitemap Best Practices

- Keep your sitemap up to date (run `node scripts/enhanced-sitemap-generator.js` after significant content changes)
- Include only canonical URLs
- Ensure all URLs are valid and return 200 status codes
- Include lastmod dates for all URLs
- Include hreflang annotations for international pages
- Keep sitemap size under 50MB and 50,000 URLs (split into multiple sitemaps if needed)

## Fixing Indexing Issues

Google Search Console may report various indexing issues. Here's how to address the most common ones:

### Soft 404 Errors

These occur when a page returns a 200 status code but appears to be an error page.

1. Identify affected pages in the "Pages" > "Not indexed" > "Soft 404" report
2. For each affected page:
   - Ensure the page has substantial, unique content
   - Add proper meta tags (title, description)
   - Include structured data where appropriate
   - Link to the page from other relevant pages on your site

### Pages with Redirect Issues

1. Identify affected pages in the "Pages" > "Not indexed" > "Page with redirect" report
2. For each affected page:
   - Check if the redirect is intentional
   - If unintentional, fix the redirect chain
   - Ensure redirects are properly implemented (301 for permanent, 302 for temporary)
   - Update internal links to point directly to the final URL

### Not Found (404) Errors

1. Identify affected pages in the "Pages" > "Not indexed" > "Not found (404)" report
2. For each affected page:
   - If the page should exist, restore it
   - If the page has moved, set up a 301 redirect to the new URL
   - If the page is legitimately gone, ensure it returns a proper 404 status code
   - Update any internal links pointing to the 404 page

### URL Inspection Tool

For individual URLs with issues:

1. Use the "URL Inspection" tool at the top of the Search Console
2. Enter the URL you want to check
3. Review the status and any reported issues
4. Click "Test Live URL" to see the current state of the page
5. If the page is fixed, click "Request Indexing" to ask Google to recrawl it

## Validating Fixes

After implementing fixes for indexing issues:

1. Go to the specific issue report in Search Console
2. Click "Validate Fix" button
3. Google will recrawl a sample of affected pages
4. Monitor the validation status:
   - **Started**: Validation is in progress
   - **Passed**: Google confirmed your fixes worked
   - **Failed**: Issues still exist that need to be addressed

### Bulk Validation with the Fix-404-Issues Script

For multiple issues of the same type:

1. Run the fix script: `node scripts/fix-404-issues.js`
2. Review the generated redirect configurations
3. Implement the suggested fixes
4. Use the "Validate Fix" button in Search Console for the issue category

## Monitoring Performance

Regularly check these key reports:

1. **Performance**: Track clicks, impressions, CTR, and average position
   - Filter by page, query, country, device, and date range
   - Identify top-performing and underperforming pages
   - Look for keyword opportunities with high impressions but low CTR

2. **Core Web Vitals**: Monitor page experience metrics
   - Largest Contentful Paint (LCP): Loading performance
   - First Input Delay (FID): Interactivity
   - Cumulative Layout Shift (CLS): Visual stability

3. **Mobile Usability**: Ensure your site works well on mobile devices

4. **Security & Manual Actions**: Check for security issues or penalties

## Regular Maintenance

Establish a routine for SEO maintenance:

1. **Weekly**:
   - Check for new indexing issues
   - Monitor performance changes
   - Review top search queries

2. **Monthly**:
   - Run the SEO health monitor: `node scripts/seo-health-monitor.js`
   - Review and address any new issues
   - Update sitemap if significant content changes occurred

3. **Quarterly**:
   - Perform a comprehensive SEO audit
   - Update structured data as needed
   - Review and refresh content on key pages

4. **Annually**:
   - Review overall SEO strategy
   - Benchmark performance against competitors
   - Set new SEO goals and KPIs

By following this guide and establishing regular maintenance routines, you'll ensure that your website maintains good standing with Google and continues to improve its search visibility over time.
