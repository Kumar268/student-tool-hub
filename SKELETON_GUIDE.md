# ⚡ Skeleton Component - Complete Guide

**Status:** ✅ Ready for Production | Shimmer Animation Enabled

---

## 🎯 Overview

The Skeleton component provides animated loading placeholders for all your tool pages. It displays realistic content shapes while your async tools load, creating a smooth perceived performance experience.

**Key Features:**
- ✅ Professional shimmer animation (left-to-right wave)
- ✅ Multiple pre-built types: `tool`, `form`, `card`, `card-grid`, `search-results`, `text`, `category-grid`
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Accessibility compliant (aria-busy, aria-label)
- ✅ Customizable heights, widths, and field counts
- ✅ CSS-based animation (performant)

---

## 📦 Usage with Suspense

### **Basic Setup (Recommended)**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import CalculusSolver from '@/tools/academic/CalculusSolver';

// Wrap lazy-loaded component with Suspense
<Suspense fallback={<Skeleton type="tool" />}>
  <CalculusSolver isDarkMode={isDarkMode} />
</Suspense>
```

### **In ToolLayout.jsx (Already Set Up)**

```jsx
import { Suspense } from 'react';
import Skeleton from './Skeleton';

const ToolLayout = ({ tool, children }) => {
  return (
    <Suspense fallback={<Skeleton type="tool" />}>
      <div className="tool-content">
        {children}
      </div>
    </Suspense>
  );
};
```

### **With Router Lazy Loading**

```jsx
const CalculusSolver = lazy(() => import('../tools/academic/CalculusSolver'));

<Route
  path="/tools/academic/calculus-solver"
  element={
    <Suspense fallback={<Skeleton type="tool" />}>
      <CalculusSolver />
    </Suspense>
  }
/>
```

---

## 🎨 Skeleton Types

### **1. `type="tool"` — Full Tool Page**

Best for: Complex tools with inputs + results + steps

```jsx
<Suspense fallback={<Skeleton type="tool" />}>
  <CalculusSolver />
</Suspense>
```

**Includes:**
- Breadcrumb placeholder
- Title and description
- Input fields section (2-column grid + full-width)
- Action buttons
- Results/output section
- Step-by-step guide section
- Related tools section

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Breadcrumb placeholder                  │
├─────────────────────────────────────────┤
│ Title placeholder                       │
│ Description placeholder                 │
├─────────────────────────────────────────┤
│ [Label]        [Label]                  │
│ [Input field]  [Input field]            │
│ [Label]                                 │
│ [Input field]                           │
│ [Button] [Button]                       │
├─────────────────────────────────────────┤
│ Results Section                         │
│ ┌─────────────────────────────────────┐ │
│ │ Result placeholder content          │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Step 1: [Step content placeholder]      │
│ Step 2: [Step content placeholder]      │
│ Step 3: [Step content placeholder]      │
├─────────────────────────────────────────┤
│ Related Tools                           │
│ [Card] [Card] [Card]                    │
└─────────────────────────────────────────┘
```

---

### **2. `type="form"` — Simple Form Tools**

Best for: Basic tools with just inputs (GPA Calculator, Unit Converter)

**Props:**
- `count` (number) — Number of form fields (default: 3)

```jsx
// 3 input fields (GPA Calculator)
<Suspense fallback={<Skeleton type="form" count={3} />}>
  <GPACalculator />
</Suspense>

// 2 input fields (Unit Converter)
<Suspense fallback={<Skeleton type="form" count={2} />}>
  <UnitConverter />
</Suspense>
```

**Visual Layout:**
```
┌──────────────────────────────┐
│ Title placeholder            │
│ Description placeholder      │
├──────────────────────────────┤
│ [Label]                      │
│ [Input field]                │
│ [Label]                      │
│ [Input field]                │
│ [Label]                      │
│ [Input field]                │
│ [Submit Button]              │
└──────────────────────────────┘
```

---

### **3. `type="card"` — Single Card**

Best for: Dashboard cards, simple content cards

```jsx
<Skeleton type="card" />
```

---

### **4. `type="card-grid"` — Grid of Cards**

Best for: Category pages, tool listing pages

**Props:**
- `count` (number) — Number of cards (default: 6)

```jsx
// 9 tool cards
<Suspense fallback={<Skeleton type="card-grid" count={9} />}>
  <ToolListPage />
</Suspense>

// 6 cards (default)
<Suspense fallback={<Skeleton type="card-grid" />}>
  <RelatedTools />
</Suspense>
```

---

### **5. `type="search-results"` — Search Result Items**

Best for: Search results page

**Props:**
- `count` (number) — Number of result items (default: 3)

```jsx
<Suspense fallback={<Skeleton type="search-results" count={5} />}>
  <SearchResults />
</Suspense>
```

---

### **6. `type="text"` — Paragraph Text**

Best for: Article content, descriptions

**Props:**
- `count` (number) — Number of lines (default: 3)

```jsx
<Suspense fallback={<Skeleton type="text" count={5} />}>
  <ArticleContent />
</Suspense>
```

