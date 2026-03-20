import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  FileText, Copy, BookOpen, Clock, Type, 
  Sparkles, TrendingUp, BarChart, PieChart,
  Brain, Target, Award, Zap, Activity,
  Eye, EyeOff, Download, RefreshCw, Hash,
  Layers, Grid, AlertCircle, CheckCircle,
  Sigma, Globe, Lock, Unlock, Star,
  Calendar, Filter, Maximize, Minimize,
  Scissors, Quote, Code, AlignLeft, Bold
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Stunning CSS styles
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

/* Base Styles */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Syne',sans-serif;overflow-x:hidden}

/* Animations */
@keyframes scanline{0%{top:-4px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse-glow{0%,100%{opacity:0.5}50%{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes blob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-50px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* Dark Theme - Deep Ocean */
.dark{
  --bg:#0a0f1f;--sur:#0f1a2f;--s2:#1a1f3a;
  --bdr:#2a3650;--bdr2:rgba(0,180,216,.24);
  --acc:#00b4d8;--acc2:#48cae4;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#f0f9ff;--txt2:#90e0ef;--txt3:#0077b6;
  --ed:#030712;--num:#023e8a;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(0,180,216,.016) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,180,216,.016) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 28s linear infinite;
  position:relative;
}

.dark::before{
  content:'';position:fixed;inset:0;background:radial-gradient(circle at 50% 50%,rgba(0,180,216,.05),transparent 70%);
  pointer-events:none;
}

.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,180,216,.55),transparent);
  box-shadow:0 0 18px rgba(0,180,216,.4);animation:scanline 9s linear infinite;top:-4px}

/* Light Theme - Ocean Mist */
.light{
  --bg:#f0f9ff;--sur:#ffffff;--s2:#e6f3ff;
  --bdr:#b8e2f2;--bdr2:#00b4d8;
  --acc:#0096c7;--acc2:#48cae4;--acc3:#db2777;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#030712;--txt2:#023e8a;--txt3:#0077b6;
  --ed:#ffffff;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* Glass Components */
.glass-panel{
  background:${({ dark }) => dark ? 'rgba(15,26,47,0.6)' : 'rgba(255,255,255,0.7)'};
  backdrop-filter:blur(12px);
  border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.2)' : 'rgba(0,150,199,0.15)'};
  border-radius:16px;
  box-shadow:0 8px 32px rgba(0,0,0,0.1);
}

.glass-card{
  background:${({ dark }) => dark ? 'rgba(26,31,58,0.4)' : 'rgba(230,243,255,0.4)'};
  backdrop-filter:blur(8px);
  border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.15)' : 'rgba(0,150,199,0.1)'};
  border-radius:12px;
  padding:16px;
}

/* Buttons */
.btn-primary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 24px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#00b4d8,#48cae4);
  color:white;cursor:pointer;font-family:'Fira Code',monospace;
  font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 4px 20px rgba(0,180,216,0.4);
  transition:all 0.2s;position:relative;overflow:hidden;
}

.btn-primary::before{
  content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
  transition:left 0.5s;
}

.btn-primary:hover::before{left:100%}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,180,216,0.6)}
.btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none}

.btn-secondary{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 16px;border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.3)' : 'rgba(0,150,199,0.2)'};
  border-radius:10px;background:transparent;color:var(--txt2);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;letter-spacing:.06em;
  transition:all 0.15s;
}

.btn-secondary:hover{border-color:var(--acc);color:var(--acc);background:rgba(0,180,216,0.05)}

.btn-icon{
  padding:8px;border-radius:8px;border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.2)' : 'rgba(0,150,199,0.15)'};
  background:transparent;color:var(--txt2);cursor:pointer;transition:all 0.15s;
}

.btn-icon:hover{border-color:var(--acc);color:var(--acc);background:rgba(0,180,216,0.05)}

/* Inputs */
.glass-input{
  background:${({ dark }) => dark ? 'rgba(3,7,18,0.5)' : 'rgba(255,255,255,0.5)'};
  border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.2)' : 'rgba(0,150,199,0.15)'};
  border-radius:12px;color:var(--txt);font-family:'Fira Code',monospace;
  font-size:14px;padding:12px 16px;outline:none;width:100%;
  transition:all 0.15s;backdrop-filter:blur(4px);
}

.glass-input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(0,180,216,0.1)}
.glass-input::placeholder{color:var(--txt3);opacity:0.5}

/* Badges */
.badge{
  padding:4px 12px;border-radius:20px;font-family:'Fira Code',monospace;
  font-size:11px;font-weight:600;letter-spacing:.04em;display:inline-flex;align-items:center;gap:4px;
}

