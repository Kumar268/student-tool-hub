import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Globe, Mail, Cookie, FileText } from 'lucide-react';

const PrivacyPolicy = ({ isDarkMode }) => {
  const lastUpdated = "March 2026";

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <Helmet>
        <title>Privacy Policy | Student Tool Hub</title>
        <meta name="description" content="Privacy Policy for Student Tool Hub. We value your privacy and explain how we handle your data and cookies for Google AdSense." />
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
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Shield size={32} />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h1>
              <p className="text-sm opacity-60 mt-1">Last Updated: {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none transition-colors duration-300">
            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText size={20} className="text-blue-500" /> 1. Introduction
              </h2>
              <p>
                Welcome to Student Tool Hub. We respect your privacy and are committed to protecting any information that may be collected through your use of our website. This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to safeguard your data.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Eye size={20} className="text-blue-500" /> 2. Information Collection
              </h2>
              <p>
                <strong>Personal Data:</strong> We do not require users to create accounts or provide personal identification information (such as name, email, or address) to use our tools. All calculations and processing for tools like the GPA Calculator, PDF converters, and Image editors happen <strong>locally in your browser</strong>. Your files and inputs are never uploaded to our servers.
              </p>
              <p className="mt-4">
                <strong>Log Files:</strong> Like many other websites, Student Tool Hub makes use of log files. These files merely log visitors to the site – usually a standard procedure for hosting companies and a part of hosting services' analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks.
              </p>
            </section>

            <section className="mb-10 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Globe size={20} className="text-blue-500" /> 3. Google AdSense & Third-Party Advertising
              </h2>
              <p>
                We use Google AdSense to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on your site. Google's use of the advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Google AdSense uses the DoubleClick cookie to serve more relevant ads across the web and limit the number of times a given ad is shown to you.</li>
                <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Ads Settings</a>.</li>
                <li>For more information on how Google uses data in AdSense, please visit <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">How Google uses data</a>.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Cookie size={20} className="text-blue-500" /> 4. Cookies and Web Beacons
              </h2>
              <p>
                Student Tool Hub uses cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information that the visitor sends via their browser.
              </p>
            </section>

            <section className="mb-10">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Lock size={20} className="text-blue-500" /> 5. Data Security (GDPR & CCPA)
              </h2>
              <p>
                <strong>GDPR Compliance:</strong> For users in the European Union, we act as a data controller for the limited anonymous usage data we collect. You have the right to access, correct, or delete any data collected. Since we do not store personal details, this primarily applies to cookie preferences.
              </p>
              <p className="mt-4">
                <strong>CCPA Compliance:</strong> For California residents, you have the right to know what personal data is being collected and to request its deletion. We do not "sell" personal information as defined by the CCPA.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Mail size={20} className="text-blue-500" /> 6. Contact Information
              </h2>
              <p>
                If you have any questions about our Privacy Policy or the practices of this site, please contact us at:
              </p>
              <div className={`mt-4 p-4 rounded-xl font-mono text-sm ${isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}>
                privacy@studenttoolhub.com
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
