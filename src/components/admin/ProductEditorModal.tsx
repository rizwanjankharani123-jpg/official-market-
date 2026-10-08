import React, { useState } from 'react';
import { Product } from '../../types';
import { uploadFileToFirebaseStorage } from '../../lib/firebase';
import { getSafeProductImage, CATEGORY_FALLBACK_IMAGES } from '../../utils/imageFallbacks';
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
  Globe,
  Link,
  ChevronDown,
  ChevronUp,
  DownloadCloud
} from 'lucide-react';

type ProductCategory = 'Android App' | 'Desktop Software' | 'Web Platform' | 'Full Stack System' | 'API & Backend' | 'Utility Tool';
type LicenseType = 'Standard Commercial' | 'Extended Multi-Client' | 'Single App License' | 'Personal Educational';
type ProductStatus = 'published' | 'draft';
type EditorMode = 'quick' | 'advanced';
type TabType = 'general' | 'media' | 'pricing' | 'apk' | 'source' | 'features';

interface ProductEditorModalProps {
  product: Partial<Product>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [editorMode, setEditorMode] = useState<EditorMode>('quick');
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [showAdvancedInQuick, setShowAdvancedInQuick] = useState(false);
  const [showWebsitePreviewInQuick, setShowWebsitePreviewInQuick] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Android App',
    shortDescription: '',
    fullDescription: '',
    aboutSoftware: '',
    pricingType: product?.pricingType || (product?.price === 0 ? 'free' : 'paid'),
    price: product?.pricingType === 'free' || product?.price === 0 ? 0 : (product?.price ?? 0),
    currency: 'PKR',
    version: 'v1.0.0',
    features: product?.features || [],
    requirements: product?.requirements || [],
    includedFiles: product?.includedFiles || [],
    demoImages: product?.demoImages || [],
    apkUrl: '',
    apkSize: '',
    apkBadge: 'Free APK',
    isApkOnly: true,
    apkPreviewUrl: '',
    websitePreviewUrl: '',
    previewEnabled: true,
    sourceAvailable: false,
    sourcePrice: 0,
    sourceZipUrl: '',
    sourceSize: '',
    techStack: product?.techStack || [],
    licenseType: 'Standard Commercial',
    licenseTerms: 'Commercial deployment rights included.',
    commercialUseAllowed: true,
    redistributionAllowed: false,
    resaleAllowed: false,
    modificationAllowed: true,
    supportTerms: 'Direct developer support included.',
    status: 'published',
    featured: product?.featured ?? false,
    ...product
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Upload states
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
  const [directImageUrlInput, setDirectImageUrlInput] = useState('');

  if (!isOpen) return null;

  // Real cover image file upload to Firebase Storage
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Cover image must be under 20MB');
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

