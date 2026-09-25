import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomRequest, SoftwareRequestType } from '../../types';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Code2,
  Layers,
  Smartphone,
  Monitor,
  Globe,
  Database,
  Calendar,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/notifications';

export const RequestSoftwareView: React.FC = () => {
  const { submitCustomRequest, products, setActiveView } = useApp();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    whatsapp: string;
    requestType: 'software_request' | 'feature_request' | 'software_idea' | 'custom_project';
    title: string;
    completeDescription: string;
    requiredFeatures: string;
    platform: string;
    budget: string;
    timeline: string;
    additionalRequirements: string;
  }>({
    name: '',
    email: '',
    whatsapp: '',
    requestType: 'software_request',
    title: '',
    completeDescription: '',
    requiredFeatures: '',
    platform: 'Android App',
    budget: 'Under PKR 30,000',
    timeline: 'Within 2 Weeks',
    additionalRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequest | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.title.trim() || !formData.completeDescription.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Name, Email, Title, and Description).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const featuresArray = formData.requiredFeatures
        ? formData.requiredFeatures.split('\n').map((f) => f.trim()).filter(Boolean)
        : [];

      const newReq = await submitCustomRequest({
        customerName: formData.name.trim(),
        name: formData.name.trim(),
        customerEmail: formData.email.trim(),
        email: formData.email.trim(),
        customerPhone: formData.whatsapp.trim(),
        whatsapp: formData.whatsapp.trim(),
        requestType: formData.requestType,
        projectTitle: formData.title.trim(),
        title: formData.title.trim(),
        projectDescription: formData.completeDescription.trim(),
        completeDescription: formData.completeDescription.trim(),
        platforms: [formData.platform],
        platform: formData.platform,
        features: featuresArray,
        requiredFeatures: featuresArray,
        budget: formData.budget,
        timeline: formData.timeline,
        additionalInfo: formData.additionalRequirements.trim(),
        additionalRequirements: formData.additionalRequirements.trim()
      });

      setSubmittedRequest(newReq);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#090d16] to-[#0b1329] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customer Request & Innovation Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Request Software or Feature
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Need a custom software application, an Android APK, a new feature added to an existing product, or have a commercial idea you want Aftab to engineer? Submit your detailed requirements below.
          </p>
        </div>
      </div>

      {submittedRequest ? (
        /* Submission Success Screen */
        <div className="rounded-3xl bg-[#090d16] border border-emerald-500/40 p-8 sm:p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white font-mono">
              Request Logged Successfully!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Your software request has been registered in our official development pipeline. Aftab will review your specifications, prepare a technical roadmap or quotation, and follow up directly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 max-w-md mx-auto space-y-2 text-left font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Your Official Reference ID:</span>
              <button
                onClick={() => handleCopyId(submittedRequest.id)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-lg font-bold text-cyan-300 tracking-wider">
              {submittedRequest.id}
            </div>
            <div className="text-[11px] text-slate-500">
              Title: {submittedRequest.projectTitle || submittedRequest.title}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi Aftab, I have submitted a software request on AFFY OFFICIAL.\nReference ID: ${submittedRequest.id}\nTitle: ${submittedRequest.projectTitle || submittedRequest.title}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>Direct WhatsApp Follow-up</span>
            </a>

            <button
              onClick={() => {
                setSubmittedRequest(null);
                setFormData({
                  name: '',
                  email: '',
                  whatsapp: '',
                  requestType: 'software_request',
                  title: '',
                  completeDescription: '',
                  requiredFeatures: '',
                  platform: 'Android App',
                  budget: 'Under PKR 30,000',
                  timeline: 'Within 2 Weeks',
                  additionalRequirements: ''
                });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono border border-white/10 cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="rounded-3xl bg-[#090d16] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl text-left">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2 pb-2 border-b border-white/5">
              <span>1. Contact & Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Muhammad Rizwan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="03XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Request Scope & Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2 pb-2 border-b border-white/5">
              <span>2. Request Type & Target Platform</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">What are you requesting? *</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="software_request">📱 Specific App / Software Build</option>
                  <option value="feature_request">⚡ New Feature for Existing AFFY Product</option>
                  <option value="software_idea">💡 Commercial Software Idea / Innovation</option>
                  <option value="custom_project">🏢 Full Enterprise Custom System</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Target Platform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Android App">Android App (APK / Bundle)</option>
                  <option value="Desktop Software">Desktop Software (Windows / macOS / Electron)</option>
                  <option value="Web Platform">Web Platform / SaaS Dashboard</option>
                  <option value="Full Stack System">Full Stack System (Web + Mobile + API)</option>
                  <option value="API & Backend">API Backend / Automation Bot</option>
                  <option value="Other">Cross-Platform / Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Request Title / Summary *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Offline Pharmacy Billing POS with Thermal Bluetooth Printing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Section 3: Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2 pb-2 border-b border-white/5">
              <span>3. Requirements & Technical Specifications</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Complete Description & Purpose *</label>
              <textarea
                value={formData.completeDescription}
                onChange={(e) => setFormData({ ...formData, completeDescription: e.target.value })}
                rows={4}
                placeholder="Explain what the software should do, the target end-users, primary business workflow, and any existing problems you want solved..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Key Required Features (One per line)</label>
              <textarea
                value={formData.requiredFeatures}
                onChange={(e) => setFormData({ ...formData, requiredFeatures: e.target.value })}
                rows={3}
                placeholder="Barcode Scanner integration&#10;PDF & Excel Report Exporter&#10;Role-based User Access&#10;EasyPaisa / JazzCash payment hooks"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Estimated Budget (Optional)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Under PKR 20,000">Under PKR 20,000</option>
                  <option value="PKR 20,000 - 50,000">PKR 20,000 - 50,000</option>
                  <option value="PKR 50,000 - 100,000">PKR 50,000 - 100,000</option>
                  <option value="PKR 100,000 - 250,000">PKR 100,000 - 250,000</option>
                  <option value="PKR 250,000+">PKR 250,000+ (Enterprise)</option>
                  <option value="Flexible / Negotiable">Flexible / Open to Quote</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Preferred Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Urgent (1-3 Days)">Urgent (1-3 Days)</option>
                  <option value="1 Week">Within 1 Week</option>
                  <option value="2-3 Weeks">2 - 3 Weeks</option>
                  <option value="1 Month">1 Month</option>
                  <option value="Flexible">Flexible / No Rush</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Additional Notes / Integrations (Optional)</label>
              <input
                type="text"
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="e.g. Needs Firebase Authentication and cloud backup"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-mono">
              🔒 Confidential review by Aftab Ahmed. No spam.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4 text-black" />
              <span>{isSubmitting ? 'Logging Request...' : 'Submit Software Request'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
