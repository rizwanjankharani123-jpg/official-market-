import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductBundle,
  MarketplaceAnnouncement,
  PortfolioProject,
  PaymentMethod,
  Order,
  CustomRequest,
  Quotation,
  SiteSettings,
  OrderStatus,
  PurchaseType,
  CertificateData,
  InvoiceData,
  PersonalizedDeal,
  CampaignEvent,
  GiveawayRecord
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS
} from '../data/seedData';
import { db, auth } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment
} from 'firebase/firestore';
import JSZip from 'jszip';

export interface AdminSession {
  token: string;
  email: string;
  expiresAt?: number;
}

export interface CustomerLibraryItem {
  id: string; // Product ID or Bundle ID
  orderId: string;
  name: string;
  purchaseType: PurchaseType;
  product?: Product;
  bundle?: ProductBundle;
  purchasedVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
  releaseNotes?: string;
  downloadUrl?: string;
  downloadName?: string;
  purchaseDate: string;
}

interface AppContextType {
  settings: SiteSettings;
  products: Product[];
  bundles: ProductBundle[];
  announcements: MarketplaceAnnouncement[];
  readAnnouncementIds: string[];
  wishlist: string[];
  projects: PortfolioProject[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
  customRequests: CustomRequest[];
  quotations: Quotation[];
  activeView: string;
  setActiveView: (view: string) => void;
  // Admin & Auth
  adminSession: AdminSession | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  publishProductVersion: (id: string, newVersion: string, releaseNotes: string, apkUrl?: string, sourceZipUrl?: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  recordFreeDownload: (id: string) => Promise<void>;
  recordProductView: (id: string) => Promise<void>;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  // Bundles Actions
  addBundle: (bundleData: Omit<ProductBundle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ProductBundle>;
  updateBundle: (id: string, updates: Partial<ProductBundle>) => Promise<void>;
  deleteBundle: (id: string) => Promise<void>;
  // Announcements & In-site Notifications Actions
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  addAnnouncement: (announcement: Omit<MarketplaceAnnouncement, 'id' | 'createdAt'>) => Promise<MarketplaceAnnouncement>;
  updateAnnouncement: (id: string, updates: Partial<MarketplaceAnnouncement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  unreadAnnouncementsCount: number;
  // Phase D: Personalized Deals, Campaigns & Giveaways
  deals: PersonalizedDeal[];
  addDeal: (deal: Omit<PersonalizedDeal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PersonalizedDeal>;
  updateDeal: (id: string, updates: Partial<PersonalizedDeal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  campaigns: CampaignEvent[];
  addCampaign: (campaign: Omit<CampaignEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CampaignEvent>;
  updateCampaign: (id: string, updates: Partial<CampaignEvent>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  giveaways: GiveawayRecord[];
  addGiveaway: (giveaway: Omit<GiveawayRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<GiveawayRecord>;
  updateGiveaway: (id: string, updates: Partial<GiveawayRecord>) => Promise<void>;
  deleteGiveaway: (id: string) => Promise<void>;
  // Customer Rewards & Digital Library
  getCustomerRewards: (emailOrPhone: string) => { totalPoints: number; eligibleOrders: Order[] };
  getCustomerLibrary: (emailOrOrderId: string) => { confirmedOrders: Order[]; items: CustomerLibraryItem[] };
  // Project Actions & Dynamic Statistics
  addProject: (proj: Omit<PortfolioProject, 'id'>) => Promise<PortfolioProject>;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  completedProjectsCount: number;
  activeProjectsCount: number;
  // Payment Method Actions
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => Promise<PaymentMethod>;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  // Order Actions
  createOrder: (data: {
    productId: string;
    productName: string;
    purchaseType: PurchaseType;
    amount: number;
    currency: string;
    paymentMethodId: string;
    paymentMethodName: string;
    transactionId: string;
    paymentProofUrl?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerNote?: string;
    bundleId?: string;
    bundleName?: string;
    includedProductIds?: string[];
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, rejectionReason?: string, adminNotes?: string) => Promise<void>;
  // Custom Requests & Quotations
  submitCustomRequest: (data: Omit<CustomRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<CustomRequest>;
  createQuotation: (data: Omit<Quotation, 'id' | 'createdAt'>) => Promise<Quotation>;
  updateCustomRequestStatus: (id: string, status: CustomRequest['status'], notes?: string) => Promise<void>;
  // Site Settings
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  // Product Sales Statistics (Real-time Firestore derived)
  getProductSalesStats: (productId: string, purchaseType?: PurchaseType) => { sold: number; pending: number };
  // Generators
  getCertificateData: (orderId: string) => CertificateData | null;
  getInvoiceData: (orderId: string) => InvoiceData | null;
  // ZIP Exporter for Project A & Project B
  exportProjectZip: (target: 'package' | 'user' | 'admin') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'affy_official_';

function loadFromLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => loadFromLocal('settings', INITIAL_SETTINGS));
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<ProductBundle[]>(() => loadFromLocal('bundles', []));
  const [announcements, setAnnouncements] = useState<MarketplaceAnnouncement[]>(() => loadFromLocal('announcements', []));
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>(() => loadFromLocal('read_announcements', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadFromLocal('wishlist', []));
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadFromLocal('paymentMethods', INITIAL_PAYMENT_METHODS));
  const [orders, setOrders] = useState<Order[]>(() => loadFromLocal('orders', INITIAL_ORDERS));
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>(() => loadFromLocal('customRequests', INITIAL_CUSTOM_REQUESTS));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadFromLocal('quotations', []));
  const [deals, setDeals] = useState<PersonalizedDeal[]>(() => loadFromLocal('deals', []));
  const [campaigns, setCampaigns] = useState<CampaignEvent[]>(() => loadFromLocal('campaigns', []));
  const [giveaways, setGiveaways] = useState<GiveawayRecord[]>(() => loadFromLocal('giveaways', []));
  const [activeView, setActiveView] = useState<string>('home');
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const token = sessionStorage.getItem('affy_admin_session_token');
      const email = sessionStorage.getItem('affy_admin_session_email');
      if (token && email) {
        return { token, email };
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Keep local storage updated for persistent items
  useEffect(() => saveToLocal('settings', settings), [settings]);
  useEffect(() => saveToLocal('bundles', bundles), [bundles]);
  useEffect(() => saveToLocal('announcements', announcements), [announcements]);
  useEffect(() => saveToLocal('read_announcements', readAnnouncementIds), [readAnnouncementIds]);
  useEffect(() => saveToLocal('wishlist', wishlist), [wishlist]);
  useEffect(() => saveToLocal('paymentMethods', paymentMethods), [paymentMethods]);
  useEffect(() => saveToLocal('orders', orders), [orders]);
  useEffect(() => saveToLocal('customRequests', customRequests), [customRequests]);
  useEffect(() => saveToLocal('quotations', quotations), [quotations]);
  useEffect(() => saveToLocal('deals', deals), [deals]);
  useEffect(() => saveToLocal('campaigns', campaigns), [campaigns]);
  useEffect(() => saveToLocal('giveaways', giveaways), [giveaways]);

  // Verify stored session on boot
  useEffect(() => {
    const verifyStoredSession = async () => {
      try {
        const token = sessionStorage.getItem('affy_admin_session_token');
        if (!token) return;

        const res = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setAdminSession({ token, email: data.email, expiresAt: data.expiresAt });
            return;
          }
        }
        sessionStorage.removeItem('affy_admin_session_token');
        sessionStorage.removeItem('affy_admin_session_email');
        setAdminSession(null);
      } catch (err) {
        console.warn('Session verification error:', err);
      }
    };

    verifyStoredSession();
  }, []);

  // Sync with Firestore dynamically
  useEffect(() => {
    try {
      // Products listener
      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const realProducts: Product[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const id = docSnap.id;
          const isDummy =
            id.startsWith('prod-pos-') ||
            id.startsWith('prod-gym-') ||
            id.startsWith('prod-streaming-') ||
            id.startsWith('prod-whatsapp-') ||
            id.startsWith('prod-crypto-') ||
            id.startsWith('prod-school-') ||
            data.name === 'Apex POS - Retail Point of Sale' ||
            data.name === 'FitPulse Gym & Fitness Studio Manager' ||
            data.name === 'Aura Stream - 4K Video Player & IPTV' ||
            data.name === 'NexusBot Multi-Agent WhatsApp Automation' ||
            data.name === 'ApexTrader Crypto & Forex Quant Engine' ||
            data.name === 'EduMaster Cloud School & Academy ERP';

          if (isDummy) {
            deleteDoc(doc(db, 'products', id)).catch(() => {});
          } else {
            realProducts.push({ ...data, id } as Product);
          }
        });
        setProducts(realProducts);
      }, (err) => {
        console.warn('Firestore products listener info:', err);
        setProducts([]);
      });

      // Bundles listener
      const unsubBundles = onSnapshot(collection(db, 'bundles'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ProductBundle));
        setBundles(list);
      }, (err) => console.warn('Firestore bundles listener error:', err));

      // Announcements listener
      const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as MarketplaceAnnouncement));
        setAnnouncements(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, (err) => console.warn('Firestore announcements listener error:', err));

      // Projects listener
      const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const realProjects: PortfolioProject[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const id = docSnap.id;
          const isDummy =
            id.startsWith('proj-pos-') ||
            id.startsWith('proj-school-') ||
            id.startsWith('proj-trading-') ||
            id.startsWith('proj-gym-');

          if (isDummy) {
            deleteDoc(doc(db, 'projects', id)).catch(() => {});
          } else {
            realProjects.push({ ...data, id } as PortfolioProject);
          }
        });
        setProjects(realProjects);
      }, (err) => {
        console.warn('Firestore projects listener info:', err);
        setProjects([]);
      });

      // PaymentMethods listener
      const unsubPM = onSnapshot(collection(db, 'paymentMethods'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as PaymentMethod));
        if (list.length > 0) {
          setPaymentMethods(list);
        }
      }, (err) => console.warn('Firestore PM listener error:', err));

      // Orders listener
      const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        setOrders(list);
      }, (err) => console.warn('Firestore orders listener error:', err));

      // Custom Requests listener
      const unsubReqs = onSnapshot(collection(db, 'customRequests'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CustomRequest));
        setCustomRequests(list);
      }, (err) => console.warn('Firestore requests listener error:', err));

      // Personalized Deals listener
      const unsubDeals = onSnapshot(collection(db, 'deals'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as PersonalizedDeal));
        setDeals(list);
      }, (err) => console.warn('Firestore deals listener error:', err));

      // Campaigns listener
      const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CampaignEvent));
        setCampaigns(list);
      }, (err) => console.warn('Firestore campaigns listener error:', err));

      // Giveaways listener
      const unsubGiveaways = onSnapshot(collection(db, 'giveaways'), (snapshot) => {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as GiveawayRecord));
        setGiveaways(list);
      }, (err) => console.warn('Firestore giveaways listener error:', err));

      return () => {
        unsubProducts();
        unsubBundles();
        unsubAnnouncements();
        unsubProjects();
        unsubPM();
        unsubOrders();
        unsubReqs();
        unsubDeals();
        unsubCampaigns();
        unsubGiveaways();
      };
    } catch {
      setProducts([]);
      setProjects([]);
    }
  }, []);

  const isAdminAuthenticated = Boolean(adminSession && adminSession.token);

  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPass = pass;

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Invalid admin credentials' };
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success && data.token) {
        const session: AdminSession = {
          token: data.token,
          email: data.email,
          expiresAt: data.expiresAt
        };
        try {
          sessionStorage.setItem('affy_admin_session_token', data.token);
          sessionStorage.setItem('affy_admin_session_email', data.email);
        } catch {
          // ignore
        }
        setAdminSession(session);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Access denied: Invalid credentials.'
      };
    } catch (e: any) {
      return {
        success: false,
        error: 'Network connection failed during admin authentication.'
      };
    }
  };

  const adminLogout = async () => {
    try {
      const token = sessionStorage.getItem('affy_admin_session_token');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem('affy_admin_session_token');
      sessionStorage.removeItem('affy_admin_session_email');
      setAdminSession(null);
      setActiveView('home');
    }
  };

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const id = `prod-${Date.now()}-${randomHex}`;
    const now = new Date().toISOString();

    const newProduct: Product = {
      ...productData,
      id,
      pricingType: productData.pricingType || (productData.price === 0 ? 'free' : 'paid'),
      price: productData.pricingType === 'free' ? 0 : productData.price,
      viewsCount: 0,
      downloadsCount: 0,
      versionHistory: [
        {
          version: productData.version || 'v1.0.0',
          releaseNotes: productData.releaseNotes || 'Initial verified production release.',
          releasedAt: now,
          apkUrl: productData.apkUrl,
          sourceZipUrl: productData.sourceZipUrl
        }
      ],
      createdAt: now,
      updatedAt: now,
      publishedAt: productData.status === 'published' ? now : undefined
    };

    setProducts(prev => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (e) {
      console.warn('Firestore setDoc fallback:', e);
    }

    // Auto-create in-site announcement for new published products
    if (newProduct.status === 'published') {
      const isFree = newProduct.pricingType === 'free' || newProduct.price === 0;
      addAnnouncement({
        title: isFree ? `🆓 New Free App Released: ${newProduct.name}` : `🚀 New Software Release: ${newProduct.name}`,
        message: `${newProduct.name} (v${newProduct.version}) is now live on AFFY OFFICIAL. ${newProduct.shortDescription}`,
        type: isFree ? 'new_free_app' : 'new_product',
        productId: newProduct.id,
        linkView: isFree ? 'free-apps' : 'software',
        status: 'published',
        active: true
      }).catch(() => {});
    }

    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: now } : p)));
    try {
      await updateDoc(doc(db, 'products', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore updateDoc fallback:', e);
    }
  };

  const publishProductVersion = async (
    id: string,
    newVersion: string,
    releaseNotes: string,
    apkUrl?: string,
    sourceZipUrl?: string
  ) => {
    const now = new Date().toISOString();
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newRelease: any = {
      version: newVersion,
      releaseNotes: releaseNotes || `Version ${newVersion} update release.`,
      releasedAt: now,
      apkUrl: apkUrl || product.apkUrl,
      sourceZipUrl: sourceZipUrl || product.sourceZipUrl
    };

    const updatedHistory = [newRelease, ...(product.versionHistory || [])];

    const updates: Partial<Product> = {
      version: newVersion,
      releaseNotes,
      versionHistory: updatedHistory,
      ...(apkUrl ? { apkUrl } : {}),
      ...(sourceZipUrl ? { sourceZipUrl } : {}),
      updatedAt: now
    };

    await updateProduct(id, updates);

    // Create an update notification
    addAnnouncement({
      title: `🔄 Product Update: ${product.name} ${newVersion}`,
      message: `${product.name} has been upgraded to ${newVersion}. Existing buyers have full access in their Digital Library. Notes: ${releaseNotes}`,
      type: 'update',
      productId: id,
      linkView: 'library',
      status: 'published',
      active: true
    }).catch(() => {});
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(pId => pId !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore deleteDoc fallback:', e);
    }
  };

  const recordFreeDownload = async (id: string) => {
    if (!id) return;
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 } : p))
    );
    try {
      await updateDoc(doc(db, 'products', id), {
        downloadsCount: increment(1)
      });
    } catch (e) {
      console.warn('Firestore increment download count fallback:', e);
    }
  };

  const recordProductView = async (id: string) => {
    if (!id) return;
    const viewSessionKey = `affy_view_${id}`;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (sessionStorage.getItem(viewSessionKey)) {
          return;
        }
        sessionStorage.setItem(viewSessionKey, '1');
      }
    } catch {
      // ignore
    }

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p))
    );

    try {
      await updateDoc(doc(db, 'products', id), {
        viewsCount: increment(1)
      });
    } catch (e) {
      console.warn('Firestore increment view count fallback:', e);
    }
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    if (!productId) return;
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Bundles Actions
  const addBundle = async (bundleData: Omit<ProductBundle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductBundle> => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const id = `AFFY-BDL-${Date.now()}-${randomHex}`;
    const now = new Date().toISOString();

    const newBundle: ProductBundle = {
      ...bundleData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setBundles(prev => [newBundle, ...prev]);

    try {
      await setDoc(doc(db, 'bundles', id), newBundle);
    } catch (e) {
      console.warn('Firestore setDoc bundle fallback:', e);
    }

    if (newBundle.status === 'published') {
      addAnnouncement({
        title: `📦 New Software Bundle: ${newBundle.name}`,
        message: `${newBundle.name} is now available at a discounted bundle price of PKR ${newBundle.price.toLocaleString()}. Includes ${newBundle.productIds.length} complete software systems!`,
        type: 'deal',
        bundleId: newBundle.id,
        linkView: 'bundles',
        status: 'published',
        active: true
      }).catch(() => {});
    }

    return newBundle;
  };

  const updateBundle = async (id: string, updates: Partial<ProductBundle>) => {
    const now = new Date().toISOString();
    setBundles(prev => prev.map(b => (b.id === id ? { ...b, ...updates, updatedAt: now } : b)));
    try {
      await updateDoc(doc(db, 'bundles', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore bundle update fallback:', e);
    }
  };

  const deleteBundle = async (id: string) => {
    setBundles(prev => prev.filter(b => b.id !== id));
    try {
      await deleteDoc(doc(db, 'bundles', id));
    } catch (e) {
      console.warn('Firestore bundle delete fallback:', e);
    }
  };

  // Announcements & In-site Notification Actions
  const markAnnouncementAsRead = (id: string) => {
    setReadAnnouncementIds(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const markAllAnnouncementsAsRead = () => {
    setReadAnnouncementIds(announcements.map(a => a.id));
  };

  const addAnnouncement = async (data: Omit<MarketplaceAnnouncement, 'id' | 'createdAt'>): Promise<MarketplaceAnnouncement> => {
    const id = `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newAnn: MarketplaceAnnouncement = {
      ...data,
      id,
      createdAt: now
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    try {
      await setDoc(doc(db, 'announcements', id), newAnn);
    } catch (e) {
      console.warn('Firestore announcement setDoc fallback:', e);
    }

    return newAnn;
  };

  const updateAnnouncement = async (id: string, updates: Partial<MarketplaceAnnouncement>) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    try {
      await updateDoc(doc(db, 'announcements', id), updates);
    } catch (e) {
      console.warn('Firestore announcement update fallback:', e);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (e) {
      console.warn('Firestore announcement delete fallback:', e);
    }
  };

  const unreadAnnouncementsCount = announcements.filter(
    a => a.active && !readAnnouncementIds.includes(a.id)
  ).length;

  // Personalized Deals Actions (Phase D3)
  const addDeal = async (dealData: Omit<PersonalizedDeal, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonalizedDeal> => {
    const id = `AFFY-DEAL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newDeal: PersonalizedDeal = {
      ...dealData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setDeals(prev => [newDeal, ...prev]);
    try {
      await setDoc(doc(db, 'deals', id), newDeal);
    } catch (e) {
      console.warn('Firestore setDoc deal fallback:', e);
    }
    return newDeal;
  };

  const updateDeal = async (id: string, updates: Partial<PersonalizedDeal>) => {
    const now = new Date().toISOString();
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt: now } : d)));
    try {
      await updateDoc(doc(db, 'deals', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore update deal fallback:', e);
    }
  };

  const deleteDeal = async (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    try {
      await deleteDoc(doc(db, 'deals', id));
    } catch (e) {
      console.warn('Firestore delete deal fallback:', e);
    }
  };

  // Campaigns Actions (Phase D4)
  const addCampaign = async (campData: Omit<CampaignEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CampaignEvent> => {
    const id = `AFFY-CMP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newCamp: CampaignEvent = {
      ...campData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setCampaigns(prev => [newCamp, ...prev]);
    try {
      await setDoc(doc(db, 'campaigns', id), newCamp);
    } catch (e) {
      console.warn('Firestore setDoc campaign fallback:', e);
    }
    return newCamp;
  };

  const updateCampaign = async (id: string, updates: Partial<CampaignEvent>) => {
    const now = new Date().toISOString();
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: now } : c)));
    try {
      await updateDoc(doc(db, 'campaigns', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore update campaign fallback:', e);
    }
  };

  const deleteCampaign = async (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (e) {
      console.warn('Firestore delete campaign fallback:', e);
    }
  };

  // Giveaways Actions (Phase D5)
  const addGiveaway = async (gwData: Omit<GiveawayRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<GiveawayRecord> => {
    const id = `AFFY-GW-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newGW: GiveawayRecord = {
      ...gwData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setGiveaways(prev => [newGW, ...prev]);
    try {
      await setDoc(doc(db, 'giveaways', id), newGW);
    } catch (e) {
      console.warn('Firestore setDoc giveaway fallback:', e);
    }
    return newGW;
  };

  const updateGiveaway = async (id: string, updates: Partial<GiveawayRecord>) => {
    const now = new Date().toISOString();
    setGiveaways(prev => prev.map(g => (g.id === id ? { ...g, ...updates, updatedAt: now } : g)));
    try {
      await updateDoc(doc(db, 'giveaways', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore update giveaway fallback:', e);
    }
  };

  const deleteGiveaway = async (id: string) => {
    setGiveaways(prev => prev.filter(g => g.id !== id));
    try {
      await deleteDoc(doc(db, 'giveaways', id));
    } catch (e) {
      console.warn('Firestore delete giveaway fallback:', e);
    }
  };

  // Customer Rewards Calculation (100% Real Eligible Activity)
  const getCustomerRewards = (emailOrPhone: string) => {
    if (!emailOrPhone || !emailOrPhone.trim()) {
      return { totalPoints: 0, eligibleOrders: [] };
    }
    const clean = emailOrPhone.trim().toLowerCase();
    const eligibleOrders = orders.filter((o) => {
      const match =
        (o.customerEmail && o.customerEmail.trim().toLowerCase() === clean) ||
        (o.customerPhone && o.customerPhone.trim() === emailOrPhone.trim()) ||
        o.id.toLowerCase() === clean;

      const isVerifiedPaid = o.status === 'payment_confirmed' || o.status === 'completed';
      return match && isVerifiedPaid;
    });

    const rate = settings.rewardPointsPer100PKR || 1;
    const totalPoints = eligibleOrders.reduce((sum, order) => {
      const points = Math.floor((order.amount || 0) / 100) * rate;
      return sum + points;
    }, 0);

    return { totalPoints, eligibleOrders };
  };

  // Customer Digital Library Query Helper
  const getCustomerLibrary = (emailOrOrderId: string) => {
    if (!emailOrOrderId || !emailOrOrderId.trim()) {
      return { confirmedOrders: [], items: [] };
    }
    const clean = emailOrOrderId.trim().toLowerCase();

    // Find all confirmed orders matching email, phone, or exact Order ID
    const confirmedOrders = orders.filter((o) => {
      const match =
        (o.customerEmail && o.customerEmail.trim().toLowerCase() === clean) ||
        (o.customerPhone && o.customerPhone.trim() === emailOrOrderId.trim()) ||
        o.id.toLowerCase() === clean;

      const isConfirmed = o.status === 'payment_confirmed' || o.status === 'completed';
      return match && isConfirmed;
    });

    const items: CustomerLibraryItem[] = [];

    confirmedOrders.forEach((order) => {
      if (order.purchaseType === 'bundle' && order.bundleId) {
        const bundle = bundles.find(b => b.id === order.bundleId);
        // Include individual products from bundle
        const bundleProducts = products.filter(p => order.includedProductIds?.includes(p.id) || bundle?.productIds?.includes(p.id));

        items.push({
          id: order.bundleId,
          orderId: order.id,
          name: order.bundleName || order.productName,
          purchaseType: 'bundle',
          bundle,
          purchasedVersion: '1.0',
          latestVersion: '1.0',
          isUpdateAvailable: false,
          downloadUrl: order.downloadUrl,
          downloadName: order.downloadName,
          purchaseDate: order.confirmedAt || order.createdAt
        });

        // Also add each product item from bundle with current latest download access
        bundleProducts.forEach((p) => {
          items.push({
            id: p.id,
            orderId: order.id,
            name: `${p.name} (from ${order.bundleName || 'Bundle'})`,
            purchaseType: 'software',
            product: p,
            purchasedVersion: p.version || 'v1.0.0',
            latestVersion: p.version || 'v1.0.0',
            isUpdateAvailable: false,
            releaseNotes: p.releaseNotes,
            downloadUrl: p.apkUrl,
            downloadName: `${p.name.replace(/\s+/g, '_')}_v${p.version || '1.0'}.apk`,
            purchaseDate: order.confirmedAt || order.createdAt
          });
        });
      } else {
        const product = products.find(p => p.id === order.productId);
        const purchasedVer = order.purchasedVersion || product?.version || 'v1.0.0';
        const latestVer = product?.version || purchasedVer;
        const isUpdateAvailable = Boolean(product && latestVer && purchasedVer && latestVer !== purchasedVer);

        // Secure download URL mapping based on entitlement
        const downloadUrl = order.downloadAccessGranted
          ? (order.purchaseType === 'source_code' ? product?.sourceZipUrl || order.downloadUrl : product?.apkUrl || order.downloadUrl)
          : undefined;

        const downloadName = order.purchaseType === 'source_code'
          ? `${(product?.name || order.productName).replace(/\s+/g, '_')}_Source_v${latestVer}.zip`
          : `${(product?.name || order.productName).replace(/\s+/g, '_')}_v${latestVer}.apk`;

        items.push({
          id: order.productId,
          orderId: order.id,
          name: product?.name || order.productName,
          purchaseType: order.purchaseType,
          product,
          purchasedVersion: purchasedVer,
          latestVersion: latestVer,
          isUpdateAvailable,
          releaseNotes: product?.releaseNotes,
          downloadUrl,
          downloadName,
          purchaseDate: order.confirmedAt || order.createdAt
        });
      }
    });

    return { confirmedOrders, items };
  };

  // Portfolio Project Actions
  const addProject = async (projData: Omit<PortfolioProject, 'id'>): Promise<PortfolioProject> => {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newProj: PortfolioProject = {
      ...projData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setProjects(prev => [newProj, ...prev]);
    try {
      await setDoc(doc(db, 'projects', id), newProj);
    } catch (e) {
      console.warn('Firestore project setDoc fallback:', e);
    }
    return newProj;
  };

  const updateProject = async (id: string, updates: Partial<PortfolioProject>) => {
    const now = new Date().toISOString();
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: now } : p)));
    try {
      await updateDoc(doc(db, 'projects', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore project updateDoc fallback:', e);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      console.warn('Firestore project deleteDoc fallback:', e);
    }
  };

  // Payment Method Actions
  const addPaymentMethod = async (pmData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const id = `pm-${Date.now()}`;
    const newPM: PaymentMethod = { ...pmData, id };
    setPaymentMethods(prev => [...prev, newPM]);
    try {
      await setDoc(doc(db, 'paymentMethods', id), newPM);
    } catch (e) {
      console.warn('Firestore PM fallback:', e);
    }
    return newPM;
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => prev.map(pm => (pm.id === id ? { ...pm, ...updates } : pm)));
    try {
      await updateDoc(doc(db, 'paymentMethods', id), updates);
    } catch (e) {
      console.warn('Firestore PM update fallback:', e);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    try {
      await deleteDoc(doc(db, 'paymentMethods', id));
    } catch (e) {
      console.warn('Firestore PM delete fallback:', e);
    }
  };

  // Create Order Flow (Supports individual software, source code, and Bundles)
  const createOrder = async (data: {
    productId: string;
    productName: string;
    purchaseType: PurchaseType;
    amount: number;
    currency: string;
    paymentMethodId: string;
    paymentMethodName: string;
    transactionId: string;
    paymentProofUrl?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerNote?: string;
    bundleId?: string;
    bundleName?: string;
    includedProductIds?: string[];
  }): Promise<Order> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AFFY-ORD-${randomCode}`;
    const invoiceId = `AFFY-INV-${randomCode}`;
    const certificateId = `AFFY-CERT-${randomCode}`;
    const now = new Date().toISOString();

    const product = products.find(p => p.id === data.productId);
    const purchasedVersion = product?.version || 'v1.0.0';

    let downloadUrl = '';
    let downloadName = 'package.zip';

    if (data.purchaseType === 'source_code') {
      downloadUrl = product?.sourceZipUrl || '';
      downloadName = `${(product?.name || data.productName).replace(/\s+/g, '_')}_Source_v${purchasedVersion}.zip`;
    } else if (data.purchaseType === 'bundle') {
      downloadUrl = '';
      downloadName = `${(data.bundleName || data.productName).replace(/\s+/g, '_')}_Bundle.zip`;
    } else {
      downloadUrl = product?.apkUrl || '';
      downloadName = `${(product?.name || data.productName).replace(/\s+/g, '_')}_v${purchasedVersion}.apk`;
    }

    const rate = settings.rewardPointsPer100PKR || 1;
    const pointsEarned = Math.floor((data.amount || 0) / 100) * rate;

    const newOrder: Order = {
      id: orderId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerNote: data.customerNote,
      productId: data.productId,
      productName: data.productName,
      bundleId: data.bundleId,
      bundleName: data.bundleName,
      includedProductIds: data.includedProductIds,
      purchaseType: data.purchaseType,
      purchasedVersion,
      amount: data.amount,
      currency: data.currency,
      paymentMethodId: data.paymentMethodId,
      paymentMethodName: data.paymentMethodName,
      transactionId: data.transactionId,
      paymentProofUrl: data.paymentProofUrl,
      status: 'proof_submitted',
      downloadAccessGranted: false,
      downloadUrl: downloadUrl || '',
      downloadName: downloadName || 'package.zip',
      pointsEarned,
      invoiceId,
      certificateId,
      createdAt: now,
      updatedAt: now
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (e) {
      console.warn('Firestore order fallback:', e);
    }

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    rejectionReason?: string,
    adminNotes?: string
  ) => {
    const now = new Date().toISOString();
    const downloadAccessGranted = status === 'payment_confirmed' || status === 'completed';

    const updates: Partial<Order> = {
      status,
      updatedAt: now,
      downloadAccessGranted,
      ...(rejectionReason ? { rejectionReason } : {}),
      ...(adminNotes ? { adminNotes } : {}),
      ...(status === 'payment_confirmed' ? { confirmedAt: now } : {})
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, ...updates } : o)));

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
    } catch (e) {
      console.warn('Firestore order update fallback:', e);
    }
  };

  // Custom Requests
  const submitCustomRequest = async (data: Omit<CustomRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CustomRequest> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const id = `AFFY-REQ-${randomCode}`;
    const now = new Date().toISOString();

    const newRequest: CustomRequest = {
      ...data,
      id,
      status: 'submitted',
      createdAt: now,
      updatedAt: now
    };

    setCustomRequests(prev => [newRequest, ...prev]);

    try {
      await setDoc(doc(db, 'customRequests', id), newRequest);
    } catch (e) {
      console.warn('Firestore custom request fallback:', e);
    }

    return newRequest;
  };

  const createQuotation = async (data: Omit<Quotation, 'id' | 'createdAt'>): Promise<Quotation> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const id = `AFFY-QUO-${randomCode}`;
    const now = new Date().toISOString();

    const newQuotation: Quotation = {
      ...data,
      id,
      createdAt: now
    };

    setQuotations(prev => [newQuotation, ...prev]);
    await updateCustomRequestStatus(data.requestId, 'quoted');

    try {
      await setDoc(doc(db, 'quotations', id), newQuotation);
    } catch (e) {
      console.warn('Firestore quotation fallback:', e);
    }

    return newQuotation;
  };

  const updateCustomRequestStatus = async (id: string, status: CustomRequest['status'], notes?: string) => {
    const now = new Date().toISOString();
    const updates: Partial<CustomRequest> = {
      status,
      updatedAt: now,
      ...(notes ? { adminNotes: notes } : {})
    };
    setCustomRequests(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    try {
      await updateDoc(doc(db, 'customRequests', id), updates);
    } catch (e) {
      console.warn('Firestore request update fallback:', e);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (e) {
      console.warn('Firestore settings fallback:', e);
    }
  };

  // Certificate Generator
  const getCertificateData = (orderId: string): CertificateData | null => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const product = products.find(p => p.id === order.productId);
    const isSource = order.purchaseType === 'source_code';

    const licenseRights = isSource
      ? (product?.licenseTerms || 'Commercial deployment and customization rights for proprietary client systems. Redistribution prohibited.')
      : `Granted non-exclusive operational usage license for ${order.productName} v${product?.version || '1.0'}.`;

    return {
      id: order.certificateId,
      type: isSource ? 'source_code' : 'software',
      customerName: order.customerName,
      productName: order.productName,
      orderId: order.id,
      purchaseDate: order.confirmedAt || order.createdAt,
      certificateId: order.certificateId,
      licenseRights,
      signatureUrl: settings.signatureUrl,
      developerName: settings.developerName,
      developerTitle: settings.developerTitle,
      brandName: settings.brandName
    };
  };

  // Invoice Generator
  const getInvoiceData = (orderId: string): InvoiceData | null => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const isConfirmed = order.status === 'payment_confirmed' || order.status === 'completed';
    const isRejected = order.status === 'payment_rejected';

    return {
      id: order.invoiceId,
      orderId: order.id,
      date: order.createdAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      productName: order.productName,
      purchaseType: order.purchaseType,
      amount: order.amount,
      currency: order.currency,
      paymentMethod: order.paymentMethodName,
      transactionId: order.transactionId,
      status: isConfirmed ? 'confirmed' : isRejected ? 'rejected' : 'waiting_approval',
      terms: order.purchaseType === 'source_code' ? settings.sourceCodeTerms : settings.softwareTerms,
      developerName: settings.developerName,
      developerTitle: settings.developerTitle,
      brandName: settings.brandName,
      email: settings.email,
      phone: settings.phone
    };
  };

  // Standalone ZIP Exporter
  const exportProjectZip = async (target: 'package' | 'user' | 'admin') => {
    const { generateFullProjectPackageZip } = await import('../utils/projectPackager');
    const blob = await generateFullProjectPackageZip(target, settings);
    const fileName =
      target === 'package'
        ? 'AFFY-OFFICIAL-PACKAGE.zip'
        : target === 'user'
        ? 'AFFY-OFFICIAL-USER.zip'
        : 'AFFY-OFFICIAL-ADMIN.zip';

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedProjectsCount =
    projects.filter(p => p.status === 'completed').length +
    customRequests.filter(r => r.status === 'completed').length;

  const activeProjectsCount =
    projects.filter(p => p.status === 'active' || p.status === 'in_development').length +
    customRequests.filter(r => r.status === 'in_development' || r.status === 'in_progress' || r.status === 'new' || r.status === 'reviewing' || r.status === 'contacted' || r.status === 'quoted' || r.status === 'accepted').length;

  const getProductSalesStats = (productId: string, purchaseType?: PurchaseType): { sold: number; pending: number } => {
    if (!productId) return { sold: 0, pending: 0 };
    const relevantOrders = orders.filter((o) => {
      if (o.productId !== productId) return false;
      if (purchaseType && o.purchaseType !== purchaseType) return false;
      return true;
    });

    const sold = relevantOrders.filter(
      (o) => o.status === 'payment_confirmed' || o.status === 'completed'
    ).length;

    const pending = relevantOrders.filter(
      (o) => o.status === 'proof_submitted' || o.status === 'under_review' || o.status === 'payment_pending' || o.status === 'processing'
    ).length;

    return { sold, pending };
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        products,
        bundles,
        announcements,
        readAnnouncementIds,
        wishlist,
        projects,
        paymentMethods,
        orders,
        customRequests,
        quotations,
        activeView,
        setActiveView,
        adminSession,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        publishProductVersion,
        deleteProduct,
        recordFreeDownload,
        recordProductView,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        addBundle,
        updateBundle,
        deleteBundle,
        markAnnouncementAsRead,
        markAllAnnouncementsAsRead,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        unreadAnnouncementsCount,
        deals,
        addDeal,
        updateDeal,
        deleteDeal,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        giveaways,
        addGiveaway,
        updateGiveaway,
        deleteGiveaway,
        getCustomerRewards,
        getCustomerLibrary,
        addProject,
        updateProject,
        deleteProject,
        completedProjectsCount,
        activeProjectsCount,
        getProductSalesStats,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        createOrder,
        updateOrderStatus,
        submitCustomRequest,
        createQuotation,
        updateCustomRequestStatus,
        updateSettings,
        getCertificateData,
        getInvoiceData,
        exportProjectZip
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
