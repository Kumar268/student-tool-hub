# 🚀 Skeleton Component - Quick Reference

**Copy-paste ready code examples for immediate use.**

---

## 📋 Quick Skeleton Types

| Type | Use Case | Example |
|------|----------|---------|
| `tool` | Full tool page with inputs, results, steps | ✅ Default for all tools |
| `form` | Simple form with N inputs | GPA Calculator, Unit Converter |
| `card` | Single card | Dashboard card, single item |
| `card-grid` | Grid of cards | Related tools, category listing |
| `search-results` | Search result items | Search page |
| `text` | Paragraph lines | Article, description |
| `category-grid` | Category selection grid | Categories page |

---

## 💻 Copy-Paste Examples

### **Example 1: Basic Tool Page (Most Common)**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import CalculusSolver from '@/tools/academic/CalculusSolver';

export default function CalculusPage() {
  return (
    <Suspense fallback={<Skeleton type="tool" />}>
      <CalculusSolver isDarkMode={false} />
    </Suspense>
  );
}
```

---

### **Example 2: Simple Form Tool**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import GPACalculator from '@/tools/academic/GPACalculator';

export default function GPAPage() {
  return (
    <Suspense fallback={<Skeleton type="form" count={3} />}>
      <GPACalculator isDarkMode={false} />
    </Suspense>
  );
}
```

---

### **Example 3: Tool Grid/Related Tools**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import RelatedTools from '@/components/RelatedTools';

export default function ToolsGrid() {
  return (
    <Suspense fallback={<Skeleton type="card-grid" count={6} />}>
      <RelatedTools />
    </Suspense>
  );
}
```

---

### **Example 4: Search Results**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import SearchResults from '@/pages/SearchResults';

export default function SearchPage() {
  return (
    <Suspense fallback={<Skeleton type="search-results" count={5} />}>
      <SearchResults />
    </Suspense>
  );
}
```

---

### **Example 5: Categories Page**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import Categories from '@/pages/Categories';

export default function CategoriesPage() {
  return (
    <Suspense fallback={<Skeleton type="category-grid" count={9} />}>
      <Categories />
    </Suspense>
  );
}
```

---

### **Example 6: Custom Skeleton for Special Layout**

```jsx
// src/components/CustomSkeletons.jsx
import { SkeletonBlock } from './Skeleton';

export const ImageCompressorSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {/* File upload area */}
    <div className="border-2 border-dashed hover:border-blue-400 rounded-xl p-12 flex flex-col items-center justify-center">
      <SkeletonBlock className="h-16 w-16 rounded-full mb-4" />
      <SkeletonBlock className="h-4 w-48" />
    </div>

    {/* Quality settings */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-2 w-full rounded-full" />
      <SkeletonBlock className="h-10 w-24 rounded-lg" />
    </div>

    {/* Before/After preview */}
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-32 w-full rounded-lg" />
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-32 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

// Usage:
import { Suspense } from 'react';
import { ImageCompressorSkeleton } from '@/components/CustomSkeletons';
import ImageCompressor from '@/tools/image/ImageCompressor';

export default function ImageCompressorPage() {
  return (
    <Suspense fallback={<ImageCompressorSkeleton />}>
      <ImageCompressor isDarkMode={false} />
    </Suspense>
  );
}
```

---

### **Example 7: Multiple Tool Skeletons on Same Page**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import ToolCard from '@/components/ToolCard';
import { tools } from '@/data/tools';

export default function Dashboard() {
  const featuredTools = tools.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero section with text skeleton */}
      <Suspense fallback={<Skeleton type="text" count={3} />}>
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p>Description text...</p>
      </Suspense>

      {/* Tools grid with card skeleton */}
      <Suspense fallback={<Skeleton type="card-grid" count={6} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
```

---

### **Example 8: Fallback with Async Data**

```jsx
import { Suspense, lazy } from 'react';
import Skeleton from '@/components/Skeleton';

// Lazy import and wrapping in Suspense
const CalculusSolver = lazy(() => import('@/tools/academic/CalculusSolver'));
const GPACalculator = lazy(() => import('@/tools/academic/GPACalculator'));
const MatrixAlgebra = lazy(() => import('@/tools/academic/MatrixAlgebra'));

export default function AcademicTools() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton type="tool" />}>
        <CalculusSolver isDarkMode={false} />
      </Suspense>

      <Suspense fallback={<Skeleton type="form" count={2} />}>
        <GPACalculator isDarkMode={false} />
      </Suspense>

      <Suspense fallback={<Skeleton type="tool" />}>
        <MatrixAlgebra isDarkMode={false} />
      </Suspense>
    </div>
  );
}
```

---

## 🎨 Animation Customization

### **Change Animation Speed**

**File:** `src/components/Skeleton.css`

```css
/* Fast (1.5 seconds) */
.skeleton-shimmer {
  animation: shimmer 1.5s infinite;
}

/* Normal (2 seconds - Default) */
.skeleton-shimmer {
  animation: shimmer 2s infinite;
}

/* Slow (3 seconds) */
.skeleton-shimmer {
  animation: shimmer 3s infinite;
}
```

### **Change Animation Type**

**File:** `src/components/Skeleton.jsx`

```jsx
// From shimmer (default):
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg bg-gradient-to-r ...`} />
);

