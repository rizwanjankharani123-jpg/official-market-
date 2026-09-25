import React, { useState, useEffect } from 'react';
import { ShieldCheck, Code2, Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(1); // 1: Init, 2: Glyph/Pulse, 3: Text Reveal, 4: Fade Out
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Phase 1: 0 - 800ms (Particle / glow startup)
    const t1 = setTimeout(() => setPhase(2), 800);
    // Phase 2: 800ms - 2200ms (Glyph & energy lines)
    const t2 = setTimeout(() => setPhase(3), 2200);
    // Phase 3: 2200ms - 4200ms (Brand typography & subtitle reveal)
    const t3 = setTimeout(() => setPhase(4), 4200);
    // Phase 4: 4200ms - 4800ms (Smooth transition into app)
    const t4 = setTimeout(() => {
      onComplete();
    }, 4800);

    // Progress bar ticker
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(interval);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase(4);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#02050e] text-white select-none transition-opacity duration-700 ${
        phase === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Matrix & Subtle Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/15 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg w-full">
        {/* Animated Cybernetic Center Emblem */}
        <div className="relative mb-6">
          {/* Pulsing Energy Ring */}
          <div
            className={`absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-25 blur-xl transition-all duration-1000 ${
              phase >= 2 ? 'scale-110 opacity-40' : 'scale-90 opacity-10'
            }`}
          />

          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-4 shadow-2xl shadow-cyan-500/20 flex items-center justify-center backdrop-blur-xl">
            <Code2
              className={`w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 transition-all duration-700 ${
                phase >= 2 ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-12 opacity-40'
              }`}
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-md shadow-emerald-500/50">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            </div>
          </div>
        </div>

        {/* Dynamic System Terminal Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 mb-4 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>INITIALIZING SECURE PLATFORM</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-semibold">VERIFIED</span>
        </div>

        {/* Brand Name Typography Reveal */}
        <div className="overflow-hidden mb-2">
          <h1
            className={`text-3xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent transition-all duration-700 transform ${
              phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            AFFY OFFICIAL
          </h1>
        </div>

        {/* Developer Subtitle & Credentials */}
        <div className="overflow-hidden mb-6">
          <p
            className={`text-xs sm:text-sm text-slate-400 font-mono tracking-wider transition-all duration-700 delay-150 transform ${
              phase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Aftab <span className="text-cyan-400">•</span> Software & Full-Stack Engineering Platform
          </p>
        </div>

        {/* Futuristic Loading Bar */}
        <div className="w-48 sm:w-64 h-1 rounded-full bg-slate-800/80 overflow-hidden mb-8 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-150 rounded-full shadow-sm shadow-cyan-400"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Enter / Skip Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
        >
          <span>Enter Platform</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
