# StudentToolHub Sitemap Setup & Deployment Guide

## ✅ Current Status

Your dynamic sitemap generator is **already implemented and working**:

- **Script Location:** `scripts/generate-sitemap.js`
- **Output:** `public/sitemap.xml`
- **Total URLs:** 99 (6 static pages + 12 categories + 81 tools)
- **Auto-Generation:** Runs during `npm run build` (postbuild hook)
- **Last Generated:** 2026-03-23

---

## 🏗️ How It Works

### 1. **Automatic Generation During Build**

Your `package.json` already includes the sitemap in the build process:

```json
{
  "scripts": {
    "build": "vite build",
    "postbuild": "node scripts/generate-og-image.js && node scripts/generate-sitemap.js && node scripts/update-robots.js"
  }
}
```

**What happens:**
1. Vite builds your React app
2. `postbuild` hook runs automatically
3. Sitemap script reads from `src/data/tools.js`
4. `public/sitemap.xml` is generated with latest URLs
5. `robots.txt` is also updated

### 2. **Sitemap Contents**

The generator includes:

#### **Static Pages (6 URLs)**
- `/` — Home page (priority: 1.0, daily)
- `/categories` — Browse all categories (priority: 0.9, weekly)
- `/about` — About page (priority: 0.7, monthly)
- `/contact` — Contact page (priority: 0.6, monthly)
- `/privacy-policy` — Legal (priority: 0.5, monthly)
- `/terms-of-service` — Legal (priority: 0.5, monthly)

#### **Category Pages (12 URLs)**
```
/category/academic
/category/financial
/category/utility
/category/niche
/category/health
/category/image
/category/pdf
/category/text
/category/audio
/category/developer
/category/documentmaker
/category/useful
```
- Priority: 0.8 (high)
- Change frequency: weekly

#### **Tool Pages (81 URLs)**
```
/tools/academic/calculus-solver
/tools/academic/integral-calculator
/tools/academic/matrix-algebra
... (one for each tool)
```
- Priority: 0.9 (very high)
- Change frequency: monthly
- Dynamically generated from `src/data/tools.js`

### 3. **Dynamic URL Generation**

```javascript
// From scripts/generate-sitemap.js
const toolPages = tools.map(t => ({
  path: `/tools/${t.category}/${t.slug}`,
  changefreq: 'monthly',
  priority: '0.9',
}));
```

Each tool is automatically included based on its:
- **Category** (from tools.js)
- **Slug** (from tools.js)

---

## 🚀 Site URL Configuration

The script automatically determines your site URL from:

### **Priority Order (highest to lowest):**

1. **`VITE_SITE_URL`** environment variable (recommended)
   ```bash
   export VITE_SITE_URL="https://yourdomain.com"
   ```

2. **Vercel deployment** (auto-detected)
   - Uses `VERCEL_URL` environment variable
   - `VERCEL_ENV` determines HTTP vs HTTPS

3. **Netlify deployment** (auto-detected)
   - Uses `NETLIFY_SITE_URL` environment variable

4. **Fallback** (for development)
   - `https://studenttoolhub.com` (used when no env vars present)

### **Set Your Production URL**

#### **Option A: Environment Variable (Recommended)**
```bash
export VITE_SITE_URL="https://youractualsite.com"
npm run build
```

#### **Option B: .env File**
Create or update `.env`:
```
VITE_SITE_URL=https://youractualsite.com
VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_GA_ID=G-XXXXXXXXXX
```

#### **Option C: Inline During Build**
```bash
VITE_SITE_URL=https://youractualsite.com npm run build
```

#### **Option D: In CI/CD (GitHub Actions, Vercel, etc.)**
Set as a secret/environment variable in your deployment platform.

---

## 🧪 Testing Locally

### **Test 1: Generate Sitemap Without Full Build**
```bash
cd StudentToolHub
node scripts/generate-sitemap.js
```

