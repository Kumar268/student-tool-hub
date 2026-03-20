import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Star, Zap, Copy, Check, Gift } from 'lucide-react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

@keyframes age-pulse { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.3)} 50%{box-shadow:0 0 40px rgba(16,185,129,0.6)} }
@keyframes age-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.age-card {
  background: rgba(15,23,42,0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 20px;
  transition: all 0.3s;
}
.age-card:hover { border-color: rgba(16,185,129,0.45); }
.age-input {
  background: rgba(15,23,42,0.8);
  border: 2px solid rgba(16,185,129,0.2);
  border-radius: 14px;
  padding: 13px 18px;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s;
}
.age-input:focus { border-color: #10b981; box-shadow: 0 0 20px rgba(16,185,129,0.25); }
.age-result {
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15));
  border: 2px solid rgba(16,185,129,0.35);
  border-radius: 18px;
  padding: 24px;
  animation: age-pulse 3s ease-in-out infinite;
}
`;

const StatBox = ({ label, value, unit, color = '#10b981' }) => (
  <div style={{ textAlign: 'center', padding: '16px 12px', background: `rgba(16,185,129,0.08)`, borderRadius: 14, border: `1px solid rgba(16,185,129,0.2)` }}>
    <p style={{ fontSize: 32, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
    <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: 1 }}>{unit}</p>
    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{label}</p>
  </div>
);

const AgeCalculator = ({ isDarkMode }) => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!birthDate || !targetDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (birth > target || isNaN(birth) || isNaN(target)) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years -= 1; months += 12; }

    const diffMs = target - birth;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const birthDay = birth.getDate();
    const currentDay = target.getDate();
    const birthMonth = birth.getMonth();
    const currentMonth = target.getMonth();
    let nextBirthday = new Date(target.getFullYear(), birthMonth, birthDay);
    if (nextBirthday <= target) nextBirthday = new Date(target.getFullYear() + 1, birthMonth, birthDay);
    const daysUntilBirthday = Math.floor((nextBirthday - target) / (1000 * 60 * 60 * 24));

    const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][birth.getDay()];
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());

    return { years, months, days, totalDays, totalHours, totalMinutes, totalWeeks, totalMonths, daysUntilBirthday, dayOfWeek, zodiac };
  }, [birthDate, targetDate]);

  function getZodiac(month, day) {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '♈ Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '♉ Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '♊ Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '♋ Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '♌ Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '♍ Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '♎ Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '♏ Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '♐ Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '♑ Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '♒ Aquarius';
    return '♓ Pisces';
  }

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Age: ${result.years} years, ${result.months} months, ${result.days} days`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: '100vh', background: isDarkMode ? 'linear-gradient(135deg,#020c18,#0a1628,#020c18)' : '#f0fdf4', color: isDarkMode ? '#e2e8f0' : '#1e293b', padding: '24px' }}>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 14, padding: 10, animation: 'age-float 4s ease-in-out infinite' }}>
              <Calendar size={28} color="white" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(90deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Age Calculator
            </h1>
          </div>
          <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 15 }}>Find your exact age with detailed stats — years, months, days, hours and more</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {/* Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="age-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#34d399', marginBottom: 20 }}>Enter Dates</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>🎂 Date of Birth</label>
              <input className="age-input" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={targetDate} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>📅 Calculate Age At (Date)</label>
              <input className="age-input" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
            </div>

            <button onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
              style={{ width: '100%', padding: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#34d399', fontWeight: 700, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
              ⟳ Reset to Today
            </button>

            {result && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Born on a <span style={{ color: '#34d399', fontWeight: 700 }}>{result.dayOfWeek}</span></p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Zodiac: <span style={{ color: '#34d399', fontWeight: 700 }}>{result.zodiac}</span></p>
              </div>
            )}
          </motion.div>

          {/* Result */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="age-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#34d399', marginBottom: 20 }}>Your Age</h3>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="r" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="age-result" style={{ marginBottom: 20 }}>
                    <p style={{ textAlign: 'center', fontSize: 42, fontWeight: 800, color: '#34d399', margin: 0 }}>
                      {result.years} <span style={{ fontSize: 20, fontWeight: 600, color: '#94a3b8' }}>yrs</span>
                    </p>
                    <p style={{ textAlign: 'center', fontSize: 18, color: '#94a3b8', margin: '8px 0' }}>
                      {result.months} months &amp; {result.days} days
                    </p>
                    <button onClick={handleCopy} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#34d399', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
                      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <StatBox label="Total" value={result.totalDays.toLocaleString()} unit="Days" />
                    <StatBox label="Total" value={result.totalWeeks.toLocaleString()} unit="Weeks" color="#818cf8" />
                    <StatBox label="Total" value={result.totalMonths.toLocaleString()} unit="Months" color="#f59e0b" />
                    <StatBox label="Total" value={(result.totalHours / 1000).toFixed(1) + 'K'} unit="Hours" color="#ec4899" />
                  </div>

                  <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Gift size={18} color="#34d399" />
                    <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                      Next birthday in <span style={{ color: '#34d399', fontWeight: 700 }}>{result.daysUntilBirthday} days</span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '50px 0', color: '#475569' }}>
                  <Calendar size={52} style={{ margin: '0 auto 16px', opacity: 0.25 }} />
                  <p style={{ fontSize: 14 }}>Enter your date of birth to see your age</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AgeCalculator;
