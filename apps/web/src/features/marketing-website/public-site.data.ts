import {
  Boxes,
  Receipt,
  Truck,
  Store,
  ShoppingCart,
  Zap,
  Building2,
  PackageCheck,
  ShieldCheck,
  Database,
  Lock,
  Globe,
  FileSpreadsheet,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface PublicNavLink {
  label: string;
  to: string;
  description?: string;
  badge?: string;
}

export interface PublicFooterColumn {
  title: string;
  links: PublicNavLink[];
}

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { label: 'Solutions', to: '/#who-we-help' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Security', to: '/security' },
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
 * Core Fixed FAQs
 */
export const CORE_FIXED_FAQS: FAQItem[] = [
  {
    id: 'core-1',
    category: 'core',
    question: 'What is Trimorg and who is it built for?',
    answer:
      'Trimorg is an all-in-one business operating system built for wholesalers, retail shop owners, grocery stores, electricians, and distributors. It streamlines fast bill generation, real-time inventory control, customer ledgers, and tax compliance in one calm workspace.',
  },
  {
    id: 'core-2',
    category: 'core',
    question: 'Can I start with a free trial without adding a credit card?',
    answer:
      'Yes. You get 14 days of full access to all features immediately upon sign up. No credit card or upfront payment is required.',
  },
  {
    id: 'core-3',
    category: 'core',
    question: 'Is my business and inventory data safe and exportable?',
    answer:
      'Yes. All business data is encrypted at rest and in transit with automated backups and strict tenant isolation. You can export invoices, customer lists, inventory, and tax summaries to Excel or PDF anytime.',
  },
];

export const COMPREHENSIVE_FAQS: FAQItem[] = [
  // Billing
  {
    id: 'pricing-1',
    category: 'billing',
    question: 'How does pricing work as my business expands?',
    answer:
      'Trimorg offers predictable tiers. Starter covers 1 branch and 2 staff. Growth covers 2 branches and 8 staff. Business includes 5 branches with unlimited staff. Add extra branches or staff as you grow.',
  },
  {
    id: 'pricing-2',
    category: 'billing',
    question: 'Do you support localized tax and currencies?',
    answer:
      'Yes. Trimorg supports INR (₹) with GST/UPI in India, GBP (£) with HMRC/VAT in the UK, AUD ($) with ATO GST in Australia, and USD ($) with multi-state sales tax in the US.',
  },
  {
    id: 'pricing-3',
    category: 'billing',
    question: 'Can I switch between monthly and annual plans?',
    answer:
      'Yes. You can switch between monthly and annual billing at any time. Choosing annual billing saves you 20% on all plans.',
  },
  {
    id: 'pricing-4',
    category: 'billing',
    question: 'What happens if I cancel my subscription?',
    answer:
      'You can cancel anytime with zero penalties. Your workspace stays active until the end of your billing cycle, and you can export all your data before closing.',
  },

  // Features
  {
    id: 'feat-1',
    category: 'features',
    question: 'How fast is counter billing and bill generation?',
    answer:
      'Trimorg POS allows sub-second product searches, barcode scanning, split cash/UPI/card tenders, and one-click thermal printing (58mm/80mm) or WhatsApp invoice delivery.',
  },
  {
    id: 'feat-2',
    category: 'features',
    question: 'Can Trimorg handle low stock warnings and purchase orders?',
    answer:
      'Yes. Set low-stock thresholds for SKUs. When items run low, generate supplier purchase orders with one click and update your inventory automatically upon receipt.',
  },
  {
    id: 'feat-3',
    category: 'features',
    question: 'Can I manage customer credit (Udhaar / Khata) and balances?',
    answer:
      'Yes. Track customer outstanding balances, credit limits, payment history, and send automated payment reminder receipts via WhatsApp.',
  },
  {
    id: 'feat-4',
    category: 'features',
    question: 'Does Trimorg work on barcode scanners and thermal printers?',
    answer:
      'Yes. Trimorg works seamlessly with standard USB, Bluetooth, and wireless handheld barcode scanners, as well as 58mm & 80mm thermal receipt printers without custom drivers.',
  },

  // Security & Operations
  {
    id: 'sec-1',
    category: 'security',
    question: 'Where is our business data stored and how is it backed up?',
    answer:
      'Data is hosted on ISO 27001 & SOC 2 certified cloud infrastructure with 256-bit AES encryption, continuous replication, and daily automated snapshots.',
  },
  {
    id: 'sec-2',
    category: 'security',
    question: 'Can I set staff permissions so cashiers cannot see profit margins?',
    answer:
      'Yes. Granular role-based access control allows you to restrict cashiers to billing while hiding purchase costs, vendor ledgers, and profit reports.',
  },

  // Support
  {
    id: 'sup-1',
    category: 'support',
    question: 'Can I import my existing product catalog from Excel?',
    answer:
      'Yes. Use our guided Excel/CSV import tool to upload thousands of products, barcodes, stock counts, and customer balances in under 2 minutes.',
  },
  {
    id: 'sup-2',
    category: 'support',
    question: 'What support channels are available?',
    answer:
      'All users receive email support. Growth and Business tiers receive priority live chat, WhatsApp support, and dedicated onboarding assistance.',
  },
];

export function getPageFaqs(preferredCategory?: FAQItem['category'], seed = 0): FAQItem[] {
  const categoryPool = COMPREHENSIVE_FAQS.filter(
    (item) => !preferredCategory || item.category === preferredCategory,
  );
  const pool = categoryPool.length >= 3 ? categoryPool : COMPREHENSIVE_FAQS;
  const rotated = [...pool].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) + seed) % 10;
    const hashB = (b.id.charCodeAt(0) + seed) % 10;
    return hashA - hashB;
  });

  const selected3 = rotated.slice(0, 3);
  return [...CORE_FIXED_FAQS, ...selected3];
}

/* =========================================================
   SOLUTIONS & "WHO WE HELP" VERTICAL DATA
========================================================= */

