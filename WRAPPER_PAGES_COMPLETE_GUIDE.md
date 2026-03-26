# Complete Guide: Wrapper Pages & ToolPageLayout Migration

## Overview
Your project has 79+ tools organized in `src/tools/{category}/`. The new **ToolPageLayout** component provides:
- Video ads (once per session, dismissible)
- Top, middle, and bottom banner ads
- Full-width layout (no wasted space)
- Self-contained styles (no Tailwind conflicts)
- Dark mode support via CSS variables

## Current Status
✅ **ToolPageLayout.jsx** - Already exists and is complete  
✅ **Some wrapper pages** - Already created (e.g., CalculusSolverPage.jsx)  
⏳ **All wrapper pages** - Need to be completed/standardized  
⏳ **Router.jsx** - Needs updating to use wrapper pages

---

## Step 1: Understand the Router Structure

### Current Architecture (Direct Tool Rendering)
```jsx
// Router.jsx - CURRENT APPROACH (old)
<Route path="/tools/:category/:slug" element={
  <ToolLayout isDarkMode={isDarkMode}>
    <Suspense fallback={<ToolSkeleton />}>
      <ToolComponent isDarkMode={isDarkMode} />  
    </Suspense>
  </ToolLayout>
} />
```

### New Architecture (Via Wrapper Pages)
```jsx
// Router.jsx - NEW APPROACH
<Route path="/tools/:category/:slug" element={
  <Layout isDarkMode={isDarkMode}>
    <Suspense fallback={<ToolSkeleton />}>
      <ToolComponentPage />  {/* Page handles layout + ads */}
    </Suspense>
  </Layout>
} />
```

---

## Step 2: Wrapper Page Structure

Each wrapper page follows this pattern:

### File Location
```
src/pages/tools/{ToolNamePage.jsx}
```

### File Naming Convention
- Tool slug: `calculus-solver`
- Component: `CalculusSolver` (in `src/tools/academic/`)
- Page file: `CalculusSolverPage.jsx` (in `src/pages/tools/`)
- Export default: `CalculusSolverPage` (function name)

### Basic Template (JSX)
```jsx
import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import ToolComponent from '@/tools/category/ToolComponent';

// Optional: Custom tips section for this tool
function ToolComponentExtras() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        📚 Quick Tips
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Tip specific to this tool</li>
        <li>Best practices or shortcuts</li>
      </ul>
    </div>
  );
}

// Main wrapper page component
export default function ToolComponentPage() {
  return (
    <ToolPageLayout
      title="Calculus Solver"           // Display name from tools.js
      icon="🚀"                         // Emoji representation
      extraFeatures={<ToolComponentExtras />}
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <ToolComponent isDarkMode={false} />
    </ToolPageLayout>
  );
}
```

### Key Props for ToolPageLayout
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Tool name (matches tools.js) |
| `icon` | string | Emoji or icon for display |
| `children` | ReactNode | Original tool component |
| `extraFeatures` | ReactNode (optional) | Tips/related content section |
| `adClient` | string | Google AdSense client ID |
| `adSlots` | object | Ad slot IDs for {video, top, middle, bottom} |

---

## Step 3: Check Existing Wrapper Pages

Run the helper script to identify missing pages:

```bash
node scripts/generate-wrapper-pages.cjs
```

This creates `wrapper-pages-config.json` showing:
- Total tools: 79
- Missing wrapper pages: [list]

---

## Step 4: Batch Create Wrapper Pages

### Option A: Manual Creation (for a few tools)
1. Open `WRAPPER_PAGE_TEMPLATE.md`
2. Copy template to `src/pages/tools/{ToolNamePage.jsx}`
3. Update:
   - Import path: `@/tools/{category}/{ComponentName}`
   - Component name
   - Tool display name and emoji
   - Tips in extras section

### Option B: Automated Script (Python)

Save this as `scripts/batch_create_wrappers.py`:

