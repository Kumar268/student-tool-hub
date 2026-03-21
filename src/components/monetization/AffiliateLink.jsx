import React from 'react';
import { ExternalLink, ShoppingBag, BookOpen, Monitor } from 'lucide-react';
import { usePremium } from '../../contexts/PremiumContext';

const AffiliateLink = ({ 
  url = "#", 
  title = "Partner Offer", 
  description = "Check out this recommended resource",
  category = "general" 
}) => {
  const { isPremium } = usePremium();

  if (isPremium) return null;

  const getIcon = () => {
    switch(category) {
      case 'textbook': return <BookOpen size={24} className="text-amber-500" />;
      case 'software': return <Monitor size={24} className="text-blue-500" />;
      default: return <ShoppingBag size={24} className="text-indigo-500" />;
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-gray-900 hover:shadow-md transition-shadow group relative overflow-hidden">
        
        {/* Subtle hover effect background */}
        <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{title}</h4>
            <span className="text-[9px] uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-mono">Sponsored</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
        </div>

        <div className="flex-shrink-0 text-indigo-500 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all">
          <ExternalLink size={20} />
        </div>
      </div>
    </a>
  );
};

export default AffiliateLink;
