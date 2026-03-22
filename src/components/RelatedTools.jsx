import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { tools } from '../data/tools';

const CAT_ICONS = {
  academic: '🎓', financial: '💰', utility: '⚙️', niche: '✨',
  image: '🖼️', pdf: '📄', text: '📝', audio: '🎵',
  developer: '💻', documentmaker: '📋', health: '❤️', useful: '🔧',
};

const CAT_COLORS = {
  academic: '#a78bfa', financial: '#34d399', utility: '#60a5fa',
  niche: '#f472b6', image: '#fb923c', pdf: '#facc15',
  text: '#4ade80', audio: '#c084fc', developer: '#22d3ee',
  documentmaker: '#f87171', health: '#86efac', useful: '#fbbf24',
};

/**
 * RelatedTools — shows up to 4 tools from the same category.
 * Add to ToolLayout or individual tool pages.
 * 
 * Props:
 *   currentSlug: string  — slug of the current tool (excluded from results)
 *   category: string     — category to match
 *   isDarkMode: boolean
 */
const RelatedTools = ({ currentSlug, category, isDarkMode }) => {
  const related = useMemo(() =>
    tools
      .filter(t => t.category === category && t.slug !== currentSlug)
      .slice(0, 4),
    [currentSlug, category]
  );

  if (related.length === 0) return null;

  const accent = CAT_COLORS[category] || '#60a5fa';

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={16} style={{ color: accent }} />
        <h3 className={`text-sm font-bold uppercase tracking-widest ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Related Tools
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map(tool => (
          <Link
            key={tool.slug}
            to={`/tools/${tool.category}/${tool.slug}`}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${
              isDarkMode
                ? 'border-gray-800 hover:border-gray-600 bg-gray-900/40 hover:bg-gray-800/60'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
            >
              {CAT_ICONS[tool.category] || '🔧'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {tool.name}
              </p>
              <p className="text-xs opacity-60 truncate">{tool.description}</p>
            </div>
            <ArrowRight
              size={14}
              className="text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTools;
