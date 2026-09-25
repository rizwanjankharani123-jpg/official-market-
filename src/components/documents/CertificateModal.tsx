import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  FileCode2,
  Package
} from 'lucide-react';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface CertificateModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ orderId, onClose }) => {
  const { orders, settings, products } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!orderId) return null;

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const product = products.find(p => p.id === order.productId);
  const certNumber = order.id.replace('AFFY-ORD-', 'AFFY-CERT-');
  const isSourceCode = order.purchaseType === 'source_code';

  const issueDate = order.confirmedAt
    ? new Date(order.confirmedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      await downloadElementAsPdf(certRef.current, `${certNumber}`, 'l');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl my-6 max-h-[96vh] flex flex-col">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {isSourceCode ? 'Source Code License & Authenticity Certificate' : 'Software Purchase Certificate'}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-300 font-semibold">{certNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              title="Download High Resolution Certificate PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <Download className="w-3.5 h-3.5 text-black" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download Certificate PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CANVAS CONTAINER */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {/* THE CERTIFICATE CANVAS (LANDSCAPE DESIGN) */}
          <div
            ref={certRef}
            className="relative bg-[#050811] text-slate-100 p-6 sm:p-12 rounded-2xl border-4 border-double border-cyan-500/50 shadow-2xl text-center select-text overflow-hidden"
          >
            {/* Subtle background security grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Inner Certificate Border */}
            <div className="relative border border-cyan-500/30 p-6 sm:p-10 rounded-xl space-y-6">
              {/* Header Seal & Brand */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AFFY OFFICIAL • CODEWITHAFFY</span>
                </div>
                
                <h1 className="text-xl sm:text-3xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-indigo-200">
                  {isSourceCode
                    ? 'CERTIFICATE OF SOURCE CODE COMMERCIAL LICENSE'
                    : 'CERTIFICATE OF SOFTWARE AUTHENTICITY & PURCHASE'}
                </h1>
                
                <p className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase">
                  {isSourceCode
                    ? 'AUTHENTICATED INTELLECTUAL PROPERTY & DEPLOYMENT GRANT'
                    : 'OFFICIAL PRODUCTION SOFTWARE RELEASE VERIFICATION'}
                </p>
              </div>

              {/* Main Grant Body */}
              <div className="max-w-2xl mx-auto space-y-4 py-2">
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {isSourceCode
                    ? 'This official certificate verifies that the client named below has acquired full commercial licensing rights to modify, compile, and deploy the source code package specified below according to the configured license terms.'
                    : 'This official certificate verifies that the client named below has successfully acquired an authentic, malware-free executable software release and operational usage permissions.'}
                </p>

                {/* Recipient Display */}
                <div className="py-2 border-b-2 border-cyan-500/40 max-w-md mx-auto">
                  <p className="text-xl sm:text-3xl font-serif font-black text-cyan-300 tracking-wide">
                    {order.customerName}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{order.customerEmail}</p>
                </div>

                {/* Software / Item Details */}
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    {isSourceCode ? 'Licensed Source Code Package:' : 'Licensed Software / APK Release:'}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
                    {order.productName}
                  </p>
                  <p className="text-xs text-cyan-400 font-mono mt-1">
                    {isSourceCode
                      ? `License Scope: ${product?.licenseType || 'Standard Commercial'} • Commercial Client Deployment Permitted • Raw Redistribution Prohibited`
                      : 'Scope: Full Commercial Operational Usage Rights • Malware-Free Verified Binary'}
                  </p>
                </div>
              </div>

              {/* Verification Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-left max-w-2xl mx-auto font-mono">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase">Certificate ID</p>
                  <p className="font-bold text-cyan-300 truncate">{certNumber}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase">Order Reference</p>
                  <p className="text-slate-200 truncate">{order.id}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[9px] text-slate-500 uppercase">Issuance Date</p>
                  <p className="text-slate-200">{issueDate}</p>
                </div>
              </div>

              {/* Authorized Developer Signature Imprint */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto border-t border-cyan-500/20">
                {/* Cryptographic Seal Stamp */}
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-2xl border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-xs font-mono shadow-inner">
                    AFFY
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    <p className="font-bold text-white">Cryptographically Sealed</p>
                    <p className="text-emerald-400">Verified by Aftab</p>
                  </div>
                </div>

                {/* Developer Signature Stamp */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="inline-block border-b border-cyan-500/40 pb-1 px-4">
                    <img
                      src={settings.signatureUrl}
                      alt="Authorized Signature of Aftab"
                      className="h-10 w-auto object-contain mx-auto sm:ml-auto filter invert"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-mono text-white">Aftab</p>
                    <p className="text-[10px] font-mono text-cyan-400">Web Developer & Software Developer</p>
                    <p className="text-[9px] font-mono text-slate-500">AFFY OFFICIAL • CodeWithAffy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