      const updatedImages = [downloadUrl, ...(formData.demoImages || []).filter(img => img !== downloadUrl)];
      setFormData((prev) => ({ ...prev, demoImages: updatedImages }));
    } catch (err: any) {
      setErrorMessage('Image upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setCoverUploading(false);
    }
  };

  // Add image from direct link (IBB, Imgur, direct URL)
  const handleAddDirectImageUrl = () => {
    const url = directImageUrlInput.trim();
    if (!url) return;
    const updatedImages = [url, ...(formData.demoImages || []).filter(img => img !== url)];
    setFormData((prev) => ({ ...prev, demoImages: updatedImages }));
    setDirectImageUrlInput('');
  };

  // Real APK file upload handler with Firebase Storage
  const handleApkFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setApkUploading(true);
    setApkUploadProgress(0);

    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    try {
      const { downloadUrl } = await uploadFileToFirebaseStorage(
        file,
        'products/apks',
        (progress) => setApkUploadProgress(progress)
      );

      setFormData((prev) => ({
        ...prev,
        apkSize: fileSize,
        apkUrl: downloadUrl
      }));
    } catch (err: any) {
      setErrorMessage('APK file upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setApkUploading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErrorMessage('Product / App name is required.');
      return;
    }

    const isFree = formData.pricingType === 'free';
    if (!isFree && (formData.price === undefined || formData.price === null || formData.price < 0)) {
      setErrorMessage('Valid price in PKR is required (or select Free).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const safeCover = getSafeProductImage(formData.demoImages, formData.category);
      const cleanedImages = (formData.demoImages || [])
        .filter((img) => img && typeof img === 'string' && img.trim() !== '' && img !== 'null' && img !== 'undefined');

      const finalDemoImages = cleanedImages.length > 0 ? cleanedImages : [safeCover];

      // Clean empty arrays so they don't render empty sections on the frontend
      const cleanFeatures = (formData.features || []).filter(f => f && f.trim().length > 0);
      const cleanReqs = (formData.requirements || []).filter(r => r && r.trim().length > 0);
      const cleanFiles = (formData.includedFiles || []).filter(f => f && f.trim().length > 0);
      const cleanTech = (formData.techStack || []).filter(t => t && t.trim().length > 0);

      const payload: Partial<Product> = {
        ...formData,
        name: formData.name.trim(),
        category: formData.category || 'Android App',
        shortDescription: formData.shortDescription?.trim() || '',
        fullDescription: formData.fullDescription?.trim() || '',
        aboutSoftware: formData.aboutSoftware?.trim() || '',
        demoImages: finalDemoImages,
        apkUrl: formData.apkUrl?.trim() || '',
        apkSize: formData.apkSize?.trim() || '',
        websitePreviewUrl: formData.websitePreviewUrl?.trim() || '',
        features: cleanFeatures,
        requirements: cleanReqs,
        includedFiles: cleanFiles,
        techStack: cleanTech,
        featured: Boolean(formData.featured),
        pricingType: isFree ? 'free' : 'paid',
        price: isFree ? 0 : Number(formData.price || 0),
        currency: 'PKR',
        isApkOnly: formData.category === 'Android App' && !formData.sourceAvailable
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFree = formData.pricingType === 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/40 rounded-3xl p-4 sm:p-7 shadow-2xl shadow-cyan-950/60 my-6 max-h-[95vh] flex flex-col text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                {formData.id ? 'Edit Product' : 'Add New App / Software'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {editorMode === 'quick' ? '⚡ Quick Mode (Fast & Simple)' : '🎛️ Advanced Tab Mode'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
              {formData.name || 'New Software / APK Release'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Toggle */}
            <div className="flex bg-slate-900 p-0.5 rounded-xl border border-white/10 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setEditorMode('quick')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorMode === 'quick' ? 'bg-cyan-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Quick
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('advanced')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorMode === 'advanced' ? 'bg-cyan-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Advanced
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar">
          {/* ======================================================== */}
          {/* ⚡ QUICK & EASY MODE (Single-Page Streamlined Form)     */}
          {/* ======================================================== */}
          {editorMode === 'quick' && (
            <div className="space-y-4 text-left">
              {/* Row 1: App Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    App / Software Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. CapCut Pro APK, Apex POS, WhatsApp Bot..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category || 'Android App'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Android App">Android App (APK)</option>
                    <option value="Desktop Software">Desktop Software (PC/Mac)</option>
                    <option value="Web Platform">Web Platform / Website</option>
                    <option value="Utility Tool">Utility Tool / Automation</option>
                    <option value="Full Stack System">Full-Stack SaaS</option>
                    <option value="API & Backend">API & Backend Engine</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Pricing (1-Click Easy Free / Paid Selector) */}
              <div className="p-3.5 rounded-2xl bg-[#070b14] border border-cyan-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    <span>Price & Distribution Type</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Choose Free or Paid</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pricingType: 'free', price: 0, apkBadge: 'Free APK' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isFree
                        ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20 border-emerald-400'
                        : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    <span>🟢 100% FREE (PKR 0)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pricingType: 'paid', price: formData.price && formData.price > 0 ? formData.price : 1500, apkBadge: 'Pro APK' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !isFree
                        ? 'bg-cyan-500 text-black font-extrabold shadow-md shadow-cyan-500/20 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    <span>🔵 PAID SOFTWARE (PKR)</span>
                  </button>
                </div>

                {!isFree && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Price in PKR:</span>
                    <input
                      type="number"
                      min={100}
                      value={formData.price ?? 1500}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="e.g. 1500"
                      className="w-40 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Direct APK / Download Link (The Core Feature!) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#080d1a] to-[#04060c] border border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-950/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-cyan-400" />
                    <span>Direct Download Link (APK / Drive / MediaFire)</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">User Downloads From Here</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste your direct download link below (Google Drive, MediaFire, Mega, Dropbox, or direct .apk URL). Or upload the APK directly.
                </p>

                <div className="space-y-2">
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input
                      type="url"
                      value={formData.apkUrl || ''}
                      onChange={(e) => setFormData({ ...formData, apkUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/... or https://mediafire.com/..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Direct File Upload Option */}
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{apkUploading ? `Uploading (${apkUploadProgress}%)...` : 'Or Upload APK File'}</span>
                        <input
                          type="file"
                          accept=".apk,.zip,.rar,.exe,.tar.gz"
                          onChange={handleApkFileSelect}
                          className="hidden"
                          disabled={apkUploading}
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">File Size (Optional):</span>
                      <input
                        type="text"
                        value={formData.apkSize || ''}
                        onChange={(e) => setFormData({ ...formData, apkSize: e.target.value })}
                        placeholder="e.g. 24.5 MB"
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-[11px] font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {formData.apkUrl && (
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Download Link Set: {formData.apkUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4: App Picture / Thumbnail (Auto-adjusts for 16:9, 1:1, or 9:16) */}
              <div className="p-4 rounded-2xl bg-[#070b14] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-200 font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>App Picture / Thumbnail (Auto-Fits All Sizes)</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-300">Upload or Paste Link</span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Upload an image file OR paste an ImgBB / direct image link. Auto-adjusts for YouTube thumbnail (16:9), profile (1:1), or app screenshot!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Left: Input Options */}
                  <div className="sm:col-span-8 space-y-2">
                    {/* Option A: Upload File */}
                    <div className="flex items-center gap-2">
                      <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-cyan-400" />
                        <span>{coverUploading ? `Uploading (${coverUploadProgress}%)...` : 'Upload Picture File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          className="hidden"
                          disabled={coverUploading}
                        />
                      </label>
                    </div>

                    {/* Option B: Direct Link / IBB */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={directImageUrlInput}
                        onChange={(e) => setDirectImageUrlInput(e.target.value)}
                        placeholder="Or paste ImgBB / direct image link (https://...)"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddDirectImageUrl}
                        className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold cursor-pointer transition-colors"
                      >
                        Set Link
                      </button>
                    </div>
                  </div>

                  {/* Right: Auto-Fitting Image Preview */}
                  <div className="sm:col-span-4 flex justify-center">
                    <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
                      <img
                        src={getSafeProductImage(formData.demoImages, formData.category)}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                        Auto-Fit
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Short Tagline / Summary */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Short Tagline / Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Free video editor with 4K export and premium unlocked features."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Row 6: Detailed "About This App" (Optional - won't show empty boxes if left blank) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-slate-300">
                    About This App / Details (Optional)
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Only shows on page if filled</span>
                </div>
                <textarea
                  rows={3}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="App highlights, how to install, or instructions. (If you leave this empty, no empty box will show to users)."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Row 7: Website Live Preview URL (Optional - only for websites) */}
              <div className="border-t border-white/5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWebsitePreviewInQuick(!showWebsitePreviewInQuick)}
                  className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>
                    {showWebsitePreviewInQuick ? 'Hide Website Preview Link' : 'Website Live Preview Link (Websites Only - Click to Add)'}
                  </span>
                  {showWebsitePreviewInQuick ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showWebsitePreviewInQuick && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                    <label className="block text-[11px] font-mono text-slate-300">Live Website URL</label>
                    <input
                      type="url"
                      value={formData.websitePreviewUrl || ''}
                      onChange={(e) => setFormData({ ...formData, websitePreviewUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500">Leave blank for APKs. Only fill if this is a live website.</p>
                  </div>
                )}
              </div>

              {/* Collapsible: Optional Additional Options (Features, Version, Status) */}
              <div className="border-t border-white/5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedInQuick(!showAdvancedInQuick)}
                  className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showAdvancedInQuick ? 'Hide Extra Options' : '➕ More Options: Version, Features, Featured ⭐'}</span>
                  {showAdvancedInQuick ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedInQuick && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Version</label>
                        <input
                          type="text"
                          value={formData.version || 'v1.0.0'}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                          placeholder="v1.0.0"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Status</label>
                        <select
                          value={formData.status || 'published'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Featured: ⭐</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                          className={`w-full py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                            formData.featured ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-950 text-slate-400 border-white/10'
                          }`}
                        >
                          {formData.featured ? '⭐ Featured: ON' : 'Featured: OFF'}
                        </button>
                      </div>
                    </div>

                    {/* Features list */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Features (Optional)</label>
                      <div className="flex gap-2">
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
                          placeholder="Type feature and click Add..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {formData.features && formData.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {formData.features.map((feat, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-300">
                              <span>{feat}</span>
                              <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-slate-500 hover:text-rose-400">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🎛️ ADVANCED MULTI-TAB MODE (Optional For Complex Configs)  */}
          {/* ======================================================== */}
          {editorMode === 'advanced' && (
            <div className="space-y-4">
              <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-white/5">
                {[
                  { id: 'general', label: 'General', icon: Package },
                  { id: 'media', label: 'Media', icon: ImageIcon },
                  { id: 'pricing', label: 'Pricing', icon: DollarSign },
                  { id: 'apk', label: 'APK Link', icon: Smartphone },
                  { id: 'source', label: 'Source Code', icon: Code2 },
                  { id: 'features', label: 'Features', icon: Layers }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {activeTab === 'general' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Product Title</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription || ''}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'apk' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Direct APK Download Link</label>
                    <input
                      type="url"
                      value={formData.apkUrl || ''}
                      onChange={(e) => setFormData({ ...formData, apkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">File Size</label>
                    <input
                      type="text"
                      value={formData.apkSize || ''}
                      onChange={(e) => setFormData({ ...formData, apkSize: e.target.value })}
                      placeholder="e.g. 25 MB"
                      className="w-40 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Manage image URLs</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={directImageUrlInput}
                      onChange={(e) => setDirectImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddDirectImageUrl}
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono cursor-pointer"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingTypeAdv"
                        checked={isFree}
                        onChange={() => setFormData({ ...formData, pricingType: 'free', price: 0 })}
                      />
                      <span>100% Free</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingTypeAdv"
                        checked={!isFree}
                        onChange={() => setFormData({ ...formData, pricingType: 'paid', price: formData.price || 1500 })}
                      />
                      <span>Paid</span>
                    </label>
                  </div>
                  {!isFree && (
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Price (PKR)</label>
                      <input
                        type="number"
                        value={formData.price ?? 1500}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-40 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'source' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sourceAvailable ?? false}
                      onChange={(e) => setFormData({ ...formData, sourceAvailable: e.target.checked })}
                    />
                    <span>Source Code Available for Sale</span>
                  </label>
                  {formData.sourceAvailable && (
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Source Code Price (PKR)</label>
                      <input
                        type="number"
                        value={formData.sourcePrice ?? 0}
                        onChange={(e) => setFormData({ ...formData, sourcePrice: Number(e.target.value) })}
                        className="w-40 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add feature..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  {formData.features && (
                    <div className="space-y-1">
                      {formData.features.map((f, i) => (
                        <div key={i} className="flex justify-between items-center text-xs p-1.5 rounded bg-slate-900 text-slate-300">
                          <span>{f}</span>
                          <button type="button" onClick={() => handleRemoveFeature(i)} className="text-rose-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 hover:brightness-110 text-black font-black text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 btn-shimmer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-black" />
              )}
              <span>{isSubmitting ? 'Publishing...' : '🚀 Save & Publish to Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
