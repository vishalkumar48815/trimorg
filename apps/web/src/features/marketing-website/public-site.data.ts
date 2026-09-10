export interface PublicNavLink {
  label: string;
  to: string;
}

export interface PublicFooterColumn {
  title: string;
  links: PublicNavLink[];
}

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'core' | 'billing' | 'features' | 'security' | 'operations' | 'support';
}

/**
 * 3 Core Fixed FAQs that appear on every page for consistent trust building
 */
export const CORE_FIXED_FAQS: FAQItem[] = [
  {
    id: 'core-1',
    category: 'core',
    question: 'What is TrimOrg and who is it built for?',
    answer:
      'TrimOrg is an all-in-one Business Operating System (BOS) purpose-built for retail shop owners, wholesalers, distributors, and automotive/EV workshops to streamline POS billing, real-time inventory, job cards, customer CRM, and GST tax compliance.',
  },
  {
    id: 'core-2',
    category: 'core',
    question: 'Can I start with a free trial without adding a credit card?',
    answer:
      'Yes, you get a 14-day full-access trial on all tiers immediately upon sign up. No credit card or upfront payment is required, allowing you to test billing, barcodes, and staff workflows risk-free.',
  },
  {
    id: 'core-3',
    category: 'core',
    question: 'Is my data secure and can I export my records anytime?',
    answer:
      'All business records are encrypted at rest and in transit with enterprise-grade isolation and automated daily backups. You retain full ownership and can export your products, invoices, customer histories, and GST reports to Excel or PDF at any time.',
  },
];

/**
 * 20+ Comprehensive, SEO-rich FAQs categorized by topic
 */
export const COMPREHENSIVE_FAQS: FAQItem[] = [
  // Pricing & Billing
  {
    id: 'pricing-1',
    category: 'billing',
    question: 'How does TrimOrg pricing work for multi-branch workshops?',
    answer:
      'Our plans scale with your physical locations. The Starter plan covers 1 branch, Growth covers up to 2 branches, and Business includes 5 branches. Additional branches can be seamlessly added as your network expands without data fragmentation.',
  },
  {
    id: 'pricing-2',
    category: 'billing',
    question: 'Do you offer different pricing for India and international businesses?',
    answer:
      'Yes. We support localized currency pricing (INR ₹ for Indian SMEs via UPI, Net Banking, and local cards, and USD $ for international businesses via Stripe) to ensure affordability and regional tax alignment.',
  },
  {
    id: 'pricing-3',
    category: 'billing',
    question: 'Can I switch between monthly and annual billing plans?',
    answer:
      'Yes. You can switch between monthly and annual billing at any time in your company settings. Choosing annual billing saves you 20% on all subscription tiers.',
  },
  {
    id: 'pricing-4',
    category: 'billing',
    question: 'What happens if I cancel my subscription?',
    answer:
      'You can cancel your subscription at any time without cancellation fees. Your workspace will remain active until the end of the paid billing period, after which your data is preserved safely in read-only mode for download.',
  },

  // Features & Operations
  {
    id: 'feat-1',
    category: 'features',
    question: 'How does Point of Sale (POS) work on mobile and desktop?',
    answer:
      'TrimOrg POS is fully responsive with instant search, barcode scanner integration, quick custom discounts, and one-click invoice generation optimized for both touchscreens and desktop keyboards.',
  },
  {
    id: 'feat-2',
    category: 'features',
    question: 'Does TrimOrg support EV battery health and custom workshop job cards?',
    answer:
      'Yes. Our specialized workshop module allows service advisors and mechanics to track vehicle service history, assign technician job cards, record battery state-of-health (SoH), and track part replacements.',
  },
  {
    id: 'feat-3',
    category: 'features',
    question: 'Can I manage multi-warehouse stock transfers and low-stock alerts?',
    answer:
      'Yes. TrimOrg tracks inventory counts across multiple branches and warehouses with automatic reorder triggers, batch tracking, serial numbers, and inter-branch stock transfer workflows.',
  },
  {
    id: 'feat-4',
    category: 'features',
    question: 'Does TrimOrg generate GST-ready tax invoices and reports?',
    answer:
      'Yes. Invoices automatically calculate CGST, SGST, IGST, and HSN/SAC codes. You can export GSTR-1 and GSTR-3B ready summary spreadsheets with a single click at the end of each tax period.',
  },
  {
    id: 'feat-5',
    category: 'features',
    question: 'Can I send automated invoice alerts to customers via WhatsApp or SMS?',
    answer:
      'Yes. Customers receive instant WhatsApp and SMS updates with invoice download links, service completion alerts, and payment receipts, elevating your brand communication.',
  },

  // Team & Security
  {
    id: 'ops-1',
    category: 'operations',
    question: 'How do staff accounts and role-based permissions work?',
    answer:
      'You can invite cashiers, inventory managers, service technicians, and accountants with customized granular permissions to ensure staff only access the data and actions necessary for their role.',
  },
  {
    id: 'ops-2',
    category: 'operations',
    question: 'Can I import my existing product catalog and customer lists?',
    answer:
      'Yes. TrimOrg provides guided CSV/Excel import tools to upload thousands of SKUs, suppliers, and customer contact records in under two minutes.',
  },
  {
    id: 'ops-3',
    category: 'operations',
    question: 'Does TrimOrg work with standard thermal receipt printers and barcode scanners?',
    answer:
      'Yes. TrimOrg is compatible with standard USB and Bluetooth thermal receipt printers (58mm / 80mm), handheld barcode scanners, and wireless barcode hardware without requiring special drivers.',
  },
  {
    id: 'ops-4',
    category: 'operations',
    question: 'Is there an offline mode if our internet connection drops?',
    answer:
      'Yes. The POS cashier module caches critical product catalogs locally in the browser so you can continue billing during temporary internet disruptions and sync transactions once reconnected.',
  },

  // Support & Company
  {
    id: 'sup-1',
    category: 'support',
    question: 'What level of customer support do you provide?',
    answer:
      'Starter plans include standard email support with a 24-48h SLA. Growth and Business tiers include priority chat, phone onboarding, and a dedicated account manager.',
  },
  {
    id: 'sup-2',
    category: 'support',
    question: 'Can TrimOrg be customized for large enterprise automotive networks?',
    answer:
      'Yes. We offer custom ERP integrations, dedicated database clusters, custom reporting pipelines, and SLA guarantees for enterprise chains with 10+ locations.',
  },
  {
    id: 'sup-3',
    category: 'support',
    question: 'How frequently is TrimOrg updated with new features?',
    answer:
      'We deploy weekly product updates, performance enhancements, and security patches without causing downtime or requiring manual software updates from your team.',
  },
  {
    id: 'sup-4',
    category: 'support',
    question: 'How do I train my staff to use TrimOrg?',
    answer:
      'TrimOrg is designed with an intuitive, clutter-free UI that requires zero technical training. We also provide step-by-step video walkthroughs and live onboarding assistance for your team.',
  },
];

