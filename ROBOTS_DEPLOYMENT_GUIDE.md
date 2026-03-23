# Dynamic robots.txt & sitemap Configuration Guide

## Overview

This guide explains how your StudentToolHub project is configured to automatically generate dynamic `robots.txt` and `sitemap.xml` files based on your deployment domain.

### The Problem (Solved)
- ❌ Hardcoded `robots.txt` with fixed sitemap URL (old: `https://studenttoolhub.vercel.app/sitemap.xml`)
- ❌ Works on one domain, breaks on others
- ❌ Manual updates needed per environment

### The Solution
- ✅ Environment-based URL detection at build time
- ✅ Supports Vercel, Netlify, custom domains, and local development
- ✅ Automatic sitemap generation from tools data
- ✅ Verification script to catch errors early

---

## How It Works

### Build Flow
```
npm run build
    ↓
Vite compiles React app
    ↓
npm run postbuild (automatic)
    ↓
1. generate-sitemap.js → creates dist/sitemap.xml
2. update-robots.js → creates dist/robots.xml with correct sitemap URL
    ↓
Ready for deployment!
```

### URL Detection Hierarchy
The scripts check these sources **in order**:
1. `VITE_SITE_URL` environment variable (recommended)
2. `VERCEL_URL` (Vercel auto-provides)
3. `NETLIFY_SITE_URL` (Netlify auto-provides)
4. Fallback: `https://studenttoolhub.com`

**Result**: robots.txt always contains the correct sitemap URL for your deployment.

---

## Deployment Instructions

### ✅ Option 1: Vercel (Recommended if you use Vercel)

Vercel provides `VERCEL_URL` automatically, but it's better to explicitly set the domain.

#### Setup Steps:

1. **Add environment variable in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_SITE_URL` = `https://studenttoolhub.com` (or your domain)
   - Apply to: All environments (Production, Preview, Development)

2. **Or set per environment**:
   - Production: `https://studenttoolhub.com`
   - Preview: `https://preview.studenttoolhub.com` (optional)
   - Development: Keep default

3. **Deployment**:
   ```bash
   git push  # Vercel auto-deploys
   ```
   Vercel automatically:
   - Runs `npm install`
   - Runs `npm run build` (includes postbuild)
   - Uploads `dist/` with updated `robots.txt` and `sitemap.xml`

4. **Verify**:
   ```bash
   curl https://studenttoolhub.com/robots.txt
   # Should show: Sitemap: https://studenttoolhub.com/sitemap.xml
   ```

---

### ✅ Option 2: Netlify

Netlify also provides `NETLIFY_SITE_URL` automatically.

#### Setup Steps:

1. **Add build environment variable**:
   - Go to Site Settings → Build & deploy → Environment
   - Add `VITE_SITE_URL` = `https://studenttoolhub.com`

2. **Verify build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify will automatically run postbuild

3. **Deploy**:
   ```bash
   git push  # Netlify auto-deploys
   ```

4. **Verify**:
   ```bash
   curl https://your-netlify-site.netlify.app/robots.txt
   ```

---

### ✅ Option 3: Docker / Self-Hosted

#### Dockerfile Setup:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build with environment variable
ARG VITE_SITE_URL=https://studenttoolhub.com
ARG VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX
ARG VITE_GA_ID=G-XXXXXXXXXX

ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_ADSENSE_PUB_ID=${VITE_ADSENSE_PUB_ID}
ENV VITE_GA_ID=${VITE_GA_ID}

RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build & Deploy:
```bash
docker build \
  --build-arg VITE_SITE_URL=https://studenttoolhub.com \
  --build-arg VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX \
  --build-arg VITE_GA_ID=G-XXXXXXXXXX \
  -t studenttoolhub:latest .

docker run -p 80:80 studenttoolhub:latest
```

---

### ✅ Option 4: GitHub Pages

GitHub Pages doesn't support environment variables directly, but you can use GitHub Actions.

