import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  MessageSquare,
  Radio,
  Send,
  CheckCircle2,
  Sparkles,
  Terminal,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, submitCustomRequest } = useApp();
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const officialWhatsapp = '+92 326 3724861';
  const whatsappUrl = 'https://wa.me/923263724861';
  const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d';
  const officialEmail = 'affyofficial.dev@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    await submitCustomRequest({
      customerName: name,
      customerEmail: email,
      projectTitle: 'Direct Contact Form Inquiry',
      projectDescription: message,
      platforms: ['Web', 'Mobile'],
      features: ['General Inquiry / Consultation'],
      budget: 'Discussion on call',
      timeline: 'Standard'
    });

    setFormSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Section Header */}
      <div className="space-y-3 mb-12 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>OFFICIAL COMMUNICATION CHANNELS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Contact <span className="text-cyan-400">Aftab</span> — AFFY OFFICIAL
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          These are the <strong className="text-white">only verified official contact channels</strong> for Aftab and AFFY OFFICIAL. Connect directly via WhatsApp, join the official broadcast channel for releases, or send an official email.
        </p>
      </div>

      {/* EXACT THREE OFFICIAL CONTACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {/* Card 1: WhatsApp Direct */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex flex-col justify-between text-left space-y-5 group shadow-lg shadow-emerald-950/20">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">Direct Chat</span>
              <h3 className="text-lg font-bold text-white font-mono">WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-1">Direct contact with Aftab for custom development, software inquiries, and instant support.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-200">
              {officialWhatsapp}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4 text-black" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </a>
        </div>

        {/* Card 2: WhatsApp Channel */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between text-left space-y-5 group shadow-lg shadow-cyan-950/20">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">Official Broadcast</span>
              <h3 className="text-lg font-bold text-white font-mono">WhatsApp Channel</h3>
              <p className="text-xs text-slate-400 mt-1">Follow official release updates, new APK drops, source code releases, and software changelogs.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-cyan-300 truncate">
              AFFY OFFICIAL Broadcast Channel
            </div>
          </div>

          <a
            href={whatsappChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <Radio className="w-4 h-4 text-black" />
            <span>Join WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </a>
        </div>

        {/* Card 3: Email */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-indigo-500/30 hover:border-indigo-400/60 transition-all flex flex-col justify-between text-left space-y-5 group shadow-lg shadow-indigo-950/20">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Official Inquiries</span>
              <h3 className="text-lg font-bold text-white font-mono">Email</h3>
              <p className="text-xs text-slate-400 mt-1">Send formal proposals, custom software requirements, licensing queries, or verification proofs.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-indigo-200 truncate">
              {officialEmail}
            </div>
          </div>

          <a
            href={`mailto:${officialEmail}`}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
          >
            <Mail className="w-4 h-4 text-white" />
            <span>Email Aftab</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>

      {/* Official Inquiries Dispatch Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-lg font-mono flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Send Direct Inquiry to Aftab</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Have questions about an APK or need source code customization? Fill out this quick form.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Developer Inbox</span>
          </div>
        </div>

        {formSent ? (
          <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-mono">Inquiry Dispatched to Aftab</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Thank you! Your message has been routed directly to Aftab's verified email (<strong className="text-white">{officialEmail}</strong>). You will receive a response within 2-4 hours.
            </p>
            <button
              onClick={() => setFormSent(false)}
              className="mt-3 px-5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Ahmed"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Message / Requirements *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what software, source code, or custom service you are looking for..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4 text-black" />
              <span>Send Message to Aftab</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
