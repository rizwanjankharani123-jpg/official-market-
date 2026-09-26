import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Portfolio Sections
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
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

// Admin CMS
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, ProductBundle, PurchaseType } from './types';
import { updatePageSEO } from './utils/seo';
import { Lock, ShieldAlert, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, isAdminAuthenticated, adminSession, adminLogout } = useApp();
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('affy_opening_seen');
    } catch {
      return false;
    }
  });

  const handleAnimationComplete = () => {
    try {
      sessionStorage.setItem('affy_opening_seen', 'true');
    } catch {
      // ignore
    }
    setShowOpeningAnimation(false);
  };

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

  // Handle URL route sync (e.g. /admin or #admin)
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (path === 'admin' || hash === 'admin') {
        setActiveView('admin');
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [setActiveView]);

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

  // If user explicitly visits admin view while unauthenticated, trigger modal
  useEffect(() => {
    if (activeView === 'admin' && !isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
    }
  }, [activeView, isAdminAuthenticated]);

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
        {/* VIEW: HOME / COMPLETE OVERVIEW */}
        {activeView === 'home' && (
          <div>
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
            <AboutSection />
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
            <ProductBundlesView
              onSelectBundle={handleInitiateBundlePurchase}
              onOpenProductDetails={(p) => setDetailedProduct(p)}
            />
            <FreeMarketplace
              onOpenDetails={(p) => setDetailedProduct(p)}
              onSelectProduct={handleInitiatePurchase}
            />
            <SourceCodeMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
            <ProjectsSection />
            <ServicesSection />
            <ContactSection />
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
            <ContactSection />
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

        {/* VIEW: FEATURED PORTFOLIO */}
        {activeView === 'portfolio' && (
          <div className="pt-6">
            <ProjectsSection />
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
            <ContactSection />
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
              /* Unauthenticated visitor navigating to /admin */
              <div className="py-20 px-4 max-w-lg mx-auto text-center animate-in fade-in duration-300">
                <div className="p-8 sm:p-10 rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 space-y-6 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold tracking-wider uppercase border border-cyan-500/30">
                      Restricted Zone
                    </span>
                    <h2 className="text-2xl font-bold text-white font-mono">Admin Login Required</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This console manages product inventory, manual payment verifications, customer invoices, and system configurations. Please sign in with authorized administrator credentials.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => setIsAdminLoginOpen(true)}
                      className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>Admin Login</span>
                    </button>

                    <button
                      onClick={() => setActiveView('home')}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Return Home</span>
                    </button>
                  </div>
                </div>
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

      {/* 5. Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
