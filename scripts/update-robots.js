import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const robotsPath = path.join(__dirname, '../dist/robots.txt');

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

const siteUrl = getSiteUrl();

console.log('🤖 Updating robots.txt...');
console.log(`📍 Site URL detected as: ${siteUrl}`);

if (fs.existsSync(robotsPath)) {
  let content = fs.readFileSync(robotsPath, 'utf8');
  // Replace the default placeholder URL with the actual site URL
  content = content.replace(/Sitemap: .*/i, `Sitemap: ${siteUrl}/sitemap.xml`);
  fs.writeFileSync(robotsPath, content);
  console.log(`✅ robots.txt updated successfully!`);
  console.log(`   └─ Sitemap: ${siteUrl}/sitemap.xml`);
} else {
  console.error('❌ Error: dist/robots.txt not found');
  console.error('   └─ Make sure to run "npm run build" before postbuild script');
  process.exit(1);
}
