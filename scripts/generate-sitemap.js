// scripts/generate-sitemap.js
// Run with: node scripts/generate-sitemap.js
// Output: public/sitemap.xml

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURATION ────────────────────────────────────────
const SITE_URL = process.env.VITE_SITE_URL || 'https://studenttoolhub.vercel.app';
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
