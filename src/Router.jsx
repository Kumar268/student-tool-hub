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
import { pageview, initGA } from './utils/analytics';

// ─── Lazy tool imports ──────────────────────────────────────────────────────
const ComingSoon = lazy(() => import('./tools/ComingSoonTemplate'));

const TOOL_MAP = {
  'age-calculator': lazy(() => import('./tools/utility/AgeCalculator')),
  'age-calculator-health': lazy(() => import('./tools/health/agecalc')),
  'assignment-tracker': lazy(() => import('./tools/utility/AssignmentTracker')),
  'astronomy-calc': lazy(() => import('./tools/niche/AstronomyCalc')),
  'audio-converter': lazy(() => import('./tools/audio/AudioConverter')),
  'background-remover': lazy(() => import('./tools/image/BackgroundRemover')),
  'basic-stats': lazy(() => import('./tools/academic/BasicStats')),
  'binary-converter': lazy(() => import('./tools/niche/BinaryConverter')),
  'biodata-maker': lazy(() => import('./tools/documentmaker/BiodataMaker')),
  'bmi-calorie-calculator': lazy(() => import('./tools/health/BMIAndCalorie')),
  'calculus-solver': lazy(() => import('./tools/academic/CalculusSolver')),
  'carbon-footprint': lazy(() => import('./tools/developer/CarbonFootprint')),
  'case-converter': lazy(() => import('./tools/text/CaseConverter')),
  'chemistry-balancer': lazy(() => import('./tools/academic/ChemistryBalancer')),
  'circuit-designer': lazy(() => import('./tools/academic/CircuitDesigner')),
  'code-formatter': lazy(() => import('./tools/developer/CodeFormatter')),
  'color-picker': lazy(() => import('./tools/developer/ColorPicker')),
  'cover-letter-generator': lazy(() => import('./tools/documentmaker/CoverLetterGenerator')),
  'cover-page': lazy(() => import('./tools/documentmaker/AssignmentCoverPage')),
  'css-minifier': lazy(() => import('./tools/developer/CSSMinifier')),
  'cv-maker': lazy(() => import('./tools/documentmaker/CVMaker')),
  'date-difference': lazy(() => import('./tools/utility/DateDifference')),
  'economics-elasticity': lazy(() => import('./tools/academic/EconomicsElasticity')),
  'emi-loan-calculator': lazy(() => import('./tools/financial/EMILoanCalc')),
  'exam-weighting': lazy(() => import('./tools/utility/ExamWeighting')),
  'final-grade-calc': lazy(() => import('./tools/utility/FinalGradeCalc')),
  'format-converter': lazy(() => import('./tools/image/FormatConverter')),
  'gpa-calculator': lazy(() => import('./tools/academic/GPACalculator')),
  'grammar-checker': lazy(() => import('./tools/text/GrammarChecker')),
  'housing-calc': lazy(() => import('./tools/financial/HousingCalc')),
  'html-previewer': lazy(() => import('./tools/developer/HTMLPreviewer')),
  'image-compressor': lazy(() => import('./tools/image/ImageCompressor')),
  'image-editor': lazy(() => import('./tools/image/ImageEditor')),
  'image-resizer': lazy(() => import('./tools/image/ImageResizer')),
  'image-to-pdf': lazy(() => import('./tools/image/ImageToPDF')),
  'integral-calculator': lazy(() => import('./tools/academic/IntegralCalculator')),
  'internship-letter': lazy(() => import('./tools/documentmaker/InternshipLetter')),
  'job-tracker': lazy(() => import('./tools/documentmaker/JobApplicationTracker')),
  'lab-report': lazy(() => import('./tools/documentmaker/LabReportBuilder')),
  'linkedin-summary': lazy(() => import('./tools/documentmaker/LinkedInSummaryGen')),
  'loan-repayment': lazy(() => import('./tools/financial/StudentLoanRepayment')),
  'matrix-algebra': lazy(() => import('./tools/academic/MatrixAlgebra')),
  'moving-costs': lazy(() => import('./tools/financial/MovingCosts')),
  'music-theory': lazy(() => import('./tools/developer/MusicTheoryCalc')),
  'nutrition-calc': lazy(() => import('./tools/health/NutritionCalc')),
  'nutrition-calculator': lazy(() => import('./tools/health/NutritionCalc')),
  'password-generator': lazy(() => import('./tools/developer/PasswordGenerator')),
  'pdf-compressor': lazy(() => import('./tools/pdf/PDFCompressor')),
  'pdf-merger-splitter': lazy(() => import('./tools/pdf/PDFMergeSplit')),
  'pdf-splitter': lazy(() => import('./tools/pdf/PDFMergeSplit')),
  'pdf-to-word': lazy(() => import('./tools/pdf/PDFToWord')),
  'pdf-unlock': lazy(() => import('./tools/pdf/PDFUnlock')),
  'percentage-calc': lazy(() => import('./tools/utility/PercentageCalc')),
  'plagiarism-check': lazy(() => import('./tools/text/PlagiarismCheck')),
  'pomodoro-timer': lazy(() => import('./tools/financial/PomodoroTimer')),
  'projectile-simulator': lazy(() => import('./tools/academic/ProjectileSimulator')),
  'qr-generator': lazy(() => import('./tools/developer/QRGenerator')),
  'quadratic-solver': lazy(() => import('./tools/academic/QuadraticSolver')),
  'recommendation-letter': lazy(() => import('./tools/documentmaker/RecommendationLetter')),
  'reference-generator': lazy(() => import('./tools/documentmaker/ReferenceGenerator')),
  'research-outline': lazy(() => import('./tools/documentmaker/ResearchPaperOutline')),
  'resume-maker': lazy(() => import('./tools/documentmaker/ResumeMaker')),
  'rsa-demo': lazy(() => import('./tools/developer/RSADemo')),
  'salary-calculator': lazy(() => import('./tools/financial/salaryTax')),
  'scholarship-letter': lazy(() => import('./tools/documentmaker/ScholarshipLatter')),
  'scholarship-roi': lazy(() => import('./tools/financial/ScholarshipROICalc')),
  'scientific-calculator': lazy(() => import('./tools/academic/scientificCalc')),
  'scientific-notation': lazy(() => import('./tools/academic/ScientificNotation')),
  'screenshot-mockup': lazy(() => import('./tools/image/ScreenshotMockup')),
  'sip-calculator': lazy(() => import('./tools/financial/SIPCalculator')),
  'sop-generator': lazy(() => import('./tools/documentmaker/SOPGenerator')),
  'student-budgeting': lazy(() => import('./tools/financial/StudentBudgeting')),
  'study-planner': lazy(() => import('./tools/utility/StudyPlanner')),
  'text-formatter': lazy(() => import('./tools/text/TextFormatter')),
  'textbook-resale': lazy(() => import('./tools/financial/TextbookResale')),
  'truth-table': lazy(() => import('./tools/developer/TruthTableGenerator')),
  'tts-converter': lazy(() => import('./tools/audio/TextToSpeech')),
  'typing-speed-test': lazy(() => import('./tools/niche/TypingSpeedTest')),
  'unit-converter': lazy(() => import('./tools/academic/UnitConverter')),
  'voice-recorder': lazy(() => import('./tools/audio/VoiceRecorder')),
  'word-counter': lazy(() => import('./tools/text/WordCounter')),
  'word-to-pdf': lazy(() => import('./tools/pdf/WordToPDF')),
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
    initGA();
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
                  <ToolLayout
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                  >
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
                    <ToolLayout
                      isDarkMode={isDarkMode}
                      onToggleDarkMode={toggleDarkMode}
                    >
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