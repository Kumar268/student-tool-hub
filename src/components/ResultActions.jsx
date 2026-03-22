import React, { useState, useCallback } from 'react';
import { Copy, Check, Share2, Link2 } from 'lucide-react';

/**
 * CopyButton — copies any string to clipboard with visual feedback.
 * 
 * Usage: <CopyButton value="result text to copy" />
 *        <CopyButton value={gpaResult} label="Copy GPA" isDarkMode={isDarkMode} />
 */
export const CopyButton = ({ value, label = 'Copy', isDarkMode, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = String(value);
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      disabled={!value}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        copied
          ? 'bg-green-500 text-white'
          : isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
      } disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

/**
 * ShareButton — shares the current tool page.
 * Uses Web Share API on mobile, falls back to copying URL.
 * 
 * Usage: <ShareButton toolName="GPA Calculator" isDarkMode={isDarkMode} />
 */
export const ShareButton = ({ toolName = 'this tool', isDarkMode, className = '' }) => {
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: `${toolName} — Student Tool Hub`,
      text: `Check out this free student tool: ${toolName}`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShared(true);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(url);
        setShared(true);
      }
      setTimeout(() => setShared(false), 2500);
    } catch {
      // User cancelled or error — silent fail
    }
  }, [toolName]);

  return (
    <button
      onClick={handleShare}
      title={shared ? 'Link copied!' : 'Share this tool'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        shared
          ? 'bg-blue-500 text-white'
          : isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
      } ${className}`}
    >
      {shared ? <Check size={12} /> : (navigator.share ? <Share2 size={12} /> : <Link2 size={12} />)}
      {shared ? 'Link Copied!' : 'Share'}
    </button>
  );
};
