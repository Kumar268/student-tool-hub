import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, Rocket, Clock, Bell, Mail, 
  Star, Zap, Brain, Atom, Orbit, Satellite, Infinity,
  Code, Globe, Lock, Unlock, Eye, EyeOff, Gift,
  PartyPopper, Trophy, Flame, Crown, Gem, Diamond,
  Music, Volume2, VolumeX, Share2, Download, Copy,
  Calendar, Target, Award, Heart, ThumbsUp, ThumbsDown,
  MessageCircle, Twitter, Github, Linkedin, Facebook,
  Instagram, Youtube, Twitch, Disc, Wifi, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Quantum Styles
const QUANTUM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

/* Quantum Animations */
@keyframes quantum-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes quantum-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes quantum-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes quantum-wave {
  0% { transform: translateX(-100%) scale(1); opacity: 0; }
  50% { transform: translateX(0) scale(1.2); opacity: 0.8; }
  100% { transform: translateX(100%) scale(1); opacity: 0; }
}

@keyframes quantum-glow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(139,92,246,0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(236,72,153,0.8)); }
}

@keyframes quantum-countdown {
  0% { content: '3'; opacity: 1; transform: scale(1); }
  33% { content: '2'; opacity: 1; transform: scale(1.2); }
  66% { content: '1'; opacity: 1; transform: scale(1.4); }
  100% { content: '0'; opacity: 0; transform: scale(0); }
}

@keyframes quantum-ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}

@keyframes quantum-glitch {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-2px, 2px); filter: hue-rotate(45deg); }
  40% { transform: translate(-2px, -2px); filter: hue-rotate(90deg); }
  60% { transform: translate(2px, 2px); filter: hue-rotate(180deg); }
  80% { transform: translate(2px, -2px); filter: hue-rotate(270deg); }
  100% { transform: translate(0); filter: hue-rotate(360deg); }
}

/* Quantum Classes */
.quantum-float {
  animation: quantum-float 6s ease-in-out infinite;
}

.quantum-pulse {
  animation: quantum-pulse 2s ease-in-out infinite;
}

.quantum-spin {
  animation: quantum-spin 10s linear infinite;
}

.quantum-glow {
  animation: quantum-glow 3s ease-in-out infinite;
}

.quantum-glitch:hover {
  animation: quantum-glitch 0.5s ease-in-out;
}

/* Quantum Grid */
.quantum-grid {
  background-image: 
    linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  position: relative;
}

.quantum-grid::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2), transparent 70%);
  pointer-events: none;
}

/* Quantum Particles */
.quantum-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  box-shadow: 0 0 15px #8b5cf6;
  animation: quantum-ripple 3s ease-out infinite;
}

/* Quantum Wave */
.quantum-wave {
  position: relative;
  overflow: hidden;
}

.quantum-wave::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
  animation: quantum-wave 3s ease-in-out infinite;
}

/* Quantum Card */
.quantum-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(139,92,246,0.2);
  border-radius: 32px;
  position: relative;
  overflow: hidden;
}

.quantum-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1));
  opacity: 0;
  transition: opacity 0.3s;
}

.quantum-card:hover::before {
  opacity: 1;
}

/* Quantum Button */
.quantum-button {
  position: relative;
  padding: 12px 32px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 40px;
  color: white;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.quantum-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.quantum-button:hover::before {
  width: 300px;
  height: 300px;
}

.quantum-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(139,92,246,0.5);
}

/* Quantum Input */
.quantum-input {
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid rgba(139,92,246,0.2);
  border-radius: 40px;
  padding: 12px 24px;
  color: white;
  font-family: 'Fira Code', monospace;
  outline: none;
  transition: all 0.3s;
}

.quantum-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139,92,246,0.3);
}

.quantum-input::placeholder {
  color: rgba(255,255,255,0.3);
}

/* Quantum Badge */
.quantum-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(139,92,246,0.15);
  border: 1px solid rgba(139,92,246,0.3);
  border-radius: 40px;
  font-size: 14px;
  color: white;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.quantum-badge:hover {
  background: rgba(139,92,246,0.25);
  border-color: rgba(139,92,246,0.5);
  transform: translateY(-2px);
}

