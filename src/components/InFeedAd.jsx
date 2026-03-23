import React from 'react';

const InFeedAd = ({ slot }) => {
  return (
    <div 
      className="ad-placeholder in-feed hidden" 
      data-ad-slot={slot}
    >
      {/* In-feed ad placeholder */}
    </div>
  );
};

export default InFeedAd;