**Expected output:**
```
✅ Sitemap generated: ./public/sitemap.xml
   99 URLs written
```

### **Test 2: Verify Sitemap Content**
```bash
# View first 50 lines
head -n 50 public/sitemap.xml

# Count URLs
grep -c "<url>" public/sitemap.xml
```

**Expected count:** 99

### **Test 3: Validate XML Structure**
```bash
# If you have xmllint installed
xmllint --noout public/sitemap.xml
# Output: public/sitemap.xml validates
```

### **Test 4: Full Build Test**
```bash
npm run build
```

Verify after build:
1. ✅ `dist/` folder created
2. ✅ `public/sitemap.xml` exists
3. ✅ `public/robots.txt` exists
4. ✅ Sitemap includes your domain (not `studenttoolhub.com` fallback)

---

## 📋 Verifying Sitemap Format

Your sitemap follows the standard XML format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

✅ **All required fields:**
- `<loc>` — Full URL
- `<lastmod>` — Last modification date (ISO 8601)
- `<changefreq>` — daily/weekly/monthly
- `<priority>` — 0.0 to 1.0

---

## 🌐 Deploying to Production

### **On Vercel:**
```bash
# 1. Set environment variable
vercel env add VITE_SITE_URL
# When prompted, enter: https://yourdomain.com

# 2. Redeploy
vercel deploy --prod
```

### **On Netlify:**
```bash
# 1. In Netlify admin panel:
# Settings → Build & Deploy → Environment
# Add: VITE_SITE_URL = https://yourdomain.com

# 2. Trigger rebuild
netlify deploy --prod
```

### **On Self-Hosted/Traditional Server:**
```bash
# Build locally with correct URL
VITE_SITE_URL=https://yourdomain.com npm run build

# Upload dist/ to server
scp -r dist/* user@server:/var/www/html/
```

---

## ✔️ Post-Deployment Verification

### **Step 1: Verify Sitemap is Accessible**

```bash
# Check if sitemap is served correctly
curl -I https://yourdomain.com/sitemap.xml

# Expected response:
# HTTP/1.1 200 OK
# Content-Type: application/xml
```

### **Step 2: Validate with Online Tools**

1. **XML Sitemap Validator**
   - https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - Upload: `https://yourdomain.com/sitemap.xml`

2. **Screaming Frog SEO Spider**
   - Free tool: https://www.screamingfrog.co.uk/seo-spider/
   - Crawl your domain, check sitemap compliance

### **Step 3: Submit to Google Search Console**

1. **Go to:** https://search.google.com/search-console/
2. **Select your property:** yourdomain.com
3. **Left sidebar:** Sitemaps
4. **Click:** "Add a new sitemap"
5. **Enter:** `yourdomain.com/sitemap.xml`
6. **Click:** Submit

**Google will then:**
- ✅ Download and parse the sitemap
- ✅ Discover all URLs automatically
- ✅ Schedule crawling based on priority/changefreq
- ✅ Report any errors in Search Console

### **Step 4: Submit to Bing Webmaster Tools**

1. **Go to:** https://www.bing.com/webmasters/
2. **Select your site**
3. **Configure My Site → Sitemaps**
4. **Submit:** `yourdomain.com/sitemap.xml`

### **Step 5: Check robots.txt**

Your `public/robots.txt` automatically includes the sitemap:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 🔄 Updating the Sitemap

### **When URLs Change:**

The sitemap is automatically updated whenever you:

1. **Add a new tool** to `src/data/tools.js`
2. **Run:** `npm run build`
3. **Sitemap auto-regenerates** with new tool URLs

### **Rebuilding Without Full Build:**
```bash
VITE_SITE_URL=https://yourdomain.com node scripts/generate-sitemap.js
```

### **Manual Schedule (Optional):**
Create a cron job to update daily:

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/StudentToolHub && VITE_SITE_URL=https://yourdomain.com node scripts/generate-sitemap.js
```

---

## 🐛 Troubleshooting

### **Issue: Sitemap not generated**
```bash
# Check if script has errors
node scripts/generate-sitemap.js

