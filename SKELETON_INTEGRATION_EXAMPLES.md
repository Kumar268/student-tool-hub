# 🎯 Skeleton Component - Integration Examples

**Real-world examples for integrating skeletons into specific tools.**

---

## 📋 Integration Pattern

All skeletons follow this pattern in the tool page/route:

```jsx
import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import YourToolComponent from '@/tools/category/YourToolComponent';

export default function ToolPage() {
  return (
    <Suspense fallback={<Skeleton type="appropriate-type" />}>
      <YourToolComponent isDarkMode={false} />
    </Suspense>
  );
}
```

---

## 🔢 Example 1: GPA Calculator (Form Tool)

**File:** `src/tools/academic/GPACalculator.jsx`

**Characteristics:**
- Simple form with 3-4 inputs
- Minimal options
- Fast calculation result
- Minimal layout

**Skeleton Setup:**

```jsx
// In route or parent component:
import { Suspense, lazy } from 'react';
import Skeleton from '@/components/Skeleton';

const GPACalculator = lazy(() => 
  import('@/tools/academic/GPACalculator')
);

export function GPACalculatorPage() {
  return (
    <Suspense fallback={<Skeleton type="form" count={3} />}>
      <GPACalculator isDarkMode={false} />
    </Suspense>
  );
}
```

**Why `type="form"`:**
- No complex layout needed
- Simple input fields
- Quick loading
- Minimal visual complexity

---

## 📐 Example 2: Calculus Solver (Complex Tool)

**File:** `src/tools/academic/CalculusSolver.jsx`

**Characteristics:**
- Multiple input fields
- Complex calculations
- Step-by-step output
- Graph/visualization
- Advanced options

**Skeleton Setup:**

```jsx
import { Suspense, lazy } from 'react';
import Skeleton from '@/components/Skeleton';

const CalculusSolver = lazy(() => 
  import('@/tools/academic/CalculusSolver')
);

export function CalculusSolverPage() {
  return (
    <Suspense fallback={<Skeleton type="tool" />}>
      <CalculusSolver isDarkMode={false} addToHistory={() => {}} />
    </Suspense>
  );
}
```

**Why `type="tool"`:**
- Full page layout with breadcrumbs
- Multiple input sections
- Results area with content
- Step-by-step section
- Related tools section

---

## 🖼️ Example 3: Image Compressor (Custom Skeleton)

**File:** `src/tools/image/ImageCompressor.jsx`

**Characteristics:**
- File upload area
- Quality settings
- Before/after preview
- Download button
- Unique visual layout

**Custom Skeleton Setup:**

```jsx
// File: src/components/CustomSkeletons.jsx
import { SkeletonBlock } from './Skeleton';

export const ImageCompressorSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto px-4">
    {/* Header */}
    <div className="space-y-3">
      <SkeletonBlock className="h-10 w-3/4 rounded-xl" />
      <SkeletonBlock className="h-4 w-full" />
    </div>

    {/* Upload area - larger drop zone */}
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex flex-col items-center justify-center space-y-4 bg-gray-50/50 dark:bg-gray-800/50">
      <SkeletonBlock className="h-16 w-16 rounded-full" />
      <SkeletonBlock className="h-4 w-48" />
      <SkeletonBlock className="h-3 w-40" />
    </div>

    {/* Quality/Options section */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonBlock className="h-5 w-32" />
      <SkeletonBlock className="h-2 w-full rounded-full" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-10 w-20 rounded-lg" />
        <SkeletonBlock className="h-10 w-20 rounded-lg" />
      </div>
    </div>

    {/* Before/After preview */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Before */}
      <div className="space-y-3">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="h-48 sm:h-64 w-full rounded-lg" />
        <SkeletonBlock className="h-4 w-32" />
      </div>

      {/* After */}
      <div className="space-y-3">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="h-48 sm:h-64 w-full rounded-lg" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
    </div>

    {/* Download button */}
    <SkeletonBlock className="h-12 w-full sm:w-48 rounded-lg" />
  </div>
);

// Usage in component:
import { Suspense, lazy } from 'react';
import { ImageCompressorSkeleton } from '@/components/CustomSkeletons';

const ImageCompressor = lazy(() => 
  import('@/tools/image/ImageCompressor')
);

export function ImageCompressorPage() {
  return (
    <Suspense fallback={<ImageCompressorSkeleton />}>
      <ImageCompressor isDarkMode={false} />
    </Suspense>
  );
}
```

