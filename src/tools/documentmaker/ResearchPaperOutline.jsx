import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   RESEARCH PAPER OUTLINE GENERATOR — Document Tools Series #7
   Theme: Dark Deep Navy / Electric Violet · Light Parchment / Oxford Blue
   Fonts: Crimson Pro · Inter · Source Code Pro
   AI: Full outline generation + section expansion + abstract + thesis
   Paper types: Empirical · Review · Theoretical · Case Study · Thesis/Dissertation
   Citation styles: APA · MLA · Chicago · Harvard · IEEE
   Export: Copy Markdown · Copy Plain · Print
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Inter',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes violet-glow{0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.18)}50%{box-shadow:0 0 0 8px rgba(167,139,250,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes expandin{from{opacity:0;height:0}to{opacity:1;height:auto}}

.dk{
  --bg:#04050e;--s1:#070a18;--s2:#0b0f22;--s3:#10152c;
  --bdr:#181f3c;--bdr-hi:rgba(167,139,250,.28);
  --acc:#a78bfa;--acc2:#8b5cf6;--acc3:#60a5fa;--acc4:#f472b6;
  --tx:#e8e4ff;--tx2:#8878cc;--tx3:#181f3c;--txm:#2e3560;
  --err:#f87171;--succ:#34d399;--warn:#fbbf24;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(167,139,250,.06),transparent),
    radial-gradient(ellipse 40% 50% at 90% 85%,rgba(96,165,250,.04),transparent),
    radial-gradient(ellipse 30% 45% at 10% 60%,rgba(244,114,182,.03),transparent);
}
.lt{
  --bg:#faf8f4;--s1:#ffffff;--s2:#f0ecff;--s3:#e4ddff;
  --bdr:#c8bfee;--bdr-hi:#2e1a6e;
  --acc:#4c1d95;--acc2:#5b21b6;--acc3:#1e40af;--acc4:#9d174d;
  --tx:#0d0520;--tx2:#4c1d95;--tx3:#c8bfee;--txm:#6d5a9c;
  --err:#991b1b;--succ:#166534;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(76,29,149,.06),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(4,5,14,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,248,244,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(76,29,149,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(167,139,250,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Inter',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(167,139,250,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(76,29,149,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:232px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(76,29,149,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#04050e;border-radius:3px;animation:violet-glow 2.8s infinite;}
.dk .btn:hover{background:#c4b5fd;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(167,139,250,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(76,29,149,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(167,139,250,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(76,29,149,.05);}

.fi{width:100%;outline:none;font-family:'Inter',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(167,139,250,.1);}
.lt .fi{background:#f7f4ff;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(76,29,149,.08);}
.fi::placeholder{opacity:.3;}

/* OUTLINE TREE */
.outline-tree{font-family:'Crimson Pro',serif;line-height:1.6;}
.ol-section{margin-bottom:2px;}
.ol-h1{font-size:17px;font-weight:700;padding:8px 12px 8px 14px;cursor:pointer;
  display:flex;align-items:center;gap:8px;transition:all .13s;border-radius:3px;}
.dk .ol-h1{color:var(--acc);}
.dk .ol-h1:hover{background:rgba(167,139,250,.06);}
.lt .ol-h1{color:var(--acc);}
.lt .ol-h1:hover{background:rgba(76,29,149,.05);border-radius:8px;}
.ol-h2{font-size:15px;font-weight:600;padding:5px 12px 5px 32px;cursor:pointer;
  display:flex;align-items:center;gap:7px;transition:all .13s;}
.dk .ol-h2{color:var(--tx);}
.dk .ol-h2:hover{color:var(--acc);background:rgba(167,139,250,.04);}
.lt .ol-h2{color:var(--tx);}
.lt .ol-h2:hover{color:var(--acc);background:rgba(76,29,149,.04);border-radius:7px;}
.ol-h3{font-size:14px;font-weight:400;font-style:italic;padding:3px 12px 3px 52px;
  display:flex;align-items:center;gap:7px;}
.dk .ol-h3{color:var(--tx2);}
.lt .ol-h3{color:var(--txm);}
.ol-note{font-family:'Source Code Pro',monospace;font-size:11px;padding:3px 12px 3px 68px;}
.dk .ol-note{color:rgba(167,139,250,.45);}
.lt .ol-note{color:var(--acc);opacity:.6;}

/* Section expand button */
.expand-btn{font-family:'Source Code Pro',monospace;font-size:8.5px;padding:2px 8px;cursor:pointer;
  border:none;background:transparent;transition:all .13s;margin-left:auto;flex-shrink:0;}
.dk .expand-btn{color:var(--txm);border:1px solid var(--bdr);border-radius:2px;}
.dk .expand-btn:hover{color:var(--acc);border-color:rgba(167,139,250,.3);}
.lt .expand-btn{color:var(--txm);border:1.5px solid var(--bdr);border-radius:5px;}
.lt .expand-btn:hover{color:var(--acc);border-color:rgba(76,29,149,.3);}

/* Expanded content */
.expanded-content{font-family:'Crimson Pro',serif;font-size:14px;line-height:1.85;
  padding:10px 14px 10px 32px;white-space:pre-wrap;word-break:break-word;
  border-left:2px solid;margin-left:14px;}
.dk .expanded-content{color:#c4b5fd;background:rgba(0,0,0,.25);border-left-color:rgba(167,139,250,.2);}
.lt .expanded-content{color:var(--tx);background:rgba(76,29,149,.03);border-left-color:rgba(76,29,149,.15);}

/* AI stream */
.ai-stream{font-family:'Source Code Pro',monospace;font-size:12px;line-height:1.82;
  padding:16px 18px;min-height:70px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-stream{color:#c4b5fd;background:rgba(0,0,0,.5);border:1px solid rgba(167,139,250,.12);border-radius:4px;}
.lt .ai-stream{color:#0d0520;background:#f0ecff;border:1.5px solid rgba(76,29,149,.14);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

/* Abstract / thesis display */
.prose-box{font-family:'Crimson Pro',serif;font-size:15px;line-height:1.9;
  padding:20px 24px;white-space:pre-wrap;word-break:break-word;}
.dk .prose-box{color:#e8e4ff;background:rgba(0,0,0,.35);border:1px solid var(--bdr);border-radius:4px;}
.lt .prose-box{color:#0d0520;background:white;border:1.5px solid var(--bdr);border-radius:10px;
  box-shadow:0 2px 12px rgba(76,29,149,.05);}

.lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(167,139,250,.42);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Source Code Pro',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(167,139,250,.28);}
.lt .slbl{color:var(--acc);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(167,139,250,.1);}
.lt .prog{background:rgba(76,29,149,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(167,139,250,.01);border:1px dashed rgba(167,139,250,.09);border-radius:3px;}
.lt .ad{background:rgba(76,29,149,.015);border:1.5px dashed rgba(76,29,149,.1);border-radius:9px;}
.ad span{font-family:'Source Code Pro',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* type/citation pill buttons */
.pill-btn{padding:6px 13px;cursor:pointer;border:none;font-family:'Inter',sans-serif;
  font-size:10.5px;font-weight:500;transition:all .13s;display:flex;align-items:center;gap:5px;}
.dk .pill-btn{background:transparent;border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .pill-btn.on{background:rgba(167,139,250,.08);border-color:var(--acc);color:var(--acc);}
.dk .pill-btn:hover:not(.on){border-color:rgba(167,139,250,.3);color:var(--tx2);}
.lt .pill-btn{background:transparent;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txm);}
.lt .pill-btn.on{background:rgba(76,29,149,.06);border-color:var(--acc);color:var(--acc);}
.lt .pill-btn:hover:not(.on){border-color:rgba(76,29,149,.3);color:var(--tx2);}
`;

/* ═══ CONFIGS ═══ */
const PAPER_TYPES = [
  {id:'empirical',    label:'Empirical',      emoji:'🔬', desc:'Original data collection & analysis'},
  {id:'review',       label:'Literature Review',emoji:'📚',desc:'Survey & synthesis of existing research'},
  {id:'theoretical',  label:'Theoretical',    emoji:'💡', desc:'Framework or model development'},
  {id:'case_study',   label:'Case Study',     emoji:'🏢', desc:'In-depth single subject analysis'},
  {id:'thesis',       label:'Thesis/Dissertation',emoji:'🎓',desc:'Full thesis with all chapters'},
];

const CITE_STYLES = ['APA 7','MLA 9','Chicago','Harvard','IEEE'];

const WORD_TARGETS = ['3,000','5,000','8,000','10,000','15,000','20,000+'];

const TABS = [
  {id:'setup',   label:'⚙ Setup'},
  {id:'gen',     label:'✦ Generate'},
  {id:'outline', label:'📄 Outline'},
  {id:'abstract',label:'∑ Abstract'},
  {id:'export',  label:'⬇ Export'},
  {id:'guide',   label:'? Guide'},
];

/* ═══ HELPERS ═══ */
const EMPTY = {
  title:'', field:'', supervisor:'', institution:'', wordTarget:'5,000',
  abstract:'', keywords:'', researchQ:'', hypothesis:'', methodology:'',
  existingWork:'', extraSections:'',
};

/* ═══ OUTLINE STRUCTURE per type ═══ */
const BASE_STRUCTURES = {
  empirical: [
    {num:'1', title:'Introduction', subs:['Background & Context','Problem Statement','Research Questions & Objectives','Significance of Study','Scope & Limitations','Structure of Paper']},
    {num:'2', title:'Literature Review', subs:['Theoretical Framework','Prior Empirical Work','Identified Gaps','Conceptual Model']},
    {num:'3', title:'Methodology', subs:['Research Design','Participants / Sample','Data Collection Instruments','Procedures','Data Analysis Approach','Validity & Reliability','Ethical Considerations']},
    {num:'4', title:'Results', subs:['Descriptive Statistics','Main Findings','Secondary Findings','Tables & Figures Summary']},
    {num:'5', title:'Discussion', subs:['Interpretation of Findings','Relation to Prior Literature','Theoretical Implications','Practical Implications','Limitations','Future Research']},
    {num:'6', title:'Conclusion', subs:['Summary of Contributions','Key Takeaways','Closing Remarks']},
    {num:'', title:'References', subs:[]},
    {num:'', title:'Appendices', subs:['Appendix A — Survey Instrument','Appendix B — Supplementary Data']},
  ],
  review: [
    {num:'1', title:'Introduction', subs:['Overview of the Field','Rationale for Review','Research Questions','Review Scope & Inclusion Criteria']},
    {num:'2', title:'Search Strategy & Methodology', subs:['Databases Searched','Search Terms','Inclusion/Exclusion Criteria','PRISMA Flow (if systematic)','Quality Assessment']},
    {num:'3', title:'Thematic Synthesis', subs:['Theme 1 — [Major Theme]','Theme 2 — [Major Theme]','Theme 3 — [Major Theme]','Contradictions & Debates in Literature']},
    {num:'4', title:'Critical Analysis', subs:['Methodological Quality of Reviewed Studies','Gaps & Inconsistencies','Emerging Trends']},
    {num:'5', title:'Discussion', subs:['Synthesis of Evidence','Theoretical Contributions','Practical Implications']},
    {num:'6', title:'Conclusion', subs:['Summary of Findings','Recommendations for Future Research']},
    {num:'', title:'References', subs:[]},
  ],
  theoretical: [
    {num:'1', title:'Introduction', subs:['Motivation & Rationale','Research Problem','Purpose & Scope','Contribution of Paper']},
    {num:'2', title:'Background & Conceptual Foundations', subs:['Existing Theories','Key Concepts & Definitions','Critique of Current Frameworks']},
    {num:'3', title:'Theoretical Framework Development', subs:['Core Propositions','Model Construction','Mechanisms & Relationships','Boundary Conditions']},
    {num:'4', title:'Theoretical Implications', subs:['Contributions to the Field','Comparison with Existing Theories','Testable Hypotheses Generated']},
    {num:'5', title:'Discussion', subs:['Limitations of the Framework','Alternative Interpretations','Future Empirical Work Needed']},
    {num:'6', title:'Conclusion', subs:['Summary','Theoretical Contributions','Closing Statement']},
    {num:'', title:'References', subs:[]},
  ],
  case_study: [
    {num:'1', title:'Introduction', subs:['Background','Research Questions','Rationale for Case Selection','Scope']},
    {num:'2', title:'Literature Review', subs:['Relevant Theory','Prior Case Studies','Conceptual Framework']},
    {num:'3', title:'Methodology', subs:['Case Study Design','Data Sources','Data Collection','Analysis Approach']},
    {num:'4', title:'Case Description', subs:['Context & Background','Key Events / Timeline','Stakeholders Involved']},
    {num:'5', title:'Analysis & Findings', subs:['Within-Case Analysis','Cross-Theoretical Analysis','Unexpected Findings']},
    {num:'6', title:'Discussion', subs:['Theoretical Contributions','Generalisability','Limitations']},
    {num:'7', title:'Conclusion', subs:['Summary','Practical Recommendations','Future Research']},
    {num:'', title:'References', subs:[]},
  ],
  thesis: [
    {num:'',  title:'Front Matter', subs:['Title Page','Abstract (300–500 words)','Acknowledgements','Table of Contents','List of Figures & Tables','List of Abbreviations']},
    {num:'1', title:'Introduction', subs:['Background','Problem Statement','Research Questions & Hypotheses','Significance','Scope & Delimitations','Overview of Chapters']},
    {num:'2', title:'Literature Review', subs:['Theoretical Background','Review of Empirical Studies','Identified Research Gaps','Conceptual Framework']},
    {num:'3', title:'Methodology', subs:['Philosophical Stance','Research Design','Population & Sampling','Data Collection Methods','Data Analysis','Validity, Reliability & Ethics']},
    {num:'4', title:'Results / Findings', subs:['Quantitative Results','Qualitative Findings','Integrated Analysis','Visual Summaries']},
    {num:'5', title:'Discussion', subs:['Answering the Research Questions','Comparison with Literature','Theoretical Contributions','Practical Implications','Limitations']},
    {num:'6', title:'Conclusion', subs:['Summary of Contributions','Recommendations','Future Directions','Closing Statement']},
    {num:'',  title:'References / Bibliography', subs:[]},
    {num:'',  title:'Appendices', subs:['Appendix A','Appendix B','Appendix C']},
  ],
};

export default function ResearchPaperOutlineGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,        setTab]       = useState('setup');
  const [paperType,  setPaperType] = useState('empirical');
  const [citeStyle,  setCiteStyle] = useState('APA 7');
  const [data,       setData]      = useState({...EMPTY});
  const [outline,    setOutline]   = useState(null);   // array of section objects with AI content
  const [abstractTx, setAbstractTx]= useState('');
  const [thesisTx,   setThesisTx]  = useState('');

  /* AI state */
  const [aiLoad,   setAiLoad]   = useState(false);
  const [aiPhase,  setAiPhase]  = useState('');
  const [aiErr,    setAiErr]    = useState('');
  const [streaming,setStreaming]= useState('');

  /* Expanded sections */
  const [expanded, setExpanded] = useState({});
  const [expLoading, setExpLoading] = useState({});
  const [expContent, setExpContent] = useState({});

  /* Copy flash */
  const [copied, setCopied] = useState('');

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const filled = [data.title, data.field, data.researchQ].filter(Boolean).length;
  const pct = Math.round((filled/3)*100);

  /* ── BUILD FULL OUTLINE PROMPT ── */
  const buildOutlinePrompt = () =>
    `Generate a detailed research paper outline for the following:

Paper type: ${PAPER_TYPES.find(p=>p.id===paperType)?.label}
Title: ${data.title||'[Not specified]'}
Field / Discipline: ${data.field||'[Not specified]'}
Research question(s): ${data.researchQ||'[Not specified]'}
${data.hypothesis?`Hypothesis: ${data.hypothesis}`:''}
${data.methodology?`Methodology: ${data.methodology}`:''}
${data.keywords?`Keywords: ${data.keywords}`:''}
${data.existingWork?`Existing work to engage with: ${data.existingWork}`:''}
Target word count: ${data.wordTarget}
Citation style: ${citeStyle}
${data.extraSections?`Additional sections requested: ${data.extraSections}`:''}

Output a numbered outline with:
- Roman numeral main sections (I, II, III…)
- Lettered subsections (A, B, C…)
- Numbered sub-subsections (1, 2, 3…) where relevant
- A brief 1-sentence note (in parentheses) for each section explaining what to cover
- Estimated word allocation per main section

Format clearly. Be specific to the field and research question provided.`;

  const buildAbstractPrompt = () =>
    `Write a structured academic abstract (200–300 words) for this research paper.

Paper type: ${PAPER_TYPES.find(p=>p.id===paperType)?.label}
Title: ${data.title||'[Title]'}
Field: ${data.field||'[Field]'}
Research question: ${data.researchQ||'[Research question]'}
${data.hypothesis?`Hypothesis: ${data.hypothesis}`:''}
${data.methodology?`Methodology: ${data.methodology}`:''}
Citation style: ${citeStyle}

Structure the abstract with these implied parts (no subheadings): Background (1–2 sentences), Aim/Objective (1 sentence), Method (2–3 sentences), Key Findings/Expected Outcomes (2–3 sentences), Conclusion/Implications (1–2 sentences).
Output only the abstract text.`;

  const buildThesisPrompt = () =>
    `Write a clear, focused thesis statement and 3–4 supporting sub-claims for this research paper.

Title: ${data.title||'[Title]'}
Field: ${data.field||'[Field]'}
Research question: ${data.researchQ||'[Research question]'}
${data.hypothesis?`Hypothesis: ${data.hypothesis}`:''}
Paper type: ${PAPER_TYPES.find(p=>p.id===paperType)?.label}

Output:
THESIS STATEMENT:
[One to two precise, arguable sentences]

SUB-CLAIMS:
1. [Supporting claim]
2. [Supporting claim]
3. [Supporting claim]
4. [Supporting claim — optional]`;

  const buildSectionExpandPrompt = (section) =>
    `Write a detailed paragraph (150–200 words) explaining what to cover in the "${section.title}" section of this research paper.

Paper type: ${PAPER_TYPES.find(p=>p.id===paperType)?.label}
Title: ${data.title||'[Title]'}
Field: ${data.field||'[Field]'}
Research question: ${data.researchQ||'[RQ]'}
${data.methodology?`Methodology: ${data.methodology}`:''}
Section subsections: ${section.subs.join(', ')||'(none)'}

Give specific writing guidance: what to argue, what evidence to include, how to structure paragraphs, what to avoid. Be practical and field-specific. Output only the guidance text, no heading.`;

  /* ── STREAM HELPER ── */
  const stream = async (prompt, setter, onDone) => {
    let full = '';
    const res = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1000, stream:true,
        messages:[{role:'user',content:prompt}]}),
    });
    if(!res.ok) throw new Error('API error '+res.status);
    const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';
    while(true){
      const{done,value}=await reader.read(); if(done) break;
      buf+=dec.decode(value,{stream:true});
      const lines=buf.split('\n'); buf=lines.pop();
      for(const ln of lines){
        if(!ln.startsWith('data: ')) continue;
        const p=ln.slice(6); if(p==='[DONE]') break;
        try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta'){
          full+=o.delta.text; setter(v=>v+o.delta.text);
        }}catch{}
      }
    }
    if(onDone) onDone(full);
    return full;
  };

  /* ── GENERATE OUTLINE ── */
  const generateOutline = async () => {
    setAiLoad(true); setAiErr(''); setStreaming(''); setAiPhase('outline');
    try {
      const base = BASE_STRUCTURES[paperType] || BASE_STRUCTURES.empirical;
      // Enrich base structure with AI-generated title refinements
      const full = await stream(buildOutlinePrompt(), setStreaming);
      // Use base structure for the visual tree, attach AI text as context
      const enriched = base.map(sec => ({...sec, aiContext: full}));
      setOutline(enriched);
      setTab('outline');
    } catch(e) { setAiErr(e.message); }
    finally { setAiLoad(false); setAiPhase(''); setStreaming(''); }
  };

  const generateAbstract = async () => {
    setAiLoad(true); setAiErr(''); setAbstractTx(''); setAiPhase('abstract');
    try { await stream(buildAbstractPrompt(), setAbstractTx); setTab('abstract'); }
    catch(e) { setAiErr(e.message); }
    finally { setAiLoad(false); setAiPhase(''); }
  };

  const generateThesis = async () => {
    setAiLoad(true); setAiErr(''); setThesisTx(''); setAiPhase('thesis');
    try { await stream(buildThesisPrompt(), setThesisTx); }
    catch(e) { setAiErr(e.message); }
    finally { setAiLoad(false); setAiPhase(''); }
  };

  /* ── EXPAND SECTION ── */
  const expandSection = async (secIdx) => {
    if(!outline) return;
    const sec = outline[secIdx];
    setExpLoading(p=>({...p,[secIdx]:true}));
    setExpContent(p=>({...p,[secIdx]:''}));
    setExpanded(p=>({...p,[secIdx]:true}));
    try {
      await stream(
        buildSectionExpandPrompt(sec),
        txt => setExpContent(p=>({...p,[secIdx]:(p[secIdx]||'')+txt})),
      );
    } catch(e) {}
    finally { setExpLoading(p=>({...p,[secIdx]:false})); }
  };

  /* ── EXPORT ── */
  const toMarkdown = () => {
    if(!outline) return '';
    let md = `# ${data.title||'Research Paper Outline'}\n`;
    md += `**Type:** ${PAPER_TYPES.find(p=>p.id===paperType)?.label} · **Citation:** ${citeStyle} · **Target:** ${data.wordTarget} words\n\n`;
    if(data.researchQ) md += `**Research Question:** ${data.researchQ}\n\n`;
    if(abstractTx) md += `## Abstract\n\n${abstractTx}\n\n`;
    if(thesisTx) md += `## Thesis Statement\n\n${thesisTx}\n\n`;
    md += `## Outline\n\n`;
    outline.forEach(sec=>{
      md += `### ${sec.num?sec.num+'. ':''}${sec.title}\n`;
      sec.subs.forEach(sub=>{ md += `- ${sub}\n`; });
      if(expContent[outline.indexOf(sec)]) md += `\n> ${expContent[outline.indexOf(sec)]}\n`;
      md += '\n';
    });
    return md;
  };

  const copyMD = () => { try{navigator.clipboard.writeText(toMarkdown());}catch{} setCopied('md'); setTimeout(()=>setCopied(''),1800); };
  const copyPlain = () => {
    if(!outline) return;
    let t = `${data.title||'Research Paper Outline'}\n${'='.repeat(40)}\n\n`;
    outline.forEach(sec=>{
      t += `${sec.num?sec.num+'. ':''}${sec.title.toUpperCase()}\n`;
      sec.subs.forEach(sub=>{ t += `  • ${sub}\n`; });
      t += '\n';
    });
    try{navigator.clipboard.writeText(t);}catch{}
    setCopied('plain'); setTimeout(()=>setCopied(''),1800);
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark && <div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(167,139,250,.3)':'none',
              background:dark?'rgba(167,139,250,.08)':'linear-gradient(135deg,#4c1d95,#5b21b6)',
              boxShadow:dark?'0 0 16px rgba(167,139,250,.2)':'0 3px 10px rgba(76,29,149,.35)',
            }}>📑</div>
            <div>
              <div style={{fontFamily:"'Crimson Pro',serif",fontWeight:700,fontSize:18,color:'var(--tx)',lineHeight:1}}>
                Research Paper <span style={{color:'var(--acc)'}}>Outline</span>
                <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #7 · 5 paper types · 5 citation styles · AI
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{width:90}}>
            <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
            <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)',textAlign:'right',marginTop:3}}>{pct}% ready</div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(167,139,250,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#c8bfee',
              boxShadow:dark?'0 0 8px rgba(167,139,250,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#04050e':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='outline'&&outline&&<span style={{width:6,height:6,borderRadius:'50%',background:'var(--succ)',display:'inline-block',marginLeft:4}}/>}
            </button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Paper Type */}
            <div>
              <div className="slbl">Paper type</div>
              {PAPER_TYPES.map(pt=>(
                <button key={pt.id} onClick={()=>setPaperType(pt.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'7px 9px',marginBottom:4,cursor:'pointer',
                  border:paperType===pt.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:paperType===pt.id?(dark?'rgba(167,139,250,.06)':'rgba(76,29,149,.05)'):'transparent',
                }}>
                  <span style={{fontSize:14,flexShrink:0}}>{pt.emoji}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:600,
                      color:paperType===pt.id?'var(--acc)':'var(--tx)'}}>{pt.label}</div>
                    <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1,lineHeight:1.4}}>{pt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Citation style */}
            <div>
              <div className="slbl">Citation style</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {CITE_STYLES.map(c=>(
                  <button key={c} className={`pill-btn ${citeStyle===c?'on':''}`}
                    onClick={()=>setCiteStyle(c)} style={{padding:'5px 10px',fontSize:10}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Word target */}
            <div>
              <div className="slbl">Word target</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {WORD_TARGETS.map(w=>(
                  <button key={w} className={`pill-btn ${data.wordTarget===w?'on':''}`}
                    onClick={()=>set('wordTarget',w)} style={{padding:'4px 9px',fontSize:9.5}}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <div className="slbl">Quick actions</div>
              <button className="gbtn" onClick={generateAbstract} disabled={aiLoad||!data.title}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px',marginBottom:4}}>
                ∑ Generate Abstract
              </button>
              <button className="gbtn" onClick={generateThesis} disabled={aiLoad||!data.researchQ}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px',marginBottom:4}}>
                ✦ Generate Thesis Statement
              </button>
              {outline&&<button className="gbtn" onClick={copyMD}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                {copied==='md'?'✓ Copied':'⬇ Copy Markdown'}
              </button>}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ SETUP ══╗ */}
              {tab==='setup'&&(
                <motion.div key="setup" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:12,fontSize:10}}>Paper Details</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Paper / Thesis Title</label>
                        <input className="fi" placeholder="The impact of remote work on knowledge worker productivity: a mixed-methods study"
                          value={data.title||''} onChange={e=>set('title',e.target.value)}/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div>
                          <label className="lbl">Field / Discipline</label>
                          <input className="fi" placeholder="Organisational Psychology" value={data.field||''} onChange={e=>set('field',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Institution (optional)</label>
                          <input className="fi" placeholder="University of Oxford" value={data.institution||''} onChange={e=>set('institution',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Supervisor (optional)</label>
                          <input className="fi" placeholder="Prof. Jane Smith" value={data.supervisor||''} onChange={e=>set('supervisor',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Keywords</label>
                          <input className="fi" placeholder="remote work, productivity, WFH, hybrid…" value={data.keywords||''} onChange={e=>set('keywords',e.target.value)}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:12,fontSize:10}}>Research Focus</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Research Question(s)</label>
                        <textarea className="fi" rows={2}
                          placeholder="To what extent does remote work affect the productivity and well-being of knowledge workers in the post-pandemic context?"
                          value={data.researchQ||''} onChange={e=>set('researchQ',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Hypothesis (optional)</label>
                        <input className="fi" placeholder="Remote workers report higher productivity but lower collaboration quality than office workers."
                          value={data.hypothesis||''} onChange={e=>set('hypothesis',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Methodology / Approach</label>
                        <input className="fi" placeholder="Mixed-methods: online survey (n=300) + 20 semi-structured interviews"
                          value={data.methodology||''} onChange={e=>set('methodology',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Key existing work to engage with (optional)</label>
                        <input className="fi" placeholder="Bloom et al. (2015), Choudhury et al. (2021), Microsoft Work Trend Index…"
                          value={data.existingWork||''} onChange={e=>set('existingWork',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Extra sections to include (optional)</label>
                        <input className="fi" placeholder="Positionality statement, Ethics approval, Glossary…"
                          value={data.extraSections||''} onChange={e=>set('extraSections',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ GENERATE ══╗ */}
              {tab==='gen'&&(
                <motion.div key="gen" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Config summary */}
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {[
                      {l:'Type',   v:PAPER_TYPES.find(p=>p.id===paperType)?.label},
                      {l:'Style',  v:citeStyle},
                      {l:'Target', v:data.wordTarget+' words'},
                      {l:'Field',  v:data.field||'—'},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?3:7,display:'flex',gap:5}}>
                        <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)'}}>{l}:</span>
                        <span style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:600,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Generate buttons */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:12}}>Generate sections</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:12}}>
                      {[
                        {id:'outline',  icon:'📄', label:'Full Outline',        sub:`${BASE_STRUCTURES[paperType]?.length||6} sections, subsections, word allocation`, action:generateOutline},
                        {id:'abstract', icon:'∑',  label:'Abstract',            sub:'200–300 words, structured',  action:generateAbstract},
                        {id:'thesis',   icon:'✦',  label:'Thesis Statement',    sub:'Main claim + 4 sub-claims',  action:generateThesis},
                      ].map(({id,icon,label,sub,action})=>(
                        <button key={id} onClick={action} disabled={aiLoad}
                          style={{
                            padding:'13px 14px',cursor:aiLoad?'not-allowed':'pointer',
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            borderRadius:dark?3:9,background:'transparent',
                            display:'flex',flexDirection:'column',alignItems:'flex-start',gap:5,
                            opacity:aiLoad&&aiPhase!==id?.5:1,transition:'all .15s',
                          }}>
                          <div style={{display:'flex',alignItems:'center',gap:8,width:'100%'}}>
                            <span style={{fontSize:18}}>{icon}</span>
                            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{label}</span>
                            {aiLoad&&aiPhase===id&&<span style={{marginLeft:'auto',display:'inline-block',animation:'spin .8s linear infinite',color:'var(--acc)',fontSize:12}}>⟳</span>}
                          </div>
                          <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)'}}>{sub}</span>
                        </button>
                      ))}
                    </div>
                    <button className="btn" onClick={async()=>{
                      await generateOutline();
                      await generateAbstract();
                      await generateThesis();
                    }} disabled={aiLoad} style={{width:'100%',padding:'11px',fontSize:13}}>
                      {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>
                        :'✦ Generate Everything'}
                    </button>
                  </div>

                  {(streaming||aiLoad)&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                        <label className="lbl">✦ Streaming — {aiPhase}</label>
                      </div>
                      <div className="ai-stream">
                        {streaming}
                        {aiLoad&&<span className="cur"/>}
                      </div>
                    </div>
                  )}

                  {aiErr&&<div style={{padding:'9px 13px',borderRadius:dark?3:8,
                    background:dark?'rgba(248,113,113,.05)':'rgba(185,28,28,.04)',
                    border:dark?'1px solid rgba(248,113,113,.18)':'1.5px solid rgba(185,28,28,.12)',
                    fontFamily:"'Inter',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}

                  
                </motion.div>
              )}

              {/* ╔══ OUTLINE ══╗ */}
              {tab==='outline'&&(
                <motion.div key="outline" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {!outline&&(
                    <div style={{textAlign:'center',padding:'48px 24px',
                      fontFamily:"'Source Code Pro',monospace",fontSize:11,color:'var(--txm)'}}>
                      No outline yet — go to ✦ Generate tab
                    </div>
                  )}

                  {outline&&(
                    <>
                      {/* Header */}
                      <div className="panel" style={{padding:'16px 20px'}}>
                        <div style={{fontFamily:"'Crimson Pro',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                          {data.title||'Research Paper Outline'}
                        </div>
                        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:6}}>
                          {[
                            PAPER_TYPES.find(p=>p.id===paperType)?.label,
                            citeStyle,
                            data.wordTarget+' words',
                            data.field||null,
                          ].filter(Boolean).map(v=>(
                            <span key={v} style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,
                              padding:'2px 9px',borderRadius:99,
                              border:dark?'1px solid rgba(167,139,250,.2)':'1.5px solid rgba(76,29,149,.2)',
                              color:'var(--acc)'}}>
                              {v}
                            </span>
                          ))}
                        </div>
                        {data.researchQ&&<div style={{fontFamily:"'Crimson Pro',serif",fontSize:14,
                          fontStyle:'italic',color:'var(--tx2)',marginTop:10,lineHeight:1.6}}>
                          RQ: {data.researchQ}
                        </div>}
                      </div>

                      {/* Thesis if exists */}
                      {thesisTx&&(
                        <div className="panel" style={{padding:'14px 17px'}}>
                          <div className="lbl" style={{marginBottom:7}}>Thesis Statement</div>
                          <div style={{fontFamily:"'Crimson Pro',serif",fontSize:15,lineHeight:1.8,color:'var(--tx)',whiteSpace:'pre-wrap'}}>
                            {thesisTx}
                          </div>
                        </div>
                      )}

                      {/* Outline tree */}
                      <div className="panel" style={{padding:'10px 4px'}}>
                        <div className="outline-tree">
                          {outline.map((sec,i)=>(
                            <div key={i} className="ol-section">
                              <div className="ol-h1">
                                {sec.num&&<span style={{fontFamily:"'Source Code Pro',monospace",fontSize:12,opacity:.5,minWidth:20}}>{sec.num}.</span>}
                                <span>{sec.title}</span>
                                <button className="expand-btn"
                                  onClick={()=>{
                                    if(expanded[i]) setExpanded(p=>({...p,[i]:false}));
                                    else expandSection(i);
                                  }}>
                                  {expLoading[i]?'⟳':expanded[i]?'▲ Collapse':'▼ Expand'}
                                </button>
                              </div>
                              {sec.subs.map((sub,j)=>(
                                <div key={j} className="ol-h2">
                                  <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:10,opacity:.4,minWidth:22}}>
                                    {String.fromCharCode(65+j)}.
                                  </span>
                                  <span>{sub}</span>
                                </div>
                              ))}
                              {expanded[i]&&expContent[i]&&(
                                <motion.div className="expanded-content"
                                  initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
                                  {expContent[i]}
                                  {expLoading[i]&&<span className="cur"/>}
                                </motion.div>
                              )}
                              {expanded[i]&&expLoading[i]&&!expContent[i]&&(
                                <div style={{padding:'10px 32px',fontFamily:"'Source Code Pro',monospace",
                                  fontSize:10,color:'var(--txm)',animation:'pulse 1s infinite'}}>
                                  ⟳ Generating section guidance…
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{display:'flex',gap:8}}>
                        <button className="gbtn" onClick={copyMD}
                          style={copied==='md'?{borderColor:'var(--succ)',color:'var(--succ)'}:{}}>
                          {copied==='md'?'✓ Copied':'⬇ Copy Markdown'}
                        </button>
                        <button className="gbtn" onClick={copyPlain}
                          style={copied==='plain'?{borderColor:'var(--succ)',color:'var(--succ)'}:{}}>
                          {copied==='plain'?'✓ Copied':'⎘ Copy Plain'}
                        </button>
                        <button className="gbtn" onClick={()=>window.print()}>🖨 Print</button>
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ ABSTRACT ══╗ */}
              {tab==='abstract'&&(
                <motion.div key="abstract" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                    <button className="btn" onClick={generateAbstract} disabled={aiLoad} style={{fontSize:12}}>
                      {aiLoad&&aiPhase==='abstract'?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>:'∑ Regenerate Abstract'}
                    </button>
                    {abstractTx&&<button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(abstractTx)}catch{}setCopied('abs');setTimeout(()=>setCopied(''),1800);}}>
                      {copied==='abs'?'✓ Copied':'⎘ Copy'}
                    </button>}
                    {abstractTx&&<span style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:'var(--txm)'}}>
                      {abstractTx.trim().split(/\s+/).length} words
                    </span>}
                  </div>

                  {abstractTx&&(
                    <div>
                      <div className="lbl" style={{marginBottom:8}}>Abstract</div>
                      <div className="prose-box">
                        {abstractTx}
                        {aiLoad&&aiPhase==='abstract'&&<span className="cur"/>}
                      </div>
                    </div>
                  )}

                  {thesisTx&&(
                    <div>
                      <div className="lbl" style={{marginBottom:8}}>Thesis Statement</div>
                      <div className="prose-box" style={{fontSize:14}}>
                        {thesisTx}
                      </div>
                    </div>
                  )}

                  {!abstractTx&&!aiLoad&&(
                    <div style={{padding:'40px 24px',textAlign:'center',
                      fontFamily:"'Source Code Pro',monospace",fontSize:11,color:'var(--txm)'}}>
                      Click ∑ Regenerate Abstract or use ✦ Generate tab
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ EXPORT ══╗ */}
              {tab==='export'&&(
                <motion.div key="export" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:12}}>Export options</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      {[
                        {icon:'⬇',label:'Markdown (.md)',    sub:'Perfect for Obsidian, Notion, GitHub',  fn:copyMD,    id:'md'},
                        {icon:'⎘',label:'Plain text',        sub:'Clean, no formatting',                  fn:copyPlain, id:'plain'},
                        {icon:'🖨',label:'Print / PDF',      sub:'Browser print dialog',                  fn:()=>window.print(), id:'print'},
                      ].map(({icon,label,sub,fn,id})=>(
                        <button key={id} onClick={fn} disabled={!outline}
                          style={{
                            padding:'14px',cursor:outline?'pointer':'not-allowed',opacity:outline?1:.4,
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            borderRadius:dark?3:10,background:copied===id?(dark?'rgba(52,211,153,.06)':'rgba(22,101,52,.05)'):'transparent',
                            borderColor:copied===id?'var(--succ)':'',
                            display:'flex',flexDirection:'column',gap:6,alignItems:'flex-start',transition:'all .15s',
                          }}>
                          <span style={{fontSize:20}}>{icon}</span>
                          <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,color:copied===id?'var(--succ)':'var(--tx)'}}>
                            {copied===id?'✓ Copied!':label}
                          </span>
                          <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8.5,color:'var(--txm)'}}>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Markdown preview */}
                  {outline&&(
                    <div>
                      <div className="lbl" style={{marginBottom:8}}>Markdown preview</div>
                      <div className="ai-stream" style={{maxHeight:380,overflow:'auto',fontSize:11}}>
                        {toMarkdown()}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'20px 22px'}}>
                    <div style={{fontFamily:"'Crimson Pro',serif",fontSize:24,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Writing a research paper — structure guide
                    </div>
                    <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:20}}>
                      academic writing · all disciplines
                    </div>

                    {/* Paper type comparison */}
                    <div style={{marginBottom:18}}>
                      <div style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:10}}>
                        Paper types
                      </div>
                      {PAPER_TYPES.map(pt=>(
                        <div key={pt.id} style={{display:'flex',gap:10,marginBottom:7,padding:'9px 11px',borderRadius:dark?3:8,
                          border:paperType===pt.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background:paperType===pt.id?(dark?'rgba(167,139,250,.04)':'rgba(76,29,149,.04)'):'transparent'}}>
                          <span style={{fontSize:16,flexShrink:0}}>{pt.emoji}</span>
                          <div>
                            <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)',marginBottom:2}}>{pt.label}</div>
                            <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{pt.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Citation quick ref */}
                    <div style={{marginBottom:16}}>
                      <div style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:10}}>
                        Citation style quick reference
                      </div>
                      {[
                        {s:'APA 7',   fields:'Social sciences, education, psychology',   fmt:'Author (Year). Title. Journal, Vol(Issue), pp.'},
                        {s:'MLA 9',   fields:'Humanities, literature, language arts',    fmt:'Author. "Title." Journal, vol., no., Year, pp.'},
                        {s:'Chicago', fields:'History, arts, social sciences',           fmt:'Author, "Title," Journal Vol, No. (Year): pp.'},
                        {s:'Harvard', fields:'Business, sciences, social sciences (UK)', fmt:'Author (Year) Title. Publisher.'},
                        {s:'IEEE',    fields:'Engineering, computer science',            fmt:'[1] A. Author, "Title," Journal, vol., pp., Year.'},
                      ].map(({s,fields,fmt})=>(
                        <div key={s} style={{marginBottom:8,padding:'9px 12px',borderRadius:dark?3:8,
                          border:citeStyle===s?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background:citeStyle===s?(dark?'rgba(167,139,250,.04)':'rgba(76,29,149,.04)'):'transparent'}}>
                          <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:3}}>
                            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:'var(--acc)',minWidth:70}}>{s}</span>
                            <span style={{fontFamily:"'Inter',sans-serif",fontSize:11.5,color:'var(--tx2)'}}>{fields}</span>
                          </div>
                          <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:10,color:'var(--txm)',lineHeight:1.5}}>{fmt}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:10}}>
                      Academic writing tips
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {icon:'🎯',t:'Research question first',b:'A sharp, specific RQ is the foundation. Everything else flows from it. Test it: is it answerable? Is it original? Does it matter?'},
                        {icon:'📖',t:'Literature as conversation',b:'Don\'t just summarise sources — engage with them. Show how they agree, conflict, and leave gaps your paper fills.'},
                        {icon:'📐',t:'Structure signals quality',b:'A clear outline shows reviewers you know where you\'re going. Strong subheadings reduce cognitive load.'},
                        {icon:'✎', t:'Write the abstract last',b:'The abstract summarises what you found, not what you plan to find. Write a rough version early, finalise it last.'},
                        {icon:'🔢',t:'Word budgeting',b:'For 5,000 words: Intro 600, Lit Review 1,200, Methods 900, Results 900, Discussion 1,000, Conclusion 400.'},
                        {icon:'⟳', t:'Iterate your thesis',b:'Your thesis statement will change as you write. Revisit it after every major section and sharpen it.'},
                      ].map(({icon,t,b})=>(
                        <div key={t} style={{padding:'11px 13px',borderRadius:dark?3:9,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.2)':'rgba(250,248,244,.8)'}}>
                          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:5}}>
                            <span style={{fontSize:15}}>{icon}</span>
                            <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{t}</span>
                          </div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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