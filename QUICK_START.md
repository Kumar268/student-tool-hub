# 🚀 QUICK START - Replace These 4 Values NOW

## ⚡ 5-Minute Setup

### 1. Get Your AdSense Publisher ID
1. Go to: https://adsense.google.com
2. Click: Account → Account Information
3. Copy your Publisher ID (looks like: `ca-pub-1234567890123456`)

### 2. Get Your GA4 Measurement ID
1. Go to: https://analytics.google.com
2. Click: Admin → Data Streams → Web
3. Copy Measurement ID (looks like: `G-ABC123XYZ`)

### 3. Get Your Formspree Form ID
1. Go to: https://formspree.io/forms
2. Sign up (free)
3. Create new form
4. Copy form ID (looks like: `xyzabc123`)

### 4. Replace in These Files

#### File 1: `index.html` (line 77)
```html
<!-- FIND THIS: -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>

<!-- REPLACE WITH: -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID" crossorigin="anonymous"></script>
```

#### File 2: `.env` (lines 3-5)
```bash
# FIND THIS:
VITE_GA_ID=G-XXXXXXXXXX
VITE_ADS_ENABLED=true
VITE_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXX

# REPLACE WITH:
VITE_GA_ID=G-YOUR_ACTUAL_GA4_ID
VITE_ADS_ENABLED=true
VITE_ADSENSE_PUB_ID=ca-pub-YOUR_ACTUAL_ADSENSE_ID
```

#### File 3: `public/ads.txt` (line 5)
```
# FIND THIS:
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0

# REPLACE WITH (remove 'ca-' prefix):
google.com, pub-YOUR_ACTUAL_ID, DIRECT, f08c47fec0942fa0
```

#### File 4: `src/pages/Contact.jsx` (line 12)
```javascript
// FIND THIS:
const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {

// REPLACE WITH:
const response = await fetch('https://formspree.io/f/YOUR_ACTUAL_FORM_ID', {
```

---

## 🔧 Add Quadratic Tool (2 minutes)

### Open `src/data/tools.js`

Find line ~455 (Scientific Calculator) and add this AFTER it:

```javascript
  {
    id: 77,
    name: 'Quadratic Equation Solver',
    description: 'Solve quadratic equations with step-by-step solutions and discriminant analysis',
    category: 'academic',
    icon: 'Calculator',
    slug: 'quadratic-solver',
    tags: ['math', 'algebra', 'quadratic', 'equation', 'roots']
  },
```

Then change the next tool's ID from 77 to 78, and increment all following IDs by 1.

---

## ✅ Test & Deploy

```bash
# Test locally
npm run dev

# Build
npm run build

# Deploy
git add .
git commit -m "Configure AdSense, GA4, and add Quadratic Solver"
git push
```

---

## 🎯 That's It!

You've completed all 8 critical fixes. Your site is now ready for AdSense approval!

**Next:** Wait 24-48 hours for AdSense ads to start showing after approval.

---

## 📋 Quick Checklist

- [ ] Replaced AdSense ID in `index.html`
- [ ] Replaced AdSense ID in `.env`
- [ ] Replaced Publisher ID in `ads.txt` (no 'ca-' prefix)
- [ ] Replaced GA4 ID in `.env`
- [ ] Replaced Formspree ID in `Contact.jsx`
- [ ] Added Quadratic tool to `tools.js`
- [ ] Tested locally (`npm run dev`)
- [ ] Built successfully (`npm run build`)
- [ ] Deployed to production

**Done? You're ready to go live!** 🚀
