/**
 * analytics.js — Google Analytics 4 helper utilities.
 *
 * Setup:
 * 1. Add your GA4 measurement ID to .env:  VITE_GA_ID=G-XXXXXXXXXX
 * 2. Call initGA() once on app mount (done in Router.jsx)
 * 3. Call pageview(path) on route changes
 * 4. Call event(...) to track tool interactions
 */

const GA_ID = import.meta.env.VITE_GA_ID;

/** Load the gtag.js script and initialize GA4 */
export const initGA = () => {
  if (!GA_ID || typeof window === 'undefined') return;
  if (window.__ga_initialized) return;
  window.__ga_initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
};

/** Send a page view event — call on every route change */
export const pageview = (path) => {
  if (!GA_ID || typeof window?.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
};

/**
 * Send a custom event.
 * @param {string} action  - e.g. 'calculate', 'convert', 'download'
 * @param {string} category - e.g. 'GPA Calculator', 'PDF Merger'
 * @param {string} [label]  - optional extra detail
 * @param {number} [value]  - optional numeric value
 */
export const event = (action, category, label, value) => {
  if (!GA_ID || typeof window?.gtag !== 'function') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
