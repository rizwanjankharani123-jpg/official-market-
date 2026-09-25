import React from 'react';
import { useApp } from '../../context/AppContext';
import { AftabAvatar } from '../common/AftabAvatar';
import {
  Code2,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Cpu,
  CheckCircle2,
  DownloadCloud
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, setActiveView, products, completedProjectsCount, activeProjectsCount } = useApp();

  const handleNav = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-48 right-10 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Developer Identity & CTA */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-sm shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
            <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wide">
              AVAILABLE FOR CUSTOM SOFTWARE & APKS
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                Hi, I'm {settings.developerName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                CodeWithAffy
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              {settings.developerTitle.split('&')[0]} &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Software Engineer
              </span>
            </h1>
          </div>

          {/* Subheading & Bio */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {settings.heroSubheading || settings.bio}
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Verified APKs</p>
                <p className="text-[10px] text-slate-400">100% Malware Free</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Source Licenses</p>
                <p className="text-[10px] text-slate-400">Commercial Rights</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Fast Delivery</p>
                <p className="text-[10px] text-slate-400">Instant Verification</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => handleNav('software')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-black" />
              <span>Explore Software & APKs</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={() => handleNav('source-code')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Browse Source Code</span>
            </button>

            <button
              onClick={() => handleNav('custom-project')}
              className="px-4 py-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 hover:text-white font-bold text-xs sm:text-sm border border-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Custom Project</span>
            </button>
          </div>

          {/* Live Verified Dynamic Stats */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white font-mono">{settings.yearsExperience || 2}+</p>
              <p className="text-[11px] text-slate-400">Years Experience</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{completedProjectsCount}</p>
              <p className="text-[11px] text-slate-400">Completed Projects</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{activeProjectsCount}</p>
              <p className="text-[11px] text-slate-400">Active Projects</p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Futuristic Profile Presentation */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Outer Decorative Ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 opacity-30 blur-lg" />

            {/* Inner Frame */}
            <div className="relative rounded-3xl bg-[#090d16] border border-cyan-500/30 p-4 shadow-2xl shadow-cyan-950/60 overflow-hidden">
              {/* Profile Image with Futuristic Overlay */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 group">
                <AftabAvatar
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  alt="Aftab — Web Developer & Software Developer"
                />

                {/* Cyber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/20" />

                {/* Floating Top Pill */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-cyan-200 font-semibold">{settings.brandName}</span>
                </div>

                {/* Floating Bottom Info Card */}
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{settings.developerName}</p>
                      <p className="text-[11px] text-cyan-400">{settings.developerTitle}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Tech stack mini tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['React', 'Kotlin/Android', 'Node.js', 'PostgreSQL', 'Flutter'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Developer Official Signature Imprint */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-mono text-slate-400">Authorized Signature:</span>
                </div>
                <div className="bg-slate-900/90 px-3 py-1 rounded-lg border border-white/5 flex items-center">
                  <img
                    src={settings.signatureUrl}
                    alt="Official Signature"
                    className="h-6 w-auto object-contain filter invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
