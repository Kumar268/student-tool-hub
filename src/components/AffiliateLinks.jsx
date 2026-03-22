import React, { useMemo } from 'react';
import { ExternalLink, Book, Briefcase, Edit3, Music, FileText, Cpu } from 'lucide-react';

/**
 * AffiliateLinks — shows contextual affiliate product suggestions based on tool category.
 * 
 * Usage: <AffiliateLinks category="academic" isDarkMode={isDarkMode} />
 * 
 * 🔧 TO CONFIGURE:
 * Replace placeholder hrefs with your actual affiliate URLs from:
 *   - Amazon Associates: affiliate-program.amazon.com
 *   - Canva Affiliates: canva.com/affiliates
 *   - Adobe: adobe.com/affiliates
 */

const AFFILIATE_DATA = {
  academic: [
    {
      title: '📚 Amazon Textbooks',
      description: 'Save up to 90% on textbook rentals',
      href: 'https://www.amazon.com/textbooks?tag=YOUR-AFFILIATE-ID',
      cta: 'Browse Textbooks',
      icon: Book,
    },
    {
      title: '🎓 Coursera Plus',
      description: 'Unlimited access to 7000+ top courses',
      href: 'https://www.coursera.org/?tag=YOUR-AFFILIATE-ID',
      cta: 'Start Learning',
      icon: Briefcase,
    },
  ],
  pdf: [
    {
      title: '📄 Adobe Acrobat',
      description: 'The gold standard for PDF editing',
      href: 'https://www.adobe.com/acrobat.html',
      cta: 'Try Adobe',
      icon: FileText,
    },
  ],
  image: [
    {
      title: '🎨 Canva Pro',
      description: 'Professional design for everyone',
      href: 'https://www.canva.com/pro',
      cta: 'Try Canva',
      icon: Edit3,
    },
  ],
  audio: [
    {
      title: '🎵 Epidemic Sound',
      description: 'Royalty-free music for projects',
      href: 'https://www.epidemicsound.com',
      cta: 'Get Music',
      icon: Music,
    },
  ],
  developer: [
    {
      title: '💻 GitHub Copilot',
      description: 'AI pair programmer for students',
      href: 'https://github.com/features/copilot',
      cta: 'Get Copilot',
      icon: Cpu,
    },
  ],
};

const AffiliateLinks = ({ category = 'academic', isDarkMode }) => {
  const links = useMemo(() => AFFILIATE_DATA[category] || AFFILIATE_DATA.academic, [category]);

  return (
    <div className="space-y-3">
      <p className={`text-xs font-semibold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Recommended Resources
      </p>
      {links.map((link, i) => {
        const Icon = link.icon;
        return (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
              isDarkMode
                ? 'bg-gray-800/40 border-gray-700/50 hover:border-blue-500/40'
                : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{link.title}</p>
              <p className="text-xs opacity-60 truncate">{link.description}</p>
            </div>
            <span className="text-blue-500 text-xs font-bold flex items-center gap-1 shrink-0">
              {link.cta} <ExternalLink size={10} />
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default AffiliateLinks;
