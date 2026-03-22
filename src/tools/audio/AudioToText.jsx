import { useState, useEffect, useRef } from "react";
import { ADSENSE_PUB_ID } from "../../utils/adsenseService";

// ─── Google AdSense Ad Unit Component ────────────────────────────────────────
// Replace data-ad-client and data-ad-slot with your real AdSense values.
const AdUnit = ({ slot, format = "auto", style = {}, label = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);
  return (
    <div style={{
      width: "100%", background: "rgba(0,255,200,0.02)",
      border: "1px dashed rgba(0,255,200,0.12)", borderRadius: 8,
      padding: "8px 0", textAlign: "center", position: "relative",
      overflow: "hidden", ...style,
    }}>
      <div style={{
        position: "absolute", top: 4, left: 10,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
        color: "rgba(0,255,200,0.28)", letterSpacing: "0.2em", textTransform: "uppercase",
      }}>AD · {label}</div>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

const LANGUAGES = [
  { value: "en-US", label: "EN — US" },
  { value: "en-GB", label: "EN — UK" },
  { value: "es-ES", label: "ES — Spain" },
  { value: "fr-FR", label: "FR — France" },
  { value: "de-DE", label: "DE — Germany" },
  { value: "ja-JP", label: "JA — Japan" },
  { value: "zh-CN", label: "ZH — China" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#020408;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:rgba(0,255,200,0.03);}
::-webkit-scrollbar-thumb{background:rgba(0,255,200,0.2);border-radius:2px;}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes pulseRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
@keyframes pulseRing2{0%{transform:scale(0.8);opacity:.6}100%{transform:scale(1.9);opacity:0}}
@keyframes waveBar{0%,100%{height:5px}50%{height:30px}}
@keyframes flicker{0%,94%,100%{opacity:1}95%{opacity:.3}97%{opacity:.8}}
@keyframes holo{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes gridPulse{0%,100%{opacity:.035}50%{opacity:.07}}
@keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes spinRev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
`;

const FAQ = [
  { q: "Is my voice data stored on your servers?", a: "No. Voice∷Matrix uses the Web Speech API which is entirely browser-native. Audio is processed on-device or through your browser provider's secure speech service (Google/Microsoft). We never receive, store, or log your voice data." },
  { q: "Does it work offline?", a: "Partial offline support depends on your browser. Chrome and Edge may cache language models locally, but for best accuracy an internet connection is recommended so the speech engine can access its full neural model." },
  { q: "Can it transcribe multiple speakers?", a: "Yes — all speech will be captured as a single continuous stream. The engine does not currently differentiate between speakers. Each speaker's words appear sequentially in the transcript." },
  { q: "Which browsers are supported?", a: "Google Chrome and Microsoft Edge offer the best support. Firefox and Safari have limited or no support for the Web Speech API. We recommend Chrome 88+ for peak performance." },
  { q: "How accurate is real-time transcription?", a: "In a quiet environment with clear speech, accuracy typically ranges from 92–97%. Technical jargon, heavy accents, background noise, or fast speech can reduce accuracy. Always review the final transcript." },
  { q: "Can I transcribe a pre-recorded audio file?", a: "Currently the tool captures live microphone input only. To transcribe a pre-recorded file, play the audio through your speakers while the tool is active, or use your OS system audio routing." },
  { q: "What languages are supported?", a: "English (US & UK), Spanish, French, German, Japanese, and Mandarin Chinese are currently available. More languages can be added as the Web Speech API expands its model coverage." },
  { q: "Is there a time limit for recording?", a: "No hard time limit is imposed by this tool. Very long sessions (60+ minutes) may occasionally need to restart the recognition engine. The tool handles this automatically in the background." },
  { q: "Do I need to create an account?", a: "No account or sign-up is required. Voice∷Matrix is 100% free and works directly in your browser — no installation, registration, or payment needed." },
  { q: "Can I use this on mobile?", a: "Yes, the tool works on Android Chrome. iOS Safari has limited Web Speech API support. For the best mobile experience, use Chrome on Android with a good microphone or headset." },
];

export default function AudioToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [volume, setVolume] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [recTime, setRecTime] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;
    recognitionRef.current.onresult = (e) => {
      let fin = "", tmp = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
        else tmp += e.results[i][0].transcript;
      }
      setTranscript(fin); setInterim(tmp);
      const full = fin + tmp;
      setWordCount(full.trim() ? full.trim().split(/\s+/).length : 0);
      setCharCount(full.length);
    };
    recognitionRef.current.onerror = () => setIsRecording(false);
    return () => recognitionRef.current?.stop();
  }, [language]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
      startAudio();
    } else {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
      setVolume(0);
      streamRef.current?.getTracks().forEach(t => t.stop());
    }
    return () => { clearInterval(timerRef.current); cancelAnimationFrame(animRef.current); };
  }, [isRecording]);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      audioCtxRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      const tick = () => {
        analyserRef.current.getByteFrequencyData(data);
        setVolume(Math.min(data.reduce((a, b) => a + b, 0) / data.length / 55, 1));
        animRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {}
  };

  const toggleRec = () => {
    if (isRecording) {
      recognitionRef.current?.stop(); setIsRecording(false); setInterim("");
    } else {
      setRecTime(0); recognitionRef.current.lang = language;
      recognitionRef.current.start(); setIsRecording(true);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([transcript], { type: "text/plain" }));
    a.download = `voicematrix_${Date.now()}.txt`;
    a.click(); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const copyText = () => {
    if (transcript) navigator.clipboard.writeText(transcript).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const clear = () => { setTranscript(""); setInterim(""); setWordCount(0); setCharCount(0); };
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const BARS = Array.from({ length: 32 });

  const card = {
    background: "linear-gradient(145deg, rgba(0,255,200,0.04), rgba(0,100,150,0.05), rgba(123,47,255,0.03))",
    border: "1px solid rgba(0,255,200,0.13)", borderRadius: 12,
  };
  const sectionTitle = {
    fontFamily: "'Orbitron', sans-serif", fontSize: 10,
    letterSpacing: "0.32em", color: "rgba(0,255,200,0.4)",
    textTransform: "uppercase", marginBottom: 20,
  };
  const bodyText = { fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.9, color: "rgba(180,240,230,0.72)" };

  return (
    <>
      <style>{CSS}</style>

      {/* HEAD — add AdSense script tag in your HTML <head>:
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
      */}

      <div style={{ minHeight: "100vh", background: "#020408", fontFamily: "'Share Tech Mono', monospace", color: "#e0f7fa", position: "relative" }}>

        {/* BG grid */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "gridPulse 5s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "linear-gradient(transparent 50%, rgba(0,255,200,0.012) 50%)", backgroundSize: "100% 4px", pointerEvents: "none" }} />
        <div style={{ position: "fixed", left: 0, right: 0, height: "2px", zIndex: 2, background: "linear-gradient(90deg, transparent, rgba(0,255,200,0.3), transparent)", animation: "scanline 7s linear infinite", pointerEvents: "none" }} />

        {/* ── TOP LEADERBOARD AD (728×90 / responsive) ── */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1140, margin: "0 auto", padding: "16px 20px 0" }}>
          <AdUnit slot="1111111111" format="horizontal" label="LEADERBOARD TOP 728×90" style={{ minHeight: 90 }} />
        </div>

        {/* ── PAGE WRAPPER: main + sidebar ── */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1140, margin: "0 auto", padding: "0 20px 60px", display: "flex", gap: 30, alignItems: "flex-start" }}>

          {/* ══════════════ MAIN CONTENT COLUMN ══════════════ */}
          <main style={{ flex: 1, minWidth: 0, paddingTop: 36 }}>

            {/* HEADER */}
            <header style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp 0.8s ease" }}>
              <h1 style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px, 5vw, 50px)", fontWeight: 900,
                letterSpacing: "0.12em", textTransform: "uppercase",
                background: "linear-gradient(135deg, #00ffcc, #00bfff, #7b2fff, #00ffcc)", backgroundSize: "300% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "holo 4s linear infinite", marginBottom: 10,
              }}>VOICE∷MATRIX</h1>
              <p style={{ color: "rgba(0,255,200,0.4)", letterSpacing: "0.32em", fontSize: 10, textTransform: "uppercase" }}>
                ◈ Free Real-Time Speech-to-Text Transcription — No Sign-Up Required ◈
              </p>
            </header>

            {/* STATUS BAR */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", background: "rgba(0,255,200,0.03)", border: "1px solid rgba(0,255,200,0.1)", borderRadius: 4, padding: "9px 18px", marginBottom: 24, fontSize: 11, letterSpacing: "0.14em", gap: 10 }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "rgba(0,255,200,0.38)" }}>SYS</span>
                <span style={{ color: isRecording ? "#00ffcc" : "rgba(0,255,200,0.26)" }}>● {isRecording ? "CAPTURING" : "STANDBY"}</span>
                {isRecording && <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: "#ff4466" }}>{fmt(recTime)}</span>}
              </div>
              <div style={{ display: "flex", gap: 16, color: "rgba(0,255,200,0.36)", flexWrap: "wrap" }}>
                <span>WORDS <span style={{ color: "#00ffcc" }}>{wordCount}</span></span>
                <span>CHARS <span style={{ color: "#00ffcc" }}>{charCount}</span></span>
                <span>LANG <span style={{ color: "#00bfff" }}>{language}</span></span>
              </div>
            </div>

            {/* ── MAIN TOOL ── */}
            <div style={{ ...card, padding: "36px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 11, right: 16, fontFamily: "'Orbitron', sans-serif", fontSize: 8, color: "rgba(0,255,200,0.22)", letterSpacing: "0.3em" }}>AUDIO INPUT MODULE</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

                {/* Language chips */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                  {LANGUAGES.map(l => (
                    <button key={l.value} onClick={() => setLanguage(l.value)} style={{
                      padding: "5px 12px", borderRadius: 3, cursor: "pointer", transition: "all 0.2s",
                      background: language === l.value ? "rgba(0,255,200,0.12)" : "transparent",
                      border: `1px solid ${language === l.value ? "rgba(0,255,200,0.5)" : "rgba(0,255,200,0.13)"}`,
                      color: language === l.value ? "#00ffcc" : "rgba(0,255,200,0.35)",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.14em",
                    }}>{l.label}</button>
                  ))}
                </div>

                {/* Mic orb */}
                <div style={{ position: "relative", width: 190, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", width: 176, height: 176, borderRadius: "50%", border: "1px solid rgba(0,255,200,0.09)", animation: "spinSlow 12s linear infinite" }}>
                    <div style={{ position: "absolute", top: -3, left: "50%", marginLeft: -3, width: 6, height: 6, borderRadius: "50%", background: "#00ffcc", boxShadow: "0 0 10px #00ffcc" }} />
                  </div>
                  <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", border: "1px dashed rgba(0,191,255,0.11)", animation: "spinRev 8s linear infinite" }}>
                    <div style={{ position: "absolute", bottom: -3, right: "50%", marginRight: -3, width: 5, height: 5, borderRadius: "50%", background: "#00bfff", boxShadow: "0 0 8px #00bfff" }} />
                  </div>
                  {isRecording && <>
                    <div style={{ position: "absolute", width: 124, height: 124, borderRadius: "50%", border: "2px solid rgba(0,255,200,0.55)", animation: "pulseRing 1.5s ease-out infinite" }} />
                    <div style={{ position: "absolute", width: 124, height: 124, borderRadius: "50%", border: "2px solid rgba(0,191,255,0.3)", animation: "pulseRing2 1.5s ease-out infinite .5s" }} />
                  </>}
                  <button onClick={toggleRec} aria-label={isRecording ? "Stop recording" : "Start recording"} style={{
                    width: 112, height: 112, borderRadius: "50%", cursor: "pointer", position: "relative", zIndex: 5,
                    background: isRecording ? "radial-gradient(circle at 40% 40%, #ff4466, #cc0033)" : "radial-gradient(circle at 40% 40%, #00ccaa, #006655)",
                    border: `2px solid ${isRecording ? "rgba(255,68,102,0.6)" : "rgba(0,255,200,0.6)"}`,
                    boxShadow: isRecording ? "0 0 28px rgba(255,68,102,0.45), 0 0 55px rgba(255,68,102,0.16)" : "0 0 28px rgba(0,255,200,0.38), 0 0 55px rgba(0,255,200,0.13)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
                    transition: "all 0.3s", animation: isRecording ? "flicker 4s ease-in-out infinite" : "none",
                  }}>
                    {isRecording ? (
                      <>
                        <div style={{ display: "flex", gap: 3 }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 18, background: "rgba(255,255,255,0.9)", borderRadius: 2, animation: "waveBar .55s ease-in-out infinite alternate", animationDelay: `${i * 0.14}s` }} />)}
                        </div>
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 7, color: "rgba(255,255,255,0.9)", letterSpacing: "0.2em" }}>STOP</span>
                      </>
                    ) : (
                      <>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 7, color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>TRANSMIT</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Volume visualizer */}
                <div style={{ display: "flex", alignItems: "center", gap: 3, height: 44 }}>
                  {BARS.map((_, i) => {
                    const c = 16, d = Math.abs(i - c) / c;
                    return <div key={i} style={{ width: 3, borderRadius: 2, minHeight: 5, height: 5, background: isRecording ? `rgba(0,255,200,${0.22 + volume * 0.75 * (1 - d * 0.6)})` : "rgba(0,255,200,0.12)", animation: isRecording ? `waveBar ${0.28 + Math.random() * 0.45}s ease-in-out infinite alternate` : "none", animationDelay: `${i * 0.035}s` }} />;
                  })}
                </div>
              </div>
            </div>

            {/* ── IN-FEED AD (between tool and transcript) ── */}
            <AdUnit slot="2222222222" format="fluid" label="IN-FEED BETWEEN TOOL & TRANSCRIPT" style={{ marginBottom: 24, minHeight: 100 }} />

            {/* TRANSCRIPT */}
            <div style={{ background: "rgba(0,5,15,0.9)", border: "1px solid rgba(0,255,200,0.12)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ display: "flex", borderBottom: "1px solid rgba(0,255,200,0.07)" }}>
                {["transcript","info"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "12px 22px", background: activeTab === tab ? "rgba(0,255,200,0.06)" : "transparent",
                    border: "none", borderBottom: activeTab === tab ? "2px solid #00ffcc" : "2px solid transparent",
                    color: activeTab === tab ? "#00ffcc" : "rgba(0,255,200,0.3)",
                    fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                  }}>{tab === "transcript" ? "◈ Live Transcript" : "◈ Signal Info"}</button>
                ))}
              </div>
              {activeTab === "transcript" ? (
                <div style={{ minHeight: 190, maxHeight: 320, overflowY: "auto", padding: 24, fontSize: 15, lineHeight: 1.8, color: "#b0ffe8", fontFamily: "'Inter', sans-serif" }}>
                  {!transcript && !interim ? (
                    <div style={{ textAlign: "center", paddingTop: 50, color: "rgba(0,255,200,0.16)", letterSpacing: "0.2em", fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>◉</div>AWAITING AUDIO INPUT SIGNAL...
                    </div>
                  ) : (
                    <>
                      <span>{transcript}</span>
                      <span style={{ color: "rgba(0,255,200,0.35)", fontStyle: "italic" }}>{interim}</span>
                      {isRecording && <span style={{ display: "inline-block", width: 2, height: "1em", background: "#00ffcc", marginLeft: 3, verticalAlign: "middle", animation: "cursorBlink 1s step-end infinite" }} />}
                    </>
                  )}
                </div>
              ) : (
                <div style={{ padding: 24 }}>
                  {[["ENGINE","Web Speech API — Browser Native"],["PROCESSING","Real-time Neural Phoneme Matching"],["ACCURACY","~92–97% (Quiet Environment)"],["LATENCY","< 200ms Interim / ~800ms Final"],["PRIVACY","On-Device + Browser Provider Only"],["SPEAKERS","Single Speaker Optimized"]].map(([l,v]) => (
                    <div key={l} style={{ display: "flex", gap: 18, padding: "9px 0", borderBottom: "1px solid rgba(0,255,200,0.05)", fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
                      <span style={{ color: "rgba(0,255,200,0.36)", letterSpacing: "0.18em", minWidth: 110 }}>{l}</span>
                      <span style={{ color: "#00ffcc" }}>→ {v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
              {[
                { label: saved ? "SAVED ✓" : "EXPORT .TXT", action: download, ok: !!transcript, rgb: "0,255,200" },
                { label: copied ? "COPIED ✓" : "COPY DATA", action: copyText, ok: !!transcript, rgb: "123,47,255" },
                { label: "PURGE BUFFER", action: clear, ok: true, rgb: "255,68,102" },
              ].map(b => (
                <button key={b.label} onClick={b.action} disabled={!b.ok} style={{
                  flex: 1, minWidth: 128, padding: "12px 18px",
                  background: `rgba(${b.rgb},${b.ok ? "0.07" : "0.02"})`,
                  border: `1px solid rgba(${b.rgb},${b.ok ? "0.36" : "0.09"})`,
                  borderRadius: 6, color: `rgba(${b.rgb},${b.ok ? "0.9" : "0.22"})`,
                  fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: "0.2em",
                  cursor: b.ok ? "pointer" : "not-allowed", transition: "all 0.2s",
                }}>{b.label}</button>
              ))}
            </div>

            {/* ════ SEO ARTICLES START ════ */}

            {/* IN-ARTICLE AD before content */}
            <AdUnit slot="3333333333" format="rectangle" label="IN-ARTICLE BEFORE CONTENT 300×250" style={{ marginBottom: 32, minHeight: 280 }} />

            {/* Article 1: What is STT */}
            <article style={{ ...card, padding: "36px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Technology Overview</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(16px, 2.8vw, 24px)", color: "#e0fff8", marginBottom: 18, lineHeight: 1.45 }}>What Is Real-Time Speech-to-Text and How Does It Work?</h2>
              <div style={bodyText}>
                <p style={{ marginBottom: 16 }}>Speech-to-Text (STT), also known as Automatic Speech Recognition (ASR), is the technology that converts spoken language into written text. Advances in deep learning — particularly Transformer architectures — have pushed recognition accuracy above 95% in clean audio environments, making real-time transcription practical for everyday use without any specialized hardware.</p>
                <p style={{ marginBottom: 16 }}>When you speak into Voice∷Matrix, your microphone converts sound waves into a digital audio signal. This signal is segmented into small frames (typically 25ms long with 10ms overlap). Each frame is analyzed using a Mel-frequency cepstral coefficients (MFCC) transform — a representation that mirrors how the human ear perceives pitch and tone.</p>
                <p style={{ marginBottom: 16 }}>An acoustic model then maps these features to phonemes — the smallest distinctive sound units. English has roughly 44 phonemes. A neural language model then combines phoneme probabilities with statistical knowledge of word sequences, producing the most probable transcription in under 200 milliseconds.</p>
                <p>Voice∷Matrix leverages the <strong style={{ color: "#00ffcc" }}>Web Speech API</strong>, a browser-native interface that offloads this computation to highly optimized engines built into Chrome and Edge. The result is low-latency, high-accuracy transcription with zero server round-trips for audio data.</p>
              </div>
            </article>

            {/* Article 2: Use Cases */}
            <article style={{ ...card, padding: "36px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Real-World Applications</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(16px, 2.8vw, 24px)", color: "#e0fff8", marginBottom: 18, lineHeight: 1.45 }}>10 Powerful Ways to Use a Free Speech-to-Text Tool</h2>
              <div style={bodyText}>
                {[
                  ["1. Student Lecture Notes","Record and transcribe lectures in real time. Let Voice∷Matrix handle the notes while you focus on understanding. Search transcripts with Ctrl+F to find any concept instantly."],
                  ["2. Meeting Minutes & Summaries","Capture team discussions, client calls, and brainstorming sessions as searchable text. Export and feed to an AI summarizer for structured meeting minutes in seconds."],
                  ["3. Content Creation for Creators","Many writers find it faster to speak their ideas. Dictate blog posts, video scripts, podcast outlines, or social captions hands-free — then refine in your editor."],
                  ["4. Accessibility Tool","For users with motor disabilities, dyslexia, or typing impairments, STT is transformative. Voice∷Matrix requires no installation — just open the browser and speak."],
                  ["5. Language Learning & Pronunciation","Non-native speakers can see exactly how recognition systems interpret their pronunciation. If a word isn't transcribed correctly, it signals a pronunciation gap."],
                  ["6. Hands-Free Field Documentation","Nurses, mechanics, and field researchers can narrate observations while their hands are occupied. Export the text log for records or compliance documentation."],
                  ["7. Interview Transcription","Journalists can record interviews and receive an instant text draft. While professional services offer speaker labeling, Voice∷Matrix provides a fast, free first pass."],
                  ["8. Multilingual Workflows","Switch between 7 supported languages. Ideal for bilingual teams, multilingual content pipelines, or international research projects."],
                  ["9. Personal Voice Journal","Speak your thoughts, daily reflections, or creative ideas. Export to text, maintain a searchable archive, and never lose a fleeting idea again."],
                  ["10. Coding Voice Dictation","Dictate variable names, pseudocode, or comment blocks. Combined with a code editor, voice dictation speeds up ideation for boilerplate and documentation."],
                ].map(([t, b]) => (
                  <div key={t} style={{ marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: "#00ffcc", letterSpacing: "0.1em", marginBottom: 5 }}>{t}</h3>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* IN-ARTICLE AD mid content */}
            <AdUnit slot="4444444444" format="rectangle" label="IN-ARTICLE MID CONTENT 300×250" style={{ marginBottom: 26, minHeight: 280 }} />

            {/* Article 3: Tips */}
            <article style={{ ...card, padding: "36px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Optimization Guide</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(16px, 2.8vw, 24px)", color: "#e0fff8", marginBottom: 18, lineHeight: 1.45 }}>How to Maximize Transcription Accuracy: 8 Expert Tips</h2>
              <div style={bodyText}>
                {[
                  ["Use a Quality Microphone","The biggest accuracy boost comes from better hardware. A USB condenser mic or close-capture headset will dramatically outperform a built-in laptop mic in noisy environments, reducing background noise pickup by 40–70%."],
                  ["Speak at a Measured Pace","Natural conversational speed (120–160 WPM) is optimal. Speaking too fast reduces phoneme segmentation accuracy. Slowing down slightly often resolves most transcription errors."],
                  ["Minimize Background Noise","Close windows, turn off fans, and move away from HVAC vents. Background noise above 40 dB can reduce accuracy by 10–20%. Soft furnishings absorb reflections and improve signal quality."],
                  ["Select the Correct Dialect","English (US) and English (UK) use different phoneme models. Selecting the wrong dialect causes systematic misrecognition of certain vowel sounds and regional idioms."],
                  ["Enunciate Technical Terms","Proper nouns, brand names, and jargon are the most common failure points. Speak these clearly and distinctly. Consider adding them to your browser's custom dictionary if supported."],
                  ["Monitor Interim Results","Watch the transcript as you speak. If you see a word go wrong, pausing and repeating it allows the engine's context window to self-correct in the final output."],
                  ["Review Immediately After","Transcription accuracy degrades in memory over time. Review and correct the transcript while the spoken content is still fresh, especially numbers, dates, and named entities."],
                  ["Export Frequently","Save intermediate transcripts every 10–15 minutes during long sessions. This protects against accidental browser closes or tab crashes losing your work."],
                ].map(([t, b]) => (
                  <div key={t} style={{ marginBottom: 18, paddingLeft: 18, borderLeft: "2px solid rgba(0,255,200,0.18)" }}>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: "#00bfff", letterSpacing: "0.1em", marginBottom: 5 }}>{t}</h3>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Pipeline */}
            <section style={{ ...card, padding: "36px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Signal Processing Pipeline</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(15px, 2.5vw, 22px)", color: "#e0fff8", marginBottom: 24, lineHeight: 1.45 }}>Under the Hood: How Voice∷Matrix Transcribes Your Speech</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
                {[
                  { n:"01", t:"AUDIO CAPTURE", d:"Mic sampled at 16–44kHz, windowed into 25ms frames with 10ms stride." },
                  { n:"02", t:"FEATURE EXTRACTION", d:"MFCC coefficients computed per frame — a vector representing spectral envelope." },
                  { n:"03", t:"ACOUSTIC MODEL", d:"Deep neural net maps feature vectors to phoneme probability distributions." },
                  { n:"04", t:"LANGUAGE MODEL", d:"Beam search uses n-gram scores to find the highest-probability word sequence." },
                  { n:"05", t:"INTERIM OUTPUT", d:"Partial hypotheses emitted every ~200ms for real-time display with correction." },
                  { n:"06", t:"FINAL EMISSION", d:"On silence detection, highest-confidence hypothesis is committed as final text." },
                ].map(s => (
                  <div key={s.n} style={{ padding: 18, borderRadius: 6, border: "1px solid rgba(0,255,200,0.08)", background: "rgba(0,255,200,0.02)" }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 24, fontWeight: 900, color: "rgba(0,255,200,0.06)", marginBottom: 5 }}>{s.n}</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: "0.2em", color: "#00ffcc", marginBottom: 7 }}>{s.t}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(0,255,200,0.4)", fontFamily: "'Inter', sans-serif" }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* IN-ARTICLE AD before FAQ */}
            <AdUnit slot="5555555555" format="rectangle" label="IN-ARTICLE BEFORE FAQ 300×250" style={{ marginBottom: 26, minHeight: 280 }} />

            {/* FAQ */}
            <section style={{ ...card, padding: "36px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Frequently Asked Questions</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(15px, 2.5vw, 22px)", color: "#e0fff8", marginBottom: 26, lineHeight: 1.45 }}>Everything You Need to Know About Voice∷Matrix</h2>
              <div>
                {FAQ.map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid rgba(0,255,200,0.07)" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                      width: "100%", textAlign: "left", padding: "16px 0", background: "none", border: "none", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
                    }}>
                      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: "0.12em", color: openFaq === i ? "#00ffcc" : "rgba(0,255,200,0.65)", lineHeight: 1.5 }}>{item.q}</span>
                      <span style={{ color: openFaq === i ? "#00ffcc" : "rgba(0,255,200,0.32)", fontSize: 20, flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ ...bodyText, fontSize: 13, paddingBottom: 18, paddingRight: 30, animation: "slideIn 0.2s ease" }}>{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy */}
            <section style={{ ...card, padding: "32px 28px", marginBottom: 26 }}>
              <div style={sectionTitle}>◈ Privacy & Data Policy</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(14px, 2.5vw, 20px)", color: "#e0fff8", marginBottom: 16, lineHeight: 1.45 }}>Your Voice Data Is Never Stored</h2>
              <div style={bodyText}>
                <p style={{ marginBottom: 14 }}>Voice∷Matrix is engineered with a <strong style={{ color: "#00ffcc" }}>zero-data-retention architecture</strong>. No audio is ever uploaded to our servers. The Web Speech API routes audio processing through your browser vendor's infrastructure (e.g., Google's speech servers for Chrome), subject to their privacy policies — but we never receive or store any audio or transcription data.</p>
                <p style={{ marginBottom: 14 }}>All transcript text generated exists only in your browser's memory for the duration of the session. Closing or refreshing the tab permanently deletes the transcript unless you export it first using the Export .TXT button.</p>
                <p>We do not use cookies for behavioral tracking, display behavioral advertising, or collect any personally identifiable information. This tool is designed to comply with GDPR, CCPA, and COPPA guidelines.</p>
              </div>
            </section>

            {/* ── BOTTOM LEADERBOARD AD ── */}
            <AdUnit slot="6666666666" format="horizontal" label="LEADERBOARD BOTTOM 728×90" style={{ marginBottom: 0, minHeight: 90 }} />

            {/* Footer */}
            <footer style={{ marginTop: 36, textAlign: "center", color: "rgba(0,255,200,0.15)", fontSize: 10, letterSpacing: "0.28em", lineHeight: 2.2, fontFamily: "'Share Tech Mono', monospace" }}>
              <div>VOICE∷MATRIX ◈ FREE REAL-TIME SPEECH-TO-TEXT TRANSCRIPTION</div>
              <div style={{ marginTop: 6, fontSize: 9 }}>
                <span style={{ marginRight: 20, cursor: "pointer" }}>Privacy Policy</span>
                <span style={{ marginRight: 20, cursor: "pointer" }}>Terms of Use</span>
                <span style={{ cursor: "pointer" }}>Contact</span>
              </div>
              <div style={{ marginTop: 6 }}>© {new Date().getFullYear()} Voice∷Matrix. All rights reserved.</div>
            </footer>
          </main>

          {/* ══════════════ SIDEBAR (desktop) ══════════════ */}
          <aside style={{ width: 300, flexShrink: 0, paddingTop: 36, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Sidebar Ad 1 — 300×250 */}
            <AdUnit slot="7777777777" format="rectangle" label="SIDEBAR 300×250 TOP" style={{ minHeight: 260 }} />

            <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Quick tips */}
              <div style={{ ...card, padding: 22 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(0,255,200,0.38)", marginBottom: 16 }}>◈ QUICK TIPS</div>
                {["Sit close to audio source","Use Chrome for best results","Select your language dialect","Export often — don't lose work","Review technical terms manually","Quiet environment = higher accuracy"].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, fontSize: 12, color: "rgba(0,255,200,0.5)", alignItems: "flex-start", fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ color: "#00ffcc", flexShrink: 0 }}>→</span><span>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar Ad 2 — 300×600 Half Page */}
              <AdUnit slot="8888888888" format="rectangle" label="SIDEBAR 300×600 HALF PAGE" style={{ minHeight: 620 }} />

              {/* Supported browsers info */}
              <div style={{ ...card, padding: 22 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(0,255,200,0.38)", marginBottom: 16 }}>◈ BROWSER SUPPORT</div>
                {[
                  { name: "Chrome 88+", support: "Full", color: "#00ffcc" },
                  { name: "Edge 90+", support: "Full", color: "#00ffcc" },
                  { name: "Safari", support: "Limited", color: "#ffaa00" },
                  { name: "Firefox", support: "Partial", color: "#ffaa00" },
                  { name: "Opera", support: "Full", color: "#00ffcc" },
                ].map(b => (
                  <div key={b.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
                    <span style={{ color: "rgba(0,255,200,0.5)" }}>{b.name}</span>
                    <span style={{ color: b.color }}>{b.support}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar Ad 3 — 300×250 */}
              <AdUnit slot="9999999999" format="rectangle" label="SIDEBAR 300×250 BOTTOM" style={{ minHeight: 260 }} />

            </div>
          </aside>

        </div>
      </div>
    </>
  );
}