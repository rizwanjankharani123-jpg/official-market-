import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomRequest, Quotation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  formatCustomProjectWhatsAppMessage,
  generateWhatsAppNotificationUrl,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL
} from '../../utils/notifications';
import {
  Sparkles,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  DollarSign,
  Layers,
  Search,
  Hash,
  AlertCircle,
  HelpCircle,
  Terminal,
  Smartphone,
  Globe,
  Server,
  ArrowRight,
  MessageSquare,
  Mail,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomProjectView: React.FC = () => {
  const { submitCustomRequest, customRequests, quotations, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submission form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Android (Native/Kotlin)', 'Web Application (React)']);
  const [featureItem, setFeatureItem] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Secure User Authentication & Roles',
    'Real-Time Cloud Database & Offline Cache',
    'Automated Invoicing & Export Tools'
  ]);
  const [budget, setBudget] = useState('PKR 50,000 - PKR 150,000');
  const [timeline, setTimeline] = useState('3 - 5 Weeks');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking tab state
  const [lookupId, setLookupId] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<CustomRequest | null>(null);
  const [associatedQuotation, setAssociatedQuotation] = useState<Quotation | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const availablePlatforms = [
    'Android Native (Kotlin / Jetpack Compose)',
    'Cross-Platform Mobile (Flutter / React Native)',
    'Web Application (React / Next.js / TypeScript)',
    'Full-Stack Cloud SaaS Platform',
    'Desktop Application (Windows / MacOS / Linux)',
    'Backend API & Microservices (Node.js / Express / Go)',
    'Point of Sale (POS) & Retail System',
    'Custom Automation / Utility Engine'
  ];

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handleAddFeature = () => {
    if (featureItem.trim()) {
      setFeaturesList(prev => [...prev, featureItem.trim()]);
      setFeatureItem('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !projectTitle || !projectDescription) return;

    setIsSubmitting(true);
    try {
      const req = await submitCustomRequest({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        projectTitle: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['Web / Android Custom'],
        features: featuresList,
        budget: budget || 'Open for Discussion',
        timeline: timeline || 'Flexible',
        additionalInfo: additionalRequirements.trim()
      });

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setSubmittedRequest(req);
    } catch (e) {
      console.error('Custom project submission error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupSearched(true);
    const query = lookupId.trim().toUpperCase();

    const match = customRequests.find(r => r.id.toUpperCase() === query);
    if (match) {
      setTrackedRequest(match);
      const quo = quotations.find(q => q.requestId === match.id);
      setAssociatedQuotation(quo || null);
    } else {
      setTrackedRequest(null);
      setAssociatedQuotation(null);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left">
      {/* Hero Header for Custom Project */}
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CUSTOM SOFTWARE COMMISSION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Have an idea? <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Let's build it.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Send your complete software, mobile application, or web system idea directly to Aftab. I will personally review your technical requirements, architectural scope, and prepare a verified roadmap and quotation.
        </p>

        {/* Tab Controls */}
        <div className="pt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Start Your Project</span>
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>2. Track Status & Quotation</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT FORM */}
      {activeTab === 'submit' && (
        <>
          {submittedRequest ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-[#090d16] border border-emerald-500/40 text-center space-y-6 animate-in fade-in shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Request Successfully Registered
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {submittedRequest.id}
                </h2>
                <p className="text-sm text-slate-300 max-w-xl mx-auto">
                  Your project concept <strong className="text-white">"{submittedRequest.projectTitle}"</strong> has been securely logged in the system.
                </p>
              </div>

              {/* Request Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 max-w-lg mx-auto text-left text-xs space-y-2.5 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Request ID:</span>
                  <span className="text-cyan-300 font-bold">{submittedRequest.id}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Status:</span>
                  <StatusBadge status={submittedRequest.status} />
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-slate-400">Client:</span>
                  <span className="text-slate-200">{submittedRequest.customerName} ({submittedRequest.customerEmail})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">WhatsApp:</span>
                  <span className="text-slate-200">{submittedRequest.customerPhone || 'Not specified'}</span>
                </div>
              </div>

              {/* Fast-Track WhatsApp CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 max-w-lg mx-auto space-y-3">
                <p className="text-xs text-slate-300">
                  Want an immediate response? You can send this request directly to Aftab's verified WhatsApp with one click:
                </p>
                <a
                  href={generateWhatsAppNotificationUrl(submittedRequest)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>Notify Aftab on WhatsApp (+92 326 3724861)</span>
                </a>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setProjectTitle('');
                    setProjectDescription('');
                    setAdditionalRequirements('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 font-mono transition-colors"
                >
                  Submit Another Project
                </button>
                <button
                  onClick={() => {
                    setLookupId(submittedRequest.id);
                    setActiveTab('track');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-colors"
                >
                  Track in Quotation Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl space-y-8">
              {/* 1. Client Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center">1</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Client Contact & Communication
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. tariq@business.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">WhatsApp Number (For Direct Updates)</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +92 326 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Project Title & Complete Idea */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center">2</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Project Concept & Complete Idea
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Project Title / Working Name *</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Cloud Pharmacy ERP & Android Barcode POS"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Describe Your Complete Project Idea in Detail *
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Write freely in your own words: explain your target users, daily workflows, core features, database needs, or business logic.
                  </p>
                  <textarea
                    required
                    rows={7}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Provide your complete vision here. For example:
- Purpose of the application
- Who are the users / roles (admin, staff, customer)
- Main screens or modules needed
- Special workflows, hardware integrations, or payment gateways..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 3. Platform Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center">3</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Target Platforms (Select all that apply)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {availablePlatforms.map((plat) => {
                    const isSelected = selectedPlatforms.includes(plat);
                    return (
                      <div
                        key={plat}
                        onClick={() => togglePlatform(plat)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-semibold'
                            : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span className="line-clamp-2">{plat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Feature List Builder */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center">4</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Required Features & Modules
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureItem}
                    onChange={(e) => setFeatureItem(e.target.value)}
                    placeholder="Add specific feature (e.g. Offline SQLite, Thermal 80mm Printing, Realtime Push Notifications...)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {featuresList.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-500 hover:text-rose-400 font-bold ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Budget, Timeline & Additional Requirements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center">5</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Budget, Timeline & Additional Notes
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Budget Bracket (Optional)</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
                    >
                      <option value="Under PKR 50,000">Under PKR 50,000 (Small module / lightweight script)</option>
                      <option value="PKR 50,000 - PKR 150,000">PKR 50,000 - PKR 150,000 (MVP / Mobile App / Web Portal)</option>
                      <option value="PKR 150,000 - PKR 350,000">PKR 150,000 - PKR 350,000 (Full-Stack System / ERP)</option>
                      <option value="PKR 350,000 - PKR 1,000,000+">PKR 350,000 - PKR 1,000,000+ (Multi-Branch Enterprise Solution)</option>
                      <option value="Open / Custom Quotation">Open / Custom Quotation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Target Timeline (Optional)</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
                    >
                      <option value="1 - 2 Weeks (Express / Urgent)">1 - 2 Weeks (Express / Urgent)</option>
                      <option value="3 - 5 Weeks (Standard Production)">3 - 5 Weeks (Standard Production)</option>
                      <option value="6 - 10 Weeks (Large Scale Ecosystem)">6 - 10 Weeks (Large Scale Ecosystem)</option>
                      <option value="Flexible Timeline">Flexible Timeline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Additional Requirements or Third-Party Integrations (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="e.g. Requires Firebase integration, custom domain deployment, thermal receipt layout format, specific color scheme..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Direct consultation with Aftab (CodeWithAffy)</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Registering Project...' : 'Start Your Project'}</span>
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* TAB 2: TRACK CUSTOM REQUEST / QUOTATION */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Lookup Box */}
          <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Lookup Submitted Request or Quotation</span>
            </h3>
            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                required
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Reference ID (e.g. AFFY-REQ-551029)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono hover:bg-cyan-400 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          {lookupSearched && !trackedRequest && (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 text-center text-xs text-slate-400">
              No project request found for "{lookupId}". Please verify your reference number.
            </div>
          )}

          {trackedRequest && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-white font-mono">{trackedRequest.id}</h2>
                    <StatusBadge status={trackedRequest.status} />
                  </div>
                  <h3 className="text-base font-bold text-slate-200 mt-1">{trackedRequest.projectTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Submitted on {new Date(trackedRequest.createdAt).toLocaleDateString()} by {trackedRequest.customerName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateWhatsAppNotificationUrl(trackedRequest)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Aftab</span>
                  </a>
                </div>
              </div>

              {/* Complete Submitted Idea */}
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 text-xs">
                <p className="font-mono text-cyan-400 font-semibold uppercase text-[11px]">Submitted Project Concept:</p>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{trackedRequest.projectDescription}</p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <p className="text-slate-500 font-mono text-[10px] uppercase">Platforms</p>
                  <p className="text-slate-200 font-medium mt-1">{trackedRequest.platforms.join(', ')}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <p className="text-slate-500 font-mono text-[10px] uppercase">Target Budget</p>
                  <p className="text-emerald-400 font-mono font-bold mt-1">{trackedRequest.budget}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <p className="text-slate-500 font-mono text-[10px] uppercase">Timeline Target</p>
                  <p className="text-cyan-300 font-medium mt-1">{trackedRequest.timeline}</p>
                </div>
              </div>

              {/* Features List */}
              {trackedRequest.features && trackedRequest.features.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                  <p className="font-mono text-slate-400 text-[11px] uppercase">Target Features:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trackedRequest.features.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-mono text-[11px] border border-white/5">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes if provided */}
              {trackedRequest.adminNotes && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
                  <p className="font-mono text-indigo-300 font-semibold">Notes from Aftab:</p>
                  <p className="text-slate-300">{trackedRequest.adminNotes}</p>
                </div>
              )}

              {/* Official Quotation Box if Quoted */}
              {associatedQuotation && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        OFFICIAL QUOTATION
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">Quotation ID: {associatedQuotation.id}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-400 font-mono">
                        PKR {associatedQuotation.quotationAmount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">Estimated: {associatedQuotation.estimatedDays} Days</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-xs">
                    <p className="font-mono text-cyan-300 font-semibold">Proposed Architectural Scope:</p>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{associatedQuotation.scope}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-400 font-mono">
                      Payment Terms: {associatedQuotation.paymentTerms}
                    </p>
                    <a
                      href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Aftab, I am reviewing Quotation ${associatedQuotation.id} for "${trackedRequest.projectTitle}". Let's proceed.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Accept & Discuss with Aftab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
