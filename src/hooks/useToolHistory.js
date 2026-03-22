/**
 * useToolHistory — tracks tool visits in localStorage.
 * 
 * Data shape stored in localStorage key 'tool_history':
 * { [slug]: { count: number, lastVisit: timestamp } }
 * 
 * Usage:
 *   const { recentTools, popularTools, trackVisit } = useToolHistory();
 */
import { useState, useCallback, useEffect } from 'react';
import { tools } from '../data/tools';

const STORAGE_KEY = 'tool_history';
const MAX_RECENT = 6;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeHistory(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {/* ignore quota errors */}
}

/** Call this when a user opens a tool page */
export function trackToolVisit(slug) {
  const history = readHistory();
  const prev = history[slug] || { count: 0, lastVisit: 0 };
  history[slug] = { count: prev.count + 1, lastVisit: Date.now() };
  writeHistory(history);
}

/** Hook that returns recentTools & popularTools arrays */
export default function useToolHistory() {
  const [history, setHistory] = useState(readHistory);

  // Re-read from storage whenever the window gains focus
  useEffect(() => {
    const onFocus = () => setHistory(readHistory());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const trackVisit = useCallback((slug) => {
    trackToolVisit(slug);
    setHistory(readHistory());
  }, []);

  // Last MAX_RECENT unique tools, sorted by lastVisit desc
  const recentTools = tools
    .filter(t => history[t.slug])
    .sort((a, b) => (history[b.slug]?.lastVisit || 0) - (history[a.slug]?.lastVisit || 0))
    .slice(0, MAX_RECENT);

  // Top 8 tools sorted by visit count
  const popularTools = tools
    .filter(t => history[t.slug]?.count > 1)
    .sort((a, b) => (history[b.slug]?.count || 0) - (history[a.slug]?.count || 0))
    .slice(0, 8);

  return { recentTools, popularTools, trackVisit };
}
