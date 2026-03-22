import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Zap, BookOpen, DollarSign } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    icon: Zap,
    color: 'blue',
    title: 'About the Tools',
    faqs: [
      {
        q: 'Are all tools completely free?',
        a: 'Yes, 100%. All 56+ tools on Student Tool Hub are free, with no signup, no credit card, and no usage limits. They are supported by non-intrusive advertising.',
      },
      {
        q: 'Do the tools require an internet connection?',
        a: 'Most tools run entirely in your browser and work offline once the page has loaded. A few tools (like grammar checking or PDF conversion) may require a connection to process data.',
      },
      {
        q: 'Can I use tools on my phone or tablet?',
        a: 'Yes! All tools are designed to be responsive and work on mobile, tablet, and desktop. If you find any tool that doesn\'t work well on your device, please contact us so we can fix it.',
      },
      {
        q: 'How accurate are the calculators?',
        a: 'Our calculators use industry-standard formulas and are tested for accuracy. For academic submissions, always double-check critical results. If you spot an error, please report it via the Contact page.',
      },
    ],
  },
  {
    icon: Shield,
    color: 'green',
    title: 'Privacy & Data',
    faqs: [
      {
        q: 'Do you store my data or calculations?',
        a: 'No. All calculations happen locally in your browser. We never upload your inputs, files, or results to any server. Your data stays on your device.',
      },
      {
        q: 'Do you use cookies?',
        a: 'We use minimal cookies: one for your dark/light mode preference, and Google Analytics cookies (only if you accept the cookie banner) to help us understand which tools are most useful. We do not use tracking cookies for advertising purposes.',
      },
      {
        q: 'Is Student Tool Hub GDPR/CCPA compliant?',
        a: 'Yes. We do not collect or sell personal information. You can opt out of analytics by clicking "Reject" on the cookie banner. Read our full Privacy Policy for details.',
      },
      {
        q: 'What happens when I use the PDF or image tools?',
        a: 'PDF and image files you upload are processed entirely in your browser using JavaScript libraries. They never leave your device and are automatically discarded when you close or refresh the page.',
      },
    ],
  },
  {
    icon: DollarSign,
    color: 'yellow',
    title: 'Ads & Monetization',
    faqs: [
      {
        q: 'Why are there ads on the site?',
        a: 'Keeping 56+ tools free and fast requires hosting, development time, and ongoing maintenance. Non-intrusive ads help cover these costs without charging users. We are applying for Google AdSense to ensure ad quality.',
      },
      {
        q: 'Can I use an ad blocker?',
        a: 'Yes, you can. The tools will still work perfectly. We do prefer you allow ads to help support the project, but we respect your choice.',
      },
    ],
  },
  {
    icon: BookOpen,
    color: 'purple',
    title: 'Technical & Feedback',
    faqs: [
      {
        q: 'A tool isn\'t working correctly. What should I do?',
        a: 'Try refreshing the page first. If the problem persists, report it via our Contact page with the tool name, what you tried, and what went wrong. We typically fix bugs within 24–48 hours.',
      },
      {
        q: 'Can I request a new tool?',
        a: 'Absolutely! Visit the Contact page and describe the tool you need. We review all suggestions and prioritize based on how many students would benefit.',
      },
      {
        q: 'Can I contribute to the project?',
        a: 'Yes! The project is open source on GitHub. You can submit bug reports, feature requests, or even pull requests. Check the About page for the GitHub link.',
      },
      {
        q: 'Why does the site look different in dark vs light mode?',
        a: 'The premium "futuristic" dark mode is our primary design. The light mode is optimized for readability. Toggle between them using the moon/sun icon in the top bar.',
      },
    ],
  },
];

const COLOR_MAP = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  yellow: 'bg-yellow-500/10 text-yellow-500',
  purple: 'bg-purple-500/10 text-purple-500',
};

const FAQItem = ({ q, a, isDarkMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b last:border-b-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className={`text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : 'text-gray-400'}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed opacity-70">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = ({ isDarkMode }) => (
  <div className={`min-h-screen pt-20 pb-16 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <Helmet>
      <title>FAQ — Frequently Asked Questions | Student Tool Hub</title>
      <meta name="description" content="Answers to common questions about Student Tool Hub's free student tools, privacy, data usage, and advertising." />
    </Helmet>

    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold mb-4">
          <HelpCircle size={16} /> FAQ
        </div>
        <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Frequently Asked Questions
        </h1>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Everything you need to know about Student Tool Hub. Can't find an answer? <a href="/contact" className="text-blue-500 hover:underline">Contact us</a>.
        </p>
      </motion.div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {FAQ_SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'}`}
            >
              <div className={`flex items-center gap-3 px-6 py-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className={`p-2 rounded-xl ${COLOR_MAP[section.color]}`}>
                  <Icon size={18} />
                </div>
                <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{section.title}</h2>
              </div>
              <div className="px-6">
                {section.faqs.map((faq, j) => (
                  <FAQItem key={j} q={faq.q} a={faq.a} isDarkMode={isDarkMode} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-12 p-8 rounded-2xl border text-center ${isDarkMode ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}
      >
        <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Still have questions?</h3>
        <p className="opacity-70 mb-6">Our support team typically responds within 24 hours.</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  </div>
);

export default FAQ;
