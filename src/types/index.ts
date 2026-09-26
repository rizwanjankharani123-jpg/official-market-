export type PurchaseType = 'software' | 'source_code' | 'custom_project' | 'bundle';

export type OrderStatus =
  | 'payment_pending'
  | 'proof_submitted'
  | 'under_review'
  | 'payment_confirmed'
  | 'payment_rejected'
  | 'processing'
  | 'completed';

export type RequestStatus =
  | 'New'
  | 'Reviewing'
  | 'Planned'
  | 'In Development'
  | 'Completed'
  | 'Rejected/Closed'
  | 'new'
  | 'reviewing'
  | 'contacted'
  | 'quoted'
  | 'in_development'
  | 'completed'
  | 'rejected'
  | 'closed'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'declined'
  | 'in_progress';

export type QuotationStatus = 'sent' | 'accepted' | 'rejected' | 'converted_to_order';

export type PaymentMethodType = 'bank' | 'jazzcash' | 'easypaisa' | 'binance' | 'crypto' | 'custom';

export interface VersionRelease {
  version: string;
  releaseNotes: string;
  releasedAt: string;
  apkUrl?: string;
  sourceZipUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  aboutSoftware?: string; // Detailed structured points describing the software/APK
  aboutSource?: string;   // Detailed structured points describing the source code package
  category: 'Android App' | 'Desktop Software' | 'Web Platform' | 'Full Stack System' | 'API & Backend' | 'Utility Tool';
  version: string;
  releaseNotes?: string;
  versionHistory?: VersionRelease[];
  pricingType?: 'paid' | 'free'; // Paid or 100% Free Software/App
  price: number; // Software / APK price (e.g. PKR - 0 for free)
  currency: string;
  viewsCount?: number;     // Total real product views/impressions
  downloadsCount?: number; // Total free or verified downloads
  demoImages: string[];
  features: string[];
  requirements: string[];
  includedFiles: string[];
  apkUrl?: string;
  apkSize?: string;
  apkPreviewUrl?: string;       // Optional live APK demo/preview link
  websitePreviewUrl?: string;   // Optional live website/web app preview link
  previewEnabled?: boolean;     // Whether preview button is enabled
  // Source Code Details
  sourceAvailable: boolean;
  sourcePrice?: number;
  sourceZipUrl?: string;
  sourceSize?: string;
  techStack: string[];
  licenseType: 'Standard Commercial' | 'Extended Multi-Client' | 'Single App License' | 'Personal Educational';
  licenseTerms: string;
  commercialUseAllowed: boolean;
  redistributionAllowed: boolean;
  resaleAllowed: boolean;
  modificationAllowed: boolean;
  supportTerms: string;
  status: 'published' | 'draft';
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductBundle {
  id: string; // e.g. AFFY-BDL-XXXXXX
  name: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  productIds: string[]; // references to existing products in catalog
  price: number; // PKR bundle price
  currency: string;
  status: 'published' | 'draft';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementType =
  | 'New Product'
  | 'New Version'
  | 'Free Software'
  | 'Deal'
  | 'Giveaway'
  | 'General AFFY OFFICIAL Update'
  | 'new_product'
  | 'new_free_app'
  | 'deal'
  | 'giveaway'
  | 'update'
  | 'general';

export interface MarketplaceAnnouncement {
  id: string;
  title: string;
  shortDescription?: string;
  fullContent?: string;
  message?: string;
  image?: string;
  announcementType?: AnnouncementType;
  type?: AnnouncementType;
  relatedProductId?: string;
  productId?: string;
  bundleId?: string;
  discountBadge?: string;
  linkView?: string;
  status?: 'published' | 'draft';
  active: boolean;
  publishedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export type SoftwareRequestType = 'software_request' | 'feature_request' | 'software_idea' | 'custom_project';

export interface CustomRequest {
  id: string; // e.g. AFFY-REQ-XXXXXX
  name?: string;
  customerName: string;
  email?: string;
  customerEmail: string;
  whatsapp?: string;
  customerPhone?: string;
  requestType?: SoftwareRequestType | string;
  title?: string;
  projectTitle: string;
  completeDescription?: string;
  projectDescription: string;
  requiredFeatures?: string[];
  features: string[];
  platform?: string;
  platforms: string[];
  designRequirements?: string;
  budget: string;
  timeline: string;
  additionalRequirements?: string;
  additionalInfo?: string;
  status: RequestStatus;
  adminNotes?: string;
  estimatedPrice?: number;
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalizedDeal {
  id: string; // e.g. AFFY-DEAL-XXXXXX
  offerName: string;
  description: string;
  eligibleCategories?: string[]; // Empty for all categories
  eligibleProductIds?: string[]; // Empty for all products
  discountType: 'percentage' | 'fixed_pkr';
  discountValue: number; // e.g. 20% or 500 PKR
  startDate: string;
  endDate: string;
  active: boolean;
  eligibilityCondition: 'all_customers' | 'previous_buyers' | 'category_buyers' | 'min_purchases_2' | 'vip_customers';
  minOrdersCount?: number;
  targetCategory?: string;
  promoCode?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'live' | 'ended';

export interface CampaignEvent {
  id: string; // e.g. AFFY-CMP-XXXXXX
  campaignName: string;
  title: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  featuredProductIds: string[];
  discountPercentage?: number;
  offerDescription?: string;
  giveawayId?: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export type GiveawayStatus = 'upcoming' | 'active' | 'ended' | 'archived';

export interface GiveawayRecord {
  id: string; // e.g. AFFY-GW-XXXXXX
  title: string;
  description: string;
  relatedProductId?: string;
  prizeDescription: string;
  startDate: string;
  endDate: string;
  status: GiveawayStatus;
  winnerName?: string;
  winnerEmailMasked?: string;
  winnerCity?: string;
  winnerAnnouncedAt?: string;
  proofImageUrl?: string;
  adminNotes?: string;
  published: boolean; // Only officially published winner records appear in public archive
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  image: string;
  featured: boolean;
  order: number;
  status: 'active' | 'in_development' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  bankName?: string;
  instructions: string;
  qrCodeUrl?: string;
  active: boolean;
  order: number;
}

export interface Order {
  id: string; // e.g. AFFY-ORD-XXXXXX
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerNote?: string;
  productId: string;
  productName: string;
  bundleId?: string;
  bundleName?: string;
  includedProductIds?: string[];
  purchaseType: PurchaseType;
  purchasedVersion?: string; // Captured version at time of purchase
  amount: number;
  currency: string;
  paymentMethodId: string;
  paymentMethodName: string;
  transactionId: string;
  paymentProofUrl?: string;
  status: OrderStatus;
  rejectionReason?: string;
  adminNotes?: string;
  downloadAccessGranted: boolean;
  downloadUrl?: string;
  downloadName?: string;
  pointsEarned?: number;
  invoiceId: string;
  certificateId: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}

export interface Quotation {
  id: string; // e.g. AFFY-QUO-XXXXXX
  requestId: string;
  customerName: string;
  customerEmail: string;
  projectTitle: string;
  scope: string;
  quotationAmount: number;
  currency: string;
  estimatedDays: number;
  deliverables: string[];
  paymentTerms: string;
  status: QuotationStatus;
  validUntil: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  developerName: string;
  developerTitle: string;
  bio: string;
  avatarUrl: string;
  signatureUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsappChannel: string;
  telegram?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  heroHeading: string;
  heroSubheading: string;
  yearsExperience: number;
  completedProjects: number;
  satisfiedClients: number;
  currencySymbol: string;
  defaultCurrency: string;
  rewardPointsPer100PKR?: number; // Configurable rewards rate (default 1 point per 100 PKR)
  // Legal Terms
  softwareTerms: string;
  sourceCodeTerms: string;
  paymentTerms: string;
  refundPolicy: string;
  downloadTerms: string;
}

export interface CertificateData {
  id: string; // AFFY-CERT-XXXXXX
  type: 'software' | 'source_code';
  customerName: string;
  productName: string;
  orderId: string;
  purchaseDate: string;
  certificateId: string;
  licenseRights: string;
  signatureUrl: string;
  developerName: string;
  developerTitle: string;
  brandName: string;
}

export interface InvoiceData {
  id: string; // AFFY-INV-XXXXXX
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  purchaseType: PurchaseType;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: 'waiting_approval' | 'confirmed' | 'rejected';
  terms: string;
  developerName: string;
  developerTitle: string;
  brandName: string;
  email: string;
  phone: string;
}
