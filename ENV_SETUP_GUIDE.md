# Environment Variables Setup Guide

This file helps you set up `VITE_SITE_URL` across different platforms.

## Quick Setup by Platform

### 🔷 Vercel

1. Go to [Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings**
3. Go to **Environment Variables**
4. Add new variable:
   - Name: `VITE_SITE_URL`
   - Value: `https://studenttoolhub.com`
   - Scopes: `Production`, `Preview`, `Development`
5. Click "Save"
6. Redeploy your project

**Verification**:
```bash
# After deployment (30 seconds)
curl https://studenttoolhub.com/robots.txt
# Should show: Sitemap: https://studenttoolhub.com/sitemap.xml
```

---

### 🔷 Netlify

**Option A: Via Dashboard**
1. Go to [Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click "Edit variables"
5. Add:
   - Key: `VITE_SITE_URL`
   - Value: `https://your-domain.com`
6. Click "Save"
7. Trigger a new deploy

**Option B: Via netlify.toml** (in your repo)
```toml
[build]
  command = "npm run build"
  
[build.environment]
  VITE_SITE_URL = "https://studenttoolhub.com"
```

**Verification**:
```bash
curl https://your-site.netlify.app/robots.txt
```

---

### 🔷 GitHub Actions

Add to your `.github/workflows/deploy.yml`:

```yaml
env:
  VITE_SITE_URL: https://yourusername.github.io/studenttoolhub
  VITE_ADSENSE_PUB_ID: ${{ secrets.ADSENSE_PUB_ID }}
  VITE_GA_ID: ${{ secrets.GA_ID }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run verify-robots
```

---

### 🔷 Local Development

```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env
# or
code .env

# Set:
VITE_SITE_URL=https://your-domain.com
VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_GA_ID=G-XXXXXXXXXX

# Test
npm run build
npm run verify-robots
```

---

## Environment Variable Values by Scenario

| Scenario | VITE_SITE_URL | VITE_ADSENSE_PUB_ID | VITE_GA_ID |
|----------|---------------|-------------------|----------|
| Production | `https://studenttoolhub.com` | Real ID | Real ID |
| Staging | `https://staging.studenttoolhub.com` | Real ID | Real ID |
| Development | `http://localhost:5173` | No | No |
| Vercel Preview | `https://preview-abc123.vercel.app` | Real ID | Real ID |
| GitHub Pages | `https://yourusername.github.io/repo` | Real ID | Real ID |

---

## Using .env (Local Development)

### Create .env from template
```bash
cp .env.example .env
```

### Edit .env
```
# Site URL for build time
VITE_SITE_URL=https://your-domain.com

# Google AdSense
VITE_ADS_ENABLED=true
VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX

# Google Analytics
VITE_GA_ID=G-XXXXXXXXXX
```

### Don't commit .env
Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## Reference: Where Different Platforms Set Variables

| Platform | Where to Set | How |
|----------|------------|-----|
| **Vercel** | Dashboard → Project Settings → Environment Variables | UI form |
| **Netlify** | Dashboard → Site Settings → Build & deploy → Environment | UI or netlify.toml |
| **GitHub Pages** | `.github/workflows/deploy.yml` | `env:` section |
| **GitLab CI** | `.gitlab-ci.yml` | `variables:` section or CI/CD settings |
| **Docker** | `Dockerfile` | `--build-arg` or `ENV` |
| **Local** | `.env` file | Text file (don't commit) |
| **AWS Amplify** | `amplify.yml` or dashboard | YAML file or UI |

---

## Verification Each Platform

### After setting the variable:

```bash
# Vercel - Wait and push
git push
# Check after 30 seconds
curl https://studenttoolhub.com/robots.txt

# Netlify - Trigger redeploy  
# Or push new commit
# Check after deploy completes
curl https://your-site.netlify.app/robots.txt

# GitHub Pages - Push and wait
git push
# Check after workflow completes
curl https://yourusername.github.io/repo/robots.txt

# Docker - Rebuild with arg
docker build --build-arg VITE_SITE_URL=https://domain.com -t app .
docker run app
curl http://localhost/robots.txt

# Local - Build and check
npm run build
cat dist/robots.txt
```

---

## Troubleshooting

### Variable not being used

1. **Did you set it?**
   - Vercel: Check Project Settings → Environment Variables
   - Netlify: Check Site Settings → Environment
   - Local: Check you ran `npm run build` after setting .env

2. **Did you rebuild after setting?**
   ```bash
   npm run build  # Must rebuild for env vars to take effect
   ```

3. **Is it wrong format?**
   ```bash
   # ✅ CORRECT
   VITE_SITE_URL=https://studenttoolhub.com
   
   # ❌ WRONG
   VITE_SITE_URL = https://studenttoolhub.com  (extra spaces)
   VITE_SITE_URL=https://studenttoolhub.com/   (trailing slash)
   VITE_SITE_URL=http://...                     (should be https)
   ```

4. **Verify it's actually set**
   ```bash
   # On Vercel - check build logs
   # On GitHub - check workflow logs
   # Local - check .env file exists and has the variable
   ```

### Still not working?

```bash
# Check the generated robots.txt
npm run build
cat dist/robots.txt
# Should have your domain, not localhost

# Run verification
npm run verify-robots
# Shows exactly what's wrong

# Full check before deploy
npm run final-check
# Gives complete validation report
```

---

## Multi-Domain / Multi-Environment

If you have production, staging, and development:

### Vercel (recommended for you)
Create separate projects:
- `studenttoolhub-prod` (main branch) → `VITE_SITE_URL=https://studenttoolhub.com`
- `studenttoolhub-staging` (develop branch) → `VITE_SITE_URL=https://staging.studenttoolhub.com`
- `studenttoolhub-preview` (feature branches) → `VITE_SITE_URL=https://preview.studenttoolhub.com`

### GitHub Actions
```yaml
jobs:
  build:
    strategy:
      matrix:
        environment: [production, staging, preview]
    environment: ${{ matrix.environment }}
    env:
      VITE_SITE_URL: ${{ secrets.SITE_URL }}
```

Set different `SITE_URL` secrets per environment.

### Netlify
```toml
[context.production]
  environment = { VITE_SITE_URL = "https://studenttoolhub.com" }

[context.dev]
  environment = { VITE_SITE_URL = "https://dev.studenttoolhub.com" }
```

---

## Secrets vs Public Variables

- **VITE_SITE_URL**: ✅ Public - OK to see in build logs
- **VITE_ADSENSE_PUB_ID**: ⚠️ Semi-public - don't expose, use secrets if possible
- **VITE_GA_ID**: ✅ Public - OK to see in build logs

For sensitive variables, use platform secrets:
- Vercel: "Secret" variable type
- GitHub: `${{ secrets.VAR_NAME }}`
- Netlify: Store as regular variable (no secret mode)

---

## Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Set `VITE_SITE_URL` to your actual domain
3. ✅ Set same variable in your deployment platform
4. ✅ Run `npm run build && npm run verify-robots`
5. ✅ Deploy and verify: `curl https://your-domain.com/robots.txt`

Done! Your robots.txt will now always use the correct domain. ✅
