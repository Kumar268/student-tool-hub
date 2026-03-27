// scripts/generate-sitemap.js
// Run with: node scripts/generate-sitemap.js
// Output: public/sitemap.xml

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURATION ────────────────────────────────────────
/**
 * Determine the site URL from multiple fallback sources:
 * 1. VITE_SITE_URL env var (recommended - set in CI/CD)
 * 2. VERCEL_URL (Vercel auto-provides this)
 * 3. NETLIFY_SITE_URL (Netlify auto-provides this)
 * 4. Default fallback
 */
function getSiteUrl() {
  // Explicit environment variable (best practice)
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Netlify deployment
  if (process.env.NETLIFY_SITE_URL) {
    return process.env.NETLIFY_SITE_URL.replace(/\/$/, '');
  }

  // Fallback for development/unknown environments
  return 'https://studenttoolhub.com';
}

const SITE_URL = getSiteUrl();
const TODAY = new Date().toISOString().split('T')[0];
// ─────────────────────────────────────────────────────────

// Dynamically import tools data
const { tools, categories } = await import('../src/data/tools.js');

const staticPages = [
  { path: '/',               changefreq: 'daily',   priority: '1.0' },
  { path: '/categories',     changefreq: 'weekly',  priority: '0.9' },
  { path: '/about',          changefreq: 'monthly', priority: '0.7' },
  { path: '/contact',        changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms-of-service', changefreq: 'monthly', priority: '0.5' },
];

const categoryPages = categories.map(c => ({
  path: `/category/${c.id}`,
  changefreq: 'weekly',
  priority: '0.8',
}));

const toolPages = tools.map(t => ({
  path: `/tools/${t.category}/${t.slug}`,
  changefreq: 'monthly',
  priority: '0.9',
}));

const allPages = [...staticPages, ...categoryPages, ...toolPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outputPath, xml, 'utf8');
console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   ${allPages.length} URLs written`);
