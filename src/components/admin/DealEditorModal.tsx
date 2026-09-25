import React, { useState } from 'react';
import { PersonalizedDeal, Product } from '../../types';
import {
  X,
  Tag,
  Sparkles,
  DollarSign,
  Percent,
  Calendar,
  Layers,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DealEditorModalProps {
  deal: Partial<PersonalizedDeal> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PersonalizedDeal>) => Promise<void>;
}

export const DealEditorModal: React.FC<DealEditorModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const { products } = useApp();

  const [formData, setFormData] = useState<Partial<PersonalizedDeal>>({
    offerName: deal?.offerName || '',
    description: deal?.description || '',
    discountType: deal?.discountType || 'percentage',
    discountValue: deal?.discountValue || 15,
    startDate: deal?.startDate || new Date().toISOString().split('T')[0],
    endDate: deal?.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: deal?.active ?? true,
    eligibilityCondition: deal?.eligibilityCondition || 'all_customers',
    targetCategory: deal?.targetCategory || '',
    promoCode: deal?.promoCode || '',
    bannerUrl: deal?.bannerUrl || '',
    eligibleProductIds: deal?.eligibleProductIds || [],
    ...deal
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.offerName?.trim()) {
      setErrorMessage('Offer name is required.');
      return;
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      setErrorMessage('Discount value must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save deal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#090d16] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-left my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base font-mono">
              {deal?.id ? 'Edit Personalized Deal' : 'Create Personalized Offer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Offer Name *</label>
              <input
                type="text"
                value={formData.offerName}
                onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                placeholder="e.g. Returning Customer Loyalty Perk"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Promo Code (Optional)</label>
              <input
                type="text"
                value={formData.promoCode || ''}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                placeholder="e.g. AFFYLOYAL20"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Description / Benefit Summary *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe what eligible customers receive and how it applies..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed_pkr">Fixed Amount (PKR off)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">
                Discount Value {formData.discountType === 'percentage' ? '(%)' : '(PKR)'} *
              </label>
              <input
                type="number"
                min={1}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Target Eligibility Rule *</label>
            <select
              value={formData.eligibilityCondition}
              onChange={(e) => setFormData({ ...formData, eligibilityCondition: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="all_customers">🌍 Open to All Marketplace Customers</option>
              <option value="previous_buyers">🛍️ Returning Buyers (At least 1 Confirmed Order)</option>
              <option value="min_purchases_2">💎 Repeat Clients (2+ Completed Purchases)</option>
              <option value="category_buyers">🎯 Specific Category Buyers (e.g. Android or POS buyers)</option>
              <option value="vip_customers">👑 VIP High-Value Customers</option>
            </select>
          </div>

          {formData.eligibilityCondition === 'category_buyers' && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Target Category</label>
              <select
                value={formData.targetCategory || ''}
                onChange={(e) => setFormData({ ...formData, targetCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Android App">Android App</option>
                <option value="Desktop Software">Desktop Software</option>
                <option value="Web Platform">Web Platform</option>
                <option value="Full Stack System">Full Stack System</option>
                <option value="API & Backend">API & Backend</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="deal_active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded bg-slate-950 border-white/10 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="deal_active" className="text-xs font-mono text-slate-300 cursor-pointer">
              Active / Visible to Eligible Users
            </label>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono cursor-pointer hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-black" />
              <span>{isSubmitting ? 'Saving...' : 'Save Deal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
