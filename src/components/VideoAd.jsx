import React, { useState, useEffect } from 'react';
import AdSlot from './AdSlot';

const VideoAd = ({ className = '' }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

  useEffect(() => {
    // Check if the video ad has already been shown in this browser session
    const hasShown = sessionStorage.getItem('hasShownVideoAd');
    
    if (!hasShown) {
      setShouldShow(true);
      // Mark as shown so it doesn't appear again during this session
      sessionStorage.setItem('hasShownVideoAd', 'true');
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div className={`w-full mb-6 ${className}`}>
      {/* 
        Using 'display' type as it accommodates responsive video/display ads.
        If you have a dedicated video ad slot in AdSense, you could create
        a new type in AdSlot (e.g., type="video").
      */}
      <AdSlot type="display" position="video (once per session)" />
    </div>
  );
};

export default VideoAd;
