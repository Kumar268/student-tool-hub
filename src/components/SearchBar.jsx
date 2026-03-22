import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tools, categories } from '../data/tools';

/**
 * SearchBar Component — Phase 1.1
 * Features:
 * - 300ms debounced instant search
 * - Floating dropdown with results scrolling
 * - Keyboard navigation (↑↓ arrow keys, Enter to select, Esc to close)
 * - Search history (last 5 searches in localStorage)
 * - Popular searches based on analytics
 * - Category filtering with buttons
 * - Text highlighting for matching terms
 * - Mobile-optimized (fullscreen modal on small screens)
 * - Accessibility: ARIA labels, roles, keyboard support
 * - Analytics tracking built-in
 */
const SearchBar = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const navigate = useNavigate();

  // ─── Mobile detection ──────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Load search history & popular searches from localStorage ──────
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) setSearchHistory(JSON.parse(saved));

    const popularData = localStorage.getItem('popularSearches');
    if (popularData) setPopularSearches(JSON.parse(popularData).slice(0, 5));
  }, []);

  // ─── Debounced search with 300ms delay ────────────────────────────
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      const queryLower = searchQuery.toLowerCase();
      const filtered = tools.filter((tool) => {
        const matchesQuery =
          tool.name.toLowerCase().includes(queryLower) ||
          tool.description.toLowerCase().includes(queryLower) ||
          (tool.tags || []).some((tag) =>
            tag.toLowerCase().includes(queryLower)
          );

        const matchesCategory =
          selectedCategory === 'all' || tool.category === selectedCategory;

        return matchesQuery && matchesCategory;
      });

      setResults(filtered);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);
  }, [selectedCategory]);

  // ─── Handle input change ───────────────────────────────────────────
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsOpen(true);
    performSearch(value);
  };

  // ─── Track search analytics ────────────────────────────────────────
  const trackSearchAnalytics = (searchTerm) => {
    const existing = JSON.parse(localStorage.getItem('popularSearches') || '[]');
    const updated = existing
      .map((item) =>
        item.term === searchTerm ? { ...item, count: item.count + 1 } : item
      )
      .concat(
        existing.find((item) => item.term === searchTerm)
          ? []
          : [{ term: searchTerm, count: 1 }]
      );

    updated.sort((a, b) => b.count - a.count);
    localStorage.setItem('popularSearches', JSON.stringify(updated));
    setPopularSearches(updated.slice(0, 5));
  };

  // ─── Handle result selection & navigation ──────────────────────────
  const handleSelectResult = (tool) => {
    // Track analytics
    trackSearchAnalytics(tool.name);

    // Update search history
    const newHistory = [
      { query: tool.name, timestamp: Date.now() },
      ...searchHistory.filter((h) => h.query !== tool.name),
    ].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory);

    // Navigate to tool
    navigate(`/tools/${tool.category}/${tool.slug}`);

    // Reset search
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setSelectedIndex(-1);
  };

  // ─── Keyboard navigation ───────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        } else if (results.length > 0) {
          handleSelectResult(results[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // ─── Close dropdown on outside click ────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Highlight matching text ───────────────────────────────────────
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold text-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    localStorage.setItem('searchHistory', JSON.stringify([]));
    setSearchHistory([]);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    performSearch(historyQuery);
    setIsOpen(true);
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (query) performSearch(query);
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* ─── Search Input ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
          isOpen || query
            ? isDarkMode
              ? 'border-blue-500 bg-gray-800 shadow-lg shadow-blue-500/20'
              : 'border-blue-500 bg-white shadow-lg shadow-blue-500/20'
            : isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-300 bg-gray-50'
        }`}
      >
        <Search
          size={18}
          className={`shrink-0 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search 56+ tools (Ctrl+K)..."
          aria-label="Search tools by name, description, or tag"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          className={`flex-1 outline-none text-sm ${
            isDarkMode
              ? 'bg-transparent text-white placeholder-gray-500'
              : 'bg-transparent text-gray-900 placeholder-gray-400'
          }`}
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className={`p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <X size={16} />
          </button>
        )}
        <span
          className={`hidden sm:inline text-xs px-2 py-1 rounded font-mono border ${
            isDarkMode
              ? 'border-gray-700 text-gray-600'
              : 'border-gray-300 text-gray-500'
          }`}
        >
          ⌘K
        </span>
      </div>

      {/* ─── Dropdown Results ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="search-dropdown"
          role="listbox"
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto border ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Category Filter Tabs */}
          {query && results.length > 0 && (
            <div
              className={`sticky top-0 flex overflow-x-auto gap-2 p-3 border-b ${
                isDarkMode
                  ? 'bg-gray-950 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-2 p-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-12 rounded animate-pulse ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query && (
            <>
              {results.length > 0 ? (
                <div>
                  <div
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  >
                    <Zap size={12} />
                    Results ({results.length})
                  </div>
                  {results.map((tool, index) => {
                    const catInfo = categories.find(
                      (c) => c.id === tool.category
                    );
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleSelectResult(tool)}
                        role="option"
                        aria-selected={selectedIndex === index}
                        className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                          selectedIndex === index
                            ? isDarkMode
                              ? 'bg-gray-800 border-blue-500'
                              : 'bg-blue-50 border-blue-500'
                            : isDarkMode
                              ? 'border-transparent hover:bg-gray-800'
                              : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg mt-0.5">
                            {catInfo?.icon || '🔧'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-semibold text-sm ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {highlightMatch(tool.name, query)}
                            </div>
                            <div
                              className={`text-xs mt-1 line-clamp-2 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {highlightMatch(tool.description, query)}
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {catInfo && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    isDarkMode
                                      ? 'bg-gray-800 text-gray-300'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {catInfo.name}
                                </span>
                              )}
                              {tool.tags?.[0] && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    isDarkMode
                                      ? 'bg-gray-800 text-gray-400'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {tool.tags[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3 opacity-30">🔍</div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No tools found for "{query}"
                  </p>
                </div>
              )}
            </>
          )}

          {/* History & Popular (no query) */}
          {!query && (
            <div>
              {searchHistory.length > 0 && (
                <div>
                  <div
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Recent
                    </span>
                    <button
                      onClick={clearHistory}
                      className={`text-xs hover:underline ${
                        isDarkMode ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleHistoryClick(item.query)}
                      className={`px-4 py-2 cursor-pointer transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Clock size={14} className="inline mr-2 opacity-50" />
                      {item.query}
                    </div>
                  ))}
                </div>
              )}

              {popularSearches.length > 0 && (
                <div
                  className={searchHistory.length > 0 ? 'border-t' : ''}
                >
                  <div
                    className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-600 border-gray-700' : 'text-gray-500'
                    } ${searchHistory.length > 0 ? 'border-t' : ''}`}
                  >
                    <TrendingUp size={12} className="inline mr-1" />
                    Trending
                  </div>
                  {popularSearches.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setQuery(item.term) || performSearch(item.term) || setIsOpen(true)}
                      className={`px-4 py-2 cursor-pointer transition-colors flex items-center justify-between ${
                        isDarkMode
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <TrendingUp size={14} className="opacity-50" />
                        {item.term}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchHistory.length === 0 && popularSearches.length === 0 && (
                <div className="p-6 text-center">
                  <div className="text-2xl mb-3 opacity-30">⌕</div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Start typing to search tools
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
