import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes pulse-bit{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
.dk{--bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;--bdr:#1a2820;--acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;--err:#ff6b6b;--warn:#fbbf24;--tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;min-height:100vh;background:var(--bg);color:var(--tx);background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.06),transparent);}
.lt{--bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;--bdr:#b8ddc8;--acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;--err:#991b1b;--warn:#92400e;--tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;min-height:100vh;background:var(--bg);color:var(--tx);}
.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 16px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(20,255,180,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(13,51,32,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}
.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 86px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 22px;display:flex;flex-direction:column;gap:16px;overflow-x:hidden;}
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}
.fi{width:100%;outline:none;font-family:'Fira Code',monospace;font-size:13px;padding:9px 12px;transition:all .13s;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--acc);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--acc);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(13,51,32,.09);}
.fi::placeholder{opacity:.25;}
.fi.err{border-color:var(--err) !important;}
.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;font-family:'Fira Code',monospace;font-size:10px;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}
.bit{width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:'Fira Code',monospace;font-size:14px;font-weight:500;border-radius:4px;border:none;transition:all .12s;user-select:none;}
.dk .bit.one{background:rgba(20,255,180,.18);color:var(--acc);box-shadow:0 0 10px rgba(20,255,180,.25);}
.dk .bit.zero{background:rgba(0,0,0,.45);color:var(--tx3);}
.lt .bit.one{background:rgba(13,51,32,.14);color:var(--acc);border:1.5px solid rgba(13,51,32,.25);}
.lt .bit.zero{background:rgba(13,51,32,.03);color:var(--tx3);border:1.5px solid var(--bdr);}
.bit:hover{transform:scale(1.1);}
.out-row{display:flex;align-items:center;gap:10px;padding:9px 13px;margin-bottom:4px;border-radius:3px;cursor:pointer;}
.dk .out-row{border:1px solid var(--bdr);background:rgba(0,0,0,.3);}
.lt .out-row{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}
.dk .out-row:hover{border-color:rgba(20,255,180,.3);}
.lt .out-row:hover{border-color:var(--acc);}
.step-card{display:flex;gap:13px;padding:13px 15px;margin-bottom:9px;position:relative;}
.dk .step-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.22);}
.dk .step-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.4;}
.lt .step-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.7);}
.step-num{width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fira Code',monospace;font-size:11px;flex-shrink:0;margin-top:1px;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}
.formula{font-family:'Fira Code',monospace;font-size:12px;padding:9px 13px;margin-top:7px;line-height:1.8;white-space:pre-wrap;overflow-x:auto;}
.dk .formula{background:rgba(0,0,0,.55);border:1px solid rgba(20,255,180,.1);border-radius:3px;color:#7dffce;}
.lt .formula{background:#e8f7ee;border:1.5px solid rgba(13,51,32,.12);color:#0d3320;border-radius:8px;}
.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;display:block;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}
.ab p,.ab li{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.8;color:var(--tx2);margin-bottom:7px;}
.ab h3{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--tx);margin:18px 0 8px;}
.ab ul{padding-left:18px;}
.ab li{margin-bottom:4px;}
.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}
.copied{position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Fira Code',monospace;font-size:11px;padding:8px 16px;border-radius:4px;background:var(--acc);color:#060a09;pointer-events:none;}
.at-cell{font-family:'Fira Code',monospace;font-size:10px;padding:5px 9px;}
`;

const isValidBin = s => /^[01]+$/.test(s);
const isValidHex = s => /^[0-9a-fA-F]+$/.test(s);
const isValidOct = s => /^[0-7]+$/.test(s);
const isValidDec = s => /^\d+$/.test(s) && parseInt(s,10) <= 4294967295;
const pad8 = s => s.padStart(Math.ceil(Math.max(s.length,1)/8)*8,'0');
const toBin = n => (n>>>0).toString(2);
const toHex = n => (n>>>0).toString(16).toUpperCase();
const toOct = n => (n>>>0).toString(8);

const BITWISE_OPS = [
  {op:'AND', sym:'&',  fn:(a,b)=>a&b,        desc:'Output is 1 only when BOTH input bits are 1'},
  {op:'OR',  sym:'|',  fn:(a,b)=>a|b,        desc:'Output is 1 when AT LEAST ONE input bit is 1'},
  {op:'XOR', sym:'^',  fn:(a,b)=>a^b,        desc:'Output is 1 when input bits DIFFER'},
  {op:'NOT', sym:'~A', fn:(a)=>(~a)>>>0,     desc:'Flips every bit of A (32-bit unsigned)'},
  {op:'NAND',sym:'~&', fn:(a,b)=>(~(a&b))>>>0, desc:'NOT of AND — output 0 only when both are 1'},
  {op:'NOR', sym:'~|', fn:(a,b)=>(~(a|b))>>>0, desc:'NOT of OR — output 1 only when both are 0'},
];

const TABS = [
  {id:'convert',  label:'⇄ Convert'},
  {id:'bitwise',  label:'⊕ Bitwise'},
  {id:'ascii',    label:'🔤 ASCII'},
  {id:'float',    label:'∿ IEEE 754'},
  {id:'guide',    label:'? Guide'},
];

export default function BinaryConverter({isDarkMode:ext}={}) {
  const [dark, setDark] = useState(ext !== undefined ? ext : true);
  const cls = dark ? 'dk' : 'lt';
  const [tab,  setTab]  = useState('convert');
  const [copied, setCopied] = useState('');

  // convert
  const [input,      setInput]      = useState('42');
  const [inputMode,  setInputMode]  = useState('dec');
  const [bits,       setBits]       = useState(8);

  // bitwise
  const [bwA,  setBwA]  = useState('10110101');
  const [bwB,  setBwB]  = useState('01101010');
  const [bwOp, setBwOp] = useState('AND');

  // ascii
  const [asciiText, setAsciiText] = useState('Hello');

  // float
  const [floatIn, setFloatIn] = useState('3.14');

  // bit toggle
  const [toggleBits, setToggleBits] = useState(Array(8).fill(0));

  const conv = useMemo(() => {
    let n;
    const v = input.trim();
    if (!v) return null;
    try {
      if (inputMode==='dec'){if(!isValidDec(v))return null;n=parseInt(v,10);}
      else if(inputMode==='bin'){if(!isValidBin(v))return null;n=parseInt(v,2);}
      else if(inputMode==='hex'){if(!isValidHex(v))return null;n=parseInt(v,16);}
      else{if(!isValidOct(v))return null;n=parseInt(v,8);}
      if(n<0||n>4294967295)return null;
    } catch{return null;}
    const full = pad8(toBin(n));
    const binBits = bits===8?full.slice(-8):bits===16?full.slice(-16).padStart(16,'0'):full.padStart(32,'0');
    return {n, dec:n.toString(), bin:full, hex:toHex(n), oct:toOct(n), binBits};
  }, [input, inputMode, bits]);

  const steps = useMemo(() => {
    if(!conv) return [];
    const n = conv.n;
    const digits=[];
    let tmp=n;
    while(tmp>0){digits.unshift(tmp%2);tmp=Math.floor(tmp/2);}
    if(digits.length===0)digits.push(0);
    const divSteps = digits.map((_,i)=>{
      const val=Math.floor(n/Math.pow(2,digits.length-1-i));
      return `${val} ÷ 2 = ${Math.floor(val/2)}  remainder ${val%2}`;
    }).join('\n');
    return [
      {title:'Divide by 2 repeatedly', body: divSteps},
      {title:'Read remainders bottom-up', body:`Remainders (bottom-up): ${digits.join('')}\nBinary result: ${pad8(toBin(n))}`},
      {title:'Group 4 bits → hex nibbles', body:(()=>{
        const b=pad8(toBin(n));
        const ns=b.match(/.{4}/g)||[];
        return ns.map(nb=>`${nb} → ${parseInt(nb,2).toString(16).toUpperCase()}`).join('  ');
      })()},
    ];
  }, [conv]);

  const bwResult = useMemo(() => {
    if(!isValidBin(bwA.trim()))return null;
    if(bwOp!=='NOT'&&!isValidBin(bwB.trim()))return null;
    const a=parseInt(bwA.trim(),2);
    const b=parseInt(bwB.trim(),2);
    const opDef=BITWISE_OPS.find(o=>o.op===bwOp);
    if(!opDef)return null;
    const result=bwOp==='NOT'?opDef.fn(a):opDef.fn(a,b);
    const maxLen=Math.max(bwA.trim().length,bwB.trim().length,8);
    const aStr=a.toString(2).padStart(maxLen,'0');
    const bStr=b.toString(2).padStart(maxLen,'0');
    const rStr=(result>>>0).toString(2).padStart(maxLen,'0');
    return{a,b,result,aStr,bStr,rStr,op:opDef};
  }, [bwA,bwB,bwOp]);

  const asciiRows = useMemo(() => asciiText.split('').map(c=>{
    const code=c.charCodeAt(0);
    return{char:c,dec:code,bin:pad8(code.toString(2)),hex:code.toString(16).toUpperCase().padStart(2,'0')};
  }), [asciiText]);

  const floatResult = useMemo(() => {
    const f=parseFloat(floatIn);
    if(isNaN(f))return null;
    const buf=new ArrayBuffer(4);
    new DataView(buf).setFloat32(0,f,false);
    const bytes=new Uint8Array(buf);
    const bits32=Array.from(bytes).map(b=>b.toString(2).padStart(8,'0')).join('');
    const sign=bits32[0];
    const exponent=bits32.slice(1,9);
    const mantissa=bits32.slice(9);
    const expVal=parseInt(exponent,2)-127;
    return{bits32,sign,exponent,mantissa,expVal,f};
  }, [floatIn]);

  const toggleDec = useMemo(()=>parseInt(toggleBits.join(''),2),[toggleBits]);

  const copyText = useCallback((text,label='')=>{
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(label||text.slice(0,12));
    setTimeout(()=>setCopied(''),1800);
  },[]);

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark && <div className="scanline"/>}
        <AnimatePresence>
          {copied && (
            <motion.div className="copied" key="cp"
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
              ✓ copied {copied}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:700,
              borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)',
              color:dark?'var(--acc)':'#fff'}}>01</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Binary<span style={{color:'var(--acc)'}}>Conv</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #7 · base conversion · bitwise · IEEE 754
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {conv && (
            <motion.div key={conv.n} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'4px 12px',
                border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>DEC</span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc)',fontWeight:500}}>{conv.dec}</span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginLeft:5}}>HEX</span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc)',fontWeight:500}}>{conv.hex}</span>
            </motion.div>
          )}
          <button onClick={()=>setDark(d=>!d)} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer'}}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8ddc8',boxShadow:dark?'0 0 8px rgba(20,255,180,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060a09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* bit toggle */}
            <div>
              <div className="slbl">Bit toggle playground</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:8}}>
                {toggleBits.map((b,i)=>(
                  <button key={i} className={`bit ${b?'one':'zero'}`}
                    onClick={()=>setToggleBits(p=>{const n=[...p];n[i]=n[i]?0:1;return n;})}>
                    {b}
                  </button>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'7px 10px',borderRadius:dark?3:7,
                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                background:dark?'rgba(0,0,0,.35)':'rgba(245,251,248,.9)'}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>DEC</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:18,color:'var(--acc)',fontWeight:500}}>{toggleDec}</span>
              </div>
              <div style={{display:'flex',gap:12,marginTop:5}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>HEX <span style={{color:'var(--acc)'}}>{toggleDec.toString(16).toUpperCase().padStart(2,'0')}</span></span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>OCT <span style={{color:'var(--acc)'}}>{toggleDec.toString(8)}</span></span>
              </div>
              <button className="gbtn" style={{width:'100%',marginTop:5,justifyContent:'center'}}
                onClick={()=>setToggleBits(Array(8).fill(0))}>clear</button>
            </div>

            {/* base reference */}
            <div>
              <div className="slbl">Number bases</div>
              {[['2','Binary','0, 1'],['8','Octal','0 – 7'],['10','Decimal','0 – 9'],['16','Hex','0–9, A–F']].map(([b,n,d])=>(
                <div key={b} style={{padding:'5px 9px',marginBottom:3,borderRadius:dark?2:6,
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  background:dark?'rgba(20,255,180,.015)':'rgba(13,51,32,.02)'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)'}}>base {b}</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:600,color:'var(--tx)'}}>{n}</span>
                  </div>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>digits: {d}</span>
                </div>
              ))}
            </div>

            {/* quick values */}
            <div>
              <div className="slbl">Common values</div>
              {[[0,'00000000','00'],[1,'00000001','01'],[127,'01111111','7F'],[128,'10000000','80'],[255,'11111111','FF']].map(([d,b,h])=>(
                <div key={d} onClick={()=>{setInput(d.toString());setInputMode('dec');setTab('convert');}}
                  style={{display:'flex',justifyContent:'space-between',padding:'5px 9px',marginBottom:3,cursor:'pointer',
                    borderRadius:dark?2:6,border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    transition:'all .12s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--acc)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)'}>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--tx)'}}>{d}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>{b}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)'}}>{h}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ═══ CONVERT ═══ */}
              {tab==='convert' && (
                <motion.div key="cv" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontFamily:"'Fira Code',monospace",fontSize:15,fontWeight:700,color:'var(--acc)',
                        border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>⇄</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Base converter</div>
                    </div>

                    <div style={{display:'flex',gap:8,marginBottom:14}}>
                      <div style={{flex:1}}>
                        <label className="lbl">Input value</label>
                        <input className={`fi${conv===null&&input?' err':''}`} value={input}
                          onChange={e=>setInput(e.target.value)}
                          placeholder={inputMode==='bin'?'1010…':inputMode==='hex'?'FF…':inputMode==='oct'?'17…':'42'}/>
                      </div>
                      <div>
                        <label className="lbl">Input base</label>
                        <div style={{display:'flex',gap:4}}>
                          {[['DEC','dec'],['BIN','bin'],['HEX','hex'],['OCT','oct']].map(([l,m])=>(
                            <button key={m} className={`gbtn${inputMode===m?' on':''}`} onClick={()=>setInputMode(m)}>{l}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{display:'flex',gap:4,marginBottom:16,alignItems:'center'}}>
                      <span className="slbl" style={{marginBottom:0,lineHeight:'26px',marginRight:4}}>bit width:</span>
                      {[8,16,32].map(b=>(
                        <button key={b} className={`gbtn${bits===b?' on':''}`} onClick={()=>setBits(b)}>{b}-bit</button>
                      ))}
                    </div>

                    {conv ? (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        {[['Decimal','DEC',conv.dec,'10'],['Binary','BIN',conv.bin,'2'],['Hexadecimal','HEX',conv.hex,'16'],['Octal','OCT',conv.oct,'8']].map(([name,tag,val,base])=>(
                          <div key={tag} className="out-row" onClick={()=>copyText(val,tag)}>
                            <div style={{width:24,height:20,display:'flex',alignItems:'center',justifyContent:'center',
                              borderRadius:dark?2:5,fontFamily:"'Fira Code',monospace",fontSize:8,fontWeight:500,
                              background:dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.07)',color:'var(--acc)'}}>
                              {base}
                            </div>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)',width:90}}>{name}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc)',flex:1,wordBreak:'break-all',letterSpacing:'.04em'}}>{val}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)'}}>copy ↗</span>
                          </div>
                        ))}

                        <div style={{marginTop:16}}>
                          <label className="lbl" style={{marginBottom:9}}>{bits}-bit visualizer</label>
                          <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                            {conv.binBits.split('').map((b,i)=>{
                              const pos=conv.binBits.length-1-i;
                              return (
                                <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:7,color:'var(--txm)'}}>{pos}</div>
                                  <div className={`bit ${b==='1'?'one':'zero'}`}
                                    style={{width:bits===32?18:bits===16?24:30,height:bits===32?18:bits===16?24:30,fontSize:bits===32?9:bits===16?11:13}}>
                                    {b}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div style={{padding:'18px',textAlign:'center',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--tx3)'}}>
                        {input?'⚠ invalid for selected base':'enter a value above'}
                      </div>
                    )}
                  </div>

                  {conv && (
                    <div className="panel" style={{padding:'16px 18px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14}}>
                        <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:14,border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                          background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.04)'}}>∑</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:'var(--tx)'}}>Step-by-step: decimal → binary</div>
                      </div>
                      {steps.map((s,i)=>(
                        <div key={i} className="step-card">
                          <div className="step-num">{i+1}</div>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:600,color:'var(--tx)',marginBottom:5}}>{s.title}</div>
                            <div className="formula">{s.body}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ BITWISE ═══ */}
              {tab==='bitwise' && (
                <motion.div key="bw" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontFamily:"'Fira Code',monospace",fontSize:15,color:'var(--acc)',
                        border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>⊕</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Bitwise operations</div>
                    </div>

                    <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:16}}>
                      {BITWISE_OPS.map(o=>(
                        <button key={o.op} className={`gbtn${bwOp===o.op?' on':''}`} onClick={()=>setBwOp(o.op)}>
                          <span style={{fontFamily:"'Fira Code',monospace"}}>{o.sym}</span> {o.op}
                        </button>
                      ))}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:bwOp==='NOT'?'1fr':'1fr 1fr',gap:12,marginBottom:16}}>
                      <div>
                        <label className="lbl">Operand A (binary)</label>
                        <input className={`fi${!isValidBin(bwA.trim())&&bwA?' err':''}`}
                          value={bwA} onChange={e=>setBwA(e.target.value)} placeholder="10110101"/>
                      </div>
                      {bwOp!=='NOT' && (
                        <div>
                          <label className="lbl">Operand B (binary)</label>
                          <input className={`fi${!isValidBin(bwB.trim())&&bwB?' err':''}`}
                            value={bwB} onChange={e=>setBwB(e.target.value)} placeholder="01101010"/>
                        </div>
                      )}
                    </div>

                    {bwResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:13,
                          padding:'14px 16px',borderRadius:dark?3:8,marginBottom:14,lineHeight:2.1,
                          background:dark?'rgba(0,0,0,.5)':'rgba(232,247,238,.8)',
                          border:dark?'1px solid rgba(20,255,180,.1)':'1.5px solid rgba(13,51,32,.12)'}}>
                          {[['A',bwResult.aStr,bwResult.a],bwOp!=='NOT'?['B',bwResult.bStr,bwResult.b]:null].filter(Boolean).map(([l,s,n])=>(
                            <div key={l} style={{display:'flex',gap:16,alignItems:'center'}}>
                              <span style={{color:'var(--txm)',width:24}}>{l}</span>
                              <span style={{color:'var(--acc)',letterSpacing:'.1em'}}>{s}</span>
                              <span style={{color:'var(--tx2)',fontSize:10}}>= {n}</span>
                            </div>
                          ))}
                          <div style={{height:1,background:dark?'rgba(167,139,250,.25)':'rgba(91,33,182,.15)',margin:'2px 0'}}/>
                          <div style={{display:'flex',gap:16,alignItems:'center'}}>
                            <span style={{color:dark?'#a78bfa':'#5b21b6',width:24,fontWeight:700}}>{bwResult.op.sym}</span>
                            <span style={{color:dark?'#a78bfa':'#5b21b6',letterSpacing:'.1em',fontWeight:600,
                              textShadow:dark?'0 0 10px rgba(167,139,250,.5)':'none'}}>{bwResult.rStr}</span>
                            <span style={{color:'var(--tx2)',fontSize:10}}>= {bwResult.result}</span>
                          </div>
                        </div>

                        <label className="lbl" style={{marginBottom:8}}>Bit-by-bit breakdown</label>
                        <div style={{display:'flex',flexWrap:'wrap',gap:3,marginBottom:12}}>
                          {bwResult.aStr.split('').map((_,i)=>{
                            const a=bwResult.aStr[i];
                            const b=bwResult.bStr[i]||'0';
                            const r=bwResult.rStr[i];
                            return (
                              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,
                                padding:'3px 5px',borderRadius:dark?2:5,
                                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                                background:r==='1'?(dark?'rgba(167,139,250,.07)':'rgba(91,33,182,.04)'):'transparent'}}>
                                <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:a==='1'?'var(--acc)':'var(--tx3)'}}>{a}</span>
                                {bwOp!=='NOT' && <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:b==='1'?'var(--acc)':'var(--tx3)'}}>{b}</span>}
                                <div style={{width:16,height:1,background:dark?'rgba(167,139,250,.3)':'rgba(91,33,182,.2)'}}/>
                                <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:r==='1'?600:400,
                                  color:r==='1'?(dark?'#a78bfa':'#5b21b6'):'var(--tx3)'}}>{r}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{padding:'9px 12px',borderRadius:dark?3:7,
                          border:dark?'1px solid rgba(20,255,180,.12)':'1.5px solid rgba(13,51,32,.12)',
                          background:dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.03)'}}>
                          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:'var(--tx2)'}}>{bwResult.op.desc}</span>
                        </div>

                        <div className="formula" style={{marginTop:10}}>
                          {`${bwOp}: ${bwResult.a} ${bwResult.op.sym} ${bwOp!=='NOT'?bwResult.b:''} = ${bwResult.result}\nBinary: ${bwResult.rStr}\nHex:    ${toHex(bwResult.result)}`}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* truth tables */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>Logic gate truth tables</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                      {[
                        {name:'AND',rows:[[0,0,0],[0,1,0],[1,0,0],[1,1,1]]},
                        {name:'OR', rows:[[0,0,0],[0,1,1],[1,0,1],[1,1,1]]},
                        {name:'XOR',rows:[[0,0,0],[0,1,1],[1,0,1],[1,1,0]]},
                      ].map(({name,rows})=>(
                        <div key={name} style={{borderRadius:dark?3:8,overflow:'hidden',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                          <div style={{padding:'5px 10px',fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:600,
                            color:'var(--acc)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)',
                            borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{name}</div>
                          <table style={{width:'100%',borderCollapse:'collapse'}}>
                            <thead>
                              <tr>{['A','B','Out'].map(h=>(
                                <th key={h} className="at-cell" style={{fontFamily:"'Outfit',sans-serif",fontSize:9,
                                  color:'var(--txm)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',
                                  borderBottom:dark?'1px solid var(--bdr)':'1px solid var(--bdr)'}}>{h}</th>
                              ))}</tr>
                            </thead>
                            <tbody>
                              {rows.map(([a,b,o],i)=>(
                                <tr key={i}>
                                  <td className="at-cell" style={{textAlign:'center',color:a?'var(--acc)':'var(--tx3)'}}>{a}</td>
                                  <td className="at-cell" style={{textAlign:'center',color:b?'var(--acc)':'var(--tx3)'}}>{b}</td>
                                  <td className="at-cell" style={{textAlign:'center',color:o?'var(--acc)':'var(--tx3)',fontWeight:o?700:400}}>{o}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ ASCII ═══ */}
              {tab==='ascii' && (
                <motion.div key="as" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:16,border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',
                        background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.04)'}}>🔤</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>ASCII / text ↔ binary</div>
                    </div>
                    <label className="lbl">Type text to encode</label>
                    <input className="fi" value={asciiText} onChange={e=>setAsciiText(e.target.value.slice(0,40))}
                      placeholder="Hello, World!" style={{marginBottom:14}}/>

                    {asciiRows.length>0 && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                          {asciiRows.map((r,i)=>(
                            <div key={i} onClick={()=>copyText(r.bin,`'${r.char}'`)}
                              style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'7px 9px',
                                borderRadius:dark?3:8,cursor:'pointer',gap:2,
                                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                                background:dark?'rgba(0,0,0,.35)':'rgba(245,251,248,.8)',transition:'all .12s'}}
                              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--acc)'}
                              onMouseLeave={e=>e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)'}>
                              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,color:'var(--tx)',lineHeight:1}}>{r.char}</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>{r.dec}</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--acc)'}}>{r.hex}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                            <label className="lbl" style={{marginBottom:0}}>Full binary string</label>
                            <button className="gbtn" onClick={()=>copyText(asciiRows.map(r=>r.bin).join(' '),'binary')}>copy all</button>
                          </div>
                          <div className="formula" style={{wordBreak:'break-all',lineHeight:2.1}}>
                            {asciiRows.map((r,i)=>(
                              <span key={i}>
                                <span style={{color:'var(--acc)'}}>{r.bin}</span>
                                {i<asciiRows.length-1 && <span style={{color:'var(--tx3)'}}> </span>}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{marginTop:14,overflowX:'auto'}}>
                          <table style={{width:'100%',borderCollapse:'collapse'}}>
                            <thead>
                              <tr>{['Char','Dec','Hex','Binary'].map(h=>(
                                <th key={h} style={{fontFamily:"'Outfit',sans-serif",fontSize:9,fontWeight:600,
                                  letterSpacing:'.15em',textTransform:'uppercase',color:'var(--txm)',
                                  padding:'6px 10px',textAlign:'left',
                                  borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{h}</th>
                              ))}</tr>
                            </thead>
                            <tbody>
                              {asciiRows.map((r,i)=>(
                                <tr key={i} style={{background:i%2===0?(dark?'rgba(20,255,180,.01)':'rgba(13,51,32,.015)'):'transparent'}}>
                                  <td style={{padding:'6px 10px',fontFamily:"'Fraunces',serif",fontSize:16,color:'var(--tx)'}}>{r.char}</td>
                                  <td style={{padding:'6px 10px',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>{r.dec}</td>
                                  <td style={{padding:'6px 10px',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{r.hex}</td>
                                  <td style={{padding:'6px 10px',fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)',letterSpacing:'.08em'}}>{r.bin}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ IEEE 754 ═══ */}
              {tab==='float' && (
                <motion.div key="fl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontFamily:"'Fira Code',monospace",fontSize:15,color:dark?'#a78bfa':'#5b21b6',
                        border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                        background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.04)'}}>∿</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>IEEE 754 single-precision float</div>
                    </div>
                    <label className="lbl">Decimal number</label>
                    <input className="fi" type="number" step="any" value={floatIn}
                      onChange={e=>setFloatIn(e.target.value)} placeholder="3.14"
                      style={{marginBottom:14,maxWidth:260}}/>

                    {floatResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <label className="lbl" style={{marginBottom:8}}>32-bit representation</label>
                        <div style={{display:'flex',gap:2,flexWrap:'wrap',marginBottom:6}}>
                          {floatResult.bits32.split('').map((b,i)=>{
                            const isSign=i===0;
                            const isExp=i>=1&&i<=8;
                            const c=isSign?'#ff6b6b':isExp?(dark?'#fbbf24':'#92400e'):'var(--acc)';
                            return (
                              <div key={i} style={{width:19,height:22,display:'flex',alignItems:'center',justifyContent:'center',
                                borderRadius:2,fontFamily:"'Fira Code',monospace",fontSize:10,fontWeight:b==='1'?600:400,
                                color:b==='1'?c:(dark?'var(--tx3)':'#b8ddc8'),
                                background:isSign?'rgba(255,107,107,.12)':isExp?(dark?'rgba(251,191,36,.08)':'rgba(146,64,14,.05)'):
                                  b==='1'?(dark?'rgba(20,255,180,.12)':'rgba(13,51,32,.07)'):(dark?'rgba(0,0,0,.4)':'rgba(13,51,32,.02)'),
                                border:`1px solid ${isSign?'rgba(255,107,107,.2)':isExp?(dark?'rgba(251,191,36,.18)':'rgba(146,64,14,.12)'):(dark?'var(--bdr)':'var(--bdr)')}`}}>
                                {b}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{display:'flex',gap:14,marginBottom:14}}>
                          {[['Sign (1)','#ff6b6b'],['Exponent (8)',dark?'#fbbf24':'#92400e'],['Mantissa (23)','var(--acc)']].map(([l,c])=>(
                            <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                              <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{l}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                          {[
                            ['Sign bit',     floatResult.sign,                    floatResult.sign==='0'?'positive':'negative','#ff6b6b'],
                            ['Exponent',     floatResult.exponent,                `bias 127 → 2^${floatResult.expVal}`,dark?'#fbbf24':'#92400e'],
                            ['Mantissa',     floatResult.mantissa.slice(0,12)+'…','1.mantissa fraction','var(--acc)'],
                          ].map(([l,v,sub,c])=>(
                            <div key={l} style={{padding:'10px 12px',borderRadius:dark?3:8,
                              border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                              background:dark?'rgba(0,0,0,.3)':'rgba(245,251,248,.9)'}}>
                              <div className="lbl">{l}</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:c,wordBreak:'break-all',marginBottom:3}}>{v}</div>
                              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{sub}</div>
                            </div>
                          ))}
                        </div>

                        <div className="formula">
                          {`Value = (-1)^${floatResult.sign} × 2^${floatResult.expVal} × (1 + mantissa)\n`}
                          {`      = ${floatResult.f}\n`}
                          {`Bits  = ${floatResult.sign} | ${floatResult.exponent} | ${floatResult.mantissa}`}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                      IEEE 754 special values
                    </div>
                    {[['+0','0 00000000 00000000000000000000000'],['-0','1 00000000 00000000000000000000000'],['+∞','0 11111111 00000000000000000000000'],['-∞','1 11111111 00000000000000000000000'],['NaN','_ 11111111 1xxxxxxxxxxxxxxxxxxxxxxx'],['Max','0 11111110 11111111111111111111111'],].map(([n,b])=>(
                      <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',
                        borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                        <span style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:600,color:'var(--tx)',width:36}}>{n}</span>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)',letterSpacing:'.06em',flex:1}}>{b}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ GUIDE ═══ */}
              {tab==='guide' && (
                <motion.div key="gu" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                        Binary &amp; number systems — the complete guide
                      </div>
                    </div>
                    <div className="ab">
                      <p>Computers store everything — text, images, music, programs — as sequences of 0s and 1s. Understanding binary and related number bases is fundamental to programming, computer science, and digital electronics.</p>
                      <h3>Why binary?</h3>
                      <p>Electronic transistors have two stable states: on and off, which map naturally to 1 and 0. A single binary digit is a <strong style={{color:'var(--tx)'}}>bit</strong>. Eight bits form a <strong style={{color:'var(--tx)'}}>byte</strong>, which can represent 256 unique values (0–255).</p>
                      <h3>Converting between bases</h3>
                      <p>To convert decimal to binary, repeatedly divide by 2 and record remainders bottom-up. Hexadecimal is a compact shorthand: each hex digit represents exactly 4 binary bits, making large binary numbers far easier to read and write.</p>
                      <h3>Bitwise operations</h3>
                      <p>Bitwise operators manipulate individual bits and are used heavily in low-level programming, networking masks, graphics rendering, and cryptography.</p>
                      <ul>
                        <li><strong style={{color:'var(--tx)'}}>AND (&amp;)</strong> — mask and clear bits; check flag states</li>
                        <li><strong style={{color:'var(--tx)'}}>OR (|)</strong> — set specific bits; combine flags</li>
                        <li><strong style={{color:'var(--tx)'}}>XOR (^)</strong> — toggle bits; simple in-place swap; basic encryption</li>
                        <li><strong style={{color:'var(--tx)'}}>NOT (~)</strong> — invert all bits; used in two's complement negation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What is a nibble?','A nibble is 4 bits — half a byte. It holds values 0–15, mapping exactly to one hexadecimal digit (0–F). The name is a playful half-bite of a byte.'],
                      ["What is two's complement?",'Two\'s complement is how CPUs represent negative integers. To negate: flip all bits, then add 1. In 8-bit, -1 = 11111111, and -128 = 10000000. This makes subtraction identical to addition of a negative number in hardware.'],
                      ['Why does 0.1 + 0.2 ≠ 0.3 in code?','Just as 1/3 is 0.333… in decimal, many fractions are repeating in binary. 0.1 in decimal is 0.0001100110011… in binary — infinite. IEEE 754 stores a finite approximation, causing small rounding errors that accumulate.'],
                      ['What is endianness?','Endianness describes byte order. Big-endian stores the most-significant byte first (network byte order). Little-endian stores the least-significant byte first (x86 CPUs). Mismatched endianness is a classic source of bugs when reading binary data across systems.'],
                    ].map(([q,a])=>(
                      <div key={q} className="faq">
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>{q}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.75}}>{a}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            
          </div>
        </div>
      </div>
    </>
  );
}