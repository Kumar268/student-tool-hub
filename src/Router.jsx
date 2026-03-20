import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import ToolDetail from './components/ToolDetail';
import Legal from './pages/Legal';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Layout from './components/Layout';
import { useAdSense } from './utils/adsenseService';

const AppRouter = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode !== null ? savedDarkMode === 'true' : true;
  });
  useAdSense();

  useEffect(() => {
    // AdSense initialization happens at component mount
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path="/tool/:toolId" element={<Layout isDarkMode={isDarkMode}><ToolDetail isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /></Layout>} />
          <Route path="/tools/:category/:toolId" element={<Layout isDarkMode={isDarkMode}><ToolDetail isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /></Layout>} />
          <Route path="/category/:categoryId" element={<App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path="/legal" element={<Layout isDarkMode={isDarkMode}><Legal isDarkMode={isDarkMode} /></Layout>} />
          <Route path="/about" element={<Layout isDarkMode={isDarkMode}><About isDarkMode={isDarkMode} /></Layout>} />
          <Route path="/privacy" element={<Layout isDarkMode={isDarkMode}><Privacy isDarkMode={isDarkMode} /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default AppRouter;
