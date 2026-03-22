import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Rocket } from 'lucide-react';

const Footer = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Tools',
      links: [
        { name: 'GPA Calculator', path: '/tools/academic/gpa-calculator' },
        { name: 'Matrix Algebra', path: '/tools/academic/matrix-algebra' },
        { name: 'PDF Tools', path: '/category/pdf' },
        { name: 'All Tools', path: '/' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Suggest a Tool', path: '/contact' },
        { name: 'Support Project', path: '/about' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' },
        { name: 'Cookie Policy', path: '/privacy-policy' },
      ]
    }
  ];

  return (
    <footer className={`mt-20 border-t backdrop-blur-md transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900/60 border-gray-800 text-gray-400' : 'bg-white/60 border-gray-100 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                <Rocket size={20} />
              </div>
              <span className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Student<span className="text-blue-500">ToolHub</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed max-w-xs">
              Empowering students worldwide with 56+ free, professional online tools. No collection of personal data, just high-quality browser-based utilities.
            </p>
            <div className="flex space-x-5 mt-8">
              <a href="#" className="hover:text-blue-500 transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
              <a href="mailto:contact@studenttoolhub.com" className="hover:text-blue-500 transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Dynamic Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className={`text-sm font-bold uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm hover:text-blue-500 hover:translate-x-1 transition-all inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${
          isDarkMode ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <p className="text-xs font-medium">
            &copy; {currentYear} StudentToolHub. All rights reserved.
          </p>
          <div className="flex items-center text-xs font-medium bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10">
            Made with <Heart size={12} className="mx-1 text-red-500 fill-red-500" /> by <span className="text-blue-500 ml-1">KUMAR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;