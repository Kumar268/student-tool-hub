import React from 'react';
import Footer from './Footer';

const Layout = ({ children, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-[#020408] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Optional: Add a Global Header here if needed, 
          but App.jsx currently handles its own header for the dashboard.
          For tools, we use ToolLayout which has a back button.
      */}
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;