export interface SolutionVertical {
  slug: string;
  type: 'persona' | 'solution';
  title: string;
  shortTitle: string;
  tagline: string;
  metaDescription: string;
  icon: LucideIcon;
  heroHeadline: string;
  heroSubheadline: string;
  benefits: {
    title: string;
    description: string;
  }[];
  keyFeatures: {
    title: string;
    description: string;
    badge?: string;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const SOLUTION_VERTICALS: Record<string, SolutionVertical> = {
  'wholesale-stocks': {
    slug: 'wholesale-stocks',
    type: 'persona',
    title: 'Wholesale Stocks & Bulk Distributors',
    shortTitle: 'Wholesale Stocks',
    tagline: 'Manage multi-warehouse bulk stock, supplier purchases, and B2B client credit effortlessly.',
    metaDescription: 'Trimorg wholesale stock management software: Track bulk cartons, supplier ledgers, multi-warehouse transfers, and B2B pricing in real time.',
    icon: Truck,
    heroHeadline: 'Wholesale stock management built for high-volume trade.',
    heroSubheadline: 'Eliminate stockouts, track batch quantities across multiple warehouses, and manage customer credit ledgers in one high-speed platform.',
    stats: [
      { value: '10x', label: 'Faster bulk order processing' },
      { value: '100%', label: 'Real-time stock accuracy' },
      { value: 'Zero', label: 'Overstock and stockout surprises' },
    ],
    benefits: [
      {
        title: 'Multi-Warehouse Visibility',
        description: 'Track inventory counts across warehouses, godowns, and distribution vehicles with automated inter-branch transfers.',
      },
      {
        title: 'B2B Client Credit & Dues',
        description: 'Set custom credit limits for retail buyers, track outstanding aging balances, and collect payments faster.',
      },
      {
        title: 'Purchase Orders & Supplier Ledgers',
        description: 'Generate supplier POs, record goods received notes (GRN), and reconcile supplier payables automatically.',
      },
      {
        title: 'Tiered Wholesale Pricing',
        description: 'Configure custom wholesale price lists and volume discounts per buyer group with automatic invoice calculation.',
      },
    ],
    keyFeatures: [
      {
        title: 'Carton & Bulk Unit Conversion',
        description: 'Seamlessly buy in cartons/pallets and sell in pieces or boxes with automated stock math.',
        badge: 'Wholesale',
      },
      {
        title: 'Multi-Warehouse Transfer Slips',
        description: 'Issue stock dispatch notes and verify receipt between central hubs and branch locations.',
        badge: 'Logistics',
      },
      {
        title: 'Automated Tax Invoicing',
        description: 'Generate B2B tax invoices with HSN/SAC codes, reverse charge support, and GST/VAT breakdown.',
        badge: 'Compliance',
      },
      {
        title: 'Live Outstanding Ledger',
        description: 'Instantly view total receivables, overdue invoices, and customer payment history with statement exports.',
        badge: 'Finance',
      },
    ],
    faqs: [
      {
        question: 'How does Trimorg handle wholesale bulk orders and partial dispatches?',
        answer: 'You can create sales orders, dispatch items in batches, and generate corresponding partial invoices while keeping remaining quantities tracked accurately.',
      },
      {
        question: 'Can I manage multiple godowns or branch warehouses?',
        answer: 'Yes. Trimorg allows you to define unlimited warehouses, track stock at each location, and transfer stock with audit records.',
      },
      {
        question: 'Can I import supplier price catalogs in bulk?',
        answer: 'Yes. Upload thousands of supplier items, SKUs, and purchase rates using our Excel/CSV import tool in seconds.',
      },
    ],
  },

  'shop-owners': {
    slug: 'shop-owners',
    type: 'persona',
    title: 'Retail Shop Owners & Counter Billing',
    shortTitle: 'Shop Owners',
    tagline: 'Lightning-fast counter checkout, barcode scanning, and daily profit tracking for retail merchants.',
    metaDescription: 'Best retail shop billing software & POS: Speed up checkout, track daily sales, monitor low stock, and manage customer khata with Trimorg.',
    icon: Store,
    heroHeadline: 'Retail billing software that keeps checkout lines moving.',
    heroSubheadline: 'Ring up sales in seconds, scan barcodes effortlessly, accept split payments, and track your daily profits from anywhere.',
    stats: [
      { value: '< 2s', label: 'Average checkout time per bill' },
      { value: '35%', label: 'Reduction in counter billing queues' },
      { value: '100%', label: 'Offline billing resilience' },
    ],
    benefits: [
      {
        title: 'Fast Barcode POS Billing',
        description: 'Scan barcodes or search products instantly with keyboard shortcuts designed for busy counter hours.',
      },
      {
        title: 'Customer Khata & Digital Udhaar',
        description: 'Record customer dues, set credit limits, and send automated WhatsApp receipts and payment reminders.',
      },
      {
        title: 'Low Stock Alerts & Reordering',
        description: 'Never run out of fast-moving items with automated low-stock warnings and quick purchase orders.',
      },
      {
        title: 'Daily Cash Register & Shift Reports',
        description: 'Reconcile cash, UPI, cards, and credit at the end of each day with automated shift summary reports.',
      },
    ],
    keyFeatures: [
      {
        title: 'Thermal Printing (58mm & 80mm)',
        description: 'Connect standard thermal printers for instant receipt printing with your store logo and custom footer text.',
        badge: 'Hardware',
      },
      {
        title: 'Barcode Label Generation',
        description: 'Generate and print custom barcodes for unbranded items directly from your inventory catalog.',
        badge: 'Inventory',
      },
      {
        title: 'Split Tender Payments',
        description: 'Accept split payments across cash, digital cards, UPI, and customer store credit on a single bill.',
        badge: 'Checkout',
      },
      {
        title: 'Daily Sales & Margin Dashboard',
        description: 'See your best-selling items, gross margins, and daily cash flow on your mobile or desktop.',
        badge: 'Analytics',
      },
    ],
    faqs: [
      {
        question: 'Does Trimorg work on my existing laptop, tablet, or desktop?',
        answer: 'Yes. Trimorg runs smoothly in any modern web browser on Windows, Mac, iPads, Android tablets, and POS touchscreen terminals.',
      },
      {
        question: 'Will billing continue working if the internet drops temporarily?',
        answer: 'Yes. Trimorg caches your active product catalog so cashiers can continue billing during short connectivity disruptions.',
      },
      {
        question: 'Can I train new shop assistants quickly?',
        answer: 'Trimorg is built with an intuitive, clutter-free design that staff can learn in under 5 minutes without technical training.',
      },
    ],
  },

  'grocery-shops': {
    slug: 'grocery-shops',
    type: 'persona',
    title: 'Grocery Stores, Supermarkets & FMCG',
    shortTitle: 'Grocery Shops',
    tagline: 'High-speed grocery POS, weight scale support, barcode lookups, and fast inventory replenishment.',
    metaDescription: 'Grocery store POS & supermarket inventory software: Manage thousands of FMCG SKUs, fast barcode checkout, expiry dates, and supplier reorders.',
    icon: ShoppingCart,
    heroHeadline: 'High-speed grocery POS for fast checkouts & fresh stock.',
    heroSubheadline: 'Handle thousands of grocery SKUs, fast barcode scanning, loose item weight pricing, and daily replenishment in one reliable system.',
    stats: [
      { value: '50,000+', label: 'SKU capacity without slowdown' },
      { value: '3x', label: 'Faster grocery item lookup' },
      { value: 'Zero', label: 'Dead stock with reorder alerts' },
    ],
    benefits: [
      {
        title: 'Ultra-Fast Item Scanning',
        description: 'Optimized POS interface designed for rapid barcode scanning with instant quantity adjustments.',
      },
      {
        title: 'Weight & Packaged Goods',
        description: 'Easily bill both packaged barcode goods and loose items (grains, vegetables, fruits) by weight or piece.',
      },
      {
        title: 'Expiry & Batch Tracking',
        description: 'Track batch numbers and manufacturing dates to ensure older stock is sold first and minimize waste.',
      },
      {
        title: 'Bulk Stock Replenishment',
        description: 'Reorder low-stock grocery staples from distributors with automated purchase orders based on sales velocity.',
      },
    ],
    keyFeatures: [
      {
        title: 'Preloaded FMCG Barcode Catalog',
        description: 'Quickly scan standard consumer packaged goods and auto-fill product details to save setup time.',
        badge: 'Speed',
      },
      {
        title: 'Quick WhatsApp Digital Receipts',
        description: 'Save thermal paper costs by sending instant digital receipts directly to customer WhatsApp numbers.',
        badge: 'Eco Friendly',
      },
      {
        title: 'Hold & Resume Cart',
        description: 'Park a customer cart while they pick an extra item and serve the next shopper without losing progress.',
        badge: 'Queue Buster',
      },
      {
        title: 'Supplier Price Comparison',
        description: 'Compare purchase rates across different FMCG distributors to maximize your store margins.',
        badge: 'Profits',
      },
    ],
    faqs: [
      {
        question: 'Can Trimorg handle stores with tens of thousands of grocery items?',
        answer: 'Yes. Our database search is indexed for instant sub-millisecond lookups across 50,000+ items without lag.',
      },
      {
        question: 'Can I print receipts in regional formats with tax details?',
        answer: 'Yes. Receipts include itemized tax breakdowns (CGST/SGST/VAT), store contact details, and custom return policies.',
      },
      {
        question: 'How do I handle loose items without barcodes?',
        answer: 'You can create visual quick-pick buttons or assign 3-digit shortcodes for fast manual entry at the counter.',
      },
    ],
  },

  'electricians-contractors': {
    slug: 'electricians-contractors',
    type: 'persona',
    title: 'Electricians, Contractors & Service Trades',
    shortTitle: 'Electricians & Trades',
    tagline: 'Job estimates, electrical parts inventory, on-site invoicing, and client payment tracking.',
    metaDescription: 'Electrician billing software & contractor job management: Create quotes, track electrical parts inventory, issue job invoices, and get paid faster.',
    icon: Zap,
    heroHeadline: 'Invoicing & parts inventory built for electricians and trade pros.',
    heroSubheadline: 'Create professional estimates on-site, track wire, switch, and parts inventory, bill labor hours, and collect payments on the spot.',
    stats: [
      { value: '5 min', label: 'To create & send a professional quote' },
      { value: '2x', label: 'Faster customer payment collection' },
      { value: '100%', label: 'Parts consumption tracking' },
    ],
    benefits: [
      {
        title: 'Instant Quotes to Invoices',
        description: 'Generate branded electrical estimates on your mobile or laptop and convert them to tax invoices in one tap.',
      },
      {
        title: 'Parts & Materials Inventory',
        description: 'Track stock of cables, breakers, switches, conduit, and fittings used across client job sites.',
      },
      {
        title: 'Labor & Service Billing',
        description: 'Bill both physical parts and hourly labor charges on the same clean, transparent client invoice.',
      },
      {
        title: 'Client Payment Follow-Ups',
        description: 'Send professional payment links and WhatsApp invoice reminders to eliminate overdue contractor dues.',
      },
    ],
    keyFeatures: [
      {
        title: 'Mobile On-Site Billing',
        description: 'Issue invoices and accept digital UPI/card payments right from the customer premises on your smartphone.',
        badge: 'Mobile First',
      },
      {
        title: 'Job Cost & Profit Analysis',
        description: 'Track material costs against billed amounts to know your exact profit margin on every electrical project.',
        badge: 'Profits',
      },
      {
        title: 'Electrical Supplier Ledger',
        description: 'Keep track of running credit balances with your electrical wholesale suppliers in one ledger.',
        badge: 'Ledger',
      },
      {
        title: 'Branded PDF Invoices',
        description: 'Send polished PDF bills with your company logo, license numbers, terms, and bank payment details.',
        badge: 'Branding',
      },
    ],
    faqs: [
      {
        question: 'Can I use Trimorg from my phone while working on client sites?',
        answer: 'Yes. Trimorg is fully responsive and works seamlessly on mobile browsers without requiring heavy app installs.',
      },
      {
        question: 'Can I add custom labor rates and warranty terms?',
        answer: 'Yes. You can save standard labor rates, call-out fees, and attach service warranty notes to all invoices.',
      },
      {
        question: 'How do I handle project milestones and advance payments?',
        answer: 'You can record advance deposit payments against quotations and issue final balance invoices upon job completion.',
      },
    ],
  },

  'enterprise': {
    slug: 'enterprise',
    type: 'persona',
    title: 'Multi-Branch Chains & Enterprise Networks',
    shortTitle: 'Enterprise & Multi-Branch',
    tagline: 'Centralized inventory distribution, multi-outlet control, role permissions, and enterprise ERP sync.',
    metaDescription: 'Enterprise retail & wholesale management platform: Centralized inventory, multi-branch synchronization, custom roles, and dedicated SLA support.',
    icon: Building2,
    heroHeadline: 'Scale multi-branch retail & distribution with central control.',
    heroSubheadline: 'Unify 5 to 50+ stores, centralize inventory purchasing, configure custom staff permissions, and gain executive operational visibility.',
    stats: [
      { value: '50+', label: 'Branches managed centrally' },
      { value: '99.99%', label: 'Guaranteed platform uptime' },
      { value: '24/7', label: 'Dedicated SLA & account management' },
    ],
    benefits: [
      {
        title: 'Centralized Master Catalog',
        description: 'Control SKUs, base prices, and tax categories centrally while allowing localized stock counts at each branch.',
      },
      {
        title: 'Inter-Branch Stock Balancing',
        description: 'Transfer excess stock between branches with automated dispatch notes and receiving acknowledgments.',
      },
      {
        title: 'Granular Security & Role Permissions',
        description: 'Define exact permissions for cashiers, branch managers, regional supervisors, and head office accountants.',
      },
      {
        title: 'Consolidated Executive Analytics',
        description: 'View real-time chain-wide sales, regional performance benchmarks, and consolidated tax liabilities at a glance.',
      },
    ],
    keyFeatures: [
      {
        title: 'Audit Trail & Action Logs',
        description: 'Track every stock adjustment, price change, discount override, and invoice cancellation with staff timestamps.',
        badge: 'Security',
      },
      {
        title: 'Custom ERP & API Integrations',
        description: 'Connect Trimorg to existing accounting software (Tally, QuickBooks, SAP) via modern REST APIs.',
        badge: 'Integrations',
      },
      {
        title: 'Dedicated Account Manager',
        description: 'Enjoy personalized staff training, priority SLA support, and dedicated database clusters for your chain.',
        badge: 'VIP Support',
      },
      {
        title: 'Automated Multi-State Tax Exports',
        description: 'Generate consolidated multi-branch tax filings with single-click GST and VAT reports.',
        badge: 'Compliance',
      },
    ],
    faqs: [
      {
        question: 'How many branches can we connect to a single enterprise account?',
        answer: 'Trimorg scales seamlessly from 5 to 100+ branches with zero performance loss and centralized administration.',
      },
      {
        question: 'Can we integrate Trimorg with our existing custom accounting software?',
        answer: 'Yes. Our enterprise plan includes custom REST API access and guided integration support from our engineering team.',
      },
      {
        question: 'Do you offer on-premise or private cloud deployments?',
        answer: 'Yes. Dedicated private database clusters and custom cloud regions are available for enterprise subscribers.',
      },
    ],
  },

  /* Software Solution Type Pages */
  'inventory-management': {
    slug: 'inventory-management',
    type: 'solution',
    title: 'Real-Time Inventory Management Software',
    shortTitle: 'Inventory Management',
    tagline: 'Track stock in real time, automate reorder alerts, manage batches, and eliminate stockouts.',
    metaDescription: 'Cloud inventory management software for small businesses, retail, and wholesale: Real-time stock counts, low stock alerts, barcode lookup, and multi-location sync.',
    icon: Boxes,
    heroHeadline: 'Real-time inventory management that stays calm as you scale.',
    heroSubheadline: 'Gain 100% visibility over every SKU, track stock movements across locations, and automate supplier replenishment with zero guesswork.',
    stats: [
      { value: '100%', label: 'Real-time inventory accuracy' },
      { value: '-40%', label: 'Reduction in holding costs & waste' },
      { value: '< 1s', label: 'Instant stock lookup across locations' },
    ],
    benefits: [
      {
        title: 'Live Stock Movement Logs',
        description: 'Every sale, return, adjustment, and supplier delivery updates your inventory count in real time.',
      },
      {
        title: 'Automated Low-Stock Alerts',
        description: 'Set custom minimum reorder levels and get notified before you run out of fast-selling items.',
      },
      {
        title: 'Batch & Serial Number Tracking',
        description: 'Track warranty items, expiry dates, and batch codes with complete historical auditability.',
      },
      {
        title: 'Multi-Location Stock Sync',
        description: 'Manage main store shelves, godowns, and auxiliary warehouses from one unified inventory screen.',
      },
    ],
    keyFeatures: [
      {
        title: 'Bulk Excel / CSV Import & Export',
        description: 'Upload your entire product catalog in minutes with automated error validation.',
        badge: 'Productivity',
      },
      {
        title: 'Quick Stock Adjustments',
        description: 'Log inventory reconciliations, damages, and sample usage with clear audit reason tags.',
        badge: 'Accuracy',
      },
      {
        title: 'Barcode Scanning & Printing',
        description: 'Scan incoming shipments with handheld hardware and print adhesive barcode labels on demand.',
        badge: 'Hardware',
      },
      {
        title: 'Stock Valuation Reports',
        description: 'See your real-time total inventory asset value based on weighted average or FIFO purchase costs.',
        badge: 'Finance',
      },
    ],
    faqs: [
      {
        question: 'Can I track inventory across multiple physical locations?',
        answer: 'Yes. Trimorg tracks stock counts independently per location and logs inter-warehouse transfer dispatches.',
      },
      {
        question: 'How do I handle returns and damaged goods?',
        answer: 'You can process customer returns back into sellable inventory or write off damaged items with specific reason codes.',
      },
      {
        question: 'Is there a limit on how many SKUs I can add?',
        answer: 'No. Trimorg supports unlimited products, categories, and SKU variations across all plans.',
      },
    ],
  },

  'bill-generation-software': {
    slug: 'bill-generation-software',
    type: 'solution',
    title: 'Fast POS & Bill Generation Software',
    shortTitle: 'Bill Generation Software',
    tagline: 'Generate professional GST/tax invoices in seconds with thermal printing and WhatsApp delivery.',
    metaDescription: 'Best bill generation software for retail shops, wholesalers, and service businesses: Fast barcode billing, GST tax calculation, thermal receipts, and WhatsApp bills.',
    icon: Receipt,
    heroHeadline: 'Fast, professional bill generation software for modern business.',
    heroSubheadline: 'Create compliant tax invoices, print thermal receipts, accept split payments, and send digital bills to WhatsApp in seconds.',
    stats: [
      { value: '3 clicks', label: 'To create & print a complete bill' },
      { value: '100%', label: 'GST & local tax compliant invoices' },
      { value: '58/80mm', label: 'Thermal printer compatibility' },
    ],
    benefits: [
      {
        title: 'Lightning-Fast Counter Checkout',
        description: 'Optimized POS billing interface with instant product search, barcode scanning, and keyboard shortcuts.',
      },
      {
        title: 'Automated Tax Calculation',
        description: 'Auto-calculates CGST, SGST, IGST, VAT, or local sales taxes with accurate HSN/SAC code mapping.',
      },
      {
        title: 'Thermal & A4/A5 Print Layouts',
        description: 'Print compact 58mm/80mm thermal receipts for counters or formal A4/A5 tax invoices for wholesale clients.',
      },
      {
        title: 'Instant WhatsApp & SMS Bills',
        description: 'Deliver digital receipt links directly to customer smartphones to save paper and enhance your brand image.',
      },
    ],
    keyFeatures: [
      {
        title: 'Custom Invoice Branding',
        description: 'Add your business logo, GSTIN, payment QR codes, bank details, and custom terms & conditions.',
        badge: 'Branding',
      },
      {
        title: 'Quotations & Proforma Invoices',
        description: 'Send professional price estimates to clients and convert them to tax invoices with one click.',
        badge: 'Sales',
      },
      {
        title: 'Split & Digital Payments',
        description: 'Accept cash, cards, UPI QR codes, and customer store credit simultaneously on a single invoice.',
        badge: 'Payments',
      },
      {
        title: 'GSTR-Ready Tax Summaries',
        description: 'Export clean GSTR-1, GSTR-3B, and B2B/B2C sales spreadsheets ready for your accountant.',
        badge: 'Tax Ready',
      },
    ],
    faqs: [
      {
        question: 'Can I customize the invoice design with my shop logo and footer notes?',
        answer: 'Yes. You can upload your business logo, customize header details, add UPI payment QR codes, and set custom terms.',
      },
      {
        question: 'Does it support thermal receipt printers?',
        answer: 'Yes. It works with all standard 58mm (2 inch) and 80mm (3 inch) USB, Bluetooth, and network receipt printers.',
      },
      {
        question: 'Can I issue quotations and convert them to final bills later?',
        answer: 'Yes. Create price estimates or proforma invoices and convert them to tax bills once approved with no re-typing.',
      },
    ],
  },

  'stock-management': {
    slug: 'stock-management',
    type: 'solution',
    title: 'Stock Management & Procurement Software',
    shortTitle: 'Stock Management',
    tagline: 'Streamline purchase orders, supplier ledgers, restock thresholds, and profit margin analysis.',
    metaDescription: 'Stock management & supplier purchasing software: Streamline POs, manage vendor payables, calculate gross margins, and track inventory turnover.',
    icon: PackageCheck,
    heroHeadline: 'Complete stock control and smart supplier procurement.',
    heroSubheadline: 'Streamline supplier purchase orders, reconcile incoming goods, monitor vendor payables, and protect your profit margins.',
    stats: [
      { value: '25%', label: 'Increase in stock turnover velocity' },
      { value: 'Zero', label: 'Supplier payment discrepancies' },
      { value: '1-Click', label: 'Purchase order generation' },
    ],
    benefits: [
      {
        title: 'Supplier Purchase Order Flow',
        description: 'Create, email, and track purchase orders with suppliers, and update stock automatically on delivery.',
      },
      {
        title: 'Vendor Ledger & Payables',
        description: 'Keep track of supplier bills, payment terms, advance deposits, and outstanding credit balances in one place.',
      },
      {
        title: 'Gross Margin & Cost Analysis',
        description: 'Know your exact profit margins on every product after factoring in purchase costs, taxes, and discounts.',
      },
      {
        title: 'Damaged & Return Goods Management',
        description: 'Log supplier returns, credit notes, and damaged inventory write-offs with complete audit trails.',
      },
    ],
    keyFeatures: [
      {
        title: 'Automated Reorder Suggestions',
        description: 'Trimorg calculates stock run-out dates based on sales velocity and suggests optimal reorder quantities.',
        badge: 'Automation',
      },
      {
        title: 'Supplier Rate History',
        description: 'Track price changes from different vendors over time to negotiate better purchasing terms.',
        badge: 'Intelligence',
      },
      {
        title: 'Goods Received Note (GRN)',
        description: 'Verify quantities delivered against original purchase orders before approving vendor invoices.',
        badge: 'Accuracy',
      },
      {
        title: 'Dead Stock Identifier',
        description: 'Spot slow-moving inventory quickly so you can discount or bundle items before they tie up capital.',
        badge: 'Analytics',
      },
    ],
    faqs: [
      {
        question: 'How does Trimorg help prevent over-purchasing and dead stock?',
        answer: 'Trimorg tracks your sales velocity and highlights slow-moving SKUs, so you only reorder items that actively sell.',
      },
      {
        question: 'Can I manage multiple suppliers for the same product?',
        answer: 'Yes. You can record different supplier purchase rates and lead times for each SKU.',
      },
      {
        question: 'How are purchase costs integrated with sales reports?',
        answer: 'Trimorg automatically compares your selling price against purchase costs to show real-time gross profit margins.',
      },
    ],
  },
};

/* =========================================================
   COUNTRY-SPECIFIC PORTAL DATA
========================================================= */

export interface CountrySolution {
  slug: string;
  countryName: string;
  currencySymbol: string;
  currencyCode: string;
  flag: string;
  tagline: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  taxComplianceTitle: string;
  taxComplianceDetails: string[];
  localFeatures: {
    title: string;
    description: string;
  }[];
  pricingHighlight: string;
}

export const COUNTRY_SOLUTIONS: Record<string, CountrySolution> = {
  'india': {
    slug: 'india',
    countryName: 'India',
    currencySymbol: '₹',
    currencyCode: 'INR',
    flag: '🇮🇳',
    tagline: 'GST-ready billing, UPI QR integration, and WhatsApp invoices tailored for Indian businesses.',
    metaDescription: 'Best GST billing & inventory software in India: Fast POS counter billing, GSTR-1 & 3B reports, UPI QR payments, and WhatsApp receipts for retail and wholesale.',
    heroHeadline: 'India\'s fastest GST billing & inventory management software.',
    heroSubheadline: 'Built specifically for Indian retail shops, wholesale distributors, grocery stores, and electrical traders with instant UPI, GST compliance, and WhatsApp receipts.',
    taxComplianceTitle: '100% Indian GST & Tax Compliance',
    taxComplianceDetails: [
      'Automated CGST, SGST, IGST tax breakdown with HSN/SAC code mapping',
      'One-click export of GSTR-1, GSTR-3B, and B2B/B2C sales summary spreadsheets',
      'E-Way bill and e-Invoicing format readiness for high-turnover distributors',
      'Reverse charge mechanism (RCM) and composite dealer scheme support',
    ],
    localFeatures: [
      {
        title: 'UPI QR Code on Every Bill',
        description: 'Dynamic UPI QR codes printed directly on bills for seamless instant payments from PhonePe, Google Pay, and Paytm.',
      },
      {
        title: 'WhatsApp Invoice Delivery',
        description: 'Send PDF invoices and payment receipt links directly to customer WhatsApp numbers with one click.',
      },
      {
        title: 'Customer Khata & Udhaar Ledger',
        description: 'Manage credit balances, customer payment reminders, and settlement history with zero math errors.',
      },
      {
        title: 'Affordable INR Pricing',
        description: 'Plans starting at just ₹649/month with local payment methods (UPI, Net Banking, RuPay, and Debit Cards).',
      },
    ],
    pricingHighlight: 'Plans from ₹649/mo · 14-day free trial · UPI, Cards & Net Banking',
  },

  'united-kingdom': {
    slug: 'united-kingdom',
    countryName: 'United Kingdom',
    currencySymbol: '£',
    currencyCode: 'GBP',
    flag: '🇬🇧',
    tagline: 'Making Tax Digital (MTD) compliant invoicing, UK VAT calculation, and London-latency cloud performance.',
    metaDescription: 'UK retail POS & inventory software: Making Tax Digital (MTD) ready, 20% / 5% / 0% VAT invoices, multi-branch stock sync, and GBP billing.',
    heroHeadline: 'Streamlined retail POS & inventory management for UK businesses.',
    heroSubheadline: 'Empower your UK wholesale trade, retail shops, and trade contractors with Making Tax Digital ready invoicing, automated VAT reporting, and fast cloud POS.',
    taxComplianceTitle: 'HMRC & UK VAT Compliance Ready',
    taxComplianceDetails: [
      'Standard (20%), Reduced (5%), and Zero-rated VAT automation',
      'HMRC Making Tax Digital (MTD) compatible invoice summaries and audit logs',
      'UK GDPR compliant data handling and sovereign cloud infrastructure',
      'Compliant B2B tax receipts with VAT registration numbers and company details',
    ],
    localFeatures: [
      {
        title: 'Fast Counter POS for UK High Streets',
        description: 'Handle busy counter traffic with sub-second barcode lookups and contactless card terminal pairing.',
      },
      {
        title: 'Multi-Warehouse & Trade Stock',
        description: 'Track inventory across UK regional depots, retail branches, and fulfillment hubs seamlessly.',
      },
      {
        title: 'UK GDPR & Security Standards',
        description: 'All customer and financial data is encrypted and managed in full adherence with UK GDPR privacy mandates.',
      },
      {
        title: 'GBP Currency & Stripe Payments',
        description: 'Transparent pricing in GBP with automated billing and instant customer invoice payment links.',
      },
    ],
    pricingHighlight: 'Plans from £24/mo · 14-day risk-free trial · UK VAT ready',
  },

  'australia': {
    slug: 'australia',
    countryName: 'Australia',
    currencySymbol: '$',
    currencyCode: 'AUD',
    flag: '🇦🇺',
    tagline: 'ATO-compliant GST tax invoices, AUD pricing, and fast cloud inventory for Australian SMEs.',
    metaDescription: 'Australian POS & inventory management software: ATO GST compliant tax invoices, barcode counter billing, multi-store stock sync, and AUD currency support.',
    heroHeadline: 'High-clarity inventory & POS billing built for Australian business.',
    heroSubheadline: 'Designed for Australian wholesalers, independent retail shops, and trade contractors. Compliant ATO GST tax invoicing and real-time multi-branch stock tracking.',
    taxComplianceTitle: 'ATO GST Compliance & Reporting',
    taxComplianceDetails: [
      'Automated 10% Australian GST calculations on taxable sales and purchases',
      'Business Activity Statement (BAS) ready tax summary reports',
      'Australian Business Number (ABN) display on all customer tax invoices',
      'Compliant tax invoice records preserved securely for Australian statutory audit periods',
    ],
    localFeatures: [
      {
        title: 'Sydney Cloud Hosting Speed',
        description: 'Ultra-low latency performance engineered for Australian retail shops and wholesale warehouses.',
      },
      {
        title: 'Multi-Outlet Stock Synchronisation',
        description: 'Sync inventory between Melbourne, Sydney, Brisbane, or regional stores with automated transfer slips.',
      },
      {
        title: 'Integrated Customer Credit & Trade Accounts',
        description: 'Offer 30-day trade credit accounts to B2B clients with automated statements and overdue alerts.',
      },
      {
        title: 'Simple AUD Pricing',
        description: 'Straightforward AUD subscription tiers with no hidden transaction fees or surprise hardware locks.',
      },
    ],
    pricingHighlight: 'Plans from A$39/mo · 14-day free trial · ATO GST ready',
  },

  'united-states': {
    slug: 'united-states',
    countryName: 'United States',
    currencySymbol: '$',
    currencyCode: 'USD',
    flag: '🇺🇸',
    tagline: 'Multi-state sales tax calculations, USD billing, and robust inventory control for US merchants.',
    metaDescription: 'US retail POS & warehouse inventory management software: Multi-state sales tax, barcode checkout, purchase orders, and multi-location sync.',
    heroHeadline: 'Modern POS, inventory & billing software for US merchants.',
    heroSubheadline: 'Built for independent retail store owners, wholesalers, and trade contractors seeking clean inventory control, fast POS checkout, and reliable sales tax calculation.',
    taxComplianceTitle: 'US Sales Tax & Financial Accuracy',
    taxComplianceDetails: [
      'Configurable state, county, and city sales tax rates per store branch',
      'Tax-exempt customer handling for wholesale B2B reseller certificate holders',
      'Detailed itemized sales tax collection reports for state tax filing',
      'Exportable financial ledgers formatted for QuickBooks and standard US accounting tools',
    ],
    localFeatures: [
      {
        title: 'Rapid Touchscreen & Barcode POS',
        description: 'Fast, clutter-free counter interface optimized for touch displays, barcode scanners, and thermal receipt printers.',
      },
      {
        title: 'Multi-Location Warehouse Management',
        description: 'Keep track of products across regional distribution centers, stores, and mobile service vehicles.',
      },
      {
        title: 'Contractor Quotes & Estimates',
        description: 'Issue polished digital estimates to commercial and residential clients and convert them to invoices upon completion.',
      },
      {
        title: 'Stripe & Digital Payment Support',
        description: 'Accept credit cards, Apple Pay, Google Pay, and online invoice settlement seamlessly.',
      },
    ],
    pricingHighlight: 'Plans from $24/mo · 14-day free trial · Cancel anytime',
  },
};

/* =========================================================
   RESOURCES & SEO BLOG DATA
========================================================= */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Inventory' | 'Billing & POS' | 'Wholesale' | 'Retail Growth' | 'Tax & Compliance';
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  content: {
    introduction: string;
    keyTakeaways: string[];
    sections: {
      heading: string;
      body: string[];
    }[];
    conclusion: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-speed-up-retail-counter-billing',
    title: '5 Practical Ways to Cut Retail Counter Checkout Time in Half',
    excerpt: 'Long checkout queues cause lost sales. Discover how barcode workflows, thermal shortcuts, and split-tender POS reduce customer wait times.',
    category: 'Billing & POS',
    readTime: '4 min read',
    publishedDate: 'September 2026',
    author: {
      name: 'Trimorg Product Team',
      role: 'Retail Operations Specialists',
    },
    content: {
      introduction:
        'During peak shopping hours, every second saved at the checkout counter directly boosts customer satisfaction and total store revenue. When shoppers see long queues, many abandon their carts. Here are five actionable strategies to accelerate your billing workflow.',
      keyTakeaways: [
        'Organize high-frequency items into single-tap quick buttons.',
        'Use handheld Bluetooth or 2D barcode scanners for instant SKU entry.',
        'Adopt high-speed 80mm thermal receipt printing or digital WhatsApp delivery.',
        'Enable split payment methods on a single screen without menu jumping.',
      ],
      sections: [
        {
          heading: '1. Standardize Barcode Tagging for Non-Barcoded Items',
          body: [
            'Loose items, regional goods, and custom hardware often lack manufacturer barcodes. Generating and sticking standardized internal barcode labels eliminates manual searching by cashiers.',
            'Trimorg allows you to generate and print internal barcodes for any SKU with one click, saving up to 15 seconds per scanned item.',
          ],
        },
        {
          heading: '2. Switch to Instant Thermal Printing or WhatsApp Receipts',
          body: [
            'Traditional inkjet or laser printers take 10 to 20 seconds to warm up and print a bill. Modern 80mm thermal receipt printers spit out receipts in under 1 second.',
            'Moreover, offering WhatsApp receipts saves paper costs while instantly giving customers an unlosable digital invoice.',
          ],
        },
        {
          heading: '3. Use Keyboard Shortcuts and Fast Search Indexing',
          body: [
            'A good POS system should never require reaching for the mouse. Look for software with instant fuzzy search that matches item names, barcodes, or SKU numbers in sub-milliseconds.',
          ],
        },
      ],
      conclusion:
        'By streamlining your POS interface and adopting rapid barcode workflows, you can double your counter throughput and deliver a frictionless shopping experience.',
    },
  },
  {
    slug: 'wholesale-inventory-mistakes-to-avoid',
    title: 'The Top 4 Inventory Mistakes Growing Wholesalers Make (And How to Fix Them)',
    excerpt: 'From dead stock accumulation to poor supplier ledger tracking, learn the essential inventory control practices for high-volume B2B distributors.',
    category: 'Wholesale',
    readTime: '6 min read',
    publishedDate: 'September 2026',
    author: {
      name: 'Trimorg Operations Team',
      role: 'Supply Chain Strategists',
    },
    content: {
      introduction:
        'Scaling a wholesale distribution business is thrilling until stock discrepancies, tied-up working capital, and delayed customer dispatches start eating into your profit margins. Here is how modern distributors maintain tight inventory control.',
      keyTakeaways: [
        'Set dynamic reorder thresholds instead of relying on gut feeling.',
        'Track stock by batch and carton units to avoid manual conversion errors.',
        'Reconcile supplier invoices against Goods Received Notes (GRN).',
        'Identify slow-moving stock early before capital gets trapped.',
      ],
      sections: [
        {
          heading: '1. Relying on Static Spreadsheets for Multi-Warehouse Stock',
          body: [
            'When stock is spread across central warehouses, godowns, and transit vehicles, offline spreadsheets become outdated within hours.',
            'A unified cloud inventory operating system ensures every dispatch, sale, and return is immediately reflected across all branches.',
          ],
        },
        {
          heading: '2. Ignoring Supplier Rate Volatility',
          body: [
            'Supplier prices fluctuate constantly. If your selling prices do not automatically update based on recent purchase rates, your gross margins erode silently.',
            'Trimorg logs supplier rate histories and alerts you when margins drop below your target threshold.',
          ],
        },
        {
          heading: '3. Disconnected B2B Credit Ledgers',
          body: [
            'Allowing retail buyers to place bulk orders without checking their outstanding balance leads to cash flow crunches. Keep credit limits tied directly to your sales invoicing screen.',
          ],
        },
      ],
      conclusion:
        'Modern wholesale software like Trimorg replaces fragmented spreadsheets with calm, real-time operational clarity, ensuring you always know your exact stock and cash position.',
    },
  },
  {
    slug: 'complete-guide-to-gst-and-tax-invoicing',
    title: 'The Complete Guide to Streamlined GST & Tax Invoicing for Small Businesses',
    excerpt: 'Master HSN/SAC codes, reverse charge, split taxes, and one-click tax report exports without needing complex accounting software.',
    category: 'Tax & Compliance',
    readTime: '5 min read',
    publishedDate: 'September 2026',
    author: {
      name: 'Trimorg Compliance Team',
      role: 'Tax & Accounting Specialists',
    },
    content: {
      introduction:
        'Tax compliance should never slow down daily sales. Whether you are running a retail counter in India, a boutique in London, or a distribution hub in Sydney, automated tax invoicing saves hours of manual accounting.',
      keyTakeaways: [
        'Map default tax rates and HSN/SAC codes at the product category level.',
        'Automatically separate interstate (IGST) and intrastate (CGST+SGST) transactions.',
        'Generate tax-compliant PDF invoices with mandatory legal headers.',
        'Export clean tax summaries ready for GSTR-1, VAT, or BAS filings.',
      ],
      sections: [
        {
          heading: '1. Automate Tax Rules at the Product Level',
          body: [
            'Never force cashiers to calculate or select tax percentages manually. Assigning tax rates to product categories ensures 100% tax accuracy on every single bill.',
          ],
        },
        {
          heading: '2. Include Mandatory Legal Details on Invoices',
          body: [
            'A valid tax invoice must display your business tax ID (GSTIN/VAT/ABN), customer tax ID (for B2B), sequential invoice numbering, and date timestamps.',
            'Trimorg formats your invoices automatically to satisfy all legal requirements in your jurisdiction.',
          ],
        },
        {
          heading: '3. End-of-Month Tax Filing Made Painless',
          body: [
            'Instead of spending days sorting paper bills, export a single spreadsheet with all B2B and B2C sales categorized for your accountant or direct portal upload.',
          ],
        },
      ],
      conclusion:
        'With Trimorg, tax calculations happen invisibly in the background, keeping you compliant without distracting you from serving customers.',
    },
  },
];

/* =========================================================
   SECURITY & TRUST PAGE DATA
========================================================= */

export const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: '256-Bit AES Encryption',
    description: 'All business data, customer ledgers, and transaction records are encrypted at rest using AES-256 and in transit via TLS 1.3.',
  },
  {
    icon: Database,
    title: 'Automated Daily Backups',
    description: 'Continuous data replication with daily snapshots stored in geographically redundant secure cloud storage.',
  },
  {
    icon: Users,
    title: 'Granular Role Permissions',
    description: 'Control what cashiers, inventory handlers, and managers can view. Restrict sensitive purchase costs and profit reports.',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Tenant Data Isolation',
    description: 'Every organization is logically isolated with strict database boundary security to ensure complete privacy.',
  },
  {
    icon: Globe,
    title: '99.99% Cloud Uptime SLA',
    description: 'High-availability infrastructure hosted on enterprise cloud networks with 24/7 automated health monitoring.',
  },
  {
    icon: FileSpreadsheet,
    title: '100% Data Ownership & Export',
    description: 'You own your data completely. Export your complete product catalog, invoices, and customer balances anytime to Excel or PDF.',
  },
];

