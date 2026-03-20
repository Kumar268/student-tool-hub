import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calculator, ArrowRight, BookOpen, Percent, Sparkles, 
  Zap, Brain, Atom, Orbit, Infinity, Target, Gauge,
  TrendingUp, TrendingDown, PieChart, BarChart, Activity,
  RefreshCw, Copy, Download, Share2, Star, Award,
  Clock, Hash, Type, Layers, Grid, Filter, Settings,
  Eye, EyeOff, Moon, Sun, Volume2, VolumeX, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Quantum Styles
const QUANTUM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

/* Quantum Animations */
@keyframes quantum-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes quantum-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes quantum-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes quantum-wave {
  0% { transform: translateX(-100%) scale(1); opacity: 0; }
  50% { transform: translateX(0) scale(1.2); opacity: 0.8; }
  100% { transform: translateX(100%) scale(1); opacity: 0; }
}

@keyframes quantum-glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(139,92,246,0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(236,72,153,0.8)); }
}

@keyframes quantum-ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}

@keyframes quantum-glitch {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-2px, 2px); filter: hue-rotate(45deg); }
  40% { transform: translate(-2px, -2px); filter: hue-rotate(90deg); }
  60% { transform: translate(2px, 2px); filter: hue-rotate(180deg); }
  80% { transform: translate(2px, -2px); filter: hue-rotate(270deg); }
  100% { transform: translate(0); filter: hue-rotate(360deg); }
}

@keyframes quantum-count {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Quantum Classes */
.quantum-float {
  animation: quantum-float 6s ease-in-out infinite;
}

.quantum-pulse {
  animation: quantum-pulse 2s ease-in-out infinite;
}

.quantum-spin {
  animation: quantum-spin 10s linear infinite;
}

.quantum-glow {
  animation: quantum-glow 3s ease-in-out infinite;
}

.quantum-glitch:hover {
  animation: quantum-glitch 0.5s ease-in-out;
}

/* Quantum Grid */
.quantum-grid {
  background-image: 
    linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  position: relative;
}

/* Quantum Card */
.quantum-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.quantum-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1));
  opacity: 0;
  transition: opacity 0.3s;
}

.quantum-card:hover::before {
  opacity: 1;
}

.quantum-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(139,92,246,0.2);
}

/* Quantum Button */
.quantum-button {
  position: relative;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 30px;
  color: white;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.quantum-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.quantum-button:hover::before {
  width: 300px;
  height: 300px;
}

.quantum-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(139,92,246,0.5);
}

.quantum-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Quantum Input */
.quantum-input {
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid rgba(139,92,246,0.2);
  border-radius: 30px;
  padding: 12px 20px;
  color: white;
  font-family: 'Fira Code', monospace;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
  width: 100%;
}

.quantum-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139,92,246,0.3);
}

.quantum-input::placeholder {
  color: rgba(255,255,255,0.3);
}

/* Quantum Badge */
.quantum-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(139,92,246,0.15);
  border: 1px solid rgba(139,92,246,0.3);
  border-radius: 30px;
  font-size: 13px;
  color: white;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.quantum-badge:hover {
  background: rgba(139,92,246,0.25);
  border-color: rgba(139,92,246,0.5);
  transform: translateY(-2px);
}

/* Quantum Result Card */
.quantum-result {
  background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2));
  border: 2px solid rgba(139,92,246,0.3);
  border-radius: 30px;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.quantum-result::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  animation: quantum-wave 6s linear infinite;
}

/* Quantum Progress Bar */
.quantum-progress {
  height: 8px;
  background: rgba(139,92,246,0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.quantum-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 4px;
  position: relative;
  animation: quantum-pulse 2s ease-in-out infinite;
}

/* Quantum Timeline */
.quantum-timeline {
  position: relative;
  padding-left: 30px;
}

.quantum-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #8b5cf6, #ec4899);
}

.quantum-timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.quantum-timeline-item::before {
  content: '';
  position: absolute;
  left: -34px;
  top: 0;
  width: 10px;
  height: 10px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 20px #8b5cf6;
}

/* Quantum Step */
.quantum-step {
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background: rgba(139,92,246,0.1);
  border: 1px solid rgba(139,92,246,0.2);
  transition: all 0.3s;
}

.quantum-step:hover {
  background: rgba(139,92,246,0.15);
  transform: translateX(10px);
}

.quantum-step-number {
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 0 20px rgba(139,92,246,0.5);
}

/* Quantum Chart */
.quantum-chart {
  position: relative;
  width: 100%;
  height: 200px;
  margin: 20px 0;
}