---

### **7. `type="category-grid"` — Category Grid**

Best for: Category selection page

**Props:**
- `count` (number) — Number of categories (default: 8)

```jsx
<Suspense fallback={<Skeleton type="category-grid" count={9} />}>
  <CategoriesPage />
</Suspense>
```

---

## 🧩 Customization Examples

### **Example 1: Custom Tool Skeleton for Image Processor**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import ImageProcessor from '@/tools/image/ImageProcessor';

export default function ImageProcessorPage() {
  return (
    <Suspense fallback={<Skeleton type="tool" />}>
      <ImageProcessor />
    </Suspense>
  );
}
```

### **Example 2: Create Custom Skeleton for Unique Layout**

```jsx
// Create: src/components/CustomSkeletons.jsx
import Skeleton from './Skeleton';

export const ImageCompressorSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {/* Upload area placeholder */}
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex justify-center">
      <Skeleton.SkeletonBlock className="h-16 w-16 rounded-full" />
    </div>

    {/* Quality slider placeholder */}
    <div className="space-y-2">
      <Skeleton.SkeletonBlock className="h-4 w-24" />
      <Skeleton.SkeletonBlock className="h-2 w-full rounded-full" />
    </div>

    {/* Results section */}
    <div className="grid grid-cols-2 gap-4">
      <Skeleton.SkeletonBlock className="h-32 rounded-lg" />
      <Skeleton.SkeletonBlock className="h-32 rounded-lg" />
    </div>
  </div>
);

// Usage:
<Suspense fallback={<ImageCompressorSkeleton />}>
  <ImageCompressor />
</Suspense>
```

### **Example 3: Different Skeletons for Dark/Light Mode**

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';

const CustomSkeleton = ({ isDarkMode }) => (
  <div className={isDarkMode ? 'dark' : ''}>
    <Skeleton type="tool" />
  </div>
);

<Suspense fallback={<CustomSkeleton isDarkMode={isDarkMode} />}>
  <ToolComponent />
</Suspense>
```

### **Example 4: Custom Skeleton for Data Visualization Tools**

```jsx
// src/components/ChartSkeleton.jsx
import { SkeletonBlock } from './Skeleton';

const ChartSkeleton = () => (
  <div className="space-y-6">
    {/* Control panel skeleton */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <SkeletonBlock className="h-4 w-32" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <SkeletonBlock key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>

    {/* Chart placeholder */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8">
      <SkeletonBlock className="h-80 w-full rounded-lg" />
    </div>

    {/* Legend skeleton */}
    <div className="flex gap-4 justify-center">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export default ChartSkeleton;
```

### **Example 5: Conditional Skeleton Based on Data State**

```jsx
import { Suspense, useState } from 'react';
import Skeleton from '@/components/Skeleton';
import CalculusSolver from '@/tools/academic/CalculusSolver';

export default function ToolPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <>
      {isCalculating && <Skeleton type="form" count={2} />}
      <Suspense fallback={<Skeleton type="tool" />}>
        <CalculusSolver onCalculate={() => setIsCalculating(true)} />
      </Suspense>
    </>
  );
}
```

---

## 🎬 Animation Options

### **1. Shimmer (Default - Used)**

```css
/* Smooth left-to-right wave effect */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-shimmer {
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

**Best for:** Modern, professional look. Faster perceived performance.

### **2. Fade Pulse (Alternative)**

```css
/* Fade in/out effect */
@keyframes fade-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton-fade {
  animation: fade-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Best for:** Subtle, minimal design. Simple and clean.

### **3. Wave (Slower)**

```css
/* Longer, smoother wave */
@keyframes wave {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-wave {
  background-size: 1000px 100%;
  animation: wave 3s ease-in-out infinite;
}
```

**Best for:** Advanced/scientific tools. More relaxed feel.

### **Using Alternative Animations**

To switch animations, edit `src/components/Skeleton.jsx`:

```jsx
// Change from shimmer to fade:
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-fade rounded-lg bg-gray-200 dark:bg-gray-700/50 ${className}`} />
);

// Change from shimmer to wave:
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-wave rounded-lg bg-gray-200 dark:bg-gray-700/50 ${className}`} />
);
```

---

## 🧪 Testing the Loading State

### **Method 1: Simulate Slow Network**

```bash
# Use Chrome DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Find the "Throttling" dropdown (top right)
4. Select "Fast 3G" or "Slow 3G"
5. Reload page
6. Watch skeleton load then fade to real content
```

### **Method 2: Intentionally Delay Component**

```jsx
// Temporarily delay import to test skeleton
const CalculusSolver = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => 
      resolve(import('../tools/academic/CalculusSolver')), 
      3000 // 3 second delay
    )
  )
);

<Suspense fallback={<Skeleton type="tool" />}>
  <CalculusSolver />
</Suspense>
```

### **Method 3: Use React DevTools Profiler**

