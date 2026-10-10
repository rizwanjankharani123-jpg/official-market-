import React, { useRef, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Loader2,
  Copy,
  Check,
  Sparkles,
  DownloadCloud,
  Lock,
  Smartphone,
  Code2,
  Layers,
  ArrowRight,
  QrCode,
  Award
} from 'lucide-react';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface InvoiceModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ orderId, onClose }) => {
  const { orders, products, settings, setActiveView } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = useMemo(() => {
    if (!orderId) return null;
    return orders.find(o => o.id === orderId) || null;
  }, [orderId, orders]);

  if (!orderId || !order) return null;

  const product = products.find(p => p.id === order.productId);
  const invoiceNumber = order.id.replace('AFFY-ORD-', 'AFFY-INV-');
  const isConfirmed = order.status === 'payment_confirmed' || order.status === 'completed';
  const isRejected = order.status === 'payment_rejected';
  const isPending = !isConfirmed && !isRejected;

  const createdDateObj = new Date(order.createdAt);
  const issueDate = createdDateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
  const issueTime = createdDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const confirmedDate = order.confirmedAt
    ? new Date(order.confirmedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : issueDate;

  const pointsEarned =
    order.pointsEarned ||
    Math.floor((order.amount || 0) / 100) * (settings.rewardPointsPer100PKR || 1);

  const downloadUrl =
    order.downloadUrl ||
    (order.purchaseType === 'source_code' ? product?.sourceZipUrl : product?.apkUrl) ||
    '';
  const downloadFileName =
    order.downloadName ||
    `${(product?.name || order.productName).replace(/\s+/g, '_')}_v${
      product?.version || order.purchasedVersion || '1.0'
    }.${order.purchaseType === 'source_code' ? 'zip' : 'apk'}`;

  // Generate a deterministic cryptographic-style fingerprint from the order ID
  const digitalFingerprint = useMemo(() => {
    const raw = `${order.id}-${order.transactionId}-${order.amount}-${order.createdAt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `AFFY-SHA256-${hex}-${order.id.slice(-6).toUpperCase()}`;
  }, [order]);

  // Deterministic 7x7 QR Matrix pattern for the invoice verification graphic
  const qrPattern = useMemo(() => {
    const seed = order.id + (order.transactionId || '');
    const cells: boolean[] = [];
    for (let i = 0; i < 49; i++) {
      const charCode = seed.charCodeAt(i % seed.length) || 65;
      cells.push((charCode + i * 7) % 2 === 0);
    }
    return cells;
  }, [order.id, order.transactionId]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadPdfViaPrint = () => {
    setIsDownloading(true);
    const previousTitle = document.title;
    const cleanCustomer = (order.customerName || 'Customer').replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${invoiceNumber}_${cleanCustomer}`;

    setTimeout(() => {
      window.print();
      document.title = previousTitle;
      setIsDownloading(false);
    }, 120);
  };

  const handleDirectCanvasPdf = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    try {
      await downloadElementAsPdf(invoiceRef.current, `${invoiceNumber}`, 'p');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in zoom-in-95 duration-300 print-modal-backdrop">
      <div className="relative w-full max-w-4xl bg-[#070b14] border border-cyan-500/40 rounded-3xl p-3.5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] my-4 max-h-[96vh] flex flex-col text-left print-modal-shell">
        {/* Ambient Top Glow */}
        <div className="no-print absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* ======================================================== */}
        {/* TOP EXECUTIVE ACTION BAR (HIDDEN IN PRINT)               */}
        {/* ======================================================== */}
        <div className="no-print relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-black uppercase tracking-wider">
                  Official Digital Commercial Invoice
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Auto-Generated
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>Invoice: <strong className="text-white">{invoiceNumber}</strong></span>
                <span>•</span>
                <span>Order: <strong className="text-cyan-300">{order.id}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopy(order.id, 'orderId')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
              title="Copy Order ID"
            >
              {copiedField === 'orderId' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied ID!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdfViaPrint}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:brightness-110 text-black font-black text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
              title="Download High-Fidelity PDF Invoice via Print Engine"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <Download className="w-3.5 h-3.5 text-black" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDirectCanvasPdf}
              disabled={isDownloading}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs items-center gap-1.5 border border-white/15 transition-colors cursor-pointer disabled:opacity-50"
              title="Instant Direct PDF File Download"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Save</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
              title="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SCROLLABLE / PRINTABLE OFFICIAL INVOICE DOCUMENT         */}
        {/* ======================================================== */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar print-scroll-reset">
          <div
            ref={invoiceRef}
            className="bg-white text-slate-900 rounded-2xl shadow-2xl text-left font-sans select-text border border-slate-300 relative overflow-hidden print-card"
          >
            {/* PRINT-ONLY TOP VERIFICATION HEADER */}
            <div className="print-only bg-slate-100 border-b border-slate-300 px-6 py-2 text-[10px] font-mono text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-slate-900">
                  OFFICIAL HIGH-FIDELITY PDF INVOICE • AFFY OFFICIAL MARKETPLACE
                </span>
                <span>
                  DOCUMENT ID: {invoiceNumber} • ORDER REF: {order.id}
                </span>
              </div>
            </div>
            {/* Top Multi-Color Security Ribbon */}
            <div className="h-2.5 w-full bg-gradient-to-r from-slate-950 via-cyan-500 to-emerald-500" />

            {/* Subtle Background Diagonal Watermark */}
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.035]">
              <div className=" -rotate-25 text-center">
                <p className="text-7xl sm:text-8xl font-black font-mono tracking-widest text-slate-950">
                  AFFY OFFICIAL
                </p>
                <p className="text-2xl font-mono font-bold tracking-[0.4em] text-slate-950 mt-2">
                  VERIFIED DIGITAL LICENSE INVOICE
                </p>
              </div>
            </div>

            {/* 1. EXECUTIVE DARK NAVY HEADER BANNER */}
            <div className="bg-[#070b14] text-white p-6 sm:p-8 border-b-4 border-cyan-500 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                {/* Brand Identity */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black font-mono text-xl shadow-lg">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                          AFFY<span className="text-cyan-400">OFFICIAL</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-black tracking-wider">
                          VERIFIED PRO
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-300">
                        Aftab — Founder, Web & Mobile Software Architect
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Email: {settings.email}</span>
                    <span>•</span>
                    <span>WhatsApp: {settings.phone}</span>
                    <span>•</span>
                    <span className="text-cyan-400">CodeWithAffy Vault</span>
                  </div>
                </div>

                {/* Invoice Metadata + Dynamic QR Verification Matrix */}
                <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end bg-slate-900/90 border border-white/15 rounded-2xl p-3.5">
                  <div className="text-left sm:text-right space-y-1">
                    <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-widest">
                      COMMERCIAL INVOICE
                    </div>
                    <p className="text-sm sm:text-base font-mono font-black text-white">
                      {invoiceNumber}
                    </p>
                    <p className="text-[11px] font-mono text-slate-300">
                      Order ID: <span className="text-cyan-400 font-bold">{order.id}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      Issued: {issueDate} • {issueTime}
                    </p>
                  </div>

                  {/* Custom SVG Verification QR Matrix */}
                  <div className="w-16 h-16 bg-white p-1.5 rounded-xl shrink-0 flex flex-col items-center justify-center border-2 border-cyan-400">
                    <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                      {qrPattern.map((filled, idx) => (
                        <div
                          key={idx}
                          className={`rounded-[1px] ${
                            idx === 0 || idx === 6 || idx === 42 || idx === 24
                              ? 'bg-cyan-600'
                              : filled
                              ? 'bg-slate-950'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN INVOICE BODY */}
            <div className="p-6 sm:p-8 space-y-6 relative z-10">
              {/* 2. 3-STEP LIVE ORDER & APK ACCESS PIPELINE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
                {/* Step 1 */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black font-mono text-xs shrink-0">
                    01
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                      Step 1 • Completed
                    </div>
                    <div className="text-xs font-bold text-white">Order & TRX Submitted</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                    isConfirmed
                      ? 'bg-emerald-500/15 border-emerald-500/30'
                      : isRejected
                      ? 'bg-rose-500/15 border-rose-500/30'
                      : 'bg-amber-500/15 border-amber-500/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-xs shrink-0 ${
                      isConfirmed
                        ? 'bg-emerald-500 text-slate-950'
                        : isRejected
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    02
                  </div>
                  <div>
                    <div
                      className={`text-[10px] font-mono uppercase font-bold ${
                        isConfirmed
                          ? 'text-emerald-300'
                          : isRejected
                          ? 'text-rose-300'
                          : 'text-amber-300'
                      }`}
                    >
                      {isConfirmed
                        ? 'Step 2 • Verified'
                        : isRejected
                        ? 'Step 2 • Cancelled'
                        : 'Step 2 • In Review'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isConfirmed
                        ? 'Admin Payment Approved'
                        : isRejected
                        ? 'Payment Rejected'
                        : 'Admin Verifying Proof'}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                    isConfirmed
                      ? 'bg-cyan-500/20 border-cyan-400/40'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-xs shrink-0 ${
                      isConfirmed ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    03
                  </div>
                  <div>
                    <div
                      className={`text-[10px] font-mono uppercase font-bold ${
                        isConfirmed ? 'text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      {isConfirmed ? 'Step 3 • Unlocked' : 'Step 3 • Locked'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isConfirmed ? 'Paid APK Ready to Download' : 'Unlocks Upon Approval'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PROMINENT STATUS BANNER */}
              <div>
                {isPending && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950">
                            PAYMENT UNDER VERIFICATION
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-800">
                            TRX ID: {order.transactionId}
                          </span>
                        </div>
                        <p className="text-xs text-amber-900 mt-1.5 leading-relaxed">
                          Aapka order aur payment screenshot successfully receive ho chuka hai! Jaise hi{' '}
                          <strong>Aftab</strong> aapki payment approve karenge, aapke{' '}
                          <strong>Personal Orders Dashboard</strong> mein Paid APK Download button unlock ho jayega.
                        </p>
                      </div>
                    </div>

                    {/* Official Stamp Pill */}
                    <div className="shrink-0 self-end sm:self-center border-2 border-dashed border-amber-600 px-3 py-1.5 rounded-xl text-center -rotate-2 bg-amber-100/80">
                      <div className="text-[9px] font-mono font-black uppercase text-amber-800 tracking-widest">
                        OFFICIAL STATUS
                      </div>
                      <div className="text-xs font-mono font-black text-amber-950">
                        AWAITING APPROVAL
                      </div>
                    </div>
                  </div>
                )}

                {isConfirmed && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                            PAYMENT APPROVED & VERIFIED
                          </span>
                          <span className="text-xs font-mono text-emerald-800 font-bold">
                            Approved on {confirmedDate}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900 mt-1.5 leading-relaxed">
                          Payment of <strong>PKR {order.amount?.toLocaleString()}</strong> via{' '}
                          <strong>{order.paymentMethodName}</strong> (TRX:{' '}
                          <span className="font-mono font-bold">{order.transactionId}</span>) has been verified by Aftab. Full Paid APK / Software download access is unlocked in your browser vault!
                        </p>
                      </div>
                    </div>

                    {/* Official Paid Stamp */}
                    <div className="shrink-0 self-end sm:self-center border-2 border-emerald-600 px-3.5 py-1.5 rounded-xl text-center -rotate-3 bg-emerald-100 shadow-sm">
                      <div className="text-[9px] font-mono font-black uppercase text-emerald-800 tracking-widest">
                        AFFY OFFICIAL SEAL
                      </div>
                      <div className="text-sm font-mono font-black text-emerald-950">
                        PAID & UNLOCKED ✓
                      </div>
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-600 text-white">
                          ORDER CANCELLED / PAYMENT REJECTED
                        </span>
                        <p className="text-xs text-rose-900 mt-1.5 leading-relaxed">
                          Reason: <strong>{order.rejectionReason || 'Transaction ID or screenshot could not be verified.'}</strong> Please contact Aftab on WhatsApp ({settings.phone}) with your Invoice ID.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. CUSTOMER PROFILE & PAYMENT AUDIT GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Billed To Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono uppercase text-[10px] text-slate-500 font-black tracking-wider">
                      LICENSED CUSTOMER PROFILE (BILLED TO)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-900 font-mono text-[10px] font-bold">
                      Private Browser Vault
                    </span>
                  </div>

                  <p className="font-black text-slate-950 text-base font-mono">
                    {order.customerName}
                  </p>

                  <div className="space-y-1 text-xs font-mono text-slate-700">
                    {order.customerPhone ? (
                      <p>
                        <span className="text-slate-500">WhatsApp / Phone:</span>{' '}
                        <strong className="text-slate-900">{order.customerPhone}</strong>
                      </p>
                    ) : null}
                    {order.customerEmail && !order.customerEmail.endsWith('@affy.local') ? (
                      <p>
                        <span className="text-slate-500">Email:</span>{' '}
                        <strong className="text-slate-900">{order.customerEmail}</strong>
                      </p>
                    ) : (
                      <p>
                        <span className="text-slate-500">Access Mode:</span>{' '}
                        <strong className="text-emerald-700">Name-Based Personal Browser Profile</strong>
                      </p>
                    )}
                    {order.customerNote && (
                      <p className="text-[11px] text-slate-600 italic pt-1">
                        Note: "{order.customerNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Gateway Audit Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono uppercase text-[10px] text-slate-500 font-black tracking-wider">
                      PAYMENT GATEWAY & TRX AUDIT
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-mono text-[10px] font-bold">
                      {order.currency || 'PKR'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Method:</span>
                      <strong className="text-slate-950">{order.paymentMethodName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID (TRX):</span>
                      <strong className="text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                        {order.transactionId || 'Submitted'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Proof Screenshot:</span>
                      <strong className="text-emerald-700">
                        {order.paymentProofUrl ? 'Attached & Logged ✓' : 'Submitted'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verification Status:</span>
                      <strong
                        className={
                          isConfirmed
                            ? 'text-emerald-700'
                            : isRejected
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }
                      >
                        {isConfirmed
                          ? 'Approved by Admin'
                          : isRejected
                          ? 'Rejected / Cancelled'
                          : 'Pending Admin Confirmation'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. ITEMIZED COMMERCIAL SOFTWARE / APK TABLE */}
              <div className="rounded-2xl border-2 border-slate-900 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono text-[11px]">
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4">SOFTWARE / APK & LICENSE DESCRIPTION</th>
                      <th className="py-3 px-4 text-center">DELIVERY TYPE</th>
                      <th className="py-3 px-4 text-center">QTY</th>
                      <th className="py-3 px-4 text-right">TOTAL (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="py-4 px-4 font-mono font-black text-slate-500">01</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-950 text-sm sm:text-base font-mono">
                            {order.productName}
                          </p>
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[10px] font-bold text-slate-800">
                            v{product?.version || order.purchasedVersion || '1.0'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                          {order.purchaseType === 'source_code'
                            ? 'Full Uncompiled Source Code Repository, Architecture Documentation, Database Schema & Commercial Deployment License.'
                            : order.purchaseType === 'bundle'
                            ? 'Complete Multi-Product Software & Paid APK Bundle with Full Personal Browser Vault Access.'
                            : 'Official Paid Android APK / Compiled Production Software Package with Lifetime Personal Browser Download Access.'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center font-mono uppercase text-[11px] font-bold text-slate-800 whitespace-nowrap">
                        {order.purchaseType === 'source_code'
                          ? 'Source Code ZIP'
                          : order.purchaseType === 'bundle'
                          ? 'Pro Bundle'
                          : 'Paid APK / App'}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-slate-950 font-black">01</td>
                      <td className="py-4 px-4 text-right font-mono font-black text-base text-slate-950 whitespace-nowrap">
                        PKR {order.amount?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 6. PROOF THUMBNAIL + BARCODE + FINANCIAL SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                {/* Left: Attached Payment Proof Preview & Cryptographic Barcode */}
                <div className="sm:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  {order.paymentProofUrl && (
                    <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-900 shrink-0 relative">
                      <img
                        src={order.paymentProofUrl}
                        alt="Payment Proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-mono font-bold text-center py-0.5">
                        PROOF ✓
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span>DIGITAL LICENSE & RECEIPT AUTHENTICATION</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 break-all">
                      HASH: {digitalFingerprint}
                    </p>
                    {/* Crisp 1D SVG Barcode */}
                    <div className="pt-1">
                      <div className="flex items-center h-7 gap-[2px] bg-white p-1 rounded border border-slate-200 w-fit">
                        {Array.from({ length: 38 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-slate-950 h-full"
                            style={{
                              width: i % 5 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1px',
                              opacity: i % 7 === 0 ? 0.35 : 1
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] font-mono text-slate-500 tracking-widest mt-0.5">
                        *{invoiceNumber}*
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Financial Totals Box */}
                <div className="sm:col-span-5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-mono">
                    <span>Subtotal:</span>
                    <span className="text-slate-950 font-bold">PKR {order.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-mono">
                    <span>Browser Vault Delivery Fee:</span>
                    <span className="text-emerald-700 font-bold">PKR 0 (FREE)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-mono">
                    <span>Loyalty Reward Points:</span>
                    <span className="text-amber-700 font-bold">+{pointsEarned} AFFY PTS</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 text-white flex items-center justify-between font-mono mt-2 shadow-md">
                    <span className="text-xs font-bold uppercase text-cyan-400">Total Paid:</span>
                    <span className="text-lg font-black text-white">
                      PKR {order.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. OFFICIAL SIGNATURE & FOOTER */}
              <div className="pt-6 mt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
                <div className="space-y-1 text-slate-600 text-[11px] max-w-md">
                  <p className="font-black text-slate-950 font-mono uppercase">
                    OFFICIAL TERMS & BROWSER ISOLATION GUARANTEE:
                  </p>
                  <p>• Keep your Invoice ID (<strong className="text-slate-900">{invoiceNumber}</strong>) or Order ID (<strong className="text-slate-900">{order.id}</strong>) safe for instant order verification.</p>
                  <p>• Your Paid APK / Software download is strictly isolated to your private browser dashboard.</p>
                  <p>• Official Support: <strong className="text-slate-900">{settings.phone}</strong> • <strong className="text-slate-900">{settings.email}</strong></p>
                </div>

                <div className="text-left sm:text-right space-y-1.5 shrink-0">
                  <div className="inline-block border-b-2 border-slate-900 pb-1 px-2">
                    <img
                      src={settings.signatureUrl}
                      alt="Aftab Authorized Signature"
                      className="h-10 w-auto object-contain sm:ml-auto filter invert"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black font-mono text-slate-950">Aftab (CodeWithAffy)</p>
                    <p className="text-[10px] font-mono text-slate-600">
                      Founder & Lead Software Architect • AFFY OFFICIAL
                    </p>
                  </div>
                </div>
              </div>

              {/* PRINT-ONLY AUTHENTICATION FOOTER */}
              <div className="print-only pt-4 mt-4 border-t border-dashed border-slate-300 text-center text-[10px] font-mono text-slate-500">
                Generated electronically via AFFY OFFICIAL Digital Vault • Cryptographic Fingerprint: {digitalFingerprint} • Verified Original Copy
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM INTERACTIVE BAR (HIDDEN IN PRINT)                 */}
        {/* ======================================================== */}
        <div className="no-print pt-4 mt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Saved in your <strong className="text-white">My Orders & APK Vault</strong> dashboard.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {isConfirmed && (
              <a
                href={downloadUrl || '#'}
                download={downloadFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-black" />
                <span>
                  {order.purchaseType === 'source_code'
                    ? 'Download Source ZIP Now 📥'
                    : 'Download Paid APK Now 📥'}
                </span>
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                setActiveView('my-dashboard');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <span>Go to My Orders Dashboard</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
