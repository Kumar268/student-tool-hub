# How Dynamic robots.txt Works - Visual Guide

## The Problem (Before)
```
❌ HARDCODED  →  robots.txt with Sitemap: https://studenttoolhub.vercel.app/sitemap.xml
    ↓
    Works on studenttoolhub.vercel.app ✅
    Breaks on studenttoolhub.com ❌
    Breaks on custom domain ❌
    Breaks on preview URLs ❌
```

## The Solution (After)
```
✅ DYNAMIC  →  Read environment variable at BUILD time
    ↓
    Generate correct robots.txt with YOUR actual domain
    ↓
    Works everywhere! ✅
```

---

## What Happens During Build

```
┌─────────────────────────────────────────────────────────┐
│ You run: npm run build                                  │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│ 1. VITE COMPILES YOUR REACT APP                         │
│    └─ Creates: /dist/* (bundled JavaScript)             │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│ 2. POSTBUILD RUNS (npm run postbuild)                   │
│                                                         │
│    a) generate-sitemap.js runs                          │
│       ├─ Reads: VITE_SITE_URL=https://your-domain.com │
│       ├─ Reads: src/data/tools.js (tool list)           │
│       └─ Creates: dist/sitemap.xml                      │
│          <loc>https://your-domain.com/tools/...</loc>   │
│                                                         │
│    b) update-robots.js runs                             │
│       ├─ Reads: VITE_SITE_URL=https://your-domain.com │
│       ├─ Reads: public/robots.txt (template)            │
│       └─ Creates: dist/robots.txt                       │
│          Sitemap: https://your-domain.com/sitemap.xml   │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│ RESULT: /dist/ folder has:                              │
│                                                         │
│ ✅ index.html                                            │
│ ✅ robots.txt         ← DYNAMIC (your domain)           │
│ ✅ sitemap.xml        ← DYNAMIC (your domain)           │
│ ✅ assets/*.js (bundled)                                 │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│ Deploy /dist/ to your server                            │
│ (Vercel, Netlify, Docker, Nginx, etc.)                  │
└─────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────┐
│ FINAL RESULT ON LIVE SITE:                              │
│                                                         │
│ https://your-domain.com/robots.txt                      │
│   ↓                                                      │
│   User-agent: *                                         │
│   Allow: /                                              │
│   Disallow:                                             │
│   Sitemap: https://your-domain.com/sitemap.xml  ✅     │
│                                                         │
│ https://your-domain.com/sitemap.xml                     │
│   ↓                                                      │
│   <?xml version="1.0"?>                                 │
│   <urlset>                                              │
│     <url>                                               │
│       <loc>https://your-domain.com/tools/...</loc>  ✅  │
│       ...                                               │
│     </url>                                              │
│   </urlset>                                             │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Variable Detection

The scripts check for the domain in this order:

```
┌─────────────────────────────────────────────────┐
│ Which domain should we use?                     │
└─────────────────────────────────────────────────┘
         ↓
    ┌─ Check 1: VITE_SITE_URL set?
    │   ├─ YES → USE IT ✅
    │   └─ NO  ↓
    │
    ├─ Check 2: VERCEL_URL set? (Vercel auto-provides)
    │   ├─ YES → USE IT ✅
    │   └─ NO  ↓
    │
    ├─ Check 3: NETLIFY_SITE_URL? (Netlify auto-provides)
    │   ├─ YES → USE IT ✅
    │   └─ NO  ↓
    │
    └─ Check 4: Use fallback
        └─ https://studenttoolhub.com (default)
```

---

## Platform-Specific Setup

### 🔷 Vercel (Recommended)
```
Vercel Dashboard
    ↓
Project → Settings → Environment Variables
    ↓
VITE_SITE_URL = https://studenttoolhub.com
    ↓
Deploy
    ↓
✅ robots.txt has correct domain
```

### 🔷 Netlify
```
Netlify Dashboard
    ↓
Site Settings → Build & Deploy → Environment
    ↓
VITE_SITE_URL = https://your-domain.com
    ↓
Trigger Deploy
    ↓
✅ robots.txt has correct domain
```

### 🔷 GitHub Pages
```
.github/workflows/deploy.yml
    ↓
env:
  VITE_SITE_URL: https://yourusername.github.io/repo
    ↓
git push
    ↓
✅ robots.txt has correct domain
```

### 🔷 Docker
```
docker build \
  --build-arg VITE_SITE_URL=https://your-domain.com \
  -t myapp .
    ↓
docker run myapp
    ↓
✅ robots.txt has correct domain
```

### 🔷 Local Development
```
.env file
    ↓
VITE_SITE_URL=https://localhost:5173
    ↓
npm run build
    ↓
npm run verify-robots
    ↓
✅ robots.txt correct (for testing)
```

---

## Verification Process

### Step 1: Local Verification
```bash
$ npm run verify-robots
  ✅ robots.txt found
  ✅ Sitemap URL: https://studenttoolhub.com/sitemap.xml
  ✅ All checks passed!
