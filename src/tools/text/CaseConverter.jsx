import React, { useState, useRef, memo, useCallback, useEffect, useMemo } from 'react';
import { 
  Sparkles, Copy, BookOpen, RefreshCw, Zap, Wand2, 
  Eye, EyeOff, History, Trash, Download, Type, 
  Hash, Clock, FileText, Brain, Mic, Volume2,
  ArrowLeftRight, ScanLine, Layers, Bot, Stars
} from 'lucide-react';

const FuturisticCaseConverter = ({ isDarkMode, copyResult, showToast }) => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 0, readingTime: 0 });
  const [history, setHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setShowAdvanced] = useState(false);
  const [selectedFont, setSelectedFont] = useState('font-sans');
  const [transformMode, setTransformMode] = useState('standard');
  const [isGlowing, setIsGlowing] = useState(false);
  
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);

  // Advanced case transformations
  const caseTransformations = useMemo(() => ({
    // Standard transformations
    standard: {
      upper: (text) => text.toUpperCase(),
      lower: (text) => text.toLowerCase(),
      title: (text) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentence: (text) => text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      toggle: (text) => text.split('').map(c => 
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      ).join(''),
    },

    // Creative transformations
    creative: {
      alternating: (text) => text.split('').map((c, i) => 
        i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()
      ).join(''),
      inverted: (text) => text.split('').reverse().join(''),
      scrambled: (text) => text.split('').sort(() => Math.random() - 0.5).join(''),
      leet: (text) => text.replace(/[a-zA-Z]/g, (c) => {
        const leetMap = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' };
        return leetMap[c.toLowerCase()] || c;
      }),
      bubble: (text) => text.split('').map(c => 
        c.match(/[a-zA-Z]/) ? `${c}⃠` : c
      ).join(''),
    },

    // Professional transformations
    professional: {
      camelCase: (text) => text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
      snake_case: (text) => text.toLowerCase().replace(/\s+/g, '_'),
      kebabCase: (text) => text.toLowerCase().replace(/\s+/g, '-'),
      CONSTANT_CASE: (text) => text.toUpperCase().replace(/\s+/g, '_'),
      PascalCase: (text) => text.replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(/\s+/g, ''),
    },

    // Unicode & special
    unicode: {
      fullwidth: (text) => text.replace(/[!-~]/g, (c) => 
        String.fromCharCode(c.charCodeAt(0) + 0xFEE0)
      ),
      smallcaps: (text) => text.replace(/[a-z]/g, (c) => {
        const smallCaps = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' };
        return smallCaps[c] || c;
      }),
      script: (text) => text.replace(/[a-zA-Z]/g, (c) => {
        const scriptMap = { a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏' };
        return scriptMap[c.toLowerCase()] || c;
      }),
    }
  }), []);

  // Update statistics in real-time
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text.split('\n').length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    setStats({ words, chars, lines, readingTime });

    // Glow effect animation
    setIsGlowing(text.length > 0);
  }, [text]);

  // Particle effect on transformation
  const triggerParticleEffect = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const particles = [];
      
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * 200,
          y: Math.random() * 200,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1
        });
      }
      
      // Animate particles
      const animate = () => {
        ctx.clearRect(0, 0, 200, 200);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          
          if (p.life > 0) {
            ctx.fillStyle = `rgba(59, 130, 246, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
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

  // Enhanced transformation with history
  const transformText = useCallback((type, category = 'standard') => {
    if (!text.trim()) {
      showToast?.('Please enter some text to transform', 'warning');
      return;
    }

    setIsProcessing(true);
    triggerParticleEffect();

    // Add to history before transformation
    setHistory(prev => [...prev.slice(-9), { 
      text, 
      timestamp: Date.now(),
      type: `${category}:${type}`
    }]);

    // Apply transformation
    setTimeout(() => {
      try {
        const transformation = caseTransformations[category]?.[type] || 
                             caseTransformations.standard[type];
        const transformedText = transformation(text);
        setText(transformedText);
        
        showToast?.('Text transformed successfully!', 'success');
      } catch (error) {
        showToast?.('Transformation failed', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 300); // Simulate processing for effect
  }, [text, showToast, triggerParticleEffect, caseTransformations]);

  // Restore from history
  const restoreFromHistory = useCallback((historyItem) => {
    setText(historyItem.text);
    showToast?.('Restored from history', 'info');
  }, [showToast]);

  // Clear with confirmation
  const clearText = useCallback(() => {
    if (text.length > 0 && window.confirm('Clear all text? This cannot be undone.')) {
      setText('');
      showToast?.('Text cleared', 'info');
    }
  }, [text, showToast]);

  // Export text
  const exportText = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transformed-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('Text exported successfully!', 'success');
  }, [text, showToast]);

  // Smart suggestions based on content
  const getSmartSuggestions = useCallback(() => {
    if (!text) return [];
    
    const suggestions = [];
    
    if (text.includes('_') && !text.includes(' ')) {
      suggestions.push({ category: 'professional', type: 'camelCase', label: 'Convert to camelCase' });
    }
    
    if (text === text.toUpperCase() && text.length > 10) {
      suggestions.push({ category: 'professional', type: 'sentence', label: 'Convert to Sentence case' });
    }
    
    if (text.match(/[A-Z][a-z]+[A-Z][a-z]+/)) {
      suggestions.push({ category: 'professional', type: 'snake_case', label: 'Convert to snake_case' });
    }
    
    return suggestions;
  }, [text]);

  return (
    <div className="relative space-y-6">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20"
        style={{ zIndex: -1 }}
      />

      {/* Header with stats */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-blue-500/30' : 'bg-white/60 border-blue-200'} backdrop-blur-xl shadow-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${isDarkMode ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-400'} animate-pulse`}>
              <Zap className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                Neural Text Transformer
                <Sparkles className="text-yellow-400 animate-spin-slow" size={20} />
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-Powered Case Conversion & Text Transformation
              </p>
            </div>
          </div>

          {/* Live stats */}
          <div className="flex gap-4">
            <StatBadge icon={<Hash size={14} />} value={stats.chars} label="chars" isDarkMode={isDarkMode} />
            <StatBadge icon={<Type size={14} />} value={stats.words} label="words" isDarkMode={isDarkMode} />
            <StatBadge icon={<Layers size={14} />} value={stats.lines} label="lines" isDarkMode={isDarkMode} />
            <StatBadge icon={<Clock size={14} />} value={`${stats.readingTime}min`} label="read" isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      {/* Smart suggestions */}
      {getSmartSuggestions().length > 0 && (
        <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-purple-900/30 border-purple-500/30' : 'bg-purple-100 border-purple-200'} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-purple-500" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              Smart Suggestions
            </span>
          </div>
          <div className="flex gap-2">
            {getSmartSuggestions().map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => transformText(suggestion.type, suggestion.category)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isDarkMode 
                    ? 'bg-purple-800/50 text-purple-300 hover:bg-purple-700/50 border border-purple-500/30' 
                    : 'bg-purple-200 text-purple-700 hover:bg-purple-300 border border-purple-300'
                }`}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main transformation interface */}
      <div className={`relative p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl shadow-2xl transition-all duration-500 ${
        isGlowing ? 'shadow-blue-500/20' : ''
      }`}>
        {/* Mode selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2 p-1 rounded-lg bg-gray-200/20 backdrop-blur-sm">
            {['standard', 'creative', 'professional', 'unicode'].map((mode) => (
              <button
                key={mode}
                onClick={() => setTransformMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  transformMode === mode
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearText}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
              title="Clear all"
            >
              <Trash size={18} />
            </button>
            <button
              onClick={exportText}
              disabled={text.length === 0}
              className={`p-2 rounded-lg transition-all ${
                text.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              title="Export as file"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Transformation buttons grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {Object.entries(caseTransformations[transformMode] || caseTransformations.standard).map(([type]) => (
            <button
              key={type}
              onClick={() => transformText(type, transformMode)}
              disabled={text.length === 0 || isProcessing}
              className={`relative group px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                text.length === 0 || isProcessing
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-blue-600/30 hover:text-blue-300 border border-gray-600/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-200'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1">
                {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                {isProcessing && <RefreshCw size={12} className="animate-spin" />}
              </span>
              <span className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                isDarkMode ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
              }`} />
            </button>
          ))}
        </div>

        {/* Text area with futuristic styling */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here for neural transformation..."
            className={`w-full h-56 p-6 rounded-xl border-2 outline-none transition-all duration-300 resize-y ${
              selectedFont
            } ${
              isDarkMode 
                ? 'bg-gray-900/80 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20' 
                : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20'
            }`}
            style={{ 
              backdropFilter: 'blur(10px)',
              boxShadow: isGlowing ? '0 0 30px rgba(59,130,246,0.2)' : 'none'
            }}
          />
          
          {/* Character glow effect */}
          <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-mono ${
            isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-200 text-blue-600'
          }`}>
            {text.length}/∞
          </div>
        </div>

        {/* Quick actions bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            <ActionButton
              icon={<Copy size={16} />}
              label="Copy"
              onClick={() => {
                copyResult(text);
                showToast?.('Copied to clipboard!', 'success');
              }}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Volume2 size={16} />}
              label="Speak"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
              }}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Wand2 size={16} />}
              label="AI Suggest"
              onClick={() => {
                const suggestions = getSmartSuggestions();
                if (suggestions.length > 0) {
                  transformText(suggestions[0].type, suggestions[0].category);
                }
              }}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Font selector */}
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm outline-none ${
              isDarkMode 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            <option value="font-sans">Sans Serif</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Monospace</option>
            <option value="font-display">Display</option>
          </select>
        </div>
      </div>

      {/* History timeline */}
      {history.length > 0 && (
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
          <div className="flex items-center gap-2 mb-3">
            <History size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Transformation History
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => restoreFromHistory(item)}
                className={`flex-shrink-0 p-2 rounded-lg text-xs transition-all ${
                  isDarkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="font-mono truncate max-w-[150px]">
                  {item.text.substring(0, 30)}...
                </div>
                <div className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Educational content with futuristic design */}
      <article className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${isDarkMode ? 'from-purple-600 to-pink-600' : 'from-purple-400 to-pink-400'}`}>
            <Bot size={28} className="text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              Neural Text Transformation Guide
              <Stars size={20} className="text-yellow-400" />
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Unlock the full potential of your text with advanced transformations
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <Zap size={16} />
              Standard Transformations
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>UPPERCASE:</strong> Perfect for headings and emphasis
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>Title Case:</strong> Professional article and book titles
                </span>
              </li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              <Brain size={16} />
              Creative Transformations
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>Alternating:</strong> Creates unique visual patterns
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>Leet Speak:</strong> Transform to hacker style (1337)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
};

// Helper components
const StatBadge = ({ icon, value, label, isDarkMode }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
    isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/50 text-gray-700'
  }`}>
    {icon}
    <span className="font-bold">{value}</span>
    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>{label}</span>
  </div>
);

const ActionButton = ({ icon, label, onClick, disabled, isDarkMode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : isDarkMode
        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default memo(FuturisticCaseConverter);