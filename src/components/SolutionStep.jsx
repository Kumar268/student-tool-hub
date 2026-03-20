import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

/**
 * SolutionStep Component
 * Renders a vertical timeline step for detailed solutions.
 */
const SolutionStep = ({ stepNumber, title, description, formula, isLast, isDarkMode }) => {
  return (
    <div className="flex group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center mr-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-blue-500 text-blue-400 group-hover:bg-blue-900/30' 
            : 'bg-white border-blue-600 text-blue-600 group-hover:bg-blue-50'
        }`}>
          {stepNumber}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-grow my-1 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700 group-hover:bg-blue-500/50' : 'bg-gray-200 group-hover:bg-blue-300'
          }`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/40 border-gray-700/50 hover:border-blue-500/30' 
              : 'bg-white/40 border-gray-200/50 hover:border-blue-300/50'
          } backdrop-blur-sm`}
        >
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-base mb-4 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>

          {/* Glowing Formula Box */}
          {formula && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 rounded-xl overflow-hidden ${
                isDarkMode
                  ? 'bg-blue-900/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'bg-blue-50/50 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
              }`}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className={`text-center py-2 overflow-x-auto ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <BlockMath math={formula} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionStep;