import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Globe, Mail, Cookie, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   PRIVACY POLICY — StudentToolHub
   Google AdSense requirement: must be live, findable, and complete
   Last reviewed: 2025
───────────────────────────────────────────────────────────────── */

const S = {
  page: { minHeight:'100vh', background:'linear-gradient(135deg,#020408 0%,#050d12 50%,#030810 100%)', color:'#e2eaf4', fontFamily:"'Space Grotesk',system-ui,sans-serif", padding:'40px 20px 80px', position:'relative' },
  inner: { maxWidth:820, margin:'0 auto' },
  backBtn: { display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:10, marginBottom:40, background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(148,163,184,.8)', cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem', letterSpacing:'.05em', transition:'all .15s' },
  badge: { display:'inline-block', padding:'4px 14px', borderRadius:20, marginBottom:16, background:'rgba(0,245,255,0.08)', border:'1px solid rgba(0,245,255,0.20)', fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem', letterSpacing:'.14em', color:'rgba(0,245,255,.7)' },
  h1: { fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:'clamp(1.8rem,5vw,2.8rem)', letterSpacing:'.02em', marginBottom:8, background:'linear-gradient(135deg,#fff 30%,#a78bfa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  meta: { fontSize:'.82rem', color:'rgba(148,163,184,.5)', marginBottom:48, fontFamily:"'JetBrains Mono',monospace" },
  section: { background:'rgba(255,255,255,0.04)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'28px 24px', marginBottom:20 },
  sectionTitle: { display:'flex', alignItems:'center', gap:10, fontSize:'1rem', fontWeight:700, marginBottom:14, color:'#e2eaf4' },
  iconBox: (c) => ({ width:32, height:32, borderRadius:8, background:`${c}18`, border:`1px solid ${c}30`, display:'flex', alignItems:'center', justifyContent:'center', color:c, flexShrink:0 }),
  p: { fontSize:'.9rem', lineHeight:1.8, color:'rgba(148,163,184,.8)', margin:'0 0 12px' },
  ul: { fontSize:'.9rem', lineHeight:1.8, color:'rgba(148,163,184,.8)', paddingLeft:20, margin:'8px 0' },
  li: { marginBottom:6 },
  highlight: { background:'rgba(99,102,241,0.10)', border:'1px solid rgba(99,102,241,0.20)', borderRadius:10, padding:'16px 20px', marginTop:12 },
  link: { color:'#a78bfa', textDecoration:'none' },
  contactBox: { background:'rgba(0,245,255,0.06)', border:'1px solid rgba(0,245,255,0.18)', borderRadius:12, padding:'20px 24px', marginTop:16, display:'flex', alignItems:'center', gap:14 },
  emailText: { fontFamily:"'JetBrains Mono',monospace", fontSize:'.85rem', color:'#00f5ff', wordBreak:'break-all' },
};

export default function Privacy() {
  const navigate = useNavigate();
  const updated = 'January 2025';

  return (
    <>
      <Helmet>
        <title>Privacy Policy | StudentToolHub</title>
        <meta name="description" content="StudentToolHub privacy policy. We don't collect personal data. All tools run in your browser. Learn how Google AdSense uses cookies on our site." />
        <link rel="canonical" href="https://studenttoolhub.com/privacy" />
      </Helmet>

      <div style={S.page}>
        {/* Background grid */}
        <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(0,245,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.018) 1px,transparent 1px)', backgroundSize:'48px 48px' }}/>

        <div style={{ ...S.inner, position:'relative', zIndex:1 }}>
          <button style={S.backBtn} onClick={() => navigate('/')}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.color='#e2eaf4'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(148,163,184,.8)'; }}>
            <ArrowLeft size={13}/> ← BACK TO TOOLS
          </button>

          <div style={S.badge}>◈ LEGAL DOCUMENT</div>
          <h1 style={S.h1}>Privacy Policy</h1>
          <p style={S.meta}>Last Updated: {updated} · Effective immediately</p>

          {/* Section 1 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#00f5ff')}><Shield size={16}/></div>
              1. Introduction
            </div>
            <p style={S.p}>
              Welcome to <strong style={{ color:'#e2eaf4' }}>StudentToolHub</strong> ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains what information we collect (very little), how we use it, and your rights regarding your data.
            </p>
            <p style={S.p}>
              By using StudentToolHub, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          {/* Section 2 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#34d399')}><Eye size={16}/></div>
              2. Information We Collect
            </div>
            <p style={S.p}>
              <strong style={{ color:'#e2eaf4' }}>We do not collect any personal identification information.</strong> All tool calculations — calculus, statistics, unit conversion, PDF operations, image editing — are performed entirely in your browser. Your inputs and files never leave your device and are never sent to our servers.
            </p>
            <div style={S.highlight}>
              <p style={{ ...S.p, margin:0, color:'#a5b4fc' }}>
                ✓ No account creation required &nbsp;·&nbsp; ✓ No form submissions stored &nbsp;·&nbsp; ✓ No uploaded files retained &nbsp;·&nbsp; ✓ 100% browser-based processing
              </p>
            </div>
            <p style={{ ...S.p, marginTop:14 }}>
              We may collect limited anonymous usage data (page views, session duration) through third-party analytics services to understand how people use the site and improve it. This data cannot be used to identify you personally.
            </p>
            <p style={S.p}>
              We also store a small amount of data in your browser's <strong style={{ color:'#e2eaf4' }}>localStorage</strong> — such as your dark mode preference and recent tool history — to improve your experience. This data stays on your device only.
            </p>
          </div>

          {/* Section 3 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#f59e0b')}><Cookie size={16}/></div>
              3. Cookies
            </div>
            <p style={S.p}>
              We use cookies in two ways:
            </p>
            <ul style={S.ul}>
              <li style={S.li}><strong style={{ color:'#e2eaf4' }}>Preference cookies:</strong> Small files stored in your browser to remember settings like dark mode. These are strictly necessary for the site to work as expected.</li>
              <li style={S.li}><strong style={{ color:'#e2eaf4' }}>Advertising cookies:</strong> Set by Google AdSense (described in detail in Section 4 below).</li>
            </ul>
            <p style={{ ...S.p, marginTop:10 }}>
              You can disable cookies in your browser settings at any time. Disabling advertising cookies will not affect your ability to use any tool on this site.
            </p>
          </div>

          {/* Section 4 — Google AdSense — most important for Google */}
          <div style={{ ...S.section, borderColor:'rgba(99,102,241,.25)' }}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#6366f1')}><Globe size={16}/></div>
              4. Google AdSense &amp; Third-Party Advertising
            </div>
            <p style={S.p}>
              StudentToolHub uses <strong style={{ color:'#e2eaf4' }}>Google AdSense</strong> to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to this site or other websites on the Internet.
            </p>
            <ul style={S.ul}>
              <li style={S.li}>Google uses the <strong style={{ color:'#e2eaf4' }}>DoubleClick cookie (DART cookie)</strong> to serve ads to users based on their visit to StudentToolHub and other sites on the Internet.</li>
              <li style={S.li}>Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website.</li>
              <li style={S.li}>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.</li>
            </ul>
            <p style={{ ...S.p, marginTop:12 }}>
              You may opt out of personalised advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={S.link}>Google Ads Settings</a>{' '}
              or by visiting{' '}
              <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={S.link}>aboutads.info</a>.
            </p>
            <p style={S.p}>
              For more information on how Google uses data when you use our site, please visit:{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={S.link}>
                policies.google.com/technologies/partner-sites
              </a>
            </p>
            <div style={S.highlight}>
              <p style={{ ...S.p, margin:0, color:'rgba(148,163,184,.7)', fontSize:'.82rem' }}>
                We do not have access to or control over the cookies placed by Google AdSense. Google AdSense is governed by Google's own Privacy Policy, which you can read at{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={S.link}>policies.google.com/privacy</a>.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#f472b6')}><Lock size={16}/></div>
              5. Data Security
            </div>
            <p style={S.p}>
              Because we do not collect or store personal data on our servers, there is no personal data for us to protect at the server level. Your browser's local storage is managed by your device and browser security model.
            </p>
            <p style={S.p}>
              We use HTTPS to ensure all data transmitted between your browser and our servers (such as loading the site's code and assets) is encrypted in transit.
            </p>
          </div>

          {/* Section 6 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#34d399')}><AlertCircle size={16}/></div>
              6. Children's Privacy
            </div>
            <p style={S.p}>
              StudentToolHub does not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us. We will delete any such information promptly.
            </p>
          </div>

          {/* Section 7 */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#a78bfa')}><Globe size={16}/></div>
              7. Changes to This Policy
            </div>
            <p style={S.p}>
              We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Section 8 — Contact */}
          <div style={S.section}>
            <div style={S.sectionTitle}>
              <div style={S.iconBox('#00f5ff')}><Mail size={16}/></div>
              8. Contact Us
            </div>
            <p style={S.p}>
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div style={S.contactBox}>
              <Mail size={20} style={{ color:'#00f5ff', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:'.72rem', color:'rgba(148,163,184,.5)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.06em', marginBottom:4 }}>EMAIL</div>
                <a href="mailto:contact@studenttoolhub.com" style={S.emailText}>
                  contact@studenttoolhub.com
                </a>
              </div>
            </div>
            <p style={{ ...S.p, marginTop:14, fontSize:'.82rem' }}>
              We aim to respond to all inquiries within 48 hours.
            </p>
          </div>

          {/* Footer links */}
          <div style={{ marginTop:40, paddingTop:24, borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center' }}>
            {[
              { label:'← Back to Tools', to:'/' },
              { label:'About Us', to:'/about' },
              { label:'Contact', to:'/contact' },
              { label:'Legal & Terms', to:'/legal' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize:'.75rem', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.05em', color:'rgba(148,163,184,.45)', textDecoration:'none', transition:'color .14s' }}
                onMouseEnter={e => e.target.style.color='#e2eaf4'}
                onMouseLeave={e => e.target.style.color='rgba(148,163,184,.45)'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}