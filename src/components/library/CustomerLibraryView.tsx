import React, { useState } from 'react';
import { useApp, CustomerLibraryItem } from '../../context/AppContext';
import {
  FolderArchive,
  DownloadCloud,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  Code2,
  CheckCircle2,
  FileCode,
  Clock,
  ArrowRight,
  Info,
  Package,
  RotateCw,
  Award
} from 'lucide-react';

interface CustomerLibraryViewProps {
  onOpenCertificate: (orderId: string) => void;
  onOpenInvoice: (orderId: string) => void;
}

export const CustomerLibraryView: React.FC<CustomerLibraryViewProps> = ({
  onOpenCertificate,
  onOpenInvoice
}) => {
  const { getCustomerLibrary, setActiveView } = useApp();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { confirmedOrders, items } = getCustomerLibrary(submittedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleDownload = (item: CustomerLibraryItem) => {
    if (!item.downloadUrl) return;
    setDownloadingId(item.id);
    try {
      const a = document.createElement('a');
      a.href = item.downloadUrl;
      a.download = item.downloadName || 'package.zip';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
          <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
          <span>📚 DIGITAL VAULT & PRODUCT UPDATES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          My Purchases & Software Library
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Access your verified software packages, commercial source licenses, and latest version updates. All updates to your purchased software are included free of charge.
        </p>
      </div>

      {/* Query Search Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Unlock Your Library Access</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your customer email address, phone number, or exact Order ID (e.g. AFFY-ORD-123456).
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. client@example.com or AFFY-ORD-123456"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Access My Library
          </button>
        </form>

        {/* Results */}
        {submittedQuery && (
          <div className="pt-6 border-t border-white/10 space-y-8 animate-in fade-in">
            {items.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
                <Package className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-base text-white font-mono">No confirmed purchases found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We could not find any active verified licenses matching "{submittedQuery}". If your payment is currently under review, check your status in Track Order.
                </p>
                <button
                  onClick={() => {
                    setActiveView('track-order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-cyan-400 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
                >
                  <span>Go to Track Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base font-mono">
                      Purchased Assets & Licenses ({items.length})
                    </h3>
                    <p className="text-xs text-slate-400">
                      Showing authorized software downloads and available version releases.
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified License Access</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.orderId}-${item.id}-${idx}`}
                      className="p-6 rounded-3xl bg-slate-950 border border-white/10 hover:border-cyan-500/40 transition-all space-y-5 flex flex-col justify-between shadow-xl"
                    >
                      <div className="space-y-4">
                        {/* Status bar */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-mono text-xs text-cyan-300 font-bold">
                            Order: {item.orderId}
                          </span>

                          {item.isUpdateAvailable ? (
                            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md flex items-center gap-1">
                              <RotateCw className="w-3 h-3 text-black animate-spin" />
                              Update Available ({item.latestVersion})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Latest Version
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-lg">{item.name}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-slate-400">
                            <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize">{item.purchaseType.replace(/_/g, ' ')}</span>
                          </div>
                        </div>

                        {/* Version info comparison */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 text-xs font-mono">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Licensed Version:</span>
                            <strong className="text-white">{item.purchasedVersion}</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Current Catalog Version:</span>
                            <strong className="text-cyan-400">{item.latestVersion}</strong>
                          </div>
                          {item.releaseNotes && (
                            <div className="pt-2 border-t border-white/5">
                              <p className="text-[11px] text-slate-400 font-sans">
                                <strong>Release Notes:</strong> {item.releaseNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-2">
                        {item.downloadUrl ? (
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={downloadingId === item.id}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                          >
                            <DownloadCloud className="w-4 h-4 text-black" />
                            <span>
                              {downloadingId === item.id
                                ? 'Downloading Binary...'
                                : item.isUpdateAvailable
                                ? `Download Latest Update (${item.latestVersion})`
                                : `Download Secure Files (${item.latestVersion})`}
                            </span>
                          </button>
                        ) : (
                          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-center text-xs font-mono text-amber-300">
                            Download file being prepared by engineer. Contact Aftab for instant file dispatch.
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            onClick={() => onOpenCertificate(item.orderId)}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>License Certificate</span>
                          </button>

                          <button
                            onClick={() => onOpenInvoice(item.orderId)}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Order Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
