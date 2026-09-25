import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, Product, CustomRequest, PaymentMethod, OrderStatus, RequestStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ProductEditorModal } from './ProductEditorModal';
import {
  generateCustomerWhatsAppChatUrl,
  generateCustomerEmailUrl,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL
} from '../../utils/notifications';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  DownloadCloud,
  FileText,
  DollarSign,
  UserCheck,
  Code2,
  LogOut,
  Sparkles,
  AlertCircle,
  X,
  FileCode,
  FolderArchive,
  Save,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Globe
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenInvoice: (orderId: string) => void;
  onOpenCertificate: (orderId: string) => void;
  onOpenZipModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenInvoice,
  onOpenCertificate,
  onOpenZipModal
}) => {
  const {
    orders,
    products,
    customRequests,
    quotations,
    paymentMethods,
    settings,
    adminSession,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    updateCustomRequestStatus,
    createQuotation,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    updateSettings,
    adminLogout,
    setActiveView,
    getProductSalesStats
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'custom-requests' | 'payments' | 'settings'>('overview');

  // Filter states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Selected order for proof inspection & approval modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Product editor modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Quotation sender modal state
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState<CustomRequest | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(50000);
  const [quoteDays, setQuoteDays] = useState<number>(30);
  const [quoteScope, setQuoteScope] = useState('');
  const [quoteTerms, setQuoteTerms] = useState('50% Upfront Milestone, 50% on Final Source Delivery');

  // Payment Method editor state
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<Partial<PaymentMethod> | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Revenue & Metrics Calculations
  const verifiedOrders = orders.filter(o => o.status === 'payment_confirmed' || o.status === 'completed');
  const totalRevenue = verifiedOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingAudits = orders.filter(o => o.status === 'proof_submitted' || o.status === 'under_review');
  const pendingCustomRequests = customRequests.filter(r => r.status === 'submitted' || r.status === 'under_review');

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.transactionId.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApproveOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'payment_confirmed');
    setInspectingOrder(null);
  };

  const handleRejectOrder = async () => {
    if (!inspectingOrder) return;
    await updateOrderStatus(inspectingOrder.id, 'payment_rejected', rejectionReason || 'Payment proof verification failed.');
    setRejectionModalOpen(false);
    setRejectionReason('');
    setInspectingOrder(null);
  };

  const handleSaveProductData = async (productData: Partial<Product>) => {
    if (productData.id) {
      await updateProduct(productData.id, productData);
    } else {
      await addProduct({
        name: productData.name || 'New Software Release',
        category: (productData.category as any) || 'Android App',
        shortDescription: productData.shortDescription || '',
        fullDescription: productData.fullDescription || '',
        price: Number(productData.price) || 49,
        currency: 'USD',
        version: productData.version || 'v1.0.0',
        features: productData.features || ['Full Feature Set'],
        requirements: productData.requirements || ['Android 8.0+ / Modern Web'],
        includedFiles: productData.includedFiles || ['Executable Binary', 'Documentation'],
        demoImages: productData.demoImages || ['https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'],
        apkUrl: productData.apkUrl || 'https://example.com/download/app.apk',
        apkSize: productData.apkSize || '24.5 MB',
        sourceAvailable: productData.sourceAvailable ?? true,
        sourcePrice: Number(productData.sourcePrice) || (Number(productData.price) * 3),
        sourceZipUrl: productData.sourceZipUrl || 'https://example.com/download/source.zip',
        sourceSize: productData.sourceSize || '15.2 MB',
        techStack: productData.techStack || ['React', 'TypeScript', 'Node.js'],
        licenseType: (productData.licenseType as any) || 'Standard Commercial',
        licenseTerms: productData.licenseTerms || 'Full commercial deployment rights included.',
        commercialUseAllowed: true,
        redistributionAllowed: false,
        resaleAllowed: false,
        modificationAllowed: true,
        supportTerms: productData.supportTerms || 'Direct developer technical assistance.',
        status: productData.status || 'published',
        featured: true
      });
    }
  };

  const handleSendQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForQuote) return;

    await createQuotation({
      requestId: selectedRequestForQuote.id,
      customerEmail: selectedRequestForQuote.customerEmail,
      customerName: selectedRequestForQuote.customerName,
      projectTitle: selectedRequestForQuote.projectTitle,
      quotationAmount: Number(quoteAmount),
      currency: 'USD',
      estimatedDays: Number(quoteDays),
      deliverables: ['Full Source Code', 'Production Deployment', 'Documentation'],
      scope: quoteScope || `Complete architectural development of ${selectedRequestForQuote.projectTitle} with full source code rights, staging test environment, and Google Play/Cloud deployment.`,
      paymentTerms: quoteTerms,
      status: 'sent',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    await updateCustomRequestStatus(selectedRequestForQuote.id, 'quoted');
    setSelectedRequestForQuote(null);
    alert('Official quotation dispatched and recorded successfully!');
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaymentMethod?.name || !editingPaymentMethod.accountNumber) return;

    if (editingPaymentMethod.id) {
      await updatePaymentMethod(editingPaymentMethod.id, editingPaymentMethod);
    } else {
      await addPaymentMethod({
        name: editingPaymentMethod.name,
        type: editingPaymentMethod.type || 'bank',
        accountTitle: editingPaymentMethod.accountTitle || settings.developerName,
        accountNumber: editingPaymentMethod.accountNumber,
        iban: editingPaymentMethod.iban,
        instructions: editingPaymentMethod.instructions || 'Transfer the exact amount and save the transaction receipt.',
        active: editingPaymentMethod.active ?? true,
        order: paymentMethods.length + 1
      });
    }

    setIsPaymentModalOpen(false);
    setEditingPaymentMethod(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left text-slate-200">
      {/* Top Admin Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                AFFY Official Master CMS
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ROOT ADMIN
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Authenticated: <strong className="text-cyan-400">{adminSession?.email || 'affyofficial.dev@gmail.com'}</strong> • Verified Master Admin
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-mono text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={async () => {
              await adminLogout();
              setActiveView('home');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview & Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap relative ${
            activeTab === 'orders'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Payment Proofs & Orders</span>
          {pendingAudits.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-bold text-[10px]">
              {pendingAudits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom-requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap relative ${
            activeTab === 'custom-requests'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Project Requests & Quotations</span>
          {pendingCustomRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-black font-bold text-[10px]">
              {pendingCustomRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Gateways</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Platform Branding</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Total Confirmed Revenue</p>
              <p className="text-3xl font-black text-white font-mono">PKR {totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{verifiedOrders.length} Paid Orders</span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-amber-500/20 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Pending Proof Audits</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{pendingAudits.length}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {pendingAudits.length > 0 ? 'Requires your manual approval' : 'All proofs audited'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Published Products</p>
              <p className="text-3xl font-black text-cyan-400 font-mono">{products.length}</p>
              <p className="text-[11px] text-slate-400 font-mono">Ready Software & Source Licenses</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Custom Commission Requests</p>
              <p className="text-3xl font-black text-indigo-400 font-mono">{customRequests.length}</p>
              <p className="text-[11px] text-slate-400 font-mono">{quotations.length} Quotations Issued</p>
            </div>
          </div>

          {/* Pending Proofs Quick Audit Section */}
          {pendingAudits.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base font-mono">
                    Urgent: Payment Proofs Awaiting Verification ({pendingAudits.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingAudits.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-300">{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-bold text-sm text-white mt-1">{order.productName}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        PKR {order.amount.toLocaleString()} • TRX: {order.transactionId} • {order.customerName}
                      </p>
                    </div>

                    <button
                      onClick={() => setInspectingOrder(order)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-colors shrink-0 cursor-pointer"
                    >
                      Audit Proof
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="p-6 rounded-3xl bg-[#090d16] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-mono">Recent Order History</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Full Table ({orders.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Product</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-white/5">
                      <td className="py-3 px-2 text-cyan-300 font-bold">{o.id}</td>
                      <td className="py-3 px-2 text-slate-200">{o.productName}</td>
                      <td className="py-3 px-2 text-slate-400">{o.customerName}</td>
                      <td className="py-3 px-2 text-white font-bold">PKR {o.amount.toLocaleString()}</td>
                      <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setInspectingOrder(o)}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & PROOFS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Customer Orders & Payment Auditing</h2>
              <p className="text-xs text-slate-400">Review receipts, approve download access, or issue rejections.</p>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders, TRX, emails..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="proof_submitted">Proof Submitted</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="payment_rejected">Payment Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Orders Mobile Card View & Desktop Table */}
          <div className="p-4 sm:p-6 rounded-3xl bg-[#090d16] border border-white/10 shadow-xl">
            {/* Mobile View: Cards */}
            <div className="space-y-4 md:hidden">
              {filteredOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-mono">
                  No orders found.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>

                    <div>
                      <p className="font-bold text-sm text-white">{order.productName}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">{order.purchaseType === 'source_code' ? 'Full Source Code' : 'Software Binary'}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer:</span>
                        <span className="text-white font-bold">{order.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-300 truncate max-w-[180px]">{order.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment:</span>
                        <span className="text-cyan-300">{order.paymentMethodName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">TRX ID:</span>
                        <span className="text-emerald-400 select-all">{order.transactionId}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-white/5 font-bold">
                        <span className="text-slate-300">Amount:</span>
                        <span className="text-white text-sm">PKR {order.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setInspectingOrder(order)}
                        className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-black" />
                        <span>Audit Proof</span>
                      </button>

                      <button
                        onClick={() => onOpenInvoice(order.id)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="py-3 px-3">Order Ref</th>
                    <th className="py-3 px-3">Product & Tier</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Payment Info</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-mono text-cyan-300 font-bold">{order.id}</td>
                      <td className="py-4 px-3">
                        <p className="font-bold text-white">{order.productName}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">{order.purchaseType}</p>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-slate-200 font-medium">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{order.customerEmail}</p>
                      </td>
                      <td className="py-4 px-3 font-mono">
                        <p className="text-slate-300">{order.paymentMethodName}</p>
                        <p className="text-[10px] text-cyan-400">TRX: {order.transactionId}</p>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-white">PKR {order.amount.toLocaleString()}</td>
                      <td className="py-4 px-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/30 cursor-pointer"
                        >
                          Inspect & Verify
                        </button>
                        <button
                          onClick={() => onOpenInvoice(order.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                          title="View Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CATALOG CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Product & Source Catalog CMS</h2>
              <p className="text-xs text-slate-400">Create, configure, and release Software APKs and Source Code packages.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'Android App',
                  shortDescription: '',
                  fullDescription: '',
                  price: 1500,
                  currency: 'PKR',
                  version: 'v1.0.0',
                  features: ['Native Performance', 'Clean Modular Code', 'Offline Sync'],
                  requirements: ['Android 8.0+ / Modern Web'],
                  includedFiles: ['Compiled APK', 'Documentation'],
                  demoImages: ['https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'],
                  apkUrl: 'https://example.com/download/app.apk',
                  apkSize: '24.5 MB',
                  sourceAvailable: true,
                  sourcePrice: 4500,
                  sourceZipUrl: 'https://example.com/download/source.zip',
                  sourceSize: '15.2 MB',
                  techStack: ['Kotlin', 'React', 'TypeScript'],
                  licenseType: 'Standard Commercial',
                  licenseTerms: 'Commercial deployment rights included.',
                  commercialUseAllowed: true,
                  redistributionAllowed: false,
                  resaleAllowed: false,
                  modificationAllowed: true,
                  supportTerms: 'Developer bug fixes included.',
                  status: 'published',
                  featured: true
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add New Product</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No products listed in catalog</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your catalog is currently empty. Click "Add New Product" above to publish your first verified APK or source code package.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-[#090d16] border border-white/10 flex flex-col justify-between overflow-hidden shadow-xl hover:border-cyan-500/30 transition-all"
                >
                  <div>
                    {/* Product thumbnail */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={p.demoImages[0] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30 font-semibold">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                        {p.version}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white line-clamp-1">{p.name}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-white/10'}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>

                      {/* Real-time Firestore Sales Stats */}
                      {(() => {
                        const stats = getProductSalesStats(p.id);
                        return (
                          <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Sold: <strong className="text-white font-bold">{stats.sold}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              <span>Pending: <strong className="text-white font-bold">{stats.pending}</strong></span>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="pt-2 border-t border-white/5 flex justify-between font-mono text-xs">
                        <span className="text-slate-400">Software: <strong className="text-white">PKR {p.price?.toLocaleString()}</strong></span>
                        {p.sourceAvailable && (
                          <span className="text-indigo-400">Source: <strong className="text-white">PKR {p.sourcePrice?.toLocaleString()}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/5 mt-auto flex justify-between items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit Product</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete product "${p.name}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CUSTOM PROJECT REQUESTS & QUOTATION BUILDER */}
      {activeTab === 'custom-requests' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Custom Project Requests & Inquiries</h2>
              <p className="text-xs text-slate-400">
                Direct client submissions logged in real-time. Communicate via WhatsApp or Email and manage project milestones.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              Total Inquiries: <strong>{customRequests.length}</strong>
            </div>
          </div>

          <div className="space-y-5">
            {customRequests.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#090d16] border border-white/5 text-center text-slate-400 text-xs font-mono">
                No custom project inquiries received yet.
              </div>
            ) : (
              customRequests.map((req) => {
                const quo = quotations.find(q => q.requestId === req.id);
                const customerWhatsAppUrl = generateCustomerWhatsAppChatUrl(req);
                const customerEmailUrl = generateCustomerEmailUrl(req);

                return (
                  <div
                    key={req.id}
                    className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/10 space-y-5 shadow-xl hover:border-cyan-500/30 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-white/10 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                            {req.id}
                          </span>
                          <StatusBadge status={req.status} />
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(req.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{req.projectTitle}</h3>
                        <p className="text-xs text-slate-300">
                          Customer: <strong className="text-white">{req.customerName}</strong> • {req.customerEmail} {req.customerPhone && `• WhatsApp: ${req.customerPhone}`}
                        </p>
                      </div>

                      {/* Status Selector & Communication Action Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status update dropdown */}
                        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Status:</span>
                          <select
                            value={req.status}
                            onChange={(e) => updateCustomRequestStatus(req.id, e.target.value as RequestStatus)}
                            className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="new" className="bg-slate-900 text-cyan-300">New Request</option>
                            <option value="reviewing" className="bg-slate-900 text-amber-300">Reviewing</option>
                            <option value="contacted" className="bg-slate-900 text-sky-300">Contacted Customer</option>
                            <option value="quoted" className="bg-slate-900 text-indigo-300">Quoted</option>
                            <option value="in_development" className="bg-slate-900 text-purple-300">In Development</option>
                            <option value="completed" className="bg-slate-900 text-emerald-300">Completed</option>
                            <option value="rejected" className="bg-slate-900 text-rose-300">Rejected / Closed</option>
                          </select>
                        </div>

                        {/* WhatsApp Customer Button */}
                        {customerWhatsAppUrl && (
                          <a
                            href={customerWhatsAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                            title="Chat directly with customer on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}

                        {/* Email Customer Button */}
                        <a
                          href={customerEmailUrl}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs font-mono flex items-center gap-1.5 border border-cyan-500/20 transition-all cursor-pointer"
                          title="Open pre-filled email to customer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Customer</span>
                        </a>

                        {/* Issue Quotation Button */}
                        <button
                          onClick={() => {
                            setSelectedRequestForQuote(req);
                            setQuoteScope(`Architecture engineering, responsive UI, database schema, server API, and full source code deliverable for "${req.projectTitle}".`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>Issue Quotation</span>
                        </button>
                      </div>
                    </div>

                    {/* Complete Project Idea */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200 space-y-1">
                      <p className="font-mono text-cyan-400 font-semibold text-[11px] uppercase">
                        Client Concept & Requirements:
                      </p>
                      <p className="whitespace-pre-line leading-relaxed text-slate-300">
                        {req.projectDescription}
                      </p>
                    </div>

                    {/* Features & Requirements Breakdown */}
                    {req.features && req.features.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5 text-xs">
                        <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                          Must-Have Features:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {req.features.map((f, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-mono text-[11px] border border-white/5">
                              • {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <p className="text-[10px] uppercase font-mono text-slate-500">Platform(s)</p>
                        <p className="text-slate-200 font-medium mt-0.5">{req.platforms.join(', ')}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <p className="text-[10px] uppercase font-mono text-slate-500">Budget Range</p>
                        <p className="text-emerald-400 font-mono font-bold mt-0.5">{req.budget || 'Open / Discussion'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <p className="text-[10px] uppercase font-mono text-slate-500">Target Timeline</p>
                        <p className="text-cyan-300 font-medium mt-0.5">{req.timeline || 'Flexible'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <p className="text-[10px] uppercase font-mono text-slate-500">Additional Notes</p>
                        <p className="text-slate-300 mt-0.5 truncate">{req.additionalInfo || 'None'}</p>
                      </div>
                    </div>

                    {/* If Quotation Issued */}
                    {quo && (
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-mono text-emerald-400 font-bold">
                            ACTIVE QUOTATION: {quo.id}
                          </span>
                          <span className="font-mono font-bold text-white">
                            PKR {quo.quotationAmount?.toLocaleString()} ({quo.estimatedDays} Days Delivery)
                          </span>
                        </div>
                        <p className="text-slate-300">{quo.scope}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENT GATEWAYS MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Payment Gateways & Instructions</h2>
              <p className="text-xs text-slate-400">Configure bank accounts, JazzCash, Easypaisa, and crypto addresses shown to customers.</p>
            </div>
            <button
              onClick={() => {
                setEditingPaymentMethod({
                  name: '',
                  type: 'bank',
                  accountTitle: settings.developerName,
                  accountNumber: '',
                  iban: '',
                  instructions: 'Please transfer the exact amount and save the transaction screenshot.',
                  active: true
                });
                setIsPaymentModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Payment Gateway</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
                  pm.active ? 'bg-[#090d16] border-white/10' : 'bg-slate-950/60 border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-white">{pm.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      pm.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'
                    }`}>
                      {pm.active ? 'ACTIVE IN CHECKOUT' : 'DISABLED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1 font-mono text-xs">
                    <p className="text-slate-400 text-[10px]">Title: <strong className="text-white">{pm.accountTitle}</strong></p>
                    <p className="text-cyan-300 font-bold">Acc / ID: {pm.accountNumber}</p>
                    {pm.iban && <p className="text-slate-400 text-[10px]">IBAN: {pm.iban}</p>}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{pm.instructions}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPaymentMethod(pm);
                      setIsPaymentModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Gateway</span>
                  </button>

                  <button
                    onClick={() => deletePaymentMethod(pm.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & BRANDING */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-[#090d16] border border-white/10 space-y-6 max-w-4xl animate-in fade-in">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Platform Identity & Brand Configurations</h2>
              <p className="text-xs text-slate-400">Updates live across user landing page, certificates, invoices, and contact routes.</p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Developer Full Name</label>
              <input
                type="text"
                value={settingsForm.developerName}
                onChange={(e) => setSettingsForm({ ...settingsForm, developerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Brand Name / Studio</label>
              <input
                type="text"
                value={settingsForm.brandName}
                onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Developer Title</label>
              <input
                type="text"
                value={settingsForm.developerTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, developerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settingsForm.whatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Telegram Username</label>
              <input
                type="text"
                value={settingsForm.telegram}
                onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Years Experience</label>
              <input
                type="number"
                value={settingsForm.yearsExperience}
                onChange={(e) => setSettingsForm({ ...settingsForm, yearsExperience: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Authorized Developer Signature URL</label>
            <input
              type="text"
              value={settingsForm.signatureUrl}
              onChange={(e) => setSettingsForm({ ...settingsForm, signatureUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4 text-black" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL 1: INSPECT PAYMENT PROOF & APPROVE/REJECT */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[95vh] overflow-y-auto text-left">
            <button
              onClick={() => setInspectingOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                PAYMENT PROOF VERIFICATION AUDIT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
                {inspectingOrder.id} • {inspectingOrder.productName}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Attached Screenshot Proof */}
              <div className="md:col-span-6 space-y-2">
                <label className="block text-xs font-mono text-slate-300">Customer Attached Payment Proof:</label>
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-white/10 p-2">
                  {inspectingOrder.paymentProofUrl ? (
                    <img
                      src={inspectingOrder.paymentProofUrl}
                      alt="Payment proof screenshot"
                      className="w-full max-h-80 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="py-20 text-center text-xs text-slate-500 font-mono">
                      No screenshot attachment found.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Transaction Verification Details & Actions */}
              <div className="md:col-span-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2.5 font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Transaction TRX ID:</span>
                    <p className="text-sm font-bold text-cyan-300 select-all">{inspectingOrder.transactionId}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Billed Customer:</span>
                    <p className="text-slate-200 font-bold">{inspectingOrder.customerName} ({inspectingOrder.customerEmail})</p>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Amount & Method:</span>
                    <p className="text-emerald-400 font-bold">PKR {inspectingOrder.amount?.toLocaleString()} via {inspectingOrder.paymentMethodName}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Purchase Tier:</span>
                    <p className="text-white capitalize">{inspectingOrder.purchaseType === 'source_code' ? 'Full Source Code License' : 'Software / APK Binary'}</p>
                  </div>

                  {inspectingOrder.customerNote && (
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase">Customer Notes:</span>
                      <p className="text-slate-300">{inspectingOrder.customerNote}</p>
                    </div>
                  )}
                </div>

                {/* Audit Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleApproveOrder(inspectingOrder)}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Approve Payment & Unlock Customer Vault</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRejectionModalOpen(true)}
                      className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Proof</span>
                    </button>

                    <button
                      onClick={() => onOpenInvoice(inspectingOrder.id)}
                      className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Print Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#090d16] border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <h3 className="font-bold text-white text-base font-mono flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <span>Specify Payment Rejection Reason</span>
            </h3>
            <p className="text-xs text-slate-400">
              This message will be shown directly on the customer's tracking screen to guide correction.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Transaction ID was not found on Bank ledger. Please re-send screenshot or check TRX ID."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-rose-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectOrder}
                className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs font-mono cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRODUCT EDITOR MODAL */}
      {isProductModalOpen && editingProduct && (
        <ProductEditorModal
          product={editingProduct}
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProductData}
        />
      )}

      {/* MODAL 3: QUOTATION SENDER MODAL */}
      {selectedRequestForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[95vh] overflow-y-auto text-left">
            <button
              onClick={() => setSelectedRequestForQuote(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white font-mono mb-2">
              Dispatch Official Quotation
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              For: <strong className="text-white">{selectedRequestForQuote.projectTitle}</strong> (Client: {selectedRequestForQuote.customerName})
            </p>

            <form onSubmit={handleSendQuotationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Quotation Total (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Estimated Days</label>
                  <input
                    type="number"
                    required
                    value={quoteDays}
                    onChange={(e) => setQuoteDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Proposed Architectural Scope</label>
                <textarea
                  rows={4}
                  required
                  value={quoteScope}
                  onChange={(e) => setQuoteScope(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Milestone Payment Terms</label>
                <input
                  type="text"
                  value={quoteTerms}
                  onChange={(e) => setQuoteTerms(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestForQuote(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-black font-extrabold text-xs font-mono cursor-pointer"
                >
                  Generate & Record Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PAYMENT METHOD EDITOR MODAL */}
      {isPaymentModalOpen && editingPaymentMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#090d16] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-white text-base font-mono">
              {editingPaymentMethod.id ? 'Edit Gateway' : 'Add Payment Gateway'}
            </h3>

            <form onSubmit={handleSavePaymentMethod} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Gateway Name *</label>
                <input
                  type="text"
                  required
                  value={editingPaymentMethod.name || ''}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, name: e.target.value })}
                  placeholder="e.g. JazzCash Direct"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Account Title</label>
                <input
                  type="text"
                  value={editingPaymentMethod.accountTitle || ''}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, accountTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Account Number / IBAN *</label>
                <input
                  type="text"
                  required
                  value={editingPaymentMethod.accountNumber || ''}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Instructions for Buyer</label>
                <textarea
                  rows={2}
                  value={editingPaymentMethod.instructions || ''}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingPaymentMethod.active ?? true}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, active: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="activeCheck" className="text-xs font-mono text-slate-300">
                  Active in Checkout
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono cursor-pointer"
                >
                  Save Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
