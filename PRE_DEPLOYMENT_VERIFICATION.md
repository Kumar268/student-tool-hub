# Pre-Deployment Verification Checklist

## Verification Steps (Before Going Live)

### ✅ Phase 1: Wrapper Page Generation (5 min)

- [ ] Run batch script
  ```bash
  python scripts/batch_create_wrappers.py
  ```

- [ ] Verify output summary shows:
  - ✅ Created: XX files
  - ⏭️  Skipped: YY files (already exist)
  - No errors

- [ ] Check directory
  ```bash
  ls -la src/pages/tools/ | wc -l  # Should be 70+
  ```

- [ ] Sample a few files created
  ```bash
  cat src/pages/tools/CalculusSolverPage.jsx
  cat src/pages/tools/ImageCompressorPage.jsx
  ```
  - Verify: Component imports look correct
  - Verify: ToolPageLayout props present
  - Verify: Tool component rendered in JSX

---

### ✅ Phase 2: Router.jsx Updates (10 min)

- [ ] Backup current Router.jsx
  ```bash
  cp src/Router.jsx src/Router.jsx.backup
  ```

- [ ] Add PAGE_MAP at top of Router.jsx
  ```jsx
  const PAGE_MAP = {};
  const pageModules = import.meta.glob('/src/pages/tools/*Page.jsx', { eager: false });
  Object.keys(pageModules).forEach(path => {
    const slug = path.split('/').pop().replace('Page.jsx', '')
      .replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    PAGE_MAP[slug] = lazy(() => pageModules[path]());
  });
  ```

- [ ] Update tool routes (2 locations):
  - Route for `/tools/:category/:slug`
  - Route for `/tool/:slug` (fallback)

- [ ] Verify no duplicate Route definitions

- [ ] Save changes

---

### ✅ Phase 3: Local Testing (15 min)

#### Start Dev Server
```bash
npm run dev
```

- [ ] No compilation errors in terminal
- [ ] Dev server running on localhost:5173
- [ ] Console shows no red errors

#### Test Homepage
- [ ] http://localhost:5173/ loads
- [ ] Tool grid visible
- [ ] Search works
- [ ] Category filters work
- [ ] Dark mode toggle works

#### Test Tool Routes (sample each category)

**Academic:**
- [ ] /tools/academic/calculus-solver → Shows CalculusSolver with ads
- [ ] /tool/calculus-solver → Same result (fallback route)

**Financial:**
- [ ] /tools/financial/student-budgeting → Shows StudentBudgeting with ads

**Utility:**
- [ ] /tools/utility/gpa-calculator → Shows GPA Calculator with ads

**Image:**
- [ ] /tools/image/image-compressor → Shows ImageCompressor with ads

**PDF:**
- [ ] /tools/pdf/pdf-merger-splitter → Shows PDF Merger with ads

**Text:**
- [ ] /tools/text/word-counter → Shows WordCounter with ads

#### Verify Page Elements

For each test tool page:
- [ ] Navbar visible with title and dark mode toggle
- [ ] Back button works (navigates to previous page)
- [ ] Home button works (goes to /)
- [ ] Tool title displays correctly
- [ ] Tool component renders (not blank)
- [ ] Video ad slot visible
- [ ] Top banner ad slot visible
- [ ] Tool content renders properly
- [ ] Middle ad slot visible
- [ ] Bottom ad slot visible
- [ ] No layout overflow or white space issues

#### Test Dark Mode
- [ ] Click dark toggle on tool page
- [ ] Page theme changes
- [ ] Tool component also changes theme
- [ ] Ad slots adapt to theme
- [ ] Background colors correct
- [ ] Text is readable in both modes

#### Check Browser Console

```javascript
// Should show:
console.log(PAGE_MAP)  // Should have 70+ entries
// Should NOT show:
"⚠️ Missing page for: ..."
"Cannot find module"
"Uncaught error"
```

- [ ] No red error messages
- [ ] No yellow warnings about missing pages
- [ ] PAGE_MAP properly populated

#### Performance Check
- [ ] Page loads in <2 seconds
- [ ] Initial render smooth (no flashing)
- [ ] Navigation between tools is fast
- [ ] Dark mode toggle is instant
- [ ] No lag when typing in search

---

### ✅ Phase 4: Build & Production (10 min)

#### Build for Production
```bash
npm run build
```

- [ ] Build completes successfully
- [ ] No errors in output
- [ ] No warnings about modules
- [ ] `dist/` folder created
- [ ] Check dist size roughly same as before

#### Verify Build Output
```bash
ls -la dist/
du -sh dist/     # Should be < 5MB typically
```

#### Preview Production Build
```bash
npm run preview
```

- [ ] http://localhost:4173/ loads
- [ ] Production build runs
- [ ] All tool routes work
- [ ] Dark mode works
- [ ] No differences from dev build

#### Check Built Files
```bash
grep -r "ToolPageLayout" dist/  # Should find references
grep -r "PAGE_MAP" dist/         # May or may not show (depends on bundling)
```

