import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  PortfolioProject,
  PaymentMethod,
  Order,
  CustomRequest,
  Quotation,
  SiteSettings,
  OrderStatus,
  PurchaseType,
  CertificateData,
  InvoiceData
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
  onSnapshot
} from 'firebase/firestore';
import JSZip from 'jszip';

export interface AdminSession {
  token: string;
  email: string;
  expiresAt?: number;
}

interface AppContextType {
  settings: SiteSettings;
  products: Product[];
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
  deleteProduct: (id: string) => Promise<void>;
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

// Check and purge any legacy dummy marketplace or project data from localStorage
try {
  const cachedProducts = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'products');
  if (cachedProducts) {
    const parsed = JSON.parse(cachedProducts);
    const isDummy = Array.isArray(parsed) && parsed.some((p: any) =>
      !p.id?.startsWith('prod-real-') && !p.id?.startsWith('prod-') ||
      p.id?.startsWith('prod-pos-') ||
      p.id?.startsWith('prod-gym-') ||
      p.id?.startsWith('prod-streaming-') ||
      p.id?.startsWith('prod-whatsapp-') ||
      p.id?.startsWith('prod-crypto-') ||
      p.id?.startsWith('prod-school-') ||
      p.name?.includes('POS') ||
      p.name?.includes('Gym') ||
      p.name?.includes('Aura Stream') ||
      p.name?.includes('NexusBot') ||
      p.name?.includes('ApexTrader') ||
      p.name?.includes('EduMaster')
    );
    if (isDummy) {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'products');
    }
  }

  const cachedSettings = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'settings');
  if (cachedSettings) {
    try {
      const parsed = JSON.parse(cachedSettings);
      if (parsed.yearsExperience === 6 || !parsed.yearsExperience) {
        parsed.yearsExperience = 2;
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  }
} catch {
  // ignore
}

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
  // Products start as strictly empty and are loaded ONLY dynamically from real Firestore documents
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadFromLocal('paymentMethods', INITIAL_PAYMENT_METHODS));
  const [orders, setOrders] = useState<Order[]>(() => loadFromLocal('orders', INITIAL_ORDERS));
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>(() => loadFromLocal('customRequests', INITIAL_CUSTOM_REQUESTS));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadFromLocal('quotations', []));
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
  useEffect(() => saveToLocal('paymentMethods', paymentMethods), [paymentMethods]);
  useEffect(() => saveToLocal('orders', orders), [orders]);
  useEffect(() => saveToLocal('customRequests', customRequests), [customRequests]);
  useEffect(() => saveToLocal('quotations', quotations), [quotations]);

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
        // Invalidate stale session
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
      // Products listener - Real Firestore collection
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
            // Delete actual dummy Firestore documents if they ever existed in database
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

      return () => {
        unsubProducts();
        unsubProjects();
        unsubPM();
        unsubOrders();
        unsubReqs();
      };
    } catch {
      // Offline mode
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
        error: data.message || 'Invalid admin credentials'
      };
    } catch {
      return {
        success: false,
        error: 'Invalid admin credentials'
      };
    }
  };

  const adminLogout = async () => {
    try {
      if (adminSession?.token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminSession.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: adminSession.token })
        }).catch(() => {});
      }
    } catch {
      // ignore
    } finally {
      try {
        sessionStorage.removeItem('affy_admin_session_token');
        sessionStorage.removeItem('affy_admin_session_email');
      } catch {
        // ignore
      }
      setAdminSession(null);
    }
  };

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setProducts(prev => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (e) {
      console.warn('Firestore setDoc fallback:', e);
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

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore deleteDoc fallback:', e);
    }
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

  // Create Order Flow
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
  }): Promise<Order> => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AFFY-ORD-${randomCode}`;
    const invoiceId = `AFFY-INV-${randomCode}`;
    const certificateId = `AFFY-CERT-${randomCode}`;
    const now = new Date().toISOString();

    const product = products.find(p => p.id === data.productId);
    const downloadUrl = data.purchaseType === 'source_code' ? product?.sourceZipUrl : product?.apkUrl;
    const downloadName = data.purchaseType === 'source_code' ? `${product?.name.replace(/\s+/g, '_')}_Source_v${product?.version || '1.0'}.zip` : `${product?.name.replace(/\s+/g, '_')}_v${product?.version || '1.0'}.apk`;

    const newOrder: Order = {
      id: orderId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerNote: data.customerNote,
      productId: data.productId,
      productName: data.productName,
      purchaseType: data.purchaseType,
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
    // Link to request
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

  // Standalone ZIP Exporter for Unified Master Package & Standalone Panels
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
        deleteProduct,
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
