import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Package,
  DownloadCloud,
  Clock,
  XCircle,
  LayoutDashboard
} from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionPrompt?: string;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  actionPrompt
}) => {
  const {
    userProfile,
    saveCustomerProfile,
    myOrders,
    setActiveView
  } = useApp();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDisplayName(userProfile?.displayName || '');
      setPhone(userProfile?.phone || '');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const approvedCount = myOrders.filter(o => o.status === 'payment_confirmed' || o.status === 'completed').length;
  const pendingCount = myOrders.filter(o => o.status === 'proof_submitted' || o.status === 'under_review' || o.status === 'payment_pending').length;
  const rejectedCount = myOrders.filter(o => o.status === 'payment_rejected').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!displayName.trim()) {
      setErrorMessage('Apna Name enter karein taake aapki profile ban sake.');
      return;
    }

    setIsSaving(true);
    try {
      await saveCustomerProfile(displayName.trim(), phone.trim());
      setSuccessMessage('Aapki Customer Profile save ho chuki hai!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Profile save karne mein masla aaya.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#090d18] to-[#04060c] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/70 text-slate-200 overflow-hidden text-left">
        {/* Background Cyber Ambient Lights */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>INSTANT BROWSER PROFILE</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight font-mono">
            {userProfile?.displayName ? `Welcome, ${userProfile.displayName}` : 'Create Your Profile'}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            {actionPrompt ||
              'Koi password ya lamba login nahi! Sirf apna Name likh kar profile banayein. Aapke tamam orders aur paid APK downloads sirf aapke is browser mein mehfooz rahenge.'}
          </p>
        </div>

        {/* Quick Order Summary if orders exist in this browser */}
        {myOrders.length > 0 && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-cyan-400" />
                Your Browser Orders ({myOrders.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveView('my-dashboard');
                }}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <div className="font-black text-sm">{approvedCount}</div>
                <div className="text-[10px] flex items-center justify-center gap-1">
                  <DownloadCloud className="w-3 h-3" /> Approved
                </div>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <div className="font-black text-sm">{pendingCount}</div>
                <div className="text-[10px] flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </div>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <div className="font-black text-sm">{rejectedCount}</div>
                <div className="text-[10px] flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3" /> Cancelled
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              Your Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name (e.g. Ali Khan)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              WhatsApp / Phone Number (Optional)
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX (Optional for order updates)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 hover:brightness-110 text-black font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>
              {isSaving
                ? 'Saving Profile...'
                : userProfile?.displayName
                ? 'Update My Profile'
                : 'Create Profile With Name'}
            </span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveView('my-dashboard');
            }}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Go to My Orders & APK Downloads Dashboard</span>
          </button>
        </form>

        {/* Browser Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Private to Your Browser</span>
          </span>
          <span>No Password Required</span>
        </div>
      </div>
    </div>
  );
};
