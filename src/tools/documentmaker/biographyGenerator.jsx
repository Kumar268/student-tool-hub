import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   BIBLIOGRAPHY / REFERENCE GENERATOR — Document Tools Series #8
   Theme: Dark Onyx / Electric Coral  ·  Light Cream / Oxford Red
   Fonts: Libre Baskerville · Nunito · Fira Code
   Styles: APA 7 · MLA 9 · Chicago 17 · Harvard · IEEE · Vancouver
   Source types: Book · Journal · Website · Chapter · Thesis · Film · Podcast · Dataset
   Features: Manual entry + AI citation assistant · Sort/filter · Copy each or all · Export
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Nunito',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes coral-glow{0%,100%{box-shadow:0 0 0 0 rgba(251,113,133,.18)}50%{box-shadow:0 0 0 8px rgba(251,113,133,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes pop{0%{transform:scale(.93);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes slideup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.dk{
  --bg:#08080c;--s1:#0d0d14;--s2:#111118;--s3:#16161f;
  --bdr:#1e1e2e;--bdr-hi:rgba(251,113,133,.28);
  --acc:#fb7185;--acc2:#f43f5e;--acc3:#38bdf8;--acc4:#a78bfa;
  --tx:#ffe8ec;--tx2:#cc6677;--tx3:#1e1e2e;--txm:#3a2530;
  --err:#fca5a5;--succ:#86efac;--warn:#fde68a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(251,113,133,.05),transparent),
    radial-gradient(ellipse 40% 50% at 90% 85%,rgba(167,139,250,.04),transparent),
    radial-gradient(ellipse 30% 45% at 10% 60%,rgba(56,189,248,.03),transparent);
}
.lt{
  --bg:#fdf8f5;--s1:#ffffff;--s2:#fdeef0;--s3:#fcdde0;
  --bdr:#f0c0c8;--bdr-hi:#8b1a2a;
  --acc:#8b1a2a;--acc2:#b91c1c;--acc3:#1e40af;--acc4:#6d28d9;
  --tx:#1a0508;--tx2:#8b1a2a;--tx3:#f0c0c8;--txm:#7a4050;
  --err:#991b1b;--succ:#166534;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(139,26,42,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(8,8,12,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(253,248,245,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(139,26,42,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(251,113,133,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Nunito',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(251,113,133,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(139,26,42,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:236px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(139,26,42,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Nunito',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#08080c;border-radius:3px;animation:coral-glow 2.8s infinite;}
.dk .btn:hover{background:#fda4af;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(251,113,133,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(139,26,42,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Nunito',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(251,113,133,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(139,26,42,.05);}

.fi{width:100%;outline:none;font-family:'Nunito',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(251,113,133,.1);}
.lt .fi{background:#fff8f9;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(139,26,42,.08);}
.fi::placeholder{opacity:.3;}

/* CITATION CARD */
.cit-card{padding:14px 16px;position:relative;animation:slideup .2s ease;}
.dk .cit-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .cit-card{border:1.5px solid var(--bdr);border-radius:10px;background:white;}
.dk .cit-card:hover{border-color:rgba(251,113,133,.25);}
.lt .cit-card:hover{border-color:rgba(139,26,42,.2);}

/* The citation text itself */
.cit-text{font-family:'Libre Baskerville',serif;font-size:14px;line-height:1.85;
  word-break:break-word;hanging-punctuation:first;}
.dk .cit-text{color:#ffe8ec;}
.lt .cit-text{color:#1a0508;}

/* Type badge */
.type-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;
  font-family:'Fira Code',monospace;font-size:8.5px;font-weight:500;white-space:nowrap;}

/* AI box */
.ai-box{font-family:'Fira Code',monospace;font-size:12px;line-height:1.82;
  padding:16px 18px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-box{color:#fda4af;background:rgba(0,0,0,.5);border:1px solid rgba(251,113,133,.12);border-radius:4px;}
.lt .ai-box{color:#1a0508;background:#fff0f2;border:1.5px solid rgba(251,113,133,.18);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(251,113,133,.42);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(251,113,133,.28);}
.lt .slbl{color:var(--acc);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(251,113,133,.1);}
.lt .prog{background:rgba(139,26,42,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(251,113,133,.01);border:1px dashed rgba(251,113,133,.09);border-radius:3px;}
.lt .ad{background:rgba(139,26,42,.015);border:1.5px dashed rgba(139,26,42,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* STYLE TABS */
.style-tab{padding:7px 14px;cursor:pointer;border:none;font-family:'Fira Code',monospace;
  font-size:10px;font-weight:500;transition:all .13s;white-space:nowrap;}
.dk .style-tab{background:transparent;border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .style-tab.on{background:rgba(251,113,133,.08);border-color:var(--acc);color:var(--acc);}
.dk .style-tab:hover:not(.on){border-color:rgba(251,113,133,.3);color:var(--tx2);}
.lt .style-tab{background:transparent;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txm);}
.lt .style-tab.on{background:rgba(139,26,42,.06);border-color:var(--acc);color:var(--acc);}
.lt .style-tab:hover:not(.on){border-color:rgba(139,26,42,.3);color:var(--tx2);}

/* NUMBERED list */
.ref-list{counter-reset:refs;}
.ref-list-item{counter-increment:refs;display:flex;gap:10px;margin-bottom:10px;animation:slideup .2s ease;}
.ref-num{font-family:'Fira Code',monospace;font-size:12px;min-width:22px;padding-top:1px;flex-shrink:0;}
.dk .ref-num{color:rgba(251,113,133,.4);}
.lt .ref-num{color:var(--acc);opacity:.6;}

/* OVERLAY */
.overlay{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;}
.dk .overlay{background:rgba(0,0,0,.8);}
.lt .overlay{background:rgba(0,0,0,.5);}
.modal{width:100%;max-width:580px;max-height:90vh;overflow-y:auto;border-radius:8px;padding:22px 24px;animation:pop .18s ease;}
.dk .modal{background:var(--s2);border:1px solid var(--bdr);}
.lt .modal{background:white;border:1.5px solid var(--bdr);box-shadow:0 8px 48px rgba(0,0,0,.18);}
`;

/* ══════════════════════════════════════════════════════════════
   CITATION FORMATTERS — one per style
══════════════════════════════════════════════════════════════ */

const f = (s='') => s.trim();
const initials = name => {
  if(!name) return '';
  // "John Smith" → "J. Smith"  |  "Smith, John" → "Smith, J."
  if(name.includes(',')) {
    const [last,first=''] = name.split(',').map(s=>s.trim());
    return `${last}, ${first.split(' ').map(w=>w[0]?w[0]+'.':'').join(' ')}`;
  }
  const parts = name.trim().split(' ');
  const last = parts.pop();
  return `${last}, ${parts.map(w=>w[0]?w[0]+'.':'').join(' ')}`;
};
const formatAuthors = (authStr, style) => {
  if(!authStr) return '';
  const authors = authStr.split(';').map(a=>a.trim()).filter(Boolean);
  if(style==='APA 7') {
    const fmt = authors.map(a=>initials(a));
    if(fmt.length===1) return fmt[0];
    if(fmt.length===2) return fmt.join(' & ');
    if(fmt.length<=20) return fmt.slice(0,-1).join(', ')+', & '+fmt[fmt.length-1];
    return fmt.slice(0,19).join(', ')+', . . . '+fmt[fmt.length-1];
  }
  if(style==='MLA 9') {
    if(authors.length===1) return authors[0]+'.';
    return authors[0]+', et al.';
  }
  if(style==='Chicago') {
    if(authors.length===1) return authors[0];
    if(authors.length===2) return authors[0]+' and '+authors[1];
    return authors[0]+', '+authors[1]+', and '+authors[2+(authors.length>3?0:0)];
  }
  if(style==='Harvard') {
    const fmt = authors.map(a=>initials(a));
    if(fmt.length===1) return fmt[0];
    if(fmt.length===2) return fmt.join(' and ');
    return fmt.slice(0,-1).join(', ')+' and '+fmt[fmt.length-1];
  }
  if(style==='IEEE') {
    return authors.map(a=>{
      const parts = a.trim().split(' ');
      const last = parts.pop();
      return parts.map(w=>w[0]?w[0]+'.':'').join(' ')+' '+last;
    }).join(', ');
  }
  if(style==='Vancouver') {
    return authors.map(a=>initials(a)).join(', ');
  }
  return authStr;
};

/* ─── FORMAT CITATION ─── */
const formatCitation = (src, style) => {
  const {type,authors,year,title,journal,volume,issue,pages,publisher,place,
    url,accessed,doi,edition,editors,chapter,thesis_type,institution,
    film_director,film_year,distributor,podcast_host,episode,
    dataset_source,version} = src;
  const A = formatAuthors(authors, style);
  const Y = f(year);
  const T = f(title);
  const J = f(journal);
  const V = f(volume);
  const I = f(issue);
  const P = f(pages);
  const PB = f(publisher);
  const PL = f(place);
  const U = f(url);
  const ACC = f(accessed);
  const DOI = f(doi);
  const ED = f(edition);
  const ED2 = f(editors);
  const CH = f(chapter);
  const doiStr = DOI ? `https://doi.org/${DOI}` : U ? U : '';
  const urlPart = doiStr ? ` ${doiStr}` : '';
  const accessedPart = ACC&&U&&!DOI ? ` [Accessed ${ACC}].` : '';

  if(style==='APA 7') {
    if(type==='book')
      return `${A||'[Author]'} (${Y||'n.d.'}). _${T||'[Title]'}_ ${ED?`(${ED} ed.).`:'.'}${PL?` ${PL}:`:''} ${PB||'[Publisher]'}.${urlPart}`;
    if(type==='journal')
      return `${A||'[Author]'} (${Y||'n.d.'}). ${T||'[Title]'}. _${J||'[Journal]'}_${V?`, _${V}_`:''}${I?`(${I})`:''}${P?`, ${P}`:''}. ${DOI?`https://doi.org/${DOI}`:(U||'')}`;
    if(type==='website')
      return `${A||'[Author]'} (${Y||'n.d.'}). _${T||'[Title]'}_. ${J||PB||'[Site Name]'}.${urlPart}${accessedPart}`;
    if(type==='chapter')
      return `${A||'[Author]'} (${Y||'n.d.'}). ${T||'[Title]'}. In ${ED2||'[Eds.]'} (Eds.), _${CH||'[Book title]'}_ (pp. ${P||'xx–xx'}).${PL?` ${PL}:`:''} ${PB||'[Publisher]'}.`;
    if(type==='thesis')
      return `${A||'[Author]'} (${Y||'n.d.'}). _${T||'[Title]'}_ [${f(thesis_type)||'Doctoral dissertation'}, ${f(institution)||'[Institution]'}].${urlPart}`;
    if(type==='film')
      return `${f(film_director)||'[Director]'} (Director). (${f(film_year)||Y||'n.d.'}). _${T||'[Film title]'}_ [Film]. ${f(distributor)||'[Distributor]'}.`;
    if(type==='podcast')
      return `${f(podcast_host)||A||'[Host]'} (${Y||'n.d.'}). ${T||'[Episode title]'} (No. ${f(episode)||'1'}) [Audio podcast episode]. In _${J||'[Podcast name]'}_. ${PB||'[Network]'}.${urlPart}`;
    if(type==='dataset')
      return `${A||'[Author]'} (${Y||'n.d.'}). _${T||'[Dataset title]'}_ [Data set]${V?`, Version ${V}`:''}. ${f(dataset_source)||PB||'[Source]'}.${urlPart}`;
  }

  if(style==='MLA 9') {
    const authorMLA = authors ? (authors.split(';')[0].trim()+(authors.split(';').length>1?', et al.':'.')) : '[Author].';
    if(type==='book')
      return `${authorMLA} _${T}_. ${ED?`${ED} ed., `:''} ${PB}, ${Y}.`;
    if(type==='journal')
      return `${authorMLA} "${T}." _${J}_, vol. ${V||'x'}, no. ${I||'x'}, ${Y}, pp. ${P||'xx'}.${DOI?` doi:${DOI}`:(U?` ${U}`:'')}`;
    if(type==='website')
      return `${authorMLA} "${T}." _${J||PB||'[Site]'}_, ${Y}${ACC?`, Accessed ${ACC}`:''}. ${U||''}`;
    if(type==='chapter')
      return `${authorMLA} "${T}." _${CH||'[Book]'}_, edited by ${ED2||'[Ed.]'}, ${PB}, ${Y}, pp. ${P||'xx–xx'}.`;
    if(type==='thesis')
      return `${authorMLA} "${T}." ${f(thesis_type)||'Dissertation'}, ${f(institution)||'[Institution]'}, ${Y}.`;
    if(type==='film')
      return `_${T}_. Directed by ${f(film_director)||'[Director]'}, ${f(distributor)||'[Distributor]'}, ${f(film_year)||Y}.`;
    if(type==='podcast')
      return `"${T}." _${J||'[Podcast]'}_, hosted by ${f(podcast_host)||A||'[Host]'}, ${Y}.${U?' '+U:''}`;
    if(type==='dataset')
      return `${authorMLA} "${T}." _${f(dataset_source)||PB||'[Repository]'}_, ${Y}. ${U||''}`;
  }

  if(style==='Chicago') {
    if(type==='book')
      return `${A||'[Author]'}. _${T}_. ${PL?PL+': ':''}${PB||'[Publisher]'}, ${Y}.`;
    if(type==='journal')
      return `${A||'[Author]'}. "${T}." _${J}_ ${V||'x'}${I?`, no. ${I}`:''}` + (Y?` (${Y})`:'') + (P?`: ${P}`:'')+`.${DOI?` https://doi.org/${DOI}`:(U?' '+U:'')}`;
    if(type==='website')
      return `${A||'[Author]'}. "${T}." ${J||PB||'[Site]'}. ${Y?`${Y}. `:''} ${U||''}${ACC?` Accessed ${ACC}.`:''}`;
    if(type==='chapter')
      return `${A||'[Author]'}. "${T}." In _${CH||'[Book]'}_, edited by ${ED2||'[Ed.]'}, ${P||'xx–xx'}. ${PL?PL+': ':''}${PB||'[Publisher]'}, ${Y}.`;
    if(type==='thesis')
      return `${A||'[Author]'}. "${T}." ${f(thesis_type)||'PhD diss.'}, ${f(institution)||'[Institution]'}, ${Y}.`;
    if(type==='film')
      return `${T}. Directed by ${f(film_director)||'[Director]'}. ${f(distributor)||'[Distributor]'}, ${f(film_year)||Y}.`;
    if(type==='podcast')
      return `${f(podcast_host)||A||'[Host]'}. "${T}." _${J||'[Podcast]'}_ Podcast. ${Y}.${U?' '+U:''}`;
    if(type==='dataset')
      return `${A||'[Author]'}. "${T}." ${f(dataset_source)||'[Repository]'}, ${Y}.${U?' '+U:''}`;
  }

  if(style==='Harvard') {
    if(type==='book')
      return `${A||'[Author]'} (${Y||'n.d.'}) _${T}_.${ED?` ${ED} edn.`:''} ${PL?PL+':':''} ${PB||'[Publisher]'}.`;
    if(type==='journal')
      return `${A||'[Author]'} (${Y||'n.d.'}) '${T}', _${J}_${V?`, vol. ${V}`:''}${I?`, no. ${I}`:''}${P?`, pp. ${P}`:''}. ${DOI?`doi:${DOI}`:(U||'')}`;
    if(type==='website')
      return `${A||'[Author]'} (${Y||'n.d.'}) _${T}_ [Online]. Available at: ${U||'[URL]'}${ACC?` (Accessed: ${ACC})`:''}.`;
    if(type==='chapter')
      return `${A||'[Author]'} (${Y||'n.d.'}) '${T}', in ${ED2||'[Ed.]'} (ed.) _${CH||'[Book]'}_, ${PL?PL+':':''} ${PB||'[Publisher]'}, pp. ${P||'xx–xx'}.`;
    if(type==='thesis')
      return `${A||'[Author]'} (${Y||'n.d.'}) _${T}_. ${f(thesis_type)||'PhD thesis'}. ${f(institution)||'[Institution]'}.`;
    if(type==='film')
      return `${T} (${f(film_year)||Y||'n.d.'}) Directed by ${f(film_director)||'[Director]'}. [Film]. ${f(distributor)||'[Distributor]'}.`;
    if(type==='podcast')
      return `${f(podcast_host)||A||'[Host]'} (${Y||'n.d.'}) '${T}', _${J||'[Podcast]'}_ [Podcast], ${f(episode)?`episode ${f(episode)},`:''} ${PB||''}. Available at: ${U||'[URL]'}.`;
    if(type==='dataset')
      return `${A||'[Author]'} (${Y||'n.d.'}) _${T}_ [Dataset]${V?`, version ${V}`:''}. ${f(dataset_source)||'[Repository]'}. ${U||''}`;
  }

  if(style==='IEEE') {
    if(type==='book')
      return `${A||'[Author]'}, _${T}_, ${ED?`${ED} ed., `:''} ${PL?PL+',':''} ${PB||'[Pub.]'}, ${Y}.`;
    if(type==='journal')
      return `${A||'[Author]'}, "${T}," _${J}_${V?`, vol. ${V}`:''}${I?`, no. ${I}`:''}${P?`, pp. ${P}`:''}${Y?`, ${Y}`:''}. ${DOI?`doi: ${DOI}`:(U||'')}`;
    if(type==='website')
      return `${A||'[Author]'}, "${T}," _${J||PB||'[Site]'}_, ${Y}.${U?` [Online]. Available: ${U}`:''}${ACC?` Accessed: ${ACC}.`:''}`;
    if(type==='chapter')
      return `${A||'[Author]'}, "${T}," in _${CH||'[Book]'}_, ${ED2||'[Ed.]'}, Ed. ${PL?PL+':':''} ${PB}, ${Y}, pp. ${P||'xx–xx'}.`;
    if(type==='thesis')
      return `${A||'[Author]'}, "${T}," ${f(thesis_type)||'Ph.D. dissertation'}, Dept. [Dept.], ${f(institution)||'[Inst.]'}, ${Y}.`;
    if(type==='film')
      return `${T}, Directed by ${f(film_director)||'[Dir.]'}. ${f(distributor)||'[Distributor]'}, ${f(film_year)||Y}.`;
    if(type==='podcast')
      return `${f(podcast_host)||A||'[Host]'}, "${T}," _${J||'[Podcast]'}_, Ep. ${f(episode)||'x'}, ${Y}.`;
    if(type==='dataset')
      return `${A||'[Author]'}, "${T}," ${f(dataset_source)||'[Repository]'}, ${Y}${V?`, ver. ${V}`:''}.${U?' [Online]. Available: '+U:''}`;
  }

  if(style==='Vancouver') {
    if(type==='book')
      return `${A||'[Author]'}. ${T}. ${ED?`${ED} ed. `:''} ${PL?PL+':':''} ${PB||'[Publisher]'}; ${Y}.`;
    if(type==='journal')
      return `${A||'[Author]'}. ${T}. ${J}. ${Y}${V?`;${V}`:''}${I?`(${I})`:''} ${P?`:${P}`:''}.${DOI?` doi: ${DOI}`:(U?` Available from: ${U}`:'')}`;
    if(type==='website')
      return `${A||'[Author]'}. ${T} [Internet]. ${Y} [cited ${ACC||'date'}]. Available from: ${U||'[URL]'}`;
    if(type==='chapter')
      return `${A||'[Author]'}. ${T}. In: ${ED2||'[Ed.]'}, editors. ${CH||'[Book]'}. ${PL?PL+':':''} ${PB}; ${Y}. p. ${P||'xx-xx'}.`;
    if(type==='thesis')
      return `${A||'[Author]'}. ${T} [${f(thesis_type)||'dissertation'}]. ${f(institution)||'[Institution]'}; ${Y}.`;
    if(type==='film')
      return `${T} [Film]. Directed by ${f(film_director)||'[Dir.]'}. ${f(distributor)||'[Distributor]'}; ${f(film_year)||Y}.`;
    if(type==='podcast')
      return `${f(podcast_host)||A||'[Host]'}. ${T}. In: ${J||'[Podcast]'} [Internet]. ${Y}. Available from: ${U||'[URL]'}`;
    if(type==='dataset')
      return `${A||'[Author]'}. ${T} [dataset]. ${f(dataset_source)||'[Source]'}; ${Y}.${U?' Available from: '+U:''}`;
  }

  return `[Citation format not available for ${style} + ${type}]`;
};

/* ══════════════════════════════════════════════════════════════
   SOURCE TYPE FIELDS
══════════════════════════════════════════════════════════════ */

const SOURCE_TYPES = [
  {id:'book',    emoji:'📚', label:'Book'},
  {id:'journal', emoji:'📰', label:'Journal Article'},
  {id:'website', emoji:'🌐', label:'Website'},
  {id:'chapter', emoji:'📖', label:'Book Chapter'},
  {id:'thesis',  emoji:'🎓', label:'Thesis'},
  {id:'film',    emoji:'🎬', label:'Film'},
  {id:'podcast', emoji:'🎙', label:'Podcast'},
  {id:'dataset', emoji:'📊', label:'Dataset'},
];

const CITE_STYLES = ['APA 7','MLA 9','Chicago','Harvard','IEEE','Vancouver'];

const TABS = [
  {id:'add',      label:'+ Add Source'},
  {id:'ai',       label:'✦ AI Assistant'},
  {id:'list',     label:'📋 My References'},
  {id:'preview',  label:'◉ Formatted List'},
  {id:'guide',    label:'? Style Guide'},
];

const uid = () => Math.random().toString(36).slice(2,9);
const EMPTY_SRC = {id:'',type:'journal',authors:'',year:'',title:'',journal:'',volume:'',issue:'',
  pages:'',publisher:'',place:'',url:'',accessed:'',doi:'',edition:'',editors:'',
  chapter:'',thesis_type:'PhD Thesis',institution:'',film_director:'',film_year:'',
  distributor:'',podcast_host:'',episode:'',dataset_source:'',version:''};

export default function BibliographyGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';
  const [tab,   setTab]   = useState('add');
  const [style, setStyle] = useState('APA 7');
  const [srcs,  setSrcs]  = useState([]);
  const [form,  setForm]  = useState({...EMPTY_SRC, id:uid()});
  const [search,setSearch]= useState('');
  const [copied,setCopied]= useState('');

  /* AI */
  const [aiQuery,  setAiQuery]  = useState('');
  const [aiOut,    setAiOut]    = useState('');
  const [aiLoad,   setAiLoad]   = useState(false);
  const [aiErr,    setAiErr]    = useState('');

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  /* ── ADD/DELETE ── */
  const addSource = () => {
    if(!form.title) return;
    setSrcs(p=>[...p,{...form, id:uid()}]);
    setForm({...EMPTY_SRC, id:uid()});
    setTab('list');
  };
  const delSource = id => setSrcs(p=>p.filter(s=>s.id!==id));

  /* ── COPY ── */
  const copy = (text, id) => {
    try{navigator.clipboard.writeText(text);}catch{}
    setCopied(id); setTimeout(()=>setCopied(''),1800);
  };

  /* ── FILTERED ── */
  const filtered = useMemo(()=>{
    if(!search.trim()) return srcs;
    const q = search.toLowerCase();
    return srcs.filter(s=>(s.title+s.authors+s.journal).toLowerCase().includes(q));
  },[srcs,search]);

  /* ── SORTED (alphabetical by first author or title) ── */
  const sorted = useMemo(()=>[...filtered].sort((a,b)=>{
    const ka = (a.authors||a.title||'').toLowerCase();
    const kb = (b.authors||b.title||'').toLowerCase();
    return ka<kb?-1:ka>kb?1:0;
  }),[filtered]);

  /* ── FULL BIBLIOGRAPHY TEXT ── */
  const fullBib = useMemo(()=>{
    const isNumeric = style==='IEEE'||style==='Vancouver';
    return sorted.map((s,i)=>{
      const txt = formatCitation(s,style);
      return isNumeric ? `[${i+1}] ${txt}` : txt;
    }).join('\n\n');
  },[sorted,style]);

  /* ── AI ── */
  const runAI = async () => {
    if(!aiQuery.trim()) return;
    setAiLoad(true); setAiOut(''); setAiErr('');
    const prompt = `You are a citation expert. Answer this question about academic referencing:

Style: ${style}
Question: ${aiQuery}

If the user has provided publication details, format the citation in ${style} style.
If they're asking about formatting rules, explain clearly with an example.
Be concise and accurate.`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:700, stream:true,
          messages:[{role:'user',content:prompt}]}),
      });
      if(!res.ok){setAiErr('API error');setAiLoad(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        buf+=dec.decode(value,{stream:true});
        const lines=buf.split('\n'); buf=lines.pop();
        for(const ln of lines){
          if(!ln.startsWith('data: ')) continue;
          const p=ln.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')
            setAiOut(v=>v+o.delta.text);}catch{}
        }
      }
    }catch(e){setAiErr(e.message);}
    finally{setAiLoad(false);}
  };

  /* ── FIELD GROUPS ── */
  const commonFields = [
    {k:'authors',   l:'Author(s)',  t:'text',  ph:'Smith, John; Doe, Jane',  tip:'Separate multiple with semicolons: Smith, John; Jones, Alice'},
    {k:'year',      l:'Year',       t:'text',  ph:'2023'},
    {k:'title',     l:'Title *',    t:'text',  ph:'Title of the work (required)'},
  ];

  const typeFields = {
    journal: [{k:'journal',l:'Journal Name',t:'text',ph:'Nature'},{k:'volume',l:'Volume',t:'text',ph:'45'},{k:'issue',l:'Issue',t:'text',ph:'3'},{k:'pages',l:'Pages',t:'text',ph:'123–145'},{k:'doi',l:'DOI',t:'text',ph:'10.1000/xyz123'},{k:'url',l:'URL (if no DOI)',t:'text',ph:'https://'}],
    book:    [{k:'publisher',l:'Publisher',t:'text',ph:'Oxford University Press'},{k:'place',l:'Place',t:'text',ph:'Oxford'},{k:'edition',l:'Edition',t:'text',ph:'3rd'},{k:'url',l:'URL/DOI',t:'text',ph:'https://'}],
    website: [{k:'journal',l:'Website / Site Name',t:'text',ph:'BBC News'},{k:'publisher',l:'Organisation',t:'text',ph:'BBC'},{k:'url',l:'URL *',t:'text',ph:'https://'},{k:'accessed',l:'Accessed Date',t:'text',ph:'12 March 2025'}],
    chapter: [{k:'chapter',l:'Book Title',t:'text',ph:'Handbook of Psychology'},{k:'editors',l:'Book Editors',t:'text',ph:'Brown, T. & Green, A.'},{k:'pages',l:'Chapter Pages',t:'text',ph:'45–68'},{k:'publisher',l:'Publisher',t:'text',ph:'Springer'},{k:'place',l:'Place',t:'text',ph:'London'}],
    thesis:  [{k:'thesis_type',l:'Thesis Type',t:'text',ph:'PhD Thesis'},{k:'institution',l:'Institution',t:'text',ph:'University of Cambridge'},{k:'url',l:'URL',t:'text',ph:'https://'}],
    film:    [{k:'film_director',l:'Director',t:'text',ph:'Nolan, Christopher'},{k:'film_year',l:'Year (if different)',t:'text',ph:'2023'},{k:'distributor',l:'Distributor / Studio',t:'text',ph:'Warner Bros.'}],
    podcast: [{k:'podcast_host',l:'Host',t:'text',ph:'Lex Fridman'},{k:'journal',l:'Podcast Name',t:'text',ph:'Lex Fridman Podcast'},{k:'episode',l:'Episode No.',t:'text',ph:'400'},{k:'publisher',l:'Network/Platform',t:'text',ph:'Spotify'},{k:'url',l:'URL',t:'text',ph:'https://'}],
    dataset: [{k:'dataset_source',l:'Repository / Source',t:'text',ph:'Zenodo'},{k:'version',l:'Version',t:'text',ph:'v2.1'},{k:'url',l:'URL',t:'text',ph:'https://'}],
  };

  const currentType = form.type||'journal';
  const livePreview = form.title ? formatCitation(form, style) : null;

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(251,113,133,.3)':'none',
              background:dark?'rgba(251,113,133,.08)':'linear-gradient(135deg,#8b1a2a,#b91c1c)',
              boxShadow:dark?'0 0 16px rgba(251,113,133,.2)':'0 3px 10px rgba(139,26,42,.35)',
            }}>📖</div>
            <div>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:16,fontWeight:700,color:'var(--tx)',lineHeight:1}}>
                Bibliography <span style={{color:'var(--acc)'}}>Generator</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #8 · 6 styles · 8 source types · AI assistant
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {srcs.length>0&&<div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)',
            border:dark?'1px solid rgba(251,113,133,.2)':'1.5px solid var(--bdr)',
            padding:'3px 10px',borderRadius:dark?3:7}}>
            {srcs.length} source{srcs.length!==1?'s':''}
          </div>}
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(251,113,133,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#f0c0c8',
              boxShadow:dark?'0 0 8px rgba(251,113,133,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#08080c':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* STYLE SELECTOR (persistent row) */}
        <div style={{
          display:'flex',gap:6,padding:'8px 16px',flexWrap:'wrap',alignItems:'center',
          borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
          background:dark?'var(--s1)':'var(--s1)',
        }}>
          <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',letterSpacing:'.14em',textTransform:'uppercase',marginRight:4}}>Style:</span>
          {CITE_STYLES.map(s=>(
            <button key={s} className={`style-tab ${style===s?'on':''}`} onClick={()=>setStyle(s)}>{s}</button>
          ))}
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='list'&&srcs.length>0&&<span style={{
                minWidth:16,height:16,borderRadius:99,background:'var(--acc)',color:dark?'#08080c':'white',
                fontFamily:"'Fira Code',monospace",fontSize:8,display:'inline-flex',alignItems:'center',
                justifyContent:'center',marginLeft:4,padding:'0 4px',fontWeight:700
              }}>{srcs.length}</span>}
            </button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Source type */}
            <div>
              <div className="slbl">Source type</div>
              {SOURCE_TYPES.map(st=>(
                <button key={st.id} onClick={()=>{setF('type',st.id);setTab('add');}} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'6px 9px',marginBottom:3,background:'transparent',cursor:'pointer',
                  border:form.type===st.id&&tab==='add'?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:form.type===st.id&&tab==='add'?(dark?'rgba(251,113,133,.06)':'rgba(139,26,42,.04)'):'transparent',
                }}>
                  <span style={{fontSize:13}}>{st.emoji}</span>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11.5,fontWeight:600,
                    color:form.type===st.id&&tab==='add'?'var(--acc)':'var(--tx)'}}>{st.label}</span>
                </button>
              ))}
            </div>

            {/* Quick exports */}
            {srcs.length>0&&(
              <div>
                <div className="slbl">Export</div>
                <button className="gbtn" onClick={()=>copy(fullBib,'all')}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px',marginBottom:4,
                    ...(copied==='all'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                  {copied==='all'?'✓ Copied':'⎘ Copy all refs'}
                </button>
                <button className="gbtn" onClick={()=>{
                  const b=new Blob([fullBib],{type:'text/plain'});
                  const a=document.createElement('a');a.href=URL.createObjectURL(b);
                  a.download=`bibliography-${style.replace(' ','')}.txt`;a.click();
                }} style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                  ⬇ Download .txt
                </button>
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ ADD SOURCE ══╗ */}
              {tab==='add'&&(
                <motion.div key="add" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Source type pills (also in sidebar but repeated for clarity) */}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {SOURCE_TYPES.map(st=>(
                      <button key={st.id} onClick={()=>setF('type',st.id)}
                        className={`gbtn ${form.type===st.id?'on':''}`}
                        style={{gap:4,padding:'5px 10px'}}>
                        {st.emoji} {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>
                      {SOURCE_TYPES.find(s=>s.id===currentType)?.emoji} {SOURCE_TYPES.find(s=>s.id===currentType)?.label} Details
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {/* Common fields */}
                      {commonFields.map(({k,l,t,ph,tip})=>(
                        <div key={k} style={k==='title'?{gridColumn:'1 / -1'}:{}}>
                          <label className="lbl">{l}</label>
                          <input className="fi" type={t} placeholder={ph}
                            value={form[k]||''} onChange={e=>setF(k,e.target.value)}/>
                          {tip&&<div style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',marginTop:3}}>{tip}</div>}
                        </div>
                      ))}
                      {/* Type-specific fields */}
                      {(typeFields[currentType]||[]).map(({k,l,t,ph})=>(
                        <div key={k} style={k==='url'||k==='doi'?{gridColumn:'1 / -1'}:{}}>
                          <label className="lbl">{l}</label>
                          <input className="fi" type={t} placeholder={ph}
                            value={form[k]||''} onChange={e=>setF(k,e.target.value)}/>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live preview */}
                  {livePreview&&(
                    <div>
                      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:7}}>
                        <label className="lbl">Live preview — {style}</label>
                        <button className="gbtn" onClick={()=>copy(livePreview,'preview')} style={{fontSize:9,padding:'3px 8px',
                          ...(copied==='preview'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='preview'?'✓ Copied':'⎘ Copy'}
                        </button>
                      </div>
                      <div style={{padding:'14px 16px',borderRadius:dark?4:10,
                        border:dark?'1px solid rgba(251,113,133,.15)':'1.5px solid rgba(139,26,42,.15)',
                        background:dark?'rgba(0,0,0,.3)':'rgba(255,240,242,.5)'}}>
                        <p className="cit-text">{livePreview}</p>
                      </div>
                    </div>
                  )}

                  <div style={{display:'flex',gap:9,alignItems:'center'}}>
                    <button className="btn" onClick={addSource} disabled={!form.title}
                      style={{padding:'10px 26px',fontSize:13}}>
                      + Add to Bibliography
                    </button>
                    <button className="gbtn" onClick={()=>setForm({...EMPTY_SRC,id:uid()})}>
                      ⊘ Clear form
                    </button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ AI ASSISTANT ══╗ */}
              {tab==='ai'&&(
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:800}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:4}}>✦ AI Citation Assistant</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:12,lineHeight:1.6}}>
                      Ask anything: format a citation, check a rule, convert between styles, or paste publication details for instant formatting.
                    </div>
                    <div style={{marginBottom:10}}>
                      <label className="lbl">Your question — current style: <span style={{color:'var(--acc)'}}>{style}</span></label>
                      <textarea className="fi" rows={4}
                        placeholder={`Examples:\n• "Format this: Smith, John. Climate Change. Oxford UP, 2022."\n• "How do I cite a YouTube video in ${style}?"\n• "What's the difference between APA 6 and APA 7 for journal articles?"\n• "Is the title italicised in ${style} for websites?"`}
                        value={aiQuery} onChange={e=>setAiQuery(e.target.value)}/>
                    </div>
                    <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
                      {[
                        `How do I cite a website with no author in ${style}?`,
                        `How do I cite a paraphrase vs direct quote?`,
                        `What is a DOI and how do I use it?`,
                        `How do I format an et al. citation?`,
                      ].map(q=>(
                        <button key={q} className="gbtn" onClick={()=>setAiQuery(q)} style={{fontSize:9,padding:'4px 9px'}}>
                          {q.slice(0,42)}…
                        </button>
                      ))}
                    </div>
                    <button className="btn" onClick={runAI} disabled={aiLoad||!aiQuery.trim()} style={{padding:'9px 24px'}}>
                      {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Thinking…</>:'✦ Ask AI'}
                    </button>
                  </div>

                  {aiErr&&<div style={{padding:'9px 13px',borderRadius:dark?3:8,
                    background:dark?'rgba(248,113,113,.05)':'rgba(185,28,28,.04)',
                    border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(185,28,28,.12)',
                    fontFamily:"'Nunito',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}

                  {(aiOut||aiLoad)&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                        <label className="lbl">✦ AI Response</label>
                        {aiOut&&!aiLoad&&<button className="gbtn" onClick={()=>copy(aiOut,'ai')} style={{fontSize:9}}>
                          {copied==='ai'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="ai-box">
                        {aiOut}
                        {aiLoad&&<span className="cur"/>}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ MY REFERENCES ══╗ */}
              {tab==='list'&&(
                <motion.div key="list" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {srcs.length>0&&(
                    <input className="fi" style={{resize:'none',maxWidth:320}} placeholder="🔍 Search sources…"
                      value={search} onChange={e=>setSearch(e.target.value)}/>
                  )}

                  {srcs.length===0&&(
                    <div style={{textAlign:'center',padding:'48px 24px',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>
                      No sources yet — add your first with + Add Source
                    </div>
                  )}

                  <AnimatePresence>
                    {sorted.map(src=>{
                      const cit = formatCitation(src, style);
                      const stype = SOURCE_TYPES.find(t=>t.id===src.type);
                      return (
                        <motion.div key={src.id} className="cit-card"
                          initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                            <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
                              <span className="type-badge" style={{
                                background:dark?'rgba(251,113,133,.08)':'rgba(139,26,42,.06)',
                                border:dark?'1px solid rgba(251,113,133,.2)':'1.5px solid rgba(139,26,42,.15)',
                                color:'var(--acc)'}}>
                                {stype?.emoji} {stype?.label}
                              </span>
                              {src.year&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{src.year}</span>}
                            </div>
                            <div style={{display:'flex',gap:5}}>
                              <button className="gbtn" onClick={()=>copy(cit,src.id)} style={{
                                fontSize:9,padding:'3px 8px',
                                ...(copied===src.id?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                                {copied===src.id?'✓':'⎘'}
                              </button>
                              <button className="gbtn" onClick={()=>delSource(src.id)}
                                style={{fontSize:9,padding:'3px 8px',color:'var(--err)',borderColor:'rgba(252,165,165,.2)'}}>
                                ✕
                              </button>
                            </div>
                          </div>
                          <p className="cit-text">{cit}</p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {srcs.length>0&&(
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
                      <button className="gbtn" onClick={()=>copy(fullBib,'all-list')} style={{
                        ...(copied==='all-list'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                        {copied==='all-list'?'✓ Copied all':'⎘ Copy all references'}
                      </button>
                      <button className="gbtn" onClick={()=>setTab('preview')}>◉ Formatted preview →</button>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ FORMATTED LIST ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {srcs.length===0&&(
                    <div style={{textAlign:'center',padding:'48px 24px',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>
                      Add sources first
                    </div>
                  )}

                  {srcs.length>0&&(
                    <>
                      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                        <div style={{fontFamily:"'Libre Baskerville',serif",fontWeight:700,fontSize:16,color:'var(--tx)'}}>
                          References / Bibliography
                        </div>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)',
                          border:dark?'1px solid rgba(251,113,133,.2)':'1.5px solid rgba(139,26,42,.15)',
                          padding:'2px 9px',borderRadius:99}}>
                          {style}
                        </span>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>
                          {sorted.length} source{sorted.length!==1?'s':''}
                        </span>
                        <button className="gbtn" onClick={()=>copy(fullBib,'prev')} style={{marginLeft:'auto',
                          ...(copied==='prev'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='prev'?'✓ Copied':'⎘ Copy all'}
                        </button>
                      </div>

                      <div className="panel" style={{padding:'20px 24px'}}>
                        {(style==='IEEE'||style==='Vancouver') ? (
                          <div className="ref-list">
                            {sorted.map((s,i)=>(
                              <div key={s.id} className="ref-list-item">
                                <span className="ref-num">[{i+1}]</span>
                                <p className="cit-text">{formatCitation(s,style)}</p>
                              </div>
                            ))}
                          </div>
                        ):(
                          <div style={{display:'flex',flexDirection:'column',gap:12}}>
                            {sorted.map(s=>(
                              <p key={s.id} className="cit-text" style={{paddingLeft:'2em',textIndent:'-2em'}}>
                                {formatCitation(s,style)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ STYLE GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'20px 22px'}}>
                    <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Citation style quick reference
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      6 styles · when to use each
                    </div>

                    {[
                      {s:'APA 7',    fields:'Social sciences, education, psychology, nursing',
                       rule:'Author–date in-text: (Smith, 2022). Reference list alphabetical by author. DOIs required where available.',
                       ex:'Smith, J. A., & Brown, T. (2022). Climate anxiety in teenagers. _Journal of Psychology_, _45_(3), 12–28. https://doi.org/10.0000/xxx'},
                      {s:'MLA 9',    fields:'Humanities, literature, film, language arts',
                       rule:'Author–page in-text: (Smith 45). Works Cited list. Containers are key — journal, website, platform are containers.',
                       ex:'Smith, John. "Climate Anxiety in Teenagers." _Journal of Psychology_, vol. 45, no. 3, 2022, pp. 12–28.'},
                      {s:'Chicago', fields:'History, arts, social sciences, publishing',
                       rule:'Two systems: Notes-Bibliography (humanities) and Author-Date (sciences). Notes use footnotes/endnotes.',
                       ex:'Smith, John. "Climate Anxiety in Teenagers." _Journal of Psychology_ 45, no. 3 (2022): 12–28. https://doi.org/10.0000/xxx.'},
                      {s:'Harvard', fields:'Business, science, social science (UK & Australia)',
                       rule:'Author–date in-text: (Smith, 2022). Reference list. Widely used in UK universities; no universal standard.',
                       ex:'Smith, J. A. and Brown, T. (2022) \'Climate anxiety in teenagers\', _Journal of Psychology_, vol. 45, no. 3, pp. 12–28.'},
                      {s:'IEEE',     fields:'Engineering, computer science, electronics',
                       rule:'Numbered in-text: [1]. Reference list by order of first citation. Numbers in square brackets.',
                       ex:'J. A. Smith and T. Brown, "Climate anxiety in teenagers," _J. Psychol._, vol. 45, no. 3, pp. 12–28, 2022. doi: 10.0000/xxx.'},
                      {s:'Vancouver',fields:'Medicine, health sciences, life sciences',
                       rule:'Numbered in-text. References listed in order of first citation. Common in biomedical journals (ICMJE guidelines).',
                       ex:'Smith JA, Brown T. Climate anxiety in teenagers. J Psychol. 2022;45(3):12-28. doi: 10.0000/xxx.'},
                    ].map(({s,fields,rule,ex})=>(
                      <div key={s} style={{marginBottom:14,padding:'12px 14px',borderRadius:dark?3:9,
                        border:style===s?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                        background:style===s?(dark?'rgba(251,113,133,.04)':'rgba(139,26,42,.03)'):'transparent'}}>
                        <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:6}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:700,color:'var(--acc)',minWidth:80}}>{s}</span>
                          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:'var(--tx2)'}}>{fields}</span>
                          {style===s&&<span style={{marginLeft:'auto',fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--acc)'}}>ACTIVE</span>}
                        </div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12.5,color:'var(--tx2)',marginBottom:8,lineHeight:1.6}}>{rule}</div>
                        <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:12.5,lineHeight:1.75,
                          padding:'8px 12px',borderRadius:dark?2:7,
                          background:dark?'rgba(0,0,0,.3)':'rgba(249,240,242,.8)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          color:dark?'#ffe8ec':'#1a0508'}}>{ex}</div>
                      </div>
                    ))}

                    <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:10,marginTop:8}}>
                      Common mistakes
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {t:'Inconsistent style',    b:'Pick ONE style and use it throughout. Never mix APA and Harvard in the same document.'},
                        {t:'Missing DOI',           b:'Always include DOIs when available. They\'re permanent identifiers — far more reliable than URLs.'},
                        {t:'Wrong italics',         b:'Journals and books are italicised. Article titles usually aren\'t (except MLA, where they\'re in quotes).'},
                        {t:'Author name format',    b:'APA uses initials (Smith, J.). MLA uses full name. Check your style\'s exact requirement.'},
                        {t:'Hanging indent',        b:'APA, Chicago, Harvard, MLA all require hanging indent on the reference list. Set this in Word before submission.'},
                        {t:'Date format',           b:'APA: (2022, March 15). MLA: 15 Mar. 2022. Chicago: March 15, 2022. Learn your style\'s date format.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.2)':'rgba(253,248,245,.8)'}}>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:700,color:'var(--acc)',marginBottom:4}}>⚠ {t}</div>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{b}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}