.quantum-chart-bar {
  position: absolute;
  bottom: 0;
  width: 40px;
  background: linear-gradient(180deg, #8b5cf6, #ec4899);
  border-radius: 10px 10px 0 0;
  transition: height 0.5s ease-out;
}

/* Quantum Particle */
.quantum-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 10px #8b5cf6;
  animation: quantum-ripple 3s ease-out infinite;
}
`;

// Particle Background Component
const QuantumParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="quantum-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Mode configurations
const MODES = {
  find_percent: {
    id: 'find_percent',
    label: 'What is % of X in Y?',
    icon: <Percent className="w-5 h-5" />,
    description: 'Find what percentage one number is of another',
    formula: '\\frac{\\text{Part}}{\\text{Whole}} \\times 100\\%',
    example: 'What percentage is 25 of 200? Answer: 12.5%',
    color: '#8b5cf6'
  },
  find_value: {
    id: 'find_value',
    label: 'What is X% of Y?',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Find the value given a percentage of a number',
    formula: '\\frac{\\text{Percentage}}{100} \\times \\text{Whole}',
    example: 'What is 15% of 200? Answer: 30',
    color: '#ec4899'
  },
  find_change: {
    id: 'find_change',
    label: '% Increase/Decrease',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Calculate the percentage change between two values',
    formula: '\\frac{\\text{Final} - \\text{Initial}}{\\text{Initial}} \\times 100\\%',
    example: 'What is the percentage increase from 100 to 150? Answer: 50%',
    color: '#f59e0b'
  },
  find_compound: {
    id: 'find_compound',
    label: 'Compound %',
    icon: <Infinity className="w-5 h-5" />,
    description: 'Calculate compound percentage changes',
    formula: '\\left(1 + \\frac{r}{100}\\right)^n \\times P',
    example: '20% increase followed by 30% increase = 56% total',
    color: '#10b981'
  },
  find_ratio: {
    id: 'find_ratio',
    label: 'Percentage Ratio',
    icon: <Target className="w-5 h-5" />,
    description: 'Find the ratio between two percentages',
    formula: '\\frac{\\text{Part}_1}{\\text{Whole}_1} : \\frac{\\text{Part}_2}{\\text{Whole}_2}',
    example: 'Compare 20% of 100 with 15% of 200',
    color: '#06b6d4'
  }
};

// Main Component
const QuantumPercentageSynthesizer = ({ isDarkMode: initialDarkMode = true }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [mode, setMode] = useState('find_percent');
  const [val1, setVal1] = useState('25');
  const [val2, setVal2] = useState('200');
  const [val3, setVal3] = useState('3');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSteps, setShowSteps] = useState(true);
  const [showVisualization, setShowVisualization] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(0);
  
  const canvasRef = useRef(null);

  // Calculate energy level based on input complexity
  useEffect(() => {
    const complexity = (val1.length + val2.length + val3.length) / 10;
    setEnergyLevel(Math.min(100, complexity * 20));
  }, [val1, val2, val3]);

  // Calculation logic
  const calculation = useMemo(() => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    const v3 = parseFloat(val3) || 0;
    
    setIsProcessing(true);
    
    setTimeout(() => setIsProcessing(false), 300);

    switch(mode) {
      case 'find_percent': {
        const res = (v1 / v2) * 100;
        const absValue = (v1 / v2) * v2;
        return {
          result: res.toFixed(2),
          value: absValue.toFixed(2),
          formula: `\\text{Percentage} = \\left( \\frac{${v1}}{${v2}} \\right) \\times 100 = ${res.toFixed(2)}\\%`,
          steps: [
            `Step 1: Identify the part (${v1}) and the whole (${v2})`,
            `Step 2: Divide the part by the whole: ${v1} ÷ ${v2} = ${(v1/v2).toFixed(4)}`,
            `Step 3: Multiply by 100 to get percentage: ${(v1/v2).toFixed(4)} × 100 = ${res.toFixed(2)}%`,
            `Step 4: The absolute value is ${absValue.toFixed(2)}`
          ],
          interpretation: `${v1} is ${res.toFixed(2)}% of ${v2}`,
          visualization: (v1 / v2) * 100
        };
      }
      
      case 'find_value': {
        const res = (v1 / 100) * v2;
        return {
          result: res.toFixed(2),
          formula: `\\text{Value} = \\left( \\frac{${v1}}{100} \\right) \\times ${v2} = ${res.toFixed(2)}`,
          steps: [
            `Step 1: Convert percentage to decimal: ${v1}% = ${v1} ÷ 100 = ${(v1/100).toFixed(3)}`,
            `Step 2: Multiply by the whole: ${(v1/100).toFixed(3)} × ${v2} = ${res.toFixed(2)}`,
            `Step 3: ${v1}% of ${v2} is ${res.toFixed(2)}`
          ],
          interpretation: `${v1}% of ${v2} is ${res.toFixed(2)}`,
          visualization: (v1 / 100) * 100
        };
      }
      
      case 'find_change': {
        const res = ((v2 - v1) / v1) * 100;
        const isIncrease = res >= 0;
        return {
          result: res.toFixed(2),
          formula: `\\text{Change} = \\left( \\frac{${v2} - ${v1}}{${v1}} \\right) \\times 100 = ${res.toFixed(2)}\\%`,
          steps: [
            `Step 1: Find the difference: ${v2} - ${v1} = ${(v2 - v1).toFixed(2)}`,
            `Step 2: Divide by original value: ${(v2 - v1).toFixed(2)} ÷ ${v1} = ${((v2 - v1)/v1).toFixed(4)}`,
            `Step 3: Multiply by 100: ${((v2 - v1)/v1).toFixed(4)} × 100 = ${res.toFixed(2)}%`,
            `Step 4: This is a ${isIncrease ? 'increase' : 'decrease'} of ${Math.abs(res).toFixed(2)}%`
          ],
          interpretation: `${isIncrease ? 'Increase' : 'Decrease'} of ${Math.abs(res).toFixed(2)}%`,
          isIncrease,
          visualization: Math.abs(res)
        };
      }

      case 'find_compound': {
        const totalChange = ((1 + v1/100) * (1 + v2/100) - 1) * 100;
        const finalValue = v3 * (1 + v1/100) * (1 + v2/100);
        return {
          result: totalChange.toFixed(2),
          finalValue: finalValue.toFixed(2),
          formula: `\\text{Compound} = ((1 + \\frac{${v1}}{100}) \\times (1 + \\frac{${v2}}{100}) - 1) \\times 100 = ${totalChange.toFixed(2)}\\%`,
          steps: [
            `Step 1: Convert first percentage: 1 + ${v1}/100 = ${(1 + v1/100).toFixed(3)}`,
            `Step 2: Convert second percentage: 1 + ${v2}/100 = ${(1 + v2/100).toFixed(3)}`,
            `Step 3: Multiply factors: ${(1 + v1/100).toFixed(3)} × ${(1 + v2/100).toFixed(3)} = ${((1 + v1/100)*(1 + v2/100)).toFixed(3)}`,
            `Step 4: Convert back to percentage: (${((1 + v1/100)*(1 + v2/100)).toFixed(3)} - 1) × 100 = ${totalChange.toFixed(2)}%`,
            `Step 5: Final value: ${v3} × ${((1 + v1/100)*(1 + v2/100)).toFixed(3)} = ${finalValue.toFixed(2)}`
          ],
          interpretation: `Total compound change: ${totalChange.toFixed(2)}%`,
          visualization: totalChange
        };
      }

      case 'find_ratio': {
        const percent1 = (v1 / v2) * 100;
        const percent2 = (val3 ? parseFloat(val3) : 0) / (v2) * 100;
        const ratio = percent2 ? (percent1 / percent2).toFixed(2) : '∞';
        return {
          result: ratio,
          percent1: percent1.toFixed(2),
          percent2: percent2.toFixed(2),
          formula: `\\text{Ratio} = \\frac{${v1}/${v2}}{${val3 || 0}/${v2}} = ${ratio}`,
          steps: [
            `Step 1: Calculate first percentage: ${v1}/${v2} = ${(v1/v2).toFixed(3)} → ${percent1.toFixed(2)}%`,
            `Step 2: Calculate second percentage: ${val3 || 0}/${v2} = ${(parseFloat(val3 || 0)/v2).toFixed(3)} → ${percent2.toFixed(2)}%`,
            `Step 3: Find ratio: ${percent1.toFixed(2)}% : ${percent2.toFixed(2)}% = ${ratio}`
          ],
          interpretation: `Ratio of percentages: ${ratio}`,
          visualization: percent1
        };
      }
      
      default:
        return { result: '0', formula: '', steps: [], interpretation: '' };
    }
  }, [mode, val1, val2, val3]);

  // Add to history
  useEffect(() => {
    if (calculation.result !== '0.00' && calculation.result !== '0') {
      setHistory(prev => [...prev.slice(-9), {
        mode,
        val1,
        val2,
        val3,
        result: calculation.result,
        timestamp: Date.now(),
        interpretation: calculation.interpretation
      }]);
    }
  }, [calculation.result, mode, val1, val2, val3]);

  // Copy result
  const handleCopy = () => {
    navigator.clipboard.writeText(`${calculation.result}${mode === 'find_value' ? '' : '%'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add to favorites
  const addToFavorites = () => {
    setFavorites(prev => [...prev.slice(-14), {
      mode,
      val1,
      val2,
      val3,
      result: calculation.result,
      interpretation: calculation.interpretation,
      timestamp: Date.now()
    }]);
  };

  return (
    <>
      <style>{QUANTUM_STYLES}</style>
      <div className={`relative min-h-screen transition-colors duration-500 ${
        dark ? 'bg-[#030014] text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        
        {/* Quantum Background */}
        <div className={`fixed inset-0 pointer-events-none ${dark ? 'quantum-grid' : ''}`}>
          <div className={`absolute inset-0 ${
            dark 
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,rgba(0,0,0,1)_100%)]' 
              : 'bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,rgba(255,255,255,1)_100%)]'
          }`} />
        </div>

        <QuantumParticles />

        {/* Canvas for additional effects */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{ opacity: 0.1 }}
        />

        <div className="relative z-10 px-4 py-8 w-full">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                  <Percent className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black flex items-center gap-2">
                  Quantum Percentage Synthesizer
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </h1>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advanced percentage calculations with quantum precision
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Energy Level */}
              <div className="quantum-badge">
                <Gauge className="w-4 h-4" />
                <span>Energy: {energyLevel.toFixed(0)}%</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="quantum-badge p-3"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Mode Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"
          >
            {Object.values(MODES).map((m, index) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode(m.id)}
                className={`relative p-4 rounded-xl transition-all overflow-hidden ${
                  mode === m.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                    : dark
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                    : 'bg-white/50 text-gray-700 hover:bg-white border border-gray-200'
                }`}
                style={{
                  borderLeft: mode === m.id ? 'none' : `3px solid ${m.color}30`
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div style={{ color: mode === m.id ? 'white' : m.color }}>
                    {m.icon}
                  </div>
                  <span className="text-xs font-medium">{m.label}</span>
                </div>
                {isProcessing && mode === m.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Calculator Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="quantum-card p-8 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* Input Fields */}
              <div className="space-y-2">
                <label className={`text-xs font-medium flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Hash className="w-3 h-3" />
                  {mode === 'find_percent' ? 'Part' : 
                   mode === 'find_value' ? 'Percentage' : 
                   mode === 'find_change' ? 'Initial Value' :
                   mode === 'find_compound' ? 'First %' : 'First Part'}
                </label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="quantum-input"
                  placeholder="Enter value"
                />
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-medium flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Target className="w-3 h-3" />
                  {mode === 'find_percent' || mode === 'find_value' ? 'Whole' : 
                   mode === 'find_change' ? 'Final Value' :
                   mode === 'find_compound' ? 'Second %' : 'Second Part'}
                </label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="quantum-input"
                  placeholder="Enter value"
                />
              </div>

              {mode === 'find_compound' && (
                <div className="space-y-2">
                  <label className={`text-xs font-medium flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Infinity className="w-3 h-3" />
                    Initial Amount
                  </label>
                  <input
                    type="number"
                    value={val3}
                    onChange={(e) => setVal3(e.target.value)}
                    className="quantum-input"
                    placeholder="Enter amount"
                  />
                </div>
              )}

              {mode === 'find_ratio' && (
                <div className="space-y-2">
                  <label className={`text-xs font-medium flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Target className="w-3 h-3" />
                    Second Part
                  </label>
                  <input
                    type="number"
                    value={val3}
                    onChange={(e) => setVal3(e.target.value)}
                    className="quantum-input"
                    placeholder="Enter value"
                  />
                </div>
              )}

              {/* Result Display */}
              <div className="space-y-2">
                <label className={`text-xs font-medium flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Zap className="w-3 h-3" />
                  Quantum Result
                </label>
                <div className="quantum-result min-h-[68px] flex items-center justify-center">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {calculation.result}
                      {mode !== 'find_value' && mode !== 'find_ratio' && '%'}
                    </div>
                    {mode === 'find_value' && (
                      <div className="text-xs text-gray-300 mt-1">
                        of {val2}
                      </div>
                    )}
                    {mode === 'find_compound' && calculation.finalValue && (
                      <div className="text-xs text-gray-300 mt-1">
                        Final: {calculation.finalValue}
                      </div>
                    )}
                    {mode === 'find_ratio' && (
                      <div className="text-xs text-gray-300 mt-1">
                        {calculation.percent1}% : {calculation.percent2}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="quantum-badge"
                >
                  {copied ? <Sparkles className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addToFavorites}
                  className="quantum-badge"
                >
                  <Star className="w-4 h-4" />
                  Save to Favorites
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSteps(!showSteps)}
                  className="quantum-badge"
                >
                  <Layers className="w-4 h-4" />
                  {showSteps ? 'Hide Steps' : 'Show Steps'}
                </motion.button>
              </div>

              <div className="quantum-badge">
                <Clock className="w-4 h-4" />
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </motion.div>

          {/* Visualization & Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="quantum-card p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Quantum Visualization
              </h3>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Percentage</span>
                    <span className="text-purple-400">{calculation.visualization?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="quantum-progress">
                    <motion.div
                      className="quantum-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculation.visualization || 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Pie Chart Simulation */}
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2d1f5e"
                      strokeWidth="20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="20"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * (calculation.visualization || 0)) / 100}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {(calculation.visualization || 0).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Interpretation */}
                <div className={`p-4 rounded-xl ${dark ? 'bg-purple-900/20' : 'bg-purple-50'} text-center`}>
                  <p className="text-sm font-medium">{calculation.interpretation}</p>
                </div>
              </div>
            </motion.div>

            {/* Step-by-Step Solution */}
            <AnimatePresence>
              {showSteps && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="quantum-card p-6"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-pink-400" />
                    Quantum Solution Path
                  </h3>

                  {/* Formula */}
                  <div className="mb-6 p-4 bg-black/30 rounded-xl overflow-x-auto">
                    <BlockMath math={calculation.formula} />
                  </div>

                  {/* Steps Timeline */}
                  <div className="quantum-timeline">
                    {calculation.steps?.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="quantum-timeline-item"
                      >
                        <div className="quantum-step">
                          <div className="quantum-step-number">{index + 1}</div>
                          <p className="text-sm">{step}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History & Favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* History */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="quantum-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Calculations
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        setMode(item.mode);
                        setVal1(item.val1);
                        setVal2(item.val2);
                        if (item.val3) setVal3(item.val3);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        dark ? 'hover:bg-purple-900/30' : 'hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs opacity-70">
                            {MODES[item.mode]?.label}
                          </span>
                          <p className="text-sm font-medium">
                            {item.val1} × {item.val2} = {item.result}%
                          </p>
                        </div>
                        <span className="text-xs opacity-50">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="quantum-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Favorite Calculations
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {favorites.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        setMode(item.mode);
                        setVal1(item.val1);
                        setVal2(item.val2);
                        if (item.val3) setVal3(item.val3);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        dark ? 'hover:bg-yellow-900/30' : 'hover:bg-yellow-50'
                      }`}
                    >
                      <p className="text-sm font-medium">{item.interpretation}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Educational Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="quantum-card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Mastering Quantum Percentage Calculations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="quantum-badge p-4 flex flex-col items-start">
                <Percent className="w-5 h-5 mb-2" style={{ color: MODES.find_percent.color }} />
                <h3 className="font-bold mb-2">Percentage of a Number</h3>
                <p className="text-sm opacity-70">Find what percent one number is of another. Essential for grades, statistics, and comparisons.</p>
              </div>

              <div className="quantum-badge p-4 flex flex-col items-start">
                <Calculator className="w-5 h-5 mb-2" style={{ color: MODES.find_value.color }} />
                <h3 className="font-bold mb-2">Value from Percentage</h3>
                <p className="text-sm opacity-70">Calculate discounts, tips, and tax. Perfect for shopping and financial calculations.</p>
              </div>

              <div className="quantum-badge p-4 flex flex-col items-start">
                <TrendingUp className="w-5 h-5 mb-2" style={{ color: MODES.find_change.color }} />
                <h3 className="font-bold mb-2">Percent Change</h3>
                <p className="text-sm opacity-70">Track growth, decline, and trends. Ideal for business and data analysis.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-black/30 rounded-xl">
              <h3 className="font-bold mb-2">Quantum Tips</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  To find 10%, move decimal left once
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-pink-400" />
                  For 1%, move decimal left twice
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  50% is half, 25% is quarter
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                  Compound percentages multiply, not add
                </li>
              </ul>
            </div>
          </motion.article>

          {/* Ad Slots */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="quantum-badge p-4 text-center justify-center opacity-50">
              <Sparkles className="w-5 h-5 mx-auto mb-2" />
              Quantum Ad Slot 1
            </div>
            <div className="quantum-badge p-4 text-center justify-center opacity-50">
              <Zap className="w-5 h-5 mx-auto mb-2" />
              Quantum Ad Slot 2
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuantumPercentageSynthesizer;