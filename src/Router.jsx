import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Layout from './components/Layout';
import ToolLayout from './components/ToolLayout';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';
import CookieConsent from './components/CookieConsent';
import ToolSkeleton from './components/Skeleton';
import FAQ from './pages/FAQ';
import { tools } from './data/tools';
import { trackToolVisit } from './hooks/useToolHistory';
import { PremiumProvider } from './contexts/PremiumContext';
import { pageview } from './utils/analytics';

// ─── Lazy tool imports ──────────────────────────────────────────────────────
const ComingSoon = lazy(() => import('./tools/ComingSoonTemplate'));

const TOOL_MAP = {
  // Academic
  'calculus-solver':        lazy(() => import('./tools/academic/CalculusSolver')),
  'integral-calculator':    lazy(() => import('./tools/academic/IntegralCalculator')),
  'matrix-algebra':         lazy(() => import('./tools/academic/MatrixAlgebra')),
  'basic-stats':            lazy(() => import('./tools/academic/BasicStats')),
  'gpa-calculator':         lazy(() => import('./tools/academic/GPACalculator')),
  'scientific-notation':    lazy(() => import('./tools/academic/ScientificNotation')),
  'percentage-calc':        lazy(() => import('./tools/academic/PercentageCalc')),
  'unit-converter':         lazy(() => import('./tools/academic/UnitConverter')),
  'economics-elasticity':   lazy(() => import('./tools/academic/EconomicsElasticity')),
  'projectile-simulator':   lazy(() => import('./tools/academic/ProjectileSimulator')),
  'chemistry-balancer':     lazy(() => import('./tools/academic/ChemistryBalancer')),
  'circuit-designer':       lazy(() => import('./tools/academic/CircuitDesigner')),
  'physics-kinematics':     lazy(() => import('./tools/academic/PhysicsKinematics')),
  'scientific-calculator':  lazy(() => import('./tools/academic/scientificCalc')),
  'derivative-solver':      lazy(() => import('./tools/academic/DerivativeSolver')),

  // PDF
  'pdf-merger-splitter':    lazy(() => import('./tools/pdf/PDFMergeSplit')),
  'pdf-compressor':         lazy(() => import('./tools/pdf/PDFCompressor')),
  'pdf-to-word':            lazy(() => import('./tools/pdf/PDFToWord')),
  'word-to-pdf':            lazy(() => import('./tools/pdf/WordToPDF')),
  'pdf-unlock':             lazy(() => import('./tools/pdf/PDFUnlock')),
  'image-to-pdf':           lazy(() => import('./tools/pdf/ImageToPDF')),

  // Image
  'background-remover':     lazy(() => import('./tools/image/BackgroundRemover')),
  'image-compressor':       lazy(() => import('./tools/image/ImageCompressor')),
  'image-resizer':          lazy(() => import('./tools/image/ImageResizer')),
  'image-editor':           lazy(() => import('./tools/image/ImageEditor')),
  'format-converter':       lazy(() => import('./tools/image/FormatConverter')),
  'screenshot-mockup':      lazy(() => import('./tools/image/ScreenshotMockup')),

  // Financial
  'emi-loan-calculator':    lazy(() => import('./tools/financial/EMILoanCalc')),
  'sip-calculator':         lazy(() => import('./tools/financial/SIPCalculator')),
  'student-budgeting':      lazy(() => import('./tools/financial/StudentBudgeting')),
  'student-loan-repayment': lazy(() => import('./tools/financial/StudentLoanRepayment')),
  'moving-costs':           lazy(() => import('./tools/financial/MovingCosts')),
  'housing-calculator':     lazy(() => import('./tools/financial/HousingCalc')),
  'scholarship-roi':        lazy(() => import('./tools/financial/ScholarshipROICalc')),
  'textbook-resale':        lazy(() => import('./tools/financial/TextbookResale')),
  'salary-tax':             lazy(() => import('./tools/financial/salaryTax')),
  'pomodoro-timer':         lazy(() => import('./tools/financial/PomodoroTimer')),

  // Text
  'word-counter':           lazy(() => import('./tools/text/WordCounter')),
  'case-converter':         lazy(() => import('./tools/text/CaseConverter')),
  'text-formatter':         lazy(() => import('./tools/text/TextFormatter')),
  'grammar-checker':        lazy(() => import('./tools/text/GrammarChecker')),
  'plagiarism-checker':     lazy(() => import('./tools/text/PlagiarismCheck')),

  // Utility
  'age-calculator':         lazy(() => import('./tools/utility/AgeCalculator')),
  'date-difference':        lazy(() => import('./tools/utility/DateDifference')),
  'exam-weighting':         lazy(() => import('./tools/utility/ExamWeighting')),
  'final-grade-calculator': lazy(() => import('./tools/utility/FinalGradeCalc')),
  'assignment-tracker':     lazy(() => import('./tools/utility/AssignmentTracker')),
  'study-planner':          lazy(() => import('./tools/utility/StudyPlanner')),

  // Audio
  'audio-to-text':          lazy(() => import('./tools/audio/AudioToText')),
};
// ───────────────────────────────────────────────────────────────────────────

