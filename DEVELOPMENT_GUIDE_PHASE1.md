# 🛠️ PHASE 1 DEVELOPMENT GUIDE — Complete Integration Manual

---

## 🎯 Quick Start: 5-Minute Integration

### Step 1: SearchBar Component
**Location**: Already at `src/components/SearchBar.jsx`
**Status**: ✅ Ready to use

**Integration in App.jsx**:
```jsx
// Add to top
import SearchBar from './components/SearchBar';

// In your header/topbar render
<SearchBar isDarkMode={isDarkMode} />
```

**That's it!** The SearchBar will:
- Automatically search through all tools
- Store history in localStorage
- Track popular searches
- Support keyboard navigation

### Step 2: Breadcrumb Navigation
**Location**: Already at `src/components/Breadcrumb.jsx`
**Status**: ✅ Ready to use

**Integration in ToolDetail.jsx**:
```jsx
// Add to top
import Breadcrumb from './components/Breadcrumb';

// At the top of your tool page
return (
  <>
    <Breadcrumb isDarkMode={isDarkMode} />
    {/* Rest of tool content */}
  </>
);
```

### Step 3: Loading Skeletons
**Location**: Already at `src/components/Skeleton.jsx`
**Status**: ✅ Ready to use

**Usage with Suspense**:
```jsx
import { Suspense } from 'react';
import Skeleton from './components/Skeleton';

return (
  <Suspense fallback={<Skeleton type="tool" />}>
    <LazyLoadedToolComponent />
  </Suspense>
);
```

### Step 4: 404 Page
**Location**: Already at `src/pages/NotFound.jsx`
**Status**: ✅ Ready to use

**Integration in Router.jsx**:
```jsx
// In your routes array (as catch-all)
{
  path: '*',
  element: <NotFound isDarkMode={isDarkMode} />
}
```

---

## 📖 Detailed Component Documentation

### SearchBar Component

#### Props
```tsx
interface SearchBarProps {
  isDarkMode: boolean;  // Dark mode toggle
}
```

#### Features Breakdown
```jsx
// 1. Local Storage Integration
// Automatically stores:
// - searchHistory (last 5 searches)
// - popularSearches (click tracking)

// 2. Keyboard Shortcuts
// Ctrl+K or Cmd+K — Focus search input
// ↑↓ — Navigate results
// Enter — Select highlighted result
// Esc — Close dropdown

// 3. Analytics
// Tracks search terms and clicks automatically
// Updates popular searches in real-time

// 4. Category Filtering
// When results show, filter buttons appear
// Click to narrow results to category
```

#### Example Usage
```jsx
import SearchBar from './components/SearchBar';

function MyHeader() {
  return (
    <header>
      <SearchBar isDarkMode={true} />
    </header>
  );
}
```

#### Customization
```jsx
// The component is mostly self-contained
// but you can customize:

// 1. Placeholder text (line 6 in component)
placeholder="Search 56+ tools (Ctrl+K)..."

// 2. Debounce delay (line 60)
}, 300);  // Change 300 to desired ms

// 3. Result limit (currently returns all)
// Modify performSearch to add:
.slice(0, 10)  // Top 10 results
```

---

### Breadcrumb Component

#### Props
```tsx
interface BreadcrumbProps {
  isDarkMode: boolean;
}
```

#### How It Works
```
Current Route: /tools/academic/calculus-solver
Generated Breadcrumb: Home > Academic Tools > Calculus Solver
```

#### Supported Routes
```
1. /tools/:category/:slug
   → Home > [Category] > [Tool Name]

2. /tool/:toolId (legacy)
   → Home > [Category] > [Tool Name]

3. /category/:categoryId
   → Home > [Category]

4. / (home)
   → Not displayed
```

#### JSON-LD Schema (Auto-generated)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Academic Tools",
      "item": "https://example.com/category/academic"
    }
  ]
}
```

---

### Skeleton Component

#### Available Types
```jsx
// 1. Tool page skeleton
<Skeleton type="tool" />

// 2. Card grid (customizable count)
<Skeleton type="card-grid" count={6} />

// 3. Search results
<Skeleton type="search-results" count={3} />

