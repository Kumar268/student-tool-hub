/**
 * analytics.js — Google Analytics 4 helper utilities
 *
 * ✅ SETUP CHECKLIST:
 * 1. Get GA4 ID: https://analytics.google.com → Admin → Create Property
 * 2. Add to .env:  VITE_GA_ID=G-XXXXXXXXXX
 * 3. Copy to .env.example for team
 * 4. initGA() is called by CookieConsent (respects user consent)
 * 5. Call pageview(path) on route changes (done in Router.jsx)
 * 6. Call trackEvent(...) to track tool interactions
 *
 * ℹ️ Automatically disables in development/staging if ID is missing
 * ℹ️ Respects user cookie consent
 */

const GA_ID = import.meta.env.VITE_GA_ID;
const isDev = !import.meta.env.PROD;

/**
 * Check if GA is properly configured
 * @returns {boolean} True if GA_ID is set and valid
 */
const isGAEnabled = () => {
  return GA_ID && !GA_ID.includes('XXXX') && typeof window !== 'undefined';
};

/**
 * Load the gtag.js script and initialize GA4
 * Call this AFTER user accepts cookies
 */
export const initGA = () => {
  if (!isGAEnabled()) {
    if (isDev) {
      console.log('📊 [GA4] Development mode: GA disabled (missing VITE_GA_ID)');
    }
    return;
  }

  if (window.__ga_initialized) {
    console.log('📊 [GA4] Already initialized');
    return;
  }

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { 
        window.dataLayer.push(arguments); 
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { 
        send_page_view: false, // We handle pageviews manually
        anonymize_ip: true,    // GDPR compliant
      });
      window.__ga_initialized = true;
      console.log('✅ [GA4] Initialized with ID:', GA_ID);
    };

    script.onerror = () => {
      console.warn('⚠️ [GA4] Failed to load gtag.js script');
    };

    document.head.appendChild(script);
  } catch (error) {
    console.error('❌ [GA4] Initialization error:', error);
  }
};

/**
 * Send a pageview event — call on every route change
 * @param {string} path - The page path (e.g., '/tools/academic/calculus-solver')
 */
export const pageview = (path) => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  } catch (error) {
    console.warn('⚠️ [GA4] pageview error:', error);
  }
};

/**
 * Track a tool usage event
 * @param {string} action - What the user did: 'calculate', 'convert', 'generate', 'download'
 * @param {string} toolName - The tool name (e.g., 'GPA Calculator', 'PDF Merger')
 * @param {string} [category] - Tool category (e.g., 'academic', 'utility', 'pdf')
 */
export const trackToolUsage = (action, toolName, category = '') => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', action, {
      event_category: 'tool_usage',
      tool_name: toolName,
      tool_category: category,
      timestamp: new Date().toISOString(),
    });
    console.log(`📊 [GA4] Tracked: ${action} → ${toolName}`);
  } catch (error) {
    console.warn('⚠️ [GA4] trackToolUsage error:', error);
  }
};

/**
 * Track a search event (when user searches for a tool)
 * @param {string} query - What the user searched for
 * @param {number} resultsCount - How many results were found
 */
export const trackSearch = (query, resultsCount = 0) => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', 'search', {
      event_category: 'engagement',
      search_term: query,
      results: resultsCount,
    });
  } catch (error) {
    console.warn('⚠️ [GA4] trackSearch error:', error);
  }
};

/**
 * Track a share/export event (PDF, print, copy, etc.)
 * @param {string} method - How it was exported: 'pdf', 'print', 'copy', 'image'
 * @param {string} toolName - The tool name
 */
export const trackExport = (method, toolName) => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', 'export', {
      event_category: 'tool_export',
      export_type: method,
      tool_name: toolName,
    });
    console.log(`📊 [GA4] Tracked export: ${method} from ${toolName}`);
  } catch (error) {
    console.warn('⚠️ [GA4] trackExport error:', error);
  }
};

/**
 * Track an error event (for debugging)
 * @param {string} errorType - Type of error
 * @param {string} toolName - Which tool had the error
 * @param {string} [message] - Error message details
 */
export const trackError = (errorType, toolName, message = '') => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', 'error', {
      event_category: 'tool_error',
      error_type: errorType,
      tool_name: toolName,
      error_message: message.substring(0, 100), // Limit length
    });
    console.log(`📊 [GA4] Tracked error: ${errorType} in ${toolName}`);
  } catch (error) {
    console.warn('⚠️ [GA4] trackError error:', error);
  }
};

/**
 * Generic custom event tracker
 * @param {string} eventName - Event name (e.g., 'button_click', 'feature_used')
 * @param {object} data - Additional event data
 */
export const trackEvent = (eventName, data = {}) => {
  if (!isGAEnabled() || typeof window?.gtag !== 'function') return;
  
  try {
    window.gtag('event', eventName, data);
  } catch (error) {
    console.warn(`⚠️ [GA4] trackEvent(${eventName}) error:`, error);
  }
};

/**
 * Get current GA4 status (for debugging)
 * @returns {object} GA configuration status
 */
export const getGAStatus = () => ({
  enabled: isGAEnabled(),
  initialized: !!window.__ga_initialized,
  gaId: GA_ID ? '***' + GA_ID.slice(-6) : 'missing',
  isDevelopment: isDev,
});