/* =========================================================
   MODERN MULTI-COLUMN FOOTER STRUCTURE
========================================================= */

export const PUBLIC_FOOTER_COLUMNS: PublicFooterColumn[] = [
  {
    title: 'Who We Help',
    links: [
      { label: 'Wholesale Stocks & Distributors', to: '/solutions/wholesale-stocks' },
      { label: 'Retail Shop Owners', to: '/solutions/shop-owners' },
      { label: 'Grocery & FMCG Shops', to: '/solutions/grocery-shops' },
      { label: 'Electricians & Contractors', to: '/solutions/electricians-contractors' },
      { label: 'Enterprise Chains', to: '/solutions/enterprise' },
      { label: 'India (GST & UPI)', to: '/country/india' },
      { label: 'United Kingdom (VAT)', to: '/country/united-kingdom' },
      { label: 'Australia (GST)', to: '/country/australia' },
      { label: 'United States (Sales Tax)', to: '/country/united-states' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Inventory Management', to: '/solutions/inventory-management' },
      { label: 'Bill & Invoice Software', to: '/solutions/bill-generation-software' },
      { label: 'Stock Management', to: '/solutions/stock-management' },
      { label: 'Barcode POS & Billing', to: '/features' },
      { label: 'Customer Khata & Ledgers', to: '/features' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Security & Trust', to: '/security' },
      { label: 'Help & Support', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
    ],
  },
  {
    title: 'Product & Company',
    links: [
      { label: 'Features Overview', to: '/features' },
      { label: 'Pricing Plans', to: '/pricing' },
      { label: 'About Trimorg', to: '/about' },
      { label: 'Contact Sales', to: '/contact' },
      { label: 'Sign In', to: '/login' },
      { label: 'Start Free Trial', to: '/signup' },
    ],
  },
];

/* =========================================================
   PRICING & CURRENCY LOGIC
========================================================= */

export type Currency = 'INR' | 'USD';
export type BillingInterval = 'monthly' | 'yearly';

export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return 'INR';
  try {
    const saved = localStorage.getItem('trimorg_currency');
    if (saved === 'INR' || saved === 'USD') return saved;
  } catch {
    // Ignore storage errors
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz === 'Asia/Colombo') {
      return 'INR';
    }
  } catch {
    // Ignore timezone errors
  }
  const lang = (navigator.language || '').toLowerCase();
  const languages = (navigator.languages || []).map((l) => l.toLowerCase());
  const indianLocales = ['en-in', 'hi', 'hi-in', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'];
  const isIndianLocale =
    indianLocales.some((loc) => lang.startsWith(loc)) ||
    languages.some((l) => indianLocales.some((loc) => l.startsWith(loc)));

  return isIndianLocale ? 'INR' : 'USD';
}

export interface PlanPricing {
  monthly: number;
  yearly: number;
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
    tagline: 'For single shops & counter billing',
    description: 'Everything you need for fast POS billing, inventory tracking, and tax invoices.',
    pricing: {
      INR: { monthly: 799, yearly: 649 },
      USD: { monthly: 29, yearly: 24 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      '1 Store / Warehouse Branch',
      'Up to 2 Staff / Cashier Accounts',
      'Point of Sale (POS) & Quick Billing',
      'Inventory & Low Stock Alerts',
      'Thermal Printing (58mm / 80mm)',
      'Customer Ledger & Udhaar Tracking',
      'Basic Sales & Revenue Reports',
      'Standard Email Support',
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
    tagline: 'Best for busy retail & wholesalers',
    description: 'Advanced stock control, purchase orders, WhatsApp receipts, and multi-staff roles.',
    popular: true,
    pricing: {
      INR: { monthly: 1999, yearly: 1599 },
      USD: { monthly: 79, yearly: 64 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      'Up to 2 Store / Warehouse Branches',
      'Up to 8 Staff Accounts with Role Permissions',
      'Unlimited Invoices & SKUs',
      'Supplier Purchase Orders & Ledgers',
      'WhatsApp & SMS Digital Receipts',
      'Batch & Expiry Date Tracking',
      'Gross Profit Margin Analytics',
      'Priority Chat & Phone Support',
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
    tagline: 'For multi-branch & wholesale chains',
    description: 'Scale multi-outlet operations with central inventory transfers and dedicated SLA.',
    pricing: {
      INR: { monthly: 4499, yearly: 3599 },
      USD: { monthly: 179, yearly: 144 },
    },
    ctaText: 'Start 14-Day Free Trial',
    features: [
      'Up to 5 Store / Warehouse Branches',
      'Unlimited Staff Accounts Included',
      'Inter-Branch Stock Transfers & Sync',
      'Custom Invoice Branding & QR Code',
      'Audit Logs & Granular Permission Controls',
      'One-Click GSTR / Tax Summary Export',
      'Dedicated Account Manager & Phone SLA',
      'Assisted Excel Catalog Import & Staff Training',
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
