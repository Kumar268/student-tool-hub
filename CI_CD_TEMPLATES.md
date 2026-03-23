# CI/CD Configuration Templates

Quick reference CI/CD configurations for popular platforms.

## GitHub Actions (GitHub Pages / Custom Server)

**File**: `.github/workflows/build-and-deploy.yml`

### Example 1: GitHub Pages Deployment
```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        env:
          VITE_SITE_URL: https://${{ github.repository_owner }}.github.io/studenttoolhub
          VITE_ADSENSE_PUB_ID: ${{ secrets.ADSENSE_PUB_ID }}
          VITE_GA_ID: ${{ secrets.GA_ID }}
        run: npm run build

      - name: Verify robots.txt
        run: npm run verify-robots

      - name: Check no localhost URLs
        run: |
          if grep -r "localhost\|127.0.0.1" dist/robots.txt dist/sitemap.xml 2>/dev/null; then
            echo "❌ Found localhost URLs in production build!"
            exit 1
          fi

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  verify-deployment:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Wait for deployment
        run: sleep 30

      - name: Verify robots.txt on live site
        run: |
          ROBOTS=$(curl -s https://${{ github.repository_owner }}.github.io/studenttoolhub/robots.txt)
          if echo "$ROBOTS" | grep -q "Sitemap:"; then
            echo "✅ robots.txt deployed successfully"
            echo "$ROBOTS"
          else
            echo "❌ robots.txt verification failed"
            exit 1
          fi

      - name: Verify sitemap.xml
        run: |
          curl -s https://${{ github.repository_owner }}.github.io/studenttoolhub/sitemap.xml | head -20
```

### Example 2: Self-Hosted Server Deployment
```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

env:
  DEPLOY_SERVER: ${{ secrets.DEPLOY_SERVER }}
  DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
  DEPLOY_PATH: /var/www/studenttoolhub

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Build
        env:
          VITE_SITE_URL: https://studenttoolhub.com
          VITE_ADSENSE_PUB_ID: ${{ secrets.ADSENSE_PUB_ID }}
          VITE_GA_ID: ${{ secrets.GA_ID }}
        run: |
          npm ci
          npm run build
          npm run verify-robots

      - name: Deploy via SSH
        env:
          PRIVATE_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$PRIVATE_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_SERVER >> ~/.ssh/known_hosts
          
          # Copy files
          scp -i ~/.ssh/deploy_key -r dist/* $DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH/
          
          # Restart service (optional)
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_SERVER "sudo systemctl reload nginx"

      - name: Verify live deployment
        run: curl https://studenttoolhub.com/robots.txt
```

---

## Vercel Deployment

**No workflow file needed** - Vercel auto-detects `package.json` scripts.

### Configuration:

1. **Vercel Dashboard** → Project Settings → Environment Variables

Add these for **all environments** (Production, Preview, Development):

```
VITE_SITE_URL = https://studenttoolhub.com
VITE_ADSENSE_PUB_ID = ca-pub-XXXXXXXXXXXXXXXX
VITE_GA_ID = G-XXXXXXXXXX
```

2. **Build Settings** (auto-detected):

```
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

3. **Deploy**:

```bash
git push  # Vercel auto-deploys
```

Vercel will automatically:
- Run `npm run build`
- Run `npm run postbuild` (our scripts)
- Deploy `dist/` with correct `robots.txt`

---

## Netlify Deployment

### Option 1: UI Configuration

1. **Site Settings** → **Build & Deploy** → **Environment**

Add:
```
VITE_SITE_URL = https://studenttoolhub.com
VITE_ADSENSE_PUB_ID = ca-pub-XXXXXXXXXXXXXXXX
VITE_GA_ID = G-XXXXXXXXXX
```

2. **Build settings**:
```
Build command: npm run build
Publish directory: dist
```

### Option 2: netlify.toml

**File**: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_SITE_URL = "https://studenttoolhub.com"
  VITE_ADSENSE_PUB_ID = "ca-pub-XXXXXXXXXXXXXXXX"
  VITE_GA_ID = "G-XXXXXXXXXX"

[context.production.environment]
  VITE_SITE_URL = "https://studenttoolhub.com"

[context.deploy-preview.environment]
  VITE_SITE_URL = "https://preview.studenttoolhub.com"

[[headers]]
  for = "/robots.txt"
  [headers.values]
    Cache-Control = "public, max-age=86400"
    Content-Type = "text/plain"

[[headers]]
  for = "/sitemap.xml"
  [headers.values]
    Cache-Control = "public, max-age=604800"
    Content-Type = "application/xml"
```

---

## AWS Amplify

**File**: `amplify.yml`

```yaml
version: 1

frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
    postBuild:
      commands:
        - npm run verify-robots
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'

env:
  variables:
    VITE_SITE_URL: https://studenttoolhub.com
    VITE_ADSENSE_PUB_ID: ca-pub-XXXXXXXXXXXXXXXX
    VITE_GA_ID: G-XXXXXXXXXX
```

