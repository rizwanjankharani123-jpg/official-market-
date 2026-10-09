import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductBundle, PurchaseType, PaymentMethod } from '../../types';
import { compressImageFile } from '../../utils/imageCompression';
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
  Coins,
  Smartphone,
  Sparkles,
  ExternalLink
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
  const { paymentMethods, createOrder, settings, currentUser, setIsUserAuthModalOpen } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(bundle ? 'bundle' : initialType);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Step 3 inputs
  const [transactionId, setTransactionId] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-sync customer details with currentUser if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !customerName) setCustomerName(currentUser.displayName);
      if (currentUser.email && !customerEmail) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Lottie-style Order Success State
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    email: string;
    amount: number;
    productName: string;
    trxId: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (bundle) {
      setPurchaseType('bundle');
    } else {
      setPurchaseType(initialType);
    }
  }, [bundle, initialType]);

  // Reset states when opening modal
  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
      setCountdown(4);
      setStep(1);
      setErrorMessage('');
      setScreenshotPreview(null);
      setTransactionId('');
    }
  }, [isOpen]);

  // Countdown timer for automatic transition to track order view
  useEffect(() => {
    if (!completedOrder) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          onOrderSuccess(completedOrder.id, completedOrder.email);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completedOrder, onClose, onOrderSuccess]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('Screenshot size must be under 8MB');
        return;
      }
      setErrorMessage('');
      try {
        // Automatically optimize & compress to < 80KB so Firestore 1MB quota is never exceeded
        const compressed = await compressImageFile(file, 900, 0.72);
        setScreenshotPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshotPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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

      // Multi-burst Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5, x: 0.5 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
      } catch {}

      // Switch to Lottie-Style Success State within the modal
      setCompletedOrder({
        id: order.id,
        email: order.customerEmail,
        amount: order.amount,
        productName: order.productName,
        trxId: order.transactionId
      });
      setCountdown(4);
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

        {/* ======================================================== */}
        {/* LOTTIE-STYLE SUCCESS VIEW (Plays Upon Order Confirmation) */}
        {/* ======================================================== */}
        {completedOrder ? (
          <div className="py-6 sm:py-8 px-2 text-center space-y-6 animate-success-pop">
            {/* Animated Lottie-style SVG Checkmark with Pulsing Glow Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
              {/* Radiating Ripple Rings */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
              <div className="absolute inset-[-8px] rounded-full border border-emerald-400/30 animate-ripple-ring" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/30 to-cyan-500/30 blur-md" />

              {/* High-Fidelity SVG Drawing Checkmark Animation */}
              <svg
                className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                viewBox="0 0 100 100"
                fill="none"
              >
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(16, 185, 129, 0.2)"
                  strokeWidth="6"
                />
                {/* Animated Outer Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#emerald-cyan-grad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="animate-checkmark-circle"
                  transform="rotate(-90 50 50)"
                />
                {/* Animated Drawing Checkmark */}
                <path
                  d="M30 52 L44 66 L72 36"
                  stroke="#ffffff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-checkmark-check"
                />
                <defs>
                  <linearGradient id="emerald-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Success Headlines */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>PAYMENT PROOF SUBMITTED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Order Placed Successfully! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your payment verification request has been queued. Aftab will audit the transaction and release your software download.
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 text-left max-w-lg mx-auto shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">Order ID:</span>
                  <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                    #{completedOrder.id.slice(0, 10).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(completedOrder.id, 'orderId')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer active:scale-90"
                >
                  {copiedId === 'orderId' ? (
                    <span className="text-emerald-400 font-bold">Copied! ✓</span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase">Product Name:</p>
                  <p className="text-white font-bold truncate">{completedOrder.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] uppercase">Total Paid:</p>
                  <p className="text-emerald-400 font-bold">PKR {completedOrder.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase">Account/Email:</p>
                  <p className="text-slate-200 truncate">{completedOrder.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] uppercase">Reward Points:</p>
                  <p className="text-amber-400 font-bold">+{pointsEarned} PTS</p>
                </div>
              </div>
            </div>

            {/* Countdown & Immediate Redirect Button */}
            <div className="space-y-3 max-w-lg mx-auto pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Auto-redirecting to Order Tracker...</span>
                <span className="text-cyan-400 font-bold">{countdown}s</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((4 - countdown) / 4) * 100}%` }}
                />
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOrderSuccess(completedOrder.id, completedOrder.email);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 btn-shimmer btn-glow-emerald cursor-pointer active:scale-95"
              >
                <span>Track Order & Access Software Now</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* STANDARD 3-STEP PURCHASE FLOW                            */
          /* ======================================================== */
          <>
            {/* Modal Header */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
                    STEP {step} OF 3
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {step === 1 ? 'License & Options' : step === 2 ? 'Payment Transfer' : 'Audit Verification'}
                  </span>
                </div>

                {/* Step Progress Dots */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step
                          ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400'
                          : s < step
                          ? 'w-2 bg-emerald-400'
                          : 'w-2 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
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
              <div className="space-y-6 animate-in fade-in">
                {!isBundle && product && (
                  <div className="space-y-3">
                    <p className="text-xs font-mono uppercase text-slate-400">Select Purchase Tier:</p>
                    <div className={`grid gap-3 ${product.sourceAvailable && !product.isApkOnly ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                      {/* Software Tier */}
                      <div
                        onClick={() => setPurchaseType('software')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer card-elevate ${
                          purchaseType === 'software'
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-900/50 border-white/5 hover:border-cyan-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-cyan-400" />
                            <span>{product.isApkOnly ? 'Android APK Package' : 'Software / APK License'}</span>
                          </span>
                          <span className="text-xs font-mono text-cyan-400 font-bold">
                            PKR {product.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          {product.isApkOnly
                            ? 'Compiled Android APK (.apk) ready to install with complete standalone features.'
                            : 'Compiled Android APK / Executable ready for deployment with documentation.'}
                        </p>
                      </div>

                      {/* Source Code Tier */}
                      {product.sourceAvailable && !product.isApkOnly && (
                        <div
                          onClick={() => setPurchaseType('source_code')}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer card-elevate ${
                            purchaseType === 'source_code'
                              ? 'bg-indigo-950/40 border-indigo-400 shadow-lg shadow-indigo-500/20'
                              : 'bg-slate-900/50 border-white/5 hover:border-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white flex items-center gap-1.5">
                              <Code2 className="w-4 h-4 text-indigo-400" />
                              <span>Full Source Code</span>
                            </span>
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
                    <span className="text-cyan-400 uppercase">{isBundle ? 'Software Bundle' : product?.isApkOnly ? 'Android APK' : purchaseType}</span>
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
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 btn-shimmer btn-glow-cyan cursor-pointer active:scale-95"
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
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer card-elevate hover-glow-cyan ${
                          selectedPaymentMethod?.id === pm.id
                            ? 'bg-cyan-950/50 border-cyan-400 shadow-xl shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                            : 'bg-slate-900 border-white/5 hover:border-cyan-500/30'
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
                    className="py-3 px-4 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 btn-shimmer btn-glow-cyan cursor-pointer active:scale-95"
                  >
                    <span>I Have Paid — Submit Proof</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRANSACTION PROOF SUBMISSION */}
            {step === 3 && (
              <form onSubmit={handleFinishOrder} className="space-y-4 animate-in fade-in">
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
                    className="py-3 px-4 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer active:scale-95"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 btn-shimmer btn-glow-emerald cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>{isSubmitting ? 'Verifying & Submitting...' : 'Complete & Submit Payment Audit'}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