.badge-success{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3)}
.badge-warning{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.badge-info{background:rgba(0,180,216,0.15);color:#48cae4;border:1px solid rgba(0,180,216,0.3)}

/* Progress Bars */
.progress-bar{
  height:6px;border-radius:3px;background:${({ dark }) => dark ? 'rgba(0,180,216,0.1)' : 'rgba(0,150,199,0.08)'};
  overflow:hidden;
}

.progress-fill{
  height:100%;border-radius:3px;transition:width 0.3s ease;
  background:linear-gradient(90deg,#00b4d8,#48cae4);
}

/* Chart Bars */
.chart-bar{
  height:8px;border-radius:4px;background:${({ dark }) => dark ? 'rgba(0,180,216,0.1)' : 'rgba(0,150,199,0.08)'};
  overflow:hidden;margin:2px 0;
}

.chart-fill{
  height:100%;border-radius:4px;transition:width 0.5s cubic-bezier(.34,1.56,.64,1);
  background:linear-gradient(90deg,#00b4d8,#48cae4);
}

/* Metrics Grid */
.metric-card{
  background:${({ dark }) => dark ? 'rgba(15,26,47,0.3)' : 'rgba(230,243,255,0.3)'};
  border:1px solid ${({ dark }) => dark ? 'rgba(0,180,216,0.1)' : 'rgba(0,150,199,0.08)'};
  border-radius:12px;padding:16px;transition:all 0.2s;
}

.metric-card:hover{
  border-color:rgba(0,180,216,0.3);
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(0,180,216,0.1);
}

/* Word Cloud Placeholder */
.word-cloud{
  display:flex;flex-wrap:wrap;gap:8px;padding:16px;
  background:${({ dark }) => dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'};
  border-radius:12px;min-height:120px;
}

.word-cloud span{
  font-family:'Fira Code',monospace;transition:all 0.2s;
  cursor:default;opacity:0.8;
}

.word-cloud span:hover{
  opacity:1;transform:scale(1.1);color:var(--acc);
}
`;

// Icon System
const Icon = ({ name, size = 18, className = '' }) => {
  const icons = {
    file: <FileText size={size} className={className} />,
    copy: <Copy size={size} className={className} />,
    book: <BookOpen size={size} className={className} />,
    clock: <Clock size={size} className={className} />,
    type: <Type size={size} className={className} />,
    sparkles: <Sparkles size={size} className={className} />,
    trend: <TrendingUp size={size} className={className} />,
    bar: <BarChart size={size} className={className} />,
    pie: <PieChart size={size} className={className} />,
    brain: <Brain size={size} className={className} />,
    target: <Target size={size} className={className} />,
    award: <Award size={size} className={className} />,
    zap: <Zap size={size} className={className} />,
    activity: <Activity size={size} className={className} />,
    eye: <Eye size={size} className={className} />,
    eyeOff: <EyeOff size={size} className={className} />,
    download: <Download size={size} className={className} />,
    refresh: <RefreshCw size={size} className={className} />,
    hash: <Hash size={size} className={className} />,
    layers: <Layers size={size} className={className} />,
    grid: <Grid size={size} className={className} />,
    alert: <AlertCircle size={size} className={className} />,
    check: <CheckCircle size={size} className={className} />,
    sigma: <Sigma size={size} className={className} />,
    globe: <Globe size={size} className={className} />,
    lock: <Lock size={size} className={className} />,
    unlock: <Unlock size={size} className={className} />,
    star: <Star size={size} className={className} />,
    calendar: <Calendar size={size} className={className} />,
    filter: <Filter size={size} className={className} />,
    max: <Maximize size={size} className={className} />,
    min: <Minimize size={size} className={className} />,
    scissors: <Scissors size={size} className={className} />,
    quote: <Quote size={size} className={className} />,
    code: <Code size={size} className={className} />,
    align: <AlignLeft size={size} className={className} />,
    bold: <Bold size={size} className={className} />,
  };
  return icons[name] || null;
};

// Particle Background
const ParticleBackground = ({ dark }) => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 150 + 50,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: dark 
              ? `radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(0,150,199,0.05) 0%, transparent 70%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = memo(({ icon, label, value, sublabel, trend, isDarkMode, accent }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="metric-card"
  >
    <div className="flex items-start justify-between mb-2">
      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
        <Icon name={icon} size={16} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={12} className={trend > 0 ? '' : 'rotate-180'} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    <div className={`text-2xl font-bold mt-1`} style={{ color: accent || (isDarkMode ? 'white' : 'gray-900') }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    {sublabel && (
      <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {sublabel}
      </div>
    )}
  </motion.div>
));

// Main Component
const NeuralWordCounter = ({ isDarkMode: initialDarkMode = true, copyResult, showToast }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [text, setText] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState({ words: 1000, characters: 5000 });
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
    uniqueWords: 0,
    avgWordLength: 0,
    avgSentenceLength: 0,
    readingLevel: 0,
    density: 0,
  });

  const textareaRef = useRef(null);

  // Advanced text analysis
  const analyzeText = useCallback((inputText) => {
    if (!inputText.trim()) {
      setStats({
        words: 0, characters: 0, charactersNoSpaces: 0,
        sentences: 0, paragraphs: 0, lines: 0,
        readingTime: 0, speakingTime: 0, uniqueWords: 0,
        avgWordLength: 0, avgSentenceLength: 0, readingLevel: 0,
        density: 0,
      });
      return;
    }

    // Basic stats
    const words = inputText.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const lines = inputText.split('\n').length;

    // Advanced stats
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const avgWordLength = charactersNoSpaces / wordCount || 0;
    const avgSentenceLength = wordCount / sentenceCount || 0;
    
    // Reading level (Flesch-Kincaid approximation)
    const syllables = inputText.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiou]+/g)?.length || 0;
    const readingLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59;
    
    // Word density (unique words ratio)
    const density = (uniqueWords / wordCount) * 100 || 0;

    // Reading times
    const readingTime = Math.ceil(wordCount / 225);
    const speakingTime = Math.ceil(wordCount / 130);

    setStats({
      words: wordCount,
      characters,
      charactersNoSpaces,
      sentences: sentenceCount,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      uniqueWords,
      avgWordLength: avgWordLength.toFixed(1),
      avgSentenceLength: avgSentenceLength.toFixed(1),
      readingLevel: Math.max(0, Math.min(100, readingLevel.toFixed(0))),
      density: density.toFixed(1),
    });

    // Add to history if significant change
    if (wordCount > 0 && wordCount % 50 === 0) {
      setHistory(prev => [...prev.slice(-9), {
        timestamp: Date.now(),
        words: wordCount,
        chars: characters,
      }]);
    }
  }, []);

  // Update stats on text change
  useEffect(() => {
    analyzeText(text);
  }, [text, analyzeText]);

  // Copy stats
  const handleCopy = useCallback(() => {
    const statsText = `📊 Word Count Report\n` +
      `Words: ${stats.words}\n` +
      `Characters: ${stats.characters}\n` +
      `Sentences: ${stats.sentences}\n` +
      `Paragraphs: ${stats.paragraphs}\n` +
      `Reading Time: ${stats.readingTime} min\n` +
      `Unique Words: ${stats.uniqueWords}\n` +
      `Avg Word Length: ${stats.avgWordLength}\n` +
      `Reading Level: ${stats.readingLevel}`;
    
    copyResult(statsText);
    showToast?.('📋 Stats copied to clipboard!', 'success');
  }, [stats, copyResult, showToast]);

  // Clear text
  const clearText = useCallback(() => {
    if (text.length > 0 && window.confirm('Clear all text?')) {
      setText('');
      textareaRef.current?.focus();
      showToast?.('Text cleared', 'info');
    }
  }, [text, showToast]);

  // Load sample
  const loadSample = useCallback(() => {
    const sample = `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet. 

Writing is a powerful skill that allows us to communicate ideas, share stories, and express our thoughts. Whether you're drafting an essay, writing a research paper, or composing an email, word count matters.

This is a sample paragraph to demonstrate the word counter functionality. Try typing or pasting your own text to see the statistics update in real-time!

The art of writing requires practice, dedication, and attention to detail. Every word you choose impacts your message's clarity and effectiveness. Consider your audience, purpose, and tone when crafting your content.

Advanced analytics can reveal insights about your writing style, including word choice patterns, sentence structure preferences, and overall readability. Use these insights to improve your writing over time.`;
    
    setText(sample);
    showToast?.('📄 Sample loaded', 'info');
  }, [showToast]);

  // Export report
  const exportReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      text: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      stats,
      goals,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `word-count-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('📊 Report exported!', 'success');
  }, [text, stats, goals, showToast]);

  // Word frequency analysis
  const wordFrequency = useMemo(() => {
    if (!text.trim()) return [];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
      if (word.length > 3) { // Skip small words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }, [text]);

  // Progress towards goals
  const wordProgress = Math.min(100, (stats.words / goals.words) * 100);
  const charProgress = Math.min(100, (stats.characters / goals.characters) * 100);

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark ? 'dark' : 'light'}>
        {dark && <div className="scanline" />}
        <ParticleBackground dark={dark} />

        <div className="relative min-h-screen p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur-xl opacity-50" />
                  <div className="relative p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl">
                    <Icon name="brain" size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Neural Writing Analytics
                    <Icon name="sparkles" size={20} className="text-yellow-400 animate-pulse" />
                  </h1>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Advanced word counter • Real-time analysis • Writing insights
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={loadSample} className="btn-secondary">
                  <Icon name="book" size={14} />
                  Sample
                </button>
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="btn-secondary">
                  <Icon name="brain" size={14} />
                  {showAdvanced ? 'Basic' : 'Advanced'}
                </button>
                <button onClick={() => setDark(!dark)} className="btn-secondary">
                  {dark ? <Icon name="eye" size={14} /> : <Icon name="eyeOff" size={14} />}
                  Theme
                </button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            {stats.words > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-5 gap-4 mt-4"
              >
                <QuickStat label="Words" value={stats.words} icon="type" dark={dark} />
                <QuickStat label="Characters" value={stats.characters} icon="file" dark={dark} />
                <QuickStat label="Sentences" value={stats.sentences} icon="align" dark={dark} />
                <QuickStat label="Reading Time" value={`${stats.readingTime}m`} icon="clock" dark={dark} />
                <QuickStat label="Uniqueness" value={`${stats.density}%`} icon="sigma" dark={dark} />
              </motion.div>
            )}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Goals & Progress */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3 space-y-4"
            >
              {/* Writing Goals */}
              <div className="glass-card">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="target" size={16} className="text-cyan-500" />
                  <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Writing Goals</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Word Goal</span>
                      <span className="text-cyan-500">{stats.words} / {goals.words}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${wordProgress}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Character Goal</span>
                      <span className="text-cyan-500">{stats.characters} / {goals.characters}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${charProgress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => setGoals({ words: 500, characters: 2500 })}
                      className="btn-secondary text-xs py-1"
                    >
                      Short
                    </button>
                    <button
                      onClick={() => setGoals({ words: 1000, characters: 5000 })}
                      className="btn-secondary text-xs py-1"
                    >
                      Medium
                    </button>
                  </div>
                </div>
              </div>

              {/* Word Frequency */}
              {wordFrequency.length > 0 && (
                <div className="glass-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="hash" size={16} className="text-cyan-500" />
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Top Words</h3>
                  </div>
                  <div className="space-y-2">
                    {wordFrequency.map(({ word, count }, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`text-xs w-16 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {count}x
                        </span>
                        <div className="flex-1 chart-bar">
                          <div 
                            className="chart-fill" 
                            style={{ width: `${(count / wordFrequency[0].count) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="glass-card">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="zap" size={16} className="text-yellow-500" />
                  <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Writing Tips</h3>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">•</span>
                    <span className={dark ? 'text-gray-400' : 'text-gray-600'}>
                      {stats.avgSentenceLength > 20 
                        ? 'Sentences are long - consider breaking them up'
                        : 'Good sentence length for readability'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">•</span>
                    <span className={dark ? 'text-gray-400' : 'text-gray-600'}>
                      {stats.density < 40
                        ? 'Try using more varied vocabulary'
                        : 'Good vocabulary diversity'}
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-9 space-y-4"
            >
              {/* Text Input */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
                      <Icon name="file" size={18} className={dark ? 'text-cyan-400' : 'text-cyan-600'} />
                    </div>
                    <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Your Text
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={clearText} className="btn-icon">
                      <Icon name="refresh" size={14} />
                    </button>
                    <button onClick={() => setExpandedView(!expandedView)} className="btn-icon">
                      <Icon name={expandedView ? 'min' : 'max'} size={14} />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start typing or paste your text here for real-time analysis..."
                  className={`glass-input ${expandedView ? 'h-96' : 'h-48'} transition-all duration-300`}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={stats.words === 0}
                      className="btn-primary"
                    >
                      <Icon name="copy" size={16} />
                      Copy Stats
                    </button>
                    <button
                      onClick={exportReport}
                      disabled={stats.words === 0}
                      className="btn-secondary"
                    >
                      <Icon name="download" size={14} />
                      Export
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Icon name="clock" size={14} className="inline mr-1" />
                      Last update: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon="type" 
                  label="Total Words" 
                  value={stats.words} 
                  isDarkMode={dark}
                  trend={stats.words > 0 ? 12 : 0}
                />
                <StatCard 
                  icon="file" 
                  label="Characters" 
                  value={stats.characters} 
                  sublabel={`${stats.charactersNoSpaces} no spaces`}
                  isDarkMode={dark}
                />
                <StatCard 
                  icon="align" 
                  label="Sentences" 
                  value={stats.sentences} 
                  sublabel={`Avg ${stats.avgSentenceLength} words`}
                  isDarkMode={dark}
                />
                <StatCard 
                  icon="layers" 
                  label="Paragraphs" 
                  value={stats.paragraphs} 
                  sublabel={`${stats.lines} lines`}
                  isDarkMode={dark}
                />
                <StatCard 
                  icon="clock" 
                  label="Reading Time" 
                  value={`${stats.readingTime} min`} 
                  sublabel={`${stats.speakingTime} min speaking`}
                  isDarkMode={dark}
                />
                <StatCard 
                  icon="sigma" 
                  label="Unique Words" 
                  value={stats.uniqueWords} 
                  sublabel={`${stats.density}% density`}
                  isDarkMode={dark}
                  accent="#34d399"
                />
                <StatCard 
                  icon="hash" 
                  label="Avg Word Length" 
                  value={stats.avgWordLength} 
                  sublabel="characters"
                  isDarkMode={dark}
                />
                <StatCard 
                  icon="brain" 
                  label="Reading Level" 
                  value={stats.readingLevel} 
                  sublabel={stats.readingLevel < 50 ? 'Easy' : stats.readingLevel < 70 ? 'Moderate' : 'Complex'}
                  isDarkMode={dark}
                  accent={stats.readingLevel < 50 ? '#34d399' : stats.readingLevel < 70 ? '#fbbf24' : '#f87171'}
                />
              </div>

              {/* Advanced Analytics */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="brain" size={18} className="text-purple-500" />
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Advanced Writing Analytics
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Readability Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Readability Score
                        </span>
                        <span className="text-lg font-bold text-cyan-500">
                          {stats.readingLevel}
                        </span>
                      </div>
                      <div className="progress-bar h-3">
                        <div className="progress-fill" style={{ width: `${stats.readingLevel}%` }} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <div className="text-center">
                          <div className="text-green-500">Easy</div>
                          <div className={dark ? 'text-gray-500' : 'text-gray-400'}>&lt;50</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-500">Moderate</div>
                          <div className={dark ? 'text-gray-500' : 'text-gray-400'}>50-70</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-500">Complex</div>
                          <div className={dark ? 'text-gray-500' : 'text-gray-400'}>&gt;70</div>
                        </div>
                      </div>
                    </div>

                    {/* Word Distribution */}
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Word Length Distribution
                      </h4>
                      <div className="space-y-1">
                        {[1,2,3,4,5,6,7,8].map(len => (
                          <div key={len} className="flex items-center gap-2">
                            <span className={`text-xs w-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {len} chars
                            </span>
                            <div className="flex-1 chart-bar">
                              <div 
                                className="chart-fill" 
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Writing Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : 0}
                      </div>
                      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Avg Word Length
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}
                      </div>
                      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Words/Sentence
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.paragraphs > 0 ? (stats.sentences / stats.paragraphs).toFixed(1) : 0}
                      </div>
                      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sentences/Paragraph
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.density}%
                      </div>
                      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lexical Density
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History Timeline */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="activity" size={16} className="text-cyan-500" />
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Writing Progress
                    </h3>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {history.map((item, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 p-3 rounded-lg bg-cyan-900/20 w-32 text-center"
                      >
                        <div className="text-lg font-bold text-cyan-500">
                          {item.words}
                        </div>
                        <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          words
                        </div>
                        <div className={`text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Educational Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Icon name="book" size={20} className="text-white" />
                  </div>
                  <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Understanding Your Writing Analytics
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-bold mb-2 text-cyan-500">Reading Time</h3>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Average adult reads 225-250 words per minute. Use this to plan presentations and estimate audience engagement.
                    </p>
                  </div>
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-bold mb-2 text-green-500">Lexical Density</h3>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ratio of unique to total words. Higher density indicates richer vocabulary (40-60% is typical for good writing).
                    </p>
                  </div>
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-bold mb-2 text-yellow-500">Readability</h3>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Flesch-Kincaid grade level. Lower scores are easier to read. Aim for 60-70 for general audiences.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

// Quick Stat Component
const QuickStat = ({ label, value, icon, dark }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg ${dark ? 'bg-cyan-900/20' : 'bg-cyan-50'}`}>
    <Icon name={icon} size={14} className={dark ? 'text-cyan-400' : 'text-cyan-600'} />
    <div>
      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
    </div>
  </div>
);

export default memo(NeuralWordCounter);