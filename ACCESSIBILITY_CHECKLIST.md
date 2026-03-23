# Pre-Launch Accessibility Checklist

Print this and check off items as you complete them!

---

## 🚀 CRITICAL - Must Complete Before Launch

### Global Setup
- [ ] Added focus styles to `index.css` (`*:focus-visible`)
- [ ] Added `.sr-only` utility class to `index.css`
- [ ] Added `lang="en"` to `<html>` in `index.html`
- [ ] Added skip navigation link to Layout component
- [ ] Added `id="main-content"` to main content area

### Component Updates (Already Done ✅)
- [x] CopyButton - Added ARIA labels and focus styles
- [x] ShareButton - Added ARIA labels and focus styles
- [x] SearchBar - Added combobox ARIA pattern
- [x] ToolCard3D - Added keyboard navigation
- [x] GoogleAds - Added ARIA labels

### All Pages
- [ ] All buttons have text or `aria-label`
- [ ] All images have `alt` text (or `alt=""` if decorative)
- [ ] All form inputs have associated `<label>` elements
- [ ] All icons are marked `aria-hidden="true"`
- [ ] All links have descriptive text
- [ ] Heading hierarchy is correct (h1 → h2 → h3, no skipping)

### Interactive Elements
- [ ] All buttons are keyboard accessible (Tab + Enter/Space)
- [ ] All custom interactive elements have `role="button"` and keyboard handlers
- [ ] All dropdowns/modals close with Escape key
- [ ] Focus is visible on all interactive elements
- [ ] No keyboard traps (can always Tab away)

### Forms
- [ ] All inputs have labels (`<label htmlFor="id">`)
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages have `role="alert"` or `aria-live="assertive"`
- [ ] Error messages associated with inputs (`aria-describedby`)
- [ ] Success messages announced to screen readers

### Colors & Contrast
- [ ] Body text has 4.5:1 contrast ratio
- [ ] Large text (18pt+) has 3:1 contrast ratio
- [ ] Button text has 4.5:1 contrast ratio
- [ ] Link text has 4.5:1 contrast ratio
- [ ] Focus indicators have 3:1 contrast ratio
- [ ] Information not conveyed by color alone

---

## 🧪 TESTING - Complete Before Launch

### Automated Testing
- [ ] Lighthouse score ≥ 90 (target: 95+)
- [ ] axe DevTools: 0 Critical issues
- [ ] axe DevTools: 0 Serious issues
- [ ] WAVE: 0 Errors

### Manual Testing
- [ ] Keyboard navigation: Can Tab to all interactive elements
- [ ] Keyboard navigation: Focus always visible
- [ ] Keyboard navigation: Tab order is logical
- [ ] Keyboard navigation: Can activate all buttons with Enter/Space
- [ ] Keyboard navigation: Can close modals with Escape
- [ ] Zoom: Page works at 200% zoom
- [ ] Zoom: No horizontal scrolling at 200%

### Screen Reader Testing (Pick One)
- [ ] NVDA (Windows): All content announced correctly
- [ ] NVDA: Can navigate by headings (H key)
- [ ] NVDA: Can navigate by buttons (B key)
- [ ] NVDA: Form labels read with inputs
- [ ] NVDA: Errors announced when submitted
- [ ] VoiceOver (Mac): All content announced correctly
- [ ] VoiceOver: Can navigate with VO+Arrow keys
- [ ] VoiceOver: Rotor works (VO+U)

---

## 📱 MOBILE ACCESSIBILITY

- [ ] Touch targets ≥ 44x44px
- [ ] Text inputs use `text-base` (16px) to prevent zoom
- [ ] All functionality works with touch
- [ ] Gestures have keyboard alternatives

---

## 📄 SPECIFIC PAGE CHECKS

### Home Page
- [ ] Hero section has proper heading hierarchy
- [ ] Tool cards are keyboard accessible
- [ ] Search bar is keyboard accessible
- [ ] All CTAs have focus indicators

