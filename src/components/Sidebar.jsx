import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  DollarSign,
  Settings,
  Sparkles,
  Image,
  FileText,
  Type,
  Music,
  Code,
  Home,
  ChevronUp,
  Menu,
  X,
  Palette,
} from 'lucide-react';

const categoryColorClasses = {
  blue: {
    activeDark: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    activeLight: 'bg-blue-50 text-blue-600 border-blue-200',
    hoverDark: 'hover:bg-blue-600/10 hover:text-blue-400',
    hoverLight: 'hover:bg-blue-50 hover:text-blue-600',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  green: {
    activeDark: 'bg-green-600/20 text-green-400 border-green-500/30',
    activeLight: 'bg-green-50 text-green-600 border-green-200',
    hoverDark: 'hover:bg-green-600/10 hover:text-green-400',
    hoverLight: 'hover:bg-green-50 hover:text-green-600',
    iconBg: 'bg-green-500/20 text-green-400',
  },
  orange: {
    activeDark: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
    activeLight: 'bg-orange-50 text-orange-600 border-orange-200',
    hoverDark: 'hover:bg-orange-600/10 hover:text-orange-400',
    hoverLight: 'hover:bg-orange-50 hover:text-orange-600',
    iconBg: 'bg-orange-500/20 text-orange-400',
  },
  purple: {
    activeDark: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    activeLight: 'bg-purple-50 text-purple-600 border-purple-200',
    hoverDark: 'hover:bg-purple-600/10 hover:text-purple-400',
    hoverLight: 'hover:bg-purple-50 hover:text-purple-600',
    iconBg: 'bg-purple-500/20 text-purple-400',
  },
  pink: {
    activeDark: 'bg-pink-600/20 text-pink-400 border-pink-500/30',
    activeLight: 'bg-pink-50 text-pink-600 border-pink-200',
    hoverDark: 'hover:bg-pink-600/10 hover:text-pink-400',
    hoverLight: 'hover:bg-pink-50 hover:text-pink-600',
    iconBg: 'bg-pink-500/20 text-pink-400',
  },
  red: {
    activeDark: 'bg-red-600/20 text-red-400 border-red-500/30',
    activeLight: 'bg-red-50 text-red-600 border-red-200',
    hoverDark: 'hover:bg-red-600/10 hover:text-red-400',
    hoverLight: 'hover:bg-red-50 hover:text-red-600',
    iconBg: 'bg-red-500/20 text-red-400',
  },
  yellow: {
    activeDark: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
    activeLight: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    hoverDark: 'hover:bg-yellow-600/10 hover:text-yellow-400',
    hoverLight: 'hover:bg-yellow-50 hover:text-yellow-600',
    iconBg: 'bg-yellow-500/20 text-yellow-400',
  },
  cyan: {
    activeDark: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
    activeLight: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    hoverDark: 'hover:bg-cyan-600/10 hover:text-cyan-400',
    hoverLight: 'hover:bg-cyan-50 hover:text-cyan-600',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
  indigo: {
    activeDark: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    activeLight: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    hoverDark: 'hover:bg-indigo-600/10 hover:text-indigo-400',
    hoverLight: 'hover:bg-indigo-50 hover:text-indigo-600',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
  },
};

const categoryIcons = {
  academic: GraduationCap,
  financial: DollarSign,
  utility: Settings,
  niche: Sparkles,
  image: Image,
  pdf: FileText,
  text: Type,
  audio: Music,
  developer: Code
};

const Sidebar = ({ selectedCategory, isDarkMode, isOpen, onToggle }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const categories = [
    { id: 'academic', name: 'Academic Tools', icon: 'academic', color: 'blue' },
    { id: 'financial', name: 'Financial Tools', icon: 'financial', color: 'green' },
    { id: 'utility', name: 'Utility Tools', icon: 'utility', color: 'orange' },
    { id: 'niche', name: 'Niche Tools', icon: 'niche', color: 'purple' },
    { id: 'image', name: 'Image Tools', icon: 'image', color: 'pink' },
    { id: 'pdf', name: 'PDF Tools', icon: 'pdf', color: 'red' },
    { id: 'text', name: 'Text Tools', icon: 'text', color: 'yellow' },
    { id: 'audio', name: 'Audio Tools', icon: 'audio', color: 'cyan' },
    { id: 'developer', name: 'Developer Tools', icon: 'developer', color: 'indigo' }
  ];

  const getIconComponent = (iconName) => {
    const IconComponent = categoryIcons[iconName];
    return IconComponent;
  };

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        setShowScrollTop(sidebarRef.current.scrollTop > 100);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll);
      return () => sidebar.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      onToggle();
    }
  }, [location.pathname, isOpen, onToggle]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`sidebar-scroll fixed left-0 top-0 h-full w-64 z-40 transition-all duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          isDarkMode
            ? 'bg-gray-900/95 backdrop-blur-2xl border-r border-gray-700/50 shadow-2xl shadow-black/30'
            : 'bg-white/95 backdrop-blur-2xl border-r border-gray-200/50 shadow-xl shadow-black/5'
        }`}
        style={{ 
          scrollBehavior: 'smooth',
          overflowY: 'auto'
        }}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 rounded-lg lg:hidden transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: isDarkMode ? '#9CA3AF' : '#6B7280'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className={`p-6 border-b transition-colors duration-500 ${
          isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20'
            }`}>
              <Palette size={24} className="text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Student Tool Hub
              </h2>
              <p className={`text-sm mt-0.5 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                56 Tools for Students
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1.5">
            {/* All Tools */}
            <NavLink
              to="/"
              end
            >
              {({ isActive }) => {
                const isCurrentActive = isActive || selectedCategory === 'all';
                return (
                  <div className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                    isCurrentActive
                      ? isDarkMode
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-lg shadow-blue-500/10'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                  }`}>
                    {/* Active Indicator */}
                    {isCurrentActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full transition-all duration-300" />
                    )}
                    
                    <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                      isCurrentActive
                        ? 'bg-blue-500/20'
                        : isDarkMode
                          ? 'bg-gray-700/50 group-hover:bg-blue-500/20'
                          : 'bg-gray-100 group-hover:bg-blue-50'
                    }`}>
                      <Home size={18} className={
                        isCurrentActive
                          ? 'text-blue-400'
                          : isDarkMode
                            ? 'text-gray-400 group-hover:text-blue-400'
                            : 'text-gray-500 group-hover:text-blue-500'
                      } />
                    </div>
                    <span className="font-medium">All Tools</span>
                  </div>
                );
              }}
            </NavLink>

            {/* Category Links */}
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const colorClass = categoryColorClasses[category.color] ?? categoryColorClasses.blue;
              const isCatActive = selectedCategory === category.id;

              return (
                <NavLink
                  key={category.id}
                  to={`/category/${category.id}`}
                  className={({ isActive: linkActive }) => {
                    const isCurrentActive = linkActive || selectedCategory === category.id;
                    return `group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                      isCurrentActive
                        ? isDarkMode
                          ? `${colorClass.activeDark} shadow-lg`
                          : `${colorClass.activeLight} shadow-lg`
                        : isDarkMode
                          ? `text-gray-300 ${colorClass.hoverDark} border border-transparent`
                          : `text-gray-700 ${colorClass.hoverLight} border border-transparent`
                    }`;
                  }}
                >
                  {/* Active Indicator */}
                  {isCatActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                      isDarkMode ? 'bg-current' : `bg-${category.color}-500`
                    }`} style={{ 
                      backgroundColor: isDarkMode ? undefined : 
                        category.color === 'blue' ? '#3B82F6' :
                        category.color === 'green' ? '#22C55E' :
                        category.color === 'orange' ? '#F97316' :
                        category.color === 'purple' ? '#A855F7' :
                        category.color === 'pink' ? '#EC4899' :
                        category.color === 'red' ? '#EF4444' :
                        category.color === 'yellow' ? '#EAB308' :
                        category.color === 'cyan' ? '#06B6D4' : '#6366F1'
                    }} />
                  )}
                  
                  <div className={`p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    isCatActive
                      ? colorClass.iconBg || 'bg-blue-500/20'
                      : isDarkMode
                        ? 'bg-gray-700/50 group-hover:bg-opacity-50'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <IconComponent size={18} className={
                      isCatActive
                        ? 'text-current'
                        : isDarkMode
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-500 group-hover:text-gray-600'
                    } />
                  </div>
                  <span className="font-medium truncate">{category.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            showScrollTop 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          } ${
            isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20'
          }`}
          style={{ bottom: '6rem' }}
        >
          <ChevronUp size={20} />
        </button>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors duration-500 ${
          isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className={`text-xs text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Made with ❤️ for Students
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className={`fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 lg:hidden ${
            isDarkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-gray-900/30'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200/50'
          }`}
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;