/* Quantum Progress */
.quantum-progress {
  height: 6px;
  background: rgba(139,92,246,0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.quantum-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 3px;
  position: relative;
  animation: quantum-wave 2s linear infinite;
}

/* Quantum Countdown */
.quantum-countdown {
  font-family: 'Fira Code', monospace;
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

/* Quantum Orb */
.quantum-orb {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  position: relative;
  animation: quantum-pulse 3s ease-in-out infinite;
}

.quantum-orb::before {
  content: '';
  position: absolute;
  inset: -10px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(20px);
}

/* Quantum Timeline */
.quantum-timeline {
  position: relative;
  padding-left: 30px;
}

.quantum-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #8b5cf6, #ec4899);
}

.quantum-timeline-item {
  position: relative;
  padding-bottom: 30px;
}

.quantum-timeline-item::before {
  content: '';
  position: absolute;
  left: -34px;
  top: 0;
  width: 10px;
  height: 10px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 20px #8b5cf6;
}
`;

// Particle Background Component
const QuantumParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="quantum-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Main Component
const QuantumLaunchPortal = ({ toolName = 'Quantum Tool', isDarkMode: initialDarkMode = true }) => {
  const [dark, setDark] = useState(initialDarkMode);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [notifyMe, setNotifyMe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const canvasRef = useRef(null);
  const launchDate = new Date('2024-12-25T00:00:00').getTime();

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });

      // Progress calculation (assuming 30 days total)
      const total = 30 * 24 * 60 * 60 * 1000;
      const remaining = distance;
      const completed = ((total - remaining) / total) * 100;
      setProgress(Math.min(100, Math.max(0, completed)));
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: `rgba(139,92,246,${Math.random() * 0.5})`
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  // Features data
  const features = [
    {
      id: 1,
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced neural networks for deep text understanding',
      color: '#8b5cf6',
      eta: 'Q1 2024'
    },
    {
      id: 2,
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Processing',
      description: 'Lightning-fast transformations with quantum speed',
      color: '#ec4899',
      eta: 'Q1 2024'
    },
    {
      id: 3,
      icon: <Atom className="w-8 h-8" />,
      title: 'Quantum Computing',
      description: 'Harness the power of quantum superposition',
      color: '#06b6d4',
      eta: 'Q2 2024'
    },
    {
      id: 4,
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-language Support',
      description: 'Process text in 50+ languages seamlessly',
      color: '#f59e0b',
      eta: 'Q1 2024'
    },
    {
      id: 5,
      icon: <Lock className="w-8 h-8" />,
      title: 'Military-grade Security',
      description: 'End-to-end encryption for your data',
      color: '#10b981',
      eta: 'Q2 2024'
    },
    {
      id: 6,
      icon: <Infinity className="w-8 h-8" />,
      title: 'Unlimited Processing',
      description: 'No limits, no restrictions, pure power',
      color: '#ef4444',
      eta: 'Q3 2024'
    }
  ];

  // Social links
  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, name: 'Twitter', href: '#', color: '#1DA1F2' },
    { icon: <Github className="w-5 h-5" />, name: 'GitHub', href: '#', color: '#333' },
    { icon: <Linkedin className="w-5 h-5" />, name: 'LinkedIn', href: '#', color: '#0077B5' },
    { icon: <Disc className="w-5 h-5" />, name: 'Discord', href: '#', color: '#5865F2' },
  ];

  // Handle subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      <style>{QUANTUM_STYLES}</style>
      <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        dark ? 'bg-[#030014] text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{ opacity: dark ? 0.3 : 0.1 }}
        />

        {/* Quantum Particles */}
        <QuantumParticles />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen pt-24 pb-12">
          <div className="px-4 w-full">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              {/* Quantum Orb */}
              <motion.div
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  rotate: [0, 360]
                }}
                transition={{
                  x: { type: 'spring', stiffness: 50 },
                  y: { type: 'spring', stiffness: 50 },
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                className="relative w-32 h-32 mx-auto mb-8"
              >
                <div className="quantum-orb" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl md:text-7xl font-black mb-4"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {toolName}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-xl max-w-2xl mx-auto mb-8 ${
                  dark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                A revolutionary tool that will transform how you work with text. 
                Powered by quantum algorithms and neural networks.
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotifyMe(true)}
                  className="quantum-button flex items-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Notify Me
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetails(!showDetails)}
                  className="quantum-badge"
                >
                  <Eye className="w-4 h-4" />
                  {showDetails ? 'Hide Details' : 'View Details'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="quantum-badge"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-purple-400">Quantum Progress</span>
                <span className="text-sm text-pink-400">{progress.toFixed(1)}%</span>
              </div>
              <div className="quantum-progress">
                <motion.div
                  className="quantum-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
            >
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  className="quantum-card p-6 text-center"
                >
                  <div className="quantum-countdown">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Features Grid */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Quantum Features
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        className="quantum-card p-6 cursor-pointer"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-xl" style={{ background: `${feature.color}20` }}>
                            {React.cloneElement(feature.icon, { style: { color: feature.color } })}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{feature.title}</h3>
                            <p className="text-sm opacity-70">ETA: {feature.eta}</p>
                          </div>
                        </div>
                        <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature Detail Modal */}
            <AnimatePresence>
              {selectedFeature && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  onClick={() => setSelectedFeature(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="quantum-card max-w-md p-8"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-xl" style={{ background: `${selectedFeature.color}20` }}>
                        {React.cloneElement(selectedFeature.icon, { 
                          style: { color: selectedFeature.color },
                          size: 32
                        })}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedFeature.title}</h3>
                        <p className="text-sm opacity-70">ETA: {selectedFeature.eta}</p>
                      </div>
                    </div>
                    <p className={`mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedFeature.description}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setNotifyMe(true)}
                        className="quantum-button flex-1"
                      >
                        Notify Me
                      </button>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="quantum-badge"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subscribe Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="max-w-md mx-auto mb-16"
            >
              <div className="quantum-card p-8 text-center">
                <h3 className="text-xl font-bold mb-4">Get Launch Updates</h3>
                
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="quantum-input w-full"
                    required
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="quantum-button w-full"
                  >
                    Subscribe
                  </motion.button>
                </form>

                <AnimatePresence>
                  {subscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-green-400 flex items-center gap-2 justify-center"
                    >
                      <PartyPopper className="w-5 h-5" />
                      Thanks for subscribing!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="quantum-badge"
                  style={{ '--hover-color': social.color }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Notify Me Modal */}
            <AnimatePresence>
              {notifyMe && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  onClick={() => setNotifyMe(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="quantum-card max-w-md p-8 text-center"
                    onClick={e => e.stopPropagation()}
                  >
                    <Bell className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Get Notified</h3>
                    <p className={`mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      We'll notify you when {toolName} launches and send you exclusive early access!
                    </p>
                    
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="quantum-input w-full mb-4"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setNotifyMe(false);
                          setSubscribed(true);
                        }}
                        className="quantum-button flex-1"
                      >
                        Notify Me
                      </button>
                      <button
                        onClick={() => setNotifyMe(false)}
                        className="quantum-badge"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className={`text-center pt-8 border-t ${dark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                ⚛️ Have suggestions? We'd love to hear them!{' '}
                <a
                  href="mailto:feedback@quantumtools.com"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  feedback@quantumtools.com
                </a>
              </p>
              <p className={`text-xs mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                © 2024 Quantum Tools. All rights reserved. Patent pending.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          onClick={() => setDark(!dark)}
          className="fixed bottom-6 right-6 quantum-badge p-3 z-50"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Back to Home Button */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 left-6 quantum-badge flex items-center gap-2 z-50"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          Back to Home
        </motion.a>
      </div>
    </>
  );
};

// Additional Icons
const Sun = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default QuantumLaunchPortal;