### Tool Pages (Check 3-5 tools)
- [ ] Calculate/Convert buttons have `aria-label`
- [ ] Form inputs have labels
- [ ] Results announced to screen readers (`aria-live`)
- [ ] Add/Remove buttons have descriptive labels
- [ ] File upload (if any) is keyboard accessible

### About/Contact Pages
- [ ] All links have descriptive text
- [ ] Contact form has proper labels
- [ ] Form validation errors announced

---

## 🎯 QUICK TESTS (5 Minutes Each)

### Test 1: Unplug Your Mouse
Time: 5 minutes
- Navigate entire site using only keyboard
- Can you reach everything?
- Is focus always visible?

### Test 2: Lighthouse
Time: 5 minutes
- Open DevTools (F12)
- Run Lighthouse accessibility audit
- Score ≥ 90?

### Test 3: Color Contrast
Time: 5 minutes
- Visit: https://webaim.org/resources/contrastchecker/
- Check 5 text colors against backgrounds
- All pass 4.5:1?

### Test 4: Screen Reader
Time: 10 minutes
- Enable NVDA (Windows) or VoiceOver (Mac)
- Navigate to 3 different pages
- Is everything announced correctly?

### Test 5: Zoom
Time: 3 minutes
- Zoom to 200% (Ctrl/Cmd + +)
- Check 3 pages
- Everything still works?

---

## 📊 SCORE TARGETS

| Test | Minimum | Target | Your Score |
|------|---------|--------|------------|
| Lighthouse | 90 | 95+ | ___ |
| axe Critical | 0 | 0 | ___ |
| axe Serious | 0 | 0 | ___ |
| WAVE Errors | 0 | 0 | ___ |
| Keyboard Nav | 95% | 100% | ___% |

---

## ✅ FINAL SIGN-OFF

Before launching, confirm:

- [ ] All Critical items completed
- [ ] All Testing completed
- [ ] Lighthouse score ≥ 90
- [ ] No Critical/Serious axe issues
- [ ] Keyboard navigation works 100%
- [ ] Screen reader test passed
- [ ] Team trained on accessibility basics
- [ ] Accessibility documentation updated

---

## 🚨 IF YOU FIND ISSUES

### Critical Issues (Fix Immediately)
- Keyboard navigation broken
- Forms not submitting
- Content not accessible to screen readers
- Color contrast failures on body text

### High Priority (Fix Before Launch)
- Missing button labels
- Missing form labels
- Missing alt text
- Improper heading hierarchy

### Medium Priority (Fix Within 1 Week)
- Minor contrast issues
- Missing skip links
- Inconsistent focus indicators

### Low Priority (Fix Within 1 Month)
- Enhanced ARIA patterns
- Advanced keyboard shortcuts
- Improved announcements

---

## 📞 HELP RESOURCES

**Quick Fixes:**
- Missing button label: Add `aria-label="Description"`
- Missing form label: Add `<label htmlFor="id">` and `id="id"`
- Low contrast: Use darker colors (check with contrast checker)
- No focus indicator: Add `focus:ring-2 focus:ring-blue-500`

**Testing Tools:**
- Lighthouse: Built into Chrome DevTools (F12)
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- NVDA: https://www.nvaccess.org/download/

**Documentation:**
- Full Guide: `ACCESSIBILITY_GUIDE.md`
- Quick Reference: `ACCESSIBILITY_QUICK_REFERENCE.md`
- Testing Guide: `ACCESSIBILITY_TESTING_GUIDE.md`
- Implementation Summary: `ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md`

---

## 🎉 READY TO LAUNCH!

Once all items are checked, you're ready to go live with confidence that your site is accessible to everyone!

**Date Completed:** _______________
**Tested By:** _______________
**Approved By:** _______________

---

**Good luck with your launch! 🚀**
