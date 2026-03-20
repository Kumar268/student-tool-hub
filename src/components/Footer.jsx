import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`mt-auto py-12 px-8 border-t backdrop-blur-md ${
      isDarkMode ? 'bg-gray-900/80 border-gray-700/50 text-gray-400' : 'bg-white/80 border-gray-200/50 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Student Tool Hub
          </h2>
          <p className="mb-6 max-w-md">
            The ultimate collection of 56+ free tools for students worldwide. 
            From academic calculators to image processing, we've got you covered.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500 transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tools</h3>
          <ul className="space-y-2">
            <li><Link to="/category/academic" className="hover:text-blue-500 transition-colors">Academic</Link></li>
            <li><Link to="/category/financial" className="hover:text-blue-500 transition-colors">Financial</Link></li>
            <li><Link to="/category/utility" className="hover:text-blue-500 transition-colors">Utility</Link></li>
            <li><Link to="/category/developer" className="hover:text-blue-500 transition-colors">Developer</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/legal" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/legal" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
            <li><Link to="/legal" className="hover:text-blue-500 transition-colors">About Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700/20 text-center">
        <p className="flex items-center justify-center space-x-1">
          <span>Made with</span>
          <Heart size={16} className="text-red-500 fill-red-500" />
          <span>for students around the world.</span>
        </p>
        <p className="mt-2 text-xs opacity-50">
          © 2026 Student Tool Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;