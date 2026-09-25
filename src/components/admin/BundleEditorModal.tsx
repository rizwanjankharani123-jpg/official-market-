import React, { useState } from 'react';
import { ProductBundle, Product } from '../../types';
import {
  X,
  Layers,
  DollarSign,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  Sparkles
} from 'lucide-react';

interface BundleEditorModalProps {
  bundle: Partial<ProductBundle> | null;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (bundleData: Partial<ProductBundle>) => Promise<void>;
}

export const BundleEditorModal: React.FC<BundleEditorModalProps> = ({
  bundle,
  products,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<ProductBundle>>({
    name: bundle?.name || '',
    shortDescription: bundle?.shortDescription || '',
    fullDescription: bundle?.fullDescription || '',
    image: bundle?.image || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    productIds: bundle?.productIds || [],
    price: bundle?.price || 5000,
    currency: 'PKR',
    status: bundle?.status || 'published',
    ...bundle
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleProductInBundle = (productId: string) => {
    const current = formData.productIds || [];
    if (current.includes(productId)) {
      setFormData({ ...formData, productIds: current.filter(id => id !== productId) });
    } else {
      setFormData({ ...formData, productIds: [...current, productId] });
    }
  };

  const selectedProducts = products.filter(p => formData.productIds?.includes(p.id));
  const combinedIndividualPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMessage('Bundle name is required.');
      return;
    }
    if (!formData.productIds || formData.productIds.length < 1) {
      setErrorMessage('Please select at least one software package for this bundle.');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setErrorMessage('Please set a valid bundle price in PKR.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product bundle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg font-mono">
                {bundle?.id ? 'Edit Software Bundle' : 'Create New Software Bundle'}
              </h2>
              <p className="text-xs text-slate-400">Combine existing catalog software at a special discounted PKR price.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bundle Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Bundle Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Master Developer Suite 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="e.g. All-in-one package containing our top 3 enterprise applications."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Banner Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Cover Banner Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Select Products from catalog */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-indigo-400 font-bold">
                Select Included Products ({formData.productIds?.length || 0} selected)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Combined Individual Value: PKR {combinedIndividualPrice.toLocaleString()}
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-white/10">
              {products.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No published products in catalog yet.</p>
              ) : (
                products.map((prod) => {
                  const isSelected = formData.productIds?.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleProductInBundle(prod.id)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/40 text-white'
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-indigo-600 border-indigo-400' : 'border-white/20'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold truncate">{prod.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5">{prod.category}</span>
                      </div>
                      <span className="text-xs font-mono font-bold shrink-0">
                        PKR {prod.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pricing & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Bundle Price (PKR) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="published">Published (Live in marketplace)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs font-mono transition-all shadow-lg shadow-indigo-950/50 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Bundle...' : 'Save Product Bundle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
