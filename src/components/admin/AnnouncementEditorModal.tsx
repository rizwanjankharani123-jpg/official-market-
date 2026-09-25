import React, { useState } from 'react';
import { MarketplaceAnnouncement, AnnouncementType, Product } from '../../types';
import {
  X,
  Bell,
  Sparkles,
  Gift,
  Flame,
  Layers,
  Send,
  Image,
  Link,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AnnouncementEditorModalProps {
  announcement: Partial<MarketplaceAnnouncement> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MarketplaceAnnouncement>) => Promise<void>;
}

export const AnnouncementEditorModal: React.FC<AnnouncementEditorModalProps> = ({
  announcement,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const { products } = useApp();

  const [formData, setFormData] = useState<Partial<MarketplaceAnnouncement>>({
    title: announcement?.title || '',
    shortDescription: announcement?.shortDescription || announcement?.message || '',
    fullContent: announcement?.fullContent || announcement?.message || '',
    image: announcement?.image || '',
    announcementType: announcement?.announcementType || (announcement?.type as any) || 'General AFFY OFFICIAL Update',
    relatedProductId: announcement?.relatedProductId || announcement?.productId || '',
    linkView: announcement?.linkView || 'software',
    status: announcement?.status || (announcement?.active !== false ? 'published' : 'draft'),
    active: announcement?.active ?? true,
    publishedAt: announcement?.publishedAt || new Date().toISOString(),
    ...announcement
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setErrorMessage('Announcement title is required.');
      return;
    }
    if (!formData.shortDescription?.trim() && !formData.fullContent?.trim()) {
      setErrorMessage('Short description or full content is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const now = new Date().toISOString();
      const payload: Partial<MarketplaceAnnouncement> = {
        ...formData,
        message: formData.shortDescription || formData.title,
        status: formData.status || 'published',
        active: formData.status === 'published',
        publishedAt: formData.status === 'published' ? (formData.publishedAt || now) : undefined
      };
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#090d16] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-left my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base font-mono">
              {announcement?.id ? 'Edit Marketplace Announcement' : 'Create New Announcement'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
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
              <label className="text-xs font-mono text-slate-300">Announcement Type *</label>
              <select
                value={formData.announcementType}
                onChange={(e) => setFormData({ ...formData, announcementType: e.target.value as AnnouncementType, type: e.target.value as AnnouncementType })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="New Product">🚀 New Product</option>
                <option value="New Version">🔄 New Version / Update</option>
                <option value="Free Software">🆓 Free Software</option>
                <option value="Deal">🔥 Deal / Discount</option>
                <option value="Giveaway">🎁 Giveaway Announcement</option>
                <option value="General AFFY OFFICIAL Update">📢 General AFFY OFFICIAL Update</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Publishing Status *</label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const s = e.target.value as 'published' | 'draft';
                  setFormData({ ...formData, status: s, active: s === 'published' });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="published">🟢 Published (Live for Users)</option>
                <option value="draft">🟡 Draft (Admin Only)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Major Update: Modern Billing ERP v2.0 Released"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Short Summary / Description *</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief summary displayed on cards and notification badge..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Full Content / Article</label>
            <textarea
              value={formData.fullContent}
              onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
              rows={4}
              placeholder="Detailed announcement details, changelog, breakdown, instructions..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Banner / Graphic URL (Optional)</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Related Product (Optional Link)</label>
              <select
                value={formData.relatedProductId || ''}
                onChange={(e) => setFormData({ ...formData, relatedProductId: e.target.value, productId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="">-- None (General Announcement) --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.pricingType === 'free' ? 'FREE' : `PKR ${p.price}`})
                  </option>
                ))}
              </select>
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
              <Send className="w-3.5 h-3.5 text-black" />
              <span>{isSubmitting ? 'Saving...' : formData.status === 'published' ? 'Publish Announcement' : 'Save Draft'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
