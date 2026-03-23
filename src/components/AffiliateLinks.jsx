import React, { useMemo } from 'react';
import { ExternalLink, Book, Briefcase, Edit3, Music, FileText, Cpu } from 'lucide-react';

/**
 * AffiliateLinks — shows contextual affiliate product suggestions.
 * 
 * Configured via .env:
 * - VITE_AFFILIATE_ENABLED (boolean)
 * - VITE_AMAZON_TAG
 * - VITE_COURSERA_TAG
 */

const AFFILIATE_DATA = {
  academic: [
    {
      title: '📚 Amazon Textbooks',
      description: 'Save up to 90% on textbook rentals',
      baseUrl: 'https://www.amazon.com/textbooks',
      tagParam: 'tag',
      envKey: 'VITE_AMAZON_TAG',
      cta: 'Browse Textbooks',
      icon: Book,
    },
    {
      title: '🎓 Coursera Plus',
      description: 'Unlimited access to 7000+ top courses',
      baseUrl: 'https://www.coursera.org/',
      tagParam: 'tag',
      envKey: 'VITE_COURSERA_TAG',
      cta: 'Start Learning',
      icon: Briefcase,
    },
  ],
  pdf: [
    {
      title: '📄 Adobe Acrobat',
      description: 'The gold standard for PDF editing',
      baseUrl: 'https://www.adobe.com/acrobat.html',
      cta: 'Try Adobe',
      icon: FileText,
    },
  ],
  image: [
    {
      title: '🎨 Canva Pro',
      description: 'Professional design for everyone',
      baseUrl: 'https://www.canva.com/pro',
      cta: 'Try Canva',
      icon: Edit3,
    },
  ],
  audio: [
    {
      title: '🎵 Epidemic Sound',
      description: 'Royalty-free music for projects',
      baseUrl: 'https://www.epidemicsound.com',
      cta: 'Get Music',
      icon: Music,
    },
  ],
  developer: [
    {
      title: '💻 GitHub Copilot',
      description: 'AI pair programmer for students',
      baseUrl: 'https://github.com/features/copilot',
      cta: 'Get Copilot',
      icon: Cpu,
    },
  ],
};

const AffiliateLinks = ({ category = 'academic', isDarkMode }) => {
  const isEnabled = import.meta.env.VITE_AFFILIATE_ENABLED === 'true';

  const links = useMemo(() => {
    const rawLinks = AFFILIATE_DATA[category] || AFFILIATE_DATA.academic;
    
    return rawLinks.map(link => {
      let finalHref = link.baseUrl;
      
      // Inject affiliate tags if configured
      if (link.envKey && link.tagParam) {
        const tag = import.meta.env[link.envKey];
        if (tag && !tag.includes('YOUR-')) {
          const separator = finalHref.includes('?') ? '&' : '?';
          finalHref = `${finalHref}${separator}${link.tagParam}=${tag}`;
        }
      }
      
      return { ...link, href: finalHref };
    });
  }, [category]);

  if (!isEnabled) return null;

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
