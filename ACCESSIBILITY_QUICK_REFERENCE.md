# Accessibility Quick Reference Card

## 🎯 Essential Tailwind Focus Classes

```jsx
// Standard focus ring (blue)
className="focus:outline-none focus:ring-2 focus:ring-blue-500"

// Focus ring with offset (for buttons with backgrounds)
className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

// Focus ring in dark mode
className="focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"

// Focus visible (only shows for keyboard, not mouse)
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"

// Focus within (for container elements)
className="focus-within:ring-2 focus-within:ring-blue-500"
```

## 🏷️ Common ARIA Patterns

### Buttons
```jsx
// Standard button
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Toggle button
<button 
  aria-pressed={isActive}
  aria-label={isActive ? "Mute" : "Unmute"}
>
  {isActive ? <VolumeX /> : <Volume2 />}
</button>

// Loading button
<button aria-busy={loading} aria-label="Calculating...">
  {loading ? "Processing..." : "Calculate"}
</button>
```

### Form Inputs
```jsx
// Input with label
<label htmlFor="email">Email</label>
<input 
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && <p id="email-error" role="alert">Invalid email</p>}

// Required field
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
```

### Search/Combobox
```jsx
<input
  type="text"
  role="combobox"
  aria-label="Search tools"
  aria-autocomplete="list"
  aria-expanded={isOpen}
  aria-controls="search-results"
/>
<div id="search-results" role="listbox">
  <button role="option" aria-selected={isSelected}>
    Result 1
  </button>
</div>
```

### Live Regions
```jsx
// Polite announcement (non-urgent)
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Assertive announcement (urgent)
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// Status updates
<div role="status" aria-live="polite">
  Copied to clipboard!
</div>
```

### Dialogs/Modals
```jsx
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure?</p>
  <button onClick={handleClose}>Cancel</button>
  <button onClick={handleConfirm}>Confirm</button>
</div>
```

## ⌨️ Keyboard Event Handlers

```jsx
// Button-like div
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>

// Escape to close
<div onKeyDown={(e) => {
  if (e.key === 'Escape') {
    handleClose();
  }
}}>
  Modal content
</div>

// Arrow key navigation
<div onKeyDown={(e) => {
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      moveDown();
      break;
    case 'ArrowUp':
      e.preventDefault();
      moveUp();
      break;
  }
}}>
  List items
</div>
```

## 🎨 Color Contrast Requirements

| Text Size | Contrast Ratio | Example |
|-----------|----------------|---------|
| Normal text (<18pt) | 4.5:1 | #666 on #FFF ✓ |
| Large text (≥18pt) | 3:1 | #999 on #FFF ✓ |
| UI components | 3:1 | Border, icons |
| Focus indicators | 3:1 | Focus ring |

**Quick Check:**
- Dark text on light: #595959 or darker
- Light text on dark: #949494 or lighter

## 🖼️ Images & Icons

```jsx
// Decorative icon (hide from screen readers)
<Search aria-hidden="true" />

// Meaningful icon (provide label)
<button aria-label="Search">
  <Search aria-hidden="true" />
</button>

// Image with alt text
<img src="chart.png" alt="Bar chart showing GPA trends" />

// Decorative image
<img src="decoration.png" alt="" />

// Background image with text alternative
<div 
  style={{backgroundImage: 'url(hero.jpg)'}}
  role="img"
  aria-label="Students studying in library"
/>
```

## 📋 Semantic HTML

```jsx
// Use semantic elements
<header>      // Site header
<nav>         // Navigation
<main>        // Main content
<article>     // Independent content
<section>     // Thematic grouping
<aside>       // Sidebar/related content
<footer>      // Site footer

// Heading hierarchy
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
    <h3>Subsection</h3>
  <h2>Section</h2>

// Lists
<ul>          // Unordered list
<ol>          // Ordered list
<dl>          // Definition list
```

## 🔧 Common Fixes

### Fix: Button without label
```jsx
// ❌ Bad
<button onClick={handleDelete}>
  <Trash />
</button>

// ✅ Good
<button onClick={handleDelete} aria-label="Delete item">
  <Trash aria-hidden="true" />
</button>
```

### Fix: Missing form label
```jsx
// ❌ Bad
<input type="text" placeholder="Enter name" />

// ✅ Good
<label htmlFor="name">Name</label>
<input id="name" type="text" placeholder="Enter name" />
```

### Fix: No focus indicator
```jsx
// ❌ Bad
className="outline-none"

// ✅ Good
className="focus:outline-none focus:ring-2 focus:ring-blue-500"
```

### Fix: Click-only interaction
```jsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
// OR
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>
```

### Fix: Missing alt text
```jsx
// ❌ Bad
<img src="logo.png" />

// ✅ Good
<img src="logo.png" alt="Student Tool Hub logo" />
```

## 🧪 Testing Checklist

- [ ] Tab through entire page - can you reach everything?
- [ ] Focus indicators visible on all interactive elements?
- [ ] Can you operate all features with keyboard only?
- [ ] Screen reader announces all content correctly?
- [ ] Color contrast meets 4.5:1 for text?
- [ ] Page works at 200% zoom?
- [ ] All images have alt text?
- [ ] Form errors are announced?
- [ ] Lighthouse accessibility score > 90?

## 📱 Mobile Accessibility

```jsx
// Touch target size (minimum 44x44px)
className="min-w-[44px] min-h-[44px]"

// Prevent zoom on input focus (use appropriate font size)
<input className="text-base" /> // 16px minimum

// Accessible tap areas
<button className="p-3"> // Adequate padding
  <Icon size={20} />
</button>
```

## 🎯 Priority Order

1. **Critical** - Keyboard navigation, focus indicators, ARIA labels
2. **High** - Color contrast, alt text, form labels
3. **Medium** - Heading hierarchy, semantic HTML, skip links
4. **Low** - Enhanced announcements, advanced ARIA patterns

## 💡 Quick Tips

- **Always test with keyboard** - Tab, Enter, Space, Arrows, Escape
- **Use semantic HTML first** - `<button>` not `<div onClick>`
- **Icons need labels** - Either visible text or aria-label
- **Focus must be visible** - Never just `outline: none`
- **Errors need announcements** - Use role="alert" or aria-live
- **Test with real screen readers** - NVDA (Windows) or VoiceOver (Mac)

## 🔗 Quick Links

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

**Remember:** Accessibility is not optional - it's a legal requirement and the right thing to do!
