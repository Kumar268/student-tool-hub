import React, { useState, useRef, memo, useCallback } from 'react';
import { 
  Sparkles, Copy, BookOpen, Zap, Wand2, Brain,
  AlertCircle, CheckCircle, XCircle, TrendingUp, 
  Download, Upload, History, Mic, Volume2, 
  Settings, Shield, Target, Eye, EyeOff,
  LineChart, Award, Clock, RefreshCw,
  MessageSquare, Lightbulb, Languages,
  Search, Filter, MoreVertical, Star, Trash
} from 'lucide-react';

const FuturisticGrammarChecker = ({ isDarkMode, copyResult, showToast }) => {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    complexity: 0,
    readability: 0
  });
  const [suggestions, setSuggestions] = useState([]);
  const [, setSelectedIssue] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [autoCorrect, setAutoCorrect] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [writingStyle, setWritingStyle] = useState('general');
  const [realTimeScore, setRealTimeScore] = useState(100);
  
  const textareaRef = useRef(null);
  const _canvasRef = useRef(null);

  // Comprehensive grammar and style rules
  const grammarRules = {
    // Spacing rules
    spacing: {
      doubleSpaces: {
        pattern: /\s{2,}/g,
        message: 'Multiple spaces detected',
        suggestion: 'Use single spaces between words',
        severity: 'warning',
        category: 'spacing',
        fix: (text) => text.replace(/\s{2,}/g, ' ')
      },
      missingSpaceAfterPunctuation: {
        pattern: /[.!?][a-zA-Z]/g,
        message: 'Missing space after punctuation',
        suggestion: 'Add a space after punctuation marks',
        severity: 'error',
        category: 'punctuation'
      },
      extraSpaceBeforePunctuation: {
        pattern: /\s+[.!?,;:]/g,
        message: 'Extra space before punctuation',
        suggestion: 'Remove space before punctuation',
        severity: 'warning',
        category: 'punctuation',
        fix: (text) => text.replace(/\s+([.!?,;:])/g, '$1')
      }
    },

    // Capitalization rules
    capitalization: {
      sentenceStart: {
        pattern: /(?:^|[.!?]\s+)([a-z])/g,
        message: 'Sentence should start with capital letter',
        suggestion: 'Capitalize the first letter of each sentence',
        severity: 'error',
        category: 'capitalization',
        fix: (text) => text.replace(/(?:^|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase())
      },
      properNouns: {
        pattern: /\b(paris|london|new york|john|mary|microsoft|google|apple)\b/gi,
        message: 'Proper noun should be capitalized',
        suggestion: 'Capitalize proper nouns',
        severity: 'warning',
        category: 'capitalization',
        highlight: true
      },
      iPronoun: {
        pattern: /\bi\b/g,
        message: "Pronoun 'I' should be capitalized",
        suggestion: "Use 'I' instead of 'i'",
        severity: 'error',
        category: 'capitalization',
        fix: (text) => text.replace(/\bi\b/g, 'I')
      }
    },

    // Grammar rules
    grammar: {
      subjectVerbAgreement: {
        pattern: /\b(he|she|it) (are|were|have)\b|\b(they|we) (is|was|has)\b/gi,
        message: 'Subject-verb agreement error',
        suggestion: 'The verb should agree with the subject',
        severity: 'error',
        category: 'grammar'
      },
      doubleNegatives: {
        pattern: /\b(?:can't|cannot|not|never|no)\s.+\b(?:no|nothing|nobody|nowhere|never)\b/i,
        message: 'Double negative detected',
        suggestion: 'Avoid using double negatives',
        severity: 'warning',
        category: 'grammar'
      },
      articleUsage: {
        pattern: /\b(a|an) [aeiou]/gi,
        message: 'Incorrect article usage',
        suggestion: 'Use "an" before vowel sounds',
        severity: 'warning',
        category: 'grammar'
      }
    },

    // Common typos dictionary
    typos: {
      'teh': { correction: 'the', severity: 'error' },
      'adn': { correction: 'and', severity: 'error' },
      'thsi': { correction: 'this', severity: 'error' },
      'thta': { correction: 'that', severity: 'error' },
      'recieve': { correction: 'receive', severity: 'error' },
      'occured': { correction: 'occurred', severity: 'error' },
      'seperate': { correction: 'separate', severity: 'error' },
      'definately': { correction: 'definitely', severity: 'error' },
      'accomodate': { correction: 'accommodate', severity: 'error' },
      'occurence': { correction: 'occurrence', severity: 'error' },
      'goverment': { correction: 'government', severity: 'error' },
      'untill': { correction: 'until', severity: 'warning' },
      'alot': { correction: 'a lot', severity: 'warning' },
      'cant': { correction: "can't", severity: 'warning' },
      'wont': { correction: "won't", severity: 'warning' },
      'dont': { correction: "don't", severity: 'warning' }
    },

    // Style suggestions
    style: {
      passiveVoice: {
        pattern: /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi,
        message: 'Passive voice detected',
        suggestion: 'Consider using active voice for stronger writing',
        severity: 'info',
        category: 'style'
      },
      wordiness: {
        pattern: /\b(in order to|due to the fact that|at this point in time|in the event that)\b/gi,
        message: 'Wordy phrase detected',
        suggestion: 'Use simpler, more concise language',
        severity: 'info',
        category: 'style'
      },
      cliches: {
        pattern: /\b(think outside the box|at the end of the day|back to the drawing board|ballpark figure)\b/gi,
        message: 'Cliche detected',
        suggestion: 'Use original expressions for stronger impact',
        severity: 'info',
        category: 'style'
      }
    },

    // Punctuation rules
    punctuation: {
      missingComma: {
        pattern: /\b(however|therefore|furthermore|meanwhile)\s+\w/gi,
        message: 'Missing comma after transition word',
        suggestion: 'Add a comma after introductory phrases',
        severity: 'warning',
        category: 'punctuation'
      },
      runOnSentence: {
        pattern: /[^.!?]{50,}(?!\s[;,])/g,
        message: 'Possible run-on sentence',
        suggestion: 'Consider breaking long sentences',
        severity: 'warning',
        category: 'style'
      },
      oxfordComma: {
        pattern: /\w+, \w+ and \w+/g,
        message: 'Oxford comma may be needed',
        suggestion: 'Consider using Oxford comma for clarity',
        severity: 'info',
        category: 'punctuation'
      }
    }
  };

  // Advanced text analysis
  const analyzeText = useCallback((inputText) => {
    if (!inputText.trim()) {
      setIssues([]);
      setSuggestions([]);
      setStats({
        words: 0, characters: 0, sentences: 0, paragraphs: 0,
        readingTime: 0, speakingTime: 0, complexity: 0, readability: 100
      });
      setRealTimeScore(100);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate real-time analysis with setTimeout for visual effect
    setTimeout(() => {
      const newIssues = [];
      const newSuggestions = [];

      // Apply all grammar rules
      Object.values(grammarRules).forEach(category => {
        Object.entries(category).forEach(([ruleName, rule]) => {
          if (rule.pattern && rule.pattern.test(inputText)) {
            const matches = inputText.match(rule.pattern);
            if (matches) {
              matches.forEach((match, index) => {
                const issue = {
                  id: `${ruleName}-${index}`,
                  type: ruleName,
                  ...rule,
                  match,
                  index: inputText.indexOf(match)
                };
                
                if (rule.severity === 'error' || rule.severity === 'warning') {
                  newIssues.push(issue);
                } else {
                  newSuggestions.push(issue);
                }
              });
            }
          }
        });
      });

      // Check for typos
      Object.entries(grammarRules.typos).forEach(([typo, { correction, severity }]) => {
        const regex = new RegExp(`\\b${typo}\\b`, 'gi');
        const matches = inputText.match(regex);
        if (matches) {
          matches.forEach((match, index) => {
            newIssues.push({
              id: `typo-${typo}-${index}`,
              type: 'typo',
              message: `Possible typo: "${match}"`,
              suggestion: `Did you mean "${correction}"?`,
              severity,
              category: 'typo',
              fix: (text) => text.replace(regex, correction)
            });
          });
        }
      });

      // Calculate statistics
      const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
      const characters = inputText.length;
      const sentences = inputText.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = inputText.split(/\n\s*\n/).filter(Boolean).length;
      const readingTime = Math.ceil(words / 200);
      const speakingTime = Math.ceil(words / 150);
      
      // Calculate complexity score (based on avg word length and sentence length)
      const avgWordLength = words > 0 ? characters / words : 0;
      const avgSentenceLength = sentences > 0 ? words / sentences : 0;
      const complexity = Math.min(100, Math.round((avgWordLength * 5 + avgSentenceLength * 2) / 7));
      
      // Calculate readability score (inverse of issues count)
      const readability = Math.max(0, 100 - (newIssues.length * 5));

      setStats({
        words, characters, sentences, paragraphs,
        readingTime, speakingTime, complexity, readability
      });

      setRealTimeScore(readability);
      setIssues(newIssues);
      setSuggestions(newSuggestions);

      // Add to history if significant changes
      if (inputText.length > 50 && newIssues.length > 0) {
        setAnalysisHistory(prev => [...prev.slice(-4), {
          timestamp: Date.now(),
          issues: newIssues.length,
          score: readability,
          preview: inputText.substring(0, 50) + '...'
        }]);
      }

      setIsAnalyzing(false);
    }, 300);
  }, []);

  // Handle text changes
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    analyzeText(newText);
  }, [analyzeText]);

  // Auto-correct on blur
  const handleBlur = useCallback(() => {
    if (autoCorrect && issues.length > 0) {
      fixAllIssues();
    }
  }, [autoCorrect, issues]);

  // Fix all issues
  const fixAllIssues = useCallback(() => {
    let fixedText = text;
    
    // Apply all available fixes
    issues.forEach(issue => {
      if (issue.fix) {
        fixedText = issue.fix(fixedText);
      }
    });

    // Apply basic fixes
    Object.values(grammarRules.spacing).forEach(rule => {
      if (rule.fix) fixedText = rule.fix(fixedText);
    });

    Object.values(grammarRules.capitalization).forEach(rule => {
      if (rule.fix) fixedText = rule.fix(fixedText);
    });

    setText(fixedText);
    analyzeText(fixedText);
    showToast?.('✨ Auto-corrected all issues!', 'success');
  }, [text, issues, analyzeText, showToast]);

  // Fix single issue
  const fixIssue = useCallback((issue) => {
    if (issue.fix) {
      const fixedText = issue.fix(text);
      setText(fixedText);
      analyzeText(fixedText);
      showToast?.('✅ Issue fixed!', 'success');
    }
  }, [text, analyzeText, showToast]);

  // Clear all text
  const clearText = useCallback(() => {
    if (text.length > 0 && window.confirm('Clear all text?')) {
      setText('');
      setIssues([]);
      setSuggestions([]);
      showToast?.('Text cleared', 'info');
    }
  }, [text, showToast]);

  // Export analysis
  const exportAnalysis = useCallback(() => {
    const report = {
      text,
      stats,
      issues,
      suggestions,
      timestamp: new Date().toISOString(),
      score: realTimeScore
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grammar-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('Analysis exported!', 'success');
  }, [text, stats, issues, suggestions, realTimeScore, showToast]);

  // Speak text
  const speakText = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [text]);

  // Filter issues
  const filteredIssues = issues.filter(issue => 
    filterSeverity === 'all' || issue.severity === filterSeverity
  );

  return (
    <div className="relative space-y-6">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
      </div>

      {/* Header with real-time score */}
      <div className={`relative p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl shadow-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${
              realTimeScore > 80 ? 'from-green-500 to-emerald-500' :
              realTimeScore > 60 ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-pink-500'
            } animate-pulse`}>
              <Brain className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                AI Grammar Assistant
                <Sparkles className="text-yellow-400 animate-spin-slow" size={20} />
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time grammar, style, and readability analysis
              </p>
            </div>
          </div>

          {/* Live score */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {realTimeScore}%
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Readability Score
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  className="text-gray-300"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="28"
                  cx="32"
                  cy="32"
                />
                <circle
                  className={`${
                    realTimeScore > 80 ? 'text-green-500' :
                    realTimeScore > 60 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}
                  strokeWidth="4"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * realTimeScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="28"
                  cx="32"
                  cy="32"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <StatCard icon={<MessageSquare size={16} />} label="Words" value={stats.words} isDarkMode={isDarkMode} />
          <StatCard icon={<Clock size={16} />} label="Read Time" value={`${stats.readingTime} min`} isDarkMode={isDarkMode} />
          <StatCard icon={<Target size={16} />} label="Complexity" value={`${stats.complexity}%`} isDarkMode={isDarkMode} />
          <StatCard icon={<TrendingUp size={16} />} label="Issues" value={issues.length} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Main editor interface */}
      <div className={`relative p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl shadow-2xl`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2 bg-gray-200/20 p-1 rounded-lg">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSeverity === 'all'
                  ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilterSeverity('error')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSeverity === 'error'
                  ? 'bg-red-500 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Errors ({issues.filter(i => i.severity === 'error').length})
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterSeverity === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Warnings ({issues.filter(i => i.severity === 'warning').length})
            </button>
          </div>

          <div className="flex space-x-2">
            <ActionButton
              icon={<Wand2 size={16} />}
              label="Auto Fix"
              onClick={fixAllIssues}
              disabled={issues.length === 0}
              isDarkMode={isDarkMode}
              variant="primary"
            />
            <ActionButton
              icon={<Volume2 size={16} />}
              label="Speak"
              onClick={speakText}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Download size={16} />}
              label="Export"
              onClick={exportAnalysis}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Settings size={16} />}
              label="Settings"
              onClick={() => setShowAdvanced(!showAdvanced)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Advanced settings */}
        {showAdvanced && (
          <div className={`mb-4 p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoCorrect}
                    onChange={(e) => setAutoCorrect(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Auto-correct on blur
                  </span>
                </label>
                <select
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  className={`px-2 py-1 rounded-lg text-sm ${
                    isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'
                  }`}
                >
                  <option value="general">General Writing</option>
                  <option value="academic">Academic</option>
                  <option value="business">Business</option>
                  <option value="creative">Creative</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Text area with issue highlighting */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="Start typing or paste your text here for AI-powered grammar analysis..."
            className={`w-full h-64 p-6 rounded-xl border-2 outline-none transition-all duration-300 resize-y ${
              isDarkMode 
                ? 'bg-gray-900/80 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
            }`}
            style={{ 
              backgroundImage: issues.length > 0 ? 
                'repeating-linear-gradient(45deg, rgba(239,68,68,0.1) 0px, rgba(239,68,68,0.1) 2px, transparent 2px, transparent 4px)' : 
                'none'
            }}
          />
          
          {isAnalyzing && (
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <RefreshCw size={16} className="animate-spin text-blue-500" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Analyzing...
              </span>
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            <ActionButton
              icon={<Copy size={16} />}
              label="Copy"
              onClick={() => {
                copyResult(text);
                showToast?.('📋 Copied to clipboard!', 'success');
              }}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Upload size={16} />}
              label="Paste"
              onClick={async () => {
                const clipboardText = await navigator.clipboard.readText();
                setText(clipboardText);
                analyzeText(clipboardText);
                showToast?.('📋 Pasted from clipboard', 'info');
              }}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Trash size={16} />}
              label="Clear"
              onClick={clearText}
              disabled={text.length === 0}
              isDarkMode={isDarkMode}
              variant="danger"
            />
          </div>

          {/* Issue count summary */}
          <div className="flex items-center space-x-3">
            {issues.length > 0 && (
              <>
                <span className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                  <XCircle size={16} className="inline mr-1" />
                  {issues.filter(i => i.severity === 'error').length} errors
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                  <AlertCircle size={16} className="inline mr-1" />
                  {issues.filter(i => i.severity === 'warning').length} warnings
                </span>
              </>
            )}
            {suggestions.length > 0 && (
              <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                <Lightbulb size={16} className="inline mr-1" />
                {suggestions.length} suggestions
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Issues panel */}
      {filteredIssues.length > 0 && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} size={20} />
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Issues Found ({filteredIssues.length})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Search size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                placeholder="Filter issues..."
                className={`px-2 py-1 text-sm rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {filteredIssues.map((issue, index) => (
              <div
                key={issue.id || index}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                  issue.severity === 'error' 
                    ? isDarkMode ? 'bg-red-900/20 border-red-700/50 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100'
                    : issue.severity === 'warning'
                    ? isDarkMode ? 'bg-yellow-900/20 border-yellow-700/50 hover:bg-yellow-900/30' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                    : isDarkMode ? 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        issue.severity === 'error' 
                          ? 'bg-red-500/20 text-red-400'
                          : issue.severity === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {issue.category}
                      </span>
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {issue.message}
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {issue.suggestion}
                    </p>
                    {issue.match && (
                      <div className={`mt-2 p-2 rounded-lg font-mono text-sm ${
                        isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        "{issue.match}"
                      </div>
                    )}
                  </div>
                  {issue.fix && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fixIssue(issue);
                      }}
                      className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      Fix
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style suggestions panel */}
      {suggestions.length > 0 && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} size={20} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Style Improvements ({suggestions.length})
            </h3>
          </div>
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {suggestion.message}
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {suggestion.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis history */}
      {analysisHistory.length > 0 && (
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
          <div className="flex items-center gap-2 mb-3">
            <History size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Analysis History
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {analysisHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setText(item.preview.replace('...', ''))}
                className={`flex-shrink-0 p-3 rounded-lg text-xs transition-all ${
                  isDarkMode
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${
                    item.score > 80 ? 'text-green-500' : item.score > 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {item.score}%
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {item.issues} issues
                  </span>
                </div>
                <div className="font-mono truncate max-w-[150px]">
                  {item.preview}
                </div>
                <div className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Educational content */}
      <article className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/60 border-gray-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500`}>
            <Award size={28} className="text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              Master Your Writing
              <Star size={20} className="text-yellow-400 fill-current" />
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered insights to elevate your writing to the next level
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <TipCard
            title="Grammar Excellence"
            description="Real-time grammar checking with contextual suggestions and fixes"
            icon={<CheckCircle size={20} />}
            isDarkMode={isDarkMode}
          />
          <TipCard
            title="Style Enhancement"
            description="Improve clarity, conciseness, and impact with style suggestions"
            icon={<Sparkles size={20} />}
            isDarkMode={isDarkMode}
          />
          <TipCard
            title="Readability Optimization"
            description="Ensure your content is accessible to your target audience"
            icon={<Target size={20} />}
            isDarkMode={isDarkMode}
          />
        </div>
      </article>
    </div>
  );
};

// Helper components
const StatCard = ({ icon, label, value, isDarkMode }) => (
  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
    <div className="flex items-center gap-2">
      <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>{icon}</span>
      <div>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, disabled, isDarkMode, variant = 'default' }) => {
  const variants = {
    default: isDarkMode 
      ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
    primary: isDarkMode
      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
      : 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-400',
    danger: isDarkMode
      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30'
      : 'bg-red-500 text-white hover:bg-red-600 border border-red-400'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : variants[variant]
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const TipCard = ({ title, description, icon, isDarkMode }) => (
  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} backdrop-blur-sm`}>
    <div className="flex items-center gap-2 mb-2">
      <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>{icon}</span>
      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    </div>
    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
  </div>
);

export default memo(FuturisticGrammarChecker);