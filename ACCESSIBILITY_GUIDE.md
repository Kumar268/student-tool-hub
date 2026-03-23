# Accessibility Guide for Student Tool Hub

## Overview
This guide provides comprehensive accessibility improvements for your React + Tailwind CSS application to ensure WCAG 2.1 AA compliance.

---

## ✅ Accessibility Checklist

### 1. Keyboard Navigation
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space, Arrow keys)
- [ ] Focus indicators are visible on all interactive elements
- [ ] Tab order follows logical reading order
- [ ] Skip navigation links provided for main content
- [ ] Modal dialogs trap focus and return focus on close
- [ ] Dropdown menus navigable with arrow keys

### 2. ARIA Labels & Roles
- [ ] All buttons have descriptive aria-labels
- [ ] Form inputs have associated labels
- [ ] Icons have aria-hidden="true" or descriptive labels
- [ ] Dynamic content changes announced to screen readers
- [ ] Proper landmark roles (navigation, main, complementary)
- [ ] Status messages use aria-live regions

### 3. Visual Accessibility
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text (18pt+)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators have 3:1 contrast ratio
- [ ] Text resizable up to 200% without loss of functionality

### 4. Screen Reader Support
- [ ] All images have alt text (decorative images: alt="")
- [ ] Page titles are descriptive and unique
- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] Links have descriptive text (avoid "click here")
- [ ] Form errors clearly announced

### 5. Content & Structure
- [ ] HTML semantic elements used (header, nav, main, footer)
- [ ] Language attribute set on html element
- [ ] Skip to main content link available
- [ ] Consistent navigation across pages
- [ ] Clear error messages with recovery suggestions

---

## 🎯 Common ARIA Roles & When to Use Them

### Landmark Roles
```jsx
<header role="banner">          // Site header
<nav role="navigation">          // Navigation menus
<main role="main">               // Main content
<aside role="complementary">     // Sidebar content
<footer role="contentinfo">      // Site footer
<form role="search">             // Search forms
```

### Widget Roles
```jsx
<div role="button">              // Custom buttons
<div role="dialog">              // Modal dialogs
<div role="alert">               // Important messages
<div role="status">              // Status updates
<div role="tablist">             // Tab navigation
<div role="menu">                // Dropdown menus
```

### Live Regions
```jsx
<div aria-live="polite">         // Non-urgent updates
<div aria-live="assertive">      // Urgent updates
<div aria-live="off">            // No announcements
```

### States & Properties
```jsx
aria-label="Descriptive text"           // Accessible name
aria-labelledby="element-id"            // Reference to label
aria-describedby="element-id"           // Additional description
aria-hidden="true"                      // Hide from screen readers
aria-expanded="true/false"              // Expandable elements
aria-pressed="true/false"               // Toggle buttons
aria-disabled="true/false"              // Disabled state
aria-current="page"                     // Current navigation item
```

---

## 🧪 Testing Accessibility

### 1. Keyboard Navigation Testing

**Steps:**
1. Disconnect your mouse
2. Use Tab to navigate forward, Shift+Tab to go backward
3. Use Enter/Space to activate buttons and links
4. Use Arrow keys in dropdowns and menus
5. Use Escape to close modals and dropdowns

**What to Check:**
- Can you reach every interactive element?
- Is the focus indicator clearly visible?
- Does the tab order make logical sense?
- Can you operate all functionality without a mouse?

### 2. Screen Reader Testing

**Windows (NVDA - Free):**
```bash
# Download from: https://www.nvaccess.org/download/
# Basic commands:
# Ctrl - Stop reading
# Insert+Down Arrow - Read from cursor
# Insert+Space - Toggle browse/focus mode
# H - Navigate by headings
# B - Navigate by buttons
# F - Navigate by form fields
```

**macOS (VoiceOver - Built-in):**
```bash
# Enable: Cmd+F5
# Basic commands:
# VO = Ctrl+Option
# VO+A - Start reading
# VO+Right/Left Arrow - Navigate
# VO+Space - Activate element
# VO+U - Open rotor (navigation menu)
```

**What to Check:**
- Are all elements announced correctly?
- Do buttons describe their action?
- Are form labels read with inputs?
- Are error messages announced?
- Can you navigate by landmarks and headings?

### 3. Browser DevTools - Lighthouse

**Chrome/Edge DevTools:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review issues and recommendations

**What to Check:**
- Color contrast issues
- Missing ARIA labels
- Missing alt text
- Improper heading hierarchy
- Form label associations

### 4. Automated Testing Tools

**axe DevTools (Browser Extension):**
- Chrome: https://chrome.google.com/webstore (search "axe DevTools")
- Firefox: https://addons.mozilla.org/firefox/ (search "axe DevTools")
- Provides detailed accessibility violations with remediation guidance

**WAVE (Browser Extension):**
- https://wave.webaim.org/extension/
- Visual feedback on accessibility issues directly on the page

### 5. Manual Checks

**Color Contrast:**
- Tool: https://webaim.org/resources/contrastchecker/
- Check all text against backgrounds
- Minimum ratio: 4.5:1 (normal text), 3:1 (large text)

**Zoom Testing:**
- Zoom browser to 200% (Ctrl/Cmd + +)
- Verify all content remains readable and functional
- Check for horizontal scrolling issues

**Focus Visibility:**
- Tab through all interactive elements
- Ensure focus ring is visible on all elements
- Check focus ring contrast against backgrounds

---

## 🚀 Quick Wins for Immediate Improvement

### 1. Add Focus Styles Globally
Add to your `index.css` or `App.css`:
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
```

### 2. Add Skip to Main Content Link
Add at the top of your Layout component:
```jsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
>
  Skip to main content
</a>
```

### 3. Add Screen Reader Only Utility Class
Add to your Tailwind config or CSS:
```css
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

.not-sr-only {
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

---

## 📚 Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### React-Specific
- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [Reach UI (Accessible Components)](https://reach.tech/)
- [Radix UI (Accessible Primitives)](https://www.radix-ui.com/)

---

## 🎓 Best Practices Summary

1. **Use semantic HTML** - Prefer `<button>` over `<div onClick>`
2. **Provide text alternatives** - All non-text content needs text equivalent
3. **Ensure keyboard access** - All functionality available via keyboard
4. **Give users time** - Don't auto-advance content without user control
5. **Avoid seizures** - No flashing content more than 3 times per second
6. **Help users navigate** - Clear headings, labels, and focus indicators
7. **Make text readable** - Good contrast, resizable, readable fonts
8. **Make functionality predictable** - Consistent navigation and behavior
9. **Help users avoid errors** - Clear labels, error messages, and validation
10. **Maximize compatibility** - Use standard HTML, ARIA, and test with assistive tech

---

## 📞 Need Help?

If you encounter accessibility issues or need clarification:
1. Check the [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
2. Test with automated tools (Lighthouse, axe)
3. Test with real screen readers
4. Consider hiring an accessibility consultant for audit

Remember: Accessibility is an ongoing process, not a one-time fix!
