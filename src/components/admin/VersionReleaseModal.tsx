import React, { useState } from 'react';
import { Product } from '../../types';
import {
  X,
  RotateCw,
  Sparkles,
  DownloadCloud,
  FileCode,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface VersionReleaseModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishVersion: (
    productId: string,
    version: string,
    releaseNotes: string,
    apkUrl?: string,
    sourceZipUrl?: string
  ) => Promise<void>;
}

export const VersionReleaseModal: React.FC<VersionReleaseModalProps> = ({
  product,
  isOpen,
  onClose,
  onPublishVersion
}) => {
  if (!isOpen || !product) return null;

  const [version, setVersion] = useState(product.version || 'v1.1.0');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [apkUrl, setApkUrl] = useState(product.apkUrl || '');
  const [sourceZipUrl, setSourceZipUrl] = useState(product.sourceZipUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) {
      setErrorMessage('Version string is required.');
      return;
    }
    if (!releaseNotes.trim()) {
      setErrorMessage('Release notes are required so buyers know what changed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onPublishVersion(product.id, version.trim(), releaseNotes.trim(), apkUrl.trim(), sourceZipUrl.trim());
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to publish new version update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-mono">
                Publish Product Update
              </h2>
              <p className="text-xs text-slate-400">
                Deploy a new version of <strong>{product.name}</strong> to existing customers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              New Version Release Number * (Current: {product.version})
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. v1.1.0 or v2.0.0"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Release Notes & Changelog *
            </label>
            <textarea
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Fixed offline SQLite sync issue, added biometric login, upgraded Gradle dependencies."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Updated APK / Binary Download URL
            </label>
            <input
              type="url"
              value={apkUrl}
              onChange={(e) => setApkUrl(e.target.value)}
              placeholder="https://example.com/download/app_v1.1.apk"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {product.sourceAvailable && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                Updated Source Code ZIP URL
              </label>
              <input
                type="url"
                value={sourceZipUrl}
                onChange={(e) => setSourceZipUrl(e.target.value)}
                placeholder="https://example.com/download/source_v1.1.zip"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-400 focus:outline-none"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
            Existing verified purchasers will automatically see "Update Available" with your release notes in their Digital Library.
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Deploy Version Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
