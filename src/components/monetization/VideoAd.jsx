import React, { useEffect, useState } from 'react';
import { usePremium } from '../../contexts/PremiumContext';
import { X } from 'lucide-react';

const VideoAd = ({ videoSrc, adLink, isEnabled = true }) => {
  const { isPremium } = usePremium();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. If disabled or premium, never show
    if (!isEnabled || isPremium) return;

    // 2. Check if video ad has already been shown this session
    const hasShownVideoAd = sessionStorage.getItem('videoAdShown');
    
    if (!hasShownVideoAd) {
      setIsVisible(true);
      sessionStorage.setItem('videoAdShown', 'true');
    }
  }, [isPremium, isEnabled]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || isPremium || !isEnabled) return null;

  return (
    <div className="my-8 mx-auto max-w-4xl w-full px-4">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 dark:border-gray-600/30">
        
        {/* Ad Label & Close */}
        <div className="flex justify-between items-center p-3 bg-gray-800/50 border-b border-gray-700/30">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Sponsored Video</span>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Close Ad"
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black relative w-full">
          {videoSrc ? (
            <video 
              src={videoSrc} 
              controls 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-600 bg-gray-950">
              <span className="text-3xl mb-3">🎞️</span>
              <p className="text-sm">Video Advertisement</p>
            </div>
          )}
        </div>

        {/* Ad Call to Action */}
        <div className="p-4 sm:p-5 bg-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-semibold text-white">Student Hub Premium Offer</h3>
            <p className="text-gray-400 text-xs">Unlock all tools with a single click</p>
          </div>
          <a 
            href={adLink || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoAd;
