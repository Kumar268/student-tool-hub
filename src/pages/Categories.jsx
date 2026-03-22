import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  GraduationCap, DollarSign, Settings, Sparkles, Heart, 
  Image, FileText, Type, Music, Code, FileSignature, Wrench,
  ArrowRight, ChevronRight
} from 'lucide-react';
import { tools, categories } from '../data/tools';

const ICON_MAP = {
  GraduationCap, DollarSign, Settings, Sparkles, Heart,
  Image, FileText, Type, Music, Code, FileSignature, Wrench,
};

const COLOR_MAP = {
  blue:    'bg-blue-500/10 text-blue-500 border-blue-500/20',
  green:   'bg-green-500/10 text-green-500 border-green-500/20',
  orange:  'bg-orange-500/10 text-orange-500 border-orange-500/20',
  purple:  'bg-purple-500/10 text-purple-500 border-purple-500/20',
  rose:    'bg-rose-500/10 text-rose-500 border-rose-500/20',
  pink:    'bg-pink-500/10 text-pink-500 border-pink-500/20',
  red:     'bg-red-500/10 text-red-500 border-red-500/20',
  yellow:  'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  cyan:    'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  indigo:  'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  teal:    'bg-teal-500/10 text-teal-500 border-teal-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const Categories = ({ isDarkMode }) => {
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const catTools = tools.filter(t => t.category === cat.id);
      return { ...cat, tools: catTools, count: catTools.length };
    }).filter(c => c.count > 0);
  }, []);

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <Helmet>
        <title>All Tool Categories | Student Tool Hub</title>
        <meta name="description" content="Browse all student tools by category — academic, PDF, image, audio, developer tools and more." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold mb-4">
            {tools.length}+ Free Tools
          </div>
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Browse by Category
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-70">
            Every tool runs in your browser. No signup, no uploads to our servers, completely free.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoryData.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || Settings;
            const colorClass = COLOR_MAP[cat.color] || COLOR_MAP.blue;
            const previewTools = cat.tools.slice(0, 4);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border p-6 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-900/40 border-gray-800 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cat.name}
                    </h2>
                    <p className="text-xs opacity-60">{cat.count} tool{cat.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Preview tools list */}
                <ul className="space-y-1 mb-4">
                  {previewTools.map(tool => (
                    <li key={tool.slug}>
                      <Link
                        to={`/tools/${tool.category}/${tool.slug}`}
                        className="flex items-center gap-2 text-sm py-1 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={e => e.stopPropagation()}
                      >
                        <ChevronRight size={12} className="shrink-0" />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    </li>
                  ))}
                  {cat.count > 4 && (
                    <li className="text-xs opacity-40 pl-5">
                      +{cat.count - 4} more…
                    </li>
                  )}
                </ul>

                {/* View all link */}
                <Link
                  to={`/category/${cat.id}`}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${colorClass.split(' ')[1]}`}
                >
                  View all {cat.name} <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
