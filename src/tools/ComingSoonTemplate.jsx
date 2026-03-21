import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Bell } from 'lucide-react';

/**
 * ComingSoonTemplate — Crystalline edition
 * Used as fallback for any unmapped tool slug.
 */
const ComingSoonTemplate = ({ toolName = 'Tool', isDarkMode }) => {
  const navigate = useNavigate();
  const dk = isDarkMode;

  return (
    <div className="tool-content-zone" style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div className="crystalline-surface" style={{
        maxWidth: 520,
        width: '100%',
        padding: '52px 40px',
        textAlign: 'center',
        borderRadius: 20,
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          marginBottom: 24,
        }}>
          <Sparkles size={32} color="#fff" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 800,
          color: dk ? '#f1f5f9' : '#0f172a',
          marginBottom: 10, lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {toolName}
        </h1>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          padding: '4px 14px', borderRadius: 20,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          color: '#a5b4fc',
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.05em',
          marginBottom: 20,
        }}>
          ✦ Coming Soon
        </div>

        <p style={{
          fontSize: 15, lineHeight: 1.7,
          color: dk ? '#94a3b8' : '#64748b',
          maxWidth: 380, margin: '0 auto 32px',
        }}>
          This tool is under active development and will be available very soon.
          Check back in a few days for the full experience.
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
          margin: '0 auto 28px',
          maxWidth: 240,
        }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
            }}
          >
            <ArrowLeft size={15} />
            Back to All Tools
          </button>
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: 28, fontSize: 12,
          color: dk ? '#475569' : '#cbd5e1',
        }}>
          56+ free tools for students — more added weekly
        </p>
      </div>
    </div>
  );
};

export default ComingSoonTemplate;