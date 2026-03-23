# 🚀 Sitemap Quick Start - 5-Minute Setup

## Your Current Status ✅

- **Sitemap Generator:** Fully implemented in `scripts/generate-sitemap.js`
- **Auto-Generation:** Running in `package.json` postbuild hook
- **URLs Included:** 99 (6 static + 12 categories + 81 tools)
- **Output:** `public/sitemap.xml` (generated after each build)

---

## ⚡ Quick Setup (Choose Your Platform)

### **1️⃣ For Vercel**

```bash
# Terminal
vercel env add VITE_SITE_URL
# Enter: https://yourdomain.vercel.app

vercel deploy --prod
```

✅ **Done!** Sitemap auto-generates during build.

---

### **2️⃣ For Netlify**

```bash
# In Netlify Admin:
# Settings → Build & Deploy → Environment
# Add: VITE_SITE_URL=https://yourdomain.netlify.app

# OR via CLI
netlify env:set VITE_SITE_URL https://yourdomain.netlify.app
netlify deploy --prod
```

✅ **Done!** Sitemap auto-generates during build.

---

### **3️⃣ For Self-Hosted / Custom Domain**

```bash
# Set domain and build
export VITE_SITE_URL=https://yourdomain.com
npm run build

# Upload dist/ folder to your server
# Sitemap.xml will be in dist/sitemap.xml
```

✅ **Done!** Access at `https://yourdomain.com/sitemap.xml`

---

### **4️⃣ For Local Development Testing**

```bash
# Test without building
node scripts/generate-sitemap.js

# View generated sitemap
cat public/sitemap.xml | head -30

# Preview in browser
# Open: dist/index.html (after npm run build)
```

---

## ✔️ Verify It Works (30 seconds)

```bash
# 1. Check sitemap exists
ls -lh public/sitemap.xml

# 2. Verify URL count
grep -c "<url>" public/sitemap.xml
# Should output: 99

# 3. View the domain used
grep "<loc>" public/sitemap.xml | head -1
# Should show: <loc>https://yourdomain.com/</loc>
```

---

## 📝 Submit to Search Engines

### **Google Search Console**
1. Go: https://search.google.com/search-console/
2. Select your property
3. Left sidebar: **Sitemaps**
4. Click: **ADD A NEW SITEMAP**
5. Enter: `https://yourdomain.com/sitemap.xml`
6. Click: **SUBMIT**

**✅ Google will crawl all 99 URLs within 7-14 days**

### **Bing Webmaster Tools**
1. Go: https://www.bing.com/webmasters/
2. Select your site
3. **Configure My Site** → **Sitemaps**
4. Enter: `https://yourdomain.com/sitemap.xml`
5. Click: **Submit**

---

## 🔄 Auto-Update on New Tools

Every time you:
1. Add a tool to `src/data/tools.js`
2. Run `npm run build`

→ **Sitemap automatically updates** with the new tool URL ✅

---

## 🛠️ Troubleshooting

### **Sitemap shows `studenttoolhub.com` instead of my domain**
```bash
# Fix: Set your actual domain
export VITE_SITE_URL=https://youractualsite.com
npm run build
```

### **Sitemap not generated?**
```bash
# Check for errors
node scripts/generate-sitemap.js

# Expected: ✅ Sitemap generated: 99 URLs written
```

### **URLs not showing in Google?**
1. Wait 24-48 hours (normal)
2. Go to Search Console → **URL Inspection**
3. Paste a tool URL to request indexing
4. Check **Sitemaps** tab for errors

---

## 📊 What Gets Included

```
✅ Home page (/):                   priority 1.0  (crawled daily)
✅ Categories (/categories):        priority 0.9  (crawled weekly)
✅ Category pages (12 total):       priority 0.8  (crawled weekly)
✅ Tool pages (81 total):           priority 0.9  (crawled monthly)
✅ About, Contact, Legal pages:     priority 0.5-0.7  (crawled monthly)

TOTAL: 99 URLs
```

---

## 💡 Pro Tips

1. **Monitor in Google Search Console**
   - Sitemaps tab shows coverage % and errors
   - Should be 100% within 2 weeks

2. **Check robots.txt**
   - Automatically updated with sitemap reference
   - Located at: `https://yourdomain.com/robots.txt`

3. **Add to JSON LD**
   - Google already has your sitemap
   - You're good for basic SEO

4. **Update Frequency**
   - Home: daily (you add tools regularly)
   - Tools: monthly (stable content)
   - Categories: weekly (minor changes)

---

## ✨ You're All Set!

```
✅ Sitemap: Generated (99 URLs)
✅ Auto-update: Enabled (builds automatically)
✅ Domain: Set (via VITE_SITE_URL)
✅ robots.txt: Updated
✅ Ready for: Google, Bing, other search engines

Next: Deploy & submit to Google Search Console
```

---

**Any questions?** Check `SITEMAP_GUIDE.md` for detailed setup instructions!
