# GA4 Quick Reference Card

**Cheat sheet for adding analytics tracking to your tools.**

## 🔧 Setup (Do This First)

1. **Get GA4 ID** → https://analytics.google.com → Create Property → Copy ID
2. **Add to `.env`** → `VITE_GA_ID=G-XXXXXXXXXX`
3. **Deploy** → `npm run build && git push`
4. ✅ Done! (User must accept cookies first)

---

## 📊 Most Useful Functions

### Track Tool Usage (⭐ MAIN ONE)
```javascript
import { trackToolUsage } from '../utils/analytics';

trackToolUsage('calculate', 'GPA Calculator', 'utility');
trackToolUsage('convert', 'PDF Converter', 'pdf');
trackToolUsage('generate', 'Resume Builder', 'documentmaker');
trackToolUsage('merge', 'PDF Merger', 'pdf');
trackToolUsage('download', 'Certificate Gen', 'documentmaker');
```

### Track Exports (PDF, Print, Copy, etc.)
```javascript
import { trackExport } from '../utils/analytics';

trackExport('pdf', 'GPA Calculator');
trackExport('copy', 'GPA Calculator');
trackExport('print', 'Resume Builder');
trackExport('png', 'Image Converter');
trackExport('json', 'Code Formatter');
```

### Track Errors (For Debugging)
```javascript
import { trackError } from '../utils/analytics';

trackError('calculation_error', 'GPA Calculator', error.message);
trackError('invalid_input', 'Matrix Algebra', 'Matrix too large');
trackError('conversion_failed', 'Image Converter', error.toString());
```

### Track Searches
```javascript
import { trackSearch } from '../utils/analytics';

trackSearch('python calculator', 3);  // 3 results found
trackSearch('empty search', 0);       // No results
```

### Track Custom Events
```javascript
import { trackEvent } from '../utils/analytics';

trackEvent('file_uploaded', { file_type: 'pdf', size: 1024 });
trackEvent('settings_changed', { dark_mode: true });
trackEvent('button_clicked', { button_name: 'Download' });
```

---

## 📋 Simple Implementation Pattern

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError } from '../../utils/analytics';

const MyCalculator = () => {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      const res = 2 + 2; // Your calculation
      setResult(res);
      
      // ✅ Track user performed calculation
      trackToolUsage('calculate', 'My Calculator', 'utility');
      
    } catch (error) {
      // ✅ Track error
      trackError('calc_failed', 'My Calculator', error.message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    
    // ✅ Track copy action
    trackExport('copy', 'My Calculator');
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <button onClick={copy}>Copy {result}</button>}
    </div>
  );
};

export default MyCalculator;
```

---

## 🎯 What to Track by Tool Type

### Calculators
```javascript
trackToolUsage('calculate', 'GPA Calculator', 'utility');
trackExport('pdf', 'GPA Calculator');  // If user downloads
trackError('invalid_input', 'GPA Calculator', error.msg);
```

### Converters
```javascript
trackToolUsage('convert', 'Image Converter', 'image');
trackExport('png', 'Image Converter');   // Track format
trackExport('jpeg', 'Image Converter');
```

### Document Generators
```javascript
trackToolUsage('generate', 'Resume Builder', 'documentmaker');
trackExport('pdf', 'Resume Builder');
trackExport('docx', 'Resume Builder');
```

### PDF Tools
```javascript
trackToolUsage('merge', 'PDF Merger', 'pdf');
trackToolUsage('split', 'PDF Splitter', 'pdf');
trackExport('pdf', 'PDF Merger');
trackError('merge_error', 'PDF Merger', error.msg);
```

### Text Tools
```javascript
trackToolUsage('format', 'Code Formatter', 'text');
trackExport('copy', 'Code Formatter');
trackToolUsage('count', 'Word Counter', 'text');
```

---

## ✅ Verification Checklist

- [ ] `VITE_GA_ID` is set in `.env`
- [ ] Same ID is in `.env.example`
- [ ] ID starts with `G-` (not placeholder `XXXX`)
- [ ] CookieConsent component is visible
- [ ] Users can accept/reject cookies
- [ ] Open DevTools Console: `window.__ga_initialized` returns `true`
- [ ] Open GA Dashboard → Real-time → See "Active users now"
- [ ] Perform an action → See event in GA Real-time report
- [ ] GA only loads after accepting cookies

---

## 🔍 Quick Debug Commands

```javascript
// In browser console (F12)

// Check GA is enabled
import.meta.env.VITE_GA_ID

// Check GA initialized
window.__ga_initialized

// Check gtag function exists
typeof window.gtag

// Get GA status
import { getGAStatus } from './utils/analytics';
console.log(getGAStatus());

// Send test event
window.gtag('event', 'test', { test: true });

// Check if user accepted cookies
localStorage.getItem('cookie_consent')
```

---

## 📈 In Google Analytics (After Data Collects)

**View Most Used Tools:**
- Reports → Events → event_category="tool_usage" → Group by: tool_name

**View Export Formats:**
- Reports → Events → event_category="tool_export" → Group by: export_type

**Find Errors:**
- Reports → Events → event_category="tool_error" → See which tools fail

**Track Searches:**
- Reports → Events → event_name="search" → See popular search terms

---

## ⚡ Copy-Paste Templates

### Template 1: Calculator
```jsx
const MyTool = () => {
  const calculate = () => {
    try {
      // your calculation
      trackToolUsage('calculate', 'My Tool', 'utility');
    } catch (e) {
      trackError('error', 'My Tool', e.message);
    }
  };
  return <button onClick={calculate}>Calculate</button>;
};
```

### Template 2: Download/Export
```jsx
const downloadPDF = () => {
  // ... PDF generation ...
  trackExport('pdf', 'My Tool');
};

const downloadCSV = () => {
  // ... CSV generation ...
  trackExport('csv', 'My Tool');
};
```

### Template 3: Search
```jsx
const handleSearch = (query) => {
  const results = tools.filter(t => t.name.includes(query));
  trackSearch(query, results.length);
};
```

### Template 4: Error Handler
```jsx
try {
  const result = complexCalculation(input);
} catch (error) {
  trackError('calc_failed', 'My Tool', error.message);
  setError('Please check your input');
}
```

---

## 🚨 Common Mistakes

| ❌ WRONG | ✅ RIGHT |
|---------|---------|
| `trackToolUsage('click', ...)` | `trackToolUsage('calculate', ...)` |
| `trackExport('download', ...)` | `trackExport('pdf', ...)` |
| `trackEvent('foo', { users_email: 'test@...' })` | Don't track personal data! |
| Forgetting to track at all | Add 1-2 lines per tool |
| Using inconsistent names | Use `'calculate'`, `'convert'`, `'generate'` |

---

## ⏱️ Time Estimate

**Add tracking to one tool:** 2 minutes  
**Add tracking to all 56 tools:** 2 hours  
**View results in GA:** 5 minutes

---

## 📞 Need Help?

1. Read: [GA4_SETUP_GUIDE.md](GA4_SETUP_GUIDE.md) - Complete guide
2. Copy: [GA4_IMPLEMENTATION_EXAMPLES.md](GA4_IMPLEMENTATION_EXAMPLES.md) - Ready-to-use code
3. Analytics: [Check Real-time Report](https://analytics.google.com) → Real-time tab

---

**That's it! Now go track your users' tool usage! 📊**
