import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Rocket, ArrowRight } from 'lucide-react';
import { categories } from '../data/tools';

const Footer = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-20 border-t backdrop-blur-md transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900/60 border-gray-800 text-gray-400' : 'bg-white/60 border-gray-100 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                <Rocket size={20} />
              </div>
              <span className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Student<span className="text-blue-500">ToolHub</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed max-w-xs opacity-80">
              Empowering students worldwide with 56+ free, browser-based tools. No sign-up, no data collection — just pure productivity.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { value: '56+', label: 'Free Tools' },
                { value: '0', label: 'Signups' },
                { value: '100%', label: 'Browser' },
              ].map(s => (
                <div key={s.label} className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="text-blue-500 font-black text-lg">{s.value}</div>
                  <div className="text-xs opacity-60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/Kumar268/student-tool-hub" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="GitHub"><Github size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="mailto:contact@studenttoolhub.com" className="hover:text-blue-500 transition-colors" aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}
                    className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all inline-flex items-center gap-1"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/categories" className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1">
                  All categories <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'All Tools', path: '/' },
                { name: 'Browse Categories', path: '/categories' },
                { name: 'About Us', path: '/about' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Suggest a Tool', path: '/contact' },
              ].map(l => (
                <li key={l.name}>
                  <Link to={l.path} className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all inline-block">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms-of-service' },
                { name: 'Cookie Policy', path: '/privacy-policy#cookies' },
              ].map(l => (
                <li key={l.name}>
                  <Link to={l.path} className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all inline-block">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* AdSense compliance note */}
            <div className={`mt-8 p-3 rounded-xl text-xs leading-relaxed ${isDarkMode ? 'bg-gray-800/40 text-gray-500' : 'bg-gray-50 text-gray-500'}`}>
              <p>This site uses Google AdSense for advertising and Google Analytics for traffic measurement. Ads may be personalised based on your interests.</p>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className={`mt-14 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${
          isDarkMode ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <p className="opacity-70">© {currentYear} StudentToolHub. All rights reserved.</p>
          <div className="flex items-center gap-4 opacity-70">
            <span>All tools are 100% free & browser-based</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={11} className="text-red-500 fill-red-500 mx-0.5" /> by <span className="text-blue-500 ml-1 font-semibold">Kumar</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;