// 4. Text lines
<Skeleton type="text" count={3} />

// 5. Category grid
<Skeleton type="category-grid" count={8} />

// 6. Single card (default)
<Skeleton />  // or type="card"
```

#### With Suspense
```jsx
import { Suspense } from 'react';
import { lazy } from 'react';
import Skeleton from './components/Skeleton';

const ToolPage = lazy(() => import('./pages/ToolDetail'));

function ToolLayout() {
  return (
    <Suspense fallback={<Skeleton type="tool" />}>
      <ToolPage />
    </Suspense>
  );
}
```

#### Customization
```jsx
// Change animation duration
.animate-pulse {
  animation-duration: 2s;  // Default: 2s
}

// Change colors in dark/light mode
// (Edit gradients in SkeletonBlock component)
```

---

### NotFound (404) Component

#### Props
```tsx
interface NotFoundProps {
  isDarkMode: boolean;
}
```

#### Data Sources
```jsx
// Component automatically integrates:
1. tools.js — For popular tools list
2. categories.js — For category grid
3. localStorage — For analytics (if available)
4. React Router — For navigation
```

#### Features
```
✓ Dynamic popular tools (based on analytics)
✓ All categories with tool counts
✓ Quick navigation buttons
✓ Help section with tips
✓ GitHub issue link
✓ Meta tags via Helmet
```

#### Customization
```jsx
// 1. Change GitHub link (line 250)
href="https://your-repo-url"

// 2. Add more action buttons
<button onClick={() => navigate('/categories')}>
  Browse Categories
</button>

// 3. Adjust popular tools count
.slice(0, 6)  // Change 6 to desired count
```

---

## 🧪 Testing Guide

### SearchBar Testing
```javascript
// Test 1: Search functionality
1. Type "calculus" in search
2. Verify results appear in < 400ms (300ms debounce + margin)
3. Results should include Calculus Solver

// Test 2: Keyboard navigation
1. Open dropdown
2. Press ↓ arrow key
3. Verify first result is highlighted
4. Press ↓ again, verify highlight moves to second
5. Press ↑, verify highlight goes back

// Test 3: Search history
1. Search for "GPA"
2. Click first result
3. Refresh page
4. Open search again
5. Verify "GPA Calculator" appears in recent searches

// Test 4: Popular searches
1. Search for "Integral" 5x and click result
2. Open search again
3. Verify "Integral" shows in trending (multiple clicks)

// Test 5: Category filter
1. Search for a tool that exists in multiple categories
2. Click category filter
3. Verify results now only show that category

// Test 6: Mobile
1. Set viewport < 640px
2. Verify dropdown still works
3. Check touch targets are >= 44x44px
```

### Breadcrumb Testing
```javascript
// Test 1: Route parsing
1. Navigate to /tools/academic/calculus-solver
2. Verify breadcrumb shows: Home > Academic Tools > Calculus Solver
3. Click "Academic Tools" link
4. Verify navigates to /category/academic

// Test 2: JSON-LD validation
1. Use JSON-LD validator tool
2. Paste HTML from view source
3. Verify breadcrumbList structure is valid

// Test 3: Mobile
1. Set viewport < 640px
2. Navigate to tool with long name
3. Verify breadcrumb is scrollable/not overflowing
```

### Skeleton Testing
```javascript
// Test 1: Animation
1. Render <Skeleton type="tool" />
2. Verify pulsing animation plays smoothly
3. Check CPU/GPU usage (should be minimal)

// Test 2: Types
1. Render each skeleton type
2. Verify layout matches expected output type

// Test 3: Dark mode
1. Toggle dark mode
2. Verify skeleton colors switch
3. Check contrast is adequate

// Test 4: Accessibility
1. Inspect element
2. Verify aria-busy="true" is present
3. Verify aria-label is descriptive
```

### 404 Page Testing
```javascript
// Test 1: Navigation to 404
1. Navigate to /invalid-url
2. Verify 404 page renders
3. Check title, message, illustration display

// Test 2: Popular tools
1. Search for some tools in SearchBar
2. Navigate to /404
3. Verify those tools appear in "Popular Tools" section

