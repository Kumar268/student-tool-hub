import { useEffect } from 'react';

// Initialize Google AdSense
export const ADSENSE_PUB_ID = import.meta.env.VITE_ADSENSE_PUB_ID || 'YOUR_ADSENSE_PUBLISHER_ID';

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
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_ADS_ENABLED === 'true') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);
};
