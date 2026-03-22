import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Layout from './components/Layout';
import ToolLayout from './components/ToolLayout';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import { tools } from './data/tools';
import { PremiumProvider } from './contexts/PremiumContext';

// Import the map to resolve lazy components correctly
import { lazy } from 'react';
const ComingSoon = lazy(() => import('./tools/ComingSoonTemplate'));

const TOOL_MAP = {
  'calculus-solver':        lazy(() => import('./tools/academic/CalculusSolver')),
  'integral-calculator':    lazy(() => import('./tools/academic/IntegralCalculator')),
  'matrix-algebra':         lazy(() => import('./tools/academic/MatrixAlgebra')),
  'basic-stats':            lazy(() => import('./tools/academic/BasicStats')),
  'gpa-calculator':         lazy(() => import('./tools/academic/GPACalculator')),
  'scientific-notation':    lazy(() => import('./tools/academic/ScientificNotation')),
  'percentage-calc':        lazy(() => import('./tools/academic/PercentageCalc')),
  'pdf-merger-splitter':    lazy(() => import('./tools/pdf/PDFMergeSplit')),
  // Add other tools as needed, falling back to ComingSoon if missing
};

const AppRouter = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(d => !d);

  return (
    <HelmetProvider>
      <PremiumProvider>
        <Router>
          <Routes>
            {/* Main dashboard using App.jsx */}
            <Route path="/"                   element={<Layout isDarkMode={isDarkMode}><App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /></Layout>} />
            <Route path="/category/:categoryId" element={<Layout isDarkMode={isDarkMode}><App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /></Layout>} />

            {/* Map over all declared tools to create individual routes */}
            {tools.map(tool => {
              const Component = TOOL_MAP[tool.slug] || ComingSoon;
              return (
                <Route 
                  key={tool.slug}
                  path={`/tools/${tool.category}/${tool.slug}`} 
                  element={
                    <ToolLayout isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} category={tool.category}>
                      <Suspense fallback={<div className="flex justify-center items-center h-64">Loading {tool.name}...</div>}>
                        <Component isDarkMode={isDarkMode} />
                      </Suspense>
                    </ToolLayout>
                  } 
                />
              );
            })}
            
            {/* Fallback pattern for URLs that might omit the category */}
            {tools.map(tool => {
              const Component = TOOL_MAP[tool.slug] || ComingSoon;
              return (
                <Route 
                  key={`${tool.slug}-fallback`}
                  path={`/tool/${tool.slug}`} 
                  element={
                    <ToolLayout isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} category={tool.category}>
                      <Suspense fallback={<div className="flex justify-center items-center h-64">Loading {tool.name}...</div>}>
                        <Component isDarkMode={isDarkMode} />
                      </Suspense>
                    </ToolLayout>
                  } 
                />
              );
            })}
            
            {/* Static pages */}
            <Route path="/about"            element={<Layout isDarkMode={isDarkMode}><About isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/privacy-policy"   element={<Layout isDarkMode={isDarkMode}><PrivacyPolicy isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/terms-of-service" element={<Layout isDarkMode={isDarkMode}><TermsOfService isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/contact"          element={<Layout isDarkMode={isDarkMode}><Contact isDarkMode={isDarkMode} /></Layout>} />

            {/* Legacy redirects/cleanup */}
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/legal"   element={<Navigate to="/terms-of-service" replace />} />

            {/* 404 → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PremiumProvider>
    </HelmetProvider>
  );
};

export default AppRouter;