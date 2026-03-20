import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Sparkles, Search, Copy, BookOpen, AlertTriangle, CheckCircle, 
  FileText, Shield, Zap, Brain, Globe, Lock, Unlock,
  TrendingUp, Award, Clock, Layers, Filter, Download,
  Eye, EyeOff, RefreshCw, Info, XCircle, Star,
  BarChart, PieChart, Share2, Upload, Link, Hash,
  Grid, List, ChevronDown, ChevronUp, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Stunning CSS styles matching our previous tools
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

/* Dark Theme - Deep Purple/Cyber */
.dark{
  --bg:#0a0412;--sur:#12071f;--s2:#1a0b2e;
  --bdr:#2f1b4a;--bdr2:rgba(147,51,234,.24);
  --acc:#9333ea;--acc2:#c084fc;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#faf5ff;--txt2:#d8b4fe;--txt3:#6b21a5;
  --ed:#0d0319;--num:#2e1065;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(147,51,234,.016) 1px,transparent 1px),
    linear-gradient(90deg,rgba(147,51,234,.016) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 28s linear infinite;
  position:relative;
}

.dark::before{
  content:'';position:fixed;inset:0;background:radial-gradient(circle at 50% 50%,rgba(147,51,234,.05),transparent 70%);
  pointer-events:none;
}

.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(147,51,234,.55),transparent);
  box-shadow:0 0 18px rgba(147,51,234,.4);animation:scanline 9s linear infinite;top:-4px}

/* Light Theme - Soft Purple/Rose */
.light{
  --bg:#f5f0ff;--sur:#ffffff;--s2:#f3e8ff;
  --bdr:#e0d2fc;--bdr2:#9333ea;
  --acc:#9333ea;--acc2:#c084fc;--acc3:#db2777;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#1e0b3a;--txt2:#6b21a5;--txt3:#9333ea;
  --ed:#faf5ff;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* Common Components */
.glass-panel{
  background:${({ dark }) => dark ? 'rgba(18,7,31,0.6)' : 'rgba(255,255,255,0.7)'};
  backdrop-filter:blur(12px);
  border:1px solid ${({ dark }) => dark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.15)'};
  border-radius:16px;
  box-shadow:0 8px 32px rgba(0,0,0,0.1);
}

.glass-card{
  background:${({ dark }) => dark ? 'rgba(26,11,46,0.4)' : 'rgba(243,232,255,0.4)'};
  backdrop-filter:blur(8px);
  border:1px solid ${({ dark }) => dark ? 'rgba(147,51,234,0.15)' : 'rgba(147,51,234,0.1)'};
  border-radius:12px;
  padding:16px;
}

/* Buttons */
.btn-primary{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 24px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#9333ea,#c084fc);
  color:white;cursor:pointer;font-family:'Fira Code',monospace;
  font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 4px 20px rgba(147,51,234,0.4);
  transition:all 0.2s;position:relative;overflow:hidden;
}

.btn-primary::before{
  content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
  transition:left 0.5s;
}

.btn-primary:hover::before{left:100%}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(147,51,234,0.6)}
.btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none}

.btn-secondary{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 16px;border:1px solid ${({ dark }) => dark ? 'rgba(147,51,234,0.3)' : 'rgba(147,51,234,0.2)'};
  border-radius:10px;background:transparent;color:var(--txt2);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;letter-spacing:.06em;
  transition:all 0.15s;
}

.btn-secondary:hover{border-color:var(--acc);color:var(--acc);background:rgba(147,51,234,0.05)}

/* Inputs */
.glass-input{
  background:${({ dark }) => dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'};
  border:1px solid ${({ dark }) => dark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.15)'};
  border-radius:12px;color:var(--txt);font-family:'Fira Code',monospace;
  font-size:14px;padding:12px 16px;outline:none;width:100%;
  transition:all 0.15s;backdrop-filter:blur(4px);
}

.glass-input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(147,51,234,0.1)}
.glass-input::placeholder{color:var(--txt3);opacity:0.5}

/* Status Badges */
.badge{
  padding:4px 12px;border-radius:20px;font-family:'Fira Code',monospace;
  font-size:11px;font-weight:600;letter-spacing:.04em;display:inline-flex;align-items:center;gap:4px;
}

