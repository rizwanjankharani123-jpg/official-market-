import { Product, PortfolioProject, PaymentMethod, SiteSettings, Order, CustomRequest } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'AFFY OFFICIAL',
  developerName: 'Aftab',
  developerTitle: 'Web Developer & Software Developer',
  bio: "Hi, I'm Aftab. I build production-ready web platforms, Android APKs, and scalable software systems. AFFY OFFICIAL is my official platform for presenting, developing, and providing verified software applications, commercial source-code packages, and custom client engineering solutions.",
  avatarUrl: 'https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg',
  signatureUrl: 'https://i.ibb.co/4gThRdST/1000484283-removebg-preview.png',
  email: 'affyofficial.dev@gmail.com',
  phone: '+92 326 3724861',
  whatsapp: '+923263724861',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d',
  heroHeading: "Building Elite Software, Mobile Apps & Scalable Systems",
  heroSubheading: "Explore verified Android APKs, purchase commercial-grade source code licenses, or commission custom software built to your exact specifications.",
  yearsExperience: 2,
  completedProjects: 0,
  satisfiedClients: 0,
  currencySymbol: 'PKR',
  defaultCurrency: 'PKR',
  softwareTerms: `1. Digital Goods Delivery: All software and APK packages provided on AFFY OFFICIAL are digital goods delivered electronically to your secure order vault.\n2. Manual Payment Verification: For security and fraud prevention, all payments are manually audited via transaction ID and screenshot proof.\n3. License Scope: Software licenses grant full operational rights for your business or personal use.\n4. Support Policy: Software packages include technical assistance and update releases directly from Aftab.\n5. Refund Policy: Digital assets are eligible for review prior to download activation if there is a verified technical incompatibility.`,
  sourceCodeTerms: `1. Commercial Rights: Source code purchases grant you full rights to modify, rebrand, compile, and deploy for commercial client solutions.\n2. Redistribution Prohibitions: You may NOT resell, publically distribute, or open-source the raw uncompiled source files without explicit written consent.\n3. Third-Party Dependencies: The purchaser is responsible for configuring their own API credentials (e.g. Firebase, payment keys).\n4. Intellectual Property: AFFY OFFICIAL retains foundational copyright on the architecture unless a full buyout agreement is signed.`,
  paymentTerms: `1. Payment Verification: Submit your exact Transaction ID (TRX ID) and clear screenshot proof of payment transfer.\n2. Manual Audit: Payment proofs are manually audited within 15 to 60 minutes.\n3. Supported Gateways: EasyPaisa and JazzCash mobile accounts.\n4. Fraud Prevention: Fraudulent transaction slips will be rejected immediately.`,
  refundPolicy: `Refunds are available if requested before the secure download link is generated or if a verified defect is demonstrated that cannot be rectified within 7 business days.`,
  downloadTerms: `Download links are securely signed and tied to your verified Order ID. Sharing private download credentials or direct file binaries publicly is prohibited.`
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_PROJECTS: PortfolioProject[] = [];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-easypaisa-01',
    name: 'EasyPaisa',
    type: 'easypaisa',
    accountTitle: 'Aftab Ahmed',
    accountNumber: '03263724861',
    instructions: '1. Open EasyPaisa App\n2. Select "Send Money" -> "EasyPaisa Mobile Account"\n3. Enter Mobile Number: 03263724861\n4. Verify Title: Aftab Ahmed\n5. Enter the exact total amount in PKR\n6. Complete payment and copy the Transaction ID (TRX ID) and save receipt screenshot.',
    active: true,
    order: 1
  },
  {
    id: 'pm-jazzcash-02',
    name: 'JazzCash',
    type: 'jazzcash',
    accountTitle: 'Aftab Ahmed',
    accountNumber: '03263724861',
    instructions: '1. Open JazzCash App or dial *786#\n2. Select "Send Money" -> "To JazzCash Account"\n3. Enter Account Number: 03263724861\n4. Confirm recipient name: Aftab Ahmed\n5. Enter the exact total amount in PKR\n6. Take a screenshot of the confirmation & copy the Transaction ID (TRX ID).',
    active: true,
    order: 2
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_CUSTOM_REQUESTS: CustomRequest[] = [];

