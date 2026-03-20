import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import * as math from "mathjs";

/* ════════ CSS ════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Oxanium:wght@400;600;800&family=JetBrains+Mono:wght@300;400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#05070f;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:rgba(99,102,241,0.04);}
::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.28);border-radius:2px;}
@keyframes gridDrift{0%,100%{opacity:.04}50%{opacity:.09}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes holoText{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes appear{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
@keyframes stepReveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes borderGlow{0%,100%{border-color:rgba(99,102,241,0.22)}50%{border-color:rgba(99,102,241,0.65)}}
@keyframes tooltipFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
@keyframes pulse2{0%,100%{opacity:0.5}50%{opacity:1}}
.si:focus{outline:none;border-color:rgba(99,102,241,0.7)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.13);}
.tb:hover{background:rgba(99,102,241,0.1)!important;color:rgba(180,180,255,0.9)!important;}
.sb:hover{background:linear-gradient(135deg,#5b5ef4,#7c3aed)!important;transform:translateY(-1px);box-shadow:0 8px 25px rgba(99,102,241,0.4)!important;}
.ec:hover{background:rgba(99,102,241,0.14)!important;border-color:rgba(99,102,241,0.44)!important;color:#a5b4fc!important;}
.gb:hover{background:rgba(99,102,241,0.18)!important;}
.gtb:hover{background:rgba(99,102,241,0.14)!important;color:#c7d2fe!important;}
.maxbtn:hover{background:rgba(99,102,241,0.25)!important;border-color:rgba(99,102,241,0.5)!important;}
`;

/* ════════ AD UNIT ════════ */
const Ad = ({ slot, label, minH = 90 }) => (
  <div style={{ width:"100%", background:"rgba(99,102,241,0.02)", border:"1px dashed rgba(99,102,241,0.14)", borderRadius:8, minHeight:minH, display:"flex", alignItems:"center", justifyContent:"center" }}>
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"rgba(99,102,241,0.28)", letterSpacing:"0.3em", textTransform:"uppercase" }}>AD · {label}</span>
  </div>
);

/* ════════ COLOR PALETTE ════════ */
const COLORS = ["#818cf8","#34d399","#f472b6","#fb923c","#38bdf8","#a3e635","#e879f9","#facc15"];

/* ════════ SAFE EVAL ════════ */
function evalSafe(expr, vars = {}) {
  try {
    const scope = { pi: Math.PI, e: Math.E, ...vars };
    const clean = expr.replace(/\^/g,"**");
    const r = math.evaluate(clean, scope);
    return (isFinite(r) && !isNaN(r)) ? r : null;
  } catch { return null; }
}

/* ════════════════════════════════════════════════════════════════
   2D CANVAS — Function / Parametric / Polar / Scatter
════════════════════════════════════════════════════════════════ */
function Canvas2D({ plots, xMin, xMax, yMin, yMax, showGrid, showAxes, height = 420, onMaximize }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const W = 700, H = height;
  const PAD = { top:28, right:28, bottom:38, left:52 };
  const PW = W - PAD.left - PAD.right;
  const PH = H - PAD.top - PAD.bottom;
  const toCX = x => PAD.left + ((x - xMin)/(xMax - xMin))*PW;
  const toCY = y => PAD.top + PH - ((y - yMin)/(yMax - yMin))*PH;
  const toMX = cx => xMin + ((cx - PAD.left)/PW)*(xMax - xMin);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    // Grid
    if (showGrid) {
      ctx.strokeStyle="rgba(99,102,241,0.1)"; ctx.lineWidth=1;
      for(let i=0;i<=10;i++){const cx=PAD.left+i/10*PW;ctx.beginPath();ctx.moveTo(cx,PAD.top);ctx.lineTo(cx,PAD.top+PH);ctx.stroke();}
      for(let i=0;i<=8;i++){const cy=PAD.top+i/8*PH;ctx.beginPath();ctx.moveTo(PAD.left,cy);ctx.lineTo(PAD.left+PW,cy);ctx.stroke();}
    }
    // Axes
    if (showAxes) {
      const zx = toCX(0), zy = toCY(0);
      ctx.strokeStyle="rgba(99,102,241,0.45)"; ctx.lineWidth=1.5;
      if(zy>=PAD.top&&zy<=PAD.top+PH){ctx.beginPath();ctx.moveTo(PAD.left,zy);ctx.lineTo(PAD.left+PW,zy);ctx.stroke();}
      if(zx>=PAD.left&&zx<=PAD.left+PW){ctx.beginPath();ctx.moveTo(zx,PAD.top);ctx.lineTo(zx,PAD.top+PH);ctx.stroke();}
      // Arrow heads
      ctx.fillStyle="rgba(99,102,241,0.45)";
      if(zy>=PAD.top&&zy<=PAD.top+PH){ctx.beginPath();ctx.moveTo(PAD.left+PW,zy);ctx.lineTo(PAD.left+PW-8,zy-4);ctx.lineTo(PAD.left+PW-8,zy+4);ctx.fill();}
      if(zx>=PAD.left&&zx<=PAD.left+PW){ctx.beginPath();ctx.moveTo(zx,PAD.top);ctx.lineTo(zx-4,PAD.top+8);ctx.lineTo(zx+4,PAD.top+8);ctx.fill();}
    }
    // Tick labels
    ctx.font="11px 'JetBrains Mono',monospace"; ctx.fillStyle="rgba(129,140,248,0.5)";
    const xStep=(xMax-xMin)/5, yStep=(yMax-yMin)/5;
    ctx.textAlign="center";
    for(let v=Math.ceil(xMin/xStep)*xStep;v<=xMax+0.001;v+=xStep){const cv=toCX(v);if(Math.abs(v)<0.0001)continue;ctx.fillText(+v.toFixed(2),cv,PAD.top+PH+16);}
    ctx.textAlign="right";
    for(let v=Math.ceil(yMin/yStep)*yStep;v<=yMax+0.001;v+=yStep){const cv=toCY(v);if(Math.abs(v)<0.0001)continue;ctx.fillText(+v.toFixed(2),PAD.left-6,cv+4);}
    // Origin label
    ctx.fillStyle="rgba(129,140,248,0.35)"; ctx.textAlign="center"; ctx.fillText("0",PAD.left-6,PAD.top+PH+16);
    // Curves
    plots.forEach((plot,idx)=>{
      if(!plot.expr||!plot.visible) return;
      const col = plot.color||COLORS[idx%COLORS.length];
      ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.shadowColor=col; ctx.shadowBlur=7;
      ctx.beginPath();
      let pen=false, prevCY=null;
      const S=1000;
      for(let i=0;i<=S;i++){
        const x=xMin+(i/S)*(xMax-xMin);
        const y=evalSafe(plot.expr,{x});
        if(y===null||y<yMin*4||y>yMax*4){pen=false;prevCY=null;continue;}
        const cx=toCX(x),cy=toCY(y);
        if(prevCY!==null&&Math.abs(cy-prevCY)>PH*0.85){pen=false;}
        if(!pen){ctx.moveTo(cx,cy);pen=true;}else ctx.lineTo(cx,cy);
        prevCY=cy;
      }
      ctx.stroke(); ctx.shadowBlur=0;
      // Curve label
      const lx=xMax-(xMax-xMin)*0.03, ly=evalSafe(plot.expr,{x:lx});
      if(ly!==null&&ly>=yMin&&ly<=yMax){
        ctx.font="bold 11px 'Oxanium',sans-serif"; ctx.fillStyle=col; ctx.textAlign="right";
        ctx.fillText(plot.label||`f${idx+1}(x)`,toCX(lx)-2,toCY(ly)-7);
      }
    });
    // Border
    ctx.strokeStyle="rgba(99,102,241,0.2)"; ctx.lineWidth=1; ctx.shadowBlur=0;
    ctx.strokeRect(PAD.left,PAD.top,PW,PH);
  }, [plots,xMin,xMax,yMin,yMax,showGrid,showAxes,H]);

  const handleMove = e => {
    const c=canvasRef.current; if(!c) return;
    const rect=c.getBoundingClientRect();
    const cx=(e.clientX-rect.left)*(W/rect.width);
    const mx=toMX(cx);
    if(mx<xMin||mx>xMax){setTooltip(null);return;}
    const vals=plots.filter(p=>p.visible&&p.expr).map(p=>({label:p.label||p.expr,color:p.color,y:evalSafe(p.expr,{x:mx})})).filter(v=>v.y!==null);
    if(vals.length) setTooltip({x:mx,vals,px:e.clientX-rect.left});
    else setTooltip(null);
  };

  return (
    <div style={{position:"relative"}}>
      {onMaximize && (
        <button className="maxbtn" onClick={onMaximize} title="Maximize graph" style={{
          position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,
          background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",
          color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,
          cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s",
        }}>⤢ EXPAND</button>
      )}
      <canvas ref={canvasRef} width={W} height={H}
        style={{width:"100%",borderRadius:10,cursor:"crosshair",display:"block"}}
        onMouseMove={handleMove} onMouseLeave={()=>setTooltip(null)} />
      {tooltip&&(
        <div style={{position:"absolute",top:10,left:Math.min(tooltip.px+14,W*0.6),background:"rgba(7,9,26,0.97)",border:"1px solid rgba(99,102,241,0.45)",borderRadius:8,padding:"10px 14px",pointerEvents:"none",animation:"tooltipFade .15s ease",zIndex:20,minWidth:130}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(129,140,248,0.55)",marginBottom:5}}>x = {+tooltip.x.toFixed(4)}</div>
          {tooltip.vals.map((v,i)=><div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:v.color,marginBottom:2}}>{v.label} = {+v.y.toFixed(4)}</div>)}
        </div>
      )}
    </div>
  );
}

/* ════════ PARAMETRIC CANVAS ════════ */
function ParametricCanvas({ pts, color, onMaximize }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d"); const W=c.width,H=c.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    if(!pts.length) return;
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    const xMn=Math.min(...xs),xMx=Math.max(...xs),yMn=Math.min(...ys),yMx=Math.max(...ys);
    const pad=40,pw=W-pad*2,ph=H-pad*2;
    const tx=x=>pad+((x-xMn)/(xMx-xMn||1))*pw;
    const ty=y=>pad+ph-((y-yMn)/(yMx-yMn||1))*ph;
    // grid
    ctx.strokeStyle="rgba(99,102,241,0.09)"; ctx.lineWidth=1;
    for(let i=0;i<=8;i++){const x=pad+i/8*pw;ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,pad+ph);ctx.stroke();}
    for(let i=0;i<=6;i++){const y=pad+i/6*ph;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(pad+pw,y);ctx.stroke();}
    // axes through center
    ctx.strokeStyle="rgba(99,102,241,0.4)"; ctx.lineWidth=1.5;
    const zx=tx(0),zy=ty(0);
    if(zx>=pad&&zx<=pad+pw){ctx.beginPath();ctx.moveTo(zx,pad);ctx.lineTo(zx,pad+ph);ctx.stroke();}
    if(zy>=pad&&zy<=pad+ph){ctx.beginPath();ctx.moveTo(pad,zy);ctx.lineTo(pad+pw,zy);ctx.stroke();}
    // gradient stroke
    const grad=ctx.createLinearGradient(tx(xs[0]),ty(ys[0]),tx(xs[xs.length-1]),ty(ys[ys.length-1]));
    grad.addColorStop(0,color); grad.addColorStop(0.5,"#f472b6"); grad.addColorStop(1,color);
    ctx.strokeStyle=grad; ctx.lineWidth=2.5; ctx.shadowColor=color; ctx.shadowBlur=8;
    ctx.beginPath();
    pts.forEach(([x,y],i)=>{const cx=tx(x),cy=ty(y);i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);});
    ctx.stroke(); ctx.shadowBlur=0;
    // start/end dots
    ctx.fillStyle="#34d399"; ctx.beginPath(); ctx.arc(tx(xs[0]),ty(ys[0]),5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#f472b6"; ctx.beginPath(); ctx.arc(tx(xs[xs.length-1]),ty(ys[ys.length-1]),5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(99,102,241,0.18)"; ctx.lineWidth=1; ctx.shadowBlur=0; ctx.strokeRect(pad,pad,pw,ph);
  },[pts,color]);
  return (
    <div style={{position:"relative"}}>
      {onMaximize&&<button className="maxbtn" onClick={onMaximize} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>}
      <canvas ref={canvasRef} width={700} height={440} style={{width:"100%",borderRadius:10,display:"block"}}/>
    </div>
  );
}

