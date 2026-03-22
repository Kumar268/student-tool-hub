import React, { useState, useEffect } from 'react';
import { Cookie, X, CheckCircle, XCircle } from 'lucide-react';
import { initGA } from '../utils/analytics';

const CONSENT_KEY = 'cookie_consent';

const CookieConsent = ({ isDarkMode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Show banner after 1s delay so it doesn't flash on first render
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
    // If previously accepted, init GA
    if (stored === 'accepted') initGA();
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    initGA();
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl shadow-2xl border transition-all ${
        isDarkMode
          ? 'bg-gray-900 border-gray-700 text-gray-300'
          : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
          <Cookie size={20} />
        </div>
        <div>
          <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            We use cookies 🍪
          </h3>
          <p className="text-xs leading-relaxed">
            We use Google Analytics to understand which tools students use most. 
            No personal data is sold. You can{' '}
            <a href="/privacy-policy" className="text-blue-500 hover:underline">read our privacy policy</a> for details.
          </p>
        </div>
        <button
          onClick={reject}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 shrink-0 transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={accept}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <CheckCircle size={16} />
          Accept
        </button>
        <button
          onClick={reject}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            isDarkMode
              ? 'border-gray-700 hover:bg-gray-800 text-gray-400'
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
          }`}
        >
          <XCircle size={16} />
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
