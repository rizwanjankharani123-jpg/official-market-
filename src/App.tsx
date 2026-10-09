import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Portfolio Sections
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
import { Portfolio3DWorkstation } from './components/portfolio/Portfolio3DWorkstation';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ServicesSection } from './components/portfolio/ServicesSection';
import { ContactSection } from './components/portfolio/ContactSection';

// Marketplace Views
import { FeaturedProducts } from './components/marketplace/FeaturedProducts';
import { TrendingProducts } from './components/marketplace/TrendingProducts';
import { NewReleases } from './components/marketplace/NewReleases';
import { SoftwareMarketplace } from './components/marketplace/SoftwareMarketplace';
import { FreeMarketplace } from './components/marketplace/FreeMarketplace';
import { SourceCodeMarketplace } from './components/marketplace/SourceCodeMarketplace';
import { ProductBundlesView } from './components/marketplace/ProductBundlesView';
import { WishlistView } from './components/marketplace/WishlistView';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { PurchaseModal } from './components/marketplace/PurchaseModal';

// Retention Views: Library & Rewards
import { CustomerLibraryView } from './components/library/CustomerLibraryView';
import { CustomerRewardsView } from './components/rewards/CustomerRewardsView';

// Phase D Expansion Views
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { RequestSoftwareView } from './components/requests/RequestSoftwareView';
import { PersonalizedDealsView } from './components/deals/PersonalizedDealsView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { GiveawaysView } from './components/giveaways/GiveawaysView';

// Tracking & Custom & Legal Views
import { TrackOrderView } from './components/tracking/TrackOrderView';
import { CustomProjectView } from './components/custom/CustomProjectView';
import { TermsView } from './components/legal/TermsView';

// Document Modals
import { InvoiceModal } from './components/documents/InvoiceModal';
import { CertificateModal } from './components/documents/CertificateModal';
import { OpeningAnimation } from './components/common/OpeningAnimation';
import { UserAuthModal } from './components/auth/UserAuthModal';

