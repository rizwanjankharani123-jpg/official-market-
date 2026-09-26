import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductBundle, PurchaseType, PaymentMethod } from '../../types';
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
  QrCode,
  Layers,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PurchaseModalProps {
  product?: Product | null;
  bundle?: ProductBundle | null;
  initialType?: PurchaseType;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string, email: string) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  product,
  bundle,
  initialType = 'software',
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { paymentMethods, createOrder, settings } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(bundle ? 'bundle' : initialType);
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

  useEffect(() => {
    if (bundle) {
      setPurchaseType('bundle');
    } else {
      setPurchaseType(initialType);
    }
  }, [bundle, initialType]);

  if (!isOpen || (!product && !bundle)) return null;

  const isBundle = Boolean(bundle);
  const itemName = bundle ? bundle.name : product!.name;

  const activePaymentMethods = paymentMethods.filter(pm => pm.active);
  const currentPrice = bundle
    ? bundle.price
    : purchaseType === 'source_code'
    ? (product!.sourcePrice || product!.price)
    : product!.price;

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
        productId: bundle ? bundle.id : product!.id,
        productName: itemName,
        bundleId: bundle ? bundle.id : undefined,
        bundleName: bundle ? bundle.name : undefined,
        includedProductIds: bundle ? bundle.productIds : undefined,
        purchaseType: isBundle ? 'bundle' : purchaseType,
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

  const pointsEarned = Math.floor((currentPrice || 0) / 100) * (settings.rewardPointsPer100PKR || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl shadow-cyan-950/60 text-slate-200 my-4 sm:my-8 max-h-[92vh] overflow-y-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
              STEP {step} OF 3
            </span>
            <span className="text-xs font-mono text-slate-400">
              {step === 1 ? 'License & Options' : step === 2 ? 'Payment Transfer' : 'Audit Verification'}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white">
            Secure Purchase: <span className="text-cyan-400">{itemName}</span>
          </h2>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: LICENSE SELECTION & SUMMARY */}
        {step === 1 && (
          <div className="space-y-6">
            {!isBundle && product && (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase text-slate-400">Select Purchase Tier:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Software Tier */}
                  <div
                    onClick={() => setPurchaseType('software')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      purchaseType === 'software'
                        ? 'bg-cyan-950/30 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">Software License</span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        PKR {product.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Compiled Android APK / Executable ready for deployment with documentation.
                    </p>
                  </div>

                  {/* Source Code Tier */}
                  {product.sourceAvailable && (
                    <div
                      onClick={() => setPurchaseType('source_code')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        purchaseType === 'source_code'
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Full Source Code</span>
                        <span className="text-xs font-mono text-indigo-400 font-bold">
                          PKR {(product.sourcePrice || product.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Complete raw source repository, commercial licensing & full architecture rights.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isBundle && bundle && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm">Value Bundle License ({bundle.productIds.length} Packages)</span>
                </div>
                <p className="text-xs text-slate-300">
                  {bundle.shortDescription}
                </p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Base Item:</span>
                <span className="text-white">{itemName}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>License Type:</span>
                <span className="text-cyan-400 uppercase">{isBundle ? 'Software Bundle' : purchaseType}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Rewards Points Earned:</span>
                <span className="text-amber-400 font-bold">+{pointsEarned} PTS</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-white">Total Amount Due:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  PKR {currentPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <span>Proceed to Payment Transfer</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION & INSTRUCTIONS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase text-slate-400">Choose Transfer Gateway:</p>
              <div className="grid grid-cols-2 gap-3">
                {activePaymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethodId(pm.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPaymentMethod?.id === pm.id
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-sm text-white">{pm.name}</span>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">{pm.accountTitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Gateway Detail Box */}
            {selectedPaymentMethod && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Official Transfer Account:</span>
                    <h3 className="font-bold text-white text-base">{selectedPaymentMethod.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400">Amount to Transfer:</span>
                    <p className="font-bold font-mono text-emerald-400 text-lg">
                      PKR {currentPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Account Title:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{selectedPaymentMethod.accountTitle}</span>
                      <button
                        onClick={() => handleCopy(selectedPaymentMethod.accountTitle, 'title')}
                        className="text-cyan-400 hover:text-cyan-300 p-1"
                        title="Copy"
                      >
                        {copiedId === 'title' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Account / Mobile Number:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{selectedPaymentMethod.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(selectedPaymentMethod.accountNumber, 'num')}
                        className="text-cyan-400 hover:text-cyan-300 p-1"
                        title="Copy"
                      >
                        {copiedId === 'num' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions text */}
                <div className="p-3.5 rounded-xl bg-[#06080e] border border-white/5 space-y-1">
                  <p className="text-[11px] font-mono text-slate-400 font-bold uppercase">Payment Instructions:</p>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedPaymentMethod.instructions}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>I Have Paid — Submit Proof</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TRANSACTION PROOF SUBMISSION */}
        {step === 3 && (
          <form onSubmit={handleFinishOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Email Address (for Order & License) *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. ali@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-cyan-400 font-bold">Transaction / TRX ID *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 293847291038"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none font-bold"
                  required
                />
              </div>
            </div>

            {/* Payment Screenshot File Upload */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Attach Payment Slip / Screenshot *</label>
              <div className="relative border-2 border-dashed border-white/15 hover:border-cyan-500/40 rounded-2xl p-4 bg-slate-950 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {screenshotPreview ? (
                  <div className="space-y-2">
                    <img
                      src={screenshotPreview}
                      alt="Proof Preview"
                      className="max-h-24 mx-auto rounded-lg border border-white/10"
                    />
                    <p className="text-[11px] text-emerald-400 font-mono">
                      ✓ Screenshot loaded successfully. Click to change.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 py-1">
                    <UploadCloud className="w-6 h-6 text-cyan-400 mx-auto" />
                    <p className="text-xs font-bold text-white">Click or Drag Payment Screenshot</p>
                    <p className="text-[10px] text-slate-500 font-mono">PNG, JPG or JPEG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Additional Note / Custom Requirements</label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Optional notes for developer"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 text-xs font-mono cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-black font-black text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>{isSubmitting ? 'Verifying & Submitting...' : 'Complete & Submit Payment Audit'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
