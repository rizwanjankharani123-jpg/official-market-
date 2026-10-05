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
  Smartphone,
  Globe,
  Monitor,
  Zap,
  ArrowRight,
  MessageSquare,
  Mail,
  ShieldCheck,
  Plus,
  X,
  Coins,
  Copy,
  Check,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomProjectView: React.FC = () => {
  const { submitCustomRequest, customRequests, quotations } = useApp();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submission form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Android App (Native / APK)');
  
  // Interactive Feature List Builder
  const [featureInput, setFeatureInput] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Secure User Login & Roles',
    'Offline Local Database & Cloud Sync',
    'PDF & Excel Invoices / Reports'
  ]);

  // Budget Selection (PKR 1,000 to 10,000+ and Custom)
  const [selectedBudget, setSelectedBudget] = useState('PKR 1,000 - 3,000');
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState('');
  
  const [timeline, setTimeline] = useState('1 - 2 Weeks');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Tracking tab state
  const [lookupId, setLookupId] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<CustomRequest | null>(null);
  const [associatedQuotation, setAssociatedQuotation] = useState<Quotation | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  // Popular Suggested Feature Chips for 1-Click adding
  const popularFeatureSuggestions = [
    'Barcode / QR Scanner',
    'Thermal Bluetooth Receipt Printer',
    'WhatsApp / SMS Alerts',
    'EasyPaisa / JazzCash Integration',
    'Admin Analytics Dashboard',
    'Multi-User Staff Permissions',
    'Auto Cloud Backup'
  ];

  const platformOptions = [
    { id: 'Android App (Native / APK)', label: 'Android APK / Native', icon: Smartphone, desc: 'Mobile App for Android Phones & Tablets' },
    { id: 'Desktop / PC Software (Windows/Mac)', label: 'Desktop / PC Software', icon: Monitor, desc: 'Point of Sale (POS) & Windows Desktop Software' },
    { id: 'Web Application / SaaS Portal', label: 'Web Application / Portal', icon: Globe, desc: 'Responsive Web Platform & Admin Dashboard' },
    { id: 'Custom Backend API / Automation Bot', label: 'Custom Bot / API Engine', icon: Zap, desc: 'Automation Scripts, Webhooks & Backend APIs' },
  ];

  const budgetOptions = [
    { label: 'PKR 1,000 - 3,000', desc: 'Mini Script / Utility / Small Tool' },
    { label: 'PKR 3,000 - 5,000', desc: 'Standard App / 1-2 Custom Screens' },
    { label: 'PKR 5,000 - 10,000', desc: 'Complete Custom App / POS / Android APK' },
    { label: 'PKR 10,000+', desc: 'Full-Stack / Advanced Enterprise Solution' },
  ];

  const handleAddFeature = (text?: string) => {
    const feat = (text || featureInput).trim();
    if (feat && !featuresList.includes(feat)) {
      setFeaturesList(prev => [...prev, feat]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() && !customerEmail.trim()) {
      setErrorMessage('Please provide your WhatsApp number or email so we can contact you.');
      return;
    }
    if (!projectTitle.trim() || !projectDescription.trim()) {
      setErrorMessage('Please describe your project title and idea.');
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
      const req = await submitCustomRequest({
        customerName: customerName.trim(),
        name: customerName.trim(),
        customerEmail: customerEmail.trim() || `${customerPhone.replace(/[^0-9]/g, '')}@whatsapp.affy.com`,
        email: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        whatsapp: customerPhone.trim(),
        requestType: 'custom_project',
        projectTitle: projectTitle.trim(),
        title: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        completeDescription: projectDescription.trim(),
        platforms: [selectedPlatform],
        platform: selectedPlatform,
        features: featuresList.length > 0 ? featuresList : ['Standard Custom Solution'],
        requiredFeatures: featuresList.length > 0 ? featuresList : ['Standard Custom Solution'],
        budget: finalBudget,
        timeline: timeline || '1 - 2 Weeks',
        additionalInfo: additionalRequirements.trim(),
        additionalRequirements: additionalRequirements.trim()
      });

      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {}

      setSubmittedRequest(req);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit custom project. Please retry.');
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const openWhatsAppDirect = (req: CustomRequest) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Aftab! 👋\n\nI just submitted a custom software inquiry on your studio portal:\n• Reference ID: #${req.id}\n• Project: ${req.projectTitle || req.title}\n• Platform: ${req.platform || req.platforms?.join(', ')}\n• Budget: ${req.budget}\n• Client Name: ${req.customerName}\n\nLooking forward to your quotation and timeline. Thank you!`
    );
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1428] via-[#090d16] to-[#0a1428] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>VIP CUSTOM SOFTWARE STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Build Your Custom Software with Aftab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Turn your business concept into a fast, scalable Android APK, Windows Desktop POS, or Full-Stack Web Application. Budget starts from <strong className="text-emerald-400 font-bold">PKR 1,000</strong>.
          </p>

          {/* Tab Selector */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer card-elevate flex items-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 btn-glow-cyan'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Submit Custom Project</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer card-elevate flex items-center gap-1.5 ${
                activeTab === 'track'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 btn-glow-cyan'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Quotation / Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SUBMIT CUSTOM PROJECT */}
      {activeTab === 'submit' && (
        <>
          {submittedRequest ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="rounded-3xl bg-[#090d16] border border-emerald-500/40 p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-success-pop">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-pulse-glow">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  ✓ CUSTOM PROJECT REGISTERED
                </span>
                <h2 className="text-2xl font-black text-white">
                  Project Inquired Successfully! 🎉
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aftab has received your project specifications. You will receive an official technical roadmap & quotation directly on WhatsApp/Email.
                </p>
              </div>

              {/* Reference Receipt Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
                  <span className="text-slate-400">Reference ID:</span>
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
                    <span>Project Name:</span>
                    <span className="text-white font-bold truncate max-w-[200px]">{submittedRequest.projectTitle || submittedRequest.title}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform:</span>
                    <span className="text-cyan-300">{submittedRequest.platform || selectedPlatform}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Budget Target:</span>
                    <span className="text-emerald-400 font-bold">{submittedRequest.budget}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Features Count:</span>
                    <span className="text-indigo-400 font-bold">{submittedRequest.features?.length || 0} Features Included</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => openWhatsAppDirect(submittedRequest)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 btn-shimmer btn-glow-emerald cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>Direct Chat with Aftab on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setLookupId(submittedRequest.id);
                    setActiveTab('track');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono cursor-pointer active:scale-95"
                >
                  Track in Quotation Portal
                </button>
              </div>
            </div>
          ) : (
            /* SIMPLE, VIP CUSTOM PROJECT FORM */
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* 1. Target Platform Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Select Target Platform *</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {platformOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    const isSelected = selectedPlatform === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPlatform(opt.id)}
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

              {/* 2. Project Title & Concept */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Project Name & Idea *</span>
                </label>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Project / System Name *</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Pharmacy Inventory ERP with Thermal POS, Courier Tracking App"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Describe Your Complete Software Idea in Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Explain what the software should do (in Urdu or English):&#10;- Who are the end users (Admin, Staff, Customers)&#10;- Main workflow & business problems to solve&#10;- Any special requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 3. Interactive Feature List Builder */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-indigo-500/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>3. Customize Required Features ({featuresList.length} Added)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Add or Remove Any Feature</span>
                </div>

                {/* Input box to add custom feature */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Type any custom feature you want (e.g. SQLite Offline Cache, Barcode Printing)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-indigo-400 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer btn-shimmer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {/* Quick 1-Click Suggestion Chips */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Quick Suggestions (Click to Add):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {popularFeatureSuggestions.map((sug) => {
                      const isAlreadyAdded = featuresList.includes(sug);
                      return (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAddFeature(sug)}
                          disabled={isAlreadyAdded}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                            isAlreadyAdded
                              ? 'bg-slate-900/40 text-slate-600 border border-white/5 cursor-not-allowed'
                              : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400'
                          }`}
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Features Tag List */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {featuresList.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs font-mono text-indigo-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer p-0.5"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Budget Selection (Starting 1,000 PKR to 10,000+ & Custom) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span>4. Budget Bracket (Starting PKR 1,000 - 10,000+) *</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">Flexible Pricing</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {budgetOptions.map((b) => {
                    const isSelected = !isCustomBudget && selectedBudget === b.label;
                    return (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => {
                          setIsCustomBudget(false);
                          setSelectedBudget(b.label);
                        }}
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
                    onClick={() => {
                      setIsCustomBudget(true);
                      setSelectedBudget('Custom');
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer card-elevate flex items-center justify-between ${
                      isCustomBudget
                        ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/50 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border-white/5 hover:border-emerald-500/30'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white font-mono">✍️ Enter Custom Budget (Custom Price)</p>
                      <p className="text-[10px] text-slate-400">Specify your exact project budget in PKR</p>
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

              {/* 5. Contact Information */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>5. Your Contact Information *</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-400 font-bold mb-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. tariq@business.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Target Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none"
                    >
                      <option value="1 - 2 Weeks">1 - 2 Weeks (Fast Delivery)</option>
                      <option value="3 - 4 Weeks">3 - 4 Weeks (Standard)</option>
                      <option value="Flexible">Flexible / No Rush</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button with Continuous Glow */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct consultation with Aftab (CodeWithAffy)</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 btn-shimmer btn-glow-emerald cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Registering Project...' : 'Start Custom Project Inquiry'}</span>
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
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-4">
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
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono btn-shimmer btn-glow-cyan cursor-pointer active:scale-95"
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
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 btn-shimmer btn-glow-emerald cursor-pointer"
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
