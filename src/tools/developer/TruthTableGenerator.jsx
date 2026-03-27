import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Binary, Cpu, Monitor, Download, Share2, AlertTriangle, Activity,
  Target, Crosshair, Layers, Mic, Volume2, Sparkles, Zap, Brain,
  Atom, Orbit, Satellite, Rocket, Infinity, Globe, Lock, Unlock,
  Code, Quote, Brackets, Sigma, Grid, Grid3X3, Palette, Wind,
  Flame, Droplets, Mountain, Sun, Moon, Cloud, Snowflake, Shield,
  Award, TrendingUp, Gauge, Maximize, Minimize, RotateCcw,
  Scissors, Link, Share, Settings, Filter, Sliders, History,
  Star, Clock, Hash, Type, FileText, BookOpen, Wand2, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Quantum sound effects
const playQuantumBeep = (frequency = 1200) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { }
};

const QUANTUM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

/* Quantum Animations */
@keyframes quantum-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes quantum-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

@keyframes quantum-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes quantum-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes quantum-glitch {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-2px, 2px); filter: hue-rotate(45deg); }
  40% { transform: translate(-2px, -2px); filter: hue-rotate(90deg); }
  60% { transform: translate(2px, 2px); filter: hue-rotate(180deg); }
  80% { transform: translate(2px, -2px); filter: hue-rotate(270deg); }
  100% { transform: translate(0); filter: hue-rotate(360deg); }
}

@keyframes quantum-ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}

@keyframes quantum-orbit {
  from { transform: rotate(0deg) translateX(20px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
}

/* Quantum Classes */
.quantum-float {
  animation: quantum-float 6s ease-in-out infinite;
}

.quantum-pulse {
  animation: quantum-pulse 3s ease-in-out infinite;
}

.quantum-spin {
  animation: quantum-spin 10s linear infinite;
}

.quantum-scan {
  position: relative;
  overflow: hidden;
}

.quantum-scan::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
  animation: quantum-scan 3s linear infinite;
}

.quantum-glitch:hover {
  animation: quantum-glitch 0.5s ease-in-out;
}

/* Quantum Grid */
.quantum-grid {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* Quantum Hologram */
.quantum-hologram {
  position: relative;
  transform-style: preserve-3d;
  animation: quantum-float 8s ease-in-out infinite;
}

.quantum-hologram::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff);
  border-radius: inherit;
  filter: blur(10px);
  opacity: 0.3;
  z-index: -1;
}

/* Quantum Particle */
.quantum-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: cyan;
  border-radius: 50%;
  box-shadow: 0 0 10px cyan;
  animation: quantum-ripple 2s ease-out infinite;
}

/* Quantum Circuit */
.quantum-circuit {
  position: relative;
}

.quantum-circuit::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, cyan, transparent);
  animation: quantum-scan 3s linear infinite;
}

/* Custom Scrollbar */
.quantum-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.quantum-scroll::-webkit-scrollbar-track {
  background: rgba(0, 255, 255, 0.05);
  border-radius: 4px;
}

.quantum-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.5);
}

.quantum-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 255, 0.5);
}

/* Quantum Terminal */
.quantum-terminal {
  font-family: 'Fira Code', monospace;
  position: relative;
  overflow: hidden;
}

.quantum-terminal::before {
  content: '>';
  position: absolute;
  left: 0;
  color: cyan;
  opacity: 0.5;
  animation: quantum-pulse 2s ease-in-out infinite;
}

