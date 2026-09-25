export type PurchaseType = 'software' | 'source_code' | 'custom_project';

export type OrderStatus =
  | 'payment_pending'
  | 'proof_submitted'
  | 'under_review'
  | 'payment_confirmed'
  | 'payment_rejected'
  | 'processing'
  | 'completed';

export type RequestStatus =
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

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  aboutSoftware?: string; // Detailed structured points describing the software/APK
  aboutSource?: string;   // Detailed structured points describing the source code package
  category: 'Android App' | 'Desktop Software' | 'Web Platform' | 'Full Stack System' | 'API & Backend' | 'Utility Tool';
  version: string;
  price: number; // Software / APK price (e.g. USD / PKR)
  currency: string;
  demoImages: string[];
  features: string[];
  requirements: string[];
  includedFiles: string[];
  apkUrl?: string;
  apkSize?: string;
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
  purchaseType: PurchaseType;
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
  invoiceId: string;
  certificateId: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}

export interface CustomRequest {
  id: string; // e.g. AFFY-REQ-XXXXXX
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  projectTitle: string;
  projectDescription: string;
  platforms: string[];
  features: string[];
  designRequirements?: string;
  budget: string;
  timeline: string;
  additionalInfo?: string;
  status: RequestStatus;
  adminNotes?: string;
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
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
