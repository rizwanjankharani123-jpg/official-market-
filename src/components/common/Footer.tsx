import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  ShieldCheck,
  Mail,
  MessageSquare,
  Radio,
  Terminal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL,
  OFFICIAL_WHATSAPP_CHANNEL
} from '../../utils/notifications';

interface FooterProps {
  onOpenZipModal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { settings, setActiveView } = useApp();

  const handleNav = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#04060a] border-t border-white/10 text-slate-400 text-sm mt-20 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Identity & Developer Bio */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white font-mono tracking-tight">
                  AFFY OFFICIAL
                </span>
                <p className="text-xs text-cyan-400 font-mono">
                  Aftab — Web Developer & Software Developer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              AFFY OFFICIAL is Aftab's centralized platform for presenting, developing, and providing verified software applications, production-grade Android APKs, commercial source-code packages, and custom digital software solutions.
            </p>

            {/* Verified Developer Signature Stamp */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-white/10 flex items-center gap-2.5">
                <img
                  src={settings.signatureUrl}
                  alt="Aftab Authorized Signature"
                  className="h-7 w-auto object-contain filter invert opacity-90"
                />
                <div className="text-[10px] border-l border-white/10 pl-2">
                  <p className="text-slate-200 font-semibold">Aftab</p>
                  <p className="text-slate-500 font-mono">Lead Engineer</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Platform</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Navigation</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('software')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Software & APKs</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('bundles')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Software Bundles 📦</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('deals')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Personalized Deals 🎯</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('campaigns')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Campaigns & Events 🗓️</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('giveaways')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Giveaways & Archive 🏆</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('announcements')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Announcements & News 📢</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('request-software')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Request App or Feature 💡</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('library')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>My Digital Vault 📚</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('source-code')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Source Code Marketplace</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('track-order')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Track Order & Invoices</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Terms & Licenses</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Official Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ONLY Official Verified Contact Methods */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Official Contact Channels</p>
            <p className="text-[11px] text-slate-400">These are the only official contact channels for Aftab:</p>
            
            <div className="space-y-2.5 pt-1 text-xs">
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">WhatsApp Direct</p>
                    <p className="text-[11px] text-slate-400">{OFFICIAL_WHATSAPP_NUMBER}</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* WhatsApp Channel */}
              <a
                href={OFFICIAL_WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">WhatsApp Channel</p>
                    <p className="text-[11px] text-slate-400">Follow Official Updates</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Gmail */}
              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-white text-xs">Gmail</p>
                    <p className="text-[11px] text-slate-400 truncate">{OFFICIAL_EMAIL}</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} {settings.brandName} • All Rights Reserved.</p>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-cyan-400/80">Aftab — Web Developer & Software Developer</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Verified Secure Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
