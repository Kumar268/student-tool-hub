# Router.jsx Update Guide - Migrate to Wrapper Pages

## Overview
This guide shows how to update `Router.jsx` to use the new wrapper pages instead of directly rendering tools through `ToolLayout`.

## Key Changes

### Before (Current)
- Tools imported in TOOL_MAP directly
- Rendered with ToolLayout
- Limited ad integration
- Ads not integrated into tool pages

### After (New)
- Wrapper pages imported from src/pages/tools/
- Each page handles its own layout + ads via ToolPageLayout
- Consistent ad placement across all tools
- Better user experience with full-width layout

---

## Updated Router.jsx Code

### Part 1: Add Imports at the Top

Add these imports to `src/Router.jsx` after existing imports:

```jsx
import { lazy, Suspense } from 'react';

// ──────────────────────────────────────────────────────────────────────────
// WRAPPER PAGE IMPORTS (loads pages from src/pages/tools/)
// These pages handle layout, ads, and tool rendering
// ──────────────────────────────────────────────────────────────────────────

const PAGE_MAP = {};

// Dynamically import all wrapper pages from src/pages/tools/*.jsx
const pageModules = import.meta.glob('/src/pages/tools/*Page.jsx', { eager: false });

// Build PAGE_MAP dynamically
Object.keys(pageModules).forEach(path => {
  // Extract filename: "/src/pages/tools/CalculusSolverPage.jsx" → "CalculusSolverPage"
  const filename = path.split('/').pop().replace('Page.jsx', '');
  
  // Convert PascalCase to kebab-case: "CalculusSolver" → "calculus-solver"
  const slug = filename
    .replace(/([A-Z])/g, '-$1')     // Insert - before uppercase
    .toLowerCase()                   // Convert to lowercase
    .replace(/^-/, '');              // Remove leading -
  
  // Lazy load the page component
  PAGE_MAP[slug] = lazy(() => pageModules[path]());
});

console.log(`📄 Loaded ${Object.keys(PAGE_MAP).length} wrapper pages`);
```

**Alternative: Manual TOOL_PAGE_MAP**

If you prefer explicit control, replace the glob import with:

```jsx
const TOOL_PAGE_MAP = {
  'calculus-solver': lazy(() => import('./pages/tools/CalculusSolverPage')),
  'integral-calculator': lazy(() => import('./pages/tools/IntegralCalculatorPage')),
  'matrix-algebra': lazy(() => import('./pages/tools/MatrixAlgebraPage')),
  'basic-stats': lazy(() => import('./pages/tools/BasicStatsPage')),
  // ... add all tools manually
};
```

---

### Part 2: Update Tool Routes

Find this section in Router.jsx:

