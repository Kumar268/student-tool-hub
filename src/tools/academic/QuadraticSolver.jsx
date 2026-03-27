import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const QuadraticSolver = ({ isDarkMode }) => {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [copied, setCopied] = useState(false);

  const solution = useMemo(() => {
    const aNum = parseFloat(a) || 0;
    const bNum = parseFloat(b) || 0;
    const cNum = parseFloat(c) || 0;

    if (aNum === 0) {
      return { error: 'Coefficient "a" cannot be zero (not a quadratic equation)' };
    }

    const discriminant = bNum * bNum - 4 * aNum * cNum;
    const sqrtDiscriminant = Math.sqrt(Math.abs(discriminant));

    let x1, x2, nature;

    if (discriminant > 0) {
      x1 = (-bNum + sqrtDiscriminant) / (2 * aNum);
      x2 = (-bNum - sqrtDiscriminant) / (2 * aNum);
      nature = 'Two Real and Distinct Roots';
    } else if (discriminant === 0) {
      x1 = x2 = -bNum / (2 * aNum);
      nature = 'Two Real and Equal Roots';
    } else {
      const realPart = -bNum / (2 * aNum);
      const imagPart = sqrtDiscriminant / (2 * aNum);
      x1 = `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`;
      x2 = `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
      nature = 'Two Complex Roots';
    }

    return { discriminant, x1, x2, nature, a: aNum, b: bNum, c: cNum };
  }, [a, b, c]);

  const handleReset = () => {
    setA('1');
    setB('-5');
    setC('6');
  };

  const handleCopy = () => {
    const text = solution.error 
      ? solution.error 
      : `x₁ = ${solution.x1}, x₂ = ${solution.x2}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quadratic Equation Solver
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Solve equations of the form ax² + bx + c = 0
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="mb-6">
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Enter Coefficients
          </h2>
          <div className={`text-center text-2xl font-mono mb-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <span className="font-bold">{a || '0'}</span>x² + 
            <span className="font-bold"> {b || '0'}</span>x + 
            <span className="font-bold"> {c || '0'}</span> = 0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Coefficient a (x²)
            </label>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="1"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Coefficient b (x)
            </label>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="-5"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Constant c
            </label>
            <input
              type="number"
              step="any"
              value={c}
              onChange={(e) => setC(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="6"
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calculator size={24} />
            Solution
          </h2>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {solution.error ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {solution.error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Discriminant */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium mb-2">Discriminant (Δ = b² - 4ac)</div>
              <div className={`text-2xl font-bold ${
                solution.discriminant > 0 ? 'text-green-500' : 
                solution.discriminant === 0 ? 'text-yellow-500' : 'text-blue-500'
              }`}>
                Δ = {solution.discriminant.toFixed(4)}
              </div>
              <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {solution.nature}
              </div>
            </div>

            {/* Roots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Root 1 (x₁)
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {typeof solution.x1 === 'number' ? solution.x1.toFixed(4) : solution.x1}
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-purple-900/20 border-purple-700/30' : 'bg-purple-50 border-purple-200'
              }`}>
                <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Root 2 (x₂)
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {typeof solution.x2 === 'number' ? solution.x2.toFixed(4) : solution.x2}
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium mb-2">Quadratic Formula</div>
              <div className={`text-center text-lg font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                x = (-b ± √(b² - 4ac)) / 2a
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          About Quadratic Equations
        </h3>
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            <strong>Discriminant (Δ):</strong> Determines the nature of roots
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Δ &gt; 0: Two real and distinct roots</li>
            <li>Δ = 0: Two real and equal roots (repeated root)</li>
            <li>Δ &lt; 0: Two complex conjugate roots</li>
          </ul>
          <p className="mt-4">
            <strong>Example:</strong> x² - 5x + 6 = 0 has roots x₁ = 3 and x₂ = 2
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default QuadraticSolver;
