import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Search, Frown, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { tools, categories } from '../data/tools';

/**
 * Custom 404 Not Found Page — Phase 1.4
 * ─────────────────────────────────────────────────
 * Features:
 * - Engaging 404 design with student-friendly message
 * - Popular tools shortcuts based on analytics
 * - Browse by category section
 * - Back button & home navigation
 * - Dark mode support
 * - SEO-friendly with meta tags
 */
const NotFound = ({ isDarkMode }) => {
  const navigate = useNavigate();

  // Get top 6 most used tools for quick access
  const getPopularTools = () => {
    const popularData = localStorage.getItem('popularSearches');
    if (popularData) {
      try {
        const parsed = JSON.parse(popularData).slice(0, 6);
        return parsed
          .map((item) => tools.find((t) => t.name === item.term))
          .filter(Boolean);
      } catch {
        return tools.slice(0, 6);
      }
    }
    // Fallback to first 6 tools
    return tools.slice(0, 6);
  };

  const popularTools = getPopularTools();

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | StudentToolHub</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore 56+ free tools instead." />
      </Helmet>

      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-950 text-white'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
        }`}
      >
        {/* Main Content */}
        <div className="max-w-2xl w-full">
          {/* 404 Illustration */}
          <div className="text-center mb-8">
            {/* Animated 404 */}
            <div className="relative inline-block mb-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl ${
                  isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'
                }`}
              >
                <Frown size={64} className="text-blue-500 animate-bounce" />
              </div>
              <div
                className="absolute -top-2 -right-2 text-3xl animate-spin"
                style={{ animationDuration: '3s' }}
              >
                📚
              </div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">✏️</div>
            </div>

            <div className={`mb-4 inline-block px-3 py-1 rounded-full text-blue-500 font-mono text-sm font-bold ${
              isDarkMode ? 'bg-blue-900/30' : 'bg-blue-500/10'
            }`}>
              404
            </div>

            <h1
              className={`text-4xl md:text-5xl font-black mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Page Not Found
            </h1>
            <p className="text-lg mb-2 max-w-md leading-relaxed opacity-80">
              Looks like this page didn't make it through the semester.
            </p>
            <p className="text-sm mb-10 opacity-60">
              Maybe the URL has a typo, or this page was moved.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              }`}
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <Home size={18} />
              Back to Home
            </button>
            <Link
              to="/"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold border transition-all ${
                isDarkMode
                  ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                  : 'border-gray-300 hover:bg-white text-gray-700'
              }`}
            >
              <Search size={18} />
              Search Tools
            </Link>
          </div>

          {/* Popular Tools Section */}
          {popularTools.length > 0 && (
            <div
              className={`mb-10 p-6 rounded-2xl border-2 transition-all ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search size={20} className="text-blue-500" />
                Popular Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {popularTools.map((tool) => {
                  const catInfo = categories.find((c) => c.id === tool.category);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => navigate(`/tools/${tool.category}/${tool.slug}`)}
                      className={`p-3 rounded-lg text-left transition-all hover:scale-105 ${
                        isDarkMode
                          ? 'bg-gray-700/60 hover:bg-gray-600'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl flex-shrink-0">
                          {catInfo?.icon || '🔧'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{tool.name}</p>
                          <p
                            className={`text-xs mt-1 line-clamp-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse by Category */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all ${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const count = tools.filter((t) => t.category === cat.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${
                      isDarkMode
                        ? 'bg-gray-700/60 hover:bg-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-xs font-semibold line-clamp-2">{cat.name}</p>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {count} tool{count !== 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <div
            className={`mt-10 p-6 rounded-lg border-l-4 border-blue-500 ${
              isDarkMode
                ? 'bg-blue-900/20'
                : 'bg-blue-50'
            }`}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              💡 What can you do?
            </h3>
            <ul
              className={`text-sm space-y-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <li>✓ Return to the home page and explore available tools</li>
              <li>✓ Use the search bar at the top to find a specific tool</li>
              <li>✓ Browse tools by category using the navigation above</li>
              <li>✓ Check out our popular tools section above</li>
            </ul>
          </div>

          {/* Footer Note */}
          <div
            className={`mt-12 text-center text-sm ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            <p className="mb-2">If you believe this is a mistake, please report it</p>
            <a
              href="https://github.com/Kumar268/student-tool-hub/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-semibold inline-flex items-center gap-1"
            >
              on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