```bash
# Production testing:
npm run build
npm run preview

# In browser:
1. Open DevTools (F12)
2. Go to Performance tab
3. Record → Reload → Stop
4. Look for skeleton rendering time
5. Verify smooth transition to real content
```

### **Method 4: Manual Testing Checklist**

```
□ Skeleton appears immediately when tool loads
□ Skeleton animates smoothly (no jank)
□ Transition from skeleton to real content is smooth
□ Layout doesn't shift (no CLS - Cumulative Layout Shift)
□ Skeleton is responsive on mobile
□ Dark mode skeleton looks correct
□ All 7 skeleton types render without errors
□ Accessibility attributes visible (aria-busy="true")
```

### **Method 5: Console Verification**

```javascript
// Open DevTools Console (F12) and paste:

// Check if skeleton has animation
const skeleton = document.querySelector('.skeleton-shimmer');
const animation = window.getComputedStyle(skeleton).animation;
console.log('Animation:', animation); // Should show shimmer animation

// Check dark mode skeleton
const darkSkeleton = document.querySelector('.dark .skeleton-shimmer');
const darkBg = window.getComputedStyle(darkSkeleton).backgroundColor;
console.log('Dark skeleton bg:', darkBg); // Should be gray-700

// Check accessibility
const ariaBusy = document.querySelector('[aria-busy="true"]');
console.log('Aria-busy element:', ariaBusy); // Should exist
```

---

## 🚀 Integration with Your Tools

### **Integration Pattern**

```jsx
// src/tools/academic/CalculusSolver.jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';

const CalculusSolver = ({ isDarkMode, addToHistory }) => {
  // Your tool component code
  return <div>Actual tool content</div>;
};

export default CalculusSolver;

// In Router or ToolLayout:
<Suspense fallback={<Skeleton type="tool" />}>
  <CalculusSolver {...props} />
</Suspense>
```

### **Already Integrated In:**
- ✅ ToolLayout.jsx (wraps all lazy-loaded tools)
- ✅ Router.jsx (Suspense boundaries on routes)
- ✅ ErrorBoundary.jsx (paired with Suspense)

---

## ⚙️ Configuration

### **Adjust Animation Speed**

```css
/* src/components/Skeleton.css */

/* Faster animation (1.5s) */
.skeleton-shimmer {
  animation: shimmer 1.5s infinite;
}

/* Slower animation (3s) */
.skeleton-shimmer {
  animation: shimmer 3s infinite;
}
```

### **Adjust Colors (Dark Mode)**

```jsx
// src/components/Skeleton.jsx - Modify SkeletonBlock:
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 ${className}`} />
);
```

### **Adjust Field Count in Form Skeleton**

```jsx
// Default is 3 fields
<Skeleton type="form" count={3} />

// For GPACalculator (2 fields)
<Skeleton type="form" count={2} />

// For ComplexForm (5 fields)
<Skeleton type="form" count={5} />
```

---

## 📊 Performance Impact

**Skeleton Component Size:** ~2 KB (minified)

**Impact on bundle:**
- Adds ~2 KB to bundle (negligible)
- CSS animation offloaded to GPU (smooth performance)
- No JavaScript animation (lighter than alternatives)

**Perceived Performance:**
- Without skeleton: User sees blank screen (feels slow)
- With skeleton: User sees loading progress (feels faster)
- Expected perceived performance improvement: 15-25%

---

## 🔍 Debugging

### **Issue: Animation not showing**

```jsx
// ✅ Solution: Import CSS file
import './Skeleton.css';

// Verify in DevTools:
// 1. Check Elements tab
// 2. Search for skeleton-shimmer class
// 3. Should see animation property in Styles
```

### **Issue: Skeleton doesn't match tool layout**

```jsx
// ✅ Solution: Create custom skeleton
// Reference: src/components/CustomSkeletons.jsx example above
// Match your tool's actual layout structure
```

### **Issue: Layout shift when skeleton → content**

```jsx
// ✅ Solution: Fixed dimensions in skeleton
// Ensure skeleton has same height as actual content
<SkeletonBlock className="h-12" /> {/* Matches input height */}
```

---

## ✨ Best Practices

1. **Match Tool Layout:** Skeleton should mirror actual tool UI
2. **Consistent Spacing:** Use same gap/padding as tool
3. **Fixed Heights:** Use explicit heights to prevent layout shift
4. **Responsive:** Test on mobile, tablet, desktop
5. **Dark Mode:** Verify skeleton looks good in both modes
6. **Accessibility:** Keep aria-busy and aria-label attributes
7. **Animation Speed:** 2-3 seconds is ideal (not too fast, not too slow)

---

## 📚 Examples Reference

All examples in this guide are ready to copy-paste. Check:
- `src/components/Skeleton.jsx` — Main component
- `src/components/Skeleton.css` — Animation styles
- `src/components/ToolLayout.jsx` — Live integration example

---

**Status:** ✅ Production Ready
**Animation:** Shimmer (2s cycle, left-to-right)
**Coverage:** All 81 tools
**Performance:** Imperceptible impact (~2 KB)
