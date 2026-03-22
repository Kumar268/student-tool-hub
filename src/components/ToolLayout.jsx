import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Home, Moon, Sun, Share2 } from 'lucide-react';
import RelatedTools from './RelatedTools';
import { ShareButton } from './ResultActions';
import SEO from './SEO';
import { tools } from '../data/tools';

// ─── AD KILL SWITCH ──────────────────────────────────────
const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true' || false;
// ─────────────────────────────────────────────────────────

const ToolLayout = ({ children, isDarkMode, onToggleDarkMode, category = 'utility' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve tool metadata from URL
  const segments = location.pathname.split('/').filter(Boolean);
  const slug = segments[segments.length - 1];
  const tool = tools.find(t => t.slug === slug);

  const formatLabel = (s) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">

        {/* ── SEO: inject tool meta tags + JSON-LD ── */}
        {tool && (
          <SEO
            title={tool.name}
            description={tool.description || `Free ${tool.name} tool for students. Browser-based, no signup required.`}
            keywords={[tool.name, tool.category, ...(tool.tags || [])].join(', ')}
            canonicalPath={location.pathname}
            category={tool.category}
            toolSlug={tool.slug}
          />
        )}

        {/* ── Sticky Nav Bar ── */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400"
              aria-label="Go home"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          {/* Breadcrumb — center */}
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-mono min-w-0 flex-1 justify-center">
            <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors shrink-0">Home</button>
            {segments.map((seg, i) => (
              <React.Fragment key={i}>
                <span className="shrink-0">/</span>
                <span
                  className={`truncate ${i === segments.length - 1 ? 'text-gray-700 dark:text-gray-300 font-semibold' : 'hover:text-blue-500 transition-colors cursor-pointer'}`}
                  onClick={() => i < segments.length - 1 && navigate('/' + segments.slice(0, i + 1).join('/'))}
                >
                  {formatLabel(seg)}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {tool && (
              <ShareButton
                toolName={tool.name}
                isDarkMode={isDarkMode}
                className="hidden sm:inline-flex"
              />
            )}
            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {ADS_ENABLED && (
            <div className="mb-6 text-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-4">
              Advertisement
            </div>
          )}

          {/* Tool content */}
          <div className="w-full">
            {children}
          </div>

          {/* ── Related Tools ── */}
          {tool && (
            <RelatedTools
              currentSlug={tool.slug}
              category={tool.category}
              isDarkMode={isDarkMode}
            />
          )}

          {ADS_ENABLED && (
            <div className="mt-6 text-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-4">
              Advertisement
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ToolLayout;