/**
 * Returns 6 FAQs for any page:
 * - 3 fixed core FAQs (common across all pages for trust & brand alignment)
 * - 3 relevant or rotating FAQs from the 20+ FAQ pool
 */
export function getPageFaqs(preferredCategory?: FAQItem['category'], seed = 0): FAQItem[] {
  // Filter category-specific FAQs first
  const categoryPool = COMPREHENSIVE_FAQS.filter(
    (item) => !preferredCategory || item.category === preferredCategory,
  );
  
  // Fallback to full pool if category has fewer than 3
  const pool = categoryPool.length >= 3 ? categoryPool : COMPREHENSIVE_FAQS;
  
  // Deterministic rotation based on seed
  const rotated = [...pool].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) + seed) % 10;
    const hashB = (b.id.charCodeAt(0) + seed) % 10;
    return hashA - hashB;
  });

  const selected3 = rotated.slice(0, 3);
  return [...CORE_FIXED_FAQS, ...selected3];
}

export type Currency = 'INR' | 'USD';
export type BillingInterval = 'monthly' | 'yearly';

export interface PlanPricing {
  monthly: number;
  yearly: number; // price per month when billed yearly
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pricing: Record<Currency, PlanPricing>;
  popular?: boolean;
  ctaText: string;
  features: string[];
  extraStaffCost: Record<Currency, string>;
  extraBranchCost: Record<Currency, string>;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo shops & new workshops',
    description: 'Everything you need to digitalize your daily billing, inventory, and job tracking.',
    pricing: {
      INR: { monthly: 799, yearly: 649 },
      USD: { monthly: 29, yearly: 24 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      '1 Store / Workshop Branch',
      'Up to 2 Staff / Technician Accounts',
      'Point of Sale (POS) & Quick Billing',
      'Inventory & Low Stock Alerts',
      'Standard Workshop Job Cards',
      'Basic Sales & Revenue Reports',
      'Email Support (24-48h SLA)',
    ],
    extraStaffCost: {
      INR: '+₹199 / staff / mo',
      USD: '+$9 / staff / mo',
    },
    extraBranchCost: {
      INR: '+₹599 / branch / mo',
      USD: '+$24 / branch / mo',
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Most popular for growing garages & retail',
    description: 'Full-featured operations suite with advanced analytics, EV health logs, and multi-staff management.',
    popular: true,
    pricing: {
      INR: { monthly: 1999, yearly: 1599 },
      USD: { monthly: 79, yearly: 64 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      'Up to 2 Store / Workshop Branches',
      'Up to 8 Staff Accounts with Role Permissions',
      'Unlimited Invoices & Inventory SKUs',
      'EV Battery Health & Advanced Job Cards',
      'Expense & Profit Margin Tracking',
      'Automated WhatsApp & SMS Notifications',
      'Customer Loyalty & Service History CRM',
      'Priority Support (Under 4h SLA)',
    ],
    extraStaffCost: {
      INR: '+₹149 / staff / mo',
      USD: '+$7 / staff / mo',
    },
    extraBranchCost: {
      INR: '+₹499 / branch / mo',
      USD: '+$19 / branch / mo',
    },
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For multi-branch workshop chains',
    description: 'Scale multi-outlet operations with central inventory distribution, audit logs, and dedicated support.',
    pricing: {
      INR: { monthly: 4499, yearly: 3599 },
      USD: { monthly: 179, yearly: 144 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      'Up to 5 Store / Workshop Branches',
      'Unlimited Staff Accounts Included',
      'Multi-Warehouse Stock Transfer & Sync',
      'Custom Invoice Branding & Barcode Scanning',
      'Custom Role Permissions & Security Audit Logs',
      'Exportable Financial & Tax Reports (GST Ready)',
      'Dedicated Account Manager & Phone Support',
      'Assisted Data Import & Staff Onboarding',
    ],
    extraStaffCost: {
      INR: 'Unlimited included',
      USD: 'Unlimited included',
    },
    extraBranchCost: {
      INR: '+₹399 / branch / mo',
      USD: '+$15 / branch / mo',
    },
  },
];

export const PUBLIC_FOOTER_COLUMNS: PublicFooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'FAQ', to: '/#faq' },
      { label: 'Login', to: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
  {
    title: 'Access',
    links: [
      { label: 'Get Started', to: '/signup' },
      { label: 'Forgot Password', to: '/forgot-password' },
      { label: 'Verify Email', to: '/verify-email' },
      { label: 'Reset Password', to: '/reset-password' },
    ],
  },
];
