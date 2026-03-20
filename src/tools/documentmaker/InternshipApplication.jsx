import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const InternshipApplication = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <Settings size={32} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Under Construction</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          This tool is currently being built. Please check back later!
        </p>
      </motion.div>
    </div>
  );
};

export default InternshipApplication;
