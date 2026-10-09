import React, { useState } from 'react';
import { RealisticLaptop3DCanvas, LaptopScreenMode } from './RealisticLaptop3DCanvas';
import {
  Code2,
  Globe,
  Layers,
  Sparkles,
  Terminal,
  Cpu,
  ShieldCheck,
  Package,
  FileCode2,
  Radio,
  Zap,
  CheckCircle2,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Portfolio3DWorkstation: React.FC = () => {
  const { setActiveView, products } = useApp();
  const [activeTab, setActiveTab] = useState<LaptopScreenMode>('code');

  const apkCount = products.filter(p => p.isApkOnly || p.category === 'Android App').length || 8;
  const sourceCount = products.filter(p => p.sourceAvailable).length || 12;

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left overflow-visible">
      {/* Dynamic Deep Ambient Lighting (Seamlessly Blends into Website Background) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-500/12 via-blue-600/8 to-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Header with VIP Architecture Readout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono backdrop-blur-md shadow-lg shadow-cyan-950/30">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AFFY OFFICIAL • 3D WORKSTATION ENGINE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">3D Workstation</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Experience real-time code compilation and the live <strong className="text-white">AFFY OFFICIAL</strong> web platform animating seamlessly right inside the browser canvas with zero box borders.
          </p>
        </div>

        {/* Live Spec Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 flex items-center gap-2 shadow-lg">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>WebGL 3D Studio</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 flex items-center gap-2 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aftab Verified</span>
          </div>
        </div>
      </div>

      {/* 
        MAIN 3D LAPTOP STAGE:
        Completely seamless, floating directly on the page, with zero video borders or enclosing cards!
      */}
      <div className="relative my-4 overflow-visible">
        {/* Floating Ambient Telemetry Chips (Desktop view) */}
        <div className="hidden lg:block absolute top-8 left-4 z-30 pointer-events-none">
          <div className="px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE COMPILER ACTIVE</span>
            </div>
            <p className="text-slate-400">Vite 8.3 • React 19 • TypeScript</p>
          </div>
        </div>

        <div className="hidden lg:block absolute top-8 right-4 z-30 pointer-events-none">
          <div className="px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% VIRUS-FREE APKS</span>
            </div>
            <p className="text-slate-400">Commercial Source Available</p>
          </div>
        </div>

        {/* The 3D Laptop Canvas (True Transparency) */}
        <RealisticLaptop3DCanvas
          initialMode={activeTab}
          autoRotate={true}
          className="w-full"
        />
      </div>

      {/* Interactive Mode Switcher Cards (Sleek VIP Grid Below the Laptop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 relative z-20">
        {/* Mode 1: Real-Time Code Engine */}
        <button
          onClick={() => setActiveTab('code')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group backdrop-blur-md ${
            activeTab === 'code'
              ? 'bg-cyan-950/40 border-cyan-400/80 shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-400/40'
              : 'bg-[#080d18]/70 border-white/10 hover:border-cyan-500/40 hover:bg-[#0c1322]/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'code' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md font-bold">
              01 • CODE RUNNER
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
            Real-Time Code Execution
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Watch live TypeScript algorithms and React architecture type out onto the 3D laptop's 2K screen with compilation logs and active terminal cursor.
          </p>
        </button>

        {/* Mode 2: AFFY OFFICIAL Web Live */}
        <button
          onClick={() => setActiveTab('web')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group backdrop-blur-md ${
            activeTab === 'web'
              ? 'bg-emerald-950/40 border-emerald-400/80 shadow-xl shadow-emerald-950/60 ring-1 ring-emerald-400/40'
              : 'bg-[#080d18]/70 border-white/10 hover:border-emerald-500/40 hover:bg-[#0c1322]/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'web' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
              02 • LIVE WEB APP
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-mono group-hover:text-emerald-300 transition-colors">
            AFFY OFFICIAL Web Live
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The laptop screen seamlessly renders the official <strong className="text-white">affyofficial.dev</strong> web app with full browser chrome, navigation, verified badges, and apps.
          </p>
        </button>

        {/* Mode 3: Dual Split Mode */}
        <button
          onClick={() => setActiveTab('split')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-3 group backdrop-blur-md ${
            activeTab === 'split'
              ? 'bg-purple-950/40 border-purple-400/80 shadow-xl shadow-purple-950/60 ring-1 ring-purple-400/40'
              : 'bg-[#080d18]/70 border-white/10 hover:border-purple-500/40 hover:bg-[#0c1322]/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              activeTab === 'split' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md font-bold">
              03 • DUAL SPLIT
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-mono group-hover:text-purple-300 transition-colors">
            Full-Stack Dual Screen
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Observe the synchronous workflow: backend engine development on the left screen half alongside live responsive client website preview on the right.
          </p>
        </button>
      </div>
    </section>
  );
};
