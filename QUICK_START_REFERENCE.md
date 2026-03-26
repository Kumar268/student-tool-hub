# Quick Reference Card - ToolPageLayout Implementation

## TL;DR - Get Started in 30 Minutes

### Step 1: Batch Create Wrapper Pages (2 min)
```bash
python scripts/batch_create_wrappers.py
```

### Step 2: Update Router.jsx (10 min)
See [ROUTER_UPDATE_GUIDE.md](ROUTER_UPDATE_GUIDE.md):
1. Add PAGE_MAP import
2. Update tool routes (2 places)
3. Save & test

### Step 3: Test & Deploy (10 min)
```bash
npm run dev              # Test locally
npm run build            # Production build
```

---

## File Locations

| What | Where |
|------|-------|
| Layout component | `src/components/ToolPageLayout.jsx` |
| Wrapper pages | `src/pages/tools/{ToolName}Page.jsx` |
| Original tools | `src/tools/{category}/{ToolName}.jsx` |
| Router | `src/Router.jsx` |
| Tool metadata | `src/data/tools.js` |

---

## Create New Wrapper Page (Manual)

1. Create: `src/pages/tools/ExampleToolPage.jsx`
2. Copy template:
```jsx
import ToolPageLayout from '@/components/ToolPageLayout';
import ExampleTool from '@/tools/category/ExampleTool';

export default function ExampleToolPage() {
  return (
    <ToolPageLayout
      title="Example Tool"
      icon="⚙️"
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <ExampleTool isDarkMode={false} />
    </ToolPageLayout>
  );
}
```

---

## Router Update (Complete Example)

Replace tool routes with:

```jsx
// At top of Router.jsx:
const PAGE_MAP = {};
const pageModules = import.meta.glob('/src/pages/tools/*Page.jsx', { eager: false });

Object.keys(pageModules).forEach(path => {
  const slug = path.split('/').pop()
    .replace('Page.jsx', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
  PAGE_MAP[slug] = lazy(() => pageModules[path]());
});

// In Routes:
{tools.map(tool => {
  const PageComponent = PAGE_MAP[tool.slug];
  if (!PageComponent) return null;
  
  const TrackAndRender = () => {
    useEffect(() => { trackToolVisit(tool.slug); }, []);
    return (
      <Suspense fallback={<ToolSkeleton />}>
        <PageComponent isDarkMode={isDarkMode} />
      </Suspense>
    );
  };
  
  return (
    <Route
      key={tool.slug}
      path={`/tools/${tool.category}/${tool.slug}`}
      element={<TrackAndRender />}
    />
  );
})}
```

---

## ToolPageLayout Props

```JSX
<ToolPageLayout
  title="Tool Name"              // string
  icon="🚀"                      // emoji string
  children={<ToolComponent />}   // ReactNode
  extraFeatures={<Tips />}       // Optional ReactNode
  adClient="ca-pub-xxx"          // From env
  adSlots={{                     // From env
    video: "1234567890",
    top: "2345678901",
    middle: "3456789012",
    bottom: "4567890123"
  }}
/>
```

---

## Wrapper Page Naming

Tool slug → Page file name:

| Slug | Component | Page File |
|------|-----------|-----------|
| `calculus-solver` | `CalculusSolver` | `CalculusSolverPage.jsx` |
| `image-resizer` | `ImageResizer` | `ImageResizerPage.jsx` |
| `pdf-merger` | `PDFMergeSplit` | `PDFMergeSplitPage.jsx` |

**Pattern:** Slug → PascalCase → Add "Page.jsx"

---

## Test Checklist

- [ ] Batch script runs without errors
- [ ] ~70 wrapper pages created
- [ ] Router compiles without errors
- [ ] Dev server starts: `npm run dev`
- [ ] Tool page renders: [/tools/academic/calculus-solver](http://localhost:5173/tools/academic/calculus-solver)
- [ ] Video ad visible & dismissible
- [ ] Banner ads display
- [ ] Dark mode toggle works
- [ ] Production build succeeds
- [ ] No console warnings

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Cannot find module` | Check import paths, verify files exist |
| `MODULE_NOT_FOUND: PAGE_MAP` | Rebuild, restart dev server |
| Blank page | Check console for errors in tool component |
| Ads not showing | Verify `.env` has VITE_ADSENSE_* variables |
| Dark mode broken | Ensure CSS variables defined in ToolPageLayout |

---

## Documentation Map

| Document | Use For |
|----------|---------|
| `IMPLEMENTATION_SUMMARY.md` | Overview of what's included |
| `WRAPPER_PAGES_COMPLETE_GUIDE.md` | Detailed step-by-step guide |
| `ROUTER_UPDATE_GUIDE.md` | Exact Router.jsx changes |
| `WRAPPER_PAGE_TEMPLATE.md` | Manual page creation template |
| This file | Quick reference & commands |

---

## Scripts Reference

**Identify missing pages:**
```bash
node scripts/generate-wrapper-pages.cjs
```

**Batch create pages:**
```bash
python scripts/batch_create_wrappers.py
```

---

## Environment Setup

Required in `.env` or `.env.local`:

```env
VITE_ADSENSE_PUB_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_VIDEO_AD_SLOT=1234567890
VITE_BANNER_AD_SLOT=2345678901
VITE_DISPLAY_AD_SLOT=3456789012
```

Without these, tool pages show "AdSense not configured" placeholders.

---

## Key Concepts

**ToolPageLayout:** Wrapper that adds:
- Navbar with dark mode toggle
- Video ad (once/session)
- Multiple banner ads
- Full-width responsive layout
- CSS variables for theming

**Wrapper Pages:** One per tool:
- Import original tool component
- Wrap with ToolPageLayout
- Pass metadata (title, icon, ads)
- Optional: custom tips section

**Router:** Coordinates:
- Dynamic page imports
- Analytics tracking
- Route registration
- Fallback URLs

---

## Performance Notes

✅ Lazy loading of pages (code splitting)
✅ Same bundle size as before
✅ Faster initial load
✅ Better tree-shaking opportunity

---

## Support

If stuck:
1. Check error in browser console
2. Verify file paths in import statements
3. Run batch script again (safe to repeat)
4. See full guide: `WRAPPER_PAGES_COMPLETE_GUIDE.md`

---

## Timeline

- **Batch create:** 2 minutes
- **Update Router:** 10 minutes
- **Test:** 10 minutes
- **Deploy:** 5 minutes

**Total: ~30 minutes** ✨

---

**Ready to implement? Start with:**
```bash
python scripts/batch_create_wrappers.py
```
