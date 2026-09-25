import React, { useState } from 'react';
import { CampaignEvent, CampaignStatus, Product } from '../../types';
import {
  X,
  Calendar,
  Sparkles,
  Save,
  Image,
  Layers,
  Percent,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CampaignEditorModalProps {
  campaign: Partial<CampaignEvent> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CampaignEvent>) => Promise<void>;
}

export const CampaignEditorModal: React.FC<CampaignEditorModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const { products, giveaways } = useApp();

  const [formData, setFormData] = useState<Partial<CampaignEvent>>({
    campaignName: campaign?.campaignName || '',
    title: campaign?.title || '',
    description: campaign?.description || '',
    bannerImage: campaign?.bannerImage || '',
    startDate: campaign?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    featuredProductIds: campaign?.featuredProductIds || [],
    discountPercentage: campaign?.discountPercentage || 25,
    offerDescription: campaign?.offerDescription || '',
    giveawayId: campaign?.giveawayId || '',
    status: campaign?.status || 'live',
    ...campaign
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignName?.trim() || !formData.title?.trim()) {
      setErrorMessage('Campaign name and title are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProduct = (id: string) => {
    const list = formData.featuredProductIds || [];
    if (list.includes(id)) {
      setFormData({ ...formData, featuredProductIds: list.filter((pId) => pId !== id) });
    } else {
      setFormData({ ...formData, featuredProductIds: [...list, id] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-left my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base font-mono">
              {campaign?.id ? 'Edit Seasonal Campaign' : 'Create Seasonal Event'}
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
              <label className="text-xs font-mono text-slate-300">Campaign Internal Code / Name *</label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                placeholder="e.g. Ramadan Tech Sale 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Event Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="draft">🟡 Draft (Hidden)</option>
                <option value="scheduled">⏱️ Scheduled (Upcoming)</option>
                <option value="live">🟢 Live & Active (Marketplace Hub)</option>
                <option value="ended">⚪ Ended / Concluded</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Public Display Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Grand Developer Festival: 25% Off All Source Code"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Description / Highlights *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe the campaign event, promotional perks, and bundle opportunities..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Banner Graphic Image URL (Optional)</label>
            <input
              type="url"
              value={formData.bannerImage || ''}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Discount Percentage (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.discountPercentage || 0}
                onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Special Offer Label</label>
              <input
                type="text"
                value={formData.offerDescription || ''}
                onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })}
                placeholder="e.g. Free Installation Included"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Select Featured Products */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Featured Products in this Event</label>
            <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-white/10 space-y-1.5">
              {products.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono">No products in catalog yet.</p>
              ) : (
                products.map((p) => {
                  const isChecked = (formData.featuredProductIds || []).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded bg-slate-950 border-white/10 text-cyan-500"
                        />
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {p.pricingType === 'free' ? 'FREE' : `PKR ${p.price.toLocaleString()}`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
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
              <span>{isSubmitting ? 'Saving...' : 'Save Campaign'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
