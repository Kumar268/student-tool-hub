import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Crosshair, Activity, Database, Download, Upload, Trash, Edit,
    Plus, Target, CheckCircle, Search, AlertTriangle, Layers, Maximize
} from 'lucide-react';

// Common Foods Database for Quick Add
const QUICK_FOODS = [
    { name: 'Chicken Breast (100g)', cals: 165, protein: 31, fat: 3.6, carbs: 0, mealType: 'Lunch' },
    { name: 'Brown Rice (Cup)', cals: 216, protein: 5, fat: 1.8, carbs: 45, mealType: 'Lunch' },
    { name: 'Whey Protein (Scoop)', cals: 110, protein: 25, fat: 1, carbs: 2, mealType: 'Snack' },
    { name: 'Oatmeal (1/2 Cup)', cals: 150, protein: 5, fat: 2.5, carbs: 27, mealType: 'Breakfast' },
    { name: 'Eggs (2 Large)', cals: 140, protein: 12, fat: 10, carbs: 1, mealType: 'Breakfast' },
    { name: 'Almonds (1 oz)', cals: 164, protein: 6, fat: 14, carbs: 6, mealType: 'Snack' }
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const HUD_WAVEFORM = "M0,20 Q5,20 10,20 T20,20 T30,20 T40,5 T50,35 T60,20 T70,20 T80,20 T90,20 T100,20";

const HolographicCard = ({ children, className, isDark, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`relative overflow-hidden border backdrop-blur-md p-6 rounded-xl transition-all duration-300 group
      ${isDark
                ? 'bg-[#001122]/60 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                : 'bg-white/80 border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(0,200,255,0.3)]'}
      ${className}
    `}
    >
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-10"
            style={{ backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Scanning Line */}
        <div className="absolute left-0 right-0 h-1 bg-cyan-400/40 blur-[2px] -top-2 animate-[scan_4s_ease-in-out_infinite] pointer-events-none" />

        <div className="relative z-10">{children}</div>
    </motion.div>
);

const BiometricReadout = ({ label, value, unit, colorClass, highlight }) => (
    <div className="flex flex-col flex-1 p-3 rounded-lg border border-white/5 bg-black/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-8 h-8 opacity-20 transition-transform group-hover:scale-110">
            <Crosshair className={`w-full h-full ${colorClass}`} />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-gray-400/80 mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono ${highlight ? 'text-white' : colorClass}`}>{value}</span>
            <span className="text-xs text-gray-500 font-mono">{unit}</span>
        </div>
    </div>
);

const NutritionTracker = ({ isDarkMode }) => {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('jarvis_nutrition_entries');
        return saved ? JSON.parse(saved) : [];
    });

    const [goal, setGoal] = useState(() => {
        const saved = localStorage.getItem('jarvis_nutrition_goal');
        return saved ? parseInt(saved) : 2000;
    });

    const [form, setForm] = useState({ name: '', cals: '', protein: '', fat: '', carbs: '', mealType: 'Breakfast' });
    const [search, setSearch] = useState('');
    const [is3D, setIs3D] = useState(false);
    const [systemMsg, setSystemMsg] = useState('SYSTEM ONLINE - M.A.R.K. V AWAITING INPUT');
    const [isScanning, setIsScanning] = useState(false);

    // Auto-save
    useEffect(() => {
        localStorage.setItem('jarvis_nutrition_entries', JSON.stringify(entries));
        localStorage.setItem('jarvis_nutrition_goal', goal.toString());
    }, [entries, goal]);

    const [shake, setShake] = useState(false);

    // Calculations
    const totalCals = entries.reduce((acc, curr) => acc + (curr.cals || 0), 0);
    const totalProtein = entries.reduce((acc, curr) => acc + (curr.protein || 0), 0);
    const totalFat = entries.reduce((acc, curr) => acc + (curr.fat || 0), 0);
    const totalCarbs = entries.reduce((acc, curr) => acc + (curr.carbs || 0), 0);

    const calPercentage = Math.min(100, Math.max(0, (totalCals / goal) * 100));

    // Dynamic color for Calorie Limit
    const getProgressColor = () => {
        if (calPercentage < 75) return 'from-cyan-400 to-blue-500 shadow-cyan-500/50';
        if (calPercentage <= 100) return 'from-yellow-400 to-orange-500 shadow-yellow-500/50';
        return 'from-red-500 to-rose-600 shadow-red-500/80 animate-pulse';
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.name || !form.cals) return;

        setIsScanning(true);
        setSystemMsg('ANALYZING NUTRITIONAL BIOMETRICS...');

        setTimeout(() => {
            const newEntry = {
                id: Date.now().toString(),
                name: form.name,
                cals: Number(form.cals),
                protein: Number(form.protein) || 0,
                fat: Number(form.fat) || 0,
                carbs: Number(form.carbs) || 0,
                mealType: form.mealType,
                timestamp: new Date().toISOString()
            };

            const newTotal = totalCals + newEntry.cals;
            if (newTotal > goal) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setSystemMsg('WARNING: STRUCTURAL CALORIC INTEGRITY COMPROMISED.');
            } else {
                setSystemMsg('JARVIS: NUTRITIONAL ANALYSIS COMPLETE AND LOGGED.');
            }

            setEntries([newEntry, ...entries]);
            setForm({ name: '', cals: '', protein: '', fat: '', carbs: '', mealType: form.mealType });
            setIsScanning(false);
        }, 800);
    };

    const handleQuickAdd = (food) => {
        setForm({
            name: food.name,
            cals: food.cals,
            protein: food.protein,
            fat: food.fat,
            carbs: food.carbs,
            mealType: food.mealType
        });
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
        setSystemMsg('ENTRY PURGED FROM MAINFRAME.');
    };

    const exportData = () => {
        const csv = [
            ['Date', 'Time', 'Food', 'Calories', 'Protein (g)', 'Fat (g)', 'Carbs (g)', 'Meal Type'],
            ...entries.map(e => {
                const d = new Date(e.timestamp);
                return [
                    d.toLocaleDateString(),
                    d.toLocaleTimeString(),
                    `"${e.name}"`,
                    e.cals, e.protein, e.fat, e.carbs, e.mealType
                ];
            })
        ].map(e => e.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jarvis_nutrition_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filteredEntries = entries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.mealType.toLowerCase().includes(search.toLowerCase()));

    // SVG Arc generation
    const getArcLength = (percent, radius) => {
        const circumference = 2 * Math.PI * radius;
        return (percent / 100) * circumference;
    };

    return (
        <div className={`min-h-screen pb-20 font-sans transition-colors duration-500 overflow-hidden relative ${isDarkMode ? 'bg-[#000510] text-cyan-50' : 'bg-slate-50 text-slate-900'}`}>

            {/* Background HUD effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className={`absolute inset-0 opacity-20 ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,rgba(0,30,60,0.8)_0%,rgba(0,0,0,1)_100%)]' : 'bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.1)_0%,rgba(255,255,255,1)_100%)]'}`} />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }} />
            </div>

            <style>{`
        @keyframes scan { 0% { top: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        @keyframes rotate-slow { 100% { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(0, 255, 255, 0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); } }
        .hud-glitch:hover { animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; }
        @keyframes glitch { 0% { transform: translate(0) } 20% { transform: translate(-2px, 2px) } 40% { transform: translate(-2px, -2px) } 60% { transform: translate(2px, 2px) } 80% { transform: translate(2px, -2px) } 100% { transform: translate(0) } }
        
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>

            <div className={`relative z-10 max-w-7xl mx-auto px-4 pt-8 transition-transform duration-700 ease-out ${is3D ? 'perspective-1000' : ''}`}>

                <div className={`transition-transform duration-700 preserve-3d ${is3D ? 'rotate-x-[5deg] rotate-y-[-5deg] scale-95' : ''}`}>

                    {/* Header & HUD Toggles */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-cyan-500/30 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Target className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} absolute z-10 ${isScanning ? 'animate-[rotate-slow_2s_linear_infinite]' : ''}`} />
                                <div className="absolute w-full h-full border-2 border-cyan-500/30 rounded-full border-t-cyan-400 animate-[rotate-slow_4s_linear_infinite]" />
                                <div className="absolute w-12 h-12 border border-cyan-400/20 rounded-full border-b-cyan-300 animate-[rotate-slow_3s_linear_infinite_reverse]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
                                    Nutrition Core
                                    <Zap className="w-5 h-5 text-cyan-400" />
                                </h1>
                                <p className="font-mono text-xs text-cyan-500/80 tracking-widest mt-1">MARK V / BIOMETRIC TRACKING SYSTEM</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4 md:mt-0">
                            <button onClick={() => setIs3D(!is3D)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors ${is3D ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-transparent border-cyan-500/30 text-cyan-600 hover:border-cyan-400 dark:text-cyan-500'}`}>
                                <Layers className="w-4 h-4" /> Holographic Projection
                            </button>
                            <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/10 dark:text-cyan-500 transition-colors">
                                <Download className="w-4 h-4" /> Export Data
                            </button>
                        </div>
                    </div>

                    {/* System Terminal Text */}
                    <div className={`mb-6 p-2 rounded border border-cyan-500/20 bg-cyan-900/10 font-mono text-xs flex items-center gap-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="uppercase typing-effect">{systemMsg}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column: Form & Quick Add */}
                        <div className="lg:col-span-4 space-y-6">

                            <HolographicCard isDark={isDarkMode} className="transform-gpu transition-all">
                                <h2 className={`font-mono text-sm uppercase tracking-widest flex items-center gap-2 mb-6 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                    <Activity className="w-4 h-4" /> Scanner Input
                                </h2>

                                <form onSubmit={handleAdd} className="space-y-4 relative z-10">
                                    <div>
                                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">Target Designation (Food)</label>
                                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-black/20 border border-cyan-500/30 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] dark:text-cyan-50 transition-all placeholder:text-gray-600" placeholder="e.g. Shawarma" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">Energy (kcal)</label>
                                            <input type="number" value={form.cals} onChange={e => setForm({ ...form, cals: e.target.value })} required className="w-full bg-black/20 border border-cyan-500/30 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] dark:text-cyan-50 transition-all text-center" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">Meal Phase</label>
                                            <select value={form.mealType} onChange={e => setForm({ ...form, mealType: e.target.value })} className="w-full bg-black/20 border border-cyan-500/30 rounded-lg px-2 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 dark:text-cyan-50 [&>option]:bg-gray-900">
                                                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-cyan-500/20">
                                        <div>
                                            <label className="block text-[10px] uppercase font-mono tracking-wider text-blue-400 mb-1">Pro (g)</label>
                                            <input type="number" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className="w-full bg-blue-900/20 border border-blue-500/30 rounded-md px-2 py-1.5 font-mono text-sm focus:outline-none focus:border-blue-400 dark:text-blue-50 text-center" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-mono tracking-wider text-yellow-500 mb-1">Fat (g)</label>
                                            <input type="number" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} className="w-full bg-yellow-900/20 border border-yellow-500/30 rounded-md px-2 py-1.5 font-mono text-sm focus:outline-none focus:border-yellow-400 dark:text-yellow-50 text-center" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-mono tracking-wider text-green-400 mb-1">Carb (g)</label>
                                            <input type="number" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className="w-full bg-green-900/20 border border-green-500/30 rounded-md px-2 py-1.5 font-mono text-sm focus:outline-none focus:border-green-400 dark:text-green-50 text-center" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isScanning} className="w-full mt-4 py-3 rounded-lg bg-cyan-600/20 border border-cyan-500 text-cyan-400 font-mono uppercase tracking-widest hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all flex items-center justify-center gap-2 overflow-hidden relative group">
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        {isScanning ? <Target className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        {isScanning ? 'Syncing...' : 'Engage'}
                                    </button>
                                </form>
                            </HolographicCard>

                            <HolographicCard isDark={isDarkMode} delay={0.1}>
                                <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4 flex justify-between items-center">
                                    <span>Quick Access Memory</span>
                                    <Database className="w-3 h-3" />
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {QUICK_FOODS.map((food, i) => (
                                        <button key={i} onClick={() => handleQuickAdd(food)} className="text-left p-2 rounded border border-cyan-900/40 bg-black/10 hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-all font-mono group relative overflow-hidden">
                                            <div className="text-xs text-cyan-100 truncate">{food.name}</div>
                                            <div className="text-[10px] text-cyan-600">{food.cals} kcal</div>
                                            <div className="absolute right-0 bottom-0 top-0 w-8 bg-gradient-to-l from-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-end pr-1 transition-opacity">
                                                <Plus className="w-3 h-3 text-cyan-400" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </HolographicCard>

                        </div>

                        {/* Middle Column: Radar & Visuals */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-8 relative">
                            {/* Main Holographic Body / Reactor */}
                            <motion.div
                                className="relative w-64 h-64 flex items-center justify-center"
                                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Outer Ring */}
                                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[rotate-slow_10s_linear_infinite]" />
                                <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/40 animate-[rotate-slow_15s_linear_infinite_reverse]" />

                                {/* Arc Reactor SVG representation */}
                                <svg viewBox="0 0 200 200" className="absolute w-full h-full drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                                    {/* Background plate */}
                                    <circle cx="100" cy="100" r="80" fill={isDarkMode ? "#001122" : "#f8fafc"} stroke="#00ffff" strokeWidth="1" strokeOpacity="0.3" />

                                    {/* Energy Data Rings */}
                                    <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="8" strokeOpacity="0.2" />
                                    <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${getArcLength(totalProtein > 150 ? 100 : (totalProtein / 150) * 100, 70)} 1000`} transform="rotate(-90 100 100)" className="transition-all duration-1000 ease-out" />

                                    <circle cx="100" cy="100" r="55" fill="none" stroke="#eab308" strokeWidth="6" strokeOpacity="0.2" />
                                    <circle cx="100" cy="100" r="55" fill="none" stroke="#eab308" strokeWidth="6" strokeDasharray={`${getArcLength(totalFat > 70 ? 100 : (totalFat / 70) * 100, 55)} 1000`} transform="rotate(-90 100 100)" className="transition-all duration-1000 ease-out" />

                                    <circle cx="100" cy="100" r="42" fill="none" stroke="#22c55e" strokeWidth="4" strokeOpacity="0.2" />
                                    <circle cx="100" cy="100" r="42" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray={`${getArcLength(totalCarbs > 250 ? 100 : (totalCarbs / 250) * 100, 42)} 1000`} transform="rotate(-90 100 100)" className="transition-all duration-1000 ease-out" />

                                    {/* Core core */}
                                    <circle cx="100" cy="100" r="25" fill="#00ffff" className={`opacity-[0.15] ${totalCals > goal ? 'fill-red-500 opacity-40 animate-pulse' : 'animate-pulse'}`} />
                                    <circle cx="100" cy="100" r="15" fill="#ffffff" className={`opacity-[0.8] ${totalCals > goal ? 'fill-red-200' : ''}`} />
                                </svg>

                                <div className="absolute flex flex-col items-center justify-center text-center">
                                    <span className={`text-2xl font-black font-mono tracking-tighter shadow-black drop-shadow-md ${totalCals > goal ? 'text-red-500' : isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                        {Math.round(calPercentage)}%
                                    </span>
                                    <span className="text-[8px] font-mono tracking-widest text-white/70 uppercase">Capacity</span>
                                </div>
                            </motion.div>

                            {/* Limit Progress Bar */}
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between font-mono text-xs items-center">
                                    <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>ENERGY SHIELD</span>
                                    <div className="flex items-center gap-2">
                                        <span className={totalCals > goal ? 'text-red-500 font-bold' : isDarkMode ? 'text-white' : 'text-gray-900'}>{totalCals}</span>
                                        <span className="text-gray-500">/</span>
                                        <input
                                            type="number"
                                            value={goal}
                                            onChange={e => setGoal(Number(e.target.value) || 2000)}
                                            className="w-14 bg-transparent border-b border-dashed border-cyan-500/50 text-right focus:outline-none focus:border-cyan-400 text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
                                    <motion.div
                                        className={`h-full bg-gradient-to-r rounded-full shadow-lg ${getProgressColor()} relative`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${calPercentage}%` }}
                                        transition={{ type: 'spring', damping: 20 }}
                                    >
                                        {/* Inner glowing core of the bar */}
                                        <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/60 rounded-r-full" />
                                    </motion.div>
                                    {/* Goal marker if we wanted to show 100% visibly inside */}
                                </div>
                            </div>

                            {/* Macro Indicators */}
                            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                                <BiometricReadout label="PRO" value={totalProtein} unit="g" colorClass="text-blue-400" />
                                <BiometricReadout label="FAT" value={totalFat} unit="g" colorClass="text-yellow-400" />
                                <BiometricReadout label="CRB" value={totalCarbs} unit="g" colorClass="text-green-400" />
                            </div>

                        </div>

                        {/* Right Column: Entry Log */}
                        <div className="lg:col-span-4 flex flex-col h-full space-y-4 relative z-10">
                            <HolographicCard isDark={isDarkMode} className="flex-1 flex flex-col h-[500px]" delay={0.2}>

                                <div className="flex justify-between items-center mb-4 border-b border-cyan-500/30 pb-4">
                                    <h3 className={`font-mono text-sm uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                        <Database className="w-4 h-4" /> System Log
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Search className="w-3 h-3 text-cyan-600" />
                                        <input
                                            type="text"
                                            placeholder="Filter..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="bg-transparent border-b border-cyan-500/30 w-24 focus:outline-none focus:w-32 transition-all font-mono text-xs text-gray-400 placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    <AnimatePresence>
                                        {filteredEntries.length === 0 && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-cyan-700/50 font-mono text-xs tracking-widest text-center mt-10">
                                                <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                                                NO BIOMETRIC DATA <br />RECORDED TODAY
                                            </motion.div>
                                        )}
                                        {filteredEntries.map((entry, idx) => (
                                            <motion.div
                                                key={entry.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`group p-3 rounded-lg border backdrop-blur-sm relative overflow-hidden flex flex-col gap-2 transition-all hover:pl-4
                          ${isDarkMode ? 'bg-black/40 border-cyan-900/40 hover:border-cyan-500/50' : 'bg-white/50 border-cyan-200 hover:border-cyan-400'}`}
                                            >
                                                {/* Tiny decorative side bar */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-700/50 group-hover:bg-cyan-400 transition-colors" />

                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-mono text-sm font-bold text-cyan-100 group-hover:text-cyan-300 transition-colors">{entry.name}</div>
                                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-2 mt-1 uppercase tracking-wider">
                                                            <span className="text-cyan-600 border border-cyan-800 rounded px-1">{entry.mealType}</span>
                                                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-mono text-lg font-bold text-cyan-400">{entry.cals} <span className="text-xs text-cyan-700">kcal</span></span>
                                                        <button onClick={() => deleteEntry(entry.id)} className="text-red-900 hover:text-red-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Trash className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Vitals waveform for visual flair */}
                                                <div className="h-4 w-full mt-1 relative opacity-20 group-hover:opacity-50 transition-opacity">
                                                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full stroke-cyan-500 fill-transparent" strokeWidth="1">
                                                        <path d={HUD_WAVEFORM} />
                                                    </svg>
                                                </div>

                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {entries.length > 0 && (
                                    <button onClick={() => { if (window.confirm('Wipe system memory for today?')) setEntries([]) }} className="mt-4 w-full py-2 border border-red-900/30 text-red-500/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 rounded font-mono text-xs uppercase tracking-widest transition-colors">
                                        Execute Protocol Wipe
                                    </button>
                                )}

                            </HolographicCard>
                        </div>
                    </div>
                </div>

                {/* SEO & Educational Content Section */}
                <div className="w-full bg-gray-50 dark:bg-gray-900">
                  <div className={`w-full max-w-7xl mx-auto px-4 py-8 space-y-8 prose prose-cyan dark:prose-invert border-t border-cyan-900/30 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-cyan-500" />
                            Optimizing Biomechanical Performance: A Nutrition Guide
                        </h2>

                        <p className="text-sm border-l-2 border-cyan-500 pl-4 py-2 bg-cyan-900/10 font-mono">
                            "Just as the Arc Reactor requires palladium to power the suit, the human biomechanical engine requires precision calibrated macronutrients." - System Analysis
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-100 mb-3">Understanding Macronutrients</h3>
                                <p className="mb-4">
                                    A high-performance nutrition tracker is essential for anyone treating their body like advanced technology. Our macro calculator breaks down fuel into three primary categories:
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="text-blue-400 shrink-0 font-bold mt-1">PROTEIN:</span>
                                        <span>The fundamental structural component. Essential for muscle synthesis, tissue repair, and maintaining structural integrity under high-G forces or intense physical strain. Think of it as the titanium alloy of your body.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-400 shrink-0 font-bold mt-1">LIPIDS (FAT):</span>
                                        <span>Dense energy storage and vital for hormonal regulation and brain function. Essential fatty acids are like the specialized coolants and lubricants that keep neural processors firing at optimal speeds.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-green-400 shrink-0 font-bold mt-1">CARBOHYDRATES:</span>
                                        <span>The quick-access energy reservoirs. Critical for fueling immediate physical output and high-demand cognitive tasks. Complex carbs serve as sustained energy output, while simple carbs act as rapid thruster fuel.</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-cyan-100 mb-3">Caloric Deficits & Surplus Explained</h3>
                                <p className="mb-4">
                                    Whether you are planning a diet, using a calorie counter, or trying to understand your basal metabolic rate (BMR), the concept of energy balance is immutable thermodynamics.
                                </p>
                                <p className="mb-4">
                                    <strong>Caloric Deficit:</strong> Consuming less energy than the system expends. This forces the body to tap into reserved fat stores, resulting in weight loss. Useful for leaning out chassis weight.
                                </p>
                                <p>
                                    <strong>Caloric Surplus:</strong> Consuming more energy than expended. When combined with progressive resistance training, this excess energy fuels hypertrophy (muscle building), upgrading your physical hardware.
                                </p>
                            </div>
                        </div>

                        <div className={`mt-8 p-6 rounded-xl border ${isDarkMode ? 'bg-[#001122]/50 border-cyan-900' : 'bg-cyan-50 border-cyan-200'} text-center`}>
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Upgrade Your Hardware</h3>
                            <p className="text-sm mb-4 max-w-2xl mx-auto">
                                Accurate data collection requires precision sensors. Consider integrating a smart digital kitchen scale into your workflow to maximize the accuracy of this diet planner and nutrition tracker.
                            </p>
                            <button onClick={exportData} className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold shadow-lg shadow-cyan-500/30 transition-all font-mono">
                                DOWNLOAD WEEKLY PERFORMANCE REPORT (CSV)
                            </button>
                            <p className="text-xs text-gray-500 mt-4">* Sign up for our premium tier to unlock AI-assisted meal planning, recipe optimization, and automated grocery manifest generation.</p>
                        </div>

                        <div className="opacity-0 h-0 overflow-hidden">
                            <p>Keywords: nutrition tracker, calorie counter, macro calculator, diet planner, fitness app, health tech, track calories, daily macros, iron man hud UI design, react nutrition app.</p>
                        </div>
                    </div>
                  </div>
            </div>
        </div>
    );
};

export default NutritionTracker;
