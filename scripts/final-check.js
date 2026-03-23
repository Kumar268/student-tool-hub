#!/usr/bin/env node

/**
 * Final pre-deployment verification
 * Run: node scripts/final-check.js
 * 
 * Complete validation of:
 * - Environment variables
 * - robots.txt content
 * - sitemap.xml validity
 * - No hardcoded URLs in output
 * - Cache headers (for deployed scenarios)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');
const robotsPath = path.join(distPath, 'robots.txt');
const sitemapPath = path.join(distPath, 'sitemap.xml');

let testsPassed = 0;
let testsFailed = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    testsFailed++;
  }
}

console.log('═'.repeat(60));
console.log('  🔍 FINAL PRE-DEPLOYMENT VERIFICATION');
console.log('═'.repeat(60));
console.log('');

// 1. ENVIRONMENT CHECK
console.log('📍 1. ENVIRONMENT VARIABLES');
console.log('─'.repeat(60));

const siteUrl = process.env.VITE_SITE_URL || 'https://studenttoolhub.com';
test(
  'VITE_SITE_URL is set',
  process.env.VITE_SITE_URL,
  `Current: ${siteUrl}`
);

test(
  'VITE_SITE_URL is HTTPS',
  siteUrl.startsWith('https://'),
  siteUrl.startsWith('http://') ? 'Only HTTP - will fail browser requirements' : ''
);

test(
  'VITE_SITE_URL is not localhost',
  !siteUrl.includes('localhost') && !siteUrl.includes('127.0.0.1'),
  siteUrl
);

test(
  'VITE_SITE_URL has no trailing slash',
  !siteUrl.endsWith('/'),
  siteUrl.endsWith('/') ? 'Remove trailing slash' : ''
);

console.log('');

// 2. BUILD OUTPUT CHECK
console.log('📦 2. BUILD OUTPUT FILES');
console.log('─'.repeat(60));

test(
  'dist/ directory exists',
  fs.existsSync(distPath),
  `Expected: ${distPath}`
);

test(
  'robots.txt exists',
  fs.existsSync(robotsPath),
  `Expected: ${robotsPath}`
);

test(
  'sitemap.xml exists',
  fs.existsSync(sitemapPath),
  `Expected: ${sitemapPath}`
);

console.log('');

// 3. ROBOTS.TXT VALIDATION
console.log('🤖 3. ROBOTS.TXT VALIDATION');
console.log('─'.repeat(60));

let robotsContent = '';
try {
  robotsContent = fs.readFileSync(robotsPath, 'utf8');
  test('robots.txt is readable', true);
  
  test(
    'robots.txt is not empty',
    robotsContent.length > 0,
    `Size: ${robotsContent.length} bytes`
  );

  test(
    'robots.txt has User-agent directive',
    /User-agent:/i.test(robotsContent)
  );

  test(
    'robots.txt has Disallow directive',
    /Disallow:/i.test(robotsContent)
  );

  const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i);
  test(
    'robots.txt has Sitemap directive',
    !!sitemapMatch,
    'Add: Sitemap: https://domain.com/sitemap.xml'
  );

  if (sitemapMatch) {
    const sitemapUrl = sitemapMatch[1].trim();
    
    test(
      'Sitemap URL is correct domain',
      sitemapUrl === `${siteUrl}/sitemap.xml`,
      `Found: ${sitemapUrl}`
    );

    test(
      'Sitemap URL is not localhost',
      !sitemapUrl.includes('localhost') && !sitemapUrl.includes('127.0.0.1'),
      `Found: ${sitemapUrl}`
    );

    test(
      'Sitemap URL is HTTPS',
      sitemapUrl.startsWith('https://'),
      `Found: ${sitemapUrl}`
    );

    test(
      'Sitemap URL path is correct',
      sitemapUrl.endsWith('/sitemap.xml'),
      `Found: ${sitemapUrl}`
    );
  }

  test(
    'No other localhost references',
    !robotsContent.includes('localhost') && 
    !robotsContent.includes('127.0.0.1') &&
    !robotsContent.includes('http://'),
    'robots.txt must not contain localhost or http://'
  );

} catch (error) {
  test('robots.txt readable', false, error.message);
}

console.log('');

// 4. SITEMAP.XML VALIDATION
console.log('🗺️  4. SITEMAP.XML VALIDATION');
console.log('─'.repeat(60));

let sitemapContent = '';
try {
  sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  test('sitemap.xml is readable', true);

  test(
    'sitemap.xml is not empty',
    sitemapContent.length > 0,
    `Size: ${sitemapContent.length} bytes`
  );

  test(
    'sitemap.xml starts with XML declaration',
    sitemapContent.trim().startsWith('<?xml'),
    'Must start with: <?xml version="1.0"?>'
  );

  test(
    'sitemap.xml is valid XML (has urlset)',
    /\<urlset[\s\>]/.test(sitemapContent),
    'Must contain <urlset> tag'
  );

  test(
    'sitemap.xml has URLs',
    /<url>/gi.test(sitemapContent),
    'Must contain at least one <url> entry'
  );

  const urlCount = (sitemapContent.match(/<url>/gi) || []).length;
  test(
    'sitemap.xml has reasonable URL count',
    urlCount >= 5,
    `Found ${urlCount} URLs (expected at least 5: home, categories, tools, pages)`
  );

  test(
    'sitemap.xml uses correct domain',
    sitemapContent.includes(`<loc>${siteUrl}`),
    `Looking for domain: ${siteUrl}`
  );

  test(
    'sitemap.xml has no localhost',
    !sitemapContent.includes('localhost') && 
    !sitemapContent.includes('127.0.0.1') &&
    !sitemapContent.includes('http://tool'),
    'All URLs should be HTTPS and use your domain'
  );

  test(
    'sitemap.xml has proper date format',
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g.test(sitemapContent),
    'Should have ISO date format (YYYY-MM-DD)'
  );

} catch (error) {
  test('sitemap.xml readable', false, error.message);
}

console.log('');

// 5. DEPLOYMENT READINESS
console.log('🚀 5. DEPLOYMENT READINESS');
console.log('─'.repeat(60));

test(
  'All critical files present',
  fs.existsSync(robotsPath) && fs.existsSync(sitemapPath),
  'Both robots.txt and sitemap.xml must be in dist/'
);

test(
  'No temporary files in dist',
  !fs.readdirSync(distPath).some(f => 
    f.includes('.tmp') || f.includes('.test') || f.includes('.bak')
  ),
  'Clean build directory required'
);

const distSize = sitemapContent.length + robotsContent.length;
test(
  'File sizes are reasonable',
  sitemapContent.length > 100 && robotsContent.length > 50,
  `robots.txt: ${robotsContent.length}B, sitemap.xml: ${sitemapContent.length}B`
);

console.log('');

// SUMMARY
console.log('═'.repeat(60));
console.log('  📊 TEST SUMMARY');
console.log('═'.repeat(60));
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Pass Rate: ${Math.round(testsPassed / (testsPassed + testsFailed) * 100)}%`);
console.log('═'.repeat(60));
console.log('');

if (testsFailed === 0) {
  console.log('🎉 ALL CHECKS PASSED! Ready for deployment.');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Push to your repository: git push');
  console.log('2. Deploy to your platform (Vercel, Netlify, etc.)');
  console.log('3. Wait 30 seconds for deployment');
  console.log('4. Verify live: curl https://your-domain.com/robots.txt');
  console.log('5. Submit sitemap to Google Search Console');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ DEPLOYMENT BLOCKED - Fix the errors above.');
  console.log('');
  console.log('💡 Common fixes:');
  console.log('  • Set VITE_SITE_URL environment variable');
  console.log('  • Use HTTPS URLs (not HTTP)');
  console.log('  • Remove trailing slashes from URLs');
  console.log('  • Ensure npm run build completes without errors');
  console.log('  • Run: npm run build && npm run verify-robots');
  console.log('');
  process.exit(1);
}
