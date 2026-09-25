import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PurchaseType } from '../../types';
import {
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
  Calendar,
  Clock,
  Flame
} from 'lucide-react';

interface NewReleasesProps {
  onSelectProduct: (product: Product, buyType?: PurchaseType) => void;
  onOpenDetails: (product: Product) => void;
  limit?: number;
}

export const NewReleases: React.FC<NewReleasesProps> = ({
  onSelectProduct,
  onOpenDetails,
  limit = 6
}) => {
  const { products, getProductSalesStats, recordFreeDownload, setActiveView } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter ONLY published/active products from real Firestore collection
  const publishedProducts = products.filter((p) => p.status === 'published');

  // Sort by newest published/created first using publishedAt || createdAt
  const sortedReleases = [...publishedProducts].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Apply sensible limit for homepage display (if specified and > 0)
  const displayProducts = limit && limit > 0 ? sortedReleases.slice(0, limit) : sortedReleases;

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

  // If there are no published products in Firestore, cleanly hide or return null
  if (publishedProducts.length === 0) {
    return null;
  }

  // Helper to format release date
  const formatReleaseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  return (
    <section id="new-releases" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold shadow-lg shadow-cyan-500/5">
            <span className="text-base leading-none">🆕</span>
            <span>NEW RELEASES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Latest Engineering Builds & Apps
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Freshly deployed software, mobile APKs, and production source code packages. Chronologically ordered by release date.
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
            <span>View All ({publishedProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* New Releases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product, index) => {
          const isFree = product.pricingType === 'free' || product.price === 0;
          const releaseDate = formatReleaseDate(product.publishedAt || product.createdAt);
          const isLatest = index === 0;

          return (
            <div
              key={product.id}
              className={`rounded-3xl bg-[#090d16] border transition-all duration-300 flex flex-col justify-between overflow-hidden text-left group shadow-xl shadow-black/60 relative ${
                isFree
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-950/30'
                  : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-950/40'
              }`}
            >
              {/* Cyan Accent Header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-10" />

              <div>
                {/* Product Screenshot / Image */}
                <div
                  onClick={() => onOpenDetails(product)}
                  className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.demoImages?.[0] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {/* New Release Badge */}
                    <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-cyan-500/30 flex items-center gap-1 uppercase tracking-wider">
                      <Zap className="w-3 h-3 text-black fill-current" />
                      NEW
                    </span>

                    {/* Featured Pill if also marked Featured */}
                    {product.featured && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-black" />
                        ⭐ Featured
                      </span>
                    )}

                    {/* Free or Paid Pill */}
                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-emerald-500/30 uppercase tracking-wider">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-cyan-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                        PAID
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 font-semibold">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                      {product.version || 'v1.0'}
                    </span>
                    {releaseDate && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-cyan-400" />
                        {releaseDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3
                      onClick={() => onOpenDetails(product)}
                      className="font-bold text-white text-lg transition-colors cursor-pointer group-hover:text-cyan-300 line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Key Features Bullet Points */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {(product.features || []).slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className={`w-3.5 h-3.5 shrink-0 ${isFree ? 'text-emerald-400' : 'text-cyan-400'}`} />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Real Product Stats Indicator */}
                  {(() => {
                    const sales = getProductSalesStats(product.id);
                    const views = product.viewsCount || 0;
                    const downloads = product.downloadsCount || 0;
                    return (
                      <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-[#06080e] border border-white/5 gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-cyan-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Views: <strong className="text-white font-bold">{views}</strong></span>
                        </div>
                        {isFree ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Downloads: <strong className="text-white font-bold">{downloads}</strong></span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Sold: <strong className="text-white font-bold">{sales.sold}</strong></span>
                            </div>
                            {sales.pending > 0 && (
                              <div className="flex items-center gap-1 text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span>Pending: <strong className="text-white font-bold">{sales.pending}</strong></span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Source Code Upsell Banner if available */}
                  {product.sourceAvailable && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-indigo-300">
                        <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-[11px] font-mono">Source Code Available:</span>
                      </div>
                      <span className="font-mono font-bold text-white text-xs">
                        PKR {product.sourcePrice?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Price & Primary Action */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pricing Model</p>
                      {isFree ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-emerald-400 font-mono">FREE</span>
                          <span className="text-xs font-mono text-slate-400">(PKR 0)</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-mono text-cyan-400">PKR</span>
                          <span className="text-xl font-black text-white font-mono">
                            {product.price?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetails(product)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="View Architecture Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isFree ? (
                        <button
                          onClick={() => handleFreeDownload(product)}
                          disabled={downloadingId === product.id}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <DownloadCloud className="w-4 h-4 text-black" />
                          <span>{downloadingId === product.id ? 'Downloading...' : 'Download Free'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectProduct(product, 'software')}
                          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                        >
                          <span>Buy Access</span>
                          <ChevronRight className="w-4 h-4 text-black" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
