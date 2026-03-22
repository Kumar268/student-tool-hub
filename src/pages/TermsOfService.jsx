import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, Gavel, AlertCircle, Scale, ShieldCheck, Terminal } from 'lucide-react';

const TermsOfService = ({ isDarkMode }) => {
  const lastUpdated = "March 2026";

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <Helmet>
        <title>Terms of Service | Student Tool Hub</title>
        <meta name="description" content="Terms of Service for Student Tool Hub. Read about our acceptable use policy, disclaimers, and user responsibilities." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 md:p-12 rounded-3xl border backdrop-blur-xl ${
            isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/40 border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Gavel size={32} />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service</h1>
              <p className="text-sm opacity-60 mt-1">Last Updated: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none transition-colors duration-300">
            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText size={20} className="text-purple-500" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Student Tool Hub ("the Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="mb-10 font-bold border-l-4 border-red-500 pl-4 py-2">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <AlertCircle size={20} className="text-red-500" /> 2. Disclaimer of Warranties
              </h2>
              <p>
                The materials on Student Tool Hub are provided on an 'as is' basis. Student Tool Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="mt-2 text-sm italic">
                Note: While we strive for 100% accuracy in our calculators and converters, results should be verified for critical academic or financial applications.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Terminal size={20} className="text-purple-500" /> 3. Acceptable Use
              </h2>
              <p>
                You agree not to use the Website for any purpose that is unlawful or prohibited by these Terms. You may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Use the Website in any manner that could damage, disable, overburden, or impair the site.</li>
                <li>Attempt to gain unauthorized access to any part of the Website.</li>
                <li>Use automated scripts or "bots" to scrape data or flood the services.</li>
                <li>Upload files containing viruses, Trojan horses, or any other harmful code.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Scale size={20} className="text-purple-500" /> 4. Limitation of Liability
              </h2>
              <p>
                In no event shall Student Tool Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Student Tool Hub, even if Student Tool Hub or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <ShieldCheck size={20} className="text-purple-500" /> 5. Intellectual Property
              </h2>
              <p>
                The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Website are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, use, or publication by you of any such matters or any part of the Website is strictly prohibited without express written permission.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <AlertCircle size={20} className="text-purple-500" /> 6. Governing Law
              </h2>
              <p>
                Any claim relating to Student Tool Hub shall be governed by the laws of the website owner's operating jurisdiction without regard to its conflict of law provisions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
