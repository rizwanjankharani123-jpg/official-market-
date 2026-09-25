import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PurchaseType, PaymentMethod } from '../../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  UploadCloud,
  FileImage,
  ArrowRight,
  ArrowLeft,
  Lock,
  Clock,
  DownloadCloud,
  Code2,
  AlertCircle,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PurchaseModalProps {
  product: Product | null;
  initialType?: PurchaseType;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string, email: string) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  product,
  initialType = 'software',
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { paymentMethods, createOrder, settings } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(initialType);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Step 3 inputs
  const [transactionId, setTransactionId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !product) return null;

  const activePaymentMethods = paymentMethods.filter(pm => pm.active);
  const currentPrice = purchaseType === 'source_code' ? (product.sourcePrice || product.price) : product.price;

  const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedMethodId) || activePaymentMethods[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot size must be under 5MB');
        return;
      }
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setErrorMessage('Please enter your payment Transaction / TRX ID.');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please enter your name and valid email address.');
      return;
    }
    if (!screenshotPreview) {
      setErrorMessage('Please attach/upload your payment receipt screenshot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const order = await createOrder({
        productId: product.id,
        productName: product.name,
        purchaseType,
        amount: currentPrice,
        currency: 'PKR',
        paymentMethodId: selectedPaymentMethod?.id || 'manual',
        paymentMethodName: selectedPaymentMethod?.name || 'Manual Transfer',
        transactionId: transactionId.trim(),
        paymentProofUrl: screenshotPreview,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerNote: customerNote.trim()
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onClose();
      onOrderSuccess(order.id, order.customerEmail);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 text-slate-200 my-8 max-h-[90vh] overflow-y-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Stepper Header */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              OFFICIAL CHECKOUT
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">Step {step} of 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
            {step === 1 && 'Confirm Purchase & License Tier'}
            {step === 2 && 'Select Payment Method & Transfer'}
            {step === 3 && 'Submit Payment Proof & TRX ID'}
          </h2>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-cyan-400' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-cyan-400' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-cyan-400' : 'bg-white/10'}`} />
          </div>
        </div>

        {/* STEP 1: Product Selection & Order Summary */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{product.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">Version {product.version} • {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-cyan-400 font-mono">PKR {currentPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Purchase Type Switcher */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <label className="text-xs font-mono text-slate-300">Choose Purchase Package:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPurchaseType('software')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      purchaseType === 'software'
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Software / APK Package</span>
                      <DownloadCloud className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Ready-to-install binary build</p>
                    <p className="text-sm font-bold font-mono text-white mt-2">PKR {(product.price || 0).toLocaleString()}</p>
                  </div>

                  {product.sourceAvailable && (
                    <div
                      onClick={() => setPurchaseType('source_code')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        purchaseType === 'source_code'
                          ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Full Source Code License</span>
                        <Code2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Full repository & schema</p>
                      <p className="text-sm font-bold font-mono text-white mt-2">PKR {(product.sourcePrice || product.price).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* License & Delivery Notice */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Manual Verified Delivery & Official Certificate</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Upon submitting payment proof, your order will receive a unique tracking reference. Once verified by Aftab, your secure download portal and official signed certificate will be immediately unlocked.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  if (activePaymentMethods.length > 0) {
                    setSelectedMethodId(activePaymentMethods[0]?.id || '');
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Methods & Account Details */}
        {step === 2 && (
          <div className="space-y-6">
            {activePaymentMethods.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#090d16] border border-amber-500/30 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-base font-bold text-white font-mono">Payment methods are currently unavailable</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Payment methods are currently unavailable. Please check again later or contact Aftab directly via WhatsApp for manual order processing.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Select Your Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activePaymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedMethodId(pm.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPaymentMethod?.id === pm.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{pm.name}</p>
                      <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{pm.accountTitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Method Details Box */}
            {selectedPaymentMethod && activePaymentMethods.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#06080e] border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="font-bold text-white text-base">{selectedPaymentMethod.name}</h4>
                    <p className="text-xs text-cyan-400 font-mono">Account Title: {selectedPaymentMethod.accountTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono text-slate-400">Pay Exact Amount</p>
                    <p className="text-base font-black text-white font-mono">PKR {currentPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Account Number Row */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-400">Account / Mobile Number</p>
                      <p className="text-sm font-mono font-bold text-white">{selectedPaymentMethod.accountNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedPaymentMethod.accountNumber, 'acc')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === 'acc' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="font-mono text-[10px]">{copiedId === 'acc' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Transfer Instructions */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-1.5">
                  <p className="font-mono text-cyan-400 font-semibold text-[11px]">Payment Instructions:</p>
                  <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-300 font-mono">
                    {selectedPaymentMethod.instructions}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={activePaymentMethods.length === 0}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>I Have Transferred the Payment</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Submit Payment Proof & Details */}
        {step === 3 && (
          <form onSubmit={handleFinishOrder} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Transaction / TRX ID *
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. JC-992810482 or TXID..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Email for Delivery & Invoice *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. client@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  WhatsApp / Phone (Optional)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +92 300 0000000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Screenshot Upload Dropzone */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Attach Payment Receipt Screenshot *
              </label>
              <div className="p-4 rounded-2xl bg-slate-900 border border-dashed border-cyan-500/40 hover:border-cyan-500 transition-colors text-center relative overflow-hidden">
                {screenshotPreview ? (
                  <div className="space-y-2">
                    <img
                      src={screenshotPreview}
                      alt="Payment proof preview"
                      className="max-h-40 mx-auto rounded-lg object-contain border border-white/10"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-emerald-400 font-mono">Screenshot Attached</span>
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-4 space-y-2">
                    <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
                    <p className="text-xs font-bold text-white">Click or drag receipt screenshot here</p>
                    <p className="text-[10px] text-slate-400 font-mono">Supports PNG, JPG, JPEG (Max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Order Notes / Specific Requirements (Optional)
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Any special instruction or preferred delivery format..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Order & Generate Reference'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