```python
#!/usr/bin/env python3
"""
Batch create missing wrapper pages for all tools
Usage: python scripts/batch_create_wrappers.py
"""

import os
import re
import json

# ──────────────────────────────────────────────────────────────────────────
# TOOL METADATA: slug → (ComponentName, ToolName, Category, Emoji)
# Update this with your actual tool data from src/data/tools.js
# ──────────────────────────────────────────────────────────────────────────
TOOL_METADATA = {
    'calculus-solver': ('CalculusSolver', 'Calculus Solver', 'academic', '🚀'),
    'integral-calculator': ('IntegralCalculator', 'Integral Calculator', 'academic', '∫'),
    'matrix-algebra': ('MatrixAlgebra', 'Matrix Calculator', 'academic', '📊'),
    'basic-stats': ('BasicStats', 'Statistics Master', 'academic', '📈'),
    'projectile-simulator': ('ProjectileSimulator', 'Physics Simulator', 'academic', '🎯'),
    'chemistry-balancer': ('ChemistryBalancer', 'Chemistry Balancer', 'academic', '⚗️'),
    'circuit-designer': ('CircuitDesigner', 'Circuit Analyzer', 'academic', '⚡'),
    'economics-elasticity': ('EconomicsElasticity', 'Economics Tool', 'academic', '💹'),
    'unit-converter': ('UnitConverter', 'Unit Converter', 'academic', '📏'),
    'gpa-calculator': ('GPACalculator', 'GPA Calculator', 'academic', '🎓'),
    
    'loan-repayment': ('StudentLoanRepayment', 'Student Loan Estimator', 'financial', '💰'),
    'scholarship-roi': ('ScholarshipROICalc', 'Scholarship Finder', 'financial', '🏆'),
    'student-budgeting': ('StudentBudgeting', 'Student Budget Planner', 'financial', '💳'),
    'housing-calc': ('HousingCalc', 'Rent vs. Buy (Dorm) Calc', 'financial', '🏠'),
    'textbook-resale': ('TextbookResale', 'Textbook Buyback Calc', 'financial', '📚'),
    'moving-costs': ('MovingCosts', 'Relocation Calculator', 'financial', '🚚'),
    'emi-loan-calculator': ('EMILoanCalc', 'EMI / Loan Calculator', 'financial', '🏦'),
    'sip-calculator': ('SIPCalculator', 'SIP Calculator', 'financial', '📊'),
    'salary-calculator': ('salaryTax', 'Salary Calculator', 'financial', '💵'),
    
    'final-grade-calc': ('FinalGradeCalc', 'Grade Calculator', 'utility', '🎯'),
    'pomodoro-timer': ('PomodoroTimer', 'Pomodoro Timer', 'utility', '⏱️'),
    'study-planner': ('StudyPlanner', 'Study Planner', 'utility', '📅'),
    'scientific-notation': ('ScientificNotation', 'Scientific Notation', 'utility', '#'),
    'assignment-tracker': ('AssignmentTracker', 'Assignment Tracker', 'utility', '✓'),
    'percentage-calc': ('PercentageCalc', 'Percentage Calculator', 'utility', '%'),
    'exam-weighting': ('ExamWeighting', 'Exam Weighting Calc', 'utility', '⚖️'),
    'date-difference': ('DateDifference', 'Date Difference', 'utility', '📆'),
    'age-calculator': ('AgeCalculator', 'Age Calculator', 'utility', '🎂'),
    
    # Add niche, health, image, pdf, text, audio, developer, documentmaker...
}

WRAPPER_TEMPLATE = '''import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import {component_name} from '@/tools/{category}/{component_name}';

function {component_name}Extras() {{
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        💡 Quick Tips
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Use this tool to quickly solve problems</li>
        <li>Check related tools for additional features</li>
      </ul>
    </div>
  );
}}

export default function {component_name}Page() {{
  return (
    <ToolPageLayout
      title="{tool_name}"
      icon="{emoji}"
      extraFeatures={<{component_name}Extras />}
      adClient={{import.meta.env.VITE_ADSENSE_PUB_ID}}
      adSlots={{{{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}}}
    >
      <{component_name} isDarkMode={{false}} />
    </ToolPageLayout>
  );
}}
'''

def main():
    pages_dir = 'src/pages/tools'
    os.makedirs(pages_dir, exist_ok=True)
    
    created = 0
    skipped = 0
    
    for slug, (component_name, tool_name, category, emoji) in TOOL_METADATA.items():
        page_file = os.path.join(pages_dir, f'{component_name}Page.jsx')
        
        if os.path.exists(page_file):
            print(f'⏭️  SKIP: {component_name}Page.jsx already exists')
            skipped += 1
            continue
        
        # Generate content
        content = WRAPPER_TEMPLATE.format(
            component_name=component_name,
            category=category,
            tool_name=tool_name,
            emoji=emoji
        )
        
        # Write file
        with open(page_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✅ CREATE: {component_name}Page.jsx')
        created += 1
    
    print(f'\n' + '='*60)
    print(f'📊 Summary: {created} created, {skipped} skipped')
    print('='*60)

if __name__ == '__main__':
    main()
```

