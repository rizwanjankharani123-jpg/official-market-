import React from 'react';
import { useApp } from '../../context/AppContext';
import { AftabAvatar } from '../common/AftabAvatar';
import {
  Code2,
  Smartphone,
  Server,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight,
  MessageSquare,
  Radio,
  Mail,
  CheckCircle2,
  FileCode2,
  Package,
  Sparkles,
  HelpCircle,
  Lock,
  Receipt,
  Award
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings, setActiveView } = useApp();

  const officialWhatsapp = '+92 326 3724861';
  const whatsappUrl = 'https://wa.me/923263724861';
  const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d';
  const officialEmail = 'affyofficial.dev@gmail.com';

  const skillGroups = [
    {
      title: 'Web & Full-Stack Development',
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'SQLite'],
      description: 'Building high-performance web platforms, dashboards, and responsive digital ecosystems.'
    },
    {
      title: 'Android & Mobile Applications',
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      skills: ['Android Studio', 'Kotlin', 'Jetpack Compose', 'ExoPlayer', 'Capacitor', 'Offline SQLite', 'Bluetooth ESC/POS'],
      description: 'Engineering battle-tested Android APKs, streaming players, and retail Point of Sale systems.'
    },
    {
      title: 'Backend, Databases & Security',
      icon: <Server className="w-5 h-5 text-indigo-400" />,
      skills: ['Firebase Firestore', 'Cloud Storage', 'PostgreSQL', 'WebSockets', 'Payment Gateway Logic', 'Docker'],
      description: 'Designing fault-tolerant backends, real-time message brokers, and verified transaction systems.'
    },
    {
      title: 'Source Code & Commercial Licensing',
      icon: <FileCode2 className="w-5 h-5 text-purple-400" />,
      skills: ['Clean Architecture', 'Modular Codebases', 'Detailed Setup Guides', 'Commercial Rights', 'Developer Support'],
      description: 'Delivering well-documented source packages ready for commercial deployment and customization.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Section Header */}
      <div className="space-y-3 mb-16 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>ABOUT AFTAB & AFFY OFFICIAL</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Engineering Practical Software <span className="text-cyan-400">&</span> Digital Solutions
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Get to know the developer behind the platform, why AFFY OFFICIAL exists, and how you can access verified software and source-code packages.
        </p>
      </div>

      {/* Main Personal Profile & Message Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        {/* Left Column: Authentic First-Person Letter From Aftab */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">Direct Message</span>
              <h3 className="text-xl font-bold text-white font-mono">A Message From Aftab</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              CodeWithAffy
            </span>
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Hi, I'm <strong className="text-white">Aftab</strong>, a Web Developer and Software Developer. Over the years of designing, coding, and deploying applications, I created <strong className="text-cyan-300">AFFY OFFICIAL</strong> as my centralized personal platform to present, develop, and deliver high-quality digital products directly to clients and fellow developers.
            </p>

            <p>
              Rather than generic templates or bloated mockups, I focus on building <strong className="text-white">practical, production-ready software</strong>—from retail Point-of-Sale systems and streaming players to encrypted messengers and full-stack web applications.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">What You Can Find On AFFY OFFICIAL:</h4>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Ready Software & Android APKs:</strong> Complete, verified, malware-free executable software and mobile applications ready for deployment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileCode2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Commercial Source-Code Packages:</strong> Full, clean, uncompiled source code with documentation for businesses, agencies, and developers to rebrand and launch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Custom Project Commission:</strong> Direct custom software development tailored to your exact business workflow and technical requirements.</span>
                </li>
              </ul>
            </div>

            <p>
              Every transaction on this platform includes manual payment verification, an official downloadable commercial invoice, and a signed Certificate of Authenticity & License. I stand behind the software I create with direct developer support.
            </p>
          </div>

          {/* Signature & Guarantee Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white font-mono">Aftab</p>
              <p className="text-[11px] text-cyan-400">Web Developer & Software Developer</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                <img
                  src={settings.signatureUrl}
                  alt="Aftab's Signature"
                  className="h-7 w-auto object-contain filter invert opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Profile Card & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card with Exact Photo */}
          <div className="p-6 rounded-3xl bg-[#090d16] border border-cyan-500/30 text-left space-y-5 shadow-2xl shadow-cyan-950/30">
            <div className="relative aspect-[4/4.5] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
              <AftabAvatar
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-top"
                alt="Aftab — Web Developer & Software Developer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/30" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                VERIFIED DEVELOPER
              </div>
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/10">
                <p className="text-sm font-bold text-white font-mono">Aftab</p>
                <p className="text-xs text-cyan-400">Web Developer & Software Developer</p>
              </div>
            </div>

            {/* Platform Purpose Highlights */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Platform</span>
                <span className="font-mono text-white font-bold">AFFY OFFICIAL</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Brand Identity</span>
                <span className="font-mono text-cyan-300 font-semibold">CodeWithAffy</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Specialization</span>
                <span className="text-white">Web Apps, Android APKs & Source Code</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400">Direct Support</span>
                <span className="text-emerald-400 font-semibold">WhatsApp & Email</span>
              </div>
            </div>

            {/* Quick Contact CTAs */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-black" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${officialEmail}`}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Aftab</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* HOW PURCHASING WORKS — CRYSTAL CLEAR UX STEPPER */}
      <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#07090e] border border-cyan-500/20 text-left space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENT PURCHASING WORKFLOW</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-mono">
            How Purchasing & Delivery Works on AFFY OFFICIAL
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Every step is designed for maximum clarity, transaction security, and direct accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/30">
              01
            </div>
            <h4 className="font-bold text-white text-sm">Select Product or Source</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse our software catalogue. Choose between the compiled <strong>Executable / APK</strong> or the full <strong>Source Code Commercial License</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/30">
              02
            </div>
            <h4 className="font-bold text-white text-sm">Transfer & Submit Proof</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay via JazzCash, Easypaisa, Bank IBAN, or Binance USDT. Enter your Transaction ID (TRX) and attach a payment screenshot.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/30">
              03
            </div>
            <h4 className="font-bold text-white text-sm">Manual Admin Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aftab verifies your payment slip within 15-60 minutes. Your order status immediately changes to <strong>Payment Confirmed</strong>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/30">
              04
            </div>
            <h4 className="font-bold text-white text-sm">Instant Download & Documents</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your secure vault unlocks. Download your files, save your <strong>Commercial PDF Invoice</strong>, and claim your signed <strong>License Certificate</strong>.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActiveView('software');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Explore Ready Software</span>
          </button>
          <button
            onClick={() => {
              setActiveView('track-order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>Track Existing Order / Download Invoices</span>
          </button>
        </div>
      </div>

      {/* Technical Skill Groups Grid */}
      <div className="space-y-6">
        <div className="text-left space-y-1">
          <h3 className="text-lg font-bold text-white font-mono">Engineering Stack & Technical Proficiencies</h3>
          <p className="text-xs text-slate-400">Core technologies utilized across web, mobile, and backend architectures on AFFY OFFICIAL.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillGroups.map((group, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all text-left space-y-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                  {group.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{group.title}</h4>
                  <p className="text-xs text-slate-400">{group.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-300 text-xs font-mono border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