**Why Custom Skeleton:**
- Upload area is visually distinctive
- Before/after comparison layout
- Unique visual hierarchy
- Not a standard form or full tool layout

---

## 📊 Example 4: Basic Statistics (Chart Tool)

**File:** `src/tools/academic/BasicStats.jsx`

**Characteristics:**
- Input data/numbers
- Chart visualization
- Statistics output
- Multiple view options

**Custom Skeleton Setup:**

```jsx
// File: src/components/CustomSkeletons.jsx
import { SkeletonBlock } from './Skeleton';

export const ChartToolSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {/* Header */}
    <div className="space-y-3">
      <SkeletonBlock className="h-10 w-3/4 rounded-xl" />
      <SkeletonBlock className="h-4 w-full" />
    </div>

    {/* Input section */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonBlock className="h-5 w-24" />
      <SkeletonBlock className="h-24 w-full rounded-lg" />
    </div>

    {/* Controls */}
    <div className="flex gap-3">
      <SkeletonBlock className="h-10 w-24 rounded-lg" />
      <SkeletonBlock className="h-10 w-24 rounded-lg" />
    </div>

    {/* Chart area - large placeholder */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
      <SkeletonBlock className="h-80 w-full rounded-lg" />
    </div>

    {/* Statistics table */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
          <SkeletonBlock className="h-4 w-24 flex-shrink-0" />
          <SkeletonBlock className="h-4 w-32 flex-shrink-0" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

// Usage:
import { Suspense, lazy } from 'react';
import { ChartToolSkeleton } from '@/components/CustomSkeletons';

const BasicStats = lazy(() => 
  import('@/tools/academic/BasicStats')
);

export function BasicStatsPage() {
  return (
    <Suspense fallback={<ChartToolSkeleton />}>
      <BasicStats isDarkMode={false} />
    </Suspense>
  );
}
```

---

## 🎵 Example 5: Music Theory Calculator (Unique Layout)

**File:** `src/tools/niche/MusicTheoryCalc.jsx`

**Characteristics:**
- Piano/staff visualization
- Musical notation
- Interactive elements
- Unique grid layout

**Custom Skeleton Setup:**

```jsx
export const MusicTheorySkeleton = () => (
  <div className="space-y-6 max-w-2xl mx-auto">
    {/* Header */}
    <div className="space-y-3">
      <SkeletonBlock className="h-10 w-3/4 rounded-xl" />
      <SkeletonBlock className="h-4 w-full" />
    </div>

    {/* Keyboard/staff visualization */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
      {/* Piano keys skeleton */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <SkeletonBlock key={i} className="h-24 flex-1 rounded-b-lg" />
        ))}
      </div>

      {/* Staff lines */}
      {[1, 2, 3, 4, 5].map(i => (
        <SkeletonBlock key={i} className="h-1 w-full mb-3 rounded-full" />
      ))}
    </div>

    {/* Controls grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <SkeletonBlock key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>

    {/* Results section */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonBlock className="h-5 w-32" />
      <SkeletonBlock className="h-8 w-48" />
      <SkeletonBlock className="h-4 w-full" />
    </div>
  </div>
);
```

---

## 📄 Example 6: PDF Tools (Document Processing)

**File:** `src/tools/pdf/PDFMerger.jsx`

**Characteristics:**
- File upload/drop zone
- File list display
- Processing progress
- Download result

**Custom Skeleton Setup:**

```jsx
export const PDFToolSkeleton = () => (
  <div className="space-y-6 max-w-3xl mx-auto">
    {/* Header */}
    <div className="space-y-3">
      <SkeletonBlock className="h-10 w-3/4 rounded-xl" />
      <SkeletonBlock className="h-4 w-full" />
    </div>

    {/* Upload zone */}
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex flex-col items-center space-y-3 text-center">
      <SkeletonBlock className="h-12 w-12 rounded-full" />
      <SkeletonBlock className="h-4 w-48" />
      <SkeletonBlock className="h-3 w-40" />
    </div>

    {/* File list */}
    <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <SkeletonBlock className="h-4 w-24 mb-3" />
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <SkeletonBlock className="h-8 w-8 rounded flex-shrink-0" />
          <SkeletonBlock className="h-4 flex-1" />
          <SkeletonBlock className="h-8 w-8 rounded flex-shrink-0" />
        </div>
      ))}
    </div>

    {/* Options/buttons */}
    <div className="flex gap-3">
      <SkeletonBlock className="h-12 flex-1 rounded-lg" />
      <SkeletonBlock className="h-12 flex-1 rounded-lg" />
    </div>

    {/* Preview/output */}
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
      <SkeletonBlock className="h-4 w-32 mb-4" />
      <SkeletonBlock className="h-40 w-full rounded-lg" />
    </div>
  </div>
);
```

