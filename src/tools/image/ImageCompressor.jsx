import { useState, useRef, useEffect, useCallback } from "react";

/* ════════════════════════════════════════════════════════
   IMAGE COMPRESSOR  — fully working
   NEW FEATURES:
   • Live size estimate shown on EACH format button (JPEG/PNG/WebP)
     as real KB / MB — updates as you drag quality slider
   • Mini bar under each format = how big vs original
   • Target size input — type "200 KB" or "1.5 MB"
     binary-searches the right quality automatically
   • Exact byte counts shown in results (e.g. 2,341,102 B)
   • Download button shows final file size
════════════════════════════════════════════════════════ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;500;600&family=Fira+Code:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;min-height:100%}
@keyframes scan{0%{top:-2px}100%{top:102%}}
@keyframes holo{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.fadeup{animation:fadeup .35s ease forwards}
.spin{animation:spin .7s linear infinite;display:inline-block}
.blink{animation:blink 1.2s ease infinite}
.pulsing{animation:pulse .8s ease infinite}
.holo-txt{background:linear-gradient(90deg,#00fff7,#bf00ff,#ff6b35,#00fff7);background-size:300%;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:holo 4s linear infinite}

/* ── NEON ──────────────────────────────────────────── */
.neon{--n:#00fff7;--n2:#bf00ff;--ok:#00ff88;--err:#ff003c;--am:#ffaa00;
  --bg:#020210;--p:#07071c;--txt:#eef0ff;--sub:#8484bb;--bdr:#18183a;
  font-family:'Exo 2',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;position:relative}
.neon .orb{font-family:'Orbitron',sans-serif}
.neon .mono{font-family:'Fira Code',monospace}
.scan-line{position:fixed;left:0;right:0;height:1px;z-index:9999;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(0,255,247,.7),transparent);
  box-shadow:0 0 8px rgba(0,255,247,.4);animation:scan 6s linear infinite}
.n-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(0,255,247,.03) 1px,transparent 1px),
  linear-gradient(90deg,rgba(0,255,247,.03) 1px,transparent 1px);background-size:40px 40px}
.n-glow{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(0,255,247,.06) 0%,transparent 60%)}
.n-panel{background:linear-gradient(135deg,rgba(7,7,28,.99),rgba(2,2,12,1));
  border:1px solid var(--bdr);border-radius:3px;position:relative;overflow:hidden}
.n-panel::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.004) 3px,rgba(0,255,247,.004) 4px)}
.n-corner::before,.n-corner::after{content:'';position:absolute;width:14px;height:14px;z-index:2}
.n-corner::before{top:0;left:0;border-top:1px solid var(--n);border-left:1px solid var(--n)}
.n-corner::after{bottom:0;right:0;border-bottom:1px solid var(--n2);border-right:1px solid var(--n2)}
.n-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 26px;
  border:1px solid var(--n);border-radius:2px;background:transparent;color:var(--n);cursor:pointer;
  font-family:'Orbitron',sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  box-shadow:0 0 14px rgba(0,255,247,.15);transition:all .25s;width:100%}
.n-btn:hover:not(:disabled){background:rgba(0,255,247,.07);box-shadow:0 0 28px rgba(0,255,247,.3);transform:translateY(-1px)}
.n-btn:disabled{opacity:.3;cursor:not-allowed}
.n-btn-dl{border-color:var(--ok);color:var(--ok);box-shadow:0 0 14px rgba(0,255,136,.15)}
.n-btn-dl:hover:not(:disabled){background:rgba(0,255,136,.07);box-shadow:0 0 28px rgba(0,255,136,.3)}
.n-range{-webkit-appearance:none;width:100%;height:2px;background:linear-gradient(90deg,var(--n),var(--n2));
  outline:none;cursor:pointer;border-radius:0}
.n-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;
  background:var(--bg);border:2px solid var(--n);box-shadow:0 0 10px var(--n);cursor:pointer;transition:transform .15s}
.n-range::-webkit-slider-thumb:hover{transform:scale(1.5)}
.n-chip{display:inline-block;padding:3px 10px;border:1px solid rgba(0,255,247,.2);border-radius:2px;
  font-family:'Fira Code',monospace;font-size:9px;letter-spacing:.1em;color:rgba(0,255,247,.55);text-transform:uppercase}
.n-drop{border:1px dashed rgba(0,255,247,.22);border-radius:3px;cursor:pointer;transition:all .2s;position:relative}
.n-drop:hover,.n-drop.drag{border-color:var(--n);background:rgba(0,255,247,.03);box-shadow:inset 0 0 20px rgba(0,255,247,.04)}
.n-prog{height:3px;background:rgba(0,255,247,.08);border-radius:0;overflow:hidden}
.n-prog-fill{height:100%;background:linear-gradient(90deg,var(--n2),var(--n));box-shadow:0 0 6px var(--n);transition:width .35s}
/* format buttons */
.n-fmt{flex:1;padding:10px 6px 8px;border:1px solid var(--bdr);background:transparent;cursor:pointer;
  font-family:'Fira Code',monospace;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;
  position:relative;overflow:hidden}
.n-fmt .fn{font-size:11px;letter-spacing:.12em;color:var(--sub);transition:color .2s}
.n-fmt .fs{font-size:10px;transition:color .2s;letter-spacing:.04em;font-weight:500}
.n-fmt .fb{height:2px;width:100%;border-radius:0;transition:width .4s,background .4s;margin-top:2px}
.n-fmt.on{border-color:var(--n);background:rgba(0,255,247,.05);box-shadow:0 0 10px rgba(0,255,247,.12)}
.n-fmt.on .fn{color:var(--n)}
.n-fmt:hover:not(.on) .fn{color:rgba(0,255,247,.55)}
.n-preset{background:none;border:none;color:var(--sub);cursor:pointer;font-family:'Fira Code',monospace;
  font-size:9px;letter-spacing:.1em;padding:2px 4px;transition:color .15s}
.n-preset.on{color:var(--n);text-shadow:0 0 8px var(--n)}
.n-tog{display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid rgba(0,255,247,.2);
  border-radius:2px;background:rgba(0,255,247,.02);cursor:pointer;transition:all .2s}
.n-tog:hover{border-color:var(--n);box-shadow:0 0 8px rgba(0,255,247,.15)}
.n-ad{border:1px dashed rgba(0,255,247,.1);border-radius:2px;background:rgba(0,255,247,.01);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  position:relative;overflow:hidden}
.n-ad::after{content:'';position:absolute;top:0;bottom:0;width:25%;
  background:linear-gradient(90deg,transparent,rgba(0,255,247,.025),transparent);
  animation:shimmer 5s ease-in-out infinite}
