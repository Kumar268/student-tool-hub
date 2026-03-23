import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { tools, categories } from '../data/tools';

const SearchBar = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const searchTerm = debouncedQuery.toLowerCase();
    
    return tools.filter(tool => {
      const matchesName = tool.name.toLowerCase().includes(searchTerm);
      const matchesCategory = categories
        .find(cat => cat.id === tool.category)
        ?.name.toLowerCase()
        .includes(searchTerm);
      const matchesTags = tool.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      const matchesDescription = tool.description.toLowerCase().includes(searchTerm);

      return matchesName || matchesCategory || matchesTags || matchesDescription;
    }).slice(0, 8); // Limit to 8 results
  }, [debouncedQuery]);

  // Get category info for a tool
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || {};
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle result click
  const handleResultClick = (tool) => {
    navigate(`/tools/${tool.category}/${tool.slug}`);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredTools.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredTools.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredTools[selectedIndex]) {
          handleResultClick(filteredTools[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Get category color classes
  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      green: 'bg-green-500/10 text-green-500 border-green-500/20',
      orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      red: 'bg-red-500/10 text-red-500 border-red-500/20',
      yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className={`relative flex items-center transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700 focus-within:border-blue-500/50' 
          : 'bg-white border-gray-200 focus-within:border-blue-500'
      } border rounded-lg ${isOpen && filteredTools.length > 0 ? 'rounded-b-none' : ''}`}>
        <Search className={`absolute left-3 w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search tools by name, category, or tags..."
          className={`w-full pl-11 pr-10 py-3 bg-transparent outline-none text-sm md:text-base ${
            isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
          }`}
        />

        {query && (
          <button
            onClick={handleClear}
            className={`absolute right-3 p-1 rounded-full transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && filteredTools.length > 0 && (
        <div 
          ref={resultsRef}
          className={`absolute z-50 w-full mt-0 max-h-[400px] overflow-y-auto rounded-b-lg border border-t-0 shadow-xl ${
            isDarkMode 
              ? 'bg-gray-800/95 border-gray-700 backdrop-blur-sm' 
              : 'bg-white border-gray-200'
          }`}
        >
          {filteredTools.map((tool, index) => {
            const category = getCategoryInfo(tool.category);
            const isSelected = index === selectedIndex;

            return (
              <button
                key={tool.id}
                onClick={() => handleResultClick(tool)}
                className={`w-full px-4 py-3 flex items-start gap-3 transition-colors text-left ${
                  isSelected
                    ? isDarkMode 
                      ? 'bg-blue-500/20 border-l-2 border-blue-500' 
                      : 'bg-blue-50 border-l-2 border-blue-500'
                    : isDarkMode
                      ? 'hover:bg-gray-700/50 border-l-2 border-transparent'
                      : 'hover:bg-gray-50 border-l-2 border-transparent'
                } ${index !== filteredTools.length - 1 ? 'border-b' : ''} ${
                  isDarkMode ? 'border-b-gray-700' : 'border-b-gray-100'
                }`}
              >
                {/* Tool Icon/Initial */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  getCategoryColor(category.color)
                } border`}>
                  {tool.name.charAt(0)}
                </div>

                {/* Tool Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-sm md:text-base truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {tool.name}
                    </h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full border ${
                      getCategoryColor(category.color)
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm line-clamp-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tool.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ArrowRight className={`flex-shrink-0 w-5 h-5 ${
                  isSelected 
                    ? 'text-blue-500' 
                    : isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && debouncedQuery && filteredTools.length === 0 && (
        <div className={`absolute z-50 w-full mt-0 p-6 text-center rounded-b-lg border border-t-0 shadow-xl ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-sm' 
            : 'bg-white border-gray-200'
        }`}>
          <Search className={`w-12 h-12 mx-auto mb-3 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-300'
          }`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No tools found for "<span className="font-semibold">{debouncedQuery}</span>"
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Try searching by category, name, or tags
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
