import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, User, Clock, Share2, Github, Twitter, Linkedin } from 'lucide-react';

const Contact = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Get FormspreeID from environment variables
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID || 'YOUR_FORM_ID';
      
      // Submit to Formspree endpoint
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Auto-clear success message after 5 seconds
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <Helmet>
        <title>Contact Us | Student Tool Hub</title>
        <meta name="description" content="Have a question or suggestion for Student Tool Hub? Contact us through our form or direct email." />
      </Helmet>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Get in Touch</h1>
          <p className="text-lg mb-8">
            Have a suggestion for a new tool? Found a bug? Or just want to say hello? We're always looking for feedback to make Student Tool Hub better for everyone.
          </p>

          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex items-start space-x-4 ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/40 border-gray-200'}`}>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Mail size={24} />
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Direct Email</h3>
                <p className="text-sm opacity-60">contact@studenttoolhub.com</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border flex items-start space-x-4 ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/40 border-gray-200'}`}>
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Response Time</h3>
                <p className="text-sm opacity-60">Within 24-48 hours</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border flex items-start space-x-4 ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white/40 border-gray-200'}`}>
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Social Media</h3>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="hover:text-blue-500 transition-colors"><Github size={20} /></a>
                  <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-8 rounded-3xl border backdrop-blur-xl ${
            isDarkMode ? 'bg-gray-900/60 border-gray-800 shadow-2xl shadow-blue-500/5' : 'bg-white border-gray-200 shadow-xl'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} /> Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500/50 text-white' : 'bg-gray-50 border-gray-200 focus:ring-blue-500/20'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500/50 text-white' : 'bg-gray-50 border-gray-200 focus:ring-blue-500/20'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare size={16} /> Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500/50 text-white' : 'bg-gray-50 border-gray-200 focus:ring-blue-500/20'
                }`}
                placeholder="How can we help?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all resize-none ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-500/50 text-white' : 'bg-gray-50 border-gray-200 focus:ring-blue-500/20'
                }`}
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${
                status === 'success' 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : status === 'error'
                  ? 'bg-red-500 text-white shadow-red-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/20'
              }`}
            >
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed - Try Again' : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
