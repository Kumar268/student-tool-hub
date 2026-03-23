# Accessibility Testing & Implementation Guide

## 🚀 Implementation Steps

### Phase 1: Quick Wins (1-2 hours)

#### Step 1: Add Global Focus Styles
Add to `src/index.css`:

```css
/* Ensure visible focus for keyboard users */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Remove default outline but keep for keyboard users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

#### Step 2: Add Skip Navigation Link
In `src/components/Layout.jsx`, add at the very top:

```jsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Skip to main content
</a>
```

Then add `id="main-content"` to your main content area:

```jsx
<main id="main-content" role="main">
  {/* Your content */}
</main>
```

#### Step 3: Add Language Attribute
In `index.html`:

```html
<html lang="en">
```

#### Step 4: Update All Icon-Only Buttons
Find all buttons with only icons and add `aria-label`:

```jsx
// Before
<button onClick={handleClose}>
  <X />
</button>

// After
<button onClick={handleClose} aria-label="Close">
  <X aria-hidden="true" />
</button>
```

### Phase 2: Component Updates (2-4 hours)

#### Step 1: Update All Tool Buttons
Replace tool action buttons with accessible versions:

```jsx
// Import the accessible component
import { AccessibleToolButton } from '../components/AccessibleComponents';

// Use it
<AccessibleToolButton
  onClick={handleCalculate}
  label="Calculate GPA"
  icon={Calculator}
  loading={isCalculating}
  isDarkMode={isDarkMode}
/>
```

#### Step 2: Update Form Inputs
Replace form inputs with accessible versions:

```jsx
import { AccessibleInput, AccessibleSelect } from '../components/AccessibleComponents';

<AccessibleInput
  label="Course Name"
  value={courseName}
  onChange={(e) => setCourseName(e.target.value)}
  required
  error={errors.courseName}
  isDarkMode={isDarkMode}
/>
```

#### Step 3: Add ARIA Live Regions for Results
Wrap result displays with live regions:

```jsx
<div 
  role="region" 
  aria-label="Calculation result"
  aria-live="polite"
  aria-atomic="true"
>
  <p className="text-3xl font-bold">{result}</p>
