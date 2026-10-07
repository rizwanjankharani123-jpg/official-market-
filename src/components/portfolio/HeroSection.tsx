import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Package,
  Gift,
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  DownloadCloud,
  CheckCircle2,
  Code2,
  Terminal,
  Search,
  UserCheck
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, setActiveView, products } = useApp();

  const handleNav = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeAppsCount = products.filter(p => p.pricingType === 'free' || p.price === 0).length;
  const totalApksCount = products.filter(p => p.isApkOnly || p.category === 'Android App').length || products.length;

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-left">
      {/* Dynamic Ambient Background Illumination */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Main Storefront Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#090d16] to-[#07090e] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Storefront Headlines & Search / Actions */}
          <div className="lg:col-span-8 space-y-5">
            {/* Live Store Status & Highlights */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>OFFICIAL APK & SOFTWARE HUB</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% Virus-Free & Verified</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Download Verified <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  Android APKs & Software
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Explore standalone Android APKs, Pro tools, 100% Free apps, and custom software utilities. Instant download access and direct developer support.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleNav('software')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:brightness-110 text-black font-black text-xs sm:text-sm font-mono flex items-center gap-2 shadow-xl shadow-cyan-500/25 btn-shimmer btn-glow-cyan cursor-pointer active:scale-95 transition-all"
              >
                <Smartphone className="w-4 h-4 text-black" />
                <span>Browse All APKs & Software</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={() => handleNav('free-apps')}
                className="px-5 py-3.5 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm font-mono border border-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer card-elevate"
              >
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Free Downloads ({freeAppsCount > 0 ? freeAppsCount : '100% Free'})</span>
              </button>

              {/* Dedicated Developer Portfolio Button */}
              <button
                onClick={() => handleNav('portfolio')}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 font-bold text-xs sm:text-sm font-mono border border-white/10 hover:border-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer card-elevate"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Developer Portfolio 💼</span>
              </button>
            </div>

            {/* Quick Filter Navigation Badges */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 text-[11px] uppercase mr-1">Quick Jump:</span>
              <button
                onClick={() => handleNav('software')}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-cyan-950/60 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Flame className="w-3 h-3 text-rose-400" />
                <span>Trending APKs</span>
              </button>
              <button
                onClick={() => handleNav('bundles')}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-purple-950/60 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Bundles 📦</span>
              </button>
              <button
                onClick={() => handleNav('deals')}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-amber-950/60 border border-white/5 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Deals & Offers</span>
              </button>
              <button
                onClick={() => handleNav('request-software')}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Request Custom App</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Feature Cards & Verification Stats */}
          <div className="lg:col-span-4 space-y-3">
            {/* Feature Card 1: Android APKs */}
            <div
              onClick={() => handleNav('software')}
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer card-elevate group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Android APKs & Pro Tools
                    </h4>
                    <p className="text-[11px] text-slate-400">Direct standalone APK packages</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Feature Card 2: 100% Free Downloads */}
            <div
              onClick={() => handleNav('free-apps')}
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-400/50 transition-all cursor-pointer card-elevate group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      100% Free Applications
                    </h4>
                    <p className="text-[11px] text-slate-400">Zero cost instant downloads</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Feature Card 3: Custom Software Development */}
            <div
              onClick={() => handleNav('request-software')}
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-indigo-950/30 border border-indigo-500/20 hover:border-indigo-400/50 transition-all cursor-pointer card-elevate group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Custom Software Request
                    </h4>
                    <p className="text-[11px] text-slate-400">Starting from PKR 1,000</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