---

### ✅ Phase 5: Analytics & Tracking

- [ ] Open DevTools → Network tab
- [ ] Load tool page
- [ ] Check GA events fire (if GA configured)
- [ ] Check `trackToolVisit()` is called
- [ ] Verify analytics.js loaded

---

### ✅ Phase 6: Edge Cases

#### Missing Tool Slug
- [ ] Go to: `/tool/non-existent-tool`
- [ ] Should show 404 page (not blank/error)
- [ ] Console shows warning about missing page

#### Missing Page File
- [ ] Delete one wrapper page temporarily
- [ ] Go to that tool's URL
- [ ] Should show graceful error (not crash)
- [ ] Other tools still work
- [ ] Restore the file

#### Environment Variables
- [ ] If `.env` has VITE_ADSENSE_PUB_ID set:
  - [ ] Real ads or placeholders show
- [ ] If `.env` does NOT have ad config:
  - [ ] "AdSense not configured" shown gracefully
  - [ ] Tool still renders normally

---

### ✅ Phase 7: Cross-Browser Testing

Test in:
- [ ] Chrome/Chromium - Latest
- [ ] Firefox - Latest
- [ ] Safari - Latest (if available)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

For each browser:
- [ ] Homepage loads
- [ ] Tool page loads
- [ ] Dark mode works
- [ ] Responsive - adapts to screen size
- [ ] Touch interactions work (mobile)

---

### ✅ Phase 8: Accessibility Check

- [ ] Use keyboard only to navigate
  - [ ] Tab through navbar
  - [ ] Tab to dark mode toggle
  - [ ] Enter to activate buttons
  - [ ] Back/Home buttons keyboard accessible

- [ ] Screen reader testing (if available)
  - [ ] Page title announced
  - [ ] Tool title announced
  - [ ] Navigation structure clear

- [ ] Color contrast adequate
  - [ ] Text readable in dark mode
  - [ ] Text readable in light mode
  - [ ] Links distinguishable

---

### ✅ Final Deployment Checklist

Before pushing to production:

- [ ] All tests passed above
- [ ] Build succeeded
- [ ] No console errors in dev or prod
- [ ] No broken imports
- [ ] No missing files
- [ ] .env variables configured
- [ ] Analytics tracking works
- [ ] Database connections (if any) work
- [ ] SSR working (if applicable)
- [ ] Sitemap updated (if applicable)
- [ ] robots.txt correct
- [ ] Backup taken of current live version
- [ ] Deployment script ready
- [ ] Rollback plan documented

---

## Deployment Command

When ready:

```bash
# Test one more time
npm run build
npm run preview

# Deploy (example)
npm run deploy

# Verify live
# - Check https://yourdomain.com/tools/academic/calculus-solver
# - Check /tool/calculus-solver redirection
# - Monitor analytics
```

---

## Post-Deployment Verification

After deploying to production:

- [ ] Homepage loads from production URL
- [ ] Tool pages accessible
- [ ] Dark mode works
- [ ] Ads display correctly
- [ ] Navigation works
- [ ] Search functional
- [ ] Analytics tracking firing
- [ ] No 404 errors in logs
- [ ] Monitor for errors 1st hour

---

## Rollback Plan

If issues occur:

```bash
# Restore backup
rm -rf src/pages/tools/*Page.jsx
cp src/Router.jsx.backup src/Router.jsx

# Rebuild
npm run build

# Verify previous version works
npm run deploy
```

---

## Performance Baselines

Compare before & after:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Bundle Size | __ KB | __ KB | Same ±5% |
| Initial Load | __ s | __ s | <2s |
| TTI (Time to Interactive) | __ s | __ s | <3s |
| Pages per Tool | N/A | 1 | ✅ |
| Pages | __ | 70+ | ✅ |

Record baseline before migration, compare after.

---

## Common Issues Found During Testing

| Issue | Cause | Fix |
|-------|-------|-----|
| Blank page on tool route | Missing wrapper page | Run batch script again |
| Import errors | Wrong path | Check import path matches file location |
| PAGE_MAP undefined | Not added to Router | Add PAGE_MAP glob import at top |
| Ads not showing | Env variables missing | Set VITE_ADSENSE_* in .env |
| Dark mode broken | CSS not loaded | Verify ToolPageLayout includes styles |
| Slow load | Large bundle | Clear cache, rebuild |

---

## Sign-Off

Once all checks pass, fill in:

- **Tested by:** _______________
- **Date:** _______________  
- **Environment:** Dev / Staging / Production
- **Build version:** _______________
- **Notes:** _______________

---

## Questions During Testing?

1. Check `QUICK_START_REFERENCE.md` for common commands
2. Review `ROUTER_UPDATE_GUIDE.md` for Router changes
3. See `WRAPPER_PAGES_COMPLETE_GUIDE.md` for troubleshooting
4. Check browser console for specific errors

---

✅ **Ready for production when all boxes checked!** 🚀
