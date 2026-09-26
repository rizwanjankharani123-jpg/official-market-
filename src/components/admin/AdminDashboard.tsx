import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Order,
  Product,
  ProductBundle,
  MarketplaceAnnouncement,
  CustomRequest,
  PaymentMethod,
  OrderStatus,
  RequestStatus,
  PersonalizedDeal,
  CampaignEvent,
  GiveawayRecord
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ProductEditorModal } from './ProductEditorModal';
import { BundleEditorModal } from './BundleEditorModal';
import { VersionReleaseModal } from './VersionReleaseModal';
import { AnnouncementEditorModal } from './AnnouncementEditorModal';
import { DealEditorModal } from './DealEditorModal';
import { CampaignEditorModal } from './CampaignEditorModal';
import { GiveawayEditorModal } from './GiveawayEditorModal';
import {
  generateCustomerWhatsAppChatUrl,
  generateCustomerEmailUrl,
  OFFICIAL_WHATSAPP_NUMBER,
  OFFICIAL_EMAIL
} from '../../utils/notifications';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
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
  Globe,
  Bell,
  RotateCw,
  Coins,
  Send,
  Gift,
  Tag,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenInvoice: (orderId: string) => void;
  onOpenCertificate: (orderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenInvoice,
  onOpenCertificate
}) => {
  const {
    orders,
    products,
    bundles,
    announcements,
    customRequests,
    quotations,
    paymentMethods,
    settings,
    deals,
    campaigns,
    giveaways,
    adminSession,
    updateOrderStatus,
    addProduct,
    updateProduct,
    publishProductVersion,
    deleteProduct,
    addBundle,
    updateBundle,
    deleteBundle,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addDeal,
    updateDeal,
    deleteDeal,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addGiveaway,
    updateGiveaway,
    deleteGiveaway,
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

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'bundles' | 'announcements' | 'custom-requests' | 'deals' | 'campaigns' | 'giveaways' | 'payments' | 'settings'
  >('overview');

  // Filter states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Request filter states
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestSearch, setRequestSearch] = useState<string>('');

  // Selected order for proof inspection & approval modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Product editor modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Bundle editor modal state
  const [editingBundle, setEditingBundle] = useState<Partial<ProductBundle> | null>(null);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);

  // Version Release modal state
  const [versioningProduct, setVersioningProduct] = useState<Product | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Announcement editor modal state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<MarketplaceAnnouncement> | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Deal editor modal state
  const [editingDeal, setEditingDeal] = useState<Partial<PersonalizedDeal> | null>(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  // Campaign editor modal state
  const [editingCampaign, setEditingCampaign] = useState<Partial<CampaignEvent> | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Giveaway editor modal state
  const [editingGiveaway, setEditingGiveaway] = useState<Partial<GiveawayRecord> | null>(null);
  const [isGiveawayModalOpen, setIsGiveawayModalOpen] = useState(false);

  // Editing request state for status and estimated price
  const [editingRequest, setEditingRequest] = useState<CustomRequest | null>(null);
  const [newRequestStatus, setNewRequestStatus] = useState<RequestStatus>('Reviewing');
  const [requestAdminNotes, setRequestAdminNotes] = useState<string>('');

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
  const freeProductsCount = products.filter(p => p.pricingType === 'free' || p.price === 0).length;
  const paidProductsCount = products.filter(p => p.pricingType !== 'free' && p.price > 0).length;
  const featuredProductsCount = products.filter(p => p.featured).length;

  // Real Product Aggregated Statistics
  const totalProductViews = products.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalProductDownloads = products.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

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
    const isFree = productData.pricingType === 'free';
    if (productData.id) {
      await updateProduct(productData.id, {
        ...productData,
        pricingType: isFree ? 'free' : 'paid',
        price: isFree ? 0 : (Number(productData.price) || 0),
        currency: 'PKR'
      });
    } else {
      await addProduct({
        name: productData.name || 'New Software Release',
        shortDescription: productData.shortDescription || '',
        fullDescription: productData.fullDescription || '',
        aboutSoftware: productData.aboutSoftware,
        aboutSource: productData.aboutSource,
        category: productData.category || 'Android App',
        version: productData.version || 'v1.0.0',
        pricingType: isFree ? 'free' : 'paid',
        price: isFree ? 0 : (Number(productData.price) || 0),
        currency: 'PKR',
        demoImages: productData.demoImages?.length ? productData.demoImages : ['https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'],
        features: productData.features || ['Native Performance', 'Offline Support'],
        requirements: productData.requirements || ['Android 8.0+ / Web'],
        includedFiles: productData.includedFiles || ['APK Binary', 'User Guide'],
        apkUrl: productData.apkUrl,
        apkSize: productData.apkSize,
        sourceAvailable: Boolean(productData.sourceAvailable),
        sourcePrice: Number(productData.sourcePrice) || 0,
        sourceZipUrl: productData.sourceZipUrl,
        sourceSize: productData.sourceSize,
        techStack: productData.techStack || ['Kotlin', 'TypeScript'],
        licenseType: productData.licenseType || 'Standard Commercial',
        licenseTerms: productData.licenseTerms || 'Full commercial deployment rights included.',
        commercialUseAllowed: productData.commercialUseAllowed ?? true,
        redistributionAllowed: productData.redistributionAllowed ?? false,
        resaleAllowed: productData.resaleAllowed ?? false,
        modificationAllowed: productData.modificationAllowed ?? true,
        supportTerms: productData.supportTerms || 'Direct developer technical assistance included.',
        status: productData.status || 'published',
        featured: Boolean(productData.featured)
      });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveBundleData = async (bundleData: Partial<ProductBundle>) => {
    if (bundleData.id) {
      await updateBundle(bundleData.id, bundleData);
    } else {
      await addBundle({
        name: bundleData.name || 'New Suite Bundle',
        shortDescription: bundleData.shortDescription || '',
        fullDescription: bundleData.fullDescription || '',
        image: bundleData.image || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
        productIds: bundleData.productIds || [],
        price: Number(bundleData.price) || 5000,
        currency: 'PKR',
        status: bundleData.status || 'published',
        featured: bundleData.featured
      });
    }
    setIsBundleModalOpen(false);
    setEditingBundle(null);
  };

  const handleSaveAnnouncementData = async (data: Partial<MarketplaceAnnouncement>) => {
    if (data.id) {
      await updateAnnouncement(data.id, data);
    } else {
      await addAnnouncement({
        title: data.title || '',
        shortDescription: data.shortDescription || data.message || '',
        fullContent: data.fullContent || data.message || '',
        message: data.message || data.shortDescription || data.title || '',
        image: data.image || '',
        announcementType: data.announcementType || data.type || 'General AFFY OFFICIAL Update',
        type: data.type || data.announcementType || 'general',
        relatedProductId: data.relatedProductId || data.productId || '',
        productId: data.productId || data.relatedProductId || '',
        linkView: data.linkView || 'software',
        status: data.status || (data.active !== false ? 'published' : 'draft'),
        active: data.active ?? true,
        publishedAt: data.publishedAt || new Date().toISOString()
      });
    }
    setIsAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSaveDealData = async (data: Partial<PersonalizedDeal>) => {
    if (data.id) {
      await updateDeal(data.id, data);
    } else {
      await addDeal({
        offerName: data.offerName || 'Special Customer Deal',
        description: data.description || '',
        eligibleCategories: data.eligibleCategories || [],
        eligibleProductIds: data.eligibleProductIds || [],
        discountType: data.discountType || 'percentage',
        discountValue: Number(data.discountValue) || 15,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: data.active ?? true,
        eligibilityCondition: data.eligibilityCondition || 'all_customers',
        minOrdersCount: data.minOrdersCount,
        targetCategory: data.targetCategory,
        promoCode: data.promoCode,
        bannerUrl: data.bannerUrl
      });
    }
    setIsDealModalOpen(false);
    setEditingDeal(null);
  };

  const handleSaveCampaignData = async (data: Partial<CampaignEvent>) => {
    if (data.id) {
      await updateCampaign(data.id, data);
    } else {
      await addCampaign({
        campaignName: data.campaignName || 'Seasonal Campaign',
        title: data.title || 'Marketplace Event',
        description: data.description || '',
        bannerImage: data.bannerImage || '',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        featuredProductIds: data.featuredProductIds || [],
        discountPercentage: data.discountPercentage,
        offerDescription: data.offerDescription,
        giveawayId: data.giveawayId,
        status: data.status || 'live'
      });
    }
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  const handleSaveGiveawayData = async (data: Partial<GiveawayRecord>) => {
    if (data.id) {
      await updateGiveaway(data.id, data);
    } else {
      await addGiveaway({
        title: data.title || 'Official Software Giveaway',
        description: data.description || '',
        relatedProductId: data.relatedProductId,
        prizeDescription: data.prizeDescription || 'Full Commercial License',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: data.status || 'active',
        winnerName: data.winnerName,
        winnerEmailMasked: data.winnerEmailMasked,
        winnerCity: data.winnerCity,
        winnerAnnouncedAt: data.winnerAnnouncedAt,
        proofImageUrl: data.proofImageUrl,
        adminNotes: data.adminNotes,
        published: data.published ?? false
      });
    }
    setIsGiveawayModalOpen(false);
    setEditingGiveaway(null);
  };

  const handleUpdateRequestStatus = async (requestId: string, status: RequestStatus, notes?: string) => {
    await updateCustomRequestStatus(requestId, status, notes);
    setEditingRequest(null);
  };

  const handleSendQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForQuote) return;

    await createQuotation({
      requestId: selectedRequestForQuote.id,
      customerName: selectedRequestForQuote.customerName,
      customerEmail: selectedRequestForQuote.customerEmail,
      projectTitle: selectedRequestForQuote.projectTitle,
      scope: quoteScope,
      quotationAmount: quoteAmount,
      currency: 'PKR',
      estimatedDays: quoteDays,
      deliverables: ['Full Source Code Repository', 'Database Migration Scripts', 'Production Deployment & Hosting Guide', '1 Month Direct Bug-Fix Warranty'],
      paymentTerms: quoteTerms,
      status: 'sent',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    });

    setSelectedRequestForQuote(null);
    setQuoteScope('');
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaymentMethod) return;

    if (editingPaymentMethod.id) {
      await updatePaymentMethod(editingPaymentMethod.id, editingPaymentMethod);
    } else {
      await addPaymentMethod({
        name: editingPaymentMethod.name || 'New Gateway',
        type: editingPaymentMethod.type || 'easypaisa',
        accountTitle: editingPaymentMethod.accountTitle || settings.developerName,
        accountNumber: editingPaymentMethod.accountNumber || '',
        instructions: editingPaymentMethod.instructions || 'Transfer exact total and submit TRX ID.',
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
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Admin Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-mono tracking-tight">AFFY Control Terminal</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                ● LIVE CMS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Signed in as: <span className="text-cyan-300">{adminSession?.email || 'admin@affyofficial.dev'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Public Store</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
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
          onClick={() => setActiveTab('bundles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'bundles'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bundles 📦 ({bundles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications 🔔 ({announcements.length})</span>
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
          <span>Project & Software Requests</span>
          {pendingCustomRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-black font-bold text-[10px]">
              {pendingCustomRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'deals'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Personalized Deals 🎯 ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'campaigns'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Campaigns & Events 🗓️ ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('giveaways')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'giveaways'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Giveaways & Archive 🏆 ({giveaways.length})</span>
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
          <span>Gateways ({paymentMethods.length})</span>
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
          <span>Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Total Verified Sales</p>
              <p className="text-3xl font-black text-emerald-400 font-mono">
                PKR {totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">{verifiedOrders.length} Confirmed Purchases</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Pending Proof Audits</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{pendingAudits.length}</p>
              <p className="text-[11px] text-slate-400 font-mono">Awaiting Manual Verification</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Active Catalog Products</p>
              <p className="text-3xl font-black text-white font-mono">{products.length}</p>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                <span className="text-emerald-400 font-semibold">Free: {freeProductsCount}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-300 font-semibold">Paid: {paidProductsCount}</span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400">Active Bundles & Suites</p>
              <p className="text-3xl font-black text-indigo-400 font-mono">{bundles.length}</p>
              <p className="text-[11px] text-slate-400 font-mono">{announcements.length} Notifications Broadcast</p>
            </div>
          </div>

          {/* Real Marketplace Product Activity Totals */}
          <div className="p-6 rounded-3xl bg-[#090d16] border border-white/10 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>Real Product Activity Totals (Firestore Derived)</span>
                </h3>
                <p className="text-xs text-slate-400">Live statistics computed from real database impressions, downloads, and verified orders.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Total Views</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white">{totalProductViews}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Total Downloads</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white">{totalProductDownloads}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Total Sold</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white">{verifiedOrders.length}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Total Pending</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white">{pendingAudits.length}</p>
              </div>
            </div>
          </div>

          {/* Pending Proofs Quick Audit Section */}
          {pendingAudits.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base font-mono">
                    Urgent: Payment Proofs Awaiting Verification ({pendingAudits.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
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
        </div>
      )}

      {/* TAB 2: ORDERS & PROOFS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in text-left">
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
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="proof_submitted">Proof Submitted</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="payment_rejected">Payment Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl bg-[#090d16] border border-white/10 shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Product / Bundle</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Gateway & TRX</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5">
                      <td className="py-3 px-3 text-cyan-300 font-bold">{o.id}</td>
                      <td className="py-3 px-3 text-slate-200">
                        {o.productName}
                        {o.purchaseType === 'bundle' && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                            BUNDLE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{o.customerName} ({o.customerEmail})</td>
                      <td className="py-3 px-3 text-white font-bold">PKR {o.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-300">
                        {o.paymentMethodName} <span className="text-slate-500">•</span> {o.transactionId}
                      </td>
                      <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => setInspectingOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/30 cursor-pointer"
                        >
                          Audit Proof
                        </button>
                        <button
                          onClick={() => onOpenInvoice(o.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                          title="Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CATALOG CRUD & VERSION MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Product & Source Catalog CMS</h2>
              <p className="text-xs text-slate-400">Create, configure, update versions, and release Software packages.</p>
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
                  featured: false
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
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={p.demoImages[0] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30 font-semibold">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/90 text-black font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20">
                            ⭐ Featured
                          </span>
                        )}
                        {p.pricingType === 'free' || p.price === 0 ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 font-bold">
                            FREE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 font-semibold">
                            PAID
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                        {p.version}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white line-clamp-1">{p.name}</h3>
                        <button
                          type="button"
                          onClick={() => updateProduct(p.id, { status: p.status === 'published' ? 'draft' : 'published' })}
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer font-bold ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
                          }`}
                          title={`Status: ${p.status} (Click to toggle)`}
                        >
                          {p.status === 'published' ? '● Published' : '○ Draft'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>

                      {/* Real-time Product Stats */}
                      {(() => {
                        const stats = getProductSalesStats(p.id);
                        return (
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono p-2.5 rounded-xl bg-slate-950 border border-white/5">
                            <div className="flex items-center gap-1.5 text-cyan-400">
                              <Eye className="w-3 h-3 text-cyan-400" />
                              <span className="text-slate-400">Views:</span>
                              <strong className="text-white font-bold">{p.viewsCount || 0}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <DownloadCloud className="w-3 h-3 text-emerald-400" />
                              <span className="text-slate-400">Downloads:</span>
                              <strong className="text-white font-bold">{p.downloadsCount || 0}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <ShoppingCart className="w-3 h-3 text-emerald-400" />
                              <span className="text-slate-400">Sold:</span>
                              <strong className="text-white font-bold">{stats.sold}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span className="text-slate-400">Pending:</span>
                              <strong className="text-white font-bold">{stats.pending}</strong>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/5 mt-auto space-y-2">
                    {/* Version Update Trigger Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setVersioningProduct(p);
                        setIsVersionModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Deploy New Version Update</span>
                    </button>

                    <div className="flex justify-between items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono flex items-center justify-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit</span>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUCT BUNDLES CMS */}
      {activeTab === 'bundles' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Product Bundles & Software Suites CMS</h2>
              <p className="text-xs text-slate-400">Package multiple catalog apps together with discounted bundle pricing.</p>
            </div>
            <button
              onClick={() => {
                setEditingBundle({
                  name: '',
                  shortDescription: '',
                  fullDescription: '',
                  image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
                  productIds: products.slice(0, 2).map(p => p.id),
                  price: 4999,
                  currency: 'PKR',
                  status: 'published'
                });
                setIsBundleModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product Bundle</span>
            </button>
          </div>

          {bundles.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No bundles created yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "Create Product Bundle" to package existing software releases into a discounted suite.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => {
                const includedProds = products.filter(p => bundle.productIds.includes(p.id));
                const individualTotal = includedProds.reduce((sum, p) => sum + (p.price || 0), 0);

                return (
                  <div
                    key={bundle.id}
                    className="rounded-3xl bg-[#090d16] border border-indigo-500/30 p-6 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                          {bundle.productIds.length} APPS INCLUDED
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${bundle.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {bundle.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{bundle.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{bundle.shortDescription}</p>

                      <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                        <p className="text-[10px] font-mono uppercase text-slate-500">Included Products:</p>
                        <div className="space-y-0.5">
                          {includedProds.map(p => (
                            <p key={p.id} className="text-xs font-mono text-slate-300 truncate">
                              • {p.name} (PKR {p.price.toLocaleString()})
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between font-mono">
                        <div>
                          <p className="text-[10px] text-slate-500">Combined Value</p>
                          <p className="text-xs text-slate-400 line-through">PKR {individualTotal.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-indigo-400 font-bold">Bundle Price</p>
                          <p className="text-xl font-bold text-white">PKR {bundle.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBundle(bundle);
                          setIsBundleModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Bundle</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete bundle "${bundle.name}"?`)) {
                            deleteBundle(bundle.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS & NOTIFICATIONS CMS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Marketplace Announcement & Notification Broadcaster</h2>
              <p className="text-xs text-slate-400">Broadcast official developer bulletins for new releases, updates, free apps, deals, and giveaways.</p>
            </div>
            <button
              onClick={() => {
                setEditingAnnouncement({
                  title: '',
                  shortDescription: '',
                  fullContent: '',
                  message: '',
                  image: '',
                  announcementType: 'General AFFY OFFICIAL Update',
                  type: 'general',
                  linkView: 'software',
                  status: 'published',
                  active: true
                });
                setIsAnnouncementModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create Announcement</span>
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Bell className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No announcements broadcast yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Announcements appear in the top notification bell and the dedicated bulletins section on the visitor storefront.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => {
                const relProduct = products.find((p) => p.id === (ann.relatedProductId || ann.productId));
                const isPub = ann.status === 'published' && ann.active !== false;

                return (
                  <div
                    key={ann.id}
                    className="p-5 rounded-2xl bg-[#090d16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                          {ann.announcementType || ann.type || 'General'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isPub ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {isPub ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(ann.publishedAt || ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base truncate">{ann.title}</h4>
                      <p className="text-xs text-slate-400 max-w-2xl line-clamp-2">
                        {ann.shortDescription || ann.message || ann.fullContent}
                      </p>
                      {relProduct && (
                        <p className="text-[11px] font-mono text-cyan-300/80">
                          Linked Product: {relProduct.name} ({relProduct.pricingType === 'free' ? 'FREE' : `PKR ${relProduct.price}`})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          updateAnnouncement(ann.id, {
                            active: !ann.active,
                            status: ann.status === 'published' ? 'draft' : 'published'
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          isPub
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500 border-white/10'
                        }`}
                      >
                        {isPub ? 'Published' : 'Draft'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingAnnouncement(ann);
                          setIsAnnouncementModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Delete announcement?')) {
                            deleteAnnouncement(ann.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SOFTWARE & CUSTOM PROJECT REQUESTS */}
      {activeTab === 'custom-requests' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Software Requests & Innovation Pipeline</h2>
              <p className="text-xs text-slate-400">Manage client software requests, feature propositions, custom projects, and quotes.</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              Total Inquiries: <strong>{customRequests.length}</strong>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1">
              {['all', 'New', 'Reviewing', 'Planned', 'In Development', 'Completed', 'Rejected/Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    requestStatusFilter === st
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Requests' : st}
                </button>
              ))}
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search requests by title, name, email..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {(() => {
            const filteredReqs = customRequests.filter((req) => {
              const status = req.status || 'New';
              const matchesFilter =
                requestStatusFilter === 'all' ||
                status.toLowerCase() === requestStatusFilter.toLowerCase() ||
                (requestStatusFilter === 'New' && (status === 'new' || status === 'submitted')) ||
                (requestStatusFilter === 'Reviewing' && (status === 'reviewing' || status === 'under_review' || status === 'contacted')) ||
                (requestStatusFilter === 'In Development' && (status === 'in_development' || status === 'in_progress')) ||
                (requestStatusFilter === 'Completed' && (status === 'completed' || status === 'accepted')) ||
                (requestStatusFilter === 'Rejected/Closed' && (status === 'rejected' || status === 'closed' || status === 'declined'));

              const term = requestSearch.toLowerCase();
              const matchesSearch =
                req.id.toLowerCase().includes(term) ||
                (req.customerName && req.customerName.toLowerCase().includes(term)) ||
                (req.name && req.name.toLowerCase().includes(term)) ||
                (req.customerEmail && req.customerEmail.toLowerCase().includes(term)) ||
                (req.projectTitle && req.projectTitle.toLowerCase().includes(term)) ||
                (req.title && req.title.toLowerCase().includes(term));

              return matchesFilter && matchesSearch;
            });

            if (filteredReqs.length === 0) {
              return (
                <div className="p-12 rounded-3xl bg-[#090d16] border border-white/5 text-center text-slate-400 text-xs font-mono">
                  No requests matching this filter.
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filteredReqs.map((req) => {
                  const quo = quotations.find((q) => q.requestId === req.id);
                  const displayTitle = req.projectTitle || req.title || 'Untitled Request';
                  const displayDesc = req.completeDescription || req.projectDescription || '';
                  const displayStatus = req.status || 'New';

                  return (
                    <div
                      key={req.id}
                      className="p-6 rounded-3xl bg-[#090d16] border border-white/10 space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-cyan-300">{req.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 uppercase font-bold">
                              {displayStatus}
                            </span>
                            {req.requestType && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 uppercase font-bold">
                                {req.requestType.replace(/_/g, ' ')}
                              </span>
                            )}
                            {(req.platform || (req.platforms && req.platforms[0])) && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                                {req.platform || (req.platforms && req.platforms[0])}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-lg mt-1">{displayTitle}</h3>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400">Budget / Timeline:</span>
                          <p className="font-bold text-emerald-400 font-mono text-xs">{req.budget} • {req.timeline}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {displayDesc}
                      </p>

                      {((req.features && req.features.length > 0) || (req.requiredFeatures && req.requiredFeatures.length > 0)) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-500">Requested Features:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(req.requiredFeatures || req.features || []).map((feat, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[11px] font-mono">
                                • {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {req.adminNotes && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs font-mono text-amber-300">
                          <strong>Admin Note:</strong> {req.adminNotes}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap gap-2 justify-between items-center border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span>Client: {req.customerName || req.name}</span>
                          <span>•</span>
                          <span>{req.customerEmail || req.email}</span>
                          {(req.customerPhone || req.whatsapp) && (
                            <>
                              <span>•</span>
                              <span>{req.customerPhone || req.whatsapp}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingRequest(req);
                              setNewRequestStatus(displayStatus);
                              setRequestAdminNotes(req.adminNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Update Status</span>
                          </button>

                          {(req.customerPhone || req.whatsapp) && (
                            <a
                              href={generateCustomerWhatsAppChatUrl(req)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setSelectedRequestForQuote(req);
                              setQuoteScope(`1. Requirements analysis and architecture specification\n2. Implementation of ${displayTitle}\n3. Production deployment & testing.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-colors cursor-pointer"
                          >
                            {quo ? 'Re-Issue Quote' : 'Issue Quote'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 7: PERSONALIZED DEALS CMS */}
      {activeTab === 'deals' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Personalized Deals & Loyalty Offers CMS</h2>
              <p className="text-xs text-slate-400">Configure real discount perks and promo codes targetable to returning buyers and specific customer segments.</p>
            </div>
            <button
              onClick={() => {
                setEditingDeal({
                  offerName: '',
                  description: '',
                  discountType: 'percentage',
                  discountValue: 20,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  active: true,
                  eligibilityCondition: 'previous_buyers'
                });
                setIsDealModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create Targeted Deal</span>
            </button>
          </div>

          {deals.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Tag className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No Personalized Deals Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Create targeted discount rules for returning customers, specific category buyers, or all visitors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-6 rounded-3xl bg-[#090d16] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                        {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `PKR ${deal.discountValue} OFF`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          deal.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {deal.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-mono">{deal.offerName}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{deal.description}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs font-mono space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase">Target Rule:</p>
                      <p className="text-cyan-300 font-semibold">{deal.eligibilityCondition.replace(/_/g, ' ')}</p>
                      {deal.promoCode && (
                        <p className="text-slate-400">Code: <strong className="text-white">{deal.promoCode}</strong></p>
                      )}
                      <p className="text-slate-500 text-[10px]">Valid: {deal.startDate} → {deal.endDate}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => updateDeal(deal.id, { active: !deal.active })}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                    >
                      {deal.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingDeal(deal);
                        setIsDealModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete deal "${deal.offerName}"?`)) {
                          deleteDeal(deal.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: CAMPAIGNS & EVENTS CMS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Seasonal Events & Promotional Campaigns CMS</h2>
              <p className="text-xs text-slate-400">Manage time-limited campaigns, featured software selections, and discount events.</p>
            </div>
            <button
              onClick={() => {
                setEditingCampaign({
                  campaignName: '',
                  title: '',
                  description: '',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  status: 'live',
                  featuredProductIds: products.slice(0, 3).map((p) => p.id),
                  discountPercentage: 20
                });
                setIsCampaignModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create Campaign</span>
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No Campaigns Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Organize seasonal sales, festival discounts, and curated developer showcases.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-6 rounded-3xl bg-[#090d16] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                        {camp.status.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {camp.featuredProductIds?.length || 0} Products
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-mono">{camp.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{camp.description}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs font-mono space-y-1">
                      <p className="text-slate-400">Dates: {camp.startDate} to {camp.endDate}</p>
                      {camp.discountPercentage && (
                        <p className="text-cyan-300 font-bold">{camp.discountPercentage}% Discount Active</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCampaign(camp);
                        setIsCampaignModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete campaign "${camp.title}"?`)) {
                          deleteCampaign(camp.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: GIVEAWAYS & WINNERS ARCHIVE CMS */}
      {activeTab === 'giveaways' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Giveaways & Public Winners Archive CMS</h2>
              <p className="text-xs text-slate-400">Create software giveaways, announce drawn winners, upload proof, and publish to the public archive.</p>
            </div>
            <button
              onClick={() => {
                setEditingGiveaway({
                  title: '',
                  description: '',
                  prizeDescription: 'Full Commercial License',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  status: 'active',
                  published: false
                });
                setIsGiveawayModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs font-mono flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-purple-600/20"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Giveaway</span>
            </button>
          </div>

          {giveaways.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-3">
              <Gift className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">No Giveaways Recorded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Host giveaways for your community and document verified winners permanently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {giveaways.map((gw) => (
                <div
                  key={gw.id}
                  className="p-6 rounded-3xl bg-[#090d16] border border-purple-500/30 flex flex-col justify-between space-y-4 shadow-xl text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase">
                        {gw.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          gw.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {gw.published ? 'PUBLIC ARCHIVE' : 'UNPUBLISHED'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-mono">{gw.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{gw.prizeDescription}</p>

                    {gw.winnerName ? (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs font-mono space-y-0.5">
                        <p className="text-amber-400 font-bold">🏆 Winner: {gw.winnerName}</p>
                        <p className="text-slate-400">{gw.winnerCity || 'Verified'} • {gw.winnerEmailMasked}</p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-slate-500">
                        Winner not drawn yet.
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGiveaway(gw);
                        setIsGiveawayModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit & Winners</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete giveaway "${gw.title}"?`)) {
                          deleteGiveaway(gw.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 10: PAYMENT GATEWAYS */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Payment Gateway Configuration</h2>
              <p className="text-xs text-slate-400">Manage bank accounts, EasyPaisa, JazzCash, and payment instructions.</p>
            </div>

            <button
              onClick={() => {
                setEditingPaymentMethod({
                  name: '',
                  type: 'easypaisa',
                  accountTitle: settings.developerName,
                  accountNumber: '',
                  instructions: 'Transfer exact amount and submit TRX ID screenshot.',
                  active: true
                });
                setIsPaymentModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Gateway</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base">{pm.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${pm.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {pm.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">Title: {pm.accountTitle}</p>
                <p className="text-xs font-mono text-cyan-400 font-bold">Number: {pm.accountNumber}</p>
                <p className="text-[11px] text-slate-400 whitespace-pre-line">{pm.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SETTINGS & REWARDS CONFIGURATION */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-[#090d16] border border-white/10 space-y-6 max-w-4xl animate-in fade-in text-left">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Platform Identity & Reward Configurations</h2>
              <p className="text-xs text-slate-400">Updates live across user landing page, customer rewards program, and invoices.</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-xs font-mono text-amber-400 mb-1 font-bold">Reward Points per PKR 100</label>
              <input
                type="number"
                value={settingsForm.rewardPointsPer100PKR || 1}
                onChange={(e) => setSettingsForm({ ...settingsForm, rewardPointsPer100PKR: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-mono focus:border-amber-400 focus:outline-none"
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

      {/* MODAL: INSPECT PAYMENT PROOF */}
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
                </div>

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

      {/* MODAL: PRODUCT EDITOR */}
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

      {/* MODAL: BUNDLE EDITOR */}
      {isBundleModalOpen && editingBundle && (
        <BundleEditorModal
          bundle={editingBundle}
          products={products}
          isOpen={isBundleModalOpen}
          onClose={() => {
            setIsBundleModalOpen(false);
            setEditingBundle(null);
          }}
          onSave={handleSaveBundleData}
        />
      )}

      {/* MODAL: VERSION RELEASE */}
      {isVersionModalOpen && versioningProduct && (
        <VersionReleaseModal
          product={versioningProduct}
          isOpen={isVersionModalOpen}
          onClose={() => {
            setIsVersionModalOpen(false);
            setVersioningProduct(null);
          }}
          onPublishVersion={async (pId, ver, notes, apk, src) => {
            await publishProductVersion(pId, ver, notes, apk, src);
          }}
        />
      )}

      {/* MODAL: ANNOUNCEMENT EDITOR */}
      {isAnnouncementModalOpen && editingAnnouncement && (
        <AnnouncementEditorModal
          announcement={editingAnnouncement}
          isOpen={isAnnouncementModalOpen}
          onClose={() => {
            setIsAnnouncementModalOpen(false);
            setEditingAnnouncement(null);
          }}
          onSave={handleSaveAnnouncementData}
        />
      )}

      {/* MODAL: PERSONALIZED DEAL EDITOR (Phase D3) */}
      {isDealModalOpen && editingDeal && (
        <DealEditorModal
          deal={editingDeal}
          isOpen={isDealModalOpen}
          onClose={() => {
            setIsDealModalOpen(false);
            setEditingDeal(null);
          }}
          onSave={handleSaveDealData}
        />
      )}

      {/* MODAL: CAMPAIGN & EVENT EDITOR (Phase D4) */}
      {isCampaignModalOpen && editingCampaign && (
        <CampaignEditorModal
          campaign={editingCampaign}
          isOpen={isCampaignModalOpen}
          onClose={() => {
            setIsCampaignModalOpen(false);
            setEditingCampaign(null);
          }}
          onSave={handleSaveCampaignData}
        />
      )}

      {/* MODAL: GIVEAWAY & WINNER ARCHIVE EDITOR (Phase D5) */}
      {isGiveawayModalOpen && editingGiveaway && (
        <GiveawayEditorModal
          giveaway={editingGiveaway}
          isOpen={isGiveawayModalOpen}
          onClose={() => {
            setIsGiveawayModalOpen(false);
            setEditingGiveaway(null);
          }}
          onSave={handleSaveGiveawayData}
        />
      )}

      {/* MODAL: REQUEST STATUS UPDATE (Phase D2) */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#090d16] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base font-mono">Update Request Status</h3>
              <button
                onClick={() => setEditingRequest(null)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Request: {editingRequest.id}</label>
                <p className="text-xs font-bold text-white truncate">{editingRequest.projectTitle || editingRequest.title}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Pipeline Status *</label>
                <select
                  value={newRequestStatus}
                  onChange={(e) => setNewRequestStatus(e.target.value as RequestStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="New">New (Fresh Submission)</option>
                  <option value="Reviewing">Reviewing (Technical Scope)</option>
                  <option value="Planned">Planned (Scheduled on Roadmap)</option>
                  <option value="In Development">In Development (Active Coding)</option>
                  <option value="Completed">Completed (Delivered/Live)</option>
                  <option value="Rejected/Closed">Rejected / Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Admin Notes / Progress Report</label>
                <textarea
                  value={requestAdminNotes}
                  onChange={(e) => setRequestAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal roadmap notes, quote estimates, or reason for closure..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateRequestStatus(editingRequest.id, newRequestStatus, requestAdminNotes)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUOTATION SENDER */}
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

      {/* MODAL: PAYMENT METHOD EDITOR */}
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
