import React, { useEffect, useState } from 'react';
import { usePremium } from '../../contexts/PremiumContext';
import { X } from 'lucide-react';

const VideoAd = ({ videoSrc, adLink }) => {
  const { isPremium } = usePremium();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. If premium, never show ads
    if (isPremium) return;

    // 2. Check if video ad has already been shown this session
    const hasShownVideoAd = sessionStorage.getItem('videoAdShown');
    
    if (!hasShownVideoAd) {
      // Show the ad and mark it as shown for this session
      setIsVisible(true);
      sessionStorage.setItem('videoAdShown', 'true');
    }
  }, [isPremium]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-gray-700">
        
        {/* Ad Header/Skip Button */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Advertisement</span>
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors backdrop-blur-md"
          >
            <span>Skip Ad</span>
            <X size={18} />
          </button>
        </div>

        {/* Video Content */}
        <div className="aspect-video bg-black relative w-full">
          {videoSrc ? (
            <video 
              src={videoSrc} 
              autoPlay 
              muted 
              controls={false}
              className="w-full h-full object-cover"
              onEnded={handleClose} // Auto-close when video finishes
            />
          ) : (
            // Fallback placeholder
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <span className="text-4xl mb-4">🎥</span>
              <p>Video Ad Placeholder</p>
              <p className="text-sm mt-2 opacity-50">Auto-closes after play</p>
            </div>
          )}
        </div>

        {/* Ad Footer/Call to Action */}
        <div className="p-6 bg-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Special Student Offer</h3>
            <p className="text-gray-400 text-sm">Get 50% off your first year</p>
          </div>
          <a 
            href={adLink || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoAd;