.n-inp{background:rgba(0,0,0,.6);border:1px solid var(--bdr);color:var(--n);
  font-family:'Fira Code',monospace;font-size:11px;padding:8px 10px;border-radius:2px;
  outline:none;width:100%;transition:border-color .2s;letter-spacing:.06em}
.n-inp:focus{border-color:var(--n);box-shadow:0 0 10px rgba(0,255,247,.15)}
.n-inp::placeholder{color:var(--sub);opacity:.5}
/* neon unit pills */
.n-unit-wrap{display:flex;flex-direction:column;gap:3px;flex-shrink:0}
.n-unit{padding:5px 10px;border:1px solid var(--bdr);background:transparent;color:var(--sub);
  cursor:pointer;font-family:'Fira Code',monospace;font-size:9px;letter-spacing:.12em;
  border-radius:2px;transition:all .15s;text-align:center;min-width:44px}
.n-unit.on{border-color:var(--n2);color:var(--n2);background:rgba(191,0,255,.08);box-shadow:0 0 8px rgba(191,0,255,.2)}
.n-unit:hover:not(.on){border-color:rgba(191,0,255,.3);color:rgba(191,0,255,.6)}

/* ── CLEAN ─────────────────────────────────────────── */
.clean{font-family:'Plus Jakarta Sans',sans-serif;background:#f3f4f9;color:#0f1117;min-height:100vh}
.clean.dk{background:#0b0d14;color:#e8eaf2}
.pf{font-family:'Playfair Display',serif}
.c-card{background:#fff;border:1px solid #e2e5f0;border-radius:14px;
  box-shadow:0 2px 12px rgba(0,0,0,.05);transition:box-shadow .2s}
.clean.dk .c-card{background:#131720;border-color:#1e2538;box-shadow:none}
.c-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;
  border-radius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;
  box-shadow:0 4px 16px rgba(99,102,241,.28);transition:all .2s;width:100%}
.c-btn:hover:not(:disabled){box-shadow:0 8px 28px rgba(99,102,241,.4);transform:translateY(-1px)}
.c-btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.c-btn-dl{background:linear-gradient(135deg,#10b981,#06b6d4);box-shadow:0 4px 16px rgba(16,185,129,.25)}
.c-btn-dl:hover:not(:disabled){box-shadow:0 8px 28px rgba(16,185,129,.38)}
.c-range{-webkit-appearance:none;width:100%;height:6px;border-radius:99px;background:#e2e5f0;outline:none;cursor:pointer}
.clean.dk .c-range{background:#252a38}
.c-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;
  background:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.2);cursor:pointer;transition:transform .15s}
.c-range::-webkit-slider-thumb:hover{transform:scale(1.25)}
.c-drop{border:2px dashed #d1d5e8;border-radius:14px;cursor:pointer;transition:all .2s}
.clean.dk .c-drop{border-color:#1e2538}
.c-drop:hover,.c-drop.drag{border-color:#6366f1;background:rgba(99,102,241,.04)}
.c-prog{height:7px;border-radius:99px;background:#e2e5f0;overflow:hidden}
.clean.dk .c-prog{background:#1e2538}
.c-prog-fill{height:100%;background:linear-gradient(90deg,#6366f1,#06b6d4);border-radius:99px;transition:width .35s}
/* format buttons */
.c-fmt{flex:1;padding:12px 6px 10px;border:1.5px solid #e2e5f0;border-radius:10px;background:#fff;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;
  display:flex;flex-direction:column;align-items:center;gap:4px}
.clean.dk .c-fmt{background:#131720;border-color:#1e2538}
.c-fmt .fn{font-size:13px;font-weight:600;color:#6b7280;transition:color .15s}
.c-fmt .fs{font-size:12px;font-weight:600;transition:color .15s}
.c-fmt .fb{height:5px;border-radius:99px;width:80%;transition:width .4s,background .4s;margin-top:2px;background:#e2e5f0}
.clean.dk .c-fmt .fb{background:#1e2538}
.c-fmt.on{border-color:#6366f1;background:#f5f3ff}
.clean.dk .c-fmt.on{background:rgba(99,102,241,.1)}
.c-fmt.on .fn{color:#6366f1;font-weight:700}
.c-fmt:hover:not(.on) .fn{color:#4b5563}
.c-preset{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:11px;color:#9ca3af;padding:2px 4px;font-weight:400;transition:all .15s}
.c-preset.on{color:#6366f1;font-weight:700}
.c-tog{display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:10px;
  border:1.5px solid #e2e5f0;background:#fff;cursor:pointer;transition:all .2s}
.clean.dk .c-tog{background:#131720;border-color:#1e2538}
.c-tog:hover{border-color:#6366f1}
.c-lbl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:#6366f1;margin-bottom:6px;display:block}
.c-ad{border:1px dashed #d1d5e8;border-radius:12px;background:linear-gradient(135deg,#f9f9ff,#f3f4fd);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  position:relative;overflow:hidden}
.clean.dk .c-ad{border-color:#1e2538;background:linear-gradient(135deg,#131720,#0f131e)}
.c-ad::after{content:'';position:absolute;top:0;bottom:0;width:25%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
  animation:shimmer 5s ease-in-out infinite}
.clean.dk .c-ad::after{background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent)}
.c-inp{width:100%;padding:10px 12px;border:1.5px solid #e2e5f0;border-radius:9px;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#0f1117;background:#fff;
  outline:none;transition:border-color .15s,box-shadow .15s}
.clean.dk .c-inp{background:#0f1117;border-color:#1e2538;color:#e8eaf2}
.c-inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.c-inp::placeholder{color:#9ca3af}
/* clean unit pills */
.c-unit-wrap{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
.c-unit{padding:6px 12px;border:1.5px solid #e2e5f0;border-radius:8px;background:#fff;
  color:#6b7280;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:12px;font-weight:600;transition:all .15s;text-align:center;min-width:52px}
.clean.dk .c-unit{background:#131720;border-color:#1e2538;color:#6b7280}
.c-unit.on{border-color:#a855f7;color:#7c3aed;background:#faf5ff}
.clean.dk .c-unit.on{background:rgba(168,85,247,.1);border-color:rgba(168,85,247,.5)}
.c-unit:hover:not(.on){border-color:#a855f7;color:#a855f7}
`;

// ── Helpers ──────────────────────────────────────────────────────
const fmtBytes = (b) => {
  if (b === null || b === undefined) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
};

const toBytes = (num, unit) => {
  const n = parseFloat(num);
  if (isNaN(n) || n <= 0) return null;
  if (unit === "MB") return Math.round(n * 1048576);
  if (unit === "KB") return Math.round(n * 1024);
  return Math.round(n);
};

// ── Canvas compress ──────────────────────────────────────────────
function doCompress(file, quality, mime) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (mime === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0);
        c.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) { reject(new Error("toBlob null")); return; }
          resolve(blob);
        }, mime, quality / 100);
      } catch (e) { URL.revokeObjectURL(url); reject(e); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

// Binary-search quality to hit target bytes
async function searchQuality(file, targetBytes, mime) {
  let lo = 1, hi = 100, bestQ = 1, bestBlob = null;
  for (let i = 0; i < 10; i++) {
    const mid = Math.round((lo + hi) / 2);
    const blob = await doCompress(file, mid, mime);
    if (blob.size <= targetBytes) { lo = mid + 1; bestQ = mid; bestBlob = blob; }
    else hi = mid - 1;
    if (lo > hi) break;
  }
  if (!bestBlob) bestBlob = await doCompress(file, 1, mime);
  return { quality: bestQ, blob: bestBlob };
}

// ── Ad slot ──────────────────────────────────────────────────────
function Ad({ mode, size }) {
  const n = mode === "neon";
  const h = size === "top" ? 88 : size === "side" ? 250 : 64;
  const lbl = size === "top" ? "728×90 Leaderboard" : size === "side" ? "300×250 Rectangle" : "468×60 Banner";
  return (
    <div className={n ? "n-ad" : "c-ad"} style={{ width: "100%", height: h }}>
      <div style={{ fontSize: 9, fontFamily: n ? "Fira Code" : "Plus Jakarta Sans", letterSpacing: ".12em", textTransform: "uppercase", color: n ? "rgba(0,255,247,.18)" : "#c4c8db", fontWeight: 600 }}>
        {n ? "// GOOGLE ADSENSE //" : "Google AdSense"}
      </div>
      <div style={{ fontSize: 10, fontFamily: n ? "Fira Code" : "Plus Jakarta Sans", color: n ? "rgba(0,255,247,.1)" : "#d4d7e8" }}>{lbl}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function App() {
  const [uiMode, setUiMode] = useState("neon");
  const [dark, setDark]     = useState(true);

  const [file, setFile]       = useState(null);
  const [origUrl, setOrigUrl] = useState(null);
  const [origSize, setOrigSize] = useState(null);
  const [dims, setDims]       = useState(null);

  const [compBlob, setCompBlob] = useState(null);
  const [compUrl, setCompUrl]   = useState(null);
  const [compSize, setCompSize] = useState(null);

  const [quality, setQuality] = useState(80);
  const [fmt, setFmt]         = useState("image/jpeg");
  const [isDrag, setIsDrag]   = useState(false);
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState("");

  // live estimates: { "image/jpeg": bytes | null, ... }
  const [est, setEst]         = useState({});
  const [esting, setEsting]   = useState(false);
  const estTimer              = useRef(null);

  // target
  const [targetStr, setTargetStr]     = useState("");
  const [targetUnit, setTargetUnit]   = useState("KB");   // "MB" | "KB" | "B"
  const [targetBusy, setTargetBusy]   = useState(false);
  const [targetErr, setTargetErr]     = useState("");

  const fileRef = useRef(null);
  const isN     = uiMode === "neon";

  useEffect(() => () => {
    if (origUrl) URL.revokeObjectURL(origUrl);
    if (compUrl) URL.revokeObjectURL(compUrl);
  }, []); // eslint-disable-line

  const clearOut = useCallback(() => {
    if (compUrl) URL.revokeObjectURL(compUrl);
    setCompBlob(null); setCompUrl(null); setCompSize(null);
  }, [compUrl]);

  // Run estimates for all 3 formats at given quality, debounced
  const runEst = useCallback((f, q) => {
    if (!f) return;
    clearTimeout(estTimer.current);
    setEsting(true);
    setEst({});
    estTimer.current = setTimeout(async () => {
      const mimes = ["image/jpeg", "image/png", "image/webp"];
      const r = {};
      for (const m of mimes) {
        try { r[m] = (await doCompress(f, q, m)).size; }
        catch { r[m] = null; }
      }
      setEst(r); setEsting(false);
    }, 280);
  }, []);

  const loadFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please choose an image file (JPG, PNG, WebP, GIF, BMP)."); return; }
    setErr(""); clearOut();
    if (origUrl) URL.revokeObjectURL(origUrl);
    const url = URL.createObjectURL(f);
    setFile(f); setOrigUrl(url); setOrigSize(f.size); setEst({});
    const img = new Image();
    img.onload = () => { setDims({ w: img.naturalWidth, h: img.naturalHeight }); runEst(f, quality); };
    img.src = url;
  }, [origUrl, quality, clearOut, runEst]); // eslint-disable-line

  const onQ = (q) => { setQuality(q); clearOut(); if (file) runEst(file, q); };
  const onFmt = (m) => { setFmt(m); clearOut(); };
  const onInput = (e) => { if (e.target.files[0]) loadFile(e.target.files[0]); };
  const onDrop = (e) => { e.preventDefault(); setIsDrag(false); loadFile(e.dataTransfer.files[0]); };
  const onDOver = (e) => { e.preventDefault(); setIsDrag(true); };
  const onDLeave = () => setIsDrag(false);

  const compress = async () => {
    if (!file || busy) return;
    setBusy(true); setErr(""); clearOut();
    try {
      const blob = await doCompress(file, quality, fmt);
      setCompBlob(blob); setCompUrl(URL.createObjectURL(blob)); setCompSize(blob.size);
    } catch (e) { setErr("Compression failed: " + e.message); }
    finally { setBusy(false); }
  };

  const findTarget = async () => {
    const tb = toBytes(targetStr, targetUnit);
    if (!tb) { setTargetErr("Enter a valid number (e.g. 200)"); return; }
    if (!file) { setTargetErr("Load an image first."); return; }
    setTargetErr(""); setTargetBusy(true); clearOut();
    try {
      const { quality: q, blob } = await searchQuality(file, tb, fmt);
      setQuality(q);
      setCompBlob(blob); setCompUrl(URL.createObjectURL(blob)); setCompSize(blob.size);
      runEst(file, q);
    } catch (e) { setTargetErr("Search failed: " + e.message); }
    finally { setTargetBusy(false); }
  };

  const download = () => {
    if (!compBlob) return;
    const ext = fmt === "image/jpeg" ? "jpg" : fmt === "image/png" ? "png" : "webp";
    const a = document.createElement("a");
    a.href = compUrl; a.download = `compressed_${(file?.name || "image").replace(/\.[^.]+$/, "")}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const reset = () => {
    if (origUrl) URL.revokeObjectURL(origUrl); clearOut();
    setFile(null); setOrigUrl(null); setOrigSize(null); setDims(null);
    setErr(""); setEst({}); setTargetStr(""); setTargetErr(""); setTargetUnit("KB");
    if (fileRef.current) fileRef.current.value = "";
  };

  const savePct   = origSize && compSize ? (origSize - compSize) / origSize * 100 : null;
  const increased = savePct !== null && savePct < 0;
  const fmtLbl    = fmt === "image/jpeg" ? "JPG" : fmt === "image/png" ? "PNG" : "WebP";
  const barFill   = savePct !== null ? `${Math.min(100, Math.max(0, savePct < 0 ? 0 : savePct))}%` : "0%";

  // colour for a size value relative to original
  const sizeColor = (bytes, neon) => {
    if (!bytes || !origSize) return neon ? "rgba(0,255,247,.3)" : "#9ca3af";
    const r = bytes / origSize;
    if (r < 0.4)  return neon ? "#00ff88" : "#10b981";
    if (r < 0.75) return neon ? "#00fff7" : "#6366f1";
    if (r < 1.0)  return neon ? "#ffaa00" : "#f59e0b";
    return neon ? "#ff003c" : "#ef4444";
  };

  const barColor = (bytes, neon) => sizeColor(bytes, neon);
  const barWidth = (bytes) => {
    if (!bytes || !origSize) return "0%";
    return `${Math.min(100, (bytes / origSize) * 100).toFixed(1)}%`;
  };

  const FMTS = [
    { mime: "image/jpeg", label: "JPEG", note: "lossy" },
    { mime: "image/png",  label: "PNG",  note: "lossless" },
    { mime: "image/webp", label: "WebP", note: "modern" },
  ];

  // ── NEON ─────────────────────────────────────────────────────
  if (isN) return (
    <div className="neon">
      <style>{css}</style>
      <div className="n-grid" /><div className="n-glow" /><div className="scan-line" />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1060, margin: "0 auto", padding: "0 18px 60px" }}>

        <div style={{ paddingTop: 14, marginBottom: 4 }}><Ad mode="neon" size="top" /></div>

        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, border: "1px solid rgba(0,255,247,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00fff7", fontSize: 16 }}>⚡</div>
            <span className="orb" style={{ fontSize: 15, letterSpacing: ".12em", color: "#eef0ff", fontWeight: 700 }}>
              COMPRESS<span style={{ color: "#00fff7" }}>PRO</span>
            </span>
          </div>
          <button className="n-tog" onClick={() => setUiMode("clean")}>
            <span className="mono" style={{ fontSize: 9, color: "#00fff7", letterSpacing: ".1em" }}>CYBER</span>
            <div style={{ width: 36, height: 18, borderRadius: 9, background: "#00fff7", position: "relative" }}>
              <div style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#020210" }} />
            </div>
            <span className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".1em" }}>CLEAN</span>
          </button>
        </nav>

        {/* HERO */}
        <div style={{ marginBottom: 22 }}>
          <div className="n-chip" style={{ marginBottom: 10 }}>◈ client-side · zero uploads · live size preview</div>
          <h1 className="orb" style={{ fontSize: "clamp(22px,4vw,46px)", fontWeight: 900, lineHeight: 1.05 }}>
            <span style={{ color: "#eef0ff" }}>IMAGE </span><span className="holo-txt">COMPRESSOR</span>
          </h1>
          <p className="mono" style={{ fontSize: 9, color: "#8484bb", marginTop: 8, letterSpacing: ".06em" }}>
            // see real KB/MB per format · type target size → auto quality //
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: file ? "1fr 1fr" : "1fr", gap: 18 }}>
          {/* LEFT */}
          <div>
            {/* DROP ZONE */}
            <div className={`n-drop n-panel${isDrag ? " drag" : ""}`}
              style={{ padding: file ? "14px" : "38px 20px", textAlign: "center", marginBottom: 14 }}
              onDrop={onDrop} onDragOver={onDOver} onDragLeave={onDLeave}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onInput} />
              {!file ? (
                <>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>📂</div>
                  <p className="orb" style={{ fontSize: 11, color: isDrag ? "#00fff7" : "#eef0ff", letterSpacing: ".08em", marginBottom: 5 }}>
                    {isDrag ? "◈ RELEASE TO LOAD ◈" : "DROP YOUR IMAGE HERE"}
                  </p>
                  <p className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".1em" }}>
                    JPG · PNG · WebP · GIF · BMP — or click to browse
                  </p>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <img src={origUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", border: "1px solid rgba(0,255,247,.3)", borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 10, color: "#eef0ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                    <div className="mono" style={{ fontSize: 9, color: "#8484bb", marginTop: 3 }}>
                      {fmtBytes(origSize)}{dims ? ` · ${dims.w}×${dims.h}px` : ""}
                      {origSize && <span style={{ color: "rgba(0,255,247,.35)", marginLeft: 6 }}>({origSize.toLocaleString()} B)</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); reset(); }}
                    style={{ background: "none", border: "1px solid rgba(255,0,60,.3)", color: "#ff003c", padding: "4px 8px", cursor: "pointer", borderRadius: 2, fontSize: 10, fontFamily: "Fira Code", flexShrink: 0 }}>✕</button>
                </div>
              )}
            </div>

            {/* CONTROLS PANEL */}
            <div className="n-panel n-corner" style={{ padding: 20, marginBottom: 14 }}>

              {/* Quality slider */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".14em" }}>QUALITY</span>
                  <span className="orb" style={{ fontSize: 30, color: "#00fff7", textShadow: "0 0 16px rgba(0,255,247,.5)", fontWeight: 900, lineHeight: 1 }}>{quality}%</span>
                </div>
                <input type="range" className="n-range" min={1} max={100} value={quality} onChange={(e) => onQ(+e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  {[["TINY", 20], ["WEB", 70], ["HIGH", 88], ["MAX", 100]].map(([l, v]) => (
                    <button key={l} className={`n-preset${quality === v ? " on" : ""}`} onClick={() => onQ(v)}>{l}</button>
                  ))}
                </div>
              </div>

              {/* FORMAT BUTTONS WITH LIVE SIZE */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".14em" }}>FORMAT · LIVE SIZE ESTIMATE</span>
                  {file && <span className={`mono${esting ? " pulsing" : ""}`} style={{ fontSize: 8, color: "rgba(0,255,247,.25)", letterSpacing: ".06em" }}>
                    {esting ? "◌ calculating…" : "◈ at Q" + quality}
                  </span>}
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {FMTS.map(({ mime, label }) => {
                    const sz = est[mime];
                    const col = sizeColor(sz, true);
                    const bw = barWidth(sz);
                    return (
                      <button key={mime} className={`n-fmt${fmt === mime ? " on" : ""}`}
                        onClick={() => onFmt(mime)}>
                        <span className="fn">{label}</span>
                        <span className={`fs${esting ? " pulsing" : ""}`} style={{ color: col }}>
                          {esting ? "…" : sz ? fmtBytes(sz) : file ? "—" : "—"}
                        </span>
                        {/* exact bytes */}
                        {!esting && sz && (
                          <span className="mono" style={{ fontSize: 7, color: "rgba(0,255,247,.2)", letterSpacing: ".04em" }}>
                            {sz.toLocaleString()} B
                          </span>
                        )}
                        {/* size bar */}
                        <div style={{ width: "100%", height: 2, background: "rgba(0,255,247,.06)", borderRadius: 0, overflow: "hidden", marginTop: 2 }}>
                          <div style={{ width: bw, height: "100%", background: col, transition: "width .4s,background .4s" }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                {file && !esting && Object.keys(est).length > 0 && (
                  <p className="mono" style={{ fontSize: 8, color: "rgba(0,255,247,.2)", letterSpacing: ".06em" }}>
                    bar = % of original · original: {fmtBytes(origSize)} ({origSize?.toLocaleString()} B)
                  </p>
                )}
              </div>

              <button className="n-btn" disabled={!file || busy} onClick={compress}>
                {busy ? <><span className="spin">◌</span>&nbsp;PROCESSING…</> : "⚡ COMPRESS IMAGE"}
              </button>
              {err && <div className="mono" style={{ marginTop: 8, fontSize: 10, color: "#ff003c" }}>⚠ {err}</div>}
            </div>
          </div>

          {/* RIGHT: before/after */}
          {file && (
            <div>
              <div className="n-panel n-corner" style={{ overflow: "hidden", marginBottom: 14 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #18183a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".12em" }}>◈ BEFORE / AFTER</span>
                  {dims && <span className="mono" style={{ fontSize: 9, color: "rgba(0,255,247,.3)" }}>{dims.w}×{dims.h}px</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ borderRight: "1px solid #18183a" }}>
                    <div style={{ padding: "6px 10px", borderBottom: "1px solid #18183a", display: "flex", justifyContent: "space-between" }}>
                      <span className="mono" style={{ fontSize: 8, color: "#8484bb" }}>ORIGINAL</span>
                      <span className="mono" style={{ fontSize: 8, color: "#ff6b6b" }}>{fmtBytes(origSize)}</span>
                    </div>
                    <div style={{ background: "rgba(0,0,0,.4)", aspectRatio: "4/3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={origUrl} alt="original" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ padding: "6px 10px", borderBottom: "1px solid rgba(0,255,247,.07)", display: "flex", justifyContent: "space-between" }}>
                      <span className="mono" style={{ fontSize: 8, color: "#8484bb" }}>COMPRESSED</span>
                      {compSize !== null
                        ? <span className="mono" style={{ fontSize: 8, color: "#00ff88" }}>{fmtBytes(compSize)}</span>
                        : <span className="mono blink" style={{ fontSize: 8, color: "rgba(0,255,247,.3)" }}>{busy ? "PROCESSING" : "PENDING"}</span>}
                    </div>
                    <div style={{ background: "rgba(0,0,0,.4)", aspectRatio: "4/3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {compUrl
                        ? <img src={compUrl} alt="compressed" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        : <div style={{ textAlign: "center" }}>
                            {busy
                              ? <span className="spin orb" style={{ fontSize: 22, color: "#00fff7" }}>◌</span>
                              : <><div style={{ fontSize: 24, marginBottom: 6 }}>⚡</div>
                                  <div className="mono" style={{ fontSize: 9, color: "rgba(0,255,247,.2)", letterSpacing: ".08em" }}>AWAITING</div></>}
                          </div>}
                    </div>
                  </div>
                </div>
              </div>
              <Ad mode="neon" size="side" />
            </div>
          )}
        </div>

        {/* ── TARGET SIZE — full-width, clearly separated ── */}
        <div style={{ margin: "24px 0", position: "relative" }}>
          {/* divider line with label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(191,0,255,.4),rgba(191,0,255,.08))" }} />
            <span className="orb" style={{ fontSize: 8, color: "rgba(191,0,255,.5)", letterSpacing: ".2em" }}>OR USE TARGET SIZE</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg,rgba(191,0,255,.4),rgba(191,0,255,.08))" }} />
          </div>
          <div className="n-panel" style={{ padding: 22, border: "1px solid rgba(191,0,255,.3)", background: "linear-gradient(135deg,rgba(11,4,28,.98),rgba(4,2,18,1))" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(191,0,255,.7),rgba(0,255,247,.4),transparent)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <div>
                    <div className="orb" style={{ fontSize: 10, color: "#bf00ff", letterSpacing: ".18em", textShadow: "0 0 12px rgba(191,0,255,.6)" }}>TARGET FILE SIZE</div>
                    <div className="mono" style={{ fontSize: 8, color: "rgba(191,0,255,.4)", letterSpacing: ".1em", marginTop: 2 }}>AUTO-FIND QUALITY · BINARY SEARCH · {fmt === "image/jpeg" ? "JPEG" : fmt === "image/png" ? "PNG" : "WEBP"} FORMAT</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  {/* number input */}
                  <input className="n-inp" type="number" min="0" placeholder="e.g. 200"
                    style={{ borderColor: "rgba(191,0,255,.3)", color: "#cf80ff", background: "rgba(80,0,120,.1)" }}
                    value={targetStr} onChange={(e) => { setTargetStr(e.target.value); setTargetErr(""); }}
                    onKeyDown={(e) => e.key === "Enter" && findTarget()} />
                  {/* unit selector pills */}
                  <div className="n-unit-wrap">
                    {["MB","KB","B"].map(u => (
                      <button key={u} className={`n-unit${targetUnit===u?" on":""}`}
                        onClick={() => setTargetUnit(u)}>{u}</button>
                    ))}
                  </div>
                  {/* GO button */}
                  <button onClick={findTarget} disabled={!file || targetBusy}
                    style={{ background: "linear-gradient(135deg,rgba(191,0,255,.2),rgba(191,0,255,.08))", border: "1px solid rgba(191,0,255,.5)", color: "#cf80ff", padding: "8px 16px", cursor: "pointer", fontFamily: "Fira Code", fontSize: 9, letterSpacing: ".14em", flexShrink: 0, opacity: (!file || targetBusy) ? .35 : 1, transition: "all .2s", boxShadow: "0 0 16px rgba(191,0,255,.2)", alignSelf: "flex-start", height: 34 }}>
                    {targetBusy ? <span className="spin">◌</span> : "GO →"}
                  </button>
                </div>
                {/* live preview of what the target means in bytes */}
                {targetStr && !targetErr && (
                  <div className="mono" style={{ fontSize: 8, color: "rgba(191,0,255,.45)", marginTop: 6, letterSpacing: ".08em" }}>
                    = {toBytes(targetStr, targetUnit)?.toLocaleString()} bytes
                  </div>
                )}
                {targetBusy && <div className="mono" style={{ fontSize: 8, color: "rgba(191,0,255,.5)", marginTop: 8, letterSpacing: ".08em" }}><span className="spin">◌</span>&nbsp; binary searching optimal quality…</div>}
                {targetErr && <p className="mono" style={{ fontSize: 9, color: "#ff003c", marginTop: 8 }}>⚠ {targetErr}</p>}
                {!targetBusy && !targetErr && <p className="mono" style={{ fontSize: 8, color: "rgba(191,0,255,.28)", marginTop: 8, letterSpacing: ".06em" }}>finds highest quality that produces a file ≤ your target · updates quality slider automatically</p>}
              </div>
              {/* visual hint */}
              <div style={{ textAlign: "center", padding: "0 10px" }}>
                <div className="mono" style={{ fontSize: 8, color: "rgba(191,0,255,.25)", letterSpacing: ".1em", marginBottom: 6 }}>EXAMPLE</div>
                {[["500 KB", "75%"], ["200 KB", "52%"], ["1 MB", "88%"]].map(([sz, q]) => (
                  <div key={sz} style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 9, color: "rgba(191,0,255,.4)" }}>{sz}</span>
                    <span className="mono" style={{ fontSize: 9, color: "rgba(0,255,247,.25)" }}>→ Q{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {compSize !== null && (
          <div className="n-panel fadeup" style={{ padding: 18, marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[
                    { l: "ORIGINAL",   v: fmtBytes(origSize), sub: origSize?.toLocaleString() + " B", c: "#ff6b6b" },
                    { l: "COMPRESSED", v: fmtBytes(compSize),  sub: compSize?.toLocaleString() + " B", c: "#00ff88" },
                    { l: increased ? "INCREASED" : "SAVED",
                      v: `${Math.abs(savePct).toFixed(1)}%`,
                      sub: `${fmtBytes(Math.abs(origSize - compSize))}`,
                      c: increased ? "#ffaa00" : "#00fff7" },
                  ].map((st) => (
                    <div key={st.l} style={{ border: "1px solid #18183a", padding: "10px 6px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${st.c},transparent)` }} />
                      <div className="orb" style={{ fontSize: 17, fontWeight: 900, color: st.c, textShadow: `0 0 12px ${st.c}`, lineHeight: 1 }}>{st.v}</div>
                      <div className="mono" style={{ fontSize: 8, color: "#8484bb", letterSpacing: ".08em", marginTop: 4 }}>{st.l}</div>
                      <div className="mono" style={{ fontSize: 7, color: "rgba(0,255,247,.25)", marginTop: 2 }}>{st.sub}</div>
                    </div>
                  ))}
                </div>
                {/* format + quality info */}
                <div style={{ padding: "7px 10px", background: "rgba(0,0,0,.35)", border: "1px solid #18183a", marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 9, color: "#8484bb", letterSpacing: ".06em" }}>
                    {fmtLbl} · Q{quality} · {dims?.w}×{dims?.h}px
                    &nbsp;·&nbsp;
                    {origSize?.toLocaleString()} B <span style={{ color: "#8484bb" }}>→</span> <span style={{ color: "#00ff88" }}>{compSize?.toLocaleString()} B</span>
                  </span>
                </div>
                <div className="n-prog" style={{ marginBottom: 14 }}>
                  <div className="n-prog-fill" style={{ width: barFill }} />
                </div>
                <button className="n-btn n-btn-dl" onClick={download}>
                  ↓ DOWNLOAD {fmtLbl} · {fmtBytes(compSize)}
                </button>
              </div>
            )}
        <div style={{ marginTop: 20 }}><Ad mode="neon" size="bottom" /></div>
      </div>
    </div>
  );

  // ── CLEAN ─────────────────────────────────────────────────────
  const T   = dark ? "#e8eaf2" : "#0f1117";
  const S   = dark ? "#9ca3af" : "#4b5563";
  const B   = dark ? "#1e2538" : "#e2e5f0";
  const BG2 = dark ? "#131720" : "#fff";
  const BG3 = dark ? "#1a1f2e" : "#f3f4f9";

  return (
    <div className={`clean${dark ? " dk" : ""}`}>
      <style>{css}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: dark
          ? "radial-gradient(ellipse 65% 45% at 15% 0%,rgba(99,102,241,.08) 0%,transparent 55%),radial-gradient(ellipse 55% 55% at 85% 90%,rgba(6,182,212,.06) 0%,transparent 55%)"
          : "radial-gradient(ellipse 65% 45% at 15% 0%,rgba(99,102,241,.05) 0%,transparent 55%),radial-gradient(ellipse 55% 55% at 85% 90%,rgba(6,182,212,.04) 0%,transparent 55%)" }} />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1060, margin: "0 auto", padding: "0 18px 60px" }}>

        <div style={{ paddingTop: 14 }}><Ad mode="clean" size="top" /></div>

        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span className="pf" style={{ fontSize: 19, fontWeight: 700, color: T }}>
              Compress<em style={{ color: "#6366f1" }}>Pro</em>
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDark(!dark)} style={{ padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${B}`, background: "transparent", cursor: "pointer", color: T, fontSize: 14 }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button className="c-tog" onClick={() => setUiMode("neon")}>
              <span style={{ fontSize: 12, fontWeight: 500, color: S }}>Clean</span>
              <div style={{ width: 36, height: 18, borderRadius: 9, background: "#e2e5f0", position: "relative" }}>
                <div style={{ position: "absolute", top: 2, left: 2, width: 14, height: 14, borderRadius: "50%", background: "#9ca3af" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>✦ Cyber</span>
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ marginBottom: 22 }}>
          <span className="c-lbl">Client-Side · Zero Uploads · Live Size Preview</span>
          <h1 className="pf" style={{ fontSize: "clamp(22px,4vw,46px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-.02em", color: T }}>
            Image{" "}<em style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Compressor</em>
          </h1>
          <p style={{ fontSize: 13, color: S, marginTop: 7, lineHeight: 1.7 }}>
            Each format shows its real KB/MB live · type a target size to auto-find quality.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: file ? "1fr 1fr" : "1fr", gap: 18 }}>
          {/* LEFT */}
          <div>
            {/* DROP ZONE */}
            <div className={`c-drop${isDrag ? " drag" : ""}`}
              style={{ padding: file ? "14px" : "38px 20px", textAlign: "center", marginBottom: 14, background: BG2 }}
              onDrop={onDrop} onDragOver={onDOver} onDragLeave={onDLeave}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onInput} />
              {!file ? (
                <>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: dark ? "#1a1f2e" : "#f0f2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 20 }}>📂</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: isDrag ? "#6366f1" : T, marginBottom: 4 }}>
                    {isDrag ? "Drop it here!" : "Drag & drop your image"}
                  </p>
                  <p style={{ fontSize: 12, color: S }}>JPG · PNG · WebP · GIF · BMP — or click to browse</p>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <img src={origUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: `1px solid ${B}`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: S, marginTop: 2 }}>
                      {fmtBytes(origSize)} · {dims ? `${dims.w}×${dims.h}px` : ""}
                      {origSize && <span style={{ color: "#9ca3af", marginLeft: 6, fontSize: 11 }}>({origSize.toLocaleString()} B)</span>}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); reset(); }}
                    style={{ background: "none", border: "1.5px solid #fca5a5", color: "#ef4444", padding: "4px 10px", cursor: "pointer", borderRadius: 7, fontSize: 12, fontFamily: "Plus Jakarta Sans", fontWeight: 600, flexShrink: 0 }}>✕</button>
                </div>
              )}
            </div>

            {/* CONTROLS */}
            <div className="c-card" style={{ padding: 22, marginBottom: 14 }}>

              {/* Quality */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                  <span className="c-lbl" style={{ marginBottom: 0 }}>Quality</span>
                  <span className="pf" style={{ fontSize: 28, fontWeight: 700, color: "#6366f1", lineHeight: 1 }}>{quality}%</span>
                </div>
                <input type="range" className="c-range" min={1} max={100} value={quality} onChange={(e) => onQ(+e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  {[["Tiny", 20], ["Web", 70], ["High", 88], ["Max", 100]].map(([l, v]) => (
                    <button key={l} className={`c-preset${quality === v ? " on" : ""}`}
                      onClick={() => onQ(v)} style={{ color: quality === v ? "#6366f1" : S }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* FORMAT + LIVE SIZE */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="c-lbl" style={{ marginBottom: 0 }}>Output Format</span>
                  {file && (
                    <span style={{ fontSize: 11, color: esting ? "#6366f1" : S, fontWeight: 500 }}>
                      {esting ? "⚙ estimating sizes…" : `● live at Q${quality}`}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {FMTS.map(({ mime, label, note }) => {
                    const sz = est[mime];
                    const col = sizeColor(sz, false);
                    const bw = barWidth(sz);
                    const isActive = fmt === mime;
                    return (
                      <button key={mime} className={`c-fmt${isActive ? " on" : ""}`} onClick={() => onFmt(mime)}>
                        <span className="fn">{label}</span>
                        <span className={`fs${esting ? " pulsing" : ""}`} style={{ color: esting ? S : sz ? col : S }}>
                          {esting ? "…" : sz ? fmtBytes(sz) : note}
                        </span>
                        {/* exact bytes */}
                        {!esting && sz && (
                          <span style={{ fontSize: 10, color: S, fontFamily: "Plus Jakarta Sans" }}>
                            {sz.toLocaleString()} B
                          </span>
                        )}
                        {/* size bar */}
                        <div style={{ width: "100%", height: 5, background: dark ? "#1e2538" : "#e2e5f0", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: bw, height: "100%", background: sz ? col : (dark ? "#1e2538" : "#e2e5f0"), borderRadius: 99, transition: "width .4s,background .4s" }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
                {file && !esting && Object.keys(est).length > 0 && (
                  <p style={{ fontSize: 11, color: S, marginTop: 7, lineHeight: 1.5 }}>
                    Bar = % of original · original: {fmtBytes(origSize)} ({origSize?.toLocaleString()} B)
                  </p>
                )}
              </div>

              <button className="c-btn" disabled={!file || busy} onClick={compress}>
                {busy ? <><span className="spin">⚙</span>&nbsp;Compressing…</> : "⚡ Compress Image"}
              </button>
              {err && <div style={{ marginTop: 8, fontSize: 12, color: "#ef4444", fontWeight: 500 }}>⚠ {err}</div>}
            </div>
          </div>

          {/* RIGHT: before/after */}
          {file && (
            <div>
              <div className="c-card" style={{ overflow: "hidden", marginBottom: 14 }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${B}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="c-lbl" style={{ marginBottom: 0 }}>Before / After</span>
                  {dims && <span style={{ fontSize: 11, color: S, fontWeight: 500 }}>{dims.w}×{dims.h}px</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ borderRight: `1px solid ${B}` }}>
                    <div style={{ padding: "7px 10px", borderBottom: `1px solid ${B}`, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: S }}>Original</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444" }}>{fmtBytes(origSize)}</span>
                    </div>
                    <div style={{ background: BG3, aspectRatio: "4/3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={origUrl} alt="original" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ padding: "7px 10px", borderBottom: `1px solid rgba(99,102,241,.15)`, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: S }}>Compressed</span>
                      {compSize !== null
                        ? <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{fmtBytes(compSize)}</span>
                        : <span style={{ fontSize: 11, color: "#9ca3af" }}>{busy ? "Processing…" : "Pending"}</span>}
                    </div>
                    <div style={{ background: BG3, aspectRatio: "4/3", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {compUrl
                        ? <img src={compUrl} alt="compressed" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        : <div style={{ textAlign: "center" }}>
                            {busy ? <span className="spin" style={{ fontSize: 26 }}>⚙</span>
                              : <><div style={{ fontSize: 26, marginBottom: 6 }}>⚡</div>
                                  <div style={{ fontSize: 12, color: S, fontWeight: 500 }}>Awaiting compression</div></>}
                          </div>}
                    </div>
                  </div>
                </div>
              </div>
              <Ad mode="clean" size="side" />
            </div>
          )}
        </div>

        {/* ── TARGET SIZE — full-width, clearly separated ── */}
        <div style={{ margin: "24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg,#a855f7,${dark ? "rgba(168,85,247,.08)" : "rgba(168,85,247,.12)"})` }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#a855f7", whiteSpace: "nowrap" }}>— or use target size —</span>
            <div style={{ flex: 1, height: 1.5, background: `linear-gradient(270deg,#a855f7,${dark ? "rgba(168,85,247,.08)" : "rgba(168,85,247,.12)"})` }} />
          </div>
          <div style={{ background: dark ? "#0f0d1e" : "#faf5ff", border: `1.5px solid ${dark ? "rgba(168,85,247,.35)" : "#c4b5fd"}`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6366f1,#a855f7,#06b6d4)", borderRadius: "16px 16px 0 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>🎯</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#7c3aed", letterSpacing: "-.01em" }}>Target File Size</div>
                    <div style={{ fontSize: 12, color: S, marginTop: 1 }}>Auto-finds the highest quality that fits within your target · uses selected format ({fmtLbl})</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {/* number input */}
                  <input className="c-inp" type="number" min="0" placeholder="e.g. 200"
                    style={{ borderColor: dark ? "rgba(168,85,247,.4)" : "#c4b5fd", background: dark ? "rgba(99,102,241,.07)" : "#fff", fontSize: 15, fontWeight: 600 }}
                    value={targetStr} onChange={(e) => { setTargetStr(e.target.value); setTargetErr(""); }}
                    onKeyDown={(e) => e.key === "Enter" && findTarget()} />
                  {/* unit selector pills */}
                  <div className="c-unit-wrap">
                    {["MB","KB","B"].map(u => (
                      <button key={u} className={`c-unit${targetUnit===u?" on":""}`}
                        onClick={() => setTargetUnit(u)}>{u}</button>
                    ))}
                  </div>
                  {/* Find button */}
                  <button onClick={findTarget} disabled={!file || targetBusy}
                    style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", cursor: "pointer", fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 800, flexShrink: 0, opacity: (!file || targetBusy) ? .4 : 1, transition: "all .2s", boxShadow: "0 4px 16px rgba(99,102,241,.35)", whiteSpace: "nowrap", alignSelf: "flex-start", height: 42 }}>
                    {targetBusy ? <span className="spin" style={{ fontSize: 14 }}>⚙</span> : "Find →"}
                  </button>
                </div>
                {/* live byte preview */}
                {targetStr && !targetErr && (
                  <div style={{ fontSize: 12, color: "#a855f7", marginTop: 6, fontWeight: 500 }}>
                    = {toBytes(targetStr, targetUnit)?.toLocaleString()} bytes
                  </div>
                )}
                {targetBusy && <div style={{ fontSize: 12, color: "#7c3aed", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><span className="spin" style={{ fontSize: 12 }}>⚙</span> Binary-searching optimal quality level…</div>}
                {targetErr && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 10, fontWeight: 600 }}>⚠ {targetErr}</div>}
                {!targetBusy && !targetErr && <p style={{ fontSize: 12, color: S, marginTop: 10 }}>Runs up to 10 iterations to find the best quality. Result updates the slider above.</p>}
              </div>
              <div style={{ padding: "14px 18px", borderRadius: 12, background: dark ? "rgba(99,102,241,.07)" : "#ede9fe", border: `1px solid ${dark ? "rgba(168,85,247,.2)" : "#ddd6fe"}`, minWidth: 130 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a855f7", marginBottom: 10 }}>Examples</div>
                {[["200 KB", "~52%"], ["500 KB", "~75%"], ["1 MB", "~88%"]].map(([sz, q]) => (
                  <div key={sz} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>{sz}</span>
                    <span style={{ fontSize: 12, color: S }}>→ Q{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {compSize !== null && (
          <div className="c-card fadeup" style={{ padding: 20, marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
                  {[
                    { l: "Original",   v: fmtBytes(origSize), sub: origSize?.toLocaleString() + " B", c: "#ef4444" },
                    { l: "Compressed", v: fmtBytes(compSize),  sub: compSize?.toLocaleString() + " B", c: "#10b981" },
                    { l: increased ? "Increased" : "Saved",
                      v: `${Math.abs(savePct).toFixed(1)}%`,
                      sub: fmtBytes(Math.abs(origSize - compSize)),
                      c: increased ? "#f59e0b" : "#6366f1" },
                  ].map((st) => (
                    <div key={st.l} style={{ padding: "12px 6px", borderRadius: 10, background: BG3, border: `1px solid ${B}`, textAlign: "center" }}>
                      <div className="pf" style={{ fontSize: 19, fontWeight: 700, color: st.c, lineHeight: 1 }}>{st.v}</div>
                      <div style={{ fontSize: 10, color: S, marginTop: 3, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>{st.l}</div>
                      <div style={{ fontSize: 11, color: S, marginTop: 3, fontFamily: "monospace" }}>{st.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "9px 12px", borderRadius: 8, background: BG3, border: `1px solid ${B}`, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: S, lineHeight: 1.9 }}>
                    <span style={{ fontWeight: 700, color: "#ef4444" }}>{origSize?.toLocaleString()} B</span>
                    <span style={{ margin: "0 6px" }}>→</span>
                    <span style={{ fontWeight: 700, color: "#10b981" }}>{compSize?.toLocaleString()} B</span>
                    <span style={{ margin: "0 8px", color: B }}>·</span>
                    <span style={{ fontWeight: 600 }}>{fmtLbl}</span>
                    <span style={{ margin: "0 4px" }}>@</span>
                    <span style={{ color: "#6366f1", fontWeight: 600 }}>Q{quality}</span>
                    {dims && <span style={{ float: "right", color: S }}>{dims.w}×{dims.h}px</span>}
                  </div>
                </div>
                <div className="c-prog" style={{ marginBottom: 14 }}>
                  <div className="c-prog-fill" style={{ width: barFill }} />
                </div>
                <button className="c-btn c-btn-dl" onClick={download}>
                  ↓ Download {fmtLbl} — {fmtBytes(compSize)}
                </button>
              </div>
            )}
        <div style={{ marginTop: 20 }}><Ad mode="clean" size="bottom" /></div>
      </div>
    </div>
  );
}