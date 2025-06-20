#!/usr/bin/env node

/**
 * 404 and Redirect Issue Fixer for PetDocument
 * 
 * This script helps identify and fix 404 errors and redirect issues
 * reported in Google Search Console.
 * 
 * Usage:
 * - Run manually: node scripts/fix-404-issues.js
 * - Add to package.json scripts: "fix-404": "node scripts/fix-404-issues.js"
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

// URLs with issues from Google Search Console
const PROBLEMATIC_URLS = [
  // 404 Not Found - International pages
  'https://petdocument.com/fr/',
  'https://petdocument.com/es/',
  'https://petdocument.com/download',
  'https://petdocument.com/de/',
  'https://petdocument.com/de/about',
  'https://petdocument.com/de/faq',
  'https://petdocument.com/fr/features',
  'https://petdocument.com/es/features',
  'https://petdocument.com/fr/contact',
  'https://petdocument.com/de/terms',
  
  // Redirect Issues
  'http://www.petdocument.com/',
  'https://www.petdocument.com/',
  
  // 403 Access Forbidden Issues
  'https://www.petdocument.com/search/fr.php?aaa=',
  
  // Add any other problematic URLs from Google Search Console
  'https://url2394.petdocument.com/',
];

// Configuration for redirect rules
const REDIRECT_RULES = [
  // Domain-level redirects - Updated to include all www variants
  {
    pattern: 'http(s)?://www.petdocument.com',
    target: 'https://petdocument.com',
    type: '301', // Permanent redirect
  },
  {
    pattern: 'http(s)?://www.petdocument.com/(.*)',
    target: 'https://petdocument.com/$1',
    type: '301', // Permanent redirect
  },
  
  // Add rule for url2394 subdomain
  {
    pattern: 'https://url2394.petdocument.com/(.*)',
    target: 'https://petdocument.com/$1',
    type: '301', // Permanent redirect
  },
  
  // International pages root redirects - Changed to 301 (permanent) since we're not adding localized content soon
  {
    pattern: 'https://petdocument.com/fr',
    target: 'https://petdocument.com',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/es',
    target: 'https://petdocument.com',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/de',
    target: 'https://petdocument.com',
    type: '301', // Changed to permanent redirect
  },
  
  // International pages path redirects - Changed to 301 (permanent)
  {
    pattern: 'https://petdocument.com/fr/(.*)',
    target: 'https://petdocument.com/$1',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/es/(.*)',
    target: 'https://petdocument.com/$1',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/de/(.*)',
    target: 'https://petdocument.com/$1',
    type: '301', // Changed to permanent redirect
  },
  
  // Search page redirects to fix 403 issues
  {
    pattern: 'https://www.petdocument.com/search/(.*)',
    target: 'https://petdocument.com/',
    type: '301', // Permanent redirect
  },
  {
    pattern: 'https://petdocument.com/search/(.*)',
    target: 'https://petdocument.com/',
    type: '301', // Permanent redirect
  },
  
  // Specific page redirects
  {
    pattern: 'https://petdocument.com/download',
    target: 'https://petdocument.com/features',
    type: '301', // Permanent redirect
  },
  
  // Missing pages redirects - Changed to 301 (permanent)
  {
    pattern: 'https://petdocument.com/login',
    target: 'https://petdocument.com/',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/register',
    target: 'https://petdocument.com/',
    type: '301', // Changed to permanent redirect
  },
  {
    pattern: 'https://petdocument.com/faq',
    target: 'https://petdocument.com/',
    type: '301', // Changed to permanent redirect
  },
];

// Function to check URL status
async function checkUrlStatus(url) {
  // Ensure URL is properly formatted with protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://petdocument.com${url.startsWith('/') ? url : '/' + url}`;
  }
  
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, { timeout: 10000 }, (res) => {
        const { statusCode, headers } = res;
        let redirectUrl = headers.location;
        
        // Collect response body for soft 404 detection
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          // Check for soft 404 indicators in the body - Improved detection
          const isSoft404 = statusCode === 200 && (
            body.toLowerCase().includes('not found') || 
            body.toLowerCase().includes('404') || 
            body.toLowerCase().includes('page doesn\'t exist') ||
            body.toLowerCase().includes('page not found') ||
            body.toLowerCase().includes('cannot be found') ||
            body.toLowerCase().includes('error') && body.toLowerCase().includes('page') ||
            body.length < 512 // Very short content might indicate a soft 404
          );
          
          resolve({
            url,
            statusCode,
            redirectUrl,
            isSoft404,
            redirectChain: redirectUrl ? [redirectUrl] : [],
          });
        });
      });
      
      req.on('error', (error) => {
        resolve({
          url,
          statusCode: 'error',
          error: error.message,
        });
      });
      
      req.on('timeout', () => {
        req.abort();
        resolve({
          url,
          statusCode: 'timeout',
          error: 'Request timed out',
        });
      });
    } catch (error) {
      console.error(`Error checking URL ${url}:`, error.message);
      resolve({
        url,
        statusCode: 'error',
        error: error.message,
      });
    }
  });
}

// Function to follow redirect chains
async function followRedirectChain(initialUrl, maxRedirects = 10) {
  let currentUrl = initialUrl;
  let redirectChain = [];
  let redirectCount = 0;
  
  while (redirectCount < maxRedirects) {
    const result = await checkUrlStatus(currentUrl);
    
    if (result.redirectUrl) {
      redirectChain.push({
        from: currentUrl,
        to: result.redirectUrl,
        statusCode: result.statusCode,
      });
      
      currentUrl = result.redirectUrl;
      redirectCount++;
    } else {
      // No more redirects
      return {
        initialUrl,
        finalUrl: currentUrl,
        redirectChain,
        finalStatusCode: result.statusCode,
        isSoft404: result.isSoft404,
      };
    }
  }
  
  // If we reach here, we hit the max redirects
  return {
    initialUrl,
    finalUrl: currentUrl,
    redirectChain,
    finalStatusCode: 'too_many_redirects',
    error: 'Too many redirects',
  };
}

// Function to generate Nginx redirect rules
function generateNginxRedirects(redirectRules) {
  let nginxConfig = `
# Redirect rules for fixing 404 and redirect issues
# Generated on ${new Date().toISOString()}
# Add these to your Nginx server configuration

server {
    listen 80;
    server_name petdocument.com www.petdocument.com url2394.petdocument.com;
    
    # Force HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name petdocument.com;
    
    # SSL configuration goes here
    # ...
    
    # Redirect rules for fixing 404 and redirect issues
`;

  // Process rules to avoid overlapping patterns
  const processedRules = [];
  redirectRules.forEach(rule => {
    // Skip rules with overly broad patterns that could cause conflicts
    if (rule.pattern === '(.*)' || rule.pattern === '/(.*)'
        || rule.pattern.replace(/https?:\/\/[^/]+\//, '/') === '/(.*)') {
      console.log(`⚠️ Skipping overly broad redirect pattern: ${rule.pattern}`);
      return;
    }
    
    // Skip rules where source and destination are effectively the same
    const source = rule.pattern.replace(/https?:\/\/[^/]+\//, '/');
    const destination = rule.target.replace(/https?:\/\/[^/]+\//, '/');
    
    if (source === destination || 
        (source.replace(/\(\.\*\)/, '(.*)') === destination.replace(/\$1/, '$1'))) {
      console.log(`⚠️ Skipping redirect that would cause a loop: ${rule.pattern} -> ${rule.target}`);
      return;
    }
    
    // Add a unique identifier to each location block to avoid conflicts
    const uniqueId = Math.random().toString(36).substring(2, 10);
    
    nginxConfig += `    
    # Redirect ${rule.pattern}
    location ~ ^${rule.pattern.replace(/https?:\/\/[^/]+\//, '/')}$ {
        return ${rule.type} ${rule.target};
    }
`;
    
    processedRules.push(rule);
  });

  // If no valid rules were processed, add a comment
  if (processedRules.length === 0) {
    nginxConfig += `    
    # No specific redirect rules needed in the main server block
    # as we're handling domain-level redirects in the www/url2394 server block below
`;
  }

  nginxConfig += `
    # Main location block
    location / {
        # Your application configuration
        # ...
    }
}

server {
    listen 443 ssl;
    server_name www.petdocument.com url2394.petdocument.com;
    
    # SSL configuration goes here
    # ...
    
    # Redirect all requests to the main domain
    return 301 https://petdocument.com$request_uri;
}
`;

  return nginxConfig;
}

// Function to generate Vercel redirect rules (vercel.json)
async function generateVercelRedirects(redirectRules) {
  // Try to read existing vercel.json
  let vercelConfig = { redirects: [] };
  
  try {
    const vercelJsonPath = path.join(__dirname, '../vercel.json');
    const existingConfig = await readFileAsync(vercelJsonPath, 'utf8');
    vercelConfig = JSON.parse(existingConfig);
    
    // Initialize redirects array if it doesn't exist
    if (!vercelConfig.redirects) {
      vercelConfig.redirects = [];
    }
  } catch (error) {
    // File doesn't exist or is invalid JSON, use default empty config
    console.log('Creating new vercel.json file with redirects');
  }
  
  // Process rules to avoid problematic redirects
  const processedRules = [];
  
  redirectRules.forEach(rule => {
    // Skip rules with overly broad patterns that could cause conflicts
    if (rule.pattern === '(.*)' || rule.pattern === '/(.*)'
        || rule.pattern.replace(/https?:\/\/[^/]+\//, '/') === '/(.*)') {
      console.log(`⚠️ Skipping overly broad redirect pattern: ${rule.pattern}`);
      return;
    }
    
    // Convert pattern to Vercel format (regex with named groups)
    const source = rule.pattern
      .replace(/https?:\/\/[^/]+\//, '/')
      .replace(/\(\.\*\)/, '(.*)');
    
    const destination = rule.target
      .replace(/https?:\/\/[^/]+\//, '/')
      .replace(/\$1/, '$1');
    
    // Skip if source and destination are the same (would cause infinite redirects)
    if (source === destination || 
        source.replace(/\(\.\*\)/, '(.*)') === destination.replace(/\$1/, '$1')) {
      console.log(`⚠️ Skipping redirect that would cause a loop: ${source} -> ${destination}`);
      return;
    }
    
    // Skip if the rule would match all paths (catch-all)
    if (source === '/(.*)')  {
      console.log(`⚠️ Skipping catch-all redirect that could cause issues: ${source} -> ${destination}`);
      return;
    }
    
    processedRules.push({
      source,
      destination,
      permanent: rule.type === '301'
    });
  });
  
  // Only update redirects if we have valid rules to add
  if (processedRules.length > 0) {
    // Remove any existing problematic redirects
    vercelConfig.redirects = vercelConfig.redirects.filter(redirect => {
      // Filter out any catch-all redirects that might cause issues
      if (redirect.source === '/(.*)'
          && redirect.destination === '/$1') {
        console.log(`⚠️ Removing existing problematic catch-all redirect: ${redirect.source} -> ${redirect.destination}`);
        return false;
      }
      return true;
    });
    
    // Add our processed redirect rules
    processedRules.forEach(rule => {
      // Check if this rule already exists
      const existingRuleIndex = vercelConfig.redirects.findIndex(
        r => r.source === rule.source && r.destination === rule.destination
      );
      
      if (existingRuleIndex >= 0) {
        // Update existing rule
        vercelConfig.redirects[existingRuleIndex] = rule;
      } else {
        // Add new rule
        vercelConfig.redirects.push(rule);
      }
    });
  }
  
  return JSON.stringify(vercelConfig, null, 2);
}

// Main function
async function main() {
  console.log('🔍 Checking problematic URLs from Google Search Console...\n');
  
  const results = [];
  
  // Check each URL
  for (const url of PROBLEMATIC_URLS) {
    console.log(`Checking ${url}...`);
    const result = await followRedirectChain(url);
    results.push(result);
    
    // Print result
    console.log(`  Status: ${result.finalStatusCode}`);
    if (result.redirectChain.length > 0) {
      console.log(`  Redirect chain (${result.redirectChain.length}):`);
      result.redirectChain.forEach((redirect, index) => {
        console.log(`    ${index + 1}. ${redirect.from} -> ${redirect.to} (${redirect.statusCode})`);
      });
    }
    if (result.isSoft404) {
      console.log('  ⚠️ Detected as soft 404 (returns 200 but looks like an error page)');
    }
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    }
    console.log('');
  }
  
  // Generate Nginx config
  const nginxConfig = generateNginxRedirects(REDIRECT_RULES);
  const nginxPath = path.join(__dirname, '../nginx-redirects.conf');
  await writeFileAsync(nginxPath, nginxConfig);
  console.log(`✅ Nginx redirect configuration saved to ${nginxPath}`);
  
  // Generate Vercel config
  const vercelConfig = await generateVercelRedirects(REDIRECT_RULES);
  const vercelPath = path.join(__dirname, '../vercel.json');
  await writeFileAsync(vercelPath, vercelConfig);
  console.log(`✅ Vercel redirect configuration saved to ${vercelPath}`);
  
  console.log('\n📋 Summary:');
  console.log(`  - ${PROBLEMATIC_URLS.length} URLs checked`);
  console.log(`  - ${results.filter(r => r.finalStatusCode >= 400 || r.finalStatusCode === 'error' || r.finalStatusCode === 'timeout').length} URLs with errors`);
  console.log(`  - ${results.filter(r => r.redirectChain.length > 0).length} URLs with redirects`);
  console.log(`  - ${results.filter(r => r.isSoft404).length} URLs with soft 404s`);
  
  console.log('\n🔧 Next steps:');
  console.log('  1. Review the generated redirect configurations');
  console.log('  2. Apply the redirects to your server or Vercel configuration');
  console.log('  3. Test the URLs again to verify the fixes');
  console.log('  4. Submit the fixed URLs for validation in Google Search Console');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