// To fade pulse:
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-fade rounded-lg bg-gray-200 dark:bg-gray-700/50 ...`} />
);

// To wave:
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-wave rounded-lg bg-gradient-to-r ...`} />
);
```

---

## 🧪 Quick Testing

### **Test 1: Verify Animation Works**

```bash
# Start dev server
npm run dev

# Visit any tool page
# Open DevTools (F12)
# Go to Elements
# Find .skeleton-shimmer element
# Should see left-to-right wave animation
```

### **Test 2: Test with Slow Network**

```bash
# In Chrome DevTools:
1. Open Network tab
2. Find "Throttling" dropdown
3. Select "Slow 3G"
4. Reload page
5. Watch skeleton animate then fade to real content
```

### **Test 3: Console Verification**

```javascript
// Paste in DevTools Console:
const skeleton = document.querySelector('.skeleton-shimmer');
const animation = window.getComputedStyle(skeleton).animation;
console.log('Animation:', animation);
// Should log: "skeleton-shimmer 2s infinite"
```

### **Test 4: Mobile View**

```bash
# In Chrome DevTools:
1. Press Ctrl+Shift+M (or Cmd+Shift+M on Mac)
2. Choose device (iPhone 12, etc)
3. Reload page
4. Verify skeleton is responsive
5. Verify animation still works
```

### **Test 5: Dark Mode**

```javascript
// Toggle dark mode:
document.documentElement.classList.add('dark');
// Should see dark skeleton colors

document.documentElement.classList.remove('dark');
// Should see light skeleton colors
```

---

## 📱 Responsive Skeleton Behavior

All skeleton components are fully responsive:

**Mobile (< 640px):**
- Single column layouts
- Full-width inputs
- Optimized spacing

**Tablet (640px - 1024px):**
- 2-column grids for inputs
- Adjusted proportions
- Better spacing

**Desktop (> 1024px):**
- Full layouts
- Multiple columns
- Extended spacing

---

## ✅ Deployment Checklist

Before deploying to production:

```
□ Skeleton animation imports Skeleton.css
□ All 7 skeleton types tested on mobile
□ Dark mode skeleton rendering correctly
□ Accessibility attributes (aria-busy) present
□ No layout shift (CLS) when skeleton → content
□ Animation smooth (60 FPS) on slow devices
□ Custom skeletons created for special layouts
□ Suspense fallbacks configured in all lazy routes
```

---

## 🔗 Key Files Reference

| File | Purpose |
|------|---------|
| `src/components/Skeleton.jsx` | Main component + all types |
| `src/components/Skeleton.css` | Shimmer animation + alternatives |
| `src/components/ToolLayout.jsx` | Integration example (live) |
| `SKELETON_GUIDE.md` | Comprehensive documentation |
| `SKELETON_QUICK_REFERENCE.md` | This file (quick copy-paste) |

---

## 🚀 Next Steps

1. **Review:** Read SKELETON_GUIDE.md for full documentation
2. **Test:** Run through quick testing examples above
3. **Deploy:** Push to production
4. **Monitor:** Check DevTools to verify animation in production

---

**Ready to go live!** ✅ All 81 tools automatically get smooth skeleton loading.