// Admin CMS
import { AdminLoginModal, AdminLoginForm } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, ProductBundle, PurchaseType } from './types';
import { updatePageSEO } from './utils/seo';
import { Lock, ShieldAlert, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAdminAuthenticated,
    adminSession,
    adminLogout,
    isUserAuthModalOpen,
    setIsUserAuthModalOpen
  } = useApp();
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('affy_opening_seen');
    } catch {
      return false;
    }
  });

  const handleAnimationComplete = useCallback(() => {
    try {
      sessionStorage.setItem('affy_opening_seen', 'true');
    } catch {
      // ignore
    }
    setShowOpeningAnimation(false);
  }, []);

  // Modal States
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);
  const [selectedBundleForPurchase, setSelectedBundleForPurchase] = useState<ProductBundle | null>(null);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('software');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrderId, setSelectedInvoiceOrderId] = useState<string | null>(null);
  const [selectedCertOrderId, setSelectedCertOrderId] = useState<string | null>(null);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Track order view pre-filled state
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [trackingEmail, setTrackingEmail] = useState<string>('');

  // Handle comprehensive URL route sync on boot & navigation (e.g. /admin, /ladmin, /#admin, /#ladmin, ?admin, etc.)
  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view')?.toLowerCase() || searchParams.get('page')?.toLowerCase();
      const hasAdminParam =
        searchParams.has('admin') ||
        searchParams.has('ladmin') ||
        searchParams.get('admin') === 'true' ||
        searchParams.get('admin') === '1' ||
        searchParams.get('ladmin') === 'true' ||
        searchParams.get('ladmin') === '1';

      // Check for all admin routes & secret aliases
      const isAdminRoute =
        pathname === 'admin' ||
        pathname === 'ladmin' ||
        pathname.startsWith('admin/') ||
        pathname.startsWith('ladmin/') ||
        pathname === 'affy-admin' ||
        pathname === 'admin-portal' ||
        pathname === 'secret-admin' ||
        pathname === 'adminlogin' ||
        pathname === 'login' ||
        hash === 'admin' ||
        hash === 'ladmin' ||
        hash === 'affy-admin' ||
        hash === 'adminlogin' ||
        hash === 'login' ||
        hash === 'admin-portal' ||
        viewParam === 'admin' ||
        viewParam === 'ladmin' ||
        viewParam === 'affy-admin' ||
        hasAdminParam;

      if (isAdminRoute) {
        setActiveView('admin');
        return;
      }

      // Check for public section routes
      if (hash && hash !== '') {
        setActiveView(hash);
      } else if (viewParam && viewParam !== '') {
        setActiveView(viewParam);
      } else if (pathname && pathname !== '' && pathname !== 'index.html') {
        setActiveView(pathname);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    // Fast interval check for 5 seconds to catch delayed iframe url changes
    const routeInterval = setInterval(checkRoute, 1000);

    // Global keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A or Alt+A to jump to Admin
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setActiveView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);

    // Secret custom event trigger
    const handleSecretAdminEvent = () => {
      setActiveView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('affy:open-admin', handleSecretAdminEvent);

    return () => {
      clearInterval(routeInterval);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('keydown', handleKeyShortcut);
      window.removeEventListener('affy:open-admin', handleSecretAdminEvent);
    };
  }, [setActiveView]);

  // Synchronize browser URL on view changes
  useEffect(() => {
    if (activeView === 'home') {
      if (window.location.hash || window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    } else if (activeView === 'admin') {
      if (window.location.pathname !== '/admin' && window.location.hash !== '#admin') {
        window.history.replaceState(null, '', '/admin');
      }
    } else {
      if (window.location.hash !== `#${activeView}`) {
        window.history.replaceState(null, '', `/#${activeView}`);
      }
    }
  }, [activeView]);

  // Synchronize SEO titles, meta tags, and structured data on view/product changes
  useEffect(() => {
    updatePageSEO(activeView, detailedProduct);
  }, [activeView, detailedProduct]);

  // Handle buy product action
  const handleInitiatePurchase = (product: Product, buyType: PurchaseType = 'software') => {
    setSelectedBundleForPurchase(null);
    setSelectedProductForPurchase(product);
    setPurchaseType(buyType);
    setIsPurchaseModalOpen(true);
  };

  // Handle buy bundle action
  const handleInitiateBundlePurchase = (bundle: ProductBundle) => {
    setSelectedProductForPurchase(null);
    setSelectedBundleForPurchase(bundle);
    setPurchaseType('bundle');
    setIsPurchaseModalOpen(true);
  };

  // Handle order success from purchase modal
  const handleOrderSuccess = (orderId: string, email: string) => {
    setTrackingOrderId(orderId);
    setTrackingEmail(email);
    setActiveView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 5-Second Futuristic Opening Animation */}
      {showOpeningAnimation && (
        <OpeningAnimation onComplete={handleAnimationComplete} />
      )}

      {/* Top Main Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {/* VIEW: HOME / COMPLETE OVERVIEW (Focused 100% on APKs, Apps & Marketplace) */}
        {activeView === 'home' && (
          <div className="space-y-4">
            <HeroSection />
            <FeaturedProducts
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
            <TrendingProducts
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
              limit={6}
            />
            <NewReleases
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
              limit={6}
            />
            <FreeMarketplace
              onOpenDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
            <ProductBundlesView
              onSelectBundle={handleInitiateBundlePurchase}
              onOpenProductDetails={(p) => setDetailedProduct(p)}
            />
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: FEATURED PRODUCTS */}
        {activeView === 'featured' && (
          <div className="pt-6">
            <FeaturedProducts
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: TRENDING & POPULAR */}
        {(activeView === 'trending' || activeView === 'popular') && (
          <div className="pt-6">
            <TrendingProducts
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
              limit={0}
            />
          </div>
        )}

        {/* VIEW: NEW RELEASES */}
        {activeView === 'new-releases' && (
          <div className="pt-6">
            <NewReleases
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
              limit={0}
            />
          </div>
        )}

        {/* VIEW: PRODUCT BUNDLES */}
        {activeView === 'bundles' && (
          <div className="pt-6">
            <ProductBundlesView
              onSelectBundle={handleInitiateBundlePurchase}
              onOpenProductDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: SAVED WISHLIST */}
        {activeView === 'wishlist' && (
          <div className="pt-6">
            <WishlistView
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: CUSTOMER DIGITAL LIBRARY / MY PURCHASES & UPDATES */}
        {activeView === 'library' && (
          <div className="pt-6">
            <CustomerLibraryView
              onOpenCertificate={(id) => setSelectedCertOrderId(id)}
              onOpenInvoice={(id) => setSelectedInvoiceOrderId(id)}
            />
          </div>
        )}

        {/* VIEW: CUSTOMER REWARDS & POINTS */}
        {activeView === 'rewards' && (
          <div className="pt-6">
            <CustomerRewardsView />
          </div>
        )}

        {/* VIEW: OFFICIAL ANNOUNCEMENTS & BULLETINS (Phase D1) */}
        {(activeView === 'announcements' || activeView === 'news') && (
          <div className="pt-6">
            <AnnouncementsView
              onOpenProductDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
          </div>
        )}

        {/* VIEW: REQUEST SOFTWARE / REQUEST FEATURE (Phase D2) */}
        {(activeView === 'request-software' || activeView === 'request') && (
          <div className="pt-6">
            <RequestSoftwareView />
          </div>
        )}

        {/* VIEW: PERSONALIZED DEALS & OFFERS (Phase D3) */}
        {(activeView === 'deals' || activeView === 'offers') && (
          <div className="pt-6">
            <PersonalizedDealsView
              onOpenProductDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
          </div>
        )}

        {/* VIEW: CAMPAIGNS & SEASONAL EVENTS (Phase D4) */}
        {(activeView === 'campaigns' || activeView === 'events') && (
          <div className="pt-6">
            <CampaignsView
              onOpenProductDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
          </div>
        )}

        {/* VIEW: GIVEAWAYS & WINNERS ARCHIVE (Phase D5) */}
        {(activeView === 'giveaways' || activeView === 'winners') && (
          <div className="pt-6">
            <GiveawaysView
              onOpenProductDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
          </div>
        )}

        {/* VIEW: ABOUT AFTAB */}
        {activeView === 'about' && (
          <div className="pt-6">
            <AboutSection />
            <ContactSection autoPlay3D={false} />
          </div>
        )}

        {/* VIEW: SOFTWARE & APK MARKETPLACE */}
        {activeView === 'software' && (
          <div className="pt-6">
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: FREE APPS & SOFTWARE MARKETPLACE */}
        {(activeView === 'free-apps' || activeView === 'free') && (
          <div className="pt-6">
            <FreeMarketplace
              onOpenDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
          </div>
        )}

        {/* VIEW: SOURCE CODE MARKETPLACE */}
        {activeView === 'source-code' && (
          <div className="pt-6">
            <SourceCodeMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {/* VIEW: FEATURED PORTFOLIO & DEVELOPER BIO */}
        {activeView === 'portfolio' && (
          <div className="pt-6 space-y-8">
            <Portfolio3DWorkstation />
            <AboutSection />
            <ProjectsSection />
            <ServicesSection />
            <ContactSection autoPlay3D={false} />
          </div>
        )}

        {/* VIEW: ENGINEERING SERVICES */}
        {activeView === 'services' && (
          <div className="pt-6">
            <ServicesSection />
          </div>
        )}

        {/* VIEW: CUSTOM PROJECT COMMISSION */}
        {activeView === 'custom-project' && (
          <div className="pt-6">
            <CustomProjectView />
          </div>
        )}

        {/* VIEW: TRACK ORDER & ACCESS VAULT */}
        {activeView === 'track-order' && (
          <div className="pt-6">
            <TrackOrderView
              initialOrderId={trackingOrderId}
              initialEmail={trackingEmail}
              onOpenInvoice={(id) => setSelectedInvoiceOrderId(id)}
              onOpenCertificate={(id) => setSelectedCertOrderId(id)}
            />
          </div>
        )}

        {/* VIEW: TERMS & LICENSING */}
        {activeView === 'terms' && (
          <div className="pt-6">
            <TermsView />
          </div>
        )}

        {/* VIEW: OFFICIAL CONTACT */}
        {activeView === 'contact' && (
          <div className="pt-6">
            <ContactSection autoPlay3D={true} />
          </div>
        )}

        {/* VIEW: ADMIN CMS DASHBOARD */}
        {activeView === 'admin' && (
          <div className="pt-6">
            {isAdminAuthenticated ? (
              <AdminDashboard
                onOpenInvoice={(id) => setSelectedInvoiceOrderId(id)}
                onOpenCertificate={(id) => setSelectedCertOrderId(id)}
              />
            ) : (
              /* Direct Secret Admin Login Screen */
              <div className="py-12 sm:py-20 px-3 sm:px-4 max-w-lg mx-auto animate-in fade-in duration-300">
                <AdminLoginForm
                  onSuccess={() => {}}
                  onCancel={() => setActiveView('home')}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={detailedProduct}
        onClose={() => setDetailedProduct(null)}
        onSelectProduct={handleInitiatePurchase}
      />

      {/* 2. Purchase / Checkout Modal */}
      <PurchaseModal
        product={selectedProductForPurchase}
        bundle={selectedBundleForPurchase}
        initialType={purchaseType}
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedBundleForPurchase(null);
        }}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 3. Official Invoice Modal */}
      <InvoiceModal
        orderId={selectedInvoiceOrderId}
        onClose={() => setSelectedInvoiceOrderId(null)}
      />

      {/* 4. Official Certificate Modal */}
      <CertificateModal
        orderId={selectedCertOrderId}
        onClose={() => setSelectedCertOrderId(null)}
      />

      {/* 5. Customer Firebase Authentication Modal */}
      <UserAuthModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