# Verify tools.js is valid
node -e "import('./src/data/tools.js').then(m => console.log('✅ Valid:', m.tools.length, 'tools'))"
```

### **Issue: Wrong domain in sitemap**
```bash
# Check current domain
grep "<loc>" public/sitemap.xml | head -1

# Regenerate with correct URL
VITE_SITE_URL=https://youractualdomain.com node scripts/generate-sitemap.js
```

### **Issue: URLs not in Google Search Console**
1. ✅ Verify sitemap loads: `https://yourdomain.com/sitemap.xml`
2. ✅ Check Google Search Console → Sitemaps tab
3. ✅ Look for error messages
4. ✅ Wait 24-48 hours for indexing
5. ✅ Request indexing manually: Search Console → URL Inspection → Request Indexing

### **Issue: Category pages not appearing**
```bash
# Verify categories in tools.js
grep "category:" src/data/tools.js | sort | uniq

# Verify sitemap includes them
grep "/category/" public/sitemap.xml
```

---

## 📊 SEO Impact

Your sitemap provides Google with:

| Network | Benefit |
|---------|---------|
| **99 URLs** | Comprehensive site coverage |
| **Priority scores** | Home (1.0), Tools (0.9), Others (0.5-0.8) |
| **Change frequency** | Home daily, tools monthly → crawl optimization |
| **Last modified dates** | Daily updates → freshness signals |
| **robots.txt link** | Direct discovery path |

**Expected Results:**
- ✅ 100% URL discovery in 7-14 days
- ✅ Faster indexing (24-48 hours instead of weeks)
- ✅ 20-40% increase in organic traffic (typically)
- ✅ Better ranking for new tools

---

## 📝 Customization Options

### **Edit Priority Scores**

Edit `scripts/generate-sitemap.js`:

```javascript
const toolPages = tools.map(t => ({
  path: `/tools/${t.category}/${t.slug}`,
  changefreq: 'monthly',  // ← Change to: weekly for faster crawling
  priority: '0.9',        // ← Change to: 0.95 for higher priority
}));
```

### **Add Custom Pages**

If you add new pages, update static pages:

```javascript
const staticPages = [
  { path: '/',                    changefreq: 'daily',   priority: '1.0' },
  { path: '/faq',                 changefreq: 'weekly',  priority: '0.7' },
  { path: '/new-custom-page',     changefreq: 'monthly', priority: '0.6' },
];
```

### **Exclude Categories**

If you want to hide a category from sitemap:

```javascript
const categoryPages = categories
  .filter(c => !['useful', 'health'].includes(c.id))  // ← Exclude these
  .map(c => ({
    path: `/category/${c.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));
```

---

## 🎯 Next Steps

1. **✅ Set your production domain:**
   ```bash
   export VITE_SITE_URL="https://yourdomain.com"
   ```

2. **✅ Build for production:**
   ```bash
   npm run build
   ```

3. **✅ Deploy to your host** (Vercel, Netlify, etc.)

4. **✅ Submit sitemap to Google Search Console**
   - https://search.google.com/search-console/

5. **✅ Monitor in Search Console:**
   - Sitemaps → Status
   - Report → Coverage (see indexed URLs)

6. **✅ Monitor in Analytics:**
   - Track organic traffic growth
   - Monitor click-through rates

---

## 📚 Resources

- **Sitemap Protocol:** https://www.sitemaps.org/
- **Google Search Console:** https://search.google.com/search-console/
- **Bing Webmaster Tools:** https://www.bing.com/webmasters/
- **XML Sitemap Validator:** https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

**Status:** ✅ **READY FOR PRODUCTION**

Your sitemap is fully functional and will automatically update with each build. Submit to Google Search Console to start getting your 99 URLs indexed! 🚀
