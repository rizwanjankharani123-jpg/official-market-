import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, Mail, Key, X, Eye, EyeOff, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccess,
  onCancel,
  isModal = false
}) => {
  const { adminLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Invalid admin credentials');
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        setEmail('');
        setPassword('');
        setError('');
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Invalid admin credentials');
      }
    } catch {
      setError('Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative w-full max-w-md bg-[#090d16] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 text-left text-slate-200 ${isModal ? 'my-auto max-h-[92vh] overflow-y-auto' : 'mx-auto'}`}>
      {/* Close Button if Modal */}
      {isModal && onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-cyan-500/30">
            Administrative Gateway
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">Admin Login</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Authorized administrative access only. Sign in with master administrator credentials.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-mono">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-semibold text-rose-300">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Admin Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder=""
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-mono text-slate-300">Admin Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] text-slate-400 hover:text-cyan-400 font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Password</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show Password</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="off"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder=""
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer font-mono"
        >
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Admin Panel'}</span>
        </button>

        {!isModal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Main Website</span>
          </button>
        )}
      </form>
    </div>
  );
};

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <AdminLoginForm
        isModal={true}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
        onCancel={onClose}
      />
    </div>
  );
};


