// Initialize Google AdSense
export const ADSENSE_PUB_ID = 'ca-pub-1234567890123456';

export const initializeAdSense = () => {
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      window.adsbygoogle.push({});
    } catch (e) {
      console.log('AdSense push failed:', e);
    }
  }
};

// Call this in your main App or Router component
export const useAdSense = () => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
};
