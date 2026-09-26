import React, { useState } from 'react';
import { Product } from '../../types';
import { uploadFileToFirebaseStorage } from '../../lib/firebase';

type ProductCategory = 'Android App' | 'Desktop Software' | 'Web Platform' | 'Full Stack System' | 'API & Backend' | 'Utility Tool';
type LicenseType = 'Standard Commercial' | 'Extended Multi-Client' | 'Single App License' | 'Personal Educational';
type ProductStatus = 'published' | 'draft';
import {
  X,
  Package,
  Image as ImageIcon,
  DollarSign,
  Code2,
  FileCode,
  ShieldCheck,
  UploadCloud,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Layers,
  FolderArchive,
  Info,
  ExternalLink,
  Cpu,
  Loader2,
  Globe
} from 'lucide-react';

interface ProductEditorModalProps {
  product: Partial<Product>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

type TabType = 'general' | 'media' | 'pricing' | 'apk' | 'source' | 'features';

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Android App',
    shortDescription: '',
    fullDescription: '',
    pricingType: product?.pricingType || (product?.price === 0 ? 'free' : 'paid'),
    price: product?.pricingType === 'free' || product?.price === 0 ? 0 : (product?.price ?? 1500),
    currency: 'PKR',
    version: 'v1.0.0',
    features: ['Native Performance', 'Offline Database Support', 'Clean Architecture'],
    requirements: ['Android 8.0+ / Modern Web Browser'],
    includedFiles: ['Compiled APK / Executable', 'Documentation & Setup Guide'],
    demoImages: [],
    apkUrl: '',
    apkSize: '',
    apkPreviewUrl: '',
    websitePreviewUrl: '',
    previewEnabled: true,
    sourceAvailable: true,
    sourcePrice: 1500,
    sourceZipUrl: '',
    sourceSize: '',
    techStack: ['Kotlin', 'React', 'Node.js', 'PostgreSQL'],
    licenseType: 'Standard Commercial',
    licenseTerms: 'Commercial deployment rights included for single or multi-client projects.',
    commercialUseAllowed: true,
    redistributionAllowed: false,
    resaleAllowed: false,
    modificationAllowed: true,
    supportTerms: 'Direct developer bug fixing and technical setup guidance.',
    status: 'published',
    featured: product?.featured ?? false,
    ...product
  });

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real upload states
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [apkUploading, setApkUploading] = useState(false);
  const [apkUploadProgress, setApkUploadProgress] = useState(0);
  const [sourceUploading, setSourceUploading] = useState(false);
  const [sourceUploadProgress, setSourceUploadProgress] = useState(0);

  // New item inputs
  const [newFeature, setNewFeature] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  if (!isOpen) return null;

  // Real cover image file upload to Firebase Storage
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Cover image must be under 15MB');
      return;
    }
    setErrorMessage('');
    setCoverUploading(true);
    setCoverUploadProgress(0);

    try {
      const { downloadUrl } = await uploadFileToFirebaseStorage(
        file,
        'products/covers',
        (progress) => setCoverUploadProgress(progress)
      );

      const updatedImages = [...(formData.demoImages || [])];
      if (updatedImages.length > 0) {
        updatedImages[0] = downloadUrl;
      } else {
        updatedImages.push(downloadUrl);
      }
      setFormData((prev) => ({ ...prev, demoImages: updatedImages }));
    } catch (err: any) {
      setErrorMessage('Image upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setCoverUploading(false);
    }
  };

  // Real gallery screenshots multi-file upload to Firebase Storage
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');
    for (const file of Array.from(files)) {
      if (file.size > 15 * 1024 * 1024) continue;
      try {
        const { downloadUrl } = await uploadFileToFirebaseStorage(file, 'products/gallery');
        setFormData((prev) => ({
          ...prev,
          demoImages: [...(prev.demoImages || []), downloadUrl]
        }));
      } catch (err) {
        console.warn('Gallery item upload error:', err);
      }
    }
  };

  // Real APK file upload handler with Firebase Storage
  const handleApkFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setApkUploading(true);
    setApkUploadProgress(0);

    try {
      const { downloadUrl, fileSize } = await uploadFileToFirebaseStorage(
        file,
        'products/builds',
        (progress) => setApkUploadProgress(progress)
      );

      setFormData((prev) => ({
        ...prev,
        apkSize: fileSize,
        apkUrl: downloadUrl
      }));
    } catch (err: any) {
      setErrorMessage('APK upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setApkUploading(false);
    }
  };

  // Real Source Code ZIP upload handler with Firebase Storage
  const handleSourceZipSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setSourceUploading(true);
    setSourceUploadProgress(0);

    try {
      const { downloadUrl, fileSize } = await uploadFileToFirebaseStorage(
        file,
        'products/source',
        (progress) => setSourceUploadProgress(progress)
      );

      setFormData((prev) => ({
        ...prev,
        sourceSize: fileSize,
        sourceZipUrl: downloadUrl
      }));
    } catch (err: any) {
      setErrorMessage('Source ZIP upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSourceUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature.trim()]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index)
    });
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setFormData({
      ...formData,
      requirements: [...(formData.requirements || []), newRequirement.trim()]
    });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: (formData.requirements || []).filter((_, i) => i !== index)
    });
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    setFormData({
      ...formData,
      techStack: [...(formData.techStack || []), newTech.trim()]
    });
    setNewTech('');
  };

  const handleRemoveTech = (index: number) => {
    setFormData({
      ...formData,
      techStack: (formData.techStack || []).filter((_, i) => i !== index)
    });
  };

  const handleRemoveImage = (index: number) => {
    const updated = (formData.demoImages || []).filter((_, i) => i !== index);
    setFormData({ ...formData, demoImages: updated });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData({
      ...formData,
      demoImages: [...(formData.demoImages || []), newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    const isFree = formData.pricingType === 'free';
    if (!isFree && (formData.price === undefined || formData.price === null || formData.price < 0)) {
      setErrorMessage('Valid software price in PKR is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload: Partial<Product> = {
        ...formData,
        featured: Boolean(formData.featured),
        pricingType: isFree ? 'free' : 'paid',
        price: isFree ? 0 : Number(formData.price || 0),
        currency: 'PKR'
      };
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabItems = [
    { id: 'general', label: '1. General Info', icon: Package },
    { id: 'media', label: '2. Media & Visuals', icon: ImageIcon },
    { id: 'pricing', label: '3. Pricing & Terms', icon: DollarSign },
    { id: 'apk', label: '4. Software APK', icon: Smartphone },
    { id: 'source', label: '5. Source Package', icon: Code2 },
    { id: 'features', label: '6. Features & Specs', icon: Layers }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/40 rounded-3xl p-4 sm:p-8 shadow-2xl shadow-cyan-950/60 my-6 max-h-[95vh] flex flex-col text-left">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
              {formData.id ? 'Product Editor' : 'Create New Product Release'}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
              {formData.name || 'Untitled Software Product'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Navigation Sub-Tabs Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-white/5 shrink-0">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-extrabold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Retail POS Pro Ultimate"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category || 'Android App'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Android App">Android App (APK)</option>
                    <option value="Desktop Software">Desktop Software (Windows/macOS)</option>
                    <option value="Web Platform">Web Platform / Full-Stack</option>
                    <option value="Full Stack System">Full Stack SaaS System</option>
                    <option value="API & Backend">API & Backend Engine</option>
                    <option value="Utility Tool">Utility & Automation Tool</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Release Version</label>
                  <input
                    type="text"
                    value={formData.version || 'v1.0.0'}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0.0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Catalog Status</label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published (Live in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Featured: ⭐
                  </label>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: true })}
                      className={`flex-1 py-1 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        formData.featured
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>ON</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: false })}
                      className={`flex-1 py-1 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        !formData.featured
                          ? 'bg-slate-800 text-slate-200 border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>OFF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Short Description (1-2 sentences) *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Complete point-of-sale Android app with offline sync and bluetooth printing support."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Detailed Description & Architecture</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive technical breakdown, database schema details, architecture highlights, and setup guide..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Structured Points: About This Software */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>About This Software (Structured Points)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">One point per line (1. ... or • ...)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Write the important details about this software. Use one point per line. Supports numbered ("1. ...") or bulleted ("• ...") formatting.
                </p>
                <textarea
                  rows={4}
                  value={formData.aboutSoftware || ''}
                  onChange={(e) => setFormData({ ...formData, aboutSoftware: e.target.value })}
                  placeholder={'1. Modern and professional interface\n2. Fast and lightweight performance\n3. Easy installation and setup\n4. User-friendly experience\n5. Production-ready functionality'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Structured Points: About This Source Code */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>About This Source Code (Structured Points)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">One point per line (1. ... or • ...)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Write what is included in the source code, technologies, customization rights, and other important information.
                </p>
                <textarea
                  rows={4}
                  value={formData.aboutSource || ''}
                  onChange={(e) => setFormData({ ...formData, aboutSource: e.target.value })}
                  placeholder={'1. Complete source code included\n2. Clean and organized project structure\n3. Easy to customize\n4. Included project files and schemas\n5. Standard commercial license included'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Optional Preview / Demo Links (Phase 9) */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Preview & Demo Links (Optional)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.previewEnabled ?? true}
                      onChange={(e) => setFormData({ ...formData, previewEnabled: e.target.checked })}
                      className="rounded text-cyan-500"
                    />
                    <span>Show Previews</span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Optional public demo links for buyers to inspect the product live. If empty, the demo button is hidden.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Website / Web App Preview URL
                    </label>
                    <input
                      type="url"
                      value={formData.websitePreviewUrl || ''}
                      onChange={(e) => setFormData({ ...formData, websitePreviewUrl: e.target.value })}
                      placeholder="https://preview.example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      APK / Video / Demo Link
                    </label>
                    <input
                      type="url"
                      value={formData.apkPreviewUrl || ''}
                      onChange={(e) => setFormData({ ...formData, apkPreviewUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=... or direct demo"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & VISUALS */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Primary Cover Image */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>Primary Cover Image</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Recommended aspect ratio: <strong>16:10 or 16:9</strong> (e.g. 1200x750px).
                    </p>
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20 shrink-0">
                    <UploadCloud className="w-4 h-4 text-black" />
                    <span>Upload Cover File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview Box */}
                <div className="relative aspect-[16/9] max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30">
                  {formData.demoImages && formData.demoImages[0] ? (
                    <img
                      src={formData.demoImages[0]}
                      alt="Product Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono space-y-2">
                      <ImageIcon className="w-8 h-8" />
                      <span>No cover image selected</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Cover Image URL (or paste direct link):</label>
                  <input
                    type="text"
                    value={formData.demoImages?.[0] || ''}
                    onChange={(e) => {
                      const updated = [...(formData.demoImages || [])];
                      if (updated.length > 0) updated[0] = e.target.value;
                      else updated.push(e.target.value);
                      setFormData({ ...formData, demoImages: updated });
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Gallery Screenshots */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Gallery & In-App Screenshots ({(formData.demoImages?.length || 1) - 1} Additional)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Showcase application screens, dashboards, checkout flows, and backend panels.
                    </p>
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer shrink-0">
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <span>Add Screenshots</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Screenshots Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.demoImages?.slice(1).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-white/10"
                    >
                      <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx + 1)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                        title="Delete Screenshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add image URL manually */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste screenshot image URL..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-mono font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & TERMS */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Pricing Model Selector: Paid vs Free */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span>Pricing Type / Marketplace Access *</span>
                  </label>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    formData.pricingType === 'free'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {formData.pricingType === 'free' ? '100% Free Software' : 'Paid Commercial Release'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pricingType: 'paid', price: formData.price && formData.price > 0 ? formData.price : 1500 })}
                    className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      (formData.pricingType ?? 'paid') === 'paid'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/25 font-extrabold'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Paid (PKR Pricing)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pricingType: 'free', price: 0 })}
                    className={`py-3 px-4 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.pricingType === 'free'
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/25 font-extrabold'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Free Software (PKR 0)</span>
                  </button>
                </div>

                {formData.pricingType === 'free' ? (
                  <p className="text-[11px] text-emerald-400/95 font-mono bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                    🆓 <strong>Free Software Mode Active:</strong> Software binary / APK price is set to PKR 0. Users can download directly without payment proof or admin verification.
                  </p>
                ) : (
                  <p className="text-[11px] text-cyan-400/90 font-mono bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
                    💳 <strong>Paid Release Mode:</strong> Requires PKR payment via bank / wallet, proof submission, and manual admin verification before unlocking downloads.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  formData.pricingType === 'free'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-900 border-white/10'
                }`}>
                  <label className={`block text-xs font-mono font-bold ${
                    formData.pricingType === 'free' ? 'text-emerald-300' : 'text-cyan-300'
                  }`}>
                    Software / Binary Price (PKR) {formData.pricingType === 'free' ? '(FREE)' : '*'}
                  </label>
                  <p className="text-[10px] text-slate-400">
                    {formData.pricingType === 'free'
                      ? 'Free products are PKR 0. No payment required.'
                      : 'Price in PKR for compiled binary / APK ready to install.'}
                  </p>
                  <input
                    type="number"
                    disabled={formData.pricingType === 'free'}
                    required={formData.pricingType !== 'free'}
                    value={formData.pricingType === 'free' ? 0 : (formData.price ?? 0)}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value), currency: 'PKR' })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-base font-black font-mono focus:outline-none ${
                      formData.pricingType === 'free'
                        ? 'bg-slate-950/70 border-emerald-500/30 text-emerald-400 cursor-not-allowed opacity-90'
                        : 'bg-slate-950 border-white/10 text-white focus:border-cyan-500'
                    }`}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                  <label className="block text-xs font-mono text-indigo-300 font-bold">
                    Full Source Code Price (PKR)
                  </label>
                  <p className="text-[10px] text-slate-400">Optional developer source license price in PKR.</p>
                  <input
                    type="number"
                    value={formData.sourcePrice ?? 0}
                    onChange={(e) => setFormData({ ...formData, sourcePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-base font-black font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">License Classification</label>
                  <select
                    value={formData.licenseType || 'Standard Commercial'}
                    onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as LicenseType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Single App License">Single App License</option>
                    <option value="Standard Commercial">Standard Commercial</option>
                    <option value="Extended Commercial">Extended Commercial</option>
                    <option value="Full Source Rights">Full Source Rights</option>
                    <option value="Enterprise Exclusive">Enterprise Exclusive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Support & Maintenance Terms</label>
                  <input
                    type="text"
                    value={formData.supportTerms || ''}
                    onChange={(e) => setFormData({ ...formData, supportTerms: e.target.value })}
                    placeholder="30 days direct developer support included."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Commercial License Terms</label>
                <textarea
                  rows={3}
                  value={formData.licenseTerms || ''}
                  onChange={(e) => setFormData({ ...formData, licenseTerms: e.target.value })}
                  placeholder="Official license terms printed on customer certificates..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.commercialUseAllowed ?? true}
                    onChange={(e) => setFormData({ ...formData, commercialUseAllowed: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  Commercial Use
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.modificationAllowed ?? true}
                    onChange={(e) => setFormData({ ...formData, modificationAllowed: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  Modification
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.redistributionAllowed ?? false}
                    onChange={(e) => setFormData({ ...formData, redistributionAllowed: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  Redistribution
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.resaleAllowed ?? false}
                    onChange={(e) => setFormData({ ...formData, resaleAllowed: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  Resale Rights
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: SOFTWARE & APK BUILD */}
          {activeTab === 'apk' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Software Binary / APK Package File</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Upload APK or executable package file for buyer instant delivery.
                    </p>
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20 shrink-0">
                    <UploadCloud className="w-4 h-4 text-black" />
                    <span>Select APK File (.apk)</span>
                    <input
                      type="file"
                      accept=".apk,.exe,.zip,.dmg"
                      onChange={handleApkFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Progress Bar if active */}
                {apkUploading && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-emerald-400">
                      <span>Uploading APK Package...</span>
                      <span>{apkUploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${apkUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Direct Download URL / Cloud Key</label>
                    <input
                      type="text"
                      value={formData.apkUrl || ''}
                      onChange={(e) => setFormData({ ...formData, apkUrl: e.target.value })}
                      placeholder="https://storage.affyofficial.com/builds/app.apk"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Calculated Package Size</label>
                    <input
                      type="text"
                      value={formData.apkSize || '24.5 MB'}
                      onChange={(e) => setFormData({ ...formData, apkSize: e.target.value })}
                      placeholder="e.g. 24.5 MB"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SOURCE CODE PACKAGE */}
          {activeTab === 'source' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <FolderArchive className="w-4 h-4 text-indigo-400" />
                      <span>Complete Source Code Archive (.ZIP)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Upload complete repository ZIP or configure private storage link.
                    </p>
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/20 shrink-0">
                    <UploadCloud className="w-4 h-4 text-white" />
                    <span>Select Source ZIP (.zip)</span>
                    <input
                      type="file"
                      accept=".zip,.tar.gz,.rar"
                      onChange={handleSourceZipSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Progress Bar if active */}
                {sourceUploading && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-indigo-400">
                      <span>Uploading Source Code Archive...</span>
                      <span>{sourceUploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${sourceUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Source ZIP Download URL</label>
                    <input
                      type="text"
                      value={formData.sourceZipUrl || ''}
                      onChange={(e) => setFormData({ ...formData, sourceZipUrl: e.target.value })}
                      placeholder="https://storage.affyofficial.com/source/project.zip"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Source Code Archive Size</label>
                    <input
                      type="text"
                      value={formData.sourceSize || '15.2 MB'}
                      onChange={(e) => setFormData({ ...formData, sourceSize: e.target.value })}
                      placeholder="e.g. 15.2 MB"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tech Stack Tags Manager */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-xs font-mono text-slate-300">
                    Technology Stack & Architecture Frameworks
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.techStack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-indigo-500/30 text-xs font-mono flex items-center gap-1.5"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(idx)}
                          className="hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="Add tech (e.g. Kotlin, Jetpack Compose, Express)..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-indigo-300 text-xs font-mono font-bold hover:bg-slate-700 cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* About This Source Code (Detailed Structured Breakdown) */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>About This Source Code (Structured Points)</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">One point per line</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Specify what is included in the source code package, modular architecture, database schemas, and customization guidance.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.aboutSource || ''}
                    onChange={(e) => setFormData({ ...formData, aboutSource: e.target.value })}
                    placeholder={'1. Complete source code included\n2. Clean and organized project structure\n3. Easy to customize\n4. Included project files and schemas\n5. Standard commercial license included'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEATURES & SPECS */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Feature Bullets */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  Core Feature Bullet Points
                </label>
                <div className="space-y-2">
                  {formData.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add feature item..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs font-mono hover:bg-cyan-400 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <label className="block text-xs font-mono text-slate-300 font-bold">
                  System Requirements & Compatibility
                </label>
                <div className="space-y-2">
                  {formData.requirements?.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{req}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    placeholder="Add requirement (e.g. Android 8.0+, 2GB RAM)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs font-mono hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:brightness-110 text-black font-black text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-black" />
              )}
              <span>{isSubmitting ? 'Saving...' : 'Save & Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
