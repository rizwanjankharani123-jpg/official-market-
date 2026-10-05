import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomRequest } from '../../types';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Code2,
  Smartphone,
  Monitor,
  Globe,
  Coins,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/notifications';

export const RequestSoftwareView: React.FC = () => {
  const { submitCustomRequest, setActiveView } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [appType, setAppType] = useState('Android App (APK)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Budget Selection (1,000 PKR to 10,000 PKR + Custom)
  const [selectedBudget, setSelectedBudget] = useState('PKR 1,000 - 3,000');
  const [customBudgetValue, setCustomBudgetValue] = useState('');
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequest | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-configured Budget Options starting from PKR 1,000 to 10,000
  const budgetOptions = [
    { label: 'PKR 1,000 - 3,000', desc: 'Mini Tool / Script / Small Feature' },
    { label: 'PKR 3,000 - 5,000', desc: 'Standard App / 1-2 Screens' },
    { label: 'PKR 5,000 - 10,000', desc: 'Complete Custom App / POS / Android APK' },
    { label: 'PKR 10,000+', desc: 'Full-Stack / Advanced System' },
  ];

  const platformOptions = [
    { id: 'Android App (APK)', label: 'Android APK', icon: Smartphone, desc: 'Mobile App for Android Phones & Tablets' },
    { id: 'Desktop Software (PC)', label: 'Desktop / PC Software', icon: Monitor, desc: 'Windows / Mac Software & POS' },
    { id: 'Website / Web App', label: 'Web Platform', icon: Globe, desc: 'Online Dashboard or SaaS Website' },
    { id: 'Custom Feature / Script', label: 'New Feature / Script', icon: Zap, desc: 'Add feature to existing app or automation' },
  ];

  const handleBudgetSelect = (bLabel: string) => {
    setIsCustomBudget(false);
    setSelectedBudget(bLabel);
  };

  const handleCustomBudgetSelect = () => {
    setIsCustomBudget(true);
    setSelectedBudget('Custom');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!whatsapp.trim() && !email.trim()) {
      setErrorMessage('Please provide either WhatsApp number or email so we can contact you.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please describe what software or feature you need.');
      return;
    }

    const finalBudget = isCustomBudget
      ? customBudgetValue.trim()
        ? `PKR ${customBudgetValue.trim()} (Custom Budget)`
        : 'Open for Discussion (Custom)'
      : selectedBudget;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const newReq = await submitCustomRequest({
        customerName: name.trim(),
        name: name.trim(),
        customerEmail: email.trim() || `${whatsapp.replace(/[^0-9]/g, '')}@whatsapp.affy.com`,
        email: email.trim(),
        customerPhone: whatsapp.trim(),
        whatsapp: whatsapp.trim(),
        requestType: 'software_request',
        projectTitle: title.trim(),
        title: title.trim(),
        projectDescription: description.trim(),
        completeDescription: description.trim(),
        platforms: [appType],
        platform: appType,
        features: [appType],
        requiredFeatures: [appType],
        budget: finalBudget,
        timeline: 'Within 1-2 Weeks',
        additionalInfo: `Budget: ${finalBudget} | Type: ${appType}`,
        additionalRequirements: ''
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setSubmittedRequest(newReq);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // WhatsApp quick-chat action
  const openWhatsAppDirect = (reqId: string) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Aftab! 👋\n\nI just submitted a software request on your portal:\n• Request ID: #${reqId}\n• Project: ${title}\n• Type: ${appType}\n• Budget: ${isCustomBudget ? customBudgetValue : selectedBudget}\n• Name: ${name}\n\nPlease review and let me know the timeline. Thank you!`
    );
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1226] via-[#090d16] to-[#0a1226] border border-cyan-500/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>DIRECT DEVELOPER REQUEST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Request Custom Software or Feature
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Need an Android APK, Windows software, custom billing system, or a special feature? Submit your request easily starting from <strong className="text-emerald-400 font-bold">PKR 1,000</strong>.
          </p>
        </div>
      </div>

      {submittedRequest ? (
        /* SUCCESS CONFIRMATION VIEW */
        <div className="rounded-3xl bg-[#090d16] border border-emerald-500/40 p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-success-pop">
          {/* Animated Glow Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-pulse-glow">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              ✓ REQUEST LOGGED DIRECTLY
            </span>
            <h2 className="text-2xl font-black text-white">
              Request Sent Successfully! 🎉
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aftab has received your software specifications. You will get a quick response on WhatsApp/Email with the timeline & solution.
            </p>
          </div>

          {/* Reference Receipt Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
              <span className="text-slate-400">Request ID:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">#{submittedRequest.id.slice(0, 10).toUpperCase()}</span>
                <button
                  onClick={() => handleCopyId(submittedRequest.id)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer active:scale-90"
                  title="Copy ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Project Title:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{submittedRequest.projectTitle || submittedRequest.title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform:</span>
                <span className="text-cyan-300">{submittedRequest.platform || appType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Budget:</span>
                <span className="text-emerald-400 font-bold">{submittedRequest.budget}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openWhatsAppDirect(submittedRequest.id)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 btn-shimmer btn-glow-emerald cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-black" />
              <span>Direct Chat on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                setSubmittedRequest(null);
                setTitle('');
                setDescription('');
                setCustomBudgetValue('');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono cursor-pointer active:scale-95"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* SIMPLE & FRIENDLY REQUEST FORM */
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* 1. What type of software do you need? */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Choose Target Platform / App Type *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {platformOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = appType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAppType(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer card-elevate flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                        : 'bg-slate-900 border-white/5 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. What do you want to build? */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>2. Software Details *</span>
            </label>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Software / Project Name *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pharmacy POS APK, School Fee App, Attendance Bot"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Describe Your Idea or Requirements *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what the software should do (in Urdu or English). For example:&#10;- Main features needed (e.g. offline billing, barcode scanner, PDF receipt, user login)&#10;- Who will use this app..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* 3. Budget Bracket (Starting 1,000 PKR up to 10,000 PKR + Custom) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>3. Select Your Budget (PKR 1,000 - 10,000+) *</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">Affordable & Flexible</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {budgetOptions.map((b) => {
                const isSelected = !isCustomBudget && selectedBudget === b.label;
                return (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => handleBudgetSelect(b.label)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer card-elevate ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-white/5 hover:border-emerald-500/30'
                    }`}
                  >
                    <p className="text-xs font-bold text-white font-mono">{b.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Budget Toggle Option */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCustomBudgetSelect}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer card-elevate flex items-center justify-between ${
                  isCustomBudget
                    ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/50 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border-white/5 hover:border-emerald-500/30'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white font-mono">✍️ Enter Custom Budget (Custom Price)</p>
                  <p className="text-[10px] text-slate-400">Specify your exact available budget in PKR</p>
                </div>
                {isCustomBudget && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Custom Budget Input Box */}
              {isCustomBudget && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1 animate-in fade-in">
                  <label className="text-[11px] font-mono text-emerald-400 font-bold">
                    Enter Custom Budget Amount (PKR):
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-slate-400 font-bold">PKR</span>
                    <input
                      type="number"
                      value={customBudgetValue}
                      onChange={(e) => setCustomBudgetValue(e.target.value)}
                      placeholder="e.g. 2500, 7500, 15000"
                      min="500"
                      className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Your Contact Details */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>4. Your Contact Details (For Fast Response) *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-400 font-bold mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ali@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct confidential response from Aftab Ahmed</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 btn-shimmer btn-glow-emerald cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Send className="w-4 h-4 text-black" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Software Request'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
