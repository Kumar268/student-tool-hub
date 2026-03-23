import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { tools, categories } from '../data/tools';

/**
 * Categories Page — Phase 1.6 ENHANCED
 * ─────────────────────────────────────────────────
 * Features:
 * - Hero section with statistics
 * - Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
 * - Category cards with emoji icon, name, tool count
 * - Preview of first 4 tool names
 * - "Browse All" button per category
 * - Smooth animations (Framer Motion)
 * - Comprehensive dark mode support
 * - SEO meta tags
 * - Features section highlighting benefits
 * - CTA section
 */
const Categories = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const categoryData = useMemo(() => {
    return categories.map((cat) => {
      const catTools = tools.filter((t) => t.category === cat.id);
      return { ...cat, tools: catTools, count: catTools.length };
    }).filter((c) => c.count > 0);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white'
          : 'bg-gradient-to-br from-white via-blue-50 to-gray-50 text-gray-900'
      }`}
    >
      <Helmet>
        <title>Tool Categories | StudentToolHub</title>
        <meta
          name="description"
          content="Browse 56+ free student tools by category — academic, PDF, image, audio, developer tools and more. No signup required."
        />
        <meta name="keywords" content="tools, categories, calculators, converters, PDF, image, audio" />
      </Helmet>

      {/* Hero Section */}
      <section className={`pt-16 md:pt-24 pb-12 px-4 ${
        isDarkMode ? 'border-b border-gray-800' : 'border-b border-gray-200'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 ${
              isDarkMode
                ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50'
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}
          >
            {tools.length}+ Free Tools Available
          </div>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Browse Tools by Category
          </h1>

          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Find the perfect tool for your needs. Explore {tools.length}+ free utilities organized
            across {categoryData.length} categories, from academic calculators to PDF tools.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {[
              { label: 'Categories', value: categoryData.length },
              { label: 'Total Tools', value: tools.length },
              { label: 'Always Free', value: '100%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`text-2xl md:text-3xl font-bold ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-xs md:text-sm ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryData.map((cat, i) => {
              const previewTools = cat.tools.slice(0, 4);

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`group rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20'
                      : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`text-5xl mb-4 p-4 rounded-xl w-fit ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}
                  >
                    {cat.icon}
                  </div>

                  {/* Category Title & Count */}
                  <h2
                    className={`text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {cat.name}
                  </h2>

                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      isDarkMode
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {cat.count} tool{cat.count !== 1 ? 's' : ''}
                  </div>

                  {/* Tool Preview */}
                  {previewTools.length > 0 && (
                    <div className="mb-6">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Popular Tools
                      </p>
                      <ul className="space-y-2">
                        {previewTools.map((tool, idx) => (
                          <li
                            key={idx}
                            className={`text-sm flex items-start gap-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-blue-500 font-bold mt-0.5">•</span>
                            <span className="truncate">{tool.name}</span>
                          </li>
                        ))}
                      </ul>
                      {cat.count > 4 && (
                        <p
                          className={`text-xs mt-2 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          +{cat.count - 4} more tool{cat.count - 4 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Browse All Button */}
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDarkMode
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${cat.id}`);
                    }}
                  >
                    Browse All
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-16 md:py-24 px-4 ${
          isDarkMode ? 'bg-gray-800/30 border-y border-gray-700' : 'bg-blue-50 border-y border-gray-200'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Why Choose StudentToolHub?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Instant Access',
                description: 'No signup required. All tools work instantly in your browser.',
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'Your data stays on your device. We never track or store your calculations.',
              },
              {
                icon: '📱',
                title: 'Any Device',
                description: 'Works perfectly on desktop, tablet, and mobile devices.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Ready to Get Started?
          </h2>
          <p
            className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Explore any category above or use the search bar to find the exact tool you need.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
            >
              Back to Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className={`px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                isDarkMode
                  ? 'border border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Use Search <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Categories;
