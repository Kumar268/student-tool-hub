import React from 'react';
import Footer from './Footer';

const Layout = ({ children, isDarkMode }) => {
  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-[#020408] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="flex-grow w-full">
        {children}
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;