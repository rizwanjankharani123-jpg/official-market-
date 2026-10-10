import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  User as UserIcon,
  ShieldCheck,
  DownloadCloud,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Sparkles,
  FileText,
  Award,
  RefreshCw,
  Edit3,
  Smartphone,
  Code2,
  Layers,
  ArrowRight,
  Search,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface UserDashboardViewProps {
  onOpenInvoice: (orderId: string) => void;
  onOpenCertificate: (orderId: string) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onOpenInvoice,
  onOpenCertificate
}) => {
  const {
    userProfile,
    saveCustomerProfile,
    myOrders,
    products,
    refreshOrdersFromFirestore,
    linkOrderToMyBrowser,
    setActiveView
  } = useApp();

  const [nameInput, setNameInput] = useState(userProfile?.displayName || '');
  const [phoneInput, setPhoneInput] = useState(userProfile?.phone || '');
  const [isEditingProfile, setIsEditingProfile] = useState(!userProfile?.displayName);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [claimOrderId, setClaimOrderId] = useState('');
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (userProfile?.displayName) {
      setNameInput(userProfile.displayName);
      setPhoneInput(userProfile.phone || '');
      setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  }, [userProfile]);

  // Automatically sync latest order statuses from Firestore on mount
  useEffect(() => {
    refreshOrdersFromFirestore();
  }, [refreshOrdersFromFirestore]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    await saveCustomerProfile(nameInput.trim(), phoneInput.trim());
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrdersFromFirestore();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleClaimOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimOrderId.trim()) return;
    const ok = linkOrderToMyBrowser(claimOrderId.trim());
    if (ok) {
      setClaimMessage({ type: 'success', text: `Order ${claimOrderId.toUpperCase()} linked to your dashboard!` });
      setClaimOrderId('');
    } else {
      setClaimMessage({ type: 'error', text: 'Order ID not found. Make sure you enter exact ID (e.g. AFFY-ORD-123456).' });
    }
    setTimeout(() => setClaimMessage(null), 4000);
  };

  const approvedOrders = myOrders.filter(o => o.status === 'payment_confirmed' || o.status === 'completed');
  const pendingOrders = myOrders.filter(o => o.status === 'proof_submitted' || o.status === 'under_review' || o.status === 'payment_pending');
  const rejectedOrders = myOrders.filter(o => o.status === 'payment_rejected');

  const filteredOrders = myOrders.filter(o => {
    if (filterTab === 'approved') return o.status === 'payment_confirmed' || o.status === 'completed';
    if (filterTab === 'pending') return o.status === 'proof_submitted' || o.status === 'under_review' || o.status === 'payment_pending';
    if (filterTab === 'rejected') return o.status === 'payment_rejected';
    return true;
  });

  const resolveDownloadInfo = (order: Order) => {
    const product = products.find(p => p.id === order.productId);
    const url =
      order.downloadUrl ||
      (order.purchaseType === 'source_code' ? product?.sourceZipUrl : product?.apkUrl) ||
      '';
    const fileName =
      order.downloadName ||
      `${(product?.name || order.productName).replace(/\s+/g, '_')}_v${product?.version || order.purchasedVersion || '1.0'}.${
        order.purchaseType === 'source_code' ? 'zip' : 'apk'
      }`;
    return { url, fileName, product };
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left space-y-8">
      {/* Top Hero & Profile Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1528] via-[#090d16] to-[#050811] border border-cyan-500/35 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>PERSONAL BROWSER DASHBOARD & APK VAULT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-mono">
              {userProfile?.displayName
                ? `${userProfile.displayName}'s Orders & APK Vault`
                : 'Create Your Profile & View Orders'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Yahan aapko sirf aapke is browser se kiye gaye orders nazar aayenge. Jab Admin aapka order{' '}
              <span className="text-emerald-400 font-bold">Approve</span> karega, aapko yahan direct{' '}
              <span className="text-cyan-300 font-bold">Paid APK Download</span> button mil jayega. Kisi dusre user ko aapka download access kabhi show nahi hoga.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <Lock className="w-3.5 h-3.5" />
                100% Private Browser Session
              </span>
              <button
                onClick={handleManualRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isRefreshing ? 'Syncing Live Status...' : 'Refresh Order Status'}</span>
              </button>
            </div>
          </div>

          {/* Name Profile Setup / Display Box */}
          <div className="w-full lg:w-96 p-5 rounded-2xl bg-slate-950/90 border border-white/10 shadow-xl">
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    {userProfile?.displayName ? 'Update Your Name' : 'Set Your Profile Name'}
                  </span>
                  {userProfile?.displayName && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-[11px] text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your Name (e.g. Ali Khan)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />

                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="WhatsApp / Phone (Optional)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:brightness-110 text-black font-black font-mono text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Save My Profile
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-black font-mono text-lg shadow-lg shadow-cyan-500/20">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Active Profile</div>
                      <div className="text-base font-black text-white font-mono">
                        {userProfile?.displayName}
                      </div>
                      {userProfile?.phone && (
                        <div className="text-[11px] text-cyan-400 font-mono">{userProfile.phone}</div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors cursor-pointer"
                    title="Edit Profile Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {profileSavedToast && (
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Profile saved in your browser!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Live Order Status KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterTab('all')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
              : 'bg-[#090d16] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Total Orders</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{myOrders.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">In your browser</div>
        </button>

        <button
          onClick={() => setFilterTab('approved')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            filterTab === 'approved'
              ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-[#090d16] border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-300">Approved & Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{approvedOrders.length}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Paid APK Unlocked</div>
        </button>

        <button
          onClick={() => setFilterTab('pending')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            filterTab === 'pending'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-[#090d16] border-amber-500/20 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-amber-300">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{pendingOrders.length}</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Awaiting Admin Confirm</div>
        </button>

        <button
          onClick={() => setFilterTab('rejected')}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            filterTab === 'rejected'
              ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10'
              : 'bg-[#090d16] border-rose-500/20 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-rose-300">Cancelled / Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{rejectedOrders.length}</div>
          <div className="text-[11px] text-rose-300/80 mt-1">Verification Issues</div>
        </button>
      </div>

      {/* Orders List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-black text-white font-mono flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <span>My APK & Software Orders ({filteredOrders.length})</span>
          </h2>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab === 'all' ? 'All Orders' : tab}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-10 sm:p-12 rounded-3xl bg-[#090d16] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono">
              {myOrders.length === 0 ? 'Abhi Tak Koi Order Nahi Kiya Gaya' : 'Is Filter Mein Koi Order Nahi'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Jab aap koi Paid APK ya Software order karenge, aapka order status (Pending, Approved, ya Cancelled) aur Download button yahan show hoga.
            </p>
            <button
              onClick={() => setActiveView('software')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black font-mono text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Browse APKs & Software Marketplace</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isApproved = order.status === 'payment_confirmed' || order.status === 'completed';
              const isRejected = order.status === 'payment_rejected';
              const isPending = !isApproved && !isRejected;
              const { url, fileName } = resolveDownloadInfo(order);

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-xl ${
                    isApproved
                      ? 'bg-gradient-to-br from-emerald-950/30 via-[#090d16] to-[#090d16] border-emerald-500/40'
                      : isRejected
                      ? 'bg-gradient-to-br from-rose-950/30 via-[#090d16] to-[#090d16] border-rose-500/40'
                      : 'bg-gradient-to-br from-amber-950/25 via-[#090d16] to-[#090d16] border-amber-500/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300">
                          #{order.id}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-white/10">
                          {order.purchaseType === 'source_code'
                            ? 'Source Code'
                            : order.purchaseType === 'bundle'
                            ? 'Bundle'
                            : 'Android APK / App'}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white font-mono pt-1">
                        {order.productName}
                      </h3>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isApproved && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-black">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>ORDER APPROVED • PAID APK ACCESS GRANTED</span>
                        </div>
                      )}
                      {isPending && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-black">
                          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                          <span>PENDING ADMIN APPROVAL</span>
                        </div>
                      )}
                      {isRejected && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 font-mono text-xs font-black">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>ORDER CANCELLED / REJECTED</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Metadata & Actions */}
                  <div className="pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block">Customer Name</span>
                        <span className="text-white font-bold">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Amount Paid</span>
                        <span className="text-emerald-400 font-bold">
                          {order.currency || 'PKR'} {order.amount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Gateway & TRX ID</span>
                        <span className="text-cyan-300 font-bold">
                          {order.paymentMethodName} • {order.transactionId}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Action Bar based on Status */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {isApproved && (
                        <>
                          <a
                            href={url || '#'}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black font-mono text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
                          >
                            <DownloadCloud className="w-4 h-4 text-black" />
                            <span>
                              {order.purchaseType === 'source_code'
                                ? 'Download Source ZIP 📥'
                                : 'Download Paid APK 📥'}
                            </span>
                          </a>

                          <button
                            onClick={() => onOpenCertificate(order.id)}
                            className="px-3.5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                            <span>Certificate</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onOpenInvoice(order.id)}
                        className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Explanation Footer */}
                  {isPending && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Aapka order Admin Panel mein receive ho chuka hai!</span> Jaise hi Aftab aapka payment screenshot aur TRX ID verify kar ke Approve karenge, yahan par{' '}
                        <strong className="text-emerald-300">Download Paid APK</strong> ka button unlock ho jayega.
                      </div>
                    </div>
                  )}

                  {isRejected && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Order Cancelled / Payment Rejected:</span>{' '}
                        {order.rejectionReason || 'Payment screenshot ya Transaction ID verify nahi ho saki.'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Claim Order by Exact Order ID (in case browser storage was cleared) */}
      <div className="p-6 rounded-3xl bg-[#090d16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Link an Order by Order ID</span>
          </h4>
          <p className="text-xs text-slate-400">
            Agar aapke paas apna Order ID (e.g. <code className="text-cyan-300">AFFY-ORD-123456</code>) hai to use apne is browser dashboard mein add kar sakte hain.
          </p>
        </div>

        <form onSubmit={handleClaimOrder} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={claimOrderId}
            onChange={(e) => setClaimOrderId(e.target.value)}
            placeholder="AFFY-ORD-XXXXXX"
            className="flex-1 sm:w-52 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-mono text-xs cursor-pointer shrink-0"
          >
            Link Order
          </button>
        </form>
      </div>

      {claimMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 ${
            claimMessage.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{claimMessage.text}</span>
        </div>
      )}
    </section>
  );
};
