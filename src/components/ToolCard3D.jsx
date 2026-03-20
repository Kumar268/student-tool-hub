import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ToolIcon } from './ToolIcon';

const ToolCard3D = ({ tool, isDarkMode, onClick }) => {
  const cardRef = useRef(null);
  
  // Motion values for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  
  const categoryColors = {
    academic: 'blue',
    financial: 'green',
    utility: 'orange',
    niche: 'purple',
    image: 'pink',
    pdf: 'red',
    text: 'yellow',
    audio: 'cyan',
    developer: 'indigo'
  };

  const color = categoryColors[tool.category];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXValue = (e.clientX - rect.left - width / 2) / width;
    const mouseYValue = (e.clientY - rect.top - height / 2) / height;
    
    mouseX.set(mouseXValue);
    mouseY.set(mouseYValue);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
        isDarkMode
          ? `bg-white/5 border-white/10 hover:border-${color}-500/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]`
          : `bg-white/40 border-white/20 hover:border-${color}-400 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]`
      } backdrop-blur-md hover:shadow-2xl`}
    >
      {/* 3D Glassmorphic background glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-${color}-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{ transform: 'translateZ(20px)' }}
      />
      
      {/* Animated holographic scanline */}
      <motion.div
        className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(40px)' }}
      />
      
      <div className="relative p-6 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
        {/* Icon with glowing backdrop */}
        <div className={`mb-4 w-14 h-14 rounded-xl flex items-center justify-center relative ${
          isDarkMode 
            ? `bg-${color}-500/10 border border-${color}-500/30 text-${color}-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
            : `bg-${color}-50 border border-${color}-200 text-${color}-600`
        }`}>
          <ToolIcon iconName={tool.icon} size={28} className={`relative z-10 ${
            isDarkMode ? `text-${color}-400` : `text-${color}-600`
          }`} />
          <div className={`absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-br from-${color}-500 to-${color}-600`} />
        </div>
        
        {/* Content */}
        <div className="mt-auto">
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
          }`}>
            {tool.name}
          </h3>
          <p className={`text-sm leading-relaxed line-clamp-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600'
          }`}>
            {tool.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          {tool.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard3D;