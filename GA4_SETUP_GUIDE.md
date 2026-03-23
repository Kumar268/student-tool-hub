# Google Analytics 4 (GA4) Setup Guide

Complete guide to setting up and tracking Google Analytics 4 in your StudentToolHub project.

## ✅ Quick Setup (5 minutes)

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Create Property"** → **"Website"**
4. Enter your website info:
   - **Property name**: StudentToolHub
   - **Website URL**: https://studenttoolhub.com
   - **Industry**: Education/Training
   - **Reporting timezone**: Your timezone
5. Click through setup (accept Google Analytics terms)
6. **Copy your Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Your Project

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` and add your ID:

```
# Google Analytics 4
VITE_GA_ID=G-A1B2C3D4E5
```

### Step 3: Deploy

```bash
npm run build
git push
```

✅ GA4 is now active! (User must accept cookie consent first)

---

## 📊 How Analytics Works in Your App

```
User Visits Site
    ↓
CookieConsent Banner Shows
    ↓
User Accepts Cookies
    ↓
initGA() runs ← Loads gtag.js script
    ↓
User navigates to tool
    ↓
pageview() sent to GA4
    ↓
User uses tool (calculates, converts, etc.)
    ↓
trackToolUsage() sent to GA4
    ↓
Google Analytics dashboard shows data
    ↓
You see: "Most used tools", "User actions", "Traffic sources"
```

---

## 🔧 API Reference

### `initGA()`
Initializes Google Analytics. Called automatically by CookieConsent when user accepts.

```javascript
import { initGA } from '../utils/analytics';

// Called automatically, but you can call manually:
initGA();
```

**When it runs:**
- ✅ CookieConsent component (after user accepts)
- ✅ Router.jsx (as fallback)

**Skips if:**
- ❌ `VITE_GA_ID` is missing
- ❌ `VITE_GA_ID` contains placeholder `XXXX`
- ❌ User hasn't accepted cookies

---

### `pageview(path)`
Sends a page view event. Called on every route change.

```javascript
import { pageview } from '../utils/analytics';

// In Router.jsx (already done):
useEffect(() => {
  pageview(location.pathname);
}, [location]);
```

**Parameters:**
- `path` (string) - The URL path (e.g., `/tools/academic/calculus-solver`)

**In GA4 you'll see:**
- Page Path
- Page Title
- Traffic flow between pages

---

### `trackToolUsage(action, toolName, category)`
**⭐ MAIN EVENT** — Use this for tracking tool interactions.

```javascript
import { trackToolUsage } from '../utils/analytics';

// User calculated something
trackToolUsage('calculate', 'GPA Calculator', 'utility');

// User converted a file
trackToolUsage('convert', 'PDF to Image', 'image');

// User generated a document
trackToolUsage('generate', 'Resume Builder', 'documentmaker');

// User downloaded a result
trackToolUsage('download', 'Certificate', 'documentmaker');
```

**Parameters:**
- `action` (string) - What happened: `calculate`, `convert`, `generate`, `download`
- `toolName` (string) - Tool display name
- `category` (string) - Tool category (e.g., `academic`, `utility`, `pdf`)

**In GA4 you'll see:**
- Which tools are most used
- What actions users take
- Popular features per tool

---

### `trackSearch(query, resultsCount)`
Track search/filter usage.

```javascript
import { trackSearch } from '../utils/analytics';

const handleSearch = (query) => {
  const results = tools.filter(t => 
    t.name.includes(query) || t.description.includes(query)
  );
  
  trackSearch(query, results.length);
};
```

**In GA4 you'll see:**
- Popular search terms
- Search success rate
- Terms with zero results

---

### `trackExport(method, toolName)`
Track exports/downloads (PDF, print, copy, etc.).

```javascript
import { trackExport } from '../utils/analytics';

const exportToPDF = () => {
  // ... PDF generation code
  trackExport('pdf', 'GPA Calculator');
};

const printResult = () => {
  window.print();
  trackExport('print', 'Resume Builder');
};

const copyToClipboard = () => {
  // ... copy code
  trackExport('copy', 'JSON Formatter');
};
```

**In GA4 you'll see:**
- Most exported tools
- Popular export formats
- Feature engagement

---

### `trackError(errorType, toolName, message)`
Track errors for debugging.

```javascript
import { trackError } from '../utils/analytics';

try {
  // Complex calculation
  const result = complexMath(input);
} catch (error) {
  trackError('calculation_error', 'Matrix Algebra', error.message);
}
```

**In GA4 you'll see:**
- Which tools have errors
- Error frequency
- Helps identify bugs

---

### `trackEvent(eventName, data)`
Generic event tracker for custom events.

```javascript
import { trackEvent } from '../utils/analytics';

