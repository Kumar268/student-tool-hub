import React from 'react';
import Footer from './Footer';

const Layout = ({ children, isDarkMode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;