/* ════════ POLAR CANVAS ════════ */
function PolarCanvas({ pts, color, onMaximize }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d"); const W=c.width,H=c.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    if(!pts.length) return;
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    const ext=Math.max(...xs.map(Math.abs),...ys.map(Math.abs))*1.25||1;
    const pad=44,cx=pad+(W-pad*2)/2,cy=pad+(H-pad*2)/2,r=(W-pad*2)/2;
    // polar grid circles
    ctx.strokeStyle="rgba(99,102,241,0.1)"; ctx.lineWidth=1;
    [0.25,0.5,0.75,1].forEach(f=>{ctx.beginPath();ctx.arc(cx,cy,r*f,0,Math.PI*2);ctx.stroke();});
    // spokes
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);ctx.stroke();}
    // labels
    ctx.fillStyle="rgba(129,140,248,0.4)"; ctx.font="10px 'JetBrains Mono',monospace"; ctx.textAlign="center";
    [0,90,180,270].forEach(deg=>{const rad=deg*Math.PI/180,rx=cx+Math.cos(rad)*(r+12),ry=cy-Math.sin(rad)*(r+12);ctx.fillText(deg+"°",rx,ry+4);});
    // axes
    ctx.strokeStyle="rgba(99,102,241,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(pad+(W-pad*2),cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,pad);ctx.lineTo(cx,pad+(H-pad*2));ctx.stroke();
    // curve with gradient
    const grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,"#818cf8"); grad.addColorStop(0.33,color); grad.addColorStop(0.66,"#34d399"); grad.addColorStop(1,"#818cf8");
    ctx.strokeStyle=grad; ctx.lineWidth=2.5; ctx.shadowColor=color; ctx.shadowBlur=10;
    ctx.beginPath();
    pts.forEach(([x,y],i)=>{const px=cx+x/ext*r,py=cy-y/ext*r;i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.stroke(); ctx.shadowBlur=0;
    ctx.strokeStyle="rgba(99,102,241,0.18)"; ctx.lineWidth=1; ctx.strokeRect(pad,pad,W-pad*2,H-pad*2);
  },[pts,color]);
  return (
    <div style={{position:"relative"}}>
      {onMaximize&&<button className="maxbtn" onClick={onMaximize} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>}
      <canvas ref={canvasRef} width={700} height={440} style={{width:"100%",borderRadius:10,display:"block"}}/>
    </div>
  );
}

