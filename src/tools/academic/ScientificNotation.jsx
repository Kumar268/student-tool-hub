import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Calculator, ArrowRight, BookOpen, Atom, Copy, Check, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SolutionStep from '../../components/SolutionStep';
import { BlockMath, InlineMath } from 'react-katex';

const ScientificNotation = ({ isDarkMode = true }) => {
  const [input, setInput] = useState('123456');
  const [showSteps, setShowSteps] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [precision, setPrecision] = useState(4);
  
  // Refs
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  
  // Accessibility
  const shouldReduceMotion = useReducedMotion();

  // Parse and validate input
  const parseInput = useCallback((val) => {
    if (val === '' || val === '-') return { num: NaN, error: null };
    const num = parseFloat(val);
    if (isNaN(num)) return { num: NaN, error: 'Please enter a valid number' };
    if (!isFinite(num)) return { num: NaN, error: 'Number is too large or too small' };
    return { num, error: null };
  }, []);

  // Format number with proper decimal places
  const formatNumber = useCallback((num, digits) => {
    if (isNaN(num)) return '0';
    return num.toFixed(digits).replace(/\.?0+$/, '');
  }, []);

  // Calculate scientific notation
  const result = useMemo(() => {
    const { num, error: parseError } = parseInput(input);
    
    if (parseError) {
      setError(parseError);
      return {
        coefficient: 0,
        exponent: 0,
        formatted: '0 \\times 10^{0}',
        decimalMoves: 0,
        direction: 'none'
      };
    }

    setError(null);

    // Handle zero case
    if (num === 0) {
      return {
        coefficient: 0,
        exponent: 0,
        formatted: '0 \\times 10^{0}',
        decimalMoves: 0,
        direction: 'none'
      };
    }

    const absNum = Math.abs(num);
    const sign = num < 0 ? -1 : 1;
    
    // Calculate exponent and coefficient
    const exponent = Math.floor(Math.log10(absNum));
    const coefficient = (num / Math.pow(10, exponent)).toFixed(precision);
    
    // Determine decimal movement direction
    const decimalMoves = Math.abs(exponent);
    const direction = exponent > 0 ? 'left' : exponent < 0 ? 'right' : 'none';

    return {
      coefficient: formatNumber(parseFloat(coefficient), precision),
      exponent,
      formatted: `${coefficient} \\times 10^{${exponent}}`,
      originalNum: num,
      absNum,
      sign,
      decimalMoves,
      direction
    };
  }, [input, precision, parseInput, formatNumber]);

  // Handle copy to clipboard
  const handleCopy = useCallback(() => {
    if (result.formatted) {
      navigator.clipboard.writeText(result.formatted.replace(/\\/g, '')).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result.formatted]);

  // Handle precision change
  const handlePrecisionChange = useCallback((e) => {
    setPrecision(parseInt(e.target.value));
  }, []);

  // Quick example buttons
  const examples = [
    { label: 'Large', value: '123456789' },
    { label: 'Small', value: '0.000123' },
    { label: 'Mass', value: '5980000000000000000000000' },
    { label: 'Atom', value: '0.0000000001' },
    { label: 'Light', value: '299792458' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      
      <div className={`ad-slot w-full min-h-[90px] sm:min-h-[100px] 
        ${isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-gray-100/80 border-gray-300/50'} 
        border border-dashed rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm 
        flex items-center justify-center backdrop-blur-sm`}>
        <span className="px-4 py-2">📢 Advertisement (Top)</span>
      </div>

      {/* Main Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 sm:p-6 lg:p-8 rounded-2xl border ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/50 backdrop-blur-md' 
            : 'bg-white/40 border-gray-200/50 backdrop-blur-md'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <Atom size={24} />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Scientific Notation Converter
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Convert between standard and scientific notation instantly
            </p>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Standard Number
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Precision:
                </span>
                <select
                  value={precision}
                  onChange={handlePrecisionChange}
                  className={`text-xs px-2 py-1 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-300' 
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {[2, 3, 4, 5, 6].map(p => (
                    <option key={p} value={p}>{p} decimals</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full px-4 py-4 rounded-xl border outline-none transition-all font-mono text-lg ${
                  error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : isDarkMode
                      ? 'bg-gray-900/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      : 'bg-white/50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder="Enter any number..."
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 text-xs text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2 mt-4">
              {examples.map((ex) => (
                <motion.button
                  key={ex.label}
                  whileHover={!shouldReduceMotion ? { scale: 1.02 } : {}}
                  whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
                  onClick={() => setInput(ex.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                    isDarkMode 
                      ? 'border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400' 
                      : 'border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600'
                  }`}
                >
                  {ex.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Scientific Notation
              </label>
              <motion.button
                onClick={handleCopy}
                whileHover={!shouldReduceMotion ? { scale: 1.02 } : {}}
                whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-blue-500 text-gray-400 hover:text-blue-400' 
                    : 'border-gray-200 hover:border-blue-500 text-gray-600 hover:text-blue-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            </div>

            <motion.div
              ref={resultRef}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`w-full px-4 py-6 rounded-xl border font-bold text-xl flex items-center justify-center min-h-[80px] ${
                isDarkMode 
                  ? 'bg-blue-900/20 border-blue-700/30 text-blue-400' 
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              <BlockMath math={result.formatted} />
            </motion.div>

            {/* Additional Info */}
            <div className={`grid grid-cols-2 gap-3 mt-4`}>
              <div className={`p-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Coefficient</p>
                <p className={`text-lg font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {result.coefficient}
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Exponent</p>
                <p className={`text-lg font-mono font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {result.exponent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Steps Button */}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className={`mt-6 flex items-center gap-2 text-sm ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
          }`}
        >
          <Info size={16} />
          {showSteps ? 'Hide' : 'Show'} step-by-step solution
        </button>
      </motion.div>

      {/* Solution Steps */}
      <AnimatePresence>
        {showSteps && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-800/40 border-gray-700/50 backdrop-blur-md' 
                : 'bg-white/40 border-gray-200/50 backdrop-blur-md'
            }`}
          >
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  <Zap size={24} />
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step-by-Step Conversion
                </h2>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <SolutionStep
                  stepNumber={1}
                  title="Locate the Decimal Point"
                  description={
                    <>
                      In the original number <InlineMath math={input} />, we locate the decimal point.
                      {!input.includes('.') && " If it's not shown, it's at the end."}
                    </>
                  }
                  isDarkMode={isDarkMode}
                />

                {/* Step 2 */}
                <SolutionStep
                  stepNumber={2}
                  title="Determine the Exponent"
                  description={
                    <>
                      Move the decimal point until there is only one non-zero digit to its left.
                      We count the steps moved: {result.decimalMoves} places{' '}
                      {result.direction === 'left' ? 'left (positive exponent)' : 
                       result.direction === 'right' ? 'right (negative exponent)' : 
                       ' (no movement)'}.
                    </>
                  }
                  formula={`n = ${result.exponent}`}
                  isDarkMode={isDarkMode}
                />

                {/* Step 3 */}
                <SolutionStep
                  stepNumber={3}
                  title="Write in Standard Form"
                  description="The final result is written as a coefficient multiplied by 10 raised to the power of the exponent."
                  formula={`a \\times 10^n = ${result.coefficient} \\times 10^{${result.exponent}}`}
                  isLast={true}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Additional Explanation */}
              <div className={`mt-6 p-4 rounded-xl border ${
                isDarkMode ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Why This Works
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Scientific notation is based on powers of ten. Moving the decimal point left increases the exponent,
                  while moving it right decreases the exponent. The coefficient always stays between 1 and 10,
                  making numbers easier to compare and calculate.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Article */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className={`p-6 lg:p-8 rounded-2xl border ${
          isDarkMode 
            ? 'bg-gray-800/40 border-gray-700/50 backdrop-blur-md' 
            : 'bg-white/40 border-gray-200/50 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <BookOpen size={24} />
          </div>
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Mastering Scientific Notation: A Complete Guide
          </h2>
        </div>

        <div className={`space-y-6 text-sm sm:text-base ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <p className="leading-relaxed">
            Scientific notation is a powerful way to express very large or very small numbers in a compact form.
            It's essential in science, engineering, and mathematics, where values can range from the microscopic
            to the astronomical.
          </p>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            The Structure: a × 10ⁿ
          </h3>
          
          <p className="leading-relaxed">
            Every number in scientific notation follows the same pattern:
          </p>
          
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Coefficient (a):</strong> Must be between 1 and 10 (including 1, excluding 10)</li>
            <li><strong>Base:</strong> Always 10</li>
            <li><strong>Exponent (n):</strong> Integer that tells how many places to move the decimal</li>
          </ul>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Positive vs. Negative Exponents
          </h3>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Positive exponent (n &gt; 0):</strong> Numbers greater than 1 (e.g., 1,200,000 = 1.2 × 10⁶)</li>
            <li><strong>Negative exponent (n &lt; 0):</strong> Numbers less than 1 (e.g., 0.00045 = 4.5 × 10⁻⁴)</li>
            <li><strong>Zero exponent (n = 0):</strong> Numbers between 1 and 10 (e.g., 5.5 = 5.5 × 10⁰)</li>
          </ul>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Real-World Examples
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: 'Astronomy',
                items: [
                  { desc: 'Distance to Sun', value: '1.496 × 10¹¹ m' },
                  { desc: 'Light year', value: '9.461 × 10¹⁵ m' },
                ]
              },
              {
                title: 'Chemistry',
                items: [
                  { desc: 'Avogadro\'s number', value: '6.022 × 10²³' },
                  { desc: 'Electron mass', value: '9.109 × 10⁻³¹ kg' },
                ]
              },
              {
                title: 'Physics',
                items: [
                  { desc: 'Speed of light', value: '2.998 × 10⁸ m/s' },
                  { desc: 'Planck\'s constant', value: '6.626 × 10⁻³⁴ J·s' },
                ]
              },
              {
                title: 'Biology',
                items: [
                  { desc: 'Cell diameter', value: '1 × 10⁻⁵ m' },
                  { desc: 'DNA base pairs', value: '3 × 10⁹' },
                ]
              },
            ].map((category, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-bold mb-2">{category.title}</h4>
                <ul className="space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-xs">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.desc}:</span>{' '}
                      <code className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.value}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Significant Figures Made Clear
          </h3>
          
          <p>
            One of the biggest advantages of scientific notation is how it handles significant figures. 
            In a number like 1,200, it's unclear if the zeros are significant. But in scientific notation:
          </p>
          
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><InlineMath math="1.2 \times 10^3" /> → 2 significant figures</li>
            <li><InlineMath math="1.20 \times 10^3" /> → 3 significant figures</li>
            <li><InlineMath math="1.200 \times 10^3" /> → 4 significant figures</li>
          </ul>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Common Mistakes to Avoid
          </h3>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wrong coefficient range:</strong> Coefficient must be between 1 and 10 (e.g., 12 × 10³ should be 1.2 × 10⁴)</li>
            <li><strong>Miscounting decimal moves:</strong> Each place moved changes the exponent by ±1</li>
            <li><strong>Forgetting the sign:</strong> Small numbers need negative exponents</li>
          </ul>

          <h3 className={`text-lg sm:text-xl font-bold mt-6 mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4 mt-4">
            {[
              {
                q: 'What is scientific notation used for?',
                a: 'It\'s used to write extremely large or small numbers compactly, making them easier to read, compare, and calculate in science and engineering.'
              },
              {
                q: 'How do I convert a number to scientific notation?',
                a: 'Move the decimal point until there\'s one non-zero digit to its left. The number of moves becomes the exponent (positive if moved left, negative if moved right).'
              },
              {
                q: 'What if my number is already between 1 and 10?',
                a: 'Then the exponent is zero. For example, 5.5 becomes 5.5 × 10⁰.'
              },
              {
                q: 'What\'s the difference between scientific and engineering notation?',
                a: 'Engineering notation restricts exponents to multiples of 3 (10³, 10⁶, 10⁻⁶), which matches metric prefixes like kilo, mega, and micro.'
              },
            ].map((faq, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.article>

      <div className={`ad-slot w-full min-h-[90px] sm:min-h-[100px] 
        ${isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-gray-100/80 border-gray-300/50'} 
        border border-dashed rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm 
        flex items-center justify-center backdrop-blur-sm`}>
        <span className="px-4 py-2">📢 Advertisement (Bottom)</span>
      </div>
    </div>
  );
};

export default ScientificNotation;