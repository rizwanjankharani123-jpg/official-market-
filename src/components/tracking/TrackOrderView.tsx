import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  DownloadCloud,
  FileText,
  Award,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Package,
  Calendar,
  CreditCard,
  Hash,
  ExternalLink,
  Lock,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface TrackOrderViewProps {
  initialOrderId?: string;
  initialEmail?: string;
  onOpenInvoice: (orderId: string) => void;
  onOpenCertificate: (orderId: string) => void;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  initialOrderId = '',
  initialEmail = '',
  onOpenInvoice,
  onOpenCertificate
}) => {
  const { orders, settings } = useApp();
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId);
  const [searchEmail, setSearchEmail] = useState(initialEmail);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Auto-find if initialOrderId provided
  useEffect(() => {
    if (initialOrderId) {
      const match = orders.find(
        o => o.id.toLowerCase() === initialOrderId.trim().toLowerCase()
      );
      if (match) {
        setSelectedOrder(match);
        setHasSearched(true);
      }
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);

    const query = searchOrderId.trim().toUpperCase();
    const emailQuery = searchEmail.trim().toLowerCase();

    const match = orders.find((o) => {
      const matchesId = o.id.toUpperCase() === query;
      if (!matchesId) return false;
      // If email provided, verify it
      if (emailQuery) {
        return o.customerEmail.toLowerCase() === emailQuery;
      }
      return true;
    });

    if (match) {
      setSelectedOrder(match);
      setSearchError('');
    } else {
      setSelectedOrder(null);
      setSearchError('No order found matching this Order ID. Please check your spelling or verify with your email.');
    }
  };

  // Timeline stage index helper
  const getTimelineStage = (status: OrderStatus): number => {
    switch (status) {
      case 'payment_pending':
        return 1;
      case 'proof_submitted':
        return 2;
      case 'under_review':
        return 3;
      case 'payment_confirmed':
        return 4;
      case 'processing':
      case 'completed':
        return 5;
      case 'payment_rejected':
        return -1;
      default:
        return 1;
    }
  };

  const timelineSteps = [
    { step: 1, label: 'Order Created', desc: 'Reference generated' },
    { step: 2, label: 'Proof Submitted', desc: 'TRX ID attached' },
    { step: 3, label: 'Under Review', desc: 'Audited by Aftab' },
    { step: 4, label: 'Payment Confirmed', desc: 'Access authorized' },
    { step: 5, label: 'Download Ready', desc: 'Package unlocked' },
  ];

  const currentStage = selectedOrder ? getTimelineStage(selectedOrder.status) : 0;
  const isRejected = selectedOrder?.status === 'payment_rejected';
  const isUnlocked = selectedOrder?.downloadAccessGranted || selectedOrder?.status === 'payment_confirmed' || selectedOrder?.status === 'completed';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left">
      {/* Page Header */}
      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ORDER TRACKING & SECURE VAULT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Track Your Order & Access Downloads
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Enter your unique Order Reference (e.g. <code className="text-cyan-400 font-mono">AFFY-ORD-XXXXXX</code>) to view live verification status, download your software, and generate official invoices & certificates.
        </p>
      </div>

      {/* Search Lookup Box */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-xl shadow-cyan-950/20 mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Order ID / Reference Number *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="e.g. AFFY-ORD-892415"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Account Email (Optional)
            </label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="e.g. client@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Search className="w-4 h-4 text-black" />
              <span>Lookup</span>
            </button>
          </div>
        </form>

        {searchError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Selected Order Results Display */}
      {selectedOrder && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Order Header Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
                    {selectedOrder.id}
                  </h2>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()} • Customer: <strong className="text-slate-200">{selectedOrder.customerName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenInvoice(selectedOrder.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Invoice</span>
                </button>

                {isUnlocked && (
                  <button
                    onClick={() => onOpenCertificate(selectedOrder.id)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Official Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rejection Alert if rejected */}
            {isRejected && (
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>Payment Verification Rejected</span>
                </div>
                <p className="text-xs text-slate-300">
                  Reason: <strong>{selectedOrder.rejectionReason || 'Invalid Transaction ID or unreadable screenshot proof.'}</strong>
                </p>
                <p className="text-xs text-slate-400">
                  Please contact Aftab on WhatsApp ({settings.phone}) or Telegram (@{settings.telegram}) with your correct payment voucher to re-audit.
                </p>
              </div>
            )}

            {/* Visual Timeline Stepper */}
            {!isRejected && (
              <div className="py-2">
                <p className="text-xs font-mono uppercase text-slate-400 mb-4 font-semibold">Verification Pipeline:</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {timelineSteps.map((s) => {
                    const isDone = currentStage >= s.step;
                    const isCurrent = currentStage === s.step;

                    return (
                      <div
                        key={s.step}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 animate-pulse'
                            : 'bg-slate-900/40 border-white/5 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold">STEP 0{s.step}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 opacity-40" />
                          )}
                        </div>
                        <p className="font-bold text-xs text-white">{s.label}</p>
                        <p className="text-[10px] text-slate-400">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product & Payment Meta Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <p className="text-slate-500 font-mono text-[10px] uppercase">Purchased Product</p>
                <p className="font-bold text-white text-sm">{selectedOrder.productName}</p>
                <p className="text-cyan-400 font-mono capitalize">
                  Tier: {selectedOrder.purchaseType === 'source_code' ? 'Full Source Code License' : 'Software / APK Package'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <p className="text-slate-500 font-mono text-[10px] uppercase">Payment Transaction</p>
                <p className="font-mono font-bold text-white">TRX: {selectedOrder.transactionId}</p>
                <p className="text-slate-400">Method: {selectedOrder.paymentMethodName} (PKR {selectedOrder.amount?.toLocaleString()})</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <p className="text-slate-500 font-mono text-[10px] uppercase">Delivery Target</p>
                <p className="font-bold text-white truncate">{selectedOrder.customerEmail}</p>
                <p className="text-slate-400">{selectedOrder.customerPhone || 'Direct Portal Access'}</p>
              </div>
            </div>

            {/* Protected Download Access Box */}
            <div className="p-6 rounded-2xl bg-[#06080e] border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base font-mono">Protected Package Vault</h3>
                </div>
                {isUnlocked ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    VAULT UNLOCKED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono">
                    AWAITING ADMIN APPROVAL
                  </span>
                )}
              </div>

              {isUnlocked ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Your payment has been officially verified by Aftab. You can now download your clean binary/source package:
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white font-mono text-sm">{selectedOrder.downloadName || `${selectedOrder.productName}.zip`}</p>
                      <p className="text-[11px] text-emerald-400 font-mono">Status: Authenticated & Ready for Download</p>
                    </div>

                    <a
                      href={selectedOrder.downloadUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                    >
                      <DownloadCloud className="w-4 h-4 text-black" />
                      <span>Download Package</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => onOpenCertificate(selectedOrder.id)}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Award className="w-4 h-4 text-indigo-400" />
                      <span>Download Official Signed Certificate</span>
                    </button>

                    <button
                      onClick={() => onOpenInvoice(selectedOrder.id)}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Print Official Confirmed Invoice</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold">
                    <Lock className="w-4 h-4" />
                    <span>Download Sealed Pending Audit</span>
                  </div>
                  <p className="leading-relaxed">
                    Aftab manually reviews payment transactions to ensure secure delivery and legitimate licensing. Once verified (usually within 15-60 minutes), this screen will automatically refresh with your download link and official certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