/* ════════ SCATTER CANVAS ════════ */
function ScatterCanvas({ pts, color, onMaximize }) {
  const canvasRef=useRef(null);
  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d"); const W=c.width,H=c.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    if(!pts.length) return;
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    const xMn=Math.min(...xs),xMx=Math.max(...xs),yMn=Math.min(...ys),yMx=Math.max(...ys);
    const pad=50,pw=W-pad*2,ph=H-pad*2;
    const xR=xMx-xMn||1, yR=yMx-yMn||1;
    const tx=x=>pad+((x-xMn)/xR)*pw, ty=y=>pad+ph-((y-yMn)/yR)*ph;
    ctx.strokeStyle="rgba(99,102,241,0.09)"; ctx.lineWidth=1;
    for(let i=0;i<=8;i++){const x=pad+i/8*pw;ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,pad+ph);ctx.stroke();}
    for(let i=0;i<=6;i++){const y=pad+i/6*ph;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(pad+pw,y);ctx.stroke();}
    const zx=tx(0),zy=ty(0);
    ctx.strokeStyle="rgba(99,102,241,0.4)"; ctx.lineWidth=1.5;
    if(zx>=pad&&zx<=pad+pw){ctx.beginPath();ctx.moveTo(zx,pad);ctx.lineTo(zx,pad+ph);ctx.stroke();}
    if(zy>=pad&&zy<=pad+ph){ctx.beginPath();ctx.moveTo(pad,zy);ctx.lineTo(pad+pw,zy);ctx.stroke();}
    // Connect line
    ctx.strokeStyle="rgba(129,140,248,0.2)"; ctx.lineWidth=1;
    ctx.beginPath();
    pts.forEach(([x,y],i)=>{const cx=tx(x),cy=ty(y);i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);});
    ctx.stroke();
    // Points
    pts.forEach(([x,y],i)=>{
      const cx=tx(x),cy=ty(y);
      const c2=ctx.createRadialGradient(cx,cy,0,cx,cy,7);
      c2.addColorStop(0,"rgba(255,255,255,0.9)"); c2.addColorStop(1,color);
      ctx.fillStyle=c2; ctx.shadowColor=color; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle="rgba(165,180,252,0.6)"; ctx.font="10px 'JetBrains Mono',monospace"; ctx.textAlign="center";
      ctx.fillText(`(${+x.toFixed(1)},${+y.toFixed(1)})`,cx,cy-10);
    });
    ctx.strokeStyle="rgba(99,102,241,0.18)"; ctx.lineWidth=1; ctx.strokeRect(pad,pad,pw,ph);
  },[pts,color]);
  return (
    <div style={{position:"relative"}}>
      {onMaximize&&<button className="maxbtn" onClick={onMaximize} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>}
      <canvas ref={canvasRef} width={700} height={440} style={{width:"100%",borderRadius:10,display:"block"}}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   3D CANVAS — Wireframe surface z = f(x,y) with mouse orbit
════════════════════════════════════════════════════════════════ */
function Canvas3D({ expr, xRange, yRange, colorScheme, onMaximize, height = 480 }) {
  const canvasRef = useRef(null);
  const rotRef = useRef({ x: 0.45, y: 0.6 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#07091a"; ctx.fillRect(0, 0, W, H);

    const N = 36;
    const [xMn, xMx] = xRange, [yMn, yMx] = yRange;
    const rx = rotRef.current.x, ry = rotRef.current.y;
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);

    // Build grid of z values
    const zVals = [];
    let zMin = Infinity, zMax = -Infinity;
    for (let i = 0; i <= N; i++) {
      zVals[i] = [];
      for (let j = 0; j <= N; j++) {
        const x = xMn + (i / N) * (xMx - xMn);
        const y = yMn + (j / N) * (yMx - yMn);
        const z = evalSafe(expr, { x, y }) ?? 0;
        zVals[i][j] = z;
        if (z < zMin) zMin = z;
        if (z > zMax) zMax = z;
      }
    }
    const zRange = zMax - zMin || 1;

    // Project 3D → 2D
    const scale = Math.min(W, H) * 0.38;
    const project = (x, y, z) => {
      // Normalize to [-1,1]
      const nx = (x - (xMn + xMx) / 2) / ((xMx - xMn) / 2);
      const ny = (y - (yMn + yMx) / 2) / ((yMx - yMn) / 2);
      const nz = (z - (zMin + zMax) / 2) / (zRange / 2) * 0.7;
      // Rotate Y
      const x2 = nx * cosY - nz * sinY;
      const z2 = nx * sinY + nz * cosY;
      // Rotate X
      const y3 = ny * cosX - z2 * sinX;
      const z3 = ny * sinX + z2 * cosX;
      const persp = 1 / (1 + z3 * 0.35 + 1.4);
      return [W / 2 + x2 * scale * persp, H / 2 + y3 * scale * persp, z3, (z - zMin) / zRange];
    };

    // Draw grid patches (sorted by depth)
    const patches = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x0 = xMn + (i / N) * (xMx - xMn);
        const y0 = yMn + (j / N) * (yMx - yMn);
        const x1 = xMn + ((i + 1) / N) * (xMx - xMn);
        const y1 = yMn + ((j + 1) / N) * (yMx - yMn);
        const z00 = zVals[i][j], z10 = zVals[i+1][j], z01 = zVals[i][j+1], z11 = zVals[i+1][j+1];
        const avgZ = (z00+z10+z01+z11)/4;
        const p00 = project(x0,y0,z00), p10 = project(x1,y0,z10), p01 = project(x0,y1,z01), p11 = project(x1,y1,z11);
        const avgDepth = (p00[2]+p10[2]+p01[2]+p11[2])/4;
        const normColor = (avgZ-zMin)/zRange;
        patches.push({ pts:[p00,p10,p11,p01], depth:avgDepth, t:normColor });
      }
    }
    patches.sort((a,b)=>b.depth-a.depth);

    // Color schemes
    const getColor = (t, alpha=1) => {
      const schemes = {
        plasma: [[7,0,96],[100,0,250],[239,88,33],[252,232,32]],
        viridis: [[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]],
        inferno: [[0,0,4],[120,28,109],[229,92,45],[252,255,164]],
        cool: [[0,255,255],[255,0,255]],
        neon: [[99,102,241],[52,211,153],[244,114,182],[251,146,60]],
      };
      const stops = schemes[colorScheme] || schemes.plasma;
      const idx = t * (stops.length - 1);
      const lo = Math.floor(idx), hi = Math.min(lo + 1, stops.length - 1);
      const frac = idx - lo;
      const r = stops[lo][0] + (stops[hi][0]-stops[lo][0])*frac;
      const g = stops[lo][1] + (stops[hi][1]-stops[lo][1])*frac;
      const b = stops[lo][2] + (stops[hi][2]-stops[lo][2])*frac;
      return `rgba(${r|0},${g|0},${b|0},${alpha})`;
    };

    // Draw patches
    patches.forEach(({ pts, t }) => {
      const [p00,p10,p11,p01] = pts;
      ctx.beginPath();
      ctx.moveTo(p00[0],p00[1]);
      ctx.lineTo(p10[0],p10[1]);
      ctx.lineTo(p11[0],p11[1]);
      ctx.lineTo(p01[0],p01[1]);
      ctx.closePath();
      ctx.fillStyle = getColor(t, 0.72);
      ctx.fill();
      ctx.strokeStyle = getColor(t, 0.3);
      ctx.lineWidth = 0.4;
      ctx.stroke();
    });

    // Axis lines
    const ax = (x,y,z) => project(x,y,z);
    const axLen = 1.2;
    const axMidX=(xMn+xMx)/2, axMidY=(yMn+yMx)/2, axMidZ=(zMin+zMax)/2;
    const axPairs = [
      [ax(xMn,axMidY,axMidZ),ax(xMx,axMidY,axMidZ),"#818cf8","X"],
      [ax(axMidX,yMn,axMidZ),ax(axMidX,yMx,axMidZ),"#34d399","Y"],
      [ax(axMidX,axMidY,zMin),ax(axMidX,axMidY,zMax),"#f472b6","Z"],
    ];
    axPairs.forEach(([s,e,col,lbl])=>{
      ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.shadowColor=col; ctx.shadowBlur=4;
      ctx.beginPath(); ctx.moveTo(s[0],s[1]); ctx.lineTo(e[0],e[1]); ctx.stroke();
      ctx.shadowBlur=0;
      ctx.fillStyle=col; ctx.font="bold 12px 'Oxanium',sans-serif"; ctx.textAlign="center";
      ctx.fillText(lbl,e[0],e[1]-6);
    });

    // Label
    ctx.fillStyle="rgba(129,140,248,0.45)"; ctx.font="11px 'JetBrains Mono',monospace"; ctx.textAlign="left";
    ctx.fillText(`z = ${expr}`,12,H-12);
    ctx.textAlign="right";
    ctx.fillText("drag to rotate",W-12,H-12);

    // Color bar
    const barH=120, barW=12, barX=W-30, barY=(H-barH)/2;
    for(let i=0;i<barH;i++){ctx.fillStyle=getColor(1-i/barH,0.85);ctx.fillRect(barX,barY+i,barW,1);}
    ctx.strokeStyle="rgba(99,102,241,0.3)"; ctx.lineWidth=1; ctx.strokeRect(barX,barY,barW,barH);
    ctx.fillStyle="rgba(129,140,248,0.55)"; ctx.font="9px 'JetBrains Mono',monospace"; ctx.textAlign="left";
    ctx.fillText(+zMax.toFixed(2),barX+barW+4,barY+8);
    ctx.fillText(+zMin.toFixed(2),barX+barW+4,barY+barH);
  }, [expr, xRange, yRange, colorScheme]);

  useEffect(()=>{
    draw();
    return ()=>cancelAnimationFrame(animRef.current);
  },[draw]);

  const onMouseDown = e=>{dragging.current=true;lastPos.current={x:e.clientX,y:e.clientY};};
  const onMouseMove = e=>{
    if(!dragging.current) return;
    const dx=e.clientX-lastPos.current.x, dy=e.clientY-lastPos.current.y;
    rotRef.current.y += dx*0.008;
    rotRef.current.x += dy*0.008;
    rotRef.current.x = Math.max(-Math.PI/2+0.05, Math.min(Math.PI/2-0.05, rotRef.current.x));
    lastPos.current={x:e.clientX,y:e.clientY};
    draw();
  };
  const onMouseUp = ()=>{dragging.current=false;};
  const onTouchStart = e=>{const t=e.touches[0];dragging.current=true;lastPos.current={x:t.clientX,y:t.clientY};};
  const onTouchMove = e=>{
    if(!dragging.current) return; e.preventDefault();
    const t=e.touches[0];
    const dx=t.clientX-lastPos.current.x, dy=t.clientY-lastPos.current.y;
    rotRef.current.y+=dx*0.01; rotRef.current.x+=dy*0.01;
    lastPos.current={x:t.clientX,y:t.clientY}; draw();
  };
  const onTouchEnd=()=>{dragging.current=false;};

  return (
    <div style={{position:"relative",userSelect:"none"}}>
      {onMaximize&&(
        <button className="maxbtn" onClick={onMaximize} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>
      )}
      <canvas ref={canvasRef} width={700} height={height}
        style={{width:"100%",borderRadius:10,cursor:"grab",display:"block",touchAction:"none"}}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FULLSCREEN MODAL
════════════════════════════════════════════════════════════════ */
function FullscreenModal({ children, onClose, title }) {
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return ()=>{document.body.style.overflow="";};
  },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(5,7,15,0.96)",display:"flex",flexDirection:"column",padding:16,animation:"modalIn 0.25s ease"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexShrink:0}}>
        <span style={{fontFamily:"'Oxanium',sans-serif",fontSize:13,fontWeight:700,color:"#a5b4fc",letterSpacing:"0.15em"}}>{title}</span>
        <button onClick={onClose} style={{padding:"6px 16px",borderRadius:8,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171",fontFamily:"'JetBrains Mono',monospace",fontSize:11,cursor:"pointer",letterSpacing:"0.1em"}}>✕ CLOSE</button>
      </div>
      {/* Graph fills remaining space */}
      <div style={{flex:1,overflow:"hidden",borderRadius:12,border:"1px solid rgba(99,102,241,0.2)"}}>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   GRAPH SECTION COMPONENT
════════════════════════════════════════════════════════════════ */
const GRAPH_TYPES = [
  { id:"function",   icon:"ƒ(x)",  label:"2D Function" },
  { id:"multi",      icon:"ƒⁿ",    label:"Multi-Plot" },
  { id:"parametric", icon:"(t)",   label:"Parametric" },
  { id:"polar",      icon:"r(θ)",  label:"Polar" },
  { id:"scatter",    icon:"·̣·",   label:"Scatter" },
  { id:"surface3d",  icon:"3D",    label:"3D Surface" },
  { id:"contour",    icon:"⊙",     label:"Contour" },
  { id:"vector",     icon:"→",     label:"Vector Field" },
];

const PRESETS_2D = [
  { label:"x²",       exprs:["x^2"],                       xMn:-5,xMx:5,yMn:-2,yMx:12 },
  { label:"x³-3x",    exprs:["x^3-3*x"],                   xMn:-3,xMx:3,yMn:-6,yMx:6 },
  { label:"sin(x)",   exprs:["sin(x)"],                     xMn:-7,xMx:7,yMn:-2,yMx:2 },
  { label:"sin+cos",  exprs:["sin(x)","cos(x)"],            xMn:-7,xMx:7,yMn:-2,yMx:2 },
  { label:"eˣ",       exprs:["e^x"],                        xMn:-3,xMx:3,yMn:0,yMx:12 },
  { label:"ln(x)",    exprs:["log(x)"],                     xMn:0.1,xMx:8,yMn:-2,yMx:3 },
  { label:"1/x",      exprs:["1/x"],                        xMn:-4,xMx:4,yMn:-6,yMx:6 },
  { label:"|x|",      exprs:["abs(x)"],                     xMn:-5,xMx:5,yMn:-1,yMx:6 },
  { label:"sin·e⁻ˣ", exprs:["sin(x)*e^(-x/4)"],            xMn:0,xMx:14,yMn:-1.2,yMx:1.2 },
  { label:"x²+deriv", exprs:["x^2","2*x"],                  xMn:-5,xMx:5,yMn:-6,yMx:12 },
  { label:"√x vs x²", exprs:["sqrt(x)","x^2"],              xMn:0,xMx:3,yMn:0,yMx:5 },
  { label:"tan(x)",   exprs:["tan(x)"],                     xMn:-1.4,xMx:1.4,yMn:-8,yMx:8 },
];

const PRESETS_3D = [
  { label:"Saddle",      expr:"x^2-y^2",        xR:[-3,3],yR:[-3,3] },
  { label:"Paraboloid",  expr:"x^2+y^2",        xR:[-3,3],yR:[-3,3] },
  { label:"Waves",       expr:"sin(x)*cos(y)",  xR:[-4,4],yR:[-4,4] },
  { label:"Ripple",      expr:"sin(sqrt(x^2+y^2))", xR:[-6,6],yR:[-6,6] },
  { label:"Gaussian",    expr:"e^(-(x^2+y^2)/2)",   xR:[-3,3],yR:[-3,3] },
  { label:"Monkey Saddle",expr:"x^3-3*x*y^2",   xR:[-2,2],yR:[-2,2] },
  { label:"Valley",      expr:"x^2-y^3",        xR:[-2,2],yR:[-2,2] },
  { label:"Trig Bowl",   expr:"sin(x)+cos(y)",  xR:[-4,4],yR:[-4,4] },
];

const PARAM_PRESETS = [
  { label:"Circle",       x:"cos(t)",              y:"sin(t)",              t1:0,   t2:6.28 },
  { label:"Lissajous 2:3",x:"sin(2*t)",            y:"sin(3*t)",            t1:0,   t2:6.28 },
  { label:"Spiral",       x:"t*cos(t)",            y:"t*sin(t)",            t1:0,   t2:12.56 },
  { label:"Epitrochoid",  x:"cos(t)-cos(5*t)/2",   y:"sin(t)-sin(5*t)/2",  t1:0,   t2:6.28 },
  { label:"Figure-8",     x:"sin(t)",              y:"sin(2*t)",            t1:0,   t2:6.28 },
  { label:"Hypotrochoid", x:"2*cos(t)+cos(2*t)",   y:"2*sin(t)-sin(2*t)",  t1:0,   t2:6.28 },
  { label:"Butterfly",    x:"sin(t)*(e^cos(t)-2*cos(4*t))", y:"cos(t)*(e^cos(t)-2*cos(4*t))", t1:0, t2:12.56 },
  { label:"Astroid",      x:"cos(t)^3",            y:"sin(t)^3",            t1:0,   t2:6.28 },
];

const POLAR_PRESETS = [
  { label:"Cardioid",     r:"1+cos(theta)" },
  { label:"Rose 3",       r:"cos(3*theta)" },
  { label:"Rose 4",       r:"cos(2*theta)" },
  { label:"Lemniscate",   r:"sqrt(abs(cos(2*theta)))" },
  { label:"Archimedean",  r:"theta/6" },
  { label:"Limaçon",      r:"0.5+cos(theta)" },
  { label:"Spiral",       r:"theta/4" },
  { label:"Rhodonea",     r:"sin(4*theta)" },
];

const COLOR_SCHEMES = ["plasma","viridis","inferno","cool","neon"];

function GraphSection({ card, mono, display, sectionLabel, inputSt }) {
  const [gtype, setGtype] = useState("function");
  const [plots, setPlots] = useState([{id:1,expr:"sin(x)",label:"f(x)",color:COLORS[0],visible:true}]);
  const [xMn,setXMn] = useState(-7), [xMx,setXMx] = useState(7);
  const [yMn,setYMn] = useState(-2), [yMx,setYMx] = useState(2);
  const [grid,setGrid] = useState(true), [axes,setAxes] = useState(true);
  const [activePreset,setActivePreset] = useState("sin(x)");
  // Parametric
  const [paramX,setParamX] = useState("cos(t)"), [paramY,setParamY] = useState("sin(t)");
  const [tMn,setTMn] = useState(0), [tMx,setTMx] = useState(6.28);
  // Polar
  const [polarR,setPolarR] = useState("1+cos(theta)");
  // Scatter
  const [scatterRaw,setScatterRaw] = useState("0,0\n1,1\n2,4\n3,9\n4,16\n5,25");
  // 3D
  const [expr3d,setExpr3d] = useState("sin(x)*cos(y)");
  const [x3R,setX3R] = useState([-4,4]), [y3R,setY3R] = useState([-4,4]);
  const [colorScheme,setColorScheme] = useState("plasma");
  // Contour
  const [contourExpr,setContourExpr] = useState("x^2+y^2");
  // Vector field
  const [vfP,setVfP] = useState("y"), [vfQ,setVfQ] = useState("-x");
  // Fullscreen
  const [fullscreen,setFullscreen] = useState(false);
  const nextId = useRef(2);

  const addPlot = ()=>{ setPlots(p=>[...p,{id:nextId.current++,expr:"",label:`f${nextId.current}(x)`,color:COLORS[(plots.length)%COLORS.length],visible:true}]); };
  const updatePlot = (id,k,v) => setPlots(p=>p.map(pl=>pl.id===id?{...pl,[k]:v}:pl));
  const removePlot = id => setPlots(p=>p.filter(pl=>pl.id!==id));

  const applyPreset = p => {
    setPlots(p.exprs.map((e,i)=>({id:i+1,expr:e,label:`f${i+1}(x)`,color:COLORS[i],visible:true})));
    setXMn(p.xMn);setXMx(p.xMx);setYMn(p.yMn);setYMx(p.yMx);
    setActivePreset(p.label);
  };

  const paramPts = useMemo(()=>{
    const pts=[]; const S=800;
    for(let i=0;i<=S;i++){
      const t=tMn+(i/S)*(tMx-tMn);
      const x=evalSafe(paramX,{t,pi:Math.PI});
      const y=evalSafe(paramY,{t,pi:Math.PI});
      if(x!==null&&y!==null) pts.push([x,y]);
    }
    return pts;
  },[paramX,paramY,tMn,tMx]);

  const polarPts = useMemo(()=>{
    const pts=[]; const S=1200;
    for(let i=0;i<=S;i++){
      const theta=(i/S)*Math.PI*2;
      const r=evalSafe(polarR,{theta,pi:Math.PI});
      if(r!==null) pts.push([r*Math.cos(theta),r*Math.sin(theta)]);
    }
    return pts;
  },[polarR]);

  const scatterPts = useMemo(()=>scatterRaw.trim().split("\n").map(l=>l.trim().split(/[,\s]+/).map(Number)).filter(p=>p.length===2&&!p.some(isNaN)),[scatterRaw]);

  // Contour canvas
  const contourRef = useRef(null);
  useEffect(()=>{
    if(gtype!=="contour") return;
    const canvas=contourRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    const N=180;
    const xMnC=-4,xMxC=4,yMnC=-4,yMxC=4;
    const imgData=ctx.createImageData(N,N);
    let zMn=Infinity,zMx=-Infinity;
    const grid2d=[];
    for(let i=0;i<N;i++){grid2d[i]=[];for(let j=0;j<N;j++){const x=xMnC+(i/N)*(xMxC-xMnC);const y=yMnC+(j/N)*(yMxC-yMnC);const z=evalSafe(contourExpr,{x,y})??0;grid2d[i][j]=z;if(z<zMn)zMn=z;if(z>zMx)zMx=z;}}
    const zR=zMx-zMn||1;
    for(let i=0;i<N;i++){for(let j=0;j<N;j++){const t=(grid2d[i][j]-zMn)/zR;const r=t<0.5?2*t*99+(1-2*t)*7:2*(t-0.5)*252+(1-2*(t-0.5))*99;const g=t<0.5?2*t*0+(1-2*t)*0:2*(t-0.5)*232+(1-2*(t-0.5))*0;const b=t<0.5?2*t*128+(1-2*t)*96:2*(t-0.5)*32+(1-2*(t-0.5))*128;const idx=(j*N+i)*4;imgData.data[idx]=r|0;imgData.data[idx+1]=g|0;imgData.data[idx+2]=b|0;imgData.data[idx+3]=200;}}
    // Scale up
    const tmpCanvas=document.createElement("canvas"); tmpCanvas.width=N; tmpCanvas.height=N;
    tmpCanvas.getContext("2d").putImageData(imgData,0,0);
    const PAD=40,PW=W-PAD*2,PH=H-PAD*2;
    ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality="high";
    ctx.drawImage(tmpCanvas,PAD,PAD,PW,PH);
    // Contour lines
    const levels=8;
    for(let l=0;l<levels;l++){
      const zLevel=zMn+(l/(levels-1))*zR;
      ctx.strokeStyle=`rgba(255,255,255,${0.25+l/levels*0.3})`; ctx.lineWidth=0.8;
      const toCX=x=>PAD+((x-xMnC)/(xMxC-xMnC))*PW;
      const toCY=y=>PAD+PH-((y-yMnC)/(yMxC-yMnC))*PH;
      for(let i=0;i<N-1;i++){for(let j=0;j<N-1;j++){const z00=grid2d[i][j],z10=grid2d[i+1][j],z01=grid2d[i][j+1];const x0=xMnC+(i/N)*(xMxC-xMnC),x1=xMnC+((i+1)/N)*(xMxC-xMnC),y0=yMnC+(j/N)*(yMxC-yMnC),y1=yMnC+((j+1)/N)*(yMxC-yMnC);if((z00<zLevel&&z10>=zLevel)||(z00>=zLevel&&z10<zLevel)){ctx.beginPath();const fx=(zLevel-z00)/(z10-z00);ctx.moveTo(toCX(x0+fx*(x1-x0)),toCY(y0));ctx.lineTo(toCX(x0),toCY(y0+0.5*(y1-y0)));ctx.stroke();}}}
    }
    // Grid overlay
    ctx.strokeStyle="rgba(99,102,241,0.2)"; ctx.lineWidth=1; ctx.strokeRect(PAD,PAD,PW,PH);
    ctx.fillStyle="rgba(129,140,248,0.5)"; ctx.font="11px 'JetBrains Mono',monospace"; ctx.textAlign="center";
    ctx.fillText(`z = ${contourExpr}  |  zmin=${+zMn.toFixed(2)}  zmax=${+zMx.toFixed(2)}`,W/2,H-8);
  },[gtype,contourExpr]);

  // Vector field canvas
  const vfRef = useRef(null);
  useEffect(()=>{
    if(gtype!=="vector") return;
    const canvas=vfRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle="#07091a"; ctx.fillRect(0,0,W,H);
    const xMnV=-4,xMxV=4,yMnV=-4,yMxV=4;
    const PAD=40,PW=W-PAD*2,PH=H-PAD*2;
    const toCX=x=>PAD+((x-xMnV)/(xMxV-xMnV))*PW;
    const toCY=y=>PAD+PH-((y-yMnV)/(yMxV-yMnV))*PH;
    // Grid
    ctx.strokeStyle="rgba(99,102,241,0.08)"; ctx.lineWidth=1;
    for(let i=0;i<=10;i++){const x=PAD+i/10*PW;ctx.beginPath();ctx.moveTo(x,PAD);ctx.lineTo(x,PAD+PH);ctx.stroke();}
    for(let i=0;i<=8;i++){const y=PAD+i/8*PH;ctx.beginPath();ctx.moveTo(PAD,y);ctx.lineTo(PAD+PW,y);ctx.stroke();}
    // Axes
    ctx.strokeStyle="rgba(99,102,241,0.45)"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(PAD,toCY(0));ctx.lineTo(PAD+PW,toCY(0));ctx.stroke();
    ctx.beginPath();ctx.moveTo(toCX(0),PAD);ctx.lineTo(toCX(0),PAD+PH);ctx.stroke();
    // Vectors
    const GN=18;
    for(let i=0;i<=GN;i++){for(let j=0;j<=GN;j++){
      const x=xMnV+(i/GN)*(xMxV-xMnV), y=yMnV+(j/GN)*(yMxV-yMnV);
      const p=evalSafe(vfP,{x,y})??0, q=evalSafe(vfQ,{x,y})??0;
      const mag=Math.sqrt(p*p+q*q)||1;
      const scale=0.22*(xMxV-xMnV)/GN*(PW/((xMxV-xMnV)));
      const t=Math.min(mag/2,1);
      const r=t<0.5?99+2*t*(251-99):(251);
      const gb=t<0.5?130-2*t*130:0;
      const alpha=0.4+t*0.6;
      const cx=toCX(x), cy=toCY(y);
      const ex=cx+(p/mag)*scale, ey=cy-(q/mag)*scale;
      ctx.strokeStyle=`rgba(${r},${gb},${200-t*150},${alpha})`; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(ex,ey); ctx.stroke();
      // Arrow head
      const angle=Math.atan2(ey-cy,ex-cx);
      ctx.fillStyle=`rgba(${r},${gb},${200-t*150},${alpha})`;
      ctx.beginPath();
      ctx.moveTo(ex,ey);
      ctx.lineTo(ex-6*Math.cos(angle-0.4),ey-6*Math.sin(angle-0.4));
      ctx.lineTo(ex-6*Math.cos(angle+0.4),ey-6*Math.sin(angle+0.4));
      ctx.fill();
    }}
    ctx.strokeStyle="rgba(99,102,241,0.2)"; ctx.lineWidth=1; ctx.strokeRect(PAD,PAD,PW,PH);
    ctx.fillStyle="rgba(129,140,248,0.5)"; ctx.font="11px 'JetBrains Mono',monospace"; ctx.textAlign="center";
    ctx.fillText(`P(x,y)=${vfP}  Q(x,y)=${vfQ}`,W/2,H-8);
  },[gtype,vfP,vfQ]);

  // Build fullscreen content
  const renderFullscreen = () => {
    switch(gtype) {
      case "function": case "multi":
        return <Canvas2D plots={plots} xMin={xMn} xMax={xMx} yMin={yMn} yMax={yMx} showGrid={grid} showAxes={axes} height={window.innerHeight-100} />;
      case "parametric":
        return <ParametricCanvas pts={paramPts} color={COLORS[0]} />;
      case "polar":
        return <PolarCanvas pts={polarPts} color={COLORS[2]} />;
      case "scatter":
        return <ScatterCanvas pts={scatterPts} color={COLORS[3]} />;
      case "surface3d":
        return <Canvas3D expr={expr3d} xRange={x3R} yRange={y3R} colorScheme={colorScheme} height={window.innerHeight-100} />;
      case "contour":
        return <canvas ref={contourRef} width={900} height={600} style={{width:"100%",height:"100%",borderRadius:10}} />;
      case "vector":
        return <canvas ref={vfRef} width={900} height={600} style={{width:"100%",height:"100%",borderRadius:10}} />;
      default: return null;
    }
  };

  const btnSt = (active) => ({
    padding:"6px 13px", borderRadius:7, cursor:"pointer", transition:"all 0.2s",
    background: active?"rgba(99,102,241,0.22)":"rgba(99,102,241,0.06)",
    border:`1px solid ${active?"rgba(99,102,241,0.6)":"rgba(99,102,241,0.15)"}`,
    color: active?"#a5b4fc":"rgba(129,140,248,0.5)",
    fontFamily:"'Oxanium',sans-serif", fontSize:11, fontWeight:600,
  });
  const toggleSt = (on) => ({
    padding:"5px 12px", borderRadius:6, cursor:"pointer", transition:"all 0.2s",
    background: on?"rgba(99,102,241,0.18)":"transparent",
    border:`1px solid ${on?"rgba(99,102,241,0.5)":"rgba(99,102,241,0.18)"}`,
    color: on?"#a5b4fc":"rgba(99,102,241,0.38)",
    fontFamily:"'JetBrains Mono',monospace", fontSize:10,
  });

  return (
    <section style={{...card, padding:"32px 26px", marginTop:28, animation:"fadeUp 0.6s ease"}}>
      {fullscreen && (
        <FullscreenModal onClose={()=>setFullscreen(false)} title={`CALC∷NEXUS — ${GRAPH_TYPES.find(g=>g.id===gtype)?.label} Graph`}>
          {renderFullscreen()}
        </FullscreenModal>
      )}

      {/* Section Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{...sectionLabel,marginBottom:6}}>◈ GRAPH VISUALIZATION ENGINE</div>
          <h2 style={{fontFamily:"'Oxanium',sans-serif",fontSize:22,fontWeight:700,color:"#c7d2fe"}}>Interactive Math Graphs</h2>
          <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"rgba(165,180,252,0.5)",marginTop:4}}>2D · Parametric · Polar · Scatter · 3D Surface · Contour · Vector Field · Drag to orbit 3D · Click ⤢ to expand</p>
        </div>
        <button className="maxbtn" onClick={()=>setFullscreen(true)} style={{padding:"8px 16px",borderRadius:8,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.35)",color:"#a5b4fc",fontFamily:"'Oxanium',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:"0.12em",transition:"all 0.2s"}}>⤢ FULLSCREEN</button>
      </div>

      {/* Graph type tabs */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:22,padding:"10px",background:"rgba(99,102,241,0.03)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:10}}>
        {GRAPH_TYPES.map(gt=>(
          <button key={gt.id} className="gtb" onClick={()=>setGtype(gt.id)} style={btnSt(gtype===gt.id)}>
            <span style={{marginRight:4,fontSize:12}}>{gt.icon}</span>{gt.label}
          </button>
        ))}
      </div>

      {/* ── 2D FUNCTION ── */}
      {(gtype==="function"||gtype==="multi") && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:8}}>Quick Presets</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {PRESETS_2D.map(p=>(
                <button key={p.label} className="ec" onClick={()=>applyPreset(p)} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:activePreset===p.label?"rgba(99,102,241,0.2)":"transparent",border:`1px solid ${activePreset===p.label?"rgba(99,102,241,0.55)":"rgba(99,102,241,0.18)"}`,color:activePreset===p.label?"#c7d2fe":"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p.label}</button>
              ))}
            </div>
          </div>
          {/* Plot rows */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {plots.map((pl,i)=>(
              <div key={pl.id} style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:pl.color,flexShrink:0,boxShadow:`0 0 8px ${pl.color}`}}/>
                <input value={pl.expr} onChange={e=>updatePlot(pl.id,"expr",e.target.value)} placeholder={`f${i+1}(x) = e.g. sin(x)`} className="si" style={{...inputSt,flex:1,fontSize:14,padding:"9px 14px"}}/>
                <input value={pl.label} onChange={e=>updatePlot(pl.id,"label",e.target.value)} className="si" style={{...inputSt,width:60,fontSize:12,padding:"9px 10px"}}/>
                <button className="gb" onClick={()=>updatePlot(pl.id,"visible",!pl.visible)} style={{width:32,height:32,borderRadius:6,border:"1px solid rgba(99,102,241,0.2)",background:pl.visible?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.04)",color:pl.visible?"#a5b4fc":"rgba(99,102,241,0.25)",cursor:"pointer",fontSize:13}}>◎</button>
                {plots.length>1&&<button onClick={()=>removePlot(pl.id)} style={{width:32,height:32,borderRadius:6,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.06)",color:"rgba(239,68,68,0.55)",cursor:"pointer",fontSize:15}}>×</button>}
              </div>
            ))}
            <button onClick={addPlot} style={{alignSelf:"flex-start",padding:"5px 14px",borderRadius:6,border:"1px dashed rgba(99,102,241,0.3)",background:"transparent",color:"rgba(99,102,241,0.55)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>+ ADD FUNCTION</button>
          </div>
          {/* Range */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
            {[["X Min",xMn,setXMn],["X Max",xMx,setXMx],["Y Min",yMn,setYMn],["Y Max",yMx,setYMx]].map(([l,v,s])=>(
              <div key={l}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",letterSpacing:"0.2em",marginBottom:4}}>{l}</div><input type="number" value={v} onChange={e=>s(parseFloat(e.target.value)||0)} className="si" style={{...inputSt,padding:"7px 10px",fontSize:13}}/></div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            <button className="gb" onClick={()=>setGrid(g=>!g)} style={toggleSt(grid)}>{grid?"✓":""} Grid</button>
            <button className="gb" onClick={()=>setAxes(a=>!a)} style={toggleSt(axes)}>{axes?"✓":""} Axes</button>
          </div>
          <Canvas2D plots={plots} xMin={xMn} xMax={xMx} yMin={yMn} yMax={yMx} showGrid={grid} showAxes={axes} onMaximize={()=>setFullscreen(true)}/>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:12}}>
            {plots.filter(p=>p.expr&&p.visible).map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:22,height:3,borderRadius:2,background:p.color,boxShadow:`0 0 5px ${p.color}`}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(165,180,252,0.65)"}}>{p.label} = {p.expr}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PARAMETRIC ── */}
      {gtype==="parametric" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>Parametric — x(t) and y(t)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>X(t)</div><input value={paramX} onChange={e=>setParamX(e.target.value)} className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>Y(t)</div><input value={paramY} onChange={e=>setParamY(e.target.value)} className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>t Min</div><input type="number" value={tMn} onChange={e=>setTMn(parseFloat(e.target.value)||0)} className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>t Max</div><input type="number" value={tMx} onChange={e=>setTMx(parseFloat(e.target.value)||6.28)} className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {PARAM_PRESETS.map(p=><button key={p.label} className="ec" onClick={()=>{setParamX(p.x);setParamY(p.y);setTMn(p.t1);setTMx(p.t2);}} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p.label}</button>)}
            </div>
          </div>
          <ParametricCanvas pts={paramPts} color={COLORS[0]} onMaximize={()=>setFullscreen(true)}/>
          <div style={{marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(99,102,241,0.4)",letterSpacing:"0.15em"}}>● START  ● END  — {paramPts.length} points plotted</div>
        </>
      )}

      {/* ── POLAR ── */}
      {gtype==="polar" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>Polar — r(θ)</div>
            <input value={polarR} onChange={e=>setPolarR(e.target.value)} placeholder="1+cos(theta)" className="si" style={{...inputSt,fontSize:14,padding:"9px 14px",marginBottom:10}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {POLAR_PRESETS.map(p=><button key={p.label} className="ec" onClick={()=>setPolarR(p.r)} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p.label}</button>)}
            </div>
          </div>
          <PolarCanvas pts={polarPts} color={COLORS[2]} onMaximize={()=>setFullscreen(true)}/>
        </>
      )}

      {/* ── SCATTER ── */}
      {gtype==="scatter" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>Scatter Plot — one x,y per line</div>
            <textarea value={scatterRaw} onChange={e=>setScatterRaw(e.target.value)} rows={6} className="si" style={{...inputSt,resize:"vertical",lineHeight:1.7,fontSize:13,padding:"10px 14px",marginBottom:8}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {[{l:"Quadratic",d:"0,0\n1,1\n2,4\n3,9\n4,16\n5,25"},{l:"Linear",d:"0,1\n1,3\n2,5\n3,7\n4,9"},{l:"Sine Samples",d:"0,0\n0.78,0.7\n1.57,1\n2.36,0.7\n3.14,0\n3.93,-0.7\n4.71,-1"}].map(p=><button key={p.l} className="ec" onClick={()=>setScatterRaw(p.d)} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p.l}</button>)}
            </div>
          </div>
          <ScatterCanvas pts={scatterPts} color={COLORS[3]} onMaximize={()=>setFullscreen(true)}/>
          <div style={{marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(99,102,241,0.4)",letterSpacing:"0.15em"}}>{scatterPts.length} DATA POINTS</div>
        </>
      )}

      {/* ── 3D SURFACE ── */}
      {gtype==="surface3d" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>3D Surface — z = f(x, y) · Drag to orbit</div>
            <input value={expr3d} onChange={e=>setExpr3d(e.target.value)} placeholder="sin(x)*cos(y)" className="si" style={{...inputSt,fontSize:15,padding:"10px 16px",marginBottom:10}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[["X Min",x3R[0],v=>setX3R(r=>[v,r[1]])],["X Max",x3R[1],v=>setX3R(r=>[r[0],v])],["Y Min",y3R[0],v=>setY3R(r=>[v,r[1]])],["Y Max",y3R[1],v=>setY3R(r=>[r[0],v])]].map(([l,v,s])=>(
                <div key={l}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>{l}</div><input type="number" value={v} onChange={e=>s(parseFloat(e.target.value)||0)} className="si" style={{...inputSt,padding:"7px 10px",fontSize:13}}/></div>
              ))}
            </div>
            {/* Presets */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {PRESETS_3D.map(p=><button key={p.label} className="ec" onClick={()=>{setExpr3d(p.expr);setX3R(p.xR);setY3R(p.yR);}} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p.label}</button>)}
            </div>
            {/* Color scheme */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",letterSpacing:"0.2em"}}>COLOR:</span>
              {COLOR_SCHEMES.map(s=><button key={s} className="gb" onClick={()=>setColorScheme(s)} style={{...toggleSt(colorScheme===s),textTransform:"uppercase",letterSpacing:"0.1em"}}>{s}</button>)}
            </div>
          </div>
          <Canvas3D expr={expr3d} xRange={x3R} yRange={y3R} colorScheme={colorScheme} height={460} onMaximize={()=>setFullscreen(true)}/>
          <div style={{marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(99,102,241,0.4)",letterSpacing:"0.15em"}}>🖱 DRAG TO ROTATE · TOUCH SUPPORTED · COLOR BAR = Z VALUE RANGE</div>
        </>
      )}

      {/* ── CONTOUR ── */}
      {gtype==="contour" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>Contour Map — z = f(x, y)</div>
            <input value={contourExpr} onChange={e=>setContourExpr(e.target.value)} placeholder="x^2+y^2" className="si" style={{...inputSt,fontSize:15,padding:"10px 16px",marginBottom:10}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {[["Paraboloid","x^2+y^2"],["Saddle","x^2-y^2"],["Waves","sin(x)*cos(y)"],["Ripple","sin(sqrt(x^2+y^2))"],["Gaussian","e^(-(x^2+y^2)/2)"]].map(([l,e])=><button key={l} className="ec" onClick={()=>setContourExpr(e)} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{l}</button>)}
            </div>
          </div>
          <div style={{position:"relative"}}>
            <button className="maxbtn" onClick={()=>setFullscreen(true)} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>
            <canvas ref={contourRef} width={700} height={440} style={{width:"100%",borderRadius:10,display:"block"}}/>
          </div>
          <div style={{marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(99,102,241,0.4)",letterSpacing:"0.15em"}}>COLOR INTENSITY = Z VALUE · WHITE LINES = LEVEL CURVES</div>
        </>
      )}

      {/* ── VECTOR FIELD ── */}
      {gtype==="vector" && (
        <>
          <div style={{marginBottom:14}}>
            <div style={{...sectionLabel,marginBottom:6}}>Vector Field — F(x,y) = (P, Q)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>P(x,y) — horizontal</div><input value={vfP} onChange={e=>setVfP(e.target.value)} placeholder="y" className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
              <div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(129,140,248,0.4)",marginBottom:4}}>Q(x,y) — vertical</div><input value={vfQ} onChange={e=>setVfQ(e.target.value)} placeholder="-x" className="si" style={{...inputSt,fontSize:14,padding:"9px 14px"}}/></div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {[["Rotation","y","-x"],["Radial","x","y"],["Gradient","2*x","2*y"],["Saddle","x","-y"],["Vortex","-y","x"],["Sink","-x","-y"]].map(([l,p,q])=><button key={l} className="ec" onClick={()=>{setVfP(p);setVfQ(q);}} style={{padding:"4px 11px",borderRadius:6,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.5)",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{l}</button>)}
            </div>
          </div>
          <div style={{position:"relative"}}>
            <button className="maxbtn" onClick={()=>setFullscreen(true)} style={{position:"absolute",top:8,right:8,zIndex:10,padding:"5px 10px",borderRadius:6,background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",color:"rgba(165,180,252,0.8)",fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",transition:"all 0.2s"}}>⤢ EXPAND</button>
            <canvas ref={vfRef} width={700} height={440} style={{width:"100%",borderRadius:10,display:"block"}}/>
          </div>
          <div style={{marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(99,102,241,0.4)",letterSpacing:"0.15em"}}>ARROW COLOR = MAGNITUDE · ARROWS SHOW DIRECTION OF FIELD</div>
        </>
      )}

      <div style={{marginTop:16,textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(99,102,241,0.3)",letterSpacing:"0.2em"}}>HOVER OVER 2D GRAPHS TO INSPECT VALUES · DRAG 3D TO ROTATE</div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   MATH SOLVE ENGINE
════════════════════════════════════════════════════════════════ */
function solveLinear(expr,v="x"){try{let eq=expr.includes("=")?expr:`${expr}=0`;const[l,r]=eq.split("=").map(s=>s.trim());const combined=`(${l})-(${r})`;const simplified=math.simplify(math.parse(combined));const a=math.evaluate(math.derivative(simplified,v).toString());const b=math.evaluate(simplified.toString().replace(new RegExp(v,"g"),"0")||"0");if(a===0)return{type:"linear",error:`No ${v} term found.`};const sol=-b/a;const steps=[{title:"Write the Equation",body:`Start: ${l} = ${r}`,math:`${l} = ${r}`},{title:"Move to One Side",body:"Subtract RHS from both sides.",math:`(${l})-(${r})=0`},{title:"Simplify",body:"Combine like terms.",math:`${simplified.toString()}=0`},{title:"Identify Coefficients",body:`a=${a}, constant b=${b}`,math:`a=${a},\\;b=${b}`},{title:"Isolate Variable",body:`Divide both sides by a.`,math:`${v}=-b/a`},{title:"Solution",body:"Final answer.",math:`${v}=${+sol.toFixed(6)}`,highlight:true}];return{type:"linear",result:`${v} = ${+sol.toFixed(6)}`,steps,graphExpr:`(${l})-(${r})`};}catch(e){return{type:"linear",error:e.message};}}
function solveQuadratic(a,b,c){const disc=b*b-4*a*c;const steps=[{title:"Standard Form",body:"ax²+bx+c=0",math:`ax^2+bx+c=0`},{title:"Coefficients",body:"Extract a, b, c.",math:`a=${a},\\;b=${b},\\;c=${c}`},{title:"Discriminant",body:"Δ=b²−4ac",math:`\\Delta=${b}^2-4(${a})(${c})=${disc}`},{title:disc>0?"Two Real Roots":disc===0?"Repeated Root":"Complex Roots",body:disc>0?"Δ>0: two distinct real roots":disc===0?"Δ=0: one repeated root":"Δ<0: complex",math:`\\Delta=${disc}`},{title:"Quadratic Formula",body:"Apply the formula.",math:`x=\\frac{-(${b})\\pm\\sqrt{${disc}}}{2(${a})}`}];if(disc>=0){const x1=(-b+Math.sqrt(disc))/(2*a),x2=(-b-Math.sqrt(disc))/(2*a);steps.push({title:"Roots",body:"Solutions.",math:disc===0?`x=${+x1.toFixed(6)}`:`x_1=${+x1.toFixed(6)},\\;x_2=${+x2.toFixed(6)}`,highlight:true});return{type:"quadratic",result:disc===0?`x=${+x1.toFixed(6)}`:`x₁=${+x1.toFixed(6)}, x₂=${+x2.toFixed(6)}`,steps,graphExpr:`${a}*x^2+(${b})*x+(${c})`};}else{const re=+(-b/(2*a)).toFixed(4),im=+(Math.sqrt(-disc)/(2*a)).toFixed(4);steps.push({title:"Complex Roots",body:"Imaginary solutions.",math:`x=${re}\\pm${im}i`,highlight:true});return{type:"quadratic",result:`x=${re}±${im}i`,steps,graphExpr:`${a}*x^2+(${b})*x+(${c})`};}}
function solveDerivative(expr,v="x"){try{const deriv=math.derivative(expr,v);const simplified=math.simplify(deriv).toString();const steps=[{title:"Identify Function",body:`Differentiate f(${v})=${expr}`,math:`f(${v})=${expr}`},{title:"Apply Rules",body:"Power, Product, Chain, Sum rules.",math:`\\frac{d}{d${v}}[x^n]=nx^{n-1}`},{title:"Differentiate",body:"Apply to each term.",math:`\\frac{d}{d${v}}(${expr})`},{title:"Result",body:"Simplified derivative.",math:`f'(${v})=${simplified}`,highlight:true}];return{type:"derivative",result:`f'(${v}) = ${simplified}`,steps,graphExpr:expr,graphExpr2:simplified};}catch(e){return{type:"derivative",error:"Check expression syntax."};}}
function solveIntegral(expr,v="x"){const patterns=[{re:/^(\d+)\*?x\^(\d+)$/,fn:m=>{const[,a,n]=m,N=+n+1;return`(${a}/${N})*x^${N}+C`;},ex:"∫axⁿdx=axⁿ⁺¹/(n+1)+C"},{re:/^x\^(\d+)$/,fn:m=>{const[,n]=m,N=+n+1;return`x^${N}/${N}+C`;},ex:"Power rule"},{re:/^(\d+)$/,fn:m=>`${m[1]}*x+C`,ex:"∫a dx=ax+C"},{re:/^x$/,fn:()=>`x^2/2+C`,ex:"∫x dx=x²/2+C"},{re:/^sin\(x\)$/,fn:()=>`-cos(x)+C`,ex:"∫sin(x)=-cos(x)+C"},{re:/^cos\(x\)$/,fn:()=>`sin(x)+C`,ex:"∫cos(x)=sin(x)+C"},{re:/^e\^x$/,fn:()=>`e^x+C`,ex:"∫eˣ=eˣ+C"},{re:/^1\/x$/,fn:()=>`ln(|x|)+C`,ex:"∫1/x=ln|x|+C"},{re:/^tan\(x\)$/,fn:()=>`-ln(|cos(x)|)+C`,ex:"∫tan(x)=-ln|cos(x)|+C"}];const t=expr.trim().replace(/\s/g,"");for(const p of patterns){const m=t.match(p.re);if(m){const r=p.fn(m);return{type:"integral",result:`∫${expr}dx = ${r}`,steps:[{title:"Identify Integrand",body:"Determine the integration rule.",math:`\\int ${expr}\\,d${v}`},{title:"Apply Rule",body:p.ex,math:p.ex},{title:"Antiderivative",body:"Substitute into formula.",math:`=${r}`},{title:"Add Constant C",body:"Indefinite integrals include +C.",math:`=${r}`,highlight:true}]};}}return{type:"integral",result:`∫(${expr})dx`,steps:[{title:"Complex Integral",body:"Requires advanced techniques.",math:`\\int(${expr})\\,d${v}`},{title:"Try u-Substitution",body:"Let u=inner function.",math:`u=g(x),\\;du=g'(x)dx`},{title:"Or Integration by Parts",body:"∫u dv = uv - ∫v du",math:`\\int u\\,dv=uv-\\int v\\,du`,highlight:true}]};}
function solveSystem(eq1,eq2){try{const pe=s=>{const[l,r]=s.split("=");const rhs=parseFloat(r.trim());const a=math.evaluate(math.derivative(l.trim(),"x").toString());const b=math.evaluate(math.derivative(l.trim(),"y").toString());const constant=math.evaluate(l.trim().replace(/x/g,"0").replace(/y/g,"0")||"0");return{a,b,c:rhs-constant};};const e1=pe(eq1),e2=pe(eq2);const det=e1.a*e2.b-e2.a*e1.b;if(det===0)return{type:"system",error:"No unique solution."};const x=(e1.c*e2.b-e2.c*e1.b)/det,y=(e1.a*e2.c-e2.a*e1.c)/det;const steps=[{title:"System",body:"Two equations, two unknowns.",math:`\\begin{cases}${eq1}\\\\${eq2}\\end{cases}`},{title:"Coefficient Matrix",body:"Build A from coefficients.",math:`D=${e1.a}\\cdot${e2.b}-${e2.a}\\cdot${e1.b}=${det}`},{title:"Solve x",body:"Cramer's Rule.",math:`x=${+(x).toFixed(6)}`},{title:"Solve y",body:"Cramer's Rule.",math:`y=${+(y).toFixed(6)}`},{title:"Solution",body:"Intersection point.",math:`x=${+(x).toFixed(6)},\\;y=${+(y).toFixed(6)}`,highlight:true}];return{type:"system",result:`x=${+(x).toFixed(6)}, y=${+(y).toFixed(6)}`,steps};}catch(e){return{type:"system",error:"Use format: ax + by = c"};}}
function solveMatrix(input){try{const rows=input.trim().split(";").map(r=>r.trim().split(/[\s,]+/).map(Number));const M=math.matrix(rows);const det=+math.det(M).toFixed(6);const inv=det!==0?math.round(math.inv(M),4):null;const steps=[{title:"Parse Matrix",body:`${rows.length}×${rows.length} matrix.`,math:`A=\\begin{pmatrix}${rows.map(r=>r.join("&")).join("\\\\")} \\end{pmatrix}`},{title:"Determinant",body:"det(A).",math:`\\det(A)=${det}`},{title:det!==0?"Invertible":"Singular",body:det!==0?"Inverse exists.":"No inverse.",math:det!==0?"A^{-1}\\text{ exists}":"\\text{Singular}"}, inv?{title:"Inverse",body:"A⁻¹=adj(A)/det(A)",math:`A^{-1}=\\begin{pmatrix}${inv.toArray().map(r=>r.map(v=>+v.toFixed(3)).join("&")).join("\\\\")} \\end{pmatrix}`,highlight:true}:{title:"No Inverse",body:"det=0.",math:`\\det(A)=0`,highlight:true}];return{type:"matrix",result:`det=${det}`,steps};}catch(e){return{type:"matrix",error:"Format: '1 2; 3 4'"}; }}
function solveTrig(expr){try{const r=math.evaluate(expr);const steps=[{title:"Trig Expression",body:"Identify functions.",math:`${expr}`},{title:"Core Identity",body:"sin²x+cos²x=1",math:`\\sin^2x+\\cos^2x=1`},{title:"Evaluate",body:"Apply trig function to argument.",math:`${expr}=${+r.toFixed(6)}`},{title:"Result",body:"Numerical value (radians mode).",math:`=${+r.toFixed(6)}`,highlight:true}];return{type:"trig",result:`${expr} = ${+r.toFixed(6)}`,steps};}catch(e){return{type:"trig",error:"Try: sin(pi/2), cos(pi/3)"}; }}
function solveLog(expr){try{const r=math.evaluate(expr);const steps=[{title:"Log Expression",body:"Identify base.",math:`${expr}`},{title:"Log Rules",body:"log(ab)=log(a)+log(b), log(aⁿ)=n·log(a)",math:`\\log(ab)=\\log(a)+\\log(b)`},{title:"Change of Base",body:"log_b(x)=ln(x)/ln(b)",math:`\\log_b(x)=\\frac{\\ln x}{\\ln b}`},{title:"Result",body:"Numerical value.",math:`${expr}=${+r.toFixed(6)}`,highlight:true}];return{type:"logarithm",result:`${expr} = ${+r.toFixed(6)}`,steps};}catch(e){return{type:"logarithm",error:"Try: log(100), ln(e^3), log2(8)"};}}
function solveStat(data){try{const d=data.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n));if(d.length<2)return{type:"statistics",error:"Enter at least 2 numbers."};const n=d.length,sorted=[...d].sort((a,b)=>a-b),mean=math.mean(d),median=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)],variance=math.variance(d),std=math.std(d),min=math.min(d),max=math.max(d);const freq={};d.forEach(x=>freq[x]=(freq[x]||0)+1);const maxF=Math.max(...Object.values(freq));const mode=Object.keys(freq).filter(k=>freq[k]===maxF).join(", ");const steps=[{title:"Dataset",body:`n=${n} data points.`,math:`\\{${d.join(",")}\\}`},{title:"Mean",body:"Σxᵢ/n",math:`\\bar{x}=${+mean.toFixed(4)}`},{title:"Median",body:"Middle value.",math:`\\text{Median}=${+median.toFixed(4)}`},{title:"Mode",body:"Most frequent.",math:`\\text{Mode}=${mode}`},{title:"Std Dev",body:"√(Σ(xᵢ-x̄)²/n)",math:`\\sigma=${+std.toFixed(4)}`},{title:"Range",body:"Max - Min.",math:`\\text{Range}=${max-min}`,highlight:true}];return{type:"statistics",result:`Mean=${+mean.toFixed(4)}, Median=${+median.toFixed(4)}, σ=${+std.toFixed(4)}`,steps,stats:{mean:+mean.toFixed(4),median:+median.toFixed(4),mode,variance:+variance.toFixed(4),std:+std.toFixed(4),min,max,n}};}catch(e){return{type:"statistics",error:"Invalid data."};}}
function solveExpr(expr){try{const r=math.evaluate(expr);const steps=[{title:"Parse Expression",body:"Identify operators and operands.",math:`${expr}`},{title:"Order of Operations",body:"Brackets → Powers → ×÷ → +−",math:"BODMAS/PEMDAS"},{title:"Evaluate",body:"Compute step by step.",math:`${expr}=${typeof r==="number"?+r.toFixed(8):r}`},{title:"Result",body:"Final answer.",math:`=${typeof r==="number"?+r.toFixed(8):r}`,highlight:true}];return{type:"expression",result:`= ${typeof r==="number"?+r.toFixed(8):r}`,steps};}catch(e){return{type:"expression",error:"Invalid expression."}; }}

/* ════════ TABS CONFIG ════════ */
const TABS=[
  {id:"linear",     label:"Linear",     icon:"ƒ",   hint:"ax + b = c",                      ex:["2x+5=11","3x-7=2x+4","5x=25"]},
  {id:"quadratic",  label:"Quadratic",  icon:"x²",  hint:"Enter a, b, c for ax²+bx+c=0",    ex:["1,-5,6","1,0,-9","2,-4,2"]},
  {id:"derivative", label:"Derivative", icon:"d/dx", hint:"Differentiate any expression",   ex:["x^3+2*x^2-5","sin(x)*cos(x)","x^2*log(x)"]},
  {id:"integral",   label:"Integral",   icon:"∫",   hint:"Indefinite integral",              ex:["x^3","sin(x)","e^x"]},
  {id:"system",     label:"System",     icon:"{}",  hint:"Two equations, newline separated", ex:["2x+y=5\n3x-y=4","x+y=10\n2x-y=5"]},
  {id:"matrix",     label:"Matrix",     icon:"[]",  hint:"Rows by ; values by space",        ex:["1 2; 3 4","2 1 0; 1 3 1; 0 1 2"]},
  {id:"trig",       label:"Trig",       icon:"sin", hint:"Evaluate trig expressions",        ex:["sin(pi/6)","cos(pi/3)+sin(pi/4)","tan(pi/4)"]},
  {id:"logarithm",  label:"Log",        icon:"log", hint:"Natural log, log10, log2",         ex:["log(1000)","ln(e^5)","log2(64)"]},
  {id:"statistics", label:"Stats",      icon:"σ",   hint:"Comma-separated numbers",          ex:["4,8,15,16,23,42","1,2,3,4,5"]},
  {id:"expression", label:"Evaluate",   icon:"=",   hint:"Any math expression",              ex:["2^10+sqrt(144)","factorial(10)","(3+4i)^2"]},
];

const FAQ_DATA=[
  {q:"What equation types does this solver support?",a:"Linear, Quadratic, Derivatives, Integrals, Systems, Matrices, Trigonometry, Logarithms, Statistics, and general expression evaluation — from basic algebra to university calculus."},
  {q:"How does the 3D graph work?",a:"The 3D surface renderer uses a wireframe projection algorithm. You can drag to orbit the surface in any direction. The color bar shows the z-value range. Drag or touch to rotate."},
  {q:"How do I expand a graph to fullscreen?",a:"Click the ⤢ EXPAND button on any graph, or click the FULLSCREEN button at the top of the Graph Visualization section. Press × CLOSE or Escape to exit."},
  {q:"What is a vector field graph?",a:"A vector field assigns a direction and magnitude to every point in the plane. Arrows show the direction of the field F(x,y)=(P,Q). Color intensity indicates the magnitude. Common examples: rotation (y,-x), gradient (2x,2y), vortex."},
  {q:"How is the quadratic formula derived?",a:"By completing the square on ax²+bx+c=0. Divide by a, add (b/2a)² to both sides, take square roots, and solve for x. This gives x=(-b±√(b²-4ac))/2a."},
  {q:"What differentiation rules are applied?",a:"Power Rule d/dx[xⁿ]=nxⁿ⁻¹, Constant Rule, Sum Rule, Product Rule, Chain Rule, and standard derivatives of sin, cos, eˣ, ln(x)."},
  {q:"What is a contour plot?",a:"A contour plot shows level curves — curves along which f(x,y)=constant. Color intensity represents the z value (function height). White lines are the actual contour curves."},
  {q:"What does standard deviation measure?",a:"σ=√(Σ(xᵢ-x̄)²/n) measures average spread from the mean. Low σ means data is clustered; high σ means data is widely spread. The 68-95-99.7 rule applies to normal distributions."},
];

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function MathSolver() {
  const [activeTab,setActiveTab] = useState("linear");
  const [input,setInput] = useState("2x+5=11");
  const [variable,setVariable] = useState("x");
  const [result,setResult] = useState(null);
  const [solved,setSolved] = useState(false);
  const [openFaq,setOpenFaq] = useState(null);

  const curTab = TABS.find(t=>t.id===activeTab);

  const changeTab = id=>{setActiveTab(id);setResult(null);setSolved(false);setInput(TABS.find(t=>t.id===id).ex[0]);};

  const solve = useCallback(()=>{
    const t=input.trim();let res;
    if(activeTab==="linear") res=solveLinear(t,variable);
    else if(activeTab==="quadratic"){const pts=t.split(",").map(s=>parseFloat(s.trim()));res=pts.length!==3||pts.some(isNaN)?{type:"quadratic",error:"Enter: a, b, c"}:solveQuadratic(pts[0],pts[1],pts[2]);}
    else if(activeTab==="derivative") res=solveDerivative(t,variable);
    else if(activeTab==="integral") res=solveIntegral(t,variable);
    else if(activeTab==="system"){const lines=t.split("\n").map(s=>s.trim()).filter(Boolean);res=lines.length<2?{type:"system",error:"Enter two equations."}:solveSystem(lines[0],lines[1]);}
    else if(activeTab==="matrix") res=solveMatrix(t);
    else if(activeTab==="trig") res=solveTrig(t);
    else if(activeTab==="logarithm") res=solveLog(t);
    else if(activeTab==="statistics") res=solveStat(t);
    else res=solveExpr(t);
    setResult(res);setSolved(true);
  },[input,variable,activeTab]);

  // Shared styles
  const card={background:"linear-gradient(145deg,rgba(99,102,241,0.05),rgba(139,92,246,0.04),rgba(16,16,36,0.92))",border:"1px solid rgba(99,102,241,0.18)",borderRadius:14};
  const mono={fontFamily:"'JetBrains Mono',monospace"};
  const display={fontFamily:"'Oxanium',sans-serif"};
  const bodyText={fontFamily:"'Rajdhani',sans-serif",fontSize:16,lineHeight:1.88,color:"rgba(210,215,255,0.72)"};
  const sectionLabel={fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.35em",color:"rgba(99,102,241,0.45)",textTransform:"uppercase",marginBottom:20};
  const inputSt={background:"rgba(10,10,30,0.8)",border:"1px solid rgba(99,102,241,0.22)",borderRadius:8,color:"#e0e7ff",fontFamily:"'JetBrains Mono',monospace",fontSize:15,padding:"12px 16px",width:"100%"};

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:"#05070f",color:"#e2e4ff",position:"relative"}}>
        {/* BG */}
        <div style={{position:"fixed",inset:0,zIndex:0,backgroundImage:"linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px)",backgroundSize:"44px 44px",animation:"gridDrift 6s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"fixed",left:0,right:0,height:"1px",zIndex:2,background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)",animation:"scan 9s linear infinite",pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:10,maxWidth:1180,margin:"0 auto",padding:"14px 20px 0"}}><Ad slot="1111" label="LEADERBOARD TOP 728×90" minH={90}/></div>

        {/* LAYOUT */}
        <div style={{position:"relative",zIndex:10,maxWidth:1180,margin:"0 auto",padding:"0 20px 60px",display:"flex",gap:28,alignItems:"flex-start"}}>

          {/* ═══ MAIN ═══ */}
          <main style={{flex:1,minWidth:0,paddingTop:32}}>

            {/* HEADER */}
            <header style={{marginBottom:36,animation:"fadeUp 0.7s ease"}}>
              <h1 style={{...display,fontSize:"clamp(26px,5vw,52px)",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",background:"linear-gradient(135deg,#818cf8,#a78bfa,#c084fc,#818cf8)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"holoText 5s linear infinite",marginBottom:8}}>CALC∷NEXUS</h1>
              <p style={{...mono,fontSize:10,color:"rgba(129,140,248,0.48)",letterSpacing:"0.3em"}}>◈ UNIVERSAL MATH ENGINE · SOLVER + 2D / 3D GRAPH VISUALIZATION ◈</p>
            </header>

            {/* TABS */}
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:20,padding:"12px",background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.11)",borderRadius:12}}>
              {TABS.map(tab=>(
                <button key={tab.id} className="tb" onClick={()=>changeTab(tab.id)} style={{padding:"6px 12px",borderRadius:7,cursor:"pointer",transition:"all 0.2s",background:activeTab===tab.id?"rgba(99,102,241,0.22)":"transparent",border:`1px solid ${activeTab===tab.id?"rgba(99,102,241,0.55)":"rgba(99,102,241,0.1)"}`,color:activeTab===tab.id?"#a5b4fc":"rgba(129,140,248,0.43)",...display,fontSize:12,fontWeight:600,boxShadow:activeTab===tab.id?"0 0 10px rgba(99,102,241,0.18)":"none"}}>
                  <span style={{marginRight:4,opacity:0.8}}>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>

            {/* INPUT */}
            <div style={{...card,padding:"28px 24px",marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={sectionLabel}>{curTab?.hint}</div>
                  <h2 style={{...display,fontSize:20,color:"#c7d2fe",fontWeight:700}}>{curTab?.label} Solver</h2>
                </div>
                {(activeTab==="linear"||activeTab==="derivative"||activeTab==="integral")&&(
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{...mono,fontSize:10,color:"rgba(129,140,248,0.45)"}}>var:</span>
                    <input value={variable} onChange={e=>setVariable(e.target.value)} className="si" style={{width:46,padding:"7px 10px",borderRadius:7,textAlign:"center",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.22)",color:"#a5b4fc",...mono,fontSize:14}}/>
                  </div>
                )}
              </div>
              {activeTab==="system"
                ? <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} placeholder={curTab?.hint} className="si" style={{...inputSt,resize:"vertical",lineHeight:1.7}}/>
                : <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&solve()} placeholder={curTab?.hint} className="si" style={inputSt}/>
              }
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                <span style={{...mono,fontSize:9,color:"rgba(129,140,248,0.35)",alignSelf:"center"}}>TRY:</span>
                {curTab?.ex.map((ex,i)=><button key={i} className="ec" onClick={()=>setInput(ex)} style={{padding:"3px 10px",borderRadius:5,cursor:"pointer",transition:"all 0.2s",background:"transparent",border:"1px solid rgba(99,102,241,0.18)",color:"rgba(129,140,248,0.48)",...mono,fontSize:10,whiteSpace:"pre"}}>{ex.replace(/\n/g," | ")}</button>)}
              </div>
              <button onClick={solve} className="sb" style={{marginTop:18,width:"100%",padding:"13px",borderRadius:10,background:"linear-gradient(135deg,#4f46e5,#7c3aed)",border:"none",color:"#fff",cursor:"pointer",...display,fontSize:15,fontWeight:700,letterSpacing:"0.14em",boxShadow:"0 4px 18px rgba(99,102,241,0.3)",transition:"all 0.25s"}}>◈ SOLVE NOW</button>
            </div>

            {/* IN-FEED AD */}
            <Ad slot="2222" label="IN-FEED 300×100" minH={90}/>

            {/* RESULT */}
            {solved&&result&&(
              <div style={{marginTop:18,animation:"fadeUp 0.4s ease"}}>
                {result.error
                  ? <div style={{...card,padding:"18px 22px",borderColor:"rgba(239,68,68,0.28)",background:"rgba(239,68,68,0.05)"}}><span style={{...mono,color:"#f87171",fontSize:13}}>⚠ {result.error}</span></div>
                  : <>
                    {/* Answer */}
                    <div style={{background:"linear-gradient(135deg,rgba(99,102,241,0.16),rgba(139,92,246,0.1))",border:"1px solid rgba(99,102,241,0.42)",borderRadius:12,padding:"18px 24px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,animation:"borderGlow 3s ease-in-out infinite"}}>
                      <span style={{...mono,fontSize:9,color:"rgba(129,140,248,0.5)",letterSpacing:"0.28em"}}>RESULT</span>
                      <span style={{...mono,fontSize:"clamp(13px,2.2vw,18px)",color:"#a5b4fc",fontWeight:600,textAlign:"right"}}>{result.result?.split("\n")[0]}</span>
                    </div>
                    {/* Stats dashboard */}
                    {result.type==="statistics"&&result.stats&&(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:18}}>
                        {[["n",result.stats.n],["Mean",result.stats.mean],["Median",result.stats.median],["Mode",result.stats.mode],["Std Dev",result.stats.std],["Variance",result.stats.variance],["Min",result.stats.min],["Max",result.stats.max]].map(([l,v])=>(
                          <div key={l} style={{background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.17)",borderRadius:10,padding:"12px 10px",textAlign:"center",animation:"numberTick 0.4s ease"}}>
                            <div style={{...mono,fontSize:9,color:"rgba(129,140,248,0.42)",marginBottom:5}}>{l}</div>
                            <div style={{...display,fontSize:17,fontWeight:700,color:"#a5b4fc"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Steps */}
                    <div style={{...card,padding:"24px 22px"}}>
                      <div style={sectionLabel}>◈ Step-by-Step Solution</div>
                      {result.steps?.map((step,i)=>(
                        <div key={i} style={{display:"flex",gap:16,paddingBottom:22,position:"relative",animation:`stepReveal 0.4s ease ${i*0.07}s both`}}>
                          {i<result.steps.length-1&&<div style={{position:"absolute",left:18,top:38,bottom:0,width:1,background:"linear-gradient(to bottom,rgba(99,102,241,0.28),transparent)"}}/>}
                          <div style={{width:36,height:36,borderRadius:"50%",background:step.highlight?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(99,102,241,0.1)",border:`1px solid ${step.highlight?"rgba(99,102,241,0.8)":"rgba(99,102,241,0.22)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:step.highlight?"0 0 14px rgba(99,102,241,0.48)":"none"}}>
                            <span style={{...display,fontSize:12,fontWeight:700,color:step.highlight?"#fff":"#818cf8"}}>{i+1}</span>
                          </div>
                          <div style={{flex:1,paddingTop:5}}>
                            <div style={{...display,fontSize:13,fontWeight:700,color:step.highlight?"#a5b4fc":"#c7d2fe",marginBottom:4,letterSpacing:"0.04em"}}>{step.title}</div>
                            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"rgba(180,185,255,0.6)",marginBottom:8,lineHeight:1.6}}>{step.body}</div>
                            <div style={{background:step.highlight?"rgba(99,102,241,0.1)":"rgba(10,10,25,0.65)",border:`1px solid ${step.highlight?"rgba(99,102,241,0.32)":"rgba(99,102,241,0.1)"}`,borderRadius:7,padding:"9px 14px",...mono,fontSize:13,color:step.highlight?"#c7d2fe":"#94a3b8",overflowX:"auto",wordBreak:"break-all"}}>{step.math}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                }
              </div>
            )}

            {/* IN-ARTICLE AD */}
            <div style={{marginTop:28}}><Ad slot="3333" label="IN-ARTICLE 300×250" minH={280}/></div>

            {/* ═══ GRAPH VISUALIZATION SECTION ═══ */}
            <GraphSection card={card} mono={mono} display={display} sectionLabel={sectionLabel} inputSt={inputSt}/>

            {/* MID AD */}
            <div style={{marginTop:24}}><Ad slot="4444" label="IN-ARTICLE MID 300×250" minH={280}/></div>

            {/* SEO ARTICLE */}
            <article style={{...card,padding:"34px 28px",marginTop:24}}>
              <div style={sectionLabel}>◈ Mathematics Reference</div>
              <h2 style={{...display,fontSize:"clamp(16px,2.8vw,24px)",color:"#c7d2fe",marginBottom:18,fontWeight:700}}>Every Math Equation Type — Solved & Visualized</h2>
              <div style={bodyText}>
                {[["Linear Equations","Single-variable: ax+b=c. Solved by isolating x using inverse operations. Graph: straight line with slope a and y-intercept b/a."],["Quadratic Equations","ax²+bx+c=0. Solved via factoring, completing the square, or the quadratic formula. Graph: parabola opening upward (a>0) or downward (a<0)."],["Derivatives","f′(x) = instantaneous rate of change. Graph: slope of the tangent line at every point. Key rules: Power, Product, Chain, Quotient."],["Integrals","∫f(x)dx = area under the curve. Indefinite integral adds +C. Graph: the area shaded between the curve and the x-axis."],["3D Surfaces","z=f(x,y) defines a surface in 3D space. Color encodes height (z value). Drag to orbit the surface and explore its geometry."],["Contour Maps","Level curves where z=constant. Color intensity shows height. White lines are the actual contour curves — like topographic maps."],["Vector Fields","F(x,y)=(P,Q) assigns a vector to every point. Arrows show direction; color shows magnitude. Used in fluid flow, electromagnetism, and gradient analysis."],["Polar Coordinates","r(θ) expresses curves by radius and angle. Produces roses, cardioids, spirals, and lemniscates — shapes not easily expressed in Cartesian form."],["Parametric Curves","x(t) and y(t) trace a path as t increases. Enables circles, Lissajous figures, spirals, and butterfly curves beyond y=f(x) limitations."]].map(([h,t])=>(
                  <div key={h} style={{marginBottom:18,paddingLeft:16,borderLeft:"2px solid rgba(99,102,241,0.18)"}}>
                    <h3 style={{...display,fontSize:13,fontWeight:700,color:"#818cf8",marginBottom:5}}>{h}</h3>
                    <p>{t}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* BEFORE FAQ AD */}
            <div style={{marginTop:24}}><Ad slot="5555" label="IN-ARTICLE BEFORE FAQ 300×250" minH={280}/></div>

            {/* FAQ */}
            <section style={{...card,padding:"34px 28px",marginTop:24}}>
              <div style={sectionLabel}>◈ Frequently Asked Questions</div>
              <h2 style={{...display,fontSize:"clamp(16px,2.5vw,22px)",color:"#c7d2fe",marginBottom:24,fontWeight:700}}>CALC∷NEXUS — Questions & Answers</h2>
              {FAQ_DATA.map((item,i)=>(
                <div key={i} style={{borderBottom:"1px solid rgba(99,102,241,0.09)"}}>
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",textAlign:"left",padding:"14px 0",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                    <span style={{...display,fontSize:12,fontWeight:600,color:openFaq===i?"#a5b4fc":"rgba(165,180,252,0.65)",lineHeight:1.5,transition:"color 0.2s"}}>{item.q}</span>
                    <span style={{color:openFaq===i?"#818cf8":"rgba(99,102,241,0.32)",fontSize:20,flexShrink:0,display:"inline-block",transition:"transform 0.2s",transform:openFaq===i?"rotate(45deg)":"none"}}>+</span>
                  </button>
                  {openFaq===i&&<div style={{...bodyText,fontSize:14,paddingBottom:16,paddingRight:24,animation:"appear 0.2s ease"}}>{item.a}</div>}
                </div>
              ))}
            </section>

            {/* About */}
            <section style={{...card,padding:"28px 24px",marginTop:20}}>
              <div style={sectionLabel}>◈ About CALC∷NEXUS</div>
              <div style={bodyText}>
                <p style={{marginBottom:12}}>CALC∷NEXUS is a fully client-side mathematics engine. All computation uses the <strong style={{color:"#818cf8"}}>mathjs</strong> library. All graph rendering uses pure HTML5 Canvas — no external chart libraries, no server round-trips, no data collection.</p>
                <p>Graph types: 2D Function Plotter, Multi-Function, Parametric Curves, Polar Graphs, Scatter Plot, 3D Surface (drag to orbit), Contour Map, and Vector Field. Every graph supports fullscreen expansion.</p>
              </div>
            </section>

            <div style={{marginTop:24}}><Ad slot="6666" label="LEADERBOARD BOTTOM 728×90" minH={90}/></div>

            <footer style={{marginTop:32,textAlign:"center",...mono,color:"rgba(99,102,241,0.14)",fontSize:10,letterSpacing:"0.26em",lineHeight:2.3}}>
              <div>CALC∷NEXUS ◈ UNIVERSAL MATHEMATICS ENGINE ◈ 2D + 3D GRAPH VISUALIZATION</div>
              <div style={{fontSize:9,marginTop:4}}><span style={{marginRight:18,cursor:"pointer"}}>Privacy Policy</span><span style={{marginRight:18,cursor:"pointer"}}>Terms of Use</span><span style={{cursor:"pointer"}}>Contact</span></div>
              <div>© {new Date().getFullYear()} CALC∷NEXUS. All rights reserved.</div>
            </footer>
          </main>

          {/* ═══ SIDEBAR ═══ */}
          <aside style={{width:300,flexShrink:0,paddingTop:32,display:"flex",flexDirection:"column",gap:20}}>
            <Ad slot="7777" label="SIDEBAR 300×250 TOP" minH={260}/>
            <div style={{position:"sticky",top:18,display:"flex",flexDirection:"column",gap:20}}>
              {/* Quick ref */}
              <div style={{...card,padding:20}}>
                <div style={sectionLabel}>◈ Formula Reference</div>
                {[["Power Rule","d/dx[xⁿ]=nxⁿ⁻¹"],["Quad Formula","x=(−b±√Δ)/2a"],["∫ Power Rule","∫xⁿdx=xⁿ⁺¹/(n+1)+C"],["Chain Rule","dy/dx=(dy/du)(du/dx)"],["Log Product","log(ab)=log a+log b"],["Det 2×2","ad−bc"],["Std Dev","σ=√(Σ(xᵢ-x̄)²/n)"],["Euler","eⁱˣ=cos x+i·sin x"]].map(([r,f])=>(
                  <div key={r} style={{marginBottom:11,paddingBottom:11,borderBottom:"1px solid rgba(99,102,241,0.07)"}}>
                    <div style={{...display,fontSize:10,color:"rgba(129,140,248,0.55)",marginBottom:2}}>{r}</div>
                    <div style={{...mono,fontSize:11,color:"#818cf8"}}>{f}</div>
                  </div>
                ))}
              </div>
              <Ad slot="8888" label="SIDEBAR 300×600 HALF PAGE" minH={620}/>
              {/* Graph guide */}
              <div style={{...card,padding:20}}>
                <div style={sectionLabel}>◈ Graph Types</div>
                {GRAPH_TYPES.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(99,102,241,0.06)"}}>
                    <span style={{...display,fontSize:12,color:"rgba(99,102,241,0.6)",width:26}}>{g.icon}</span>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,color:"rgba(165,180,252,0.6)"}}>{g.label}</span>
                  </div>
                ))}
              </div>
              <Ad slot="9999" label="SIDEBAR 300×250 BOTTOM" minH={260}/>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}