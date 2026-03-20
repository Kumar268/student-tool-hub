# StudentToolHub - AI Coding Agent Instructions

## Project Overview
StudentToolHub is a **React 19 + Vite web application** hosting 56 educational and utility tools organized into 9 categories. It features dark mode, real-time calculations, visualizations (charts, 3D graphics), and responsive design.

## Architecture Essentials

### Routing & Navigation
- **Router.jsx**: Main entry point managing dark mode state (`isDarkMode`, `toggleDarkMode`), AdSense initialization, and all routes
- **Dynamic tool routes**: `/tool/:toolId` and `/tools/:category/:toolId` both map to **ToolDetail.jsx**
- **Slug-based routing**: Tools identified by kebab-case slugs (e.g., `calculus-solver`, `matrix-algebra`) in `src/data/tools.js`
- Add new tools: create JSX component in `src/tools/{category}/`, add metadata to tools array in `data/tools.js`, import in ToolDetail.jsx

### Tool Categories (9 total)
Located in `src/tools/{category}/` - organize all tools here:
- **academic**: Math, physics, chemistry, circuit analysis, economics (10 tools)
- **financial**: Loans, budgeting, scholarships (6 tools)
- **utility**: Calculators, GPA, grades, percentage, timers (7 tools)
- **niche**: Astronomy, music theory, nutrition, binary conversion (7 tools)
- **image**: Compression, conversion, resizing, background removal (7 tools)
- **pdf**: Merge, split, compress, unlock (6 tools)
- **text**: Word count, formatting, case conversion, plagiarism check (5 tools)
- **audio**: Recording, text-to-speech, conversion (3 tools)
- **developer**: Code formatting, color picker, QR, CSS minifier (5 tools)

### Tool Component Pattern
```jsx
// File: src/tools/{category}/{ToolName}.jsx
const ToolName = ({ isDarkMode, addToHistory, copyResult }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  
  // Calculation logic - use useMemo for expensive operations
  const calculation = useMemo(() => {
    // Math/processing here
    return result;
  }, [input]);
  
  // UI: use SolutionStep for step-by-step display, charts via Chart.js
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <SolutionStep title="Step 1" description="..." />
      {/* Result display */}
      <button onClick={() => copyResult(result)}>Copy</button>
    </div>
  );
};
```
- Props: `isDarkMode` (bool), `addToHistory` (fn), `copyResult` (fn)
- Use **SolutionStep** component for showing calculations step-by-step
- Use **Chart.js** with react-chartjs-2 for graphs; register plugins in component
- Use **KaTeX** (react-katex) for math equations; import `BlockMath` and `InlineMath`
- Use **Framer Motion** for animations; wrap with `motion.div` and `AnimatePresence`

### Dark Mode Convention
Dark mode state propagates from Router → App → Layout/Components:
- Add `isDarkMode` prop to all components receiving theme styling
- TailwindCSS dark mode: use `dark:` class prefix for dark styles
- Store preference: automatically saved to localStorage in Router.jsx
- Gradient example: `bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950` (dark)

## Build & Development
- **Dev**: `npm run dev` - Vite dev server with HMR on localhost:5173
- **Build**: `npm run build` - Creates optimized production bundle in dist/
- **Lint**: `npm run lint` - Runs ESLint (configured in eslint.config.js)
- **Preview**: `npm run preview` - Serve production build locally
- **Key dependencies**: React 19, React Router 7, Framer Motion 12, Chart.js 4, Three.js 183, TailwindCSS 4, mathjs 15

## Code Patterns & Conventions

### Tool Metadata (src/data/tools.js)
Every tool needs an entry in the `tools` array:
```javascript
{
  id: 1,
  name: 'Display Name',
  description: 'User-friendly description',
  category: 'academic', // One of 9 categories
  icon: 'IconName', // Lucide icon (e.g., 'Variable', 'Calculator')
  slug: 'kebab-case-slug',
  tags: ['tag1', 'tag2'] // For search/filtering
}
```
Slug must match the file name (ToolName.jsx → tool-name slug).

### Component Imports in ToolDetail.jsx
All 56 tools must be imported at the top. When adding a tool:
1. Create JSX file in `src/tools/{category}/`
2. Import it in ToolDetail.jsx: `import ToolName from '../tools/category/ToolName';`
3. Add case statement in the render logic mapping slug →component

### UI Libraries & Icons
- **Icons**: lucide-react (e.g., `import { Calculator, Settings } from 'lucide-react'`)
- **Animations**: framer-motion (motion.div, AnimatePresence, useMotionValue, useSpring)
- **Math rendering**: react-katex + katex (BlockMath for display, InlineMath for inline)
- **Charts**: Chart.js + react-chartjs-2 (register plugins before use)
- **3D**: @react-three/fiber + @react-three/drei + three.js
- **PDF Export**: jspdf + html2canvas
- **Styling**: TailwindCSS v4 with custom dark mode classes

### Error Handling
- Wrap suspense zones with ErrorBoundary component
- File: `src/components/ErrorBoundary.jsx` - catches React errors and displays fallback UI
- Example: Dashboard content wrapped in `<ErrorBoundary><Suspense>...</Suspense></ErrorBoundary>`

### "Coming Soon" Tools
Stub tools use `ComingSoonTemplate.jsx` wrapper. Tools marked as coming soon in tools.js will auto-render this placeholder.

## Important Files Reference
- **src/Router.jsx** - Route definitions, dark mode state, AdSense setup
- **src/App.jsx** - Dashboard, category/search filtering, navigation
- **src/components/ToolDetail.jsx** - Tool router/renderer (large file with all tool imports)
- **src/data/tools.js** - Tool metadata & category definitions (single source of truth)
- **src/components/SolutionStep.jsx** - Reusable step display component
- **src/components/Layout.jsx** - Shared layout wrapper (footer, layout structure)
- **vite.config.js** - Vite build config (minimal, uses default react plugin)
- **tailwind.config.js** - TailwindCSS configuration
- **eslint.config.js** - ESLint rules (React, React Hooks plugins)

## SEO & Metadata
- Uses react-helmet-async for per-page meta tags (title, description)
- ToolDetail.jsx sets dynamic Helmet tags per tool
- Categories have icon and color metadata for UI theming

## Common Workflows

### Adding a New Tool
1. Create component: `src/tools/{category}/{ToolName}.jsx`
2. Add metadata to `src/data/tools.js` (id, name, description, category, icon, slug, tags)
3. Import in `src/components/ToolDetail.jsx`
4. Add case statement: `case 'slug': return <ToolName />;`
5. Test routing: `/tool/slug-name` and `/tools/category/slug-name`

### Modifying Dark Mode Styles
- Pass `isDarkMode` prop down from Router
- Apply classes: `${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`
- Use TailwindCSS dark: prefix: `dark:bg-gray-950` when dark class is on root

### Adding a Chart/Visualization
1. Import Chart.js: `import { Bar, Line } from 'react-chartjs-2';`
2. Register plugins in component
3. Prepare datasets and options objects
4. Return JSX: `<Bar data={chartData} options={chartOptions} />`
5. Example: BasicStats.jsx uses Bar and Line charts with custom tooltips

### Exporting Tool Results
Tools can use `copyResult()` prop to copy calculations. For PDF:
- Use jspdf + html2canvas (see ToolDetail.jsx for example)
- Create canvas from HTML, convert to PDF