```

### Step 2: Pre-Deploy Verification
```bash
$ npm run final-check
  ✅ VITE_SITE_URL is set
  ✅ robots.txt exists
  ✅ Sitemap URL is correct domain (not localhost)
  ✅ No hardcoded HTTP URLs
  ✅ ALL CHECKS PASSED! Ready for deployment.
```

### Step 3: Live Verification (After Deploy)
```bash
$ curl https://studenttoolhub.com/robots.txt
  User-agent: *
  Allow: /
  Disallow:
  Sitemap: https://studenttoolhub.com/sitemap.xml
  ✅ CORRECT!
```

---

## File Relationships

```
YOUR PROJECT
│
├─ public/
│  └─ robots.txt ← Template (has placeholder)
│
├─ src/
│  └─ data/
│     └─ tools.js ← Tool list (auto-included in sitemap)
│
├─ scripts/
│  ├─ generate-sitemap.js ← Reads tools.js, creates sitemap.xml
│  ├─ update-robots.js ← Updates robots.txt with domain
│  ├─ verify-robots.js ← Validates configuration
│  └─ final-check.js ← Complete pre-deploy check
│
├─ .env.example ← Environment variable template
│ 
├─ package.json ← npm scripts
│  ├─ build → vite build + postbuild
│  ├─ postbuild → generate-sitemap + update-robots
│  ├─ verify-robots → validation check
│  └─ final-check → complete check before deploy
│
└─ dist/ (generated at build time)
   ├─ robots.txt ← GENERATED with YOUR domain
   ├─ sitemap.xml ← GENERATED with YOUR domain
   └─ index.html + assets/
```

---

## Decision Tree: Which Script to Run?

```
Do you want to...?
│
├─ Build for production?
│  └─ npm run build
│     (automatically runs postbuild scripts)
│
├─ Check if robots.txt is valid?
│  └─ npm run verify-robots
│
├─ Final check before deployment?
│  └─ npm run final-check
│     (most comprehensive - use this!)
│
├─ Deploy?
│  └─ npm run build (first)
│     Then push to your platform
│
└─ Test locally?
    └─ npm run dev
       (development server)
```

---

## Common Mistakes & What Happens

```
❌ MISTAKE 1: Don't set VITE_SITE_URL
   ↓
   robots.txt shows: Sitemap: https://studenttoolhub.com/sitemap.xml
   (uses fallback)
   
✅ FIX: Set VITE_SITE_URL in your platform before building

───────────────────────────────────────────────────────

❌ MISTAKE 2: Set VITE_SITE_URL with trailing slash
   VITE_SITE_URL=https://your-domain.com/
   ↓
   robots.txt shows: Sitemap: https://your-domain.com//sitemap.xml (double slash!)
   
✅ FIX: Remove trailing slash
   VITE_SITE_URL=https://your-domain.com

───────────────────────────────────────────────────────

❌ MISTAKE 3: Use HTTP instead of HTTPS
   VITE_SITE_URL=http://your-domain.com
   ↓
   Google won't crawl (insecure)
   Browsers will warn
   
✅ FIX: Use HTTPS
   VITE_SITE_URL=https://your-domain.com

───────────────────────────────────────────────────────

❌ MISTAKE 4: Set VITE_SITE_URL to localhost for production
   ↓
   robots.txt shows: Sitemap: http://localhost:5173/sitemap.xml
   (visible to Google - blocks indexing!)
   
✅ FIX: Use your actual domain
   VITE_SITE_URL=https://your-domain.com

───────────────────────────────────────────────────────

❌ MISTAKE 5: Don't rebuild after changing VITE_SITE_URL
   ↓
   Old value is still in dist/robots.txt
   
✅ FIX: Always rebuild
   npm run build
```

---

## What Gets Generated

### robots.txt Template (public/robots.txt)
```
User-agent: *
Allow: /
Disallow:
Sitemap: https://studenttoolhub.com/sitemap.xml  ← Placeholder
```

### robots.txt Output (dist/robots.txt) - After Build
```
User-agent: *
Allow: /
Disallow:
Sitemap: https://YOUR-ACTUAL-DOMAIN/sitemap.xml  ← YOUR DOMAIN HERE
```

### sitemap.xml (dist/sitemap.xml) - After Build
```xml
<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://YOUR-ACTUAL-DOMAIN/</loc>
    <lastmod>2026-03-23</lastmod>
  </url>
  <url>
    <loc>https://YOUR-ACTUAL-DOMAIN/tools/academic/calculus-solver</loc>
    <lastmod>2026-03-23</lastmod>
  </url>
  ... (all tools from src/data/tools.js)
</urlset>
```

---

## Success = All These Tests Pass ✅

```
✅ VITE_SITE_URL is set in your platform
✅ npm run build completes without errors
✅ npm run verify-robots shows all checks passed
✅ curl https://your-domain.com/robots.txt shows YOUR domain
✅ curl https://your-domain.com/sitemap.xml shows valid XML with YOUR domain
✅ No localhost or 127.0.0.1 anywhere in build output
✅ Google Search Console accepts your sitemap
✅ Search Console shows pages being indexed
```

---

This visual guide helps you understand the entire process and troubleshoot any issues! 🎉