---

## GitLab CI/CD

**File**: `.gitlab-ci.yml`

```yaml
stages:
  - build
  - verify
  - deploy

variables:
  VITE_SITE_URL: https://studenttoolhub.com
  VITE_ADSENSE_PUB_ID: $ADSENSE_PUB_ID
  VITE_GA_ID: $GA_ID

build:
  stage: build
  image: node:18-alpine
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

verify:
  stage: verify
  image: node:18-alpine
  dependencies:
    - build
  script:
    - npm run verify-robots
    - 'if grep -r "localhost\|127.0.0.1" dist/robots.txt dist/sitemap.xml 2>/dev/null; then echo "ERROR: Found localhost URLs"; exit 1; fi'

deploy:
  stage: deploy
  image: alpine:latest
  dependencies:
    - build
  script:
    - apk add --no-cache rsync openssh-client
    - mkdir -p ~/.ssh
    - echo "$DEPLOY_KEY" | base64 -d > ~/.ssh/deploy_key
    - chmod 600 ~/.ssh/deploy_key
    - ssh-keyscan -H $DEPLOY_SERVER >> ~/.ssh/known_hosts
    - rsync -avz --delete -e 'ssh -i ~/.ssh/deploy_key' dist/ $DEPLOY_USER@$DEPLOY_SERVER:/var/www/studenttoolhub/
    - ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_SERVER "sudo systemctl reload nginx"
  only:
    - main
```

---

## Docker Build

**File**: `Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build arguments for environment
ARG VITE_SITE_URL=https://studenttoolhub.com
ARG VITE_ADSENSE_PUB_ID
ARG VITE_GA_ID

ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_ADSENSE_PUB_ID=${VITE_ADSENSE_PUB_ID}
ENV VITE_GA_ID=${VITE_GA_ID}

COPY . .
RUN npm run build && npm run verify-robots

# Runtime stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/robots.txt || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**File**: `nginx.conf`

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # robots.txt: cache for 1 day
    location = /robots.txt {
        add_header Cache-Control "public, max-age=86400";
        add_header Content-Type "text/plain";
    }

    # sitemap.xml: cache for 7 days
    location = /sitemap.xml {
        add_header Cache-Control "public, max-age=604800";
        add_header Content-Type "application/xml";
    }

    # SPA routing
    location / {
        try_files $uri /index.html;
    }

    # Assets: long-term cache
    location ~* \.(js|css|png|jpg|gif|svg|woff2?)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

**Build and run**:

```bash
docker build \
  --build-arg VITE_SITE_URL=https://studenttoolhub.com \
  --build-arg VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX \
  --build-arg VITE_GA_ID=G-XXXXXXXXXX \
  -t studenttoolhub:latest .

docker run -p 80:80 studenttoolhub:latest
```

---

## Environment Variables by Platform

| Platform | How to Set |
|----------|-----------|
| **Vercel** | Project Settings → Environment Variables |
| **Netlify** | Site Settings → Environment or netlify.toml |
| **GitHub Actions** | `env:` section or `${{ secrets.VAR }}` |
| **GitLab CI** | Settings → CI/CD → Variables |
| **AWS Amplify** | amplify.yml or Deployment settings |
| **Docker** | `--build-arg` or `ENV` in Dockerfile |
| **Local Dev** | `.env` file (copy from `.env.example`) |

---

## Secrets Management

### GitHub Actions Example:

```bash
# Add secrets to GitHub
gh secret set ADSENSE_PUB_ID --body "ca-pub-XXXXXXXXXXXXXXXX"
gh secret set GA_ID --body "G-XXXXXXXXXX"
```

Reference in workflow:
```yaml
env:
  VITE_ADSENSE_PUB_ID: ${{ secrets.ADSENSE_PUB_ID }}
  VITE_GA_ID: ${{ secrets.GA_ID }}
```

---

## Verification Commands for All Platforms

```bash
# After deployment, run these:

# Check robots.txt
curl https://your-domain.com/robots.txt
# Should show: Sitemap: https://your-domain.com/sitemap.xml

# Check sitemap.xml
curl https://your-domain.com/sitemap.xml | head -5
# Should be valid XML

# Check response headers
curl -I https://your-domain.com/robots.txt
# Check for proper Content-Type and Cache-Control
```

---

## Troubleshooting CI/CD Issues

### robots.txt still shows old URL

```bash
# Clear Vercel cache
vercel --prod --clear-cache

# Clear Netlify cache via dashboard or CLI
netlify api clearCache
```

### Build fails in CI/CD but works locally

```bash
# Check environment variables are set in platform
# Rebuild with verbose output
npm run build -- --verbose
npm run verify-robots
```

### Sitemap URL has localhost

```bash
# Verify VITE_SITE_URL is set in build environment
# NOT in runtime environment
# It must be set BEFORE npm run build
```

