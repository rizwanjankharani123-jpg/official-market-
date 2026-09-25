import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileCheck, Lock, AlertTriangle, Terminal, Award, CheckCircle2, MessageSquare } from 'lucide-react';

export const TermsView: React.FC = () => {
  const { settings } = useApp();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <FileCheck className="w-3.5 h-3.5" />
          <span>LEGAL COMPLIANCE & TERMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Terms of Service & Licensing Agreements
        </h1>
        <p className="text-sm text-slate-300">
          Official commercial software licenses, source-code redistribution policies, payment verification procedures, and digital delivery guarantees governing {settings.brandName}.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1: Overview */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="text-cyan-400">1.0</span> Platform & Licensing Scope
          </h2>
          <p>
            This platform, operated by <strong className="text-white">{settings.developerName}</strong> (CodeWithAffy / {settings.brandName}), provides proprietary software binaries (Android APKs, desktop/executable packages), commercial source-code licenses, and custom software development services. By purchasing or commissioning software through this platform, the licensee agrees to be bound by these Terms.
          </p>
        </div>

        {/* Section 2: Software / APK Licenses */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="text-cyan-400">2.0</span> Software & APK Binary Terms
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 whitespace-pre-line text-xs font-mono text-slate-300">
            {settings.softwareTerms || `1. Digital Goods Delivery: All software and APK packages are digital goods delivered electronically.\n2. Verification: Orders require manual payment audit before access is granted.\n3. License Scope: Software licenses grant full operational rights for your organization.\n4. Support: Packages include technical assistance directly from Aftab.`}
          </div>
        </div>

        {/* Section 3: Commercial Source Code License */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="text-indigo-400">3.0</span> Commercial Source Code Rights & Restrictions
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 text-xs">
            <div className="whitespace-pre-line font-mono text-slate-300">
              {settings.sourceCodeTerms || `1. Commercial Rights: Full rights to modify, compile, and deploy for client applications.\n2. Redistribution Prohibitions: Reselling raw source files or open-sourcing is prohibited.\n3. Intellectual Property: Foundational copyright remains with AFFY OFFICIAL.`}
            </div>

            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                <p className="font-bold text-emerald-400 font-mono text-[11px] mb-1">✓ PERMITTED USE</p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Rebranding and renaming the application</li>
                  <li>• Deploying for commercial clients</li>
                  <li>• Modifying code and database schemas</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20">
                <p className="font-bold text-rose-400 font-mono text-[11px] mb-1">✗ PROHIBITED USE</p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Sublicensing raw uncompiled source files</li>
                  <li>• Uploading uncompiled code to public repositories</li>
                  <li>• Reselling as a competing digital template</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Payment Verification */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="text-cyan-400">4.0</span> Payment Audit & Order Verification
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 whitespace-pre-line text-xs font-mono text-slate-300">
            {settings.paymentTerms || `1. Payment Verification: Submit valid Transaction ID and screenshot proof.\n2. Manual Audit: Inspected within 15-60 minutes by Aftab.\n3. Supported Gateways: JazzCash, Easypaisa, Bank Transfer, Binance USDT.`}
          </div>
        </div>

        {/* Section 5: Refund Policy */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400">5.0</span> Refund Policy & Digital Asset Delivery
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 whitespace-pre-line text-xs text-slate-300">
            {settings.refundPolicy || `Refunds are available if requested before the secure download link has been accessed or if a verified defect is demonstrated that cannot be rectified within 7 business days.`}
          </div>
        </div>

        {/* Section 6: Official Certificates */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">6.0</span> Official License Certificates & Invoices
          </h2>
          <p>
            Every verified purchase is accompanied by an electronic Commercial Invoice (<strong className="text-white">AFFY-INV-XXXXXX</strong>) and an official License Certificate (<strong className="text-white">AFFY-CERT-XXXXXX</strong>) bearing Aftab's authorized signature stamp. Both documents can be downloaded as formal PDF files directly from the Order Tracking vault.
          </p>
        </div>

        {/* Official Contact Note */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-bold text-white">Questions regarding commercial licensing or custom terms?</p>
            <p className="text-slate-400">Contact Aftab directly at <strong>{settings.email}</strong> or WhatsApp <strong>{settings.phone}</strong>.</p>
          </div>
          <a
            href="https://wa.me/923263724861"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