// Custom events
trackEvent('button_click', { button_name: 'Copy Result' });
trackEvent('feature_used', { feature: 'Dark Mode' });
trackEvent('tool_installed', { tool_name: 'Calculator' });
```

---

## 💡 Implementation Examples

### Example 1: Calculator Tool

```jsx
import { trackToolUsage, trackExport } from '../utils/analytics';

const Calculator = ({ isDarkMode }) => {
  const [result, setResult] = useState(null);

  const calculate = () => {
    // ... calculation logic
    setResult(answer);
    
    // Track that user calculated something
    trackToolUsage('calculate', 'GPA Calculator', 'utility');
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    trackExport('copy', 'GPA Calculator');
  };

  const downloadPDF = () => {
    // ... PDF generation
    trackExport('pdf', 'GPA Calculator');
  };

  return (
    <div>
      {/* ... your UI ... */}
      <button onClick={calculate}>Calculate</button>
      <button onClick={copyResult}>Copy Result</button>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};
```

In GA4 you'll see:
- User clicked "Calculate" → event: `calculate`
- User copied result → event: `export` (method: `copy`)
- User downloaded PDF → event: `export` (method: `pdf`)

---

### Example 2: PDF Tool with Multiple Actions

```jsx
import { trackToolUsage, trackExport, trackError } from '../utils/analytics';

const PDFMerger = ({ isDarkMode }) => {
  const [files, setFiles] = useState([]);

  const mergePDFs = async () => {
    try {
      // Track that user is merging PDFs
      trackToolUsage('merge', 'PDF Merger', 'pdf');

      // ... merge logic
      const result = await pdfjsLib.merge(files);
      
      // Optional: track successful export
      setTimeout(() => {
        trackExport('pdf', 'PDF Merger');
      }, 500);
      
    } catch (error) {
      trackError('merge_failed', 'PDF Merger', error.message);
    }
  };

  const splitPDF = async () => {
    try {
      trackToolUsage('split', 'PDF Splitter', 'pdf');
      // ... split logic
    } catch (error) {
      trackError('split_failed', 'PDF Splitter', error.message);
    }
  };

  return (
    <div>
      {/* ... your UI ... */}
      <button onClick={mergePDFs}>Merge PDFs</button>
      <button onClick={splitPDF}>Split PDF</button>
    </div>
  );
};
```

---

### Example 3: Conversion Tool

```jsx
import { trackToolUsage, trackExport } from '../utils/analytics';

const ImageConverter = () => {
  const convert = async (format) => {
    // Track conversion tool usage
    trackToolUsage('convert', 'Image Converter', 'image');

    // Do conversion
    const converted = await convertImage(image, format);

    // Track the export
    trackExport(format.toLowerCase(), 'Image Converter');
  };

  return (
    <div>
      <button onClick={() => convert('PNG')}>Convert to PNG</button>
      <button onClick={() => convert('JPEG')}>Convert to JPEG</button>
      <button onClick={() => convert('WEBP')}>Convert to WEBP</button>
    </div>
  );
};
```

In GA4 you'll see:
- `convert` action with tool: `Image Converter`
- Export types: `png`, `jpeg`, `webp`
- Most popular format
- Conversion frequency

---

## 🔍 Verify GA4 is Working

### Method 1: Browser DevTools (Real-time)

```javascript
// Open browser Console (F12 → Console)

// Check GA4 status
window.__ga_initialized  // Should be: true

// Check window.gtag exists
window.gtag             // Should be: [Function]

// Check GA ID
window.gtag('get', 'G-XXXXXXXXXX', 'client_id', alert)

// Send test event
window.gtag('event', 'test_event', {
  test: true,
  timestamp: new Date()
})
```

### Method 2: Google Analytics Real-time Report

```
1. Go to Google Analytics Dashboard
2. Click "Reports" → "Real-time"
3. Do an action in your app (calculate, convert, etc.)
4. You should see:
   - "Active users now" count increase
   - "Events" showing your actions
   - Page paths showing pages visited
```

### Method 3: Check Environment Variable

```javascript
// In browser console:
import.meta.env.VITE_GA_ID  // Should show: G-xxxxxx (not xxx...XXXX)
```

### Method 4: Use our GA Status Checker

```javascript
// In browser console:
import { getGAStatus } from './utils/analytics';
console.log(getGAStatus());

// Output:
// {
//   enabled: true,
//   initialized: true,
//   gaId: "***D4E5F6",
//   isDevelopment: false
// }
```

---

## ⚠️ Common Issues & Fixes

### Issue: GA4 not tracking anything

**Check 1: Is VITE_GA_ID set?**
```bash
# Check .env file
cat .env | grep VITE_GA_ID
# Should show: VITE_GA_ID=G-A1B2C3D4E5
```

**Check 2: Did user accept cookies?**
```javascript
// In console:
localStorage.getItem('cookie_consent')
// Should show: "accepted"
```

**Check 3: Is GA initialized?**
```javascript
// In console:
window.__ga_initialized  // Should be: true
```

**Check 4: Is gtag loaded?**
```javascript
// In console:
typeof window.gtag  // Should be: "function"
```

**Fix: Reload page and accept cookies**
```
1. Reject cookies (localStorage.clear())
2. Hard refresh (Ctrl+Shift+R)
3. Accept cookies in banner
4. Check window.__ga_initialized = true
```

---

### Issue: "VITE_GA_ID is missing in .env"

**Fix:**
```bash
# Copy template
cp .env.example .env

# Add your GA ID
nano .env
# Add line: VITE_GA_ID=G-A1B2C3D4E5

# Rebuild
npm run build
```

---

### Issue: GA works locally but not in production

**Check:**
1. Is `VITE_GA_ID` set in your platform (Vercel/Netlify)?
2. Is the `.env` file deployed?
3. Did you rebuild after adding GA ID?

**Fix for Vercel:**
```
Project Settings → Environment Variables → Add:
VITE_GA_ID = G-A1B2C3D4E5
```

**Fix for Netlify:**
```
Site Settings → Build & Deploy → Environment → Variables → Add:
VITE_GA_ID = G-A1B2C3D4E5
```

---

## 📈 Viewing Analytics

### Key Reports

1. **Real-time** (Real-time)
   - See active users right now
   - Current events and page views
   - Useful for testing

2. **Users** (User → Overview)
   - Total active users
   - New vs returning users
   - Geographic distribution

3. **Events** (Reports → Events)
   - Custom events: `calculate`, `convert`, `download`
   - Which tools are used most
   - User actions per tool

4. **Pages and Screens** (Reports → Pages)
   - Most visited pages
   - Tool pages (e.g., `/tools/academic/gpa-calculator`)
   - Bounce rate per page

5. **User Journey** (Explore → User Exploration)
   - Path users take through site
   - Funnel: Search → Tool → Export

---

## 🔒 Privacy & GDPR Compliance

Your setup is GDPR compliant:

```javascript
// In analytics.js
window.gtag('config', GA_ID, { 
  anonymize_ip: true,    // ✅ IP addresses anonymized
});

// User consent respected:
if (stored === 'accepted') initGA();  // ✅ Only load if accepted
```

**Privacy considerations:**
- ✅ No personal data collected
- ✅ Users can opt-out (reject cookies)
- ✅ IP addresses anonymized
- ✅ Tool usage tracked (not user identity)
- ✅ Privacy policy mentions analytics

---

## 🚀 Production Checklist

Before going live:

- ✅ `VITE_GA_ID` is set in `.env.example`
- ✅ `VITE_GA_ID` is set in deployment platform (Vercel/Netlify)
- ✅ CookieConsent banner is visible
- ✅ Users can accept/reject cookies
- ✅ GA4 property is created in analytics.google.com
- ✅ GA4 loads after user accepts cookies
- ✅ Real-time report shows your test events
- ✅ Privacy policy mentions analytics
- ✅ Mobile analytics are tracked
- ✅ Error tracking is working

---

## 📝 Using Analytics Data

### Find Your Most Used Tools
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter by event_category = "tool_usage"
  → Sort by "Count"
```

### Track Feature Adoption
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter by action = "calculate" or "convert" etc.
  → See tools with highest usage
```

### Identify Problems
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter by event_category = "tool_error"
  → Fix errors in tools with most failures
```

### Monitor Empty Searches
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter by event_name = "search"
  → Check which searches return 0 results
  → Add more tools to cover those use cases
```

---

## 📞 Support

**Google Analytics Help:**
- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Events Hub](https://support.google.com/analytics/topic/9756891)

**Your Setup:**
- [Check analytics.js](./src/utils/analytics.js)
- [Check CookieConsent](./src/components/CookieConsent.jsx)
- [Check Router GA calls](./src/Router.jsx)

---

## Quick Command Reference

```bash
# Check if GA_ID is set
echo $VITE_GA_ID

# Test on local dev
VITE_GA_ID=G-TEST123 npm run dev

# Build with GA tracking
npm run build

# Check build output (should have gtag script reference)
grep -r "googletagmanager" dist/

# Deploy
git push
```

---

**Last Updated:** March 2026  
**Status:** ✅ Production Ready
