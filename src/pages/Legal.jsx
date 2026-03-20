import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Info, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LegalSection = ({ title, icon: Icon, children, isDarkMode }) => (
  <section className={`mb-12 p-8 rounded-2xl border backdrop-blur-md ${
    isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'
  }`}>
    <div className="flex items-center mb-6">
      <div className={`p-3 rounded-xl mr-4 ${
        isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
      }`}>
        <Icon size={24} />
      </div>
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    </div>
    <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray-300' : 'prose-gray-600'}`}>
      {children}
    </div>
  </section>
);

const Legal = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`mb-8 flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:text-white' 
              : 'bg-white/50 border-gray-200/50 text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Legal & Information
          </h1>

          <LegalSection title="Privacy Policy" icon={Shield} isDarkMode={isDarkMode}>
            <p>At Student Tool Hub, we take your privacy seriously. This policy describes how we collect and use your data.</p>
            <h3>1. Data Collection</h3>
            <p>We do not collect any personal identification information. All tool calculations are performed locally in your browser. Your data never leaves your device.</p>
            <h3>2. Cookies</h3>
            <p>We use essential cookies to remember your preferences, such as dark mode settings. We also use Google AdSense cookies to serve relevant advertisements.</p>
            <h3>3. Third-Party Services</h3>
            <p>We use Google AdSense to serve ads. Google may use cookies to serve ads based on your prior visits to our website or other websites.</p>
          </LegalSection>

          <LegalSection title="Terms of Service" icon={FileText} isDarkMode={isDarkMode}>
            <p>By using Student Tool Hub, you agree to the following terms and conditions.</p>
            <h3>1. Use of Tools</h3>
            <p>The tools provided on this website are for educational purposes only. While we strive for accuracy, we cannot guarantee the results for official or legal use.</p>
            <h3>2. Intellectual Property</h3>
            <p>All content, design, and code on this website are the property of Student Tool Hub. Unauthorized reproduction is prohibited.</p>
            <h3>3. Disclaimer</h3>
            <p>Student Tool Hub is provided "as is" without any warranties. We are not liable for any damages arising from the use of our tools.</p>
          </LegalSection>

          <LegalSection title="About Us" icon={Info} isDarkMode={isDarkMode}>
            <p>Student Tool Hub is a collection of 56+ free tools designed to help students worldwide with their academic and daily tasks.</p>
            <h3>Our Mission</h3>
            <p>To provide high-quality, free, and accessible tools that simplify student life. From GPA calculation to PDF management, we've got you covered.</p>
            <h3>The Tech Stack</h3>
            <p>Built with React, Tailwind CSS, Framer Motion, and React Three Fiber for a modern, glassmorphic experience.</p>
          </LegalSection>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;