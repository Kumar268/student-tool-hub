import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation }             from 'react-router-dom';
import { ArrowLeft, Home, Moon, Sun }           from 'lucide-react';
import RelatedTools                              from './RelatedTools';
import { ShareButton }                           from './ResultActions';
import SEO                                       from './SEO';
import { tools }                                 from '../data/tools';
import AdSlot                                    from './AdSlot';

/*
 * ToolLayout — every tool page gets this exact structure:
 *
 *  ┌──────────────────────────────────┐
 *  │  Sticky Nav                      │
 *  ├──────────────────────────────────┤
 *  │  [TOP BANNER AD]                 │  ← visible on load
 *  ├──────────────────────────────────┤
 *  │                                  │
 *  │  Tool Content (custom title etc) │
 *  │                                  │
 *  ├──────────────────────────────────┤
 *  │  [MIDDLE DISPLAY AD]             │  ← after tool content
 *  ├──────────────────────────────────┤
 *  │  Related Tools                   │
 *  ├──────────────────────────────────┤
 *  │  [BOTTOM BANNER AD]              │  ← after they finish
 *  └──────────────────────────────────┘
 *
 * The middle ad sits BELOW the tool output, ABOVE related tools.
 * This is the natural "I just got my result" moment — highest intent.
 *
 * All 81 tool files stay untouched. No per-tool editing needed.
 */

const ToolLayout = ({ children, isDarkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);
  const slug     = segments[segments.length - 1];
  const tool     = tools.find(t => t.slug === slug);

  const formatLabel = (s) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">

        {/* SEO */}
        {tool && (
          <SEO
            title={tool.name}
            description={
              tool.description ||
              `Free ${tool.name} tool for students. Browser-based, no signup required.`
            }
            keywords={[tool.name, tool.category, ...(tool.tags || [])].join(', ')}
            canonicalPath={location.pathname}
            category={tool.category}
            toolSlug={tool.slug}
          />
        )}

        {/* ── Sticky Nav ── */}
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

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-mono min-w-0 flex-1 justify-center">
            <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors shrink-0">
              Home
            </button>
            {segments.map((seg, i) => (
              <React.Fragment key={i}>
                <span className="shrink-0">/</span>
                <span
                  className={`truncate ${
                    i === segments.length - 1
                      ? 'text-gray-700 dark:text-gray-300 font-semibold'
                      : 'hover:text-blue-500 transition-colors cursor-pointer'
                  }`}
                  onClick={() =>
                    i < segments.length - 1 &&
                    navigate('/' + segments.slice(0, i + 1).join('/'))
                  }
                >
                  {formatLabel(seg)}
                </span>
              </React.Fragment>
            ))}
          </div>

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
              {isDarkMode
                ? <Sun  size={18} className="text-yellow-400" />
                : <Moon size={18} className="text-gray-600"   />}
            </button>
          </div>
        </nav>

        {/* ── Page body ── */}
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ①  TOP BANNER — visible the moment the page loads */}
            <AdSlot type="banner" position="top" />

            {/* ── Tool content — all custom titles and styles preserved ── */}
            <article className="w-full bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 min-h-[400px]">
              {children}
            </article>

            {/* ②  MIDDLE DISPLAY — after tool content, before related tools.
                  This is the "I just got my result" moment — highest ad intent. */}
            <AdSlot type="display" position="middle" />

            {/* Related tools */}
            {tool && (
              <RelatedTools
                currentSlug={tool.slug}
                category={tool.category}
                isDarkMode={isDarkMode}
              />
            )}

            {/* ③  BOTTOM BANNER — after they finish, before leaving */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <AdSlot type="banner" position="bottom" />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
};

export default ToolLayout;