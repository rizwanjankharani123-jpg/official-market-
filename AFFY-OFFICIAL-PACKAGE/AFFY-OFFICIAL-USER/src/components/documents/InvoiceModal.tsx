import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  Mail,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { downloadElementAsPdf } from '../../utils/pdfGenerator';

interface InvoiceModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ orderId, onClose }) => {
  const { orders, settings } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!orderId) return null;

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const invoiceNumber = order.id.replace('AFFY-ORD-', 'AFFY-INV-');
  const isConfirmed = order.status === 'payment_confirmed' || order.status === 'completed';
  const isPending = !isConfirmed;

  const issueDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const confirmedDate = order.confirmedAt
    ? new Date(order.confirmedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : issueDate;

  const handleDownloadPdf = async () => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl my-6 max-h-[96vh] flex flex-col">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Official Commercial Invoice</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-300 font-semibold">{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              title="Download High Quality PDF Document"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
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

        {/* SCROLLABLE / PRINTABLE INVOICE CONTAINER */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {/* THE FORMAL INVOICE SHEET */}
          <div
            ref={invoiceRef}
            className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-2xl text-left font-sans select-text border border-slate-300 relative"
          >
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-slate-900 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-mono">
                    AFFY<span className="text-cyan-600">OFFICIAL</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-white font-bold tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Aftab — Web Developer & Software Developer
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  Official Software & Source Code Marketplace
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1 space-y-0.5">
                  <p>Email: {settings.email}</p>
                  <p>WhatsApp: {settings.phone}</p>
                  <p>Channel: whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d</p>
                </div>
              </div>

              <div className="sm:text-right space-y-1 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                  COMMERCIAL INVOICE
                </h1>
                <p className="text-xs font-mono font-bold text-slate-800">
                  Invoice No: <span className="text-cyan-700">{invoiceNumber}</span>
                </p>
                <p className="text-xs font-mono text-slate-600">
                  Order ID: <span className="font-semibold text-slate-900">{order.id}</span>
                </p>
                <p className="text-xs text-slate-600 font-mono">
                  Issue Date: {issueDate}
                </p>
              </div>
            </div>

            {/* 2. PROMINENT STATUS BANNER */}
            <div className="my-5">
              {isPending ? (
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-900 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-950 border border-amber-300">
                        PAYMENT WAITING FOR APPROVAL
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
                      Your payment proof and transaction reference (<strong className="font-mono text-amber-950">{order.transactionId || 'Submitted'}</strong>) are currently being reviewed by Aftab. Once confirmed, this invoice will update automatically to <strong>PAYMENT CONFIRMED</strong> and your download vault will unlock.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-600 text-white shadow-sm">
                        PAYMENT CONFIRMED
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                        Verified by Aftab on {confirmedDate}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Payment of <strong>PKR {order.amount?.toLocaleString()}</strong> received successfully via <strong>{order.paymentMethodName}</strong> (TRX: <span className="font-mono font-bold text-emerald-950">{order.transactionId}</span>). Download access and licensing granted.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Customer & Payment Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-t border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <p className="font-mono uppercase text-[10px] text-slate-500 font-bold tracking-wider">
                  CUSTOMER DETAILS (BILLED TO):
                </p>
                <p className="font-bold text-slate-950 text-sm font-mono">{order.customerName}</p>
                <p className="text-slate-700 font-mono">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-slate-700 font-mono">Phone: {order.customerPhone}</p>
                )}
                {order.customerNote && (
                  <p className="text-[11px] text-slate-500 italic mt-1">Note: "{order.customerNote}"</p>
                )}
              </div>

              <div className="space-y-1 sm:text-right">
                <p className="font-mono uppercase text-[10px] text-slate-500 font-bold tracking-wider">
                  PAYMENT TRANSACTION DETAILS:
                </p>
                <p className="text-slate-700">
                  <span className="text-slate-500">Gateway:</span>{' '}
                  <strong className="font-mono text-slate-900">{order.paymentMethodName}</strong>
                </p>
                <p className="text-slate-700">
                  <span className="text-slate-500">Transaction Ref (TRX ID):</span>{' '}
                  <strong className="font-mono text-cyan-800">{order.transactionId || 'Pending'}</strong>
                </p>
                <p className="text-slate-700">
                  <span className="text-slate-500">Audit Status:</span>{' '}
                  <span className={`font-mono font-bold ${isConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isConfirmed ? 'Verified & Approved' : 'Under Manual Review'}
                  </span>
                </p>
              </div>
            </div>

            {/* 4. Product Table */}
            <div className="py-5">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 font-mono text-[11px]">
                    <th className="py-2.5">PRODUCT / ITEM DESCRIPTION</th>
                    <th className="py-2.5 text-center">PURCHASE TYPE</th>
                    <th className="py-2.5 text-center">QTY</th>
                    <th className="py-2.5 text-right">UNIT PRICE</th>
                    <th className="py-2.5 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-4 pr-2">
                      <p className="font-bold text-slate-950 text-sm">{order.productName}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        {order.purchaseType === 'source_code'
                          ? 'Full Uncompiled Source Code Repository, Architecture Documentation, Database Schema & Commercial Deployment Rights.'
                          : 'Production-Ready Compiled Software Package / Android APK, Setup Guide & Verified Malware-Free Guarantee.'}
                      </p>
                    </td>
                    <td className="py-4 text-center font-mono uppercase text-[11px] text-slate-700 whitespace-nowrap">
                      {order.purchaseType === 'source_code' ? 'Source Code' : 'Software / APK'}
                    </td>
                    <td className="py-4 text-center font-mono text-slate-900 font-bold">1</td>
                    <td className="py-4 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                      PKR {order.amount?.toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-mono font-black text-slate-950 whitespace-nowrap">
                      PKR {order.amount?.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Total Calculation */}
            <div className="flex justify-end pt-3 border-t-2 border-slate-900">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900 font-medium">PKR {order.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Digital Delivery Fee:</span>
                  <span className="font-mono text-slate-900 font-medium">PKR 0</span>
                </div>
                <div className="flex justify-between py-2 border-t border-b border-slate-300 font-mono font-black text-base text-slate-950">
                  <span>Total Amount:</span>
                  <span className="text-cyan-800">PKR {order.amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 6. Footer: Terms, Signature, and Official Verified Channels */}
            <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-xs">
              <div className="space-y-1.5 text-slate-600 text-[11px]">
                <p className="font-bold text-slate-900 font-mono">TERMS & LEGAL DECLARATION:</p>
                <p>• This invoice represents an official digital purchase record from AFFY OFFICIAL.</p>
                <p>• Digital software delivery and licensing are managed electronically via Order Tracking.</p>
                <p>• Official Inquiries: <strong className="text-slate-800">{settings.email}</strong></p>
                <p>• Direct WhatsApp: <strong className="text-slate-800">{settings.phone}</strong></p>
              </div>

              <div className="text-left sm:text-right space-y-2">
                <div className="inline-block border-b border-slate-400 pb-1">
                  <img
                    src={settings.signatureUrl}
                    alt="Authorized Signature"
                    className="h-9 w-auto object-contain sm:ml-auto filter invert"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold font-mono text-slate-950">Aftab</p>
                  <p className="text-[10px] font-mono text-slate-600">Web Developer & Software Developer</p>
                  <p className="text-[10px] font-mono text-cyan-800 font-semibold">AFFY OFFICIAL • CodeWithAffy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