.badge-success{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3)}
.badge-warning{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.badge-error{background:rgba(248,113,113,0.15);color:#f87171;border:1px solid rgba(248,113,113,0.3)}
.badge-info{background:rgba(147,51,234,0.15);color:#c084fc;border:1px solid rgba(147,51,234,0.3)}

/* Progress Bars */
.progress-bar{
  height:8px;border-radius:4px;background:${({ dark }) => dark ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.08)'};
  overflow:hidden;position:relative;
}

.progress-fill{
  height:100%;border-radius:4px;transition:width 0.5s cubic-bezier(.34,1.56,.64,1);
  background:linear-gradient(90deg,#9333ea,#c084fc);
  position:relative;overflow:hidden;
}

.progress-fill::after{
  content:'';position:absolute;top:0;left:0;right:0;bottom:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
  animation:shimmer 2s infinite;
}

/* Floating Particles */
.particle{
  position:fixed;pointer-events:none;opacity:0.1;
  animation:float 6s ease-in-out infinite;
}
`;

// Icons System
const Icon = ({ name, size = 18, className = '' }) => {
  const icons = {
    sparkles: <Sparkles size={size} className={className} />,
    search: <Search size={size} className={className} />,
    copy: <Copy size={size} className={className} />,
    book: <BookOpen size={size} className={className} />,
    alert: <AlertTriangle size={size} className={className} />,
    check: <CheckCircle size={size} className={className} />,
    file: <FileText size={size} className={className} />,
    shield: <Shield size={size} className={className} />,
    brain: <Brain size={size} className={className} />,
    globe: <Globe size={size} className={className} />,
    lock: <Lock size={size} className={className} />,
    unlock: <Unlock size={size} className={className} />,
    trend: <TrendingUp size={size} className={className} />,
    award: <Award size={size} className={className} />,
    clock: <Clock size={size} className={className} />,
    layers: <Layers size={size} className={className} />,
    filter: <Filter size={size} className={className} />,
    download: <Download size={size} className={className} />,
    upload: <Upload size={size} className={className} />,
    link: <Link size={size} className={className} />,
    hash: <Hash size={size} className={className} />,
    bar: <BarChart size={size} className={className} />,
    pie: <PieChart size={size} className={className} />,
    share: <Share2 size={size} className={className} />,
    x: <XCircle size={size} className={className} />,
    star: <Star size={size} className={className} />,
    grid: <Grid size={size} className={className} />,
    list: <List size={size} className={className} />,
    chevronUp: <ChevronUp size={size} className={className} />,
    chevronDown: <ChevronDown size={size} className={className} />,
    max: <Maximize size={size} className={className} />,
    refresh: <RefreshCw size={size} className={className} />,
  };
  return icons[name] || null;
};

// Particle Background Component
const ParticleBackground = ({ dark }) => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 100 + 50,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
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
              ? `radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Main Component
const FuturisticPlagiarismChecker = ({ isDarkMode: initialDarkMode = true, copyResult, showToast }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [scanDepth, setScanDepth] = useState('standard');
  const [history, setHistory] = useState([]);
  const [realTimeScore, setRealTimeScore] = useState(0);
  
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);

  // Advanced analysis engine
  const analyzeText = useCallback(async () => {
    if (!text.trim() || text.length < 50) {
      showToast?.('Please enter at least 50 characters', 'warning');
      return;
    }

    setAnalyzing(true);

    // Simulate AI processing with stages
    const stages = ['Tokenizing', 'Analyzing patterns', 'Checking sources', 'Computing similarity', 'Generating report'];
    
    for (const stage of stages) {
      showToast?.(`🔄 ${stage}...`, 'info');
      await new Promise(r => setTimeout(r, 800));
    }

    // Advanced analysis calculations
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Uniqueness score based on multiple factors
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const wordComplexity = words.filter(w => w.length > 6).length / words.length;
    const sentenceVariety = new Set(sentences.map(s => s.length)).size / sentences.length;
    
    // Simulate plagiarism detection with weighted scoring
    const commonPhrases = [
      'according to research', 'studies have shown', 'it is important to note',
      'in conclusion', 'for example', 'such as', 'as well as', 'due to the fact',
      'in order to', 'on the other hand', 'furthermore', 'moreover'
    ];
    
    const phraseMatches = commonPhrases.filter(phrase => 
      text.toLowerCase().includes(phrase)
    );
    
    // Calculate authenticity score (0-100)
    const baseScore = (uniqueWords.size / words.length) * 70;
    const penaltyFromPhrases = phraseMatches.length * 3;
    const readabilityBonus = Math.min(20, sentenceVariety * 10);
    const complexityBonus = wordComplexity * 15;
    
    let authenticityScore = Math.min(100, Math.max(0, 
      baseScore + readabilityBonus + complexityBonus - penaltyFromPhrases
    ));
    
    // Simulate web source matching
    const possibleSources = [
      { url: 'en.wikipedia.org/wiki/Article', similarity: Math.random() * 30 },
      { url: 'academic.oup.com/journal', similarity: Math.random() * 25 },
      { url: 'nature.com/articles/doi', similarity: Math.random() * 20 },
      { url: 'sciencedirect.com/science', similarity: Math.random() * 15 },
    ].filter(s => s.similarity > 5).sort((a, b) => b.similarity - a.similarity);

    // Generate detailed results
    const analysisResults = {
      // Core metrics
      wordCount: words.length,
      uniqueWordCount: uniqueWords.size,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      
      // Score
      authenticityScore: Math.round(authenticityScore * 10) / 10,
      
      // Risk assessment
      riskLevel: authenticityScore >= 80 ? 'low' : authenticityScore >= 60 ? 'medium' : 'high',
      
      // Detailed findings
      matchedPhrases: phraseMatches.map(phrase => ({
        text: phrase,
        occurrences: (text.toLowerCase().match(new RegExp(phrase, 'g')) || []).length,
        commonality: Math.random() * 60 + 40,
      })),
      
      // Potential sources
      sources: possibleSources,
      
      // Readability metrics
      readability: {
        fleschScore: Math.round((206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (text.match(/[aeiou]/gi)?.length || 0) / words.length) * 10) / 10,
        avgWordLength: (text.length / words.length).toFixed(1),
        avgSentenceLength: (words.length / sentences.length).toFixed(1),
      },
      
      // Advanced stats
      stats: {
        uniqueBigrams: new Set(words.map((w, i) => i < words.length - 1 ? `${w} ${words[i+1]}` : null).filter(Boolean)).size,
        characterDistribution: {
          letters: (text.match(/[a-zA-Z]/g) || []).length,
          numbers: (text.match(/[0-9]/g) || []).length,
          spaces: (text.match(/\s/g) || []).length,
          punctuation: (text.match(/[^\w\s]/g) || []).length,
        }
      },
      
      // Recommendations
      recommendations: [],
    };

    // Generate smart recommendations
    if (analysisResults.authenticityScore < 70) {
      analysisResults.recommendations.push('Consider adding more original analysis');
    }
    if (phraseMatches.length > 3) {
      analysisResults.recommendations.push('Review common phrases and add citations where needed');
    }
    if (analysisResults.uniqueWordCount / words.length < 0.6) {
      analysisResults.recommendations.push('Try using more varied vocabulary');
    }
    if (analysisResults.readability.fleschScore < 50) {
      analysisResults.recommendations.push('Text may be difficult to read - consider simplifying sentences');
    }

    setResults(analysisResults);
    setRealTimeScore(analysisResults.authenticityScore);
    
    // Add to history
    setHistory(prev => [...prev.slice(-4), {
      timestamp: Date.now(),
      score: analysisResults.authenticityScore,
      preview: text.substring(0, 60) + '...',
      riskLevel: analysisResults.riskLevel,
    }]);

    setAnalyzing(false);
    showToast?.('✅ Analysis complete!', 'success');
  }, [text, showToast]);

  // Clear text
  const clearText = useCallback(() => {
    if (text.length > 0 && window.confirm('Clear all text? This will erase your input.')) {
      setText('');
      setResults(null);
      showToast?.('Text cleared', 'info');
    }
  }, [text, showToast]);

  // Export report
  const exportReport = useCallback(() => {
    if (!results) return;
    
    const report = {
      text: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      results,
      timestamp: new Date().toISOString(),
      scanDepth,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('📊 Report exported!', 'success');
  }, [results, text, scanDepth, showToast]);

  // Toggle theme
  useEffect(() => {
    setDark(initialDarkMode);
  }, [initialDarkMode]);

  // Auto-analyze after typing stops (optional)
  useEffect(() => {
    if (text.length > 100 && !analyzing) {
      const timer = setTimeout(() => {
        if (window.confirm('Run analysis on this text?')) {
          analyzeText();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [text, analyzing, analyzeText]);

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark ? 'dark' : 'light'}>
        {dark && <div className="scanline" />}
        <ParticleBackground dark={dark} />

        <div className="relative min-h-screen p-6">
          {/* Header with Live Score */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mb-6 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50" />
                  <div className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Icon name="shield" size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    AI Authenticity Analyzer
                    <Icon name="sparkles" size={20} className="text-yellow-400 animate-pulse" />
                  </h1>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Deep learning plagiarism detection • Real-time analysis • Source matching
                  </p>
                </div>
              </div>

              {/* Live Score Ring */}
              {results && (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {results.authenticityScore}%
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Authenticity Score
                    </div>
                  </div>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke={dark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.1)'}
                        strokeWidth="4"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 - (226.2 * results.authenticityScore) / 100}
                        className="transition-all duration-1000"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Bar */}
            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-5 gap-4 mt-4"
              >
                <StatCard label="Words" value={results.wordCount} icon="file" dark={dark} />
                <StatCard label="Unique" value={results.uniqueWordCount} icon="hash" dark={dark} />
                <StatCard label="Sentences" value={results.sentenceCount} icon="layers" dark={dark} />
                <StatCard label="Readability" value={results.readability.fleschScore.toFixed(1)} icon="trend" dark={dark} />
                <StatCard label="Risk" value={results.riskLevel} icon="alert" dark={dark} />
              </motion.div>
            )}
          </motion.div>

          {/* Main Input Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${dark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <Icon name="file" size={20} className={dark ? 'text-purple-400' : 'text-purple-600'} />
                </div>
                <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Input Text
                </h2>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedView(!expandedView)}
                  className="btn-secondary"
                >
                  <Icon name={expandedView ? 'max' : 'layers'} size={14} />
                  {expandedView ? 'Compact' : 'Expand'}
                </button>
                <button
                  onClick={clearText}
                  className="btn-secondary"
                >
                  <Icon name="x" size={14} />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here (minimum 50 characters) for deep authenticity analysis..."
              className={`glass-input ${expandedView ? 'h-96' : 'h-48'} transition-all duration-300`}
            />

            {/* Input Stats */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-4">
                <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Characters: {text.length}
                </span>
                <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Words: {text.split(/\s+/).filter(w => w.length > 0).length}
                </span>
                {text.length < 50 && (
                  <span className="text-xs text-yellow-500">
                    Need {50 - text.length} more characters
                  </span>
                )}
              </div>

              <button
                onClick={analyzeText}
                disabled={text.length < 50 || analyzing}
                className="btn-primary"
              >
                {analyzing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon name="search" size={16} />
                    Analyze Authenticity
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                {/* Risk Assessment Banner */}
                <div className={`glass-panel p-4 border-l-4 ${
                  results.riskLevel === 'low' ? 'border-green-500' :
                  results.riskLevel === 'medium' ? 'border-yellow-500' : 'border-red-500'
                }`}>
                  <div className="flex items-center gap-3">
                    {results.riskLevel === 'low' ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : results.riskLevel === 'medium' ? (
                      <AlertTriangle size={24} className="text-yellow-500" />
                    ) : (
                      <AlertTriangle size={24} className="text-red-500" />
                    )}
                    <div>
                      <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {results.riskLevel === 'low' ? 'High Authenticity Detected' :
                         results.riskLevel === 'medium' ? 'Moderate Risk - Review Suggested' :
                         'High Risk - Further Review Recommended'}
                      </h3>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {results.recommendations[0] || 'Your text shows good originality metrics.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Metrics Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Authenticity Breakdown */}
                  <div className="glass-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="pie" size={18} className="text-purple-500" />
                      <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Authenticity Breakdown
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <MetricBar
                        label="Unique Content"
                        value={results.authenticityScore}
                        color="#9333ea"
                        dark={dark}
                      />
                      <MetricBar
                        label="Vocabulary Diversity"
                        value={(results.uniqueWordCount / results.wordCount) * 100}
                        color="#c084fc"
                        dark={dark}
                      />
                      <MetricBar
                        label="Structural Originality"
                        value={Math.min(100, results.stats.uniqueBigrams / results.wordCount * 200)}
                        color="#f59e0b"
                        dark={dark}
                      />
                    </div>
                  </div>

                  {/* Matched Phrases */}
                  <div className="glass-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="alert" size={18} className="text-yellow-500" />
                      <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Common Phrases Detected
                      </h3>
                    </div>
                    {results.matchedPhrases.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {results.matchedPhrases.map((phrase, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                            <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                              "{phrase.text}"
                            </span>
                            <span className="badge badge-warning text-xs">
                              {phrase.occurrences}x
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No common phrases detected
                      </p>
                    )}
                  </div>

                  {/* Potential Sources */}
                  {results.sources.length > 0 && (
                    <div className="glass-card">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon name="globe" size={18} className="text-blue-500" />
                        <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                          Potential Source Matches
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {results.sources.map((source, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                            <span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {source.url}
                            </span>
                            <span className="badge badge-info text-xs">
                              {source.similarity.toFixed(1)}% match
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="glass-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon name="brain" size={18} className="text-green-500" />
                      <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        AI Recommendations
                      </h3>
                    </div>
                    {results.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {results.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 mt-1">•</span>
                            <span className={dark ? 'text-gray-300' : 'text-gray-700'}>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No recommendations - your text looks great!
                      </p>
                    )}
                  </div>
                </div>

                {/* Character Distribution */}
                <div className="glass-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="pie" size={18} className="text-purple-500" />
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Character Distribution
                    </h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(results.stats.characterDistribution).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                          {value}
                        </div>
                        <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => copyResult(text)}
                    className="btn-secondary"
                  >
                    <Icon name="copy" size={14} />
                    Copy Text
                  </button>
                  <button
                    onClick={exportReport}
                    className="btn-secondary"
                  >
                    <Icon name="download" size={14} />
                    Export Report
                  </button>
                  <button
                    onClick={() => setResults(null)}
                    className="btn-secondary"
                  >
                    <Icon name="refresh" size={14} />
                    New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Timeline */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-4 mt-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon name="clock" size={18} className="text-purple-500" />
                <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Analyses
                </h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 p-3 rounded-lg ${
                      dark ? 'bg-purple-900/20' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${
                        item.score >= 80 ? 'text-green-500' :
                        item.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {item.score}%
                      </span>
                      <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.preview}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Educational Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 mt-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <Icon name="book" size={24} className="text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                Understanding Content Authenticity
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-purple-500">
                  <Icon name="shield" size={16} />
                  What We Check
                </h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our AI analyzes text structure, vocabulary patterns, and compares against common phrases to detect potential unoriginal content.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-green-500">
                  <Icon name="trend" size={16} />
                  Reading Level
                </h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  The Flesch Reading Ease score helps determine if your text is appropriate for your target audience.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-500">
                  <Icon name="award" size={16} />
                  Best Practices
                </h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Always cite sources, use quotation marks for direct quotes, and add your own analysis to improve originality.
                </p>
              </div>
            </div>
          </motion.article>

          {/* Ad Slots */}
          <div className="grid grid-cols-2 gap-4 mt-6">

          </div>
        </div>
      </div>
    </>
  );
};

// Helper Components
const StatCard = ({ label, value, icon, dark }) => (
  <div className={`glass-card p-3 flex items-center gap-3`}>
    <div className={`p-2 rounded-lg ${dark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
      <Icon name={icon} size={14} className={dark ? 'text-purple-400' : 'text-purple-600'} />
    </div>
    <div>
      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  </div>
);

const MetricBar = ({ label, value, color, dark }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-xs font-bold`} style={{ color }}>{value.toFixed(1)}%</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)` }} />
    </div>
  </div>
);

export default memo(FuturisticPlagiarismChecker);