import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PurchaseType } from '../../types';
import {
  Heart,
  Package,
  Trash2,
  DownloadCloud,
  Code2,
  Eye,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

interface WishlistViewProps {
  onSelectProduct: (product: Product, buyType?: PurchaseType) => void;
  onOpenDetails: (product: Product) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onSelectProduct,
  onOpenDetails
}) => {
  const { wishlist, products, toggleWishlist, clearWishlist, setActiveView, recordFreeDownload } = useApp();

  // Match wishlist IDs against real published catalog products
  const savedProducts = products.filter(
    (p) => wishlist.includes(p.id) && p.status === 'published'
  );

  const handleFreeDownload = async (product: Product) => {
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
      console.error('Download error:', e);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>SAVED FOR LATER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Wishlist ({savedProducts.length})
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Applications, systems, and source code packages saved to your local browser collection. Live pricing and availability are automatically synchronized with the official catalog.
          </p>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-mono transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedProducts.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-5 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white font-mono">Your wishlist is currently empty</h3>
            <p className="text-xs text-slate-400">
              Browse the marketplace and click the heart icon on any software release or source code package to save it here for later.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveView('software');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Catalog</span>
          </button>
        </div>
      ) : (
        /* Saved Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => {
            const isFree = product.pricingType === 'free' || product.price === 0;

            return (
              <div
                key={product.id}
                className="rounded-3xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl text-left group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={
                        product.demoImages[0] ||
                        'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {product.featured && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-black" />
                          ⭐ Featured
                        </span>
                      )}
                      {isFree ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-[10px] font-mono">
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

                    {/* Remove button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-600 text-rose-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-6 space-y-3">
                    <h3
                      onClick={() => onOpenDetails(product)}
                      className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{product.shortDescription}</p>
                  </div>
                </div>

                {/* Bottom Price & Actions */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-400">Price</p>
                      <p className="text-2xl font-black text-white font-mono">
                        {isFree ? (
                          <span className="text-emerald-400">FREE</span>
                        ) : (
                          `PKR ${product.price.toLocaleString()}`
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenDetails(product)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {isFree ? (
                      <button
                        onClick={() => handleFreeDownload(product)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Download Free</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectProduct(product, 'software')}
                        className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Buy Software</span>
                      </button>
                    )}

                    {product.sourceAvailable ? (
                      <button
                        onClick={() => onSelectProduct(product, 'source_code')}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
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
      )}
    </section>
  );
};
