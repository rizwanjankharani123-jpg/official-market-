import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Code2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FolderGit2,
  Layers,
  FileCode,
  Terminal,
  ExternalLink,
  Lock,
  DownloadCloud,
  Eye,
  Info
} from 'lucide-react';

interface SourceCodeMarketplaceProps {
  onSelectProduct: (product: Product, buyType: 'source_code') => void;
  onOpenDetails: (product: Product) => void;
}

export const SourceCodeMarketplace: React.FC<SourceCodeMarketplaceProps> = ({
  onSelectProduct,
  onOpenDetails
}) => {
  const { products, getProductSalesStats } = useApp();
  const [filterTech, setFilterTech] = useState<string>('all');

  // Filter products that have source code available
  const sourceProducts = products.filter(p => p.status === 'published' && p.sourceAvailable);

  const allTechs = Array.from(
    new Set(sourceProducts.flatMap(p => p.techStack || []))
  );

  const filtered = filterTech === 'all'
    ? sourceProducts
    : sourceProducts.filter(p => p.techStack?.includes(filterTech));

  return (
    <section id="source-code" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
            <Code2 className="w-3.5 h-3.5" />
            <span>SOURCE CODE MARKETPLACE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Commercial Source Code & Full Systems
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Purchase clean, modular, fully-documented source code for enterprise systems, mobile applications, and trading algorithms. Includes verified developer license certificate.
          </p>
        </div>

        {/* Tech Stack Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-md">
          <button
            onClick={() => setFilterTech('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
              filterTech === 'all'
                ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All Stacks
          </button>
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilterTech(tech)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                filterTech === tech
                  ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Security & License Notice Banner */}
      <div className="mb-10 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white font-mono">Protected Storage & Authorized Delivery</p>
            <p className="text-slate-400">
              Source ZIP archives are securely sealed in Firebase private storage and unlocked only upon manual admin payment verification.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Includes Official License Certificate</span>
        </div>
      </div>

      {/* Source Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#090d16] border border-white/5 space-y-3">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-mono">No source code available yet.</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            New source code packages will appear here when published by Aftab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 text-left group shadow-xl shadow-black/50"
            >
            <div className="space-y-4">
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                    {product.licenseType}
                  </span>
                  <h3
                    onClick={() => onOpenDetails(product)}
                    className="font-bold text-white text-xl mt-2 group-hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Version {product.version} • {product.category}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase font-mono text-slate-400">Source License</p>
                  <p className="text-2xl font-black text-white font-mono">
                    PKR {(product.sourcePrice || product.price).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Dynamic Real-time Sales Counter */}
              {(() => {
                const sales = getProductSalesStats(product.id, 'source_code');
                return (
                  <div className="flex items-center justify-between text-[11px] font-mono px-3.5 py-2 rounded-xl bg-slate-950 border border-indigo-500/20">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Total Sold: <strong className="text-white font-bold">{sales.sold}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Pending: <strong className="text-white font-bold">{sales.pending}</strong></span>
                    </div>
                  </div>
                );
              })()}

              {/* Tech Stack Pills */}
              <div>
                <p className="text-[11px] font-mono text-slate-400 mb-2">Technology & Dependencies:</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 text-xs font-mono border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* License Permissions Matrix */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2 text-xs">
                <p className="text-[11px] font-mono uppercase text-slate-400 font-semibold">License Scope & Usage Rights:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commercial Client Deployments: Allowed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Full Code Modification: Allowed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Public Reselling of Raw Source: Prohibited</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Developer Bug Support: Included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => onOpenDetails(product)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Architecture</span>
              </button>

              <button
                onClick={() => onSelectProduct(product, 'source_code')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Code2 className="w-4 h-4 text-white" />
                <span>Purchase Source Code License (PKR {(product.sourcePrice || product.price).toLocaleString()})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
};
