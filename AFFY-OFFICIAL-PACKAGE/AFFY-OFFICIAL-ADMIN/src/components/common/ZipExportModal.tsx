import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DownloadCloud, X, FolderArchive, Shield, Globe, Check, Terminal, Package } from 'lucide-react';

interface ZipExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipExportModal: React.FC<ZipExportModalProps> = ({ isOpen, onClose }) => {
  const { exportProjectZip, settings } = useApp();
  const [downloading, setDownloading] = useState<'package' | 'user' | 'admin' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<'package' | 'user' | 'admin' | null>(null);

  if (!isOpen) return null;

  const handleExport = async (target: 'package' | 'user' | 'admin') => {
    setDownloading(target);
    try {
      await exportProjectZip(target);
      setDownloadSuccess(target);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 text-slate-200 overflow-hidden text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Package className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono tracking-tight">
              Production Project Packaging & ZIP Split
            </h2>
            <p className="text-xs text-slate-400">
              Download decoupled standalone projects for {settings.brandName} sharing the same Firebase database.
            </p>
          </div>
        </div>

        {/* Master Package Download (Highlighted) */}
        <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              RECOMMENDED MASTER PACKAGE
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">AFFY-OFFICIAL-PACKAGE.zip</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base font-mono">Full Decoupled Architecture Package</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Contains the root <code className="text-cyan-300 font-mono">AFFY-OFFICIAL-PACKAGE/</code> with both <code className="text-emerald-300 font-mono">AFFY-OFFICIAL-USER/</code> (public portal, zero admin UI) and <code className="text-indigo-300 font-mono">AFFY-OFFICIAL-ADMIN/</code> (private admin CMS & Express server).
            </p>
          </div>
          <button
            onClick={() => handleExport('package')}
            disabled={downloading === 'package'}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {downloading === 'package' ? (
              <span>Generating Master Package...</span>
            ) : downloadSuccess === 'package' ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Downloaded AFFY-OFFICIAL-PACKAGE.zip!</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4 text-black" />
                <span>Download Master Package (AFFY-OFFICIAL-PACKAGE.zip)</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* ZIP 1: USER PANEL */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  PROJECT 1 • PUBLIC
                </span>
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-xs font-mono">AFFY-OFFICIAL-USER</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Public website only. Zero admin elements, login, or secret credentials.
              </p>
            </div>

            <button
              onClick={() => handleExport('user')}
              disabled={downloading === 'user'}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {downloading === 'user' ? (
                <span>Generating...</span>
              ) : downloadSuccess === 'user' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Download User ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* ZIP 2: ADMIN PANEL */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  PROJECT 2 • CONTROL CMS
                </span>
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-xs font-mono">AFFY-OFFICIAL-ADMIN</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Private CMS with server-side single-admin auth, payment audit, & orders.
              </p>
            </div>

            <button
              onClick={() => handleExport('admin')}
              disabled={downloading === 'admin'}
              className="w-full py-2 px-3 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {downloading === 'admin' ? (
                <span>Generating...</span>
              ) : downloadSuccess === 'admin' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Download Admin ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Technical Architecture Notes */}
        <div className="p-3.5 rounded-xl bg-[#06080e] border border-white/5 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-semibold">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shared Firebase Backend (<code className="text-cyan-400">affy-official</code>)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Both standalone projects communicate in real-time with the same Firebase Firestore and Storage backend without duplicating collections or credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