</div>
```

### Phase 3: Advanced Features (2-3 hours)

#### Step 1: Implement Focus Trapping in Modals
If you have modals, implement focus trapping:

```jsx
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement;
      
      // Focus first focusable element in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();

      // Trap focus
      const handleTab = (e) => {
        if (e.key === 'Tab') {
          const focusableContent = Array.from(focusableElements);
          const firstElement = focusableContent[0];
          const lastElement = focusableContent[focusableContent.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else {
      // Restore focus when modal closes
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
};
```

#### Step 2: Add Keyboard Navigation to Custom Components
For any custom interactive components:

```jsx
const CustomButton = ({ onClick, children }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    }}
    className="focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </div>
);
```

## 🧪 Testing Protocol

### Manual Testing Checklist

#### Keyboard Navigation Test (15 minutes)
```
□ Disconnect mouse
□ Press Tab to navigate forward
□ Press Shift+Tab to navigate backward
□ Verify focus indicator is visible on ALL interactive elements
□ Press Enter/Space on buttons and links
□ Press Escape to close modals/dropdowns
□ Use Arrow keys in dropdowns and menus
□ Verify tab order is logical (top to bottom, left to right)
□ Verify no keyboard traps (can always navigate away)
```

#### Screen Reader Test - NVDA (Windows) (20 minutes)
```
1. Download NVDA: https://www.nvaccess.org/download/
2. Install and start NVDA (Ctrl+Alt+N)
3. Navigate to your site
4. Test the following:

□ Press Insert+Down Arrow - Does it read the page?
□ Press H repeatedly - Can you navigate by headings?
□ Press B repeatedly - Can you navigate by buttons?
□ Press F repeatedly - Can you navigate by form fields?
□ Tab through forms - Are labels read with inputs?
□ Submit a form with errors - Are errors announced?
□ Click a button - Is the action announced?
□ Use the search - Are results announced?
□ Navigate to a tool - Is the result announced?

NVDA Commands:
- Ctrl: Stop reading
- Insert+Down Arrow: Read from cursor
- Insert+Space: Toggle browse/focus mode
- H: Next heading
- B: Next button
- F: Next form field
- Insert+F7: Elements list
```

#### Screen Reader Test - VoiceOver (Mac) (20 minutes)
```
1. Enable VoiceOver: Cmd+F5
2. Navigate to your site
3. Test the following:

□ Press VO+A (Ctrl+Option+A) - Does it start reading?
□ Press VO+Right/Left Arrow - Can you navigate elements?
□ Press VO+U - Does the rotor open?
□ Navigate by headings (VO+Cmd+H)
□ Navigate by buttons
□ Navigate by form fields
□ Tab through forms - Are labels read?
□ Submit form with errors - Are errors announced?
□ Use search - Are results announced?

VoiceOver Commands:
- VO = Ctrl+Option
- VO+A: Start reading
- VO+Right/Left Arrow: Navigate
- VO+Space: Activate element
- VO+U: Open rotor
- VO+Cmd+H: Next heading
```

#### Color Contrast Test (10 minutes)
```
1. Open: https://webaim.org/resources/contrastchecker/
2. Test all text colors:

□ Body text vs background (need 4.5:1)
□ Headings vs background (need 4.5:1 if <18pt, 3:1 if ≥18pt)
□ Button text vs button background (need 4.5:1)
□ Link text vs background (need 4.5:1)
□ Focus indicators vs background (need 3:1)
□ Icon colors vs background (need 3:1)
□ Error messages vs background (need 4.5:1)

Common Issues:
- Gray text (#999) on white fails (only 2.8:1)
- Use #767676 or darker for 4.5:1 on white
- Light blue (#60A5FA) on white fails
- Use #2563EB or darker for 4.5:1 on white
```

#### Zoom Test (5 minutes)
```
□ Zoom to 200% (Ctrl/Cmd + +)
□ Verify all content is readable
□ Verify no horizontal scrolling
□ Verify buttons are still clickable
□ Verify forms are still usable
□ Verify navigation still works
```

### Automated Testing

#### Lighthouse Test (5 minutes)
```
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" only
4. Click "Analyze page load"
5. Review issues:

Target Score: 90+

Common Issues Found:
- Missing alt text on images
- Low color contrast
- Missing form labels
- Missing ARIA labels on buttons
- Improper heading hierarchy
```

#### axe DevTools Test (10 minutes)
```
1. Install: https://chrome.google.com/webstore (search "axe DevTools")
2. Open DevTools (F12)
3. Go to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review issues by severity:

□ Fix all Critical issues
□ Fix all Serious issues
□ Review Moderate issues
□ Review Minor issues

Common Issues:
- Buttons without accessible names
- Images without alt text
- Form inputs without labels
- Insufficient color contrast
- Missing landmark regions
```

#### WAVE Test (5 minutes)
```
1. Install: https://wave.webaim.org/extension/
2. Click WAVE icon in browser
3. Review:

□ Errors (red) - Must fix
□ Alerts (yellow) - Review
□ Features (green) - Good!
□ Structural elements (blue) - Verify hierarchy
□ Contrast errors - Must fix

Visual Feedback:
- Icons appear on page showing issues
- Click icons for details
- Very intuitive for beginners
```

## 📊 Testing Schedule

### Before Launch
- [ ] Run Lighthouse (target: 90+)
- [ ] Run axe DevTools (fix all Critical/Serious)
- [ ] Keyboard navigation test (15 min)
- [ ] Screen reader test (20 min)
- [ ] Color contrast check (10 min)
- [ ] Zoom test (5 min)

### Weekly (After Launch)
- [ ] Lighthouse scan on new pages
- [ ] Quick keyboard test on new features

### Monthly
- [ ] Full screen reader test
- [ ] User testing with people with disabilities (if possible)

## 🐛 Common Issues & Fixes

### Issue 1: Lighthouse says "Buttons do not have an accessible name"
```jsx
// Fix: Add aria-label
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>
```

### Issue 2: "Form elements do not have associated labels"
```jsx
// Fix: Use htmlFor and id
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Issue 3: "Background and foreground colors do not have sufficient contrast"
```jsx
// Fix: Use darker colors
// Instead of text-gray-400 (#9CA3AF - fails)
// Use text-gray-600 (#4B5563 - passes)
className="text-gray-600"
```

### Issue 4: "Links do not have a discernible name"
```jsx
// Fix: Add descriptive text or aria-label
<a href="/about" aria-label="About us">
  <Info aria-hidden="true" />
</a>
```

### Issue 5: "Heading elements are not in sequentially-descending order"
```jsx
// Fix: Don't skip heading levels
// ❌ Bad: h1 → h3
<h1>Title</h1>
<h3>Subtitle</h3>

// ✅ Good: h1 → h2
<h1>Title</h1>
<h2>Subtitle</h2>
```

## 📈 Success Metrics

### Target Scores
- Lighthouse Accessibility: 95+
- axe DevTools: 0 Critical, 0 Serious issues
- WAVE: 0 Errors
- Manual keyboard test: 100% navigable
- Screen reader test: All content announced correctly

### Before/After Comparison
Track these metrics before and after implementation:

| Metric | Before | Target | After |
|--------|--------|--------|-------|
| Lighthouse Score | ? | 95+ | ? |
| Critical Issues | ? | 0 | ? |
| Keyboard Navigable | ? | 100% | ? |
| Color Contrast Fails | ? | 0 | ? |
| Missing Alt Text | ? | 0 | ? |

## 🎓 Learning Resources

### Video Tutorials
- [WebAIM Screen Reader Demo](https://webaim.org/articles/screenreader_testing/)
- [Google Web Accessibility Course](https://web.dev/learn/accessibility/)

### Documentation
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

## 💡 Pro Tips

1. **Test early and often** - Don't wait until the end
2. **Use real screen readers** - Automated tools miss things
3. **Test with keyboard only** - Unplug your mouse
4. **Ask real users** - People with disabilities are the best testers
5. **Make it a habit** - Include accessibility in your definition of "done"
6. **Document patterns** - Create a component library of accessible components
7. **Train your team** - Everyone should know the basics
8. **Stay updated** - WCAG 2.2 and 3.0 are coming

## 🚨 Legal Requirements

Many countries require web accessibility:
- **USA**: ADA, Section 508
- **EU**: European Accessibility Act
- **UK**: Equality Act 2010
- **Canada**: AODA
- **Australia**: DDA

**Minimum standard**: WCAG 2.1 Level AA

---

**Remember**: Accessibility is not a feature, it's a fundamental requirement!

Good luck with your launch! 🚀
