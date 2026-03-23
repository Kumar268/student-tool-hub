import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion } from 'framer-motion';
import { Heart, Target, Zap, Users, Code, BookOpen, Coffee } from 'lucide-react';

const About = ({ isDarkMode }) => {
  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <Helmet>
        <title>About Us | Student Tool Hub</title>
        <meta name="description" content="Learn more about Student Tool Hub, our mission to help students with free online tools, and the team behind it." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-6 font-bold text-sm tracking-widest uppercase">
            Our Story
          </div>
          <h1 className={`text-4xl md:text-6xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Built for Students, <br />
            <span className="text-blue-500">By a Student.</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
            Student Tool Hub was born out of a simple problem: the student toolbox was scattered across dozens of clunky, ad-heavy, and confusing websites.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Motion.div 
            whileHover={{ y: -5 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
              <Heart size={24} />
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Motivation</h3>
            <p className="leading-relaxed opacity-70">
              As a developer and a student, I spent thousands of hours searching for reliable GPA calculators, PDF tools, and math solvers. Most were filled with intrusive popups. I decided to build one clean, unified platform for everything.
            </p>
          </Motion.div>

          <Motion.div 
            whileHover={{ y: -5 }}
            className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
              <Target size={24} />
            </div>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Mission</h3>
            <p className="leading-relaxed opacity-70">
              Our mission is to provide 100% free, high-quality tools that run entirely in your browser. No signups, no data selling, and no subscription walls. Just pure productivity.
            </p>
          </Motion.div>
        </div>

        <div className={`p-10 md:p-16 rounded-[2.5rem] border backdrop-blur-md overflow-hidden relative mb-20 ${
          isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Zap size={48} fill="currentColor" />
            </div>
            <div className="text-center md:text-left">
              <h2 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What's Next?</h2>
              <p className="text-lg opacity-80 leading-relaxed">
                We started with 50+ tools, but we're just getting started. We're planning to add AI-powered study assistants, collaborative document spaces, and real-time student resource maps.
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">56+</div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 italic">Free Tools</p>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">0</div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 italic">Signups Required</p>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">100%</div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 italic">Browser Based</p>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">∞</div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-60 italic">Student Love</p>
          </div>
        </div>

        <div className="mt-24 text-center">
            <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Want to support the project?</h2>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Suggest a Tool</a>
                <button className={`px-8 py-3 rounded-xl font-bold border transition-all ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>Spread the Word</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;