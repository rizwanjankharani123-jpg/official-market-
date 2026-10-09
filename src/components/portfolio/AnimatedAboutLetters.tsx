import React, { useEffect, useState } from 'react';
import { Terminal, Sparkles, ShieldCheck, Flame, Code2 } from 'lucide-react';

interface AnimatedAboutLettersProps {
  prefix?: string;
  name?: string;
  tagline?: string;
}

export const AnimatedAboutLetters: React.FC<AnimatedAboutLettersProps> = ({
  prefix = "SYSTEM ARCHITECT & LEAD ENGINEER",
  name = "AFTAB",
  tagline = "Engineering High-Performance Web Apps, Android APKs & Commercial Software"
}) => {
  const [lettersVisible, setLettersVisible] = useState(false);
  const [typedTagline, setTypedTagline] = useState("");
  const [activeLetterHover, setActiveLetterHover] = useState<number | null>(null);

  useEffect(() => {
    // Trigger animated letters cascade
    const timer = setTimeout(() => {
      setLettersVisible(true);
    }, 150);

    // Typewriter effect for the tagline
    let i = 0;
    const interval = setInterval(() => {
      if (i <= tagline.length) {
        setTypedTagline(tagline.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [tagline]);

  const nameLetters = name.split("");

  return (
    <div className="relative space-y-4 text-left select-none">
      {/* Micro Status Chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
        <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="tracking-wider">{prefix}</span>
      </div>

      {/* Main 3D Animated Letters: "A F T A B" */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2">
        <span className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-400 tracking-tight font-mono">
          ABOUT
        </span>

        <div className="inline-flex items-center gap-1.5 sm:gap-2.5">
          {nameLetters.map((char, index) => {
            const isHovered = activeLetterHover === index;
            return (
              <span
                key={index}
                onMouseEnter={() => setActiveLetterHover(index)}
                onMouseLeave={() => setActiveLetterHover(null)}
                className={`inline-block font-mono font-black text-3xl sm:text-5xl md:text-6xl transition-all duration-300 cursor-pointer transform ${
                  lettersVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-50'
                } ${
                  isHovered
                    ? 'scale-125 -translate-y-2 text-cyan-300 shadow-2xl drop-shadow-[0_0_25px_rgba(0,242,254,0.9)]'
                    : 'text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
                  textShadow: isHovered
                    ? '0 0 30px #00f2fe, 0 0 60px #0284c7'
                    : '0 0 15px rgba(0,242,254,0.3)',
                  animation: `bounceSlight 3s ease-in-out infinite ${index * 0.2}s`
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Verified Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold ml-2 shadow-lg shadow-cyan-950/40">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>CodeWithAffy</span>
        </span>
      </div>

      {/* Kinetic Animated Typewriter Tagline with Cursor */}
      <div className="flex items-center text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed font-sans">
        <span>{typedTagline}</span>
        <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />
      </div>

      {/* Futuristic Under-Glow Neon Bar */}
      <div className="relative h-1 w-full max-w-xl rounded-full overflow-hidden bg-white/5">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full"
          style={{
            width: lettersVisible ? '100%' : '0%',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        <div className="absolute inset-0 bg-cyan-400/30 blur-sm animate-pulse" />
      </div>

      <style>{`
        @keyframes bounceSlight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};