#### .github/workflows/deploy.yml:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SITE_URL: https://yourusername.github.io/studenttoolhub
        run: npm run build
      
      - name: Verify robots.txt
        run: npm run verify-robots
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

### ✅ Option 5: AWS S3 + CloudFront

#### AWS CLI approach:
```bash
#!/bin/bash
export VITE_SITE_URL="https://studenttoolhub.com"
export VITE_ADSENSE_PUB_ID="ca-pub-XXXXXXXXXXXXXXXX"
export VITE_GA_ID="G-XXXXXXXXXX"

npm run build

# Upload to S3
aws s3 sync dist/ s3://my-bucket/studenttoolhub/ --delete

# Verify
curl https://studenttoolhub.com/robots.txt
```

---

### ✅ Option 6: Custom Nginx

#### nginx.conf:
```nginx
server {
    listen 80;
    server_name studenttoolhub.com;

    root /var/www/dist;
    index index.html;

    # Serve robots.txt with correct headers
    location = /robots.txt {
        add_header Cache-Control "public, max-age=86400";
        add_header Content-Type "text/plain";
    }

    # Serve sitemap.xml
    location = /sitemap.xml {
        add_header Cache-Control "public, max-age=604800";
        add_header Content-Type "application/xml";
    }

    # SPA fallback - serve index.html for routes
    location / {
        try_files $uri /index.html;
    }

    # Assets with long cache
    location ~* \.(js|css|png|jpg|gif|svg)$ {
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

#### Deployment:
```bash
export VITE_SITE_URL="https://studenttoolhub.com"
npm run build
scp -r dist/* user@server:/var/www/dist/
ssh user@server "sudo systemctl reload nginx"
```

---

## Local Development

### Running Locally

1. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** (optional - defaults work):
   ```
   VITE_SITE_URL=http://localhost:5173
   VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX
   VITE_GA_ID=G-XXXXXXXXXX
   ```

3. **Run development server**:
   ```bash
   npm run dev
   # http://localhost:5173
   ```

4. **Build for production**:
   ```bash
   npm run build
   # Check: cat dist/robots.txt
   # Should show: Sitemap: https://studenttoolhub.com/sitemap.xml
   ```

5. **Verify configuration**:
   ```bash
   npm run verify-robots
   ```

---

## Verification Steps

### 1. Local Build Verification

```bash
# Build and verify
npm run build

# Check robots.txt has correct URL
cat dist/robots.txt

# Run verification script
npm run verify-robots

# Expected output:
# ✅ robots.txt found
# ✅ Sitemap URL: https://studenttoolhub.com/sitemap.xml
# ✅ All checks passed!
```

### 2. Production Verification

After deployment:

#### Check robots.txt:
```bash
curl https://studenttoolhub.com/robots.txt

# Should output:
# User-agent: *
# Allow: /
# Disallow:
# Sitemap: https://studenttoolhub.com/sitemap.xml
```

#### Check sitemap.xml:
```bash
curl https://studenttoolhub.com/sitemap.xml

# Should be valid XML with correct domain URLs
```

#### Check with SEO Tools:
- [Google Search Console](https://search.google.com/search-console/welcome)
  - Submit sitemap: https://studenttoolhub.com/sitemap.xml
  - Check robots.txt: https://studenttoolhub.com/robots.txt
  
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
  - Crawl your site
  - Check for robots.txt compliance

#### Check Headers:
```bash
curl -I https://studenttoolhub.com/robots.txt

# Should have proper headers:
# Content-Type: text/plain
# Content-Length: [size]
```

### 3. Automated Verification in CI/CD

Add to your deployment pipeline:

```yaml
# GitHub Actions example
- name: Verify robots.txt configuration
  run: npm run verify-robots

- name: Check for localhost URLs
  run: |
    if grep -r "localhost\|127.0.0.1" dist/robots.txt dist/sitemap.xml 2>/dev/null; then
      echo "❌ ERROR: Found localhost URLs in built files!"
      exit 1
    fi
    echo "✅ No localhost URLs found"

- name: Validate sitemap.xml
  run: |
    if ! grep -q "<?xml" dist/sitemap.xml; then
      echo "❌ ERROR: sitemap.xml is not valid XML!"
      exit 1
    fi
    echo "✅ sitemap.xml is valid"
```

---

## Troubleshooting

### Issue: robots.txt shows old URL after deployment

**Solution**:
1. Check environment variable in deployment platform
2. Rebuild: `npm run build`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Verify: `curl https://your-domain.com/robots.txt`

### Issue: Sitemap URL is localhost

**Solution**:
```bash
# Set the variable correctly
export VITE_SITE_URL="https://yourdomain.com"
npm run build
npm run verify-robots
```

### Issue: robots.txt not updating via npm run build

**Solution**:
```bash
# Check if postbuild script runs
npm run build -- --verbose

# Manually run postbuild
node scripts/generate-sitemap.js
node scripts/update-robots.js
```

### Issue: Verification script fails

**Solution**:
```bash
# Run with debug output
node scripts/verify-robots.js

# Check dist/ folder exists
ls -la dist/

# Rebuild
rm -rf dist
npm run build
```

---

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SITE_URL` | Domain for robots.txt sitemap URL | `https://studenttoolhub.com` |
| `VITE_ADSENSE_PUB_ID` | Google AdSense Publisher ID | `ca-pub-XXXXXXXXXXXXXXXX` |
| `VITE_GA_ID` | Google Analytics 4 Property ID | `G-XXXXXXXXXX` |
| `VERCEL_URL` | Vercel auto-provided (preview/deploy URL) | `my-app-abc123.vercel.app` |
| `VERCEL_ENV` | Vercel deployment environment | `production`, `preview`, `development` |
| `NETLIFY_SITE_URL` | Netlify auto-provided site URL | `https://my-site.netlify.app` |

---

## Advanced: Multi-Domain Setup

If you deploy to multiple domains (e.g., production + staging):

#### Vercel Example:
```
Project: studenttoolhub-prod
  Branch: main
  VITE_SITE_URL: https://studenttoolhub.com

Project: studenttoolhub-staging  
  Branch: develop
  VITE_SITE_URL: https://staging.studenttoolhub.com
```

#### Environment-Specific Build:
```bash
# Production build
VITE_SITE_URL=https://studenttoolhub.com npm run build

# Staging build
VITE_SITE_URL=https://staging.studenttoolhub.com npm run build

# Preview build
VITE_SITE_URL=https://preview.studenttoolhub.com npm run build
```

---

## Maintenance

### Monthly Tasks:
- ✅ Monitor robots.txt in Google Search Console
- ✅ Check sitemap indexation status
- ✅ Verify 200 status for both files

### After Adding New Tools:
- Sitemap automatically regenerates on next `npm run build`
- No manual updates needed

### After Changing Domain:
1. Update `VITE_SITE_URL` environment variable
2. Rebuild: `npm run build`
3. Update domain in deployment platform DNS
4. Verify: `curl https://new-domain.com/robots.txt`
5. Update Google Search Console

---

## Next Steps

1. ✅ Set `VITE_SITE_URL` in your deployment platform
2. ✅ Deploy your app: `git push`
3. ✅ Verify: `curl https://your-domain.com/robots.txt`
4. ✅ Submit sitemap to Google Search Console
5. ✅ Monitor in Search Console for issues

---

## Related Files

- [.env.example](.env.example) - Environment variable template
- [scripts/update-robots.js](scripts/update-robots.js) - robots.txt generator
- [scripts/generate-sitemap.js](scripts/generate-sitemap.js) - sitemap.xml generator
- [scripts/verify-robots.js](scripts/verify-robots.js) - Verification script
- [public/robots.txt](public/robots.txt) - robots.txt template
- [package.json](package.json) - Build scripts
