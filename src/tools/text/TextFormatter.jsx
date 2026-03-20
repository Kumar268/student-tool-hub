import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Sparkles, Copy, BookOpen, Type, AlignLeft, 
  Wand2, Zap, Brain, Settings, Eye, EyeOff,
  RefreshCw, CheckCircle, AlertCircle, Info,
  Download, Upload, Trash, Filter, Hash,
  Sigma, Globe, Lock, Unlock, Grid, Layers,
  ArrowLeftRight, Code, Quote, Brackets,
  Star, Award, Clock, TrendingUp, BarChart,
  Minimize, Maximize, RotateCcw, Scissors
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
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}

/* Dark Theme - Cyber Purple */
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

/* Light Theme - Soft Lavender */
.light{
  --bg:#f5f0ff;--sur:#ffffff;--s2:#f3e8ff;
  --bdr:#e0d2fc;--bdr2:#9333ea;
  --acc:#9333ea;--acc2:#c084fc;--acc3:#db2777;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#1e0b3a;--txt2:#6b21a5;--txt3:#9333ea;
  --ed:#faf5ff;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* Glass Components */
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

.btn-icon{
  padding:8px;border-radius:8px;border:1px solid ${({ dark }) => dark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.15)'};
  background:transparent;color:var(--txt2);cursor:pointer;transition:all 0.15s;
}

.btn-icon:hover{border-color:var(--acc);color:var(--acc);background:rgba(147,51,234,0.05)}

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

/* Badges */
.badge{
  padding:4px 12px;border-radius:20px;font-family:'Fira Code',monospace;
  font-size:11px;font-weight:600;letter-spacing:.04em;display:inline-flex;align-items:center;gap:4px;
}

.badge-success{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3)}
.badge-warning{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
.badge-info{background:rgba(147,51,234,0.15);color:#c084fc;border:1px solid rgba(147,51,234,0.3)}

/* Progress Bars */
.progress-bar{
  height:4px;border-radius:2px;background:${({ dark }) => dark ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.08)'};
  overflow:hidden;
}

.progress-fill{
  height:100%;border-radius:2px;transition:width 0.3s ease;
  background:linear-gradient(90deg,#9333ea,#c084fc);
}

/* Toggle Switch */
.toggle{
  position:relative;display:inline-block;width:36px;height:20px;
}
.toggle input{opacity:0;width:0;height:0}
.toggle-sl{
  position:absolute;inset:0;border-radius:10px;cursor:pointer;
  background:${({ dark }) => dark ? 'rgba(147,51,234,0.2)' : 'rgba(147,51,234,0.15)'};
  transition:0.2s;
}
.toggle input:checked + .toggle-sl{background:var(--acc)}
.toggle-sl:before{
  content:'';position:absolute;left:2px;top:2px;width:16px;height:16px;
  border-radius:50%;background:white;transition:0.2s;
}
.toggle input:checked + .toggle-sl:before{transform:translateX(16px)}
`;

// Icon System
const Icon = ({ name, size = 18, className = '' }) => {
  const icons = {
    sparkles: <Sparkles size={size} className={className} />,
    copy: <Copy size={size} className={className} />,
    book: <BookOpen size={size} className={className} />,
    type: <Type size={size} className={className} />,
    align: <AlignLeft size={size} className={className} />,
    wand: <Wand2 size={size} className={className} />,
    zap: <Zap size={size} className={className} />,
    brain: <Brain size={size} className={className} />,
    settings: <Settings size={size} className={className} />,
    eye: <Eye size={size} className={className} />,
    eyeOff: <EyeOff size={size} className={className} />,
    refresh: <RefreshCw size={size} className={className} />,
    check: <CheckCircle size={size} className={className} />,
    alert: <AlertCircle size={size} className={className} />,
    info: <Info size={size} className={className} />,
    download: <Download size={size} className={className} />,
    upload: <Upload size={size} className={className} />,
    trash: <Trash size={size} className={className} />,
    filter: <Filter size={size} className={className} />,
    hash: <Hash size={size} className={className} />,
    sigma: <Sigma size={size} className={className} />,
    globe: <Globe size={size} className={className} />,
    lock: <Lock size={size} className={className} />,
    unlock: <Unlock size={size} className={className} />,
    grid: <Grid size={size} className={className} />,
    layers: <Layers size={size} className={className} />,
    arrow: <ArrowLeftRight size={size} className={className} />,
    code: <Code size={size} className={className} />,
    quote: <Quote size={size} className={className} />,
    brackets: <Brackets size={size} className={className} />,
    star: <Star size={size} className={className} />,
    award: <Award size={size} className={className} />,
    clock: <Clock size={size} className={className} />,
    trend: <TrendingUp size={size} className={className} />,
    bar: <BarChart size={size} className={className} />,
    min: <Minimize size={size} className={className} />,
    max: <Maximize size={size} className={className} />,
    rotate: <RotateCcw size={size} className={className} />,
    scissors: <Scissors size={size} className={className} />,
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
              ? `radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(147,51,234,0.05) 0%, transparent 70%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Main Component
const NeuralTextFormatter = ({ isDarkMode: initialDarkMode = true, copyResult, showToast }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [text, setText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [activeTab, setActiveTab] = useState('format');
  const [expandedView, setExpandedView] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    original: { chars: 0, words: 0, lines: 0, spaces: 0 },
    formatted: { chars: 0, words: 0, lines: 0, spaces: 0 },
    saved: { chars: 0, spaces: 0 }
  });

  // Advanced formatting options
  const [options, setOptions] = useState({
    // Basic
    trimWhitespace: true,
    removeExtraSpaces: true,
    removeLineBreaks: false,
    
    // Advanced
    normalizeQuotes: false,
    normalizeDashes: false,
    removeInvisibleChars: true,
    normalizeUnicode: false,
    
    // Punctuation
    fixPunctuationSpacing: true,
    removeDuplicatePunctuation: false,
    smartQuotes: false,
    
    // Case
    sentenceCase: false,
    titleCase: false,
    invertCase: false,
    
    // Cleanup
    removeEmptyLines: true,
    removeExtraCommas: false,
    normalizeWhitespace: true,
    
    // Special
    removeUrls: false,
    removeEmails: false,
    removeNumbers: false,
    preserveLineBreaks: true,
  });

  const textareaRef = useRef(null);

  // Advanced formatting engine
  const formatText = useCallback((inputText, formatOptions) => {
    let result = inputText;
    const transformations = [];

    // Track original stats
    const originalStats = {
      chars: inputText.length,
      words: inputText.split(/\s+/).filter(w => w.length > 0).length,
      lines: inputText.split('\n').length,
      spaces: (inputText.match(/\s/g) || []).length,
    };

    // Apply transformations in optimal order
    
    // 1. Normalize line endings first
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 2. Remove invisible characters
    if (formatOptions.removeInvisibleChars) {
      const before = result.length;
      result = result.replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (result.length < before) transformations.push('Removed invisible chars');
    }

    // 3. Normalize Unicode
    if (formatOptions.normalizeUnicode) {
      result = result.normalize('NFKC');
      transformations.push('Normalized Unicode');
    }

    // 4. Remove extra spaces
    if (formatOptions.removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
      transformations.push('Removed extra spaces');
    }

    // 5. Handle line breaks
    if (formatOptions.removeLineBreaks && !formatOptions.preserveLineBreaks) {
      result = result.replace(/\n+/g, ' ');
      transformations.push('Removed line breaks');
    } else if (formatOptions.removeEmptyLines) {
      result = result.replace(/\n\s*\n/g, '\n');
      transformations.push('Removed empty lines');
    }

    // 6. Fix punctuation spacing
    if (formatOptions.fixPunctuationSpacing) {
      result = result.replace(/\s+([.,!?;:])/g, '$1');
      result = result.replace(/([.,!?;:])\s{2,}/g, '$1 ');
      transformations.push('Fixed punctuation spacing');
    }

    // 7. Remove duplicate punctuation
    if (formatOptions.removeDuplicatePunctuation) {
      result = result.replace(/([.,!?])\1+/g, '$1');
      transformations.push('Removed duplicate punctuation');
    }

    // 8. Normalize quotes
    if (formatOptions.normalizeQuotes) {
      result = result.replace(/[''""]/g, '"');
      transformations.push('Normalized quotes');
    }

    // 9. Smart quotes
    if (formatOptions.smartQuotes) {
      result = result.replace(/"([^"]*)"/g, '“$1”');
      transformations.push('Applied smart quotes');
    }

    // 10. Normalize dashes
    if (formatOptions.normalizeDashes) {
      result = result.replace(/[–—]/g, '-');
      transformations.push('Normalized dashes');
    }

    // 11. Case transformations
    if (formatOptions.sentenceCase) {
      result = result.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      transformations.push('Applied sentence case');
    }
    if (formatOptions.titleCase) {
      result = result.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      transformations.push('Applied title case');
    }
    if (formatOptions.invertCase) {
      result = result.split('').map(c => 
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      ).join('');
      transformations.push('Inverted case');
    }

    // 12. Remove special content
    if (formatOptions.removeUrls) {
      result = result.replace(/https?:\/\/[^\s]+/g, '[URL]');
      transformations.push('Removed URLs');
    }
    if (formatOptions.removeEmails) {
      result = result.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[EMAIL]');
      transformations.push('Removed emails');
    }
    if (formatOptions.removeNumbers) {
      result = result.replace(/\b\d+\b/g, '');
      transformations.push('Removed numbers');
    }

    // 13. Remove extra commas
    if (formatOptions.removeExtraCommas) {
      result = result.replace(/,+/g, ',');
      transformations.push('Removed extra commas');
    }

    // 14. Final trim
    if (formatOptions.trimWhitespace) {
      result = result.trim();
      transformations.push('Trimmed whitespace');
    }

    // Calculate formatted stats
    const formattedStats = {
      chars: result.length,
      words: result.split(/\s+/).filter(w => w.length > 0).length,
      lines: result.split('\n').length,
      spaces: (result.match(/\s/g) || []).length,
    };

    return {
      result,
      stats: {
        original: originalStats,
        formatted: formattedStats,
        saved: {
          chars: originalStats.chars - formattedStats.chars,
          spaces: originalStats.spaces - formattedStats.spaces,
        }
      },
      transformations
    };
  }, []);

  // Handle format
  const handleFormat = useCallback(() => {
    if (!text.trim()) {
      showToast?.('Please enter some text to format', 'warning');
      return;
    }

    setProcessing(true);
    
    // Simulate processing time for effect
    setTimeout(() => {
      const { result, stats: newStats, transformations } = formatText(text, options);
      setFormattedText(result);
      setStats(newStats);
      
      // Add to history
      setHistory(prev => [...prev.slice(-4), {
        timestamp: Date.now(),
        preview: result.substring(0, 50) + '...',
        saved: newStats.saved.chars,
        transformations: transformations.length,
      }]);

      showToast?.(`✨ Formatted! Saved ${newStats.saved.chars} characters`, 'success');
      setProcessing(false);
    }, 500);
  }, [text, options, formatText, showToast]);

  // Apply formatted text
  const applyFormatting = useCallback(() => {
    setText(formattedText);
    setFormattedText('');
    showToast?.('✅ Formatted text applied', 'success');
  }, [formattedText, showToast]);

  // Reset to original
  const resetText = useCallback(() => {
    setFormattedText('');
    showToast?.('↺ Reset to original', 'info');
  }, [showToast]);

  // Clear all
  const clearAll = useCallback(() => {
    if (text.length > 0 && window.confirm('Clear all text?')) {
      setText('');
      setFormattedText('');
      showToast?.('Text cleared', 'info');
    }
  }, [text, showToast]);

  // Export text
  const exportText = useCallback(() => {
    const textToExport = formattedText || text;
    if (!textToExport) return;
    
    const blob = new Blob([textToExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('📥 Text exported!', 'success');
  }, [text, formattedText, showToast]);

  // Load sample
  const loadSample = useCallback(() => {
    const sample = `The  Quick   Brown  Fox    jumps over   the lazy  dog.

This is a   sample text with   multiple    spaces,  extra  commas,, and    line breaks.

"Don't forget" about 'quotes' and -- dashes --.

Check out https://example.com and email@test.com for more.

Numbers: 123 456 789

The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.`;
    
    setText(sample);
    showToast?.('📄 Sample loaded', 'info');
  }, [showToast]);

  // Toggle option
  const toggleOption = useCallback((key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Group options
  const optionGroups = [
    {
      title: 'Basic Cleaning',
      icon: 'wand',
      options: [
        { key: 'trimWhitespace', label: 'Trim Whitespace', desc: 'Remove leading/trailing spaces' },
        { key: 'removeExtraSpaces', label: 'Remove Extra Spaces', desc: 'Collapse multiple spaces' },
        { key: 'removeLineBreaks', label: 'Remove Line Breaks', desc: 'Convert to single line' },
        { key: 'removeEmptyLines', label: 'Remove Empty Lines', desc: 'Delete blank lines' },
      ]
    },
    {
      title: 'Punctuation',
      icon: 'quote',
      options: [
        { key: 'fixPunctuationSpacing', label: 'Fix Punctuation Spacing', desc: 'Correct space before/after punctuation' },
        { key: 'removeDuplicatePunctuation', label: 'Remove Duplicates', desc: 'Collapse repeated punctuation' },
        { key: 'smartQuotes', label: 'Smart Quotes', desc: 'Convert to curly quotes' },
        { key: 'normalizeQuotes', label: 'Normalize Quotes', desc: 'Use consistent quote style' },
      ]
    },
    {
      title: 'Advanced',
      icon: 'brain',
      options: [
        { key: 'normalizeUnicode', label: 'Normalize Unicode', desc: 'Apply Unicode normalization' },
        { key: 'removeInvisibleChars', label: 'Remove Invisible', desc: 'Strip zero-width spaces' },
        { key: 'normalizeDashes', label: 'Normalize Dashes', desc: 'Use standard hyphens' },
        { key: 'preserveLineBreaks', label: 'Preserve Line Breaks', desc: 'Keep original line structure' },
      ]
    },
    {
      title: 'Case',
      icon: 'type',
      options: [
        { key: 'sentenceCase', label: 'Sentence Case', desc: 'Capitalize sentences' },
        { key: 'titleCase', label: 'Title Case', desc: 'Capitalize each word' },
        { key: 'invertCase', label: 'Invert Case', desc: 'Swap uppercase/lowercase' },
      ]
    },
    {
      title: 'Cleanup',
      icon: 'scissors',
      options: [
        { key: 'removeUrls', label: 'Remove URLs', desc: 'Strip or mask web addresses' },
        { key: 'removeEmails', label: 'Remove Emails', desc: 'Strip or mask email addresses' },
        { key: 'removeNumbers', label: 'Remove Numbers', desc: 'Delete numeric characters' },
        { key: 'removeExtraCommas', label: 'Remove Extra Commas', desc: 'Collapse multiple commas' },
      ]
    }
  ];

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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50" />
                  <div className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Icon name="wand" size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Neural Text Transformer
                    <Icon name="sparkles" size={20} className="text-yellow-400 animate-pulse" />
                  </h1>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Advanced text formatting • 20+ transformations • Real-time stats
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={loadSample} className="btn-secondary">
                  <Icon name="book" size={14} />
                  Sample
                </button>
                <button onClick={() => setDark(!dark)} className="btn-secondary">
                  {dark ? <Icon name="eye" size={14} /> : <Icon name="eyeOff" size={14} />}
                  Theme
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            {text && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-5 gap-4 mt-4"
              >
                <StatCard label="Characters" value={text.length} icon="type" dark={dark} />
                <StatCard label="Words" value={text.split(/\s+/).filter(w => w.length > 0).length} icon="hash" dark={dark} />
                <StatCard label="Lines" value={text.split('\n').length} icon="layers" dark={dark} />
                <StatCard label="Spaces" value={(text.match(/\s/g) || []).length} icon="grid" dark={dark} />
                {stats.saved.chars > 0 && (
                  <StatCard label="Saved" value={`${stats.saved.chars} chars`} icon="check" dark={dark} accent="#34d399" />
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Options Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3 space-y-4"
            >
              {optionGroups.map((group, idx) => (
                <div key={idx} className="glass-card">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/20">
                    <Icon name={group.icon} size={16} className="text-purple-500" />
                    <h3 className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {group.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {group.options.map(opt => (
                      <div key={opt.key} className="flex items-center justify-between group">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <label className="toggle">
                              <input
                                type="checkbox"
                                checked={options[opt.key]}
                                onChange={() => toggleOption(opt.key)}
                              />
                              <span className="toggle-sl" />
                            </label>
                            <span className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {opt.label}
                            </span>
                          </div>
                          <p className={`text-[10px] mt-1 pl-9 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Text Editor Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-9 space-y-4"
            >
              {/* Input Panel */}
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${dark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                      <Icon name="type" size={18} className={dark ? 'text-purple-400' : 'text-purple-600'} />
                    </div>
                    <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Original Text
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={clearAll} className="btn-icon">
                      <Icon name="trash" size={14} />
                    </button>
                    <button onClick={exportText} className="btn-icon">
                      <Icon name="download" size={14} />
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
                  placeholder="Paste your text here for neural formatting..."
                  className={`glass-input ${expandedView ? 'h-96' : 'h-48'} transition-all duration-300`}
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={handleFormat}
                      disabled={!text.trim() || processing}
                      className="btn-primary"
                    >
                      {processing ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Icon name="wand" size={16} />
                          Format Text
                        </>
                      )}
                    </button>
                    {formattedText && (
                      <button
                        onClick={applyFormatting}
                        className="btn-secondary"
                      >
                        <Icon name="check" size={14} />
                        Apply Changes
                      </button>
                    )}
                  </div>
                  <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {text.length.toLocaleString()} characters • {text.split(/\s+/).filter(w => w.length > 0).length} words
                  </span>
                </div>
              </div>

              {/* Output Panel */}
              {formattedText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${dark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                        <Icon name="check" size={18} className="text-green-500" />
                      </div>
                      <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Formatted Result
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyResult(formattedText)}
                        className="btn-secondary"
                      >
                        <Icon name="copy" size={14} />
                        Copy
                      </button>
                      <button
                        onClick={resetText}
                        className="btn-secondary"
                      >
                        <Icon name="refresh" size={14} />
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className={`glass-input ${expandedView ? 'h-96' : 'h-32'} overflow-auto p-4 font-mono text-sm whitespace-pre-wrap`}>
                    {formattedText}
                  </div>

                  {/* Stats Comparison */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="glass-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="trend" size={14} className="text-purple-500" />
                        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Characters</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stats.original.chars}
                        </span>
                        <Icon name="arrow" size={12} className="text-gray-500" />
                        <span className={`text-sm font-bold text-green-500`}>
                          {stats.formatted.chars}
                        </span>
                      </div>
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{ 
                          width: `${(stats.formatted.chars / stats.original.chars * 100)}%` 
                        }} />
                      </div>
                    </div>

                    <div className="glass-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="grid" size={14} className="text-purple-500" />
                        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Spaces</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stats.original.spaces}
                        </span>
                        <Icon name="arrow" size={12} className="text-gray-500" />
                        <span className={`text-sm font-bold text-green-500`}>
                          {stats.formatted.spaces}
                        </span>
                      </div>
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{ 
                          width: `${(stats.formatted.spaces / stats.original.spaces * 100)}%` 
                        }} />
                      </div>
                    </div>

                    <div className="glass-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="layers" size={14} className="text-purple-500" />
                        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Lines</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stats.original.lines}
                        </span>
                        <Icon name="arrow" size={12} className="text-gray-500" />
                        <span className={`text-sm font-bold text-green-500`}>
                          {stats.formatted.lines}
                        </span>
                      </div>
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{ 
                          width: `${(stats.formatted.lines / stats.original.lines * 100)}%` 
                        }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="clock" size={16} className="text-purple-500" />
                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      Recent Transformations
                    </h3>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {history.map((item, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 p-3 rounded-lg bg-purple-900/20 w-48"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-green-500">
                            -{item.saved} chars
                          </span>
                          <span className="badge badge-info text-[8px]">
                            {item.transformations} ops
                          </span>
                        </div>
                        <div className={`text-xs truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.preview}
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
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                    <Icon name="brain" size={20} className="text-white" />
                  </div>
                  <h2 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Neural Formatting Guide
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-bold mb-2 text-purple-500">Why Format Text?</h3>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Clean, consistent text improves readability, reduces file size, and ensures compatibility across platforms.
                    </p>
                  </div>
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-bold mb-2 text-green-500">Smart Transformations</h3>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Our neural engine applies transformations in optimal order for maximum efficiency.
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

// Helper Components
const StatCard = ({ label, value, icon, dark, accent }) => (
  <div className={`glass-card p-2 flex items-center gap-2`}>
    <div className={`p-1.5 rounded-lg ${dark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
      <Icon name={icon} size={12} className={dark ? 'text-purple-400' : 'text-purple-600'} />
    </div>
    <div>
      <div className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-xs font-bold`} style={{ color: accent || (dark ? 'white' : 'gray-900') }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  </div>
);

export default memo(NeuralTextFormatter);