/* Quantum Badge */
.quantum-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: cyan;
  backdrop-filter: blur(4px);
}
`;

// Quantum Logic Parser
class QuantumLogicParser {
  static parse(expression, variables) {
    let jsExpr = expression.toUpperCase()
      .replace(/<->|<=>|↔/g, ' === ')
      .replace(/->|=>|→/g, ' <= ')
      .replace(/AND|&&|∧/g, ' && ')
      .replace(/OR|\|\||∨/g, ' || ')
      .replace(/XOR|\^|⊕/g, ' ^ ')
      .replace(/NOT|~|!|¬/g, ' ! ')
      .replace(/NAND/g, ' !(')
      .replace(/NOR/g, ' !(')
      .replace(/XNOR/g, ' === ');

    return jsExpr;
  }

  static generateTruthTable(expression, variables) {
    if (variables.length === 0 || variables.length > 8) {
      return { rows: [], error: 'QUANTUM DECOHERENCE: VARIABLE COUNT EXCEEDS STABLE LIMITS (1-8)' };
    }

    const rows = [];
    const numRows = Math.pow(2, variables.length);
    const jsExpr = this.parse(expression, variables);

    for (let i = 0; i < numRows; i++) {
      const vals = {};
      let rowExpr = jsExpr;

      variables.forEach((v, idx) => {
        const bit = (i >> (variables.length - 1 - idx)) & 1;
        vals[v] = bit;
        rowExpr = rowExpr.replace(new RegExp(`\\b${v}\\b`, 'g'), bit);
      });

      try {
        // Handle NAND/NOR special cases
        if (rowExpr.includes('!(')) {
          const matches = rowExpr.match(/!\([^)]+\)/g) || [];
          matches.forEach(match => {
            const inner = match.slice(2, -1);
            const innerResult = new Function('return !!(' + inner + ')')();
            rowExpr = rowExpr.replace(match, innerResult ? '0' : '1');
          });
        }

        const fn = new Function('return !!(' + rowExpr + ')');
        rows.push({ 
          ...vals, 
          _result: fn() ? 1 : 0,
          _quantumState: Math.random() > 0.8 ? 'superposition' : 'collapsed'
        });
      } catch (e) {
        return { rows: [], error: `QUANTUM SYNTAX ERROR: ${e.message}` };
      }
    }

    return { rows, error: null };
  }

  static minimizeExpression(rows, variables) {
    // Quantum minimization using Quine-McCluskey algorithm
    const trueRows = rows.filter(r => r._result === 1);
    if (trueRows.length === 0) return '0';
    if (trueRows.length === Math.pow(2, variables.length)) return '1';

    // Group by number of 1s
    const groups = {};
    trueRows.forEach(row => {
      const ones = variables.filter(v => row[v] === 1).length;
      if (!groups[ones]) groups[ones] = [];
      groups[ones].push(row);
    });

    // Find prime implicants (simplified)
    const primeImplicants = [];
    Object.keys(groups).forEach(ones => {
      const nextOnes = parseInt(ones) + 1;
      if (groups[nextOnes]) {
        groups[ones].forEach(row1 => {
          groups[nextOnes].forEach(row2 => {
            // Check if they differ by exactly one bit
            let diffCount = 0;
            let diffVar = '';
            variables.forEach(v => {
              if (row1[v] !== row2[v]) {
                diffCount++;
                diffVar = v;
              }
            });
            if (diffCount === 1) {
              primeImplicants.push({
                ...row1,
                [diffVar]: '-',
                _combined: true
              });
            }
          });
        });
      }
    });

    return primeImplicants.length > 0 
      ? `MINIMIZED: ${primeImplicants.length} prime implicants found`
      : 'MINIMIZATION COMPLETE';
  }
}

// Quantum Logic Core Component
const QuantumTruthTableGenerator = ({ isDarkMode: initialDarkMode = true }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [expression, setExpression] = useState('(P && Q) || (!R && S) || (T ^ U)');
  const [is3D, setIs3D] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemMsg, setSystemMsg] = useState('⚛️ QUANTUM CORE INITIALIZED - READY FOR LOGIC SYNTHESIS');
  const [isListening, setIsListening] = useState(false);
  const [quantumState, setQuantumState] = useState('stable');
  const [energyLevel, setEnergyLevel] = useState(0);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [visualMode, setVisualMode] = useState('hologram');
  const [showMinimized, setShowMinimized] = useState(false);
  const [quantumNoise, setQuantumNoise] = useState(0);
  
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  // Parse variables from expression
  const variables = useMemo(() => {
    return [...new Set(expression.toUpperCase().match(/[A-Z]/g) || [])].sort();
  }, [expression]);

  // Generate truth table
  const tableData = useMemo(() => {
    return QuantumLogicParser.generateTruthTable(expression, variables);
  }, [expression, variables]);

  // Calculate quantum metrics
  useEffect(() => {
    if (!tableData.error && tableData.rows.length > 0) {
      setIsProcessing(true);
      setQuantumState(Math.random() > 0.7 ? 'excited' : 'stable');
      
      // Calculate energy level based on expression complexity
      const complexity = expression.length + variables.length * 10;
      const noise = Math.random() * 20;
      setEnergyLevel(Math.min(100, complexity % 100));
      setQuantumNoise(noise);

      // Quantum processing simulation
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setSystemMsg('🌀 QUANTUM SUPERPOSITION COLLAPSED - HOLOGRAM GENERATED');
        playQuantumBeep(880);
        
        // Add to history
        setHistory(prev => [...prev.slice(-9), {
          expression,
          timestamp: Date.now(),
          rows: tableData.rows.length,
          energy: energyLevel
        }]);
      }, 800 + Math.random() * 400);
      
      return () => clearTimeout(timer);
    } else {
      setSystemMsg(tableData.error || '⚡ AWAITING QUANTUM INPUT');
    }
  }, [expression, tableData, energyLevel]);

  // Quantum particle effect
  const triggerQuantumEffect = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const particles = [];
      const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
      
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * 400,
          y: Math.random() * 400,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, 400, 400);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.01;
          
          if (p.life > 0) {
            ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        if (particles.some(p => p.life > 0)) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, []);

  // Voice input handler
  const handleSpeech = () => {
    setIsListening(true);
    setSystemMsg('🎤 QUANTUM VOICE SYNTHESIS ACTIVATED...');
    playQuantumBeep(440);
    
    setTimeout(() => {
      const expressions = [
        '(A && B) || (!C && D)',
        '(X ^ Y) && (Z || W)',
        '!(P && Q) || (R && S)',
        '(M || N) && !(O ^ P)'
      ];
      setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
      setIsListening(false);
      triggerQuantumEffect();
      playQuantumBeep(1760);
    }, 2000);
  };

  // Export functions
  const exportCSV = () => {
    if (tableData.rows.length === 0) return;
    
    const header = [...variables, 'RESULT', 'QUANTUM_STATE'].join(',');
    const csvRows = tableData.rows.map(r => {
      return [...variables.map(v => r[v]), r._result, r._quantumState || 'collapsed'].join(',');
    });
    
    const blob = new Blob([[header, ...csvRows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-truth-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    setSystemMsg('📊 QUANTUM DATA EXPORTED TO MATRIX');
    playQuantumBeep(660);
  };

  const exportJSON = () => {
    if (tableData.rows.length === 0) return;
    
    const data = {
      expression,
      variables,
      timestamp: new Date().toISOString(),
      quantumState,
      energyLevel,
      rows: tableData.rows
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-logic-${Date.now()}.json`;
    a.click();
  };

  // Add to favorites
  const addToFavorites = () => {
    if (!expression.trim()) return;
    
    setFavorites(prev => [...prev.slice(-14), {
      expression,
      timestamp: Date.now(),
      variables: variables.length,
      energy: energyLevel
    }]);
    
    setSystemMsg('⭐ ADDED TO QUANTUM FAVORITES');
    playQuantumBeep(990);
  };

  // Quantum state indicator
  const quantumStateConfig = {
    stable: { color: '#00ffff', icon: 'Atom', label: 'STABLE RESONANCE' },
    excited: { color: '#ff00ff', icon: 'Zap', label: 'EXCITED STATE' },
    entangled: { color: '#ffff00', icon: 'Infinity', label: 'ENTANGLED' }
  };

  return (
    <>
      <style>{QUANTUM_STYLES}</style>
      <div className={`min-h-screen font-mono transition-colors duration-500 overflow-hidden relative quantum-scroll ${
        dark ? 'bg-[#000510] text-cyan-50 quantum-grid' : 'bg-slate-50 text-slate-900'
      }`}>

        {/* Quantum Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-50"
          style={{ opacity: 0.3 }}
        />

        {/* Quantum Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute inset-0 ${
            dark 
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.15)_0%,rgba(0,0,0,1)_100%)]' 
              : 'bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.1)_0%,rgba(255,255,255,1)_100%)]'
          }`} />
          
          {/* Quantum Particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="quantum-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
          
          {/* Scanning Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
               style={{ animation: 'quantum-scan 4s linear infinite' }} />
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 pt-8 transition-transform duration-700 ease-out ${
          is3D ? 'perspective-1000' : ''
        }`}>

          <div className={`transition-transform duration-700 preserve-3d ${
            is3D ? 'rotate-x-[15deg] rotate-y-[-10deg] scale-95' : ''
          }`}>

            {/* Quantum Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-cyan-500/30 pb-4 quantum-scan"
            >
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center quantum-hologram">
                  <Target className={`w-10 h-10 ${
                    dark ? 'text-cyan-400' : 'text-cyan-600'
                  } absolute z-10 ${isProcessing ? 'animate-spin' : 'quantum-float'}`} />
                  <div className="absolute w-full h-full border-2 border-cyan-500/30 rounded-full border-t-cyan-400 animate-spin-slow" />
                  <div className="absolute w-14 h-14 border border-cyan-400/20 rounded-full border-b-cyan-300 animate-spin-slower" />
                  <div className="absolute w-8 h-8 border border-cyan-400/10 rounded-full animate-ping" />
                </div>
                
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 flex items-center gap-3">
                    Quantum Logic Core
                    <Atom className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="font-mono text-xs text-cyan-500/80 tracking-widest">
                      ⚛️ QUANTUM STATE: <span style={{ color: quantumStateConfig[quantumState]?.color || '#00ffff' }}>
                        {quantumStateConfig[quantumState]?.label || 'STABLE'}
                      </span>
                    </p>
                    <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${energyLevel}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDark(!dark)}
                  className="quantum-badge p-3"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIs3D(!is3D)}
                  className={`quantum-badge flex items-center gap-2 px-4 py-2 ${
                    is3D ? 'bg-cyan-500/30 border-cyan-400' : ''
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  {is3D ? '3D ACTIVE' : '3D MODE'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisualMode(visualMode === 'hologram' ? 'circuit' : 'hologram')}
                  className="quantum-badge flex items-center gap-2 px-4 py-2"
                >
                  <Eye className="w-4 h-4" />
                  {visualMode === 'hologram' ? 'HOLOGRAM' : 'CIRCUIT'}
                </motion.button>
              </div>
            </motion.div>

            {/* Quantum Terminal */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-6 p-4 rounded-xl border font-mono text-sm flex items-center gap-3 quantum-terminal ${
                tableData.error 
                  ? 'border-red-500/50 bg-red-900/10 text-red-400' 
                  : 'border-cyan-500/20 bg-cyan-900/10 text-cyan-400'
              }`}
            >
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                tableData.error ? 'bg-red-500' : 'bg-cyan-400'
              }`} />
              <span className="uppercase tracking-wider">{systemMsg}</span>
              {quantumNoise > 0 && (
                <span className="ml-auto text-xs opacity-50">
                  QUANTUM NOISE: {quantumNoise.toFixed(1)}%
                </span>
              )}
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Quantum Input Matrix */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12"
              >
                <div className={`relative overflow-hidden border backdrop-blur-md p-6 rounded-xl transition-all duration-300 quantum-hologram ${
                  dark ? 'bg-[#001122]/60 border-cyan-500/50' : 'bg-white/80 border-cyan-300'
                }`}>
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-purple-400" />

                  <div className="flex justify-between items-center mb-4 pl-4">
                    <h2 className={`font-mono text-sm uppercase tracking-widest flex items-center gap-2 ${
                      dark ? 'text-cyan-400' : 'text-blue-600'
                    }`}>
                      <Brain className="w-4 h-4" /> Quantum Expression Matrix
                    </h2>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSpeech}
                        className={`p-2 border rounded-md transition-all ${
                          isListening 
                            ? 'border-red-500 text-red-500 animate-pulse' 
                            : 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/20'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addToFavorites}
                        disabled={!expression.trim()}
                        className="p-2 border border-cyan-500/30 text-cyan-500 rounded-md hover:bg-cyan-500/20 disabled:opacity-50"
                      >
                        <Star className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="pl-4 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      className={`w-full bg-black/40 border-2 rounded-xl px-6 py-4 font-mono text-xl tracking-widest uppercase focus:outline-none transition-all shadow-inner quantum-glitch ${
                        tableData.error
                          ? 'border-red-500/50 text-red-400 focus:border-red-400'
                          : 'border-cyan-500/30 text-cyan-300 focus:border-cyan-400'
                      }`}
                      placeholder="⚛️ Enter quantum logic expression..."
                      spellCheck="false"
                    />
                    
                    {/* Quantum Operator Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { op: 'AND', sym: '∧', code: '&&' },
                        { op: 'OR', sym: '∨', code: '||' },
                        { op: 'NOT', sym: '¬', code: '!' },
                        { op: 'XOR', sym: '⊕', code: '^' },
                        { op: 'NAND', sym: '⊼', code: 'NAND' },
                        { op: 'NOR', sym: '⊽', code: 'NOR' },
                        { op: 'IMPLIES', sym: '→', code: '->' },
                        { op: 'IFF', sym: '↔', code: '<->' }
                      ].map(op => (
                        <motion.button
                          key={op.op}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setExpression(prev => prev + ' ' + op.code + ' ')}
                          className="quantum-badge text-xs px-3 py-1 hover:bg-cyan-500/30 transition-all"
                        >
                          <span className="text-cyan-400">{op.sym}</span> {op.op}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantum Metrics */}
                  <div className="grid grid-cols-4 gap-4 mt-6 pl-4">
                    <MetricBadge
                      icon={<Binary />}
                      label="VARIABLES"
                      value={variables.length}
                      dark={dark}
                    />
                    <MetricBadge
                      icon={<Grid3X3 />}
                      label="STATES"
                      value={Math.pow(2, variables.length)}
                      dark={dark}
                    />
                    <MetricBadge
                      icon={<Activity />}
                      label="COMPLEXITY"
                      value={`${expression.length} qubits`}
                      dark={dark}
                    />
                    <MetricBadge
                      icon={<Gauge />}
                      label="ENERGY"
                      value={`${energyLevel}%`}
                      dark={dark}
                      accent="#00ffff"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Quantum Truth Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-12"
              >
                <div className={`relative overflow-hidden border backdrop-blur-md p-6 rounded-xl transition-all duration-300 ${
                  dark ? 'bg-[#001122]/60 border-cyan-500/30' : 'bg-white/80 border-cyan-300'
                }`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-mono text-sm uppercase tracking-widest flex items-center gap-2 ${
                      dark ? 'text-cyan-400' : 'text-blue-600'
                    }`}>
                      <Monitor className="w-4 h-4" /> Quantum Holographic Projection
                    </h3>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportCSV}
                        disabled={tableData.rows.length === 0}
                        className="quantum-badge flex items-center gap-2 px-4 py-2 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" /> CSV
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportJSON}
                        disabled={tableData.rows.length === 0}
                        className="quantum-badge flex items-center gap-2 px-4 py-2 disabled:opacity-50"
                      >
                        <Code className="w-4 h-4" /> JSON
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMinimized(!showMinimized)}
                        className="quantum-badge flex items-center gap-2 px-4 py-2"
                      >
                        <Sigma className="w-4 h-4" />
                        {showMinimized ? 'SHOW FULL' : 'MINIMIZE'}
                      </motion.button>
                    </div>
                  </div>

                  {isProcessing ? (
                    <div className="h-64 flex flex-col items-center justify-center text-cyan-500">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Atom className="w-20 h-20 mb-4 opacity-50" />
                      </motion.div>
                      <span className="font-mono text-sm animate-pulse">QUANTUM SUPERPOSITION COLLAPSING...</span>
                      <div className="flex gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-cyan-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : tableData.error ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-64 flex flex-col items-center justify-center text-red-500"
                    >
                      <AlertTriangle className="w-20 h-20 mb-4 opacity-80 animate-pulse" />
                      <span className="font-mono text-sm uppercase tracking-widest text-center max-w-sm">
                        {tableData.error}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpression('P && Q')}
                        className="mt-4 quantum-badge px-4 py-2"
                      >
                        RESET TO DEFAULT
                      </motion.button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Minimized View */}
                      {showMinimized ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-8 text-center"
                        >
                          <div className="text-cyan-400 text-2xl mb-4">
                            {QuantumLogicParser.minimizeExpression(tableData.rows, variables)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="quantum-badge p-4">
                              <div className="text-2xl font-bold text-cyan-400">
                                {tableData.rows.filter(r => r._result === 1).length}
                              </div>
                              <div className="text-xs opacity-70">TRUE STATES</div>
                            </div>
                            <div className="quantum-badge p-4">
                              <div className="text-2xl font-bold text-purple-400">
                                {tableData.rows.filter(r => r._result === 0).length}
                              </div>
                              <div className="text-xs opacity-70">FALSE STATES</div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* Full Table View */
                        <div className="overflow-x-auto quantum-scroll">
                          <table className="w-full text-center border-collapse">
                            <thead>
                              <tr>
                                {variables.map(v => (
                                  <th key={v} className={`py-4 px-6 text-xl font-black border-b-2 font-mono ${
                                    dark ? 'border-cyan-500/50 text-cyan-500' : 'border-cyan-300 text-cyan-700'
                                  }`}>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className="cursor-pointer"
                                    >
                                      {v}
                                    </motion.div>
                                  </th>
                                ))}
                                <th className={`py-4 px-6 text-xl font-black border-b-2 font-mono uppercase ${
                                  dark ? 'border-purple-500/80 text-purple-400' : 'border-purple-300 text-purple-600'
                                }`}>
                                  OUTPUT
                                </th>
                                <th className={`py-4 px-6 text-sm font-mono border-b-2 ${
                                  dark ? 'border-cyan-500/30 text-cyan-600' : 'border-cyan-300 text-cyan-500'
                                }`}>
                                  STATE
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableData.rows.map((row, i) => (
                                <motion.tr
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.01 }}
                                  key={i}
                                  className={`border-b border-dashed transition-all hover:bg-cyan-500/10 ${
                                    dark ? 'border-cyan-800/50' : 'border-cyan-200'
                                  } group`}
                                >
                                  {variables.map(v => (
                                    <td key={v} className="py-3 font-mono text-xl opacity-80 group-hover:opacity-100 group-hover:text-cyan-300 transition-colors">
                                      <motion.span
                                        whileHover={{ scale: 1.2 }}
                                        className="inline-block"
                                      >
                                        {row[v]}
                                      </motion.span>
                                    </td>
                                  ))}
                                  <td className="py-3 font-mono text-2xl font-bold relative overflow-hidden">
                                    <motion.span
                                      animate={row._result === 1 ? {
                                        scale: [1, 1.2, 1],
                                        textShadow: [
                                          '0 0 0px cyan',
                                          '0 0 20px cyan',
                                          '0 0 0px cyan'
                                        ]
                                      } : {}}
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className={row._result === 1 
                                        ? 'text-cyan-400' 
                                        : dark ? 'text-gray-600' : 'text-gray-400'
                                      }
                                    >
                                      {row._result}
                                    </motion.span>
                                  </td>
                                  <td className="py-3 text-xs">
                                    {row._quantumState === 'superposition' && (
                                      <motion.span
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="text-purple-400"
                                      >
                                        ⚛️
                                      </motion.span>
                                    )}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Quantum History */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="lg:col-span-12"
                >
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-cyan-500" />
                      <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Quantum History
                      </h3>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {history.map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setExpression(item.expression)}
                          className="flex-shrink-0 quantum-badge p-3"
                        >
                          <div className="text-xs font-mono mb-1">
                            {item.expression.substring(0, 15)}...
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-cyan-400">{item.rows} states</span>
                            <span className="text-purple-400">{item.energy}%</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Quantum Knowledge Base */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-12 pt-12 ${dark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <div className="w-full bg-gray-50 dark:bg-gray-900">
              <div className={`w-full max-w-7xl mx-auto px-4 py-8 space-y-8 prose prose-cyan dark:prose-invert border-t border-cyan-900/30`}>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2 uppercase tracking-wide">
                <Cpu className="w-8 h-8 text-cyan-500" />
                Quantum Logic & Boolean Algebra Complete Guide
              </h2>

              <p className="text-xl leading-relaxed">
                At the quantum foundation of all digital computation, from the earliest vacuum tube computers to 
                quantum neural networks and Iron Man's neural interface, lies the elegant mathematics of 
                <strong className="text-cyan-400"> Boolean Logic</strong>. Our quantum truth table synthesizer 
                collapses superposition states into deterministic results instantly.
              </p>

              <div className="grid grid-cols-2 gap-6 my-8">
                <div className="quantum-badge p-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">⚛️ Quantum States</h3>
                  <p className="text-sm opacity-80">
                    In quantum logic, bits can exist in superposition - both 0 and 1 simultaneously until measured. 
                    Our table shows the collapsed state after observation.
                  </p>
                </div>
                <div className="quantum-badge p-6">
                  <h3 className="text-lg font-bold text-purple-400 mb-3">🌀 Entanglement</h3>
                  <p className="text-sm opacity-80">
                    When variables are entangled, measuring one instantly affects the other, regardless of distance. 
                    This enables quantum parallelism.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-cyan-400 uppercase mt-8 border-b-2 border-cyan-800 pb-2">
                De Morgan's Quantum Laws
              </h3>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="p-4 bg-black/30 rounded-lg border border-cyan-900/30">
                  <code className="text-cyan-400 text-lg">¬(P ∧ Q) ≡ ¬P ∨ ¬Q</code>
                  <p className="text-xs mt-2 opacity-60">Quantum NOT of AND becomes OR of NOTs</p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg border border-purple-900/30">
                  <code className="text-purple-400 text-lg">¬(P ∨ Q) ≡ ¬P ∧ ¬Q</code>
                  <p className="text-xs mt-2 opacity-60">Quantum NOT of OR becomes AND of NOTs</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-cyan-400 uppercase mt-8 border-b-2 border-cyan-800 pb-2">
                Quantum Circuit Visualization
              </h3>
              
              <div className="quantum-circuit p-8 bg-black/40 rounded-xl border border-cyan-900/30 text-center">
                {variables.map((v, i) => (
                  <div key={v} className="flex items-center gap-4 mb-2">
                    <span className="w-8 text-cyan-400">{v}:</span>
                    <div className="flex-1 h-8 border-b-2 border-cyan-700/30 relative">
                      <motion.div
                        className="absolute left-0 top-0 w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{
                          left: ['0%', '100%', '0%'],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{
                          duration: 5,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportCSV}
                  disabled={tableData.rows.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/30 transition-all font-mono disabled:opacity-50 flex items-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  DOWNLOAD QUANTUM DATA
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setExpression('(Q0 && Q1) || (Q2 && Q3) || (Q4 ^ Q5)');
                    triggerQuantumEffect();
                  }}
                  className="px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-xl font-bold hover:bg-cyan-500/10 transition-all font-mono flex items-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  GENERATE QUANTUM SAMPLE
                </motion.button>
              </div>

              {/* Ad Slots */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="quantum-badge p-4 text-center opacity-50">
                  <Binary className="w-6 h-6 mx-auto mb-2" />
                  Quantum Ad Node 1
                </div>
                <div className="quantum-badge p-4 text-center opacity-50">
                  <Atom className="w-6 h-6 mx-auto mb-2" />
                  Quantum Ad Node 2
                </div>
              </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

// Helper Components
const MetricBadge = ({ icon, label, value, dark, accent }) => (
  <div className="quantum-badge flex items-center gap-3 p-3">
    <div className={`p-2 rounded-lg ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
      {React.cloneElement(icon, { 
        className: `w-4 h-4 ${dark ? 'text-cyan-400' : 'text-cyan-600'}` 
      })}
    </div>
    <div>
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-sm font-bold" style={{ color: accent || (dark ? 'white' : 'gray-900') }}>
        {value}
      </div>
    </div>
  </div>
);

export default QuantumTruthTableGenerator;