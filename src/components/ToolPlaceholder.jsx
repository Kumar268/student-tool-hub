import React from 'react';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

const ToolPlaceholder = ({ isDarkMode }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col items-center justify-center p-12 rounded-2xl border backdrop-blur-sm ${isDarkMode
                        ? 'bg-gray-800/50 border-gray-700/50'
                        : 'bg-white/50 border-gray-200/50'
                    }`}
            >
                <Construction size={64} className={`mb-6 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Coming Soon
                </h2>
                <p className={`max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This tool is currently under development or temporarily unavailable.
                    Please check back later!
                </p>
            </motion.div>
        </div>
    );
};

export default ToolPlaceholder;
