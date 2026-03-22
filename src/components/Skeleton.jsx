import React from 'react';

/**
 * Skeleton Loading Component — Phase 1.3
 * ─────────────────────────────────────────────────
 * Features:
 * - Multiple skeleton types (tool, card, text lines, grid)
 * - Shimmer animation
 * - Dark mode support via Tailwind dark: prefix
 * - Responsive design
 * - Accessibility: aria-busy for screen readers
 * - Use with React Suspense for async loading
 *
 * Usage:
 * <Suspense fallback={<Skeleton type="tool" />}>
 *   <ToolComponent />
 * </Suspense>
 */

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700/50 ${className}`} />
);

const ToolSkeleton = () => (
  <div className="space-y-6 w-full" aria-busy="true" aria-label="Loading tool">
    {/* Title area */}
    <div className="space-y-3">
      <SkeletonBlock className="h-8 w-64" />
      <SkeletonBlock className="h-4 w-96 max-w-full" />
    </div>

    {/* Main card */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
      </div>
      <SkeletonBlock className="h-12" />
      <SkeletonBlock className="h-12 w-32" />
    </div>

    {/* Result area */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
      <SkeletonBlock className="h-6 w-48" />
      <SkeletonBlock className="h-16" />
    </div>

    {/* Steps */}
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4">
        <SkeletonBlock className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Card Grid Skeleton ────────────────────────────────────────
const CardGridSkeleton = ({ count = 6 }) => (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    aria-busy="true"
    aria-label="Loading cards"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <SkeletonBlock className="h-12 w-12 mb-3 rounded-lg" />
        <SkeletonBlock className="h-5 w-3/4 mb-2" />
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
        </div>
        <SkeletonBlock className="h-8 w-full rounded mt-4" />
      </div>
    ))}
  </div>
);

// ─── Search Results Skeleton ───────────────────────────────────
const SearchResultsSkeleton = ({ count = 3 }) => (
  <div
    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
    aria-busy="true"
    aria-label="Loading search results"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="px-4 py-3 flex gap-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
      >
        {/* Icon */}
        <SkeletonBlock className="h-10 w-10 rounded flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-1/2" />
          <SkeletonBlock className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Text Lines Skeleton ──────────────────────────────────────
const TextSkeleton = ({ lines = 3 }) => (
  <div aria-busy="true" aria-label="Loading text">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={`h-4 mb-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

// ─── Category Grid Skeleton ───────────────────────────────────
const CategoryGridSkeleton = ({ count = 8 }) => (
  <div
    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    aria-busy="true"
    aria-label="Loading categories"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center"
      >
        {/* Icon */}
        <SkeletonBlock className="h-16 w-16 rounded-full mx-auto mb-3" />

        {/* Title */}
        <SkeletonBlock className="h-4 w-full mb-2" />

        {/* Count */}
        <SkeletonBlock className="h-3 w-24 mx-auto" />
      </div>
    ))}
  </div>
);

// ─── Default: Simple Card Skeleton ────────────────────────────
const CardSkeleton = () => (
  <div
    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    aria-busy="true"
    aria-label="Loading"
  >
    {/* Icon/Image placeholder */}
    <SkeletonBlock className="h-12 w-12 rounded mb-3" />

    {/* Title */}
    <SkeletonBlock className="h-5 w-3/4 mb-3" />

    {/* Description lines */}
    <div className="space-y-2">
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
    </div>

    {/* Button */}
    <SkeletonBlock className="h-10 w-full rounded-lg mt-4" />
  </div>
);

// ─── Main Skeleton Component with type selector ────────────────
const Skeleton = ({ type = 'card', count = 1 }) => {
  switch (type) {
    case 'tool':
      return <ToolSkeleton />;
    case 'card-grid':
      return <CardGridSkeleton count={count} />;
    case 'search-results':
      return <SearchResultsSkeleton count={count} />;
    case 'text':
      return <TextSkeleton lines={count} />;
    case 'category-grid':
      return <CategoryGridSkeleton count={count} />;
    case 'card':
    default:
      return <CardSkeleton />;
  }
};

export default Skeleton;
export { ToolSkeleton, CardGridSkeleton, SearchResultsSkeleton, TextSkeleton, CategoryGridSkeleton, CardSkeleton };