/** Analytics: track page views on every route change */
const PageViewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
  return null;
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
          <PageViewTracker />
          <CookieConsent isDarkMode={isDarkMode} />

          <Routes>
            {/* ── Home / Dashboard ── */}
            <Route path="/" element={
              <Layout isDarkMode={isDarkMode}>
                <App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              </Layout>
            } />

            {/* ── Category filter view ── */}
            <Route path="/category/:categoryId" element={
              <Layout isDarkMode={isDarkMode}>
                <App isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              </Layout>
            } />

            {/* ── Categories browse page ── */}
            <Route path="/categories" element={
              <Layout isDarkMode={isDarkMode}>
                <Categories isDarkMode={isDarkMode} />
              </Layout>
            } />

            {/* ── Tool routes (primary: /tools/:category/:slug) ── */}
            {tools.map(tool => {
              const Component = TOOL_MAP[tool.slug] || ComingSoon;
              const TrackAndRender = () => {
                useEffect(() => { trackToolVisit(tool.slug); }, []);
                return (
                  <ToolLayout isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} category={tool.category}>
                    <Suspense fallback={<ToolSkeleton />}>
                      <Component isDarkMode={isDarkMode} />
                    </Suspense>
                  </ToolLayout>
                );
              };
              return (
                <Route
                  key={tool.slug}
                  path={`/tools/${tool.category}/${tool.slug}`}
                  element={<TrackAndRender />}
                />
              );
            })}

            {/* ── Tool routes (fallback: /tool/:slug) ── */}
            {tools.map(tool => {
              const Component = TOOL_MAP[tool.slug] || ComingSoon;
              return (
                <Route
                  key={`${tool.slug}-fallback`}
                  path={`/tool/${tool.slug}`}
                  element={
                    <ToolLayout isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} category={tool.category}>
                      <Suspense fallback={<ToolSkeleton />}>
                        <Component isDarkMode={isDarkMode} />
                      </Suspense>
                    </ToolLayout>
                  }
                />
              );
            })}

            {/* ── Static pages ── */}
            <Route path="/about"            element={<Layout isDarkMode={isDarkMode}><About isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/privacy-policy"   element={<Layout isDarkMode={isDarkMode}><PrivacyPolicy isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/terms-of-service" element={<Layout isDarkMode={isDarkMode}><TermsOfService isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/contact"          element={<Layout isDarkMode={isDarkMode}><Contact isDarkMode={isDarkMode} /></Layout>} />
            <Route path="/faq"              element={<Layout isDarkMode={isDarkMode}><FAQ isDarkMode={isDarkMode} /></Layout>} />

            {/* ── Legacy redirects ── */}
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/legal"   element={<Navigate to="/terms-of-service" replace />} />

            {/* ── 404 — custom page (was: redirect to /) ── */}
            <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
          </Routes>
        </Router>
      </PremiumProvider>
    </HelmetProvider>
  );
};

export default AppRouter;