Run:
```bash
python scripts/batch_create_wrappers.py
```

---

## Step 5: Update Router.jsx

Replace the tool routes section with lazy-loaded page components:

### Old Code (Remove)
```jsx
{tools.map(tool => {
  const Component = TOOL_MAP[tool.slug] || ComingSoon;
  return (
    <Route
      key={tool.slug}
      path={`/tools/${tool.category}/${tool.slug}`}
      element={<ToolLayout><Component /></ToolLayout>}
    />
  );
})}
```

### New Code (Replace With)

First, add lazy imports at the top of Router.jsx:

```jsx
// Create a dynamic page map
const PAGE_MAP = {};
const pageModules = import.meta.glob('/src/pages/tools/*Page.jsx');

Object.keys(pageModules).forEach(path => {
  const filename = path.split('/').pop().replace('Page.jsx', '');
  const slug = filename
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
  PAGE_MAP[slug] = lazy(() => pageModules[path]());
});
```

Then update the routes:

```jsx
{tools.map(tool => {
  const PageComponent = PAGE_MAP[tool.slug];
  
  if (!PageComponent) {
    console.warn(`⚠️ Missing page for tool: ${tool.slug}`);
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
```

---

## Step 6: Verify Everything Works

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test a few tool routes:**
   - http://localhost:5173/tools/academic/calculus-solver
   - http://localhost:5173/tools/financial/student-budgeting
   - http://localhost:5173/tool/gpa-calculator (fallback route)

3. **Check console for warnings:**
   ```
   ⚠️ Missing page for tool: some-slug
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Step 7: Complete Tool Metadata

For each tool in `src/data/tools.js`, you need:
1. `name` - Display name used in ToolPageLayout
2. `slug` - kebab-case identifier
3. `icon` - Category icon (not tool emoji)
4. `category` - Folder under src/tools/

Example from tools.js:
```javascript
{
  id: 1,
  name: 'Calculus Solver',       // ← Used in wrapper page title
  description: '...',
  category: 'academic',          // ← Maps to src/tools/academic/
  icon: 'Variable',
  slug: 'calculus-solver',       // ← Maps to CalculusSolverPage.jsx
  tags: [...]
}
```

---

## Troubleshooting

### ❌ "Cannot find module '@/components/ToolPageLayout'"
- Ensure `@` alias is configured in vite.config.js
- Should map to `src/`

### ❌ "Tool component not rendering"
- Check import path matches actual tool location
- Verify component name in import statement
- Ensure tool component accepts `isDarkMode` prop

### ❌ "Route not matching"
- Check slug in tools.js matches URL
- Verify page file is named correctly: `{ComponentName}Page.jsx`
- Ensure Router is using updated PAGE_MAP

### ✅ "Ads showing but no content"
- ToolPageLayout properly wraps tool content
- Tool component renders inside `{children}`
- Dark mode CSS variables correctly set

---

## Quick Checklist Before Deploy

- [ ] All wrapper pages created in `src/pages/tools/`
- [ ] Router.jsx updated to use PAGE_MAP
- [ ] Environment variables set:
  - `VITE_ADSENSE_PUB_ID`
  - `VITE_VIDEO_AD_SLOT`
  - `VITE_BANNER_AD_SLOT`
  - `VITE_DISPLAY_AD_SLOT`
- [ ] Dev server runs without console errors
- [ ] All tool routes render with ads
- [ ] Production build succeeds (`npm run build`)
- [ ] No "Cannot find module" warnings
- [ ] Dark mode toggles work
- [ ] Video ad dismissible

---

## File Summary

After completion, your structure should be:

```
src/
  components/
    ToolPageLayout.jsx          ✅ (already exists)
    ToolLayout.jsx              ✅ (old, can deprecate)
    ...
  pages/
    tools/
      CalculusSolverPage.jsx    ← Wrapper page
      IntegralCalculatorPage.jsx
      MatrixAlgebraPage.jsx
      ... (50+ wrapper pages)
  tools/
    academic/
      CalculusSolver.jsx        ← Original tool (unchanged)
      IntegralCalculator.jsx
      MatrixAlgebra.jsx
      ...
  Router.jsx                    ← Updated with PAGE_MAP
  data/
    tools.js                    ← Tool metadata
```

---

## Support

For issues or questions:
1. Check console for specific error messages
2. Verify file paths match your project structure
3. Ensure all imports use `@/` alias correctly
4. Test in dev mode before building

