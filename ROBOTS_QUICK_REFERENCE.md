# Robots.txt & Sitemap - Quick Reference

## TL;DR

Your project **automatically generates dynamic `robots.txt` and `sitemap.xml`** at build time based on your deployment domain.

## ✅ Quick Start (All Platforms)

### 1. Set Environment Variable
**Vercel/Netlify Dashboard** OR **local .env**:
```
VITE_SITE_URL=https://your-domain.com
```

### 2. Deploy
```bash
npm run build  # Automatically generates robots.txt + sitemap.xml
git push       # Deploy to Vercel/Netlify/GitHub/etc
```

### 3. Verify (20 seconds after deploy)
```bash
curl https://your-domain.com/robots.txt
# ✅ Should show: Sitemap: https://your-domain.com/sitemap.xml
```

---

## 📋 Setup by Platform

### Vercel
1. Project Settings → Environment Variables
2. Add: `VITE_SITE_URL = https://your-domain.com`
3. Push to main → Done! ✅

### Netlify  
1. Site Settings → Environment Variables
2. Add: `VITE_SITE_URL = https://your-domain.com`
3. Push to main → Done! ✅

### GitHub Pages
```bash
# .github/workflows/build.yml
env:
  VITE_SITE_URL: https://yourusername.github.io/studenttoolhub
```

### Self-Hosted / Docker
```bash
VITE_SITE_URL=https://your-domain.com npm run build
```

---

## 🔍 Verification Checklist

| Check | Command | ✅ Pass |
|-------|---------|--------|
| robots.txt exists | `curl https://domain.com/robots.txt` | Contains `Sitemap:` |
| Correct domain | `curl https://domain.com/robots.txt \| grep Sitemap` | Shows YOUR domain, not localhost |
| Valid XML | `curl https://domain.com/sitemap.xml \| head -1` | Starts with `<?xml` |
| Local build | `npm run build && npm run verify-robots` | ✅ All checks passed |

---

## 🚀 Scripts

```bash
npm run build          # Build + auto-generate robots.txt & sitemap.xml
npm run verify-robots  # Verify robots.txt is valid
npm run dev            # Local dev (http://localhost:5173)
npm run preview        # Preview production build
```

---

## 🔧 Files to Know

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template |
| `public/robots.txt` | Template (updated at build time) |
| `scripts/update-robots.js` | Generates dist/robots.txt with correct domain |
| `scripts/generate-sitemap.js` | Generates dist/sitemap.xml from tools data |
| `scripts/verify-robots.js` | Validates configuration |
| `dist/robots.txt` | Final file (auto-generated, deployed) |
| `dist/sitemap.xml` | Final file (auto-generated, deployed) |

---

## 🎯 Environment Variables

Only **ONE** variable needed:

```bash
VITE_SITE_URL=https://your-domain.com
```

**Examples**:
- Production: `https://studenttoolhub.com`
- Vercel Preview: `https://preview-abc123.vercel.app`
- Staging: `https://staging.studenttoolhub.com`

---

## ❌ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| robots.txt shows old domain after deploy | Set `VITE_SITE_URL` in platform settings, rebuild |
| "localhost" in robots.txt | Set `VITE_SITE_URL` BEFORE building |
| sitemap.xml not found | Run: `npm run build` (postbuild generates it) |
| Verification fails locally | `npm run verify-robots` shows what's wrong |

---

## 📊 How It Works

```
Your Code
   ↓
npm run build (Vite compiles)
   ↓
npm run postbuild (automatic)
   ├─ generate-sitemap.js → reads VITE_SITE_URL
   └─ update-robots.js → reads VITE_SITE_URL
   ↓
dist/robots.txt & dist/sitemap.xml with CORRECT domain
   ↓
Deploy to Vercel/Netlify/GitHub/Docker/etc
   ↓
✅ robots.txt shows correct sitemap URL
```

---

## 📚 Full Guides

- [ROBOTS_DEPLOYMENT_GUIDE.md](ROBOTS_DEPLOYMENT_GUIDE.md) - Complete setup instructions
- [CI_CD_TEMPLATES.md](CI_CD_TEMPLATES.md) - Ready-to-use CI/CD configs
- [.env.example](.env.example) - Environment variables
- [package.json](package.json) - Build scripts

---

## 🆘 Help

### Local verification
```bash
npm run verify-robots
```

### Check your build
```bash
cat dist/robots.txt
cat dist/sitemap.xml | head -5
```

### Manual verification
```bash
# After deploying to production
curl https://your-domain.com/robots.txt
curl https://your-domain.com/sitemap.xml
```

---

**Last Updated**: March 2026  
**Status**: ✅ Production Ready
