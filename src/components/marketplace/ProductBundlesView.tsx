import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductBundle, Product, PurchaseType } from '../../types';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  DownloadCloud,
  Eye,
  ArrowRight,
  Tag,
  Package,
  CheckCircle2
} from 'lucide-react';

interface ProductBundlesViewProps {
  onSelectBundle: (bundle: ProductBundle) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const ProductBundlesView: React.FC<ProductBundlesViewProps> = ({
  onSelectBundle,
  onOpenProductDetails
}) => {
  const { bundles, products, setActiveView } = useApp();

  const publishedBundles = bundles.filter((b) => b.status === 'published');

  return (
    <section id="bundles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>📦 VALUE PRODUCT BUNDLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Curated Software Suites & System Bundles
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Get multiple production-grade software applications and full-stack systems packaged together at significant bundle savings.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveView('software');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-mono border border-white/10 transition-all cursor-pointer self-start md:self-end"
        >
          <span>Explore Single Software</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Empty State */}
      {publishedBundles.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">No software bundles active currently</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Custom system packages and discounted bundles will appear here dynamically when published by Aftab.
          </p>
        </div>
      ) : (
        /* Bundles Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {publishedBundles.map((bundle) => {
            // Find all included real products from catalog
            const includedProducts = products.filter((p) => bundle.productIds.includes(p.id));
            const totalIndividualPrice = includedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
            const savingsAmount = Math.max(0, totalIndividualPrice - bundle.price);
            const savingsPercent = totalIndividualPrice > 0 ? Math.round((savingsAmount / totalIndividualPrice) * 100) : 0;

            return (
              <div
                key={bundle.id}
                className="rounded-3xl bg-[#090d16] border border-indigo-500/30 hover:border-indigo-400/60 transition-all flex flex-col justify-between overflow-hidden shadow-2xl relative group"
              >
                {/* Highlight Glow Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 z-10" />

                <div>
                  {/* Banner Image */}
                  <div className="relative aspect-[16/8] bg-slate-950 overflow-hidden">
                    <img
                      src={
                        bundle.image ||
                        includedProducts[0]?.demoImages[0] ||
                        'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={bundle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/60 to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs font-mono shadow-lg flex items-center gap-1.5 uppercase">
                        <Layers className="w-3.5 h-3.5" />
                        {includedProducts.length} Apps In 1 Bundle
                      </span>

                      {savingsPercent > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-xs font-mono shadow-lg">
                          Save {savingsPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bundle Content */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                        {bundle.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                        {bundle.shortDescription}
                      </p>
                    </div>

                    {/* Included Products List */}
                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      <p className="text-[11px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                        Included Software Systems ({includedProducts.length}):
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {includedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => onOpenProductDetails(prod)}
                            className="p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between gap-2 cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="text-xs text-slate-200 font-bold truncate group-hover/item:text-cyan-300">
                                {prod.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              PKR {prod.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Checkout Bar */}
                <div className="p-6 sm:p-8 pt-0 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                    <div>
                      {totalIndividualPrice > bundle.price && (
                        <p className="text-xs font-mono text-slate-500 line-through">
                          Individual Value: PKR {totalIndividualPrice.toLocaleString()}
                        </p>
                      )}
                      <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                        PKR {bundle.price.toLocaleString()}
                      </p>
                    </div>

                    {savingsAmount > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                          You Save
                        </span>
                        <p className="text-sm font-bold font-mono text-emerald-400">
                          PKR {savingsAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectBundle(bundle)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-600 hover:brightness-110 text-black font-black text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50 cursor-pointer"
                  >
                    <DownloadCloud className="w-4 h-4 text-black" />
                    <span>Purchase Complete Bundle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
