import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PurchaseType } from '../../types';
import {
  Flame,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Code2,
  DownloadCloud,
  Check,
  ChevronRight,
  Eye,
  Zap,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface TrendingProductsProps {
  onSelectProduct: (product: Product, buyType?: PurchaseType) => void;
  onOpenDetails: (product: Product) => void;
  limit?: number;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  onSelectProduct,
  onOpenDetails,
  limit = 6
}) => {
  const { products, getProductSalesStats, recordFreeDownload, setActiveView } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter ONLY published/active products from real Firestore collection
  const publishedProducts = products.filter((p) => p.status === 'published');

  // Compute real activity for each product (sales count from verified orders + free downloads count)
  // Strictly NO fake counters, NO dummy numbers
  const productsWithActivity = publishedProducts.map((product) => {
    const stats = getProductSalesStats(product.id);
    const downloads = product.downloadsCount || 0;
    const totalActivity = stats.sold + downloads;
    return {
      product,
      soldCount: stats.sold,
      pendingCount: stats.pending,
      downloadsCount: downloads,
      totalActivity
    };
  });

  // Filter products that have meaningful real activity (> 0)
  const trendingCandidates = productsWithActivity.filter((item) => item.totalActivity > 0);

  // If no meaningful real activity exists, hide the section instead of showing fake popularity
  if (trendingCandidates.length === 0) {
    return null;
  }

  // Sort by real activity in descending order, then by latest publication
  const sortedTrending = [...trendingCandidates].sort((a, b) => {
    if (b.totalActivity !== a.totalActivity) {
      return b.totalActivity - a.totalActivity;
    }
    const timeA = new Date(a.product.publishedAt || a.product.createdAt || 0).getTime();
    const timeB = new Date(b.product.publishedAt || b.product.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const displayList = limit && limit > 0 ? sortedTrending.slice(0, limit) : sortedTrending;

  const handleFreeDownload = async (product: Product) => {
    setDownloadingId(product.id);
    try {
      await recordFreeDownload(product.id);
      if (product.apkUrl) {
        const a = document.createElement('a');
        a.href = product.apkUrl;
        a.download = `${product.name.replace(/\s+/g, '_')}_v${product.version || '1.0'}.apk`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error('Free download error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  return (
    <section id="trending-products" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold shadow-lg shadow-rose-500/10">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>🔥 TRENDING & POPULAR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Most In-Demand Applications & Code
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Ranked by verified user engagement, genuine sales confirmations, and live software download activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveView('software');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg group"
          >
            <span>Explore All Software</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Trending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map(({ product, soldCount, pendingCount, downloadsCount, totalActivity }, rankIndex) => {
          const isFree = product.pricingType === 'free' || product.price === 0;
          const isTopRanked = rankIndex === 0;

          return (
            <div
              key={product.id}
              className={`rounded-3xl bg-[#090d16] border transition-all duration-300 flex flex-col justify-between overflow-hidden text-left group shadow-xl shadow-black/60 relative ${
                isTopRanked
                  ? 'border-rose-500/40 hover:border-rose-400 hover:shadow-rose-950/40'
                  : isFree
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-950/30'
                  : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-950/40'
              }`}
            >
              {/* Top Rank Banner / Highlight Stripe */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 z-10 ${
                  isTopRanked
                    ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400'
                    : 'bg-gradient-to-r from-rose-500/80 via-purple-500/80 to-cyan-500/80'
                }`}
              />

              <div>
                {/* Product Screenshot / Image */}
                <div
                  onClick={() => onOpenDetails(product)}
                  className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      product.demoImages[0] ||
                      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {/* Trending Rank Badge */}
                    <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-[10px] font-mono shadow-md shadow-rose-600/30 flex items-center gap-1 uppercase tracking-wider">
                      <Flame className="w-3 h-3 text-white" />
                      #{rankIndex + 1} Trending
                    </span>

                    {/* Featured Badge if applicable */}
                    {product.featured && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-amber-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-black" />
                        ⭐ Featured
                      </span>
                    )}

                    {/* Free or Paid Badge */}
                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-emerald-500/30 uppercase tracking-wider">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-cyan-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                        PAID
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                    {product.version}
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3
                      onClick={() => onOpenDetails(product)}
                      className={`font-bold text-white text-lg transition-colors cursor-pointer ${
                        isFree ? 'group-hover:text-emerald-300' : 'group-hover:text-cyan-300'
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {product.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isFree ? 'text-emerald-400' : 'text-cyan-400'
                          }`}
                        />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Real Activity / Popularity Metrics Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-[#06080e] border border-rose-500/20 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Views: <strong className="text-white font-bold">{product.viewsCount || 0}</strong></span>
                    </div>

                    {isFree ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Downloads: <strong className="text-white font-bold">{downloadsCount}</strong></span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Sold: <strong className="text-white font-bold">{soldCount}</strong></span>
                        </div>
                        {pendingCount > 0 && (
                          <div className="flex items-center gap-1 text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Pending: <strong className="text-white font-bold">{pendingCount}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Source Code Upsell Banner if available */}
                  {product.sourceAvailable && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-indigo-300">
                        <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-[11px] font-mono">Source License:</span>
                      </div>
                      <span className="font-bold font-mono text-white text-xs">
                        PKR {(product.sourcePrice || product.price || 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Price Bar */}
              <div className="p-6 pt-0 space-y-3">
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p
                      className={`text-[10px] uppercase font-mono ${
                        isFree ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {isFree ? 'Free Full License' : 'Software / APK License'}
                    </p>
                    {isFree ? (
                      <p className="text-2xl font-black text-emerald-400 font-mono">
                        PKR 0 <span className="text-xs font-normal text-slate-400 font-sans">/ Free</span>
                      </p>
                    ) : (
                      <p className="text-2xl font-black text-white font-mono">
                        PKR {(product.price || 0).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenDetails(product)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="View Screenshots & Specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {isFree ? (
                    <button
                      onClick={() => handleFreeDownload(product)}
                      disabled={downloadingId === product.id}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-black" />
                      <span>{downloadingId === product.id ? 'Downloading...' : 'Download Free'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectProduct(product, 'software')}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-black" />
                      <span>Buy Software</span>
                    </button>
                  )}

                  {product.sourceAvailable ? (
                    <button
                      onClick={() => onSelectProduct(product, 'source_code')}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Get Source</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenDetails(product)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 font-medium text-xs transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
