import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Moon, Sun } from 'lucide-react';
import VideoAd from './monetization/VideoAd';
import GoogleAd from './monetization/GoogleAd';

const ToolLayout = ({ children, isDarkMode, onToggleDarkMode, category = 'utility' }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        
        {/* Very minimal nav-bar just to guarantee user can get back */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </button>
          </div>
          
          <button 
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
          </button>
        </nav>

        {/* 1. Global Once-per-session Video Ad */}
        <VideoAd 
          videoSrc="" // Add your video URL here later 
          adLink="https://example.com/student-offer" 
        />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 2. Top Banner Ad */}
          <GoogleAd slot="TOP_BANNER_SLOT_ID" format="horizontal" />

          {/* 3. The Custom Tool Engine (Unmodified) */}
          <div className="my-8">
            {children}
          </div>

          {/* 4. Bottom Banner Ad */}
          <GoogleAd slot="BOTTOM_BANNER_SLOT_ID" format="auto" />
        </main>

      </div>
    </div>
  );
};

export default ToolLayout;
