import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const ComingSoonTemplate = ({ toolName = 'Tool', isDarkMode }) => {
  return (
    <div className={`min-h-screen pt-24 pb-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="px-4 w-full">
        <div className={`rounded-2xl p-12 text-center ${
            isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-blue-200 shadow-xl'
          }`}
        >
          <div className="inline-block mb-6">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {toolName}
          </h1>

          <p className={`text-xl mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Coming Soon!
          </p>

          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            We're working hard to bring this powerful tool to you. Check back soon for an amazing experience!
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-shadow"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </a>

          <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              📧 Have suggestions? Email us or share feedback on our Discord community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonTemplate;