---

## 🌐 Example 7: Dashboard/Multiple Tools

**Shows multiple skeletons on one page:**

```jsx
import { Suspense, lazy } from 'react';
import Skeleton from '@/components/Skeleton';
import { ImageCompressorSkeleton, ChartToolSkeleton } from '@/components/CustomSkeletons';

const ImageCompressor = lazy(() => 
  import('@/tools/image/ImageCompressor')
);

const BasicStats = lazy(() => 
  import('@/tools/academic/BasicStats')
);

export function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Section 1: Popular tools grid */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Popular Tools</h2>
        <Suspense fallback={<Skeleton type="card-grid" count={6} />}>
          <PopularToolsGrid />
        </Suspense>
      </section>

      {/* Section 2: Featured complex tool */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured</h2>
        <Suspense fallback={<Skeleton type="tool" />}>
          <CalculusSolver isDarkMode={false} />
        </Suspense>
      </section>

      {/* Section 3: Image tools */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Image Tools</h2>
        <Suspense fallback={<ImageCompressorSkeleton />}>
          <ImageCompressor isDarkMode={false} />
        </Suspense>
      </section>

      {/* Section 4: Statistics tools */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Data Analysis</h2>
        <Suspense fallback={<ChartToolSkeleton />}>
          <BasicStats isDarkMode={false} />
        </Suspense>
      </section>
    </div>
  );
}
```

---

## 🔄 Example 8: Router Integration (Full Setup)

**File:** `src/Router.jsx`

**Shows how skeletons integrate with lazy routes:**

```jsx
import { lazy, Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import { ImageCompressorSkeleton, ChartToolSkeleton } from '@/components/CustomSkeletons';

// Lazy imports
const CalculusSolver = lazy(() => 
  import('@/tools/academic/CalculusSolver')
);

const GPACalculator = lazy(() => 
  import('@/tools/academic/GPACalculator')
);

const ImageCompressor = lazy(() => 
  import('@/tools/image/ImageCompressor')
);

const BasicStats = lazy(() => 
  import('@/tools/academic/BasicStats')
);

// Routes with skeletons
const routes = [
  {
    path: '/tools/academic/calculus-solver',
    element: (
      <Suspense fallback={<Skeleton type="tool" />}>
        <CalculusSolver isDarkMode={false} />
      </Suspense>
    )
  },
  {
    path: '/tools/academic/gpa-calculator',
    element: (
      <Suspense fallback={<Skeleton type="form" count={3} />}>
        <GPACalculator isDarkMode={false} />
      </Suspense>
    )
  },
  {
    path: '/tools/image/image-compressor',
    element: (
      <Suspense fallback={<ImageCompressorSkeleton />}>
        <ImageCompressor isDarkMode={false} />
      </Suspense>
    )
  },
  {
    path: '/tools/academic/basic-stats',
    element: (
      <Suspense fallback={<ChartToolSkeleton />}>
        <BasicStats isDarkMode={false} />
      </Suspense>
    )
  }
];
```

---

## ✅ Integration Checklist

For each tool, verify:

```
□ Correct skeleton type chosen
  - type="tool" for complex layouts
  - type="form" for simple forms
  - Custom skeleton for unique layouts

□ Suspense boundary wraps component
  <Suspense fallback={<Skeleton ... />}>
    <Tool {...props} />
  </Suspense>

□ Component is lazy imported
  const Tool = lazy(() => import(...))

□ Fallback matches tool characteristics
  - Tool with steps: type="tool"
  - Tool with 3 inputs: type="form" count={3}
  - Unique layout: custom skeleton with matching structure

□ Mobile responsive
  - Test on 375px width
  - Skeleton should reflow properly

□ Dark mode
  - Skeleton visible in dark mode
  - Colors appropriate

□ No layout shift
  - Heights match actual content
  - No CLS on transition

□ Performance
  - Skeleton loads instantly
  - Smooth animation
  - Tool loads asynchronously
```

---

**Ready to Deploy!** ✅

Your tools now have professional skeleton loading states. Users see responsive placeholders while content loads, dramatically improving perceived performance.