// Test 3: Category links
1. On 404 page, click category link (e.g., "Academic Tools")
2. Verify navigates to /category/academic
3. Verify category page loads with correct tools

// Test 4: Back button
1. Navigate somewhere, then to /invalid
2. Click "Go Back" button
3. Verify returns to previous page

// Test 5: Mobile
1. Set viewport < 640px
2. Verify layout stacks properly
3. Check buttons remain touch-friendly
```

---

## 🎯 Common Integration Scenarios

### Scenario 1: Add SearchBar to Existing Header
```jsx
// Before
<header>
  <h1>StudentToolHub</h1>
</header>

// After
<header>
  <h1>StudentToolHub</h1>
  <SearchBar isDarkMode={isDarkMode} />  {/* ADD THIS */}
</header>
```

### Scenario 2: Show Loading While Fetching Tools
```jsx
// Before
<Suspense fallback={<div>Loading...</div>}>
  <ToolList />
</Suspense>

// After
<Suspense fallback={<Skeleton type="card-grid" count={6} />}>
  <ToolList />
</Suspense>
```

### Scenario 3: Add Breadcrumb to Tool Pages
```jsx
// Before
function ToolPage() {
  return (
    <div>
      <h1>{tool.name}</h1>
      {/* tool content */}
    </div>
  );
}

// After
function ToolPage() {
  return (
    <>
      <Breadcrumb isDarkMode={isDarkMode} />
      <div>
        <h1>{tool.name}</h1>
        {/* tool content */}
      </div>
    </>
  );
}
```

### Scenario 4: Ensure 404 Route Exists
```jsx
// In Router.jsx, add as last route
<Routes>
  {/* ... other routes ... */}
  <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
</Routes>
```

---

## 🔍 Troubleshooting

### Problem: SearchBar dropdown not showing
**Solution**:
- Check that `tools` array is imported correctly from `data/tools.js`
- Verify `categories` is also imported
- Check browser console for errors

### Problem: Breadcrumb not rendering
**Solution**:
- Ensure component is placed INSIDE a Router context
- Check that useLocation and useParams hooks are available
- Verify route params match expected format

### Problem: Skeleton animation is laggy
**Solution**:
- Reduce number of simultaneous skeletons
- Check for other heavy animations on page
- Verify browser hardware acceleration is enabled

### Problem: 404 page not appearing
**Solution**:
- Ensure route with `path="*"` is last in Routes array
- Check that component is imported
- Verify props (isDarkMode) are passed

### Problem: Analytics not tracking
**Solution**:
- Check that localStorage is not disabled
- Verify browser privacy settings allow localStorage
- Check browser console for quota exceeded errors

---

## 📊 LocalStorage Schema

### searchHistory
```js
[
  { query: "Calculus Solver", timestamp: 1711174800000 },
  { query: "Matrix Algebra", timestamp: 1711174500000 },
  // ... max 5 items
]
```

### popularSearches
```js
[
  { term: "Calculus Solver", count: 5 },
  { term: "GPA Calculator", count: 3 },
  { term: "Matrix Algebra", count: 2 },
  // ... sorted by count (descending)
]
```

---

## 🚀 Performance Tips

1. **SearchBar**: Already optimized with debouncing (300ms)
2. **Breadcrumb**: Uses useParams hook (no re-renders unless route changes)
3. **Skeleton**: Uses CSS animations (GPU-accelerated)
4. **404 Page**: Renders category grid only once (no real-time updates)

---

## 📱 Mobile Considerations

All Phase 1 components are mobile-first:
- Touch targets: 44x44px minimum
- Responsive typography: Uses clamp()
- Overflow handling: Auto-scrolling dropdowns
- No hover-only interactions

---

## ♿ Accessibility Checklist

- [ ] Keyboard navigation works (Tab, Arrows, Enter)
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] ARIA labels on all interactive elements
- [ ] Semantic HTML used (nav, button, a, etc.)
- [ ] Focus indicators visible
- [ ] Screen readers can read content

---

**Version**: 1.0
**Last Updated**: March 22, 2026
**Compatible With**: React 19+, React Router 7+, Tailwind CSS 4

