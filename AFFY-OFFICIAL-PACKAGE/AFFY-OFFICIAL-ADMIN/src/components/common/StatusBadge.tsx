import React from 'react';
import { OrderStatus, RequestStatus, QuotationStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, XCircle, FileText, PhoneCall, Code2 } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus | RequestStatus | QuotationStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'new':
    case 'submitted':
    case 'payment_pending':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${className}`}>
          <RefreshCw className="w-3.5 h-3.5" />
          {status === 'payment_pending' ? 'Payment Pending' : 'New Request'}
        </span>
      );

    case 'reviewing':
    case 'under_review':
    case 'proof_submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}>
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          {status === 'proof_submitted' ? 'Proof Submitted' : 'Reviewing'}
        </span>
      );

    case 'contacted':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 ${className}`}>
          <PhoneCall className="w-3.5 h-3.5" />
          Contacted
        </span>
      );

    case 'quoted':
    case 'sent':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 ${className}`}>
          <FileText className="w-3.5 h-3.5" />
          Quoted
        </span>
      );

    case 'in_development':
    case 'in_progress':
    case 'processing':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 ${className}`}>
          <Code2 className="w-3.5 h-3.5" />
          In Development
        </span>
      );

    case 'completed':
    case 'accepted':
    case 'payment_confirmed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status === 'payment_confirmed' ? 'Payment Confirmed' : status === 'accepted' ? 'Accepted' : 'Completed'}
        </span>
      );

    case 'rejected':
    case 'closed':
    case 'declined':
    case 'payment_rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}>
          <XCircle className="w-3.5 h-3.5" />
          {status === 'payment_rejected' ? 'Payment Rejected' : status === 'closed' ? 'Closed' : 'Rejected'}
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          {status}
        </span>
      );
  }
};
