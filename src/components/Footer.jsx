import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart, Zap } from 'lucide-react';

const FONT = "'JetBrains Mono', monospace";
const FONT_D = "'Orbitron', sans-serif";

const TOOL_LINKS = [
  { label: 'Academic',   to: '/category/academic' },
  { label: 'Financial',  to: '/category/financial' },
  { label: 'PDF Tools',  to: '/category/pdf' },
  { label: 'Developer',  to: '/category/developer' },
  { label: 'Image',      to: '/category/image' },
  { label: 'Doc Maker',  to: '/category/documentmaker' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Legal & Terms',  to: '/legal' },
  { label: 'About Us',       to: '/about' },
  { label: 'Contact Us',     to: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const linkStyle = {
    fontSize: '.72rem', letterSpacing: '.04em',
    color: 'rgba(148,163,184,.5)', textDecoration: 'none', transition: 'color .14s',
  };

  const iconBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(148,163,184,.55)', textDecoration: 'none', transition: 'all .15s',
  };

  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(2,4,8,0.85)',
      backdropFilter: 'blur(28px) saturate(160%)',
      WebkitBackdropFilter: 'blur(28px) saturate(160%)',
      boxShadow: '0 -1px 0 rgba(255,255,255,0.04)',
      fontFamily: FONT,
    }}>
      {/* Rainbow accent line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(0,245,255,.4) 25%,rgba(167,139,250,.4) 55%,rgba(244,114,182,.3) 80%,transparent)',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 24px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px,1fr) auto auto',
          gap: '48px',
          marginBottom: 36,
          flexWrap: 'wrap',
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: FONT_D, fontWeight: 900, fontSize: '1.05rem',
              letterSpacing: '.07em', marginBottom: 12,
              background: 'linear-gradient(90deg,#00f5ff,#a78bfa,#f472b6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>STUDENTTOOLHUB</div>
            <p style={{ fontSize: '.7rem', lineHeight: 1.85, maxWidth: 280, color: 'rgba(148,163,184,.5)', marginBottom: 20 }}>
              56+ free tools for students. Academic calculators, PDF utilities,
              image editors — no login, no cost, no limits.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { Icon: Github,  href: '#', label: 'GitHub',  hover: '#00f5ff' },
                { Icon: Twitter, href: '#', label: 'Twitter', hover: '#38bdf8' },
                { Icon: Mail,    href: '#', label: 'Email',   hover: '#a78bfa' },
              ].map(({ Icon, href, label, hover }) => {
                const IconComponent = Icon;
                return (
                <a key={label} href={href} aria-label={label} style={iconBtn}
                  onMouseEnter={e => {
                    Object.assign(e.currentTarget.style, {
                      background: `${hover}18`, borderColor: `${hover}44`,
                      color: hover, boxShadow: `0 0 14px ${hover}22`,
                    });
                  }}
                  onMouseLeave={e => {
                    Object.assign(e.currentTarget.style, {
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.10)',
                      color: 'rgba(148,163,184,.55)', boxShadow: 'none',
                    });
                  }}>
                  <IconComponent size={14} />
                </a>
              );
              })}
            </div>
          </div>

          {/* Tools column */}
          <div>
            <div style={{ fontSize: '.58rem', letterSpacing: '.14em', color: 'rgba(0,245,255,.45)', marginBottom: 14, fontWeight: 700 }}>
              ◈ TOOLS
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {TOOL_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={linkStyle}
                    onMouseEnter={e => e.target.style.color = '#e2eaf4'}
                    onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <div style={{ fontSize: '.58rem', letterSpacing: '.14em', color: 'rgba(167,139,250,.45)', marginBottom: 14, fontWeight: 700 }}>
              ◈ LEGAL
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {LEGAL_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={linkStyle}
                    onMouseEnter={e => e.target.style.color = '#e2eaf4'}
                    onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)', marginBottom: 18 }}/>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.6rem', letterSpacing: '.07em', color: 'rgba(148,163,184,.3)' }}>
            <Zap size={10} style={{ color: '#00f5ff', opacity: .55 }}/>
            <span>MADE WITH</span>
            <Heart size={10} style={{ color: '#f472b6', fill: '#f472b6' }}/>
            <span>FOR STUDENTS EVERYWHERE · {year}</span>
          </div>
          <div style={{ fontSize: '.58rem', letterSpacing: '.08em', color: 'rgba(148,163,184,.22)' }}>
            FREE · NO TRACKING · 100% IN-BROWSER
          </div>
        </div>
      </div>
    </footer>
  );
}