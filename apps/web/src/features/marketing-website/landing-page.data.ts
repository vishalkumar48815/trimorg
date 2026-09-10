import {
  BarChart3,
  Boxes,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const featureItems: FeatureItem[] = [
  {
    title: 'Rapid POS & Invoicing',
    description: 'Sub-second barcode checkout, split tenders, thermal printing, and instant WhatsApp receipts.',
    icon: Receipt,
    badge: '< 2s Checkout',
  },
  {
    title: 'Real-Time Inventory Control',
    description: 'Live stock counts across branches, automated low-stock warnings, and barcode label printing.',
    icon: Boxes,
    badge: 'Live Sync',
  },
  {
    title: 'Customer & Supplier Ledgers',
    description: 'Track outstanding balances (Udhaar/Credit), payment history, and automate collection reminders.',
    icon: Users,
    badge: 'Zero Math Errors',
  },
  {
    title: 'GST & Profit Reports',
    description: 'Automated tax calculations, gross profit margin analytics, and 1-click tax report spreadsheets.',
    icon: BarChart3,
    badge: 'Tax Ready',
  },
];

export const workItems: StepItem[] = [
  {
    title: '1. Import Products & Stock',
    description: 'Upload your Excel catalog or scan barcodes to set up products, categories, and initial stock in 2 minutes.',
  },
  {
    title: '2. Run Daily Counter Billing',
    description: 'Scan barcodes, accept cash/UPI/card payments, print thermal receipts, or send WhatsApp bills in seconds.',
  },
  {
    title: '3. Track Stock & Profit Daily',
    description: 'Monitor live sales, gross margins, low stock alerts, and customer dues from anywhere on desktop or mobile.',
  },
];

export const benefitItems: BenefitItem[] = [
  {
    title: 'Faster Counter Checkouts',
    description: 'Eliminate customer queues with instantaneous product searches and one-click receipt generation.',
    icon: Sparkles,
  },
  {
    title: 'Zero Stockout Surprises',
    description: 'Automated low-stock notifications and supplier purchase orders keep your shelves always stocked.',
    icon: Boxes,
  },
  {
    title: 'Bank-Grade Data Security',
    description: '256-bit AES encryption, role permissions, daily backups, and 100% data ownership with Excel exports.',
    icon: ShieldCheck,
  },
];

export const trustedByLogos: string[] = [
  'Wholesale Hubs',
  'Retail Supermarts',
  'Grocery & FMCG',
  'Electrical Stores',
  'Hardware & Tools',
  'Distribution Chains',
];