```jsx
{/* ── Tool routes (primary: /tools/:category/:slug) ── */}
{tools.map(tool => {
  const Component = TOOL_MAP[tool.slug] || ComingSoon;
  const TrackAndRender = () => {
    useEffect(() => { trackToolVisit(tool.slug); }, []);
    return (
      <ToolLayout
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      >
        <Suspense fallback={<ToolSkeleton />}>
          <Component isDarkMode={isDarkMode} />
        </Suspense>
      </ToolLayout>
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

**Replace with:**

```jsx
{/* ── Tool routes (primary: /tools/:category/:slug) using wrapper pages ── */}
{tools.map(tool => {
  // Get the wrapper page component from PAGE_MAP
  const PageComponent = PAGE_MAP[tool.slug];
  
  // Warn if page is missing
  if (!PageComponent) {
    console.warn(`⚠️ Missing wrapper page for: ${tool.slug} (${tool.name})`);
    return null; // Skip this route
  }
  
  // Track visit and render page
  const TrackAndRender = () => {
    useEffect(() => { 
      trackToolVisit(tool.slug); 
    }, []);
    
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

### Part 3: Update Fallback Route

Find the fallback route:

```jsx
{/* ── Tool routes (fallback: /tool/:slug) ── */}
{tools.map(tool => {
  const Component = TOOL_MAP[tool.slug] || ComingSoon;
  return (
    <Route
      key={`${tool.slug}-fallback`}
      path={`/tool/${tool.slug}`}
      element={
        <ToolLayout
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        >
          <Suspense fallback={<ToolSkeleton />}>
            <Component isDarkMode={isDarkMode} />
          </Suspense>
        </ToolLayout>
      }
    />
  );
})}
```

**Replace with:**

```jsx
{/* ── Tool routes (fallback: /tool/:slug) using wrapper pages ── */}
{tools.map(tool => {
  const PageComponent = PAGE_MAP[tool.slug];
  
  if (!PageComponent) {
    return null;
  }
  
  const TrackAndRender = () => {
    useEffect(() => { 
      trackToolVisit(tool.slug); 
    }, []);
    
    return (
      <Suspense fallback={<ToolSkeleton />}>
        <PageComponent isDarkMode={isDarkMode} />
      </Suspense>
    );
  };
  
  return (
    <Route
      key={`${tool.slug}-fallback`}
      path={`/tool/${tool.slug}`}
      element={<TrackAndRender />}
    />
  );
})}
```

---

### Part 4: (Optional) Remove Old Dependencies

Once migration is complete, you can remove:

```jsx
// ❌ REMOVE THESE (no longer needed)
import ToolLayout from './components/ToolLayout';

const TOOL_MAP = {
  'age-calculator': lazy(() => import('./tools/utility/AgeCalculator')),
  // ... all the old tool imports
};
```

Keep `ComingSoon` import if needed for fallback.

---

## Complete Updated Routes Section

Here's the complete updated routes section:

```jsx
const AppRouter = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    initGA();
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(d => !d);

  return (
    <HelmetProvider>
      <PremiumProvider>
        <Router>
          <PageViewTracker />
          <CookieConsent isDarkMode={isDarkMode} />

          <Routes>
            {/* ── Home / Dashboard ── */}
            <Route path="/" element={
              <Layout isDarkMode={isDarkMode}>
                <App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              </Layout>
            } />

            {/* ── Category filter view ── */}
            <Route path="/category/:categoryId" element={
              <Layout isDarkMode={isDarkMode}>
                <App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              </Layout>
            } />

            {/* ── Categories browse page ── */}
            <Route path="/categories" element={
              <Layout isDarkMode={isDarkMode}>
                <Categories isDarkMode={isDarkMode} />
              </Layout>
            } />

            {/* ── Tool routes using WRAPPER PAGES (primary: /tools/:category/:slug) ── */}
            {tools.map(tool => {
              const PageComponent = PAGE_MAP[tool.slug];
              
              if (!PageComponent) {
                console.warn(`⚠️ Missing page for: ${tool.slug}`);
                return null;
              }
              
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

            {/* ── Tool routes (fallback: /tool/:slug) ── */}
            {tools.map(tool => {
              const PageComponent = PAGE_MAP[tool.slug];
              
              if (!PageComponent) {
                return null;
              }
              
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
                  key={`${tool.slug}-fallback`}
                  path={`/tool/${tool.slug}`}
                  element={<TrackAndRender />}
                />
              );
            })}

            {/* ── Static pages ── */}
            <Route path="/about"            element={<Layout isDarkMode={isDarkMode}><About isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/privacy-policy"   element={<Layout isDarkMode={isDarkMode}><PrivacyPolicy isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/terms-of-service" element={<Layout isDarkMode={isDarkMode}><TermsOfService isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/contact"          element={<Layout isDarkMode={isDarkMode}><Contact isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/faq"              element={<Layout isDarkMode={isDarkMode}><FAQ isDarkMode={isDarkMode} /></Layout>} />

            {/* ── Legacy redirects ── */}
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/legal"   element={<Navigate to="/terms-of-service" replace />} />

            {/* ── 404 custom page ── */}
            <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
          </Routes>
        </Router>
      </PremiumProvider>
    </HelmetProvider>
  );
};

export default AppRouter;
```

---

## Testing the Updated Router

### Test Steps

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check console for warnings:**
   - Should see: `📄 Loaded XX wrapper pages`
   - Should NOT see: `⚠️ Missing page for: xxx`

3. **Test tool routes:**
   - Primary: http://localhost:5173/tools/academic/calculus-solver
   - Fallback: http://localhost:5173/tool/calculus-solver
   - Both should render identically with ads

4. **Verify ads display:**
   - Video ad dismissible button visible
   - Banner ads below title
   - Bottom ad before footer

5. **Check dark mode:**
   - Toggle dark mode in navbar
   - All pages respond correctly
   - No flashing or style issues

6. **Build for production:**
   ```bash
   npm run build
   ```
   - Should complete without errors
   - Check bundle size (should be similar to before)

---

## Debugging Missing Pages

### Issue: "Missing page for: calculus-solver"

**Cause:** Wrapper page file doesn't exist

**Solutions:**
1. Run batch creation script:
   ```bash
   python scripts/batch_create_wrappers.py
   ```

2. Or create manually:
   - Create: `src/pages/tools/CalculusSolverPage.jsx`
   - Use template from `WRAPPER_PAGE_TEMPLATE.md`

3. Verify file exists and is named correctly

### Issue: "Cannot find module '@/components/ToolPageLayout'"

**Cause:** Path alias not configured

**Solution:** Check `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': '/src',
  }
}
```

### Issue: Pages not rendering, blank screen

**Cause:** PAGE_MAP not generating correctly

**Solution:** Replace glob import with manual mapping:
```jsx
const TOOL_PAGE_MAP = {
  'calculus-solver': lazy(() => import('./pages/tools/CalculusSolverPage')),
  'integral-calculator': lazy(() => import('./pages/tools/IntegralCalculatorPage')),
  // ... etc
};
const PAGE_MAP = TOOL_PAGE_MAP;
```

---

## Backwards Compatibility

The updated Router maintains **backward compatibility:**

- Both `/tools/{category}/{slug}` and `/tool/{slug}` work
- All existing links continue to function
- No need to update documentation or external links
- Analytics tracking preserved (via `trackToolVisit`)

---

## Performance Impact

✅ **Positive:**
- Code splitting per page (lazy loading)
- Reduced initial bundle size
- Better tree-shaking
- Easier to optimize individual pages

➖ **Neutral:**
- Same number of HTTP requests
- Suspense fallback still used
- Same CSS file delivery

---

## Checklist Before Merging

- [ ] All wrapper pages created
- [ ] PAGE_MAP generates without warnings
- [ ] Dev server runs without errors
- [ ] All tool routes render correctly
- [ ] Ads display on all tool pages
- [ ] Dark mode works
- [ ] Production build succeeds
- [ ] Old TOOL_MAP removed (if using glob import)
- [ ] No console errors or warnings
- [ ] Analytics tracking still works

---

## Rollback If Needed

If you need to revert:

1. Keep backup of old Router.jsx
2. Restore old TOOL_MAP section
3. Restore old tool route section
4. Keep ToolLayout for non-page routes
5. Deploy and test

---

## Questions?

Refer to:
- `WRAPPER_PAGES_COMPLETE_GUIDE.md` - Full implementation guide
- `WRAPPER_PAGE_TEMPLATE.md` - Page template reference
- `ToolPageLayout.jsx` - Layout component documentation

