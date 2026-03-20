import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Globe } from 'lucide-react';

export default function Privacy({ isDarkMode }) {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | StudentToolHub</title>
        <meta name="description" content="Privacy Policy for StudentToolHub. Learn how we handle your data and our commitment to your privacy." />
      </Helmet>

      <div className={`min-h-screen py-12 px-6 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border mb-12 transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <header className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="text-blue-500" />
                1. Introduction
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Welcome to StudentToolHub. Your privacy is critically important to us. 
                This Privacy Policy document contains types of information that is collected and recorded by StudentToolHub and how we use it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="text-purple-500" />
                2. Information We Collect
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We believe in data minimization. Most tools on StudentToolHub are "Browser-Based", meaning your data stays on your local machine.
              </p>
              <ul className="list-disc pl-6 text-gray-500 space-y-2">
                <li><strong>Usage Data:</strong> We may collect anonymous information on how the Service is accessed and used (e.g., page views).</li>
                <li><strong>Cookies:</strong> We use cookies to enhance your experience and for advertising purposes.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="text-green-500" />
                3. Google AdSense & Third-Party Advertising
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We use Google AdSense to serve ads when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on our site.
              </p>
              <ul className="list-disc pl-6 text-gray-500 space-y-2">
                <li>Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.</li>
                <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
                <li>We use cookies to personalize content and ads, to provide social media features and to analyze our traffic.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="text-orange-500" />
                4. Data Security
              </h2>
              <p className="text-gray-500 leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet, 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, 
                we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
              <p className="text-gray-500 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us via our GitHub repository or official communication channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
