import React from 'react';
import './Skeleton.css'; // Shimmer animation styles

/**
 * Skeleton Loading Component — Phase 2.0
 * ─────────────────────────────────────────────────
 * Features:
 * - Multiple skeleton types (tool, card, text lines, grid, form)
 * - Shimmer animation (left-to-right gradient wave)
 * - Dark mode support via Tailwind dark: prefix
 * - Responsive design (mobile/tablet/desktop)
 * - Accessibility: aria-busy for screen readers
 * - Customizable heights, widths, and shapes
 * - Use with React Suspense for async loading
 *
 * Types: 'tool', 'card', 'card-grid', 'search-results', 'text', 'category-grid', 'form'
 *
 * Usage:
 * <Suspense fallback={<Skeleton type="tool" />}>
 *   <ToolComponent />
 * </Suspense>
 *
 * Customization:
 * <Skeleton type="form" count={3} />
 * <Skeleton type="card-grid" count={8} />
 */

const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700/50 dark:via-gray-600/50 dark:to-gray-700/50 ${className}`} />
);

const ToolSkeleton = () => (
  <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6" aria-busy="true" aria-label="Loading tool content">
    {/* Breadcrumb skeleton */}
    <div className="hidden sm:flex gap-2 items-center">
      <SkeletonBlock className="h-4 w-16" />
      <span className="text-gray-300 dark:text-gray-600">/</span>
      <SkeletonBlock className="h-4 w-24" />
      <span className="text-gray-300 dark:text-gray-600">/</span>
      <SkeletonBlock className="h-4 w-32" />
    </div>

    {/* Title and description area */}
    <div className="space-y-3 pt-4">
      <SkeletonBlock className="h-8 sm:h-10 w-full sm:w-3/4 rounded-xl" />
      <SkeletonBlock className="h-4 w-full sm:w-5/6" />
      <SkeletonBlock className="h-4 w-4/5" />
    </div>

    {/* Main content card - Input section */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 space-y-6 shadow-sm">
      {/* Section title */}
      <SkeletonBlock className="h-6 w-48 rounded-lg" />

      {/* Input fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Input 1 */}
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
        {/* Input 2 */}
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-12 w-full rounded-lg" />
        </div>
      </div>

      {/* Full-width input */}
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-12 w-full rounded-lg" />
      </div>

      {/* Button area */}
      <div className="flex gap-3 pt-4">
        <SkeletonBlock className="h-12 w-32 rounded-lg flex-shrink-0" />
        <SkeletonBlock className="h-12 w-32 rounded-lg flex-shrink-0" />
      </div>
    </div>

    {/* Results/Output section */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 space-y-6 shadow-sm">
      {/* Section title */}
      <SkeletonBlock className="h-6 w-32 rounded-lg" />

      {/* Result box */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl p-6 space-y-4">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-16 w-full rounded-lg" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
    </div>

    {/* Step-by-step section */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 space-y-6 shadow-sm">
      <SkeletonBlock className="h-6 w-32 rounded-lg" />
      
      {/* Steps */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 sm:gap-6">
          {/* Step number */}
          <SkeletonBlock className="h-10 sm:h-12 w-10 sm:w-12 rounded-full flex-shrink-0" />
          {/* Step content */}
          <div className="flex-1 space-y-3 py-1">
            <SkeletonBlock className="h-4 w-48" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>

    {/* Related tools section (optional) */}
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-8 space-y-6 shadow-sm">
      <SkeletonBlock className="h-6 w-40 rounded-lg" />
      
      {/* 3 related tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <SkeletonBlock className="h-10 w-10 rounded-lg" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
            <SkeletonBlock className="h-8 w-full rounded-lg mt-3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Form Skeleton (for tools with just forms) ────────────────────
const FormSkeleton = ({ fieldCount = 3 }) => (
  <div aria-busy="true" aria-label="Loading form">
    <div className="space-y-6 w-full max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-3/4 rounded-xl" />
        <SkeletonBlock className="h-4 w-full" />
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <SkeletonBlock className="h-12 w-full sm:w-40 rounded-lg" />
    </div>
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
    case 'form':
      return <FormSkeleton fieldCount={count} />;
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
export { ToolSkeleton, FormSkeleton, CardGridSkeleton, SearchResultsSkeleton, TextSkeleton, CategoryGridSkeleton, CardSkeleton };
