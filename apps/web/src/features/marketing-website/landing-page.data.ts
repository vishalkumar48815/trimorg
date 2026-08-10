import { BarChart3, Boxes, ShieldCheck, Sparkles, Truck, Workflow, type LucideIcon } from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
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
    title: 'Inventory control',
    description: 'Keep products, stock, and selling data organized in one calm workspace.',
    icon: Boxes,
  },
  {
    title: 'Sales operations',
    description: 'Track orders, billing, and customer workflows without jumping between tools.',
    icon: Truck,
  },
  {
    title: 'Replenishment flow',
    description: 'Stay aligned with purchasing and replenishment in the same operating system.',
    icon: ShieldCheck,
  },
  {
    title: 'Operational visibility',
    description: 'Bring visibility to daily operations with a structure that can grow over time.',
    icon: BarChart3,
  },
];

export const workItems: StepItem[] = [
  {
    title: 'Set up your structure',
    description: 'Start with products, categories, customers, and the core entities your team uses every day.',
  },
  {
    title: 'Run the day',
    description: 'Use one workspace for sales, inventory, and fulfillment instead of scattered spreadsheets.',
  },
  {
    title: 'Scale with control',
    description: 'Add more workflows over time while keeping the interface predictable and easy to use.',
  },
];

export const benefitItems: BenefitItem[] = [
  {
    title: 'Clearer visibility',
    description: 'See the business through a single operating surface instead of disconnected tools.',
    icon: ShieldCheck,
  },
  {
    title: 'Calmer daily work',
    description: 'Reduce noise by keeping the interface focused, minimal, and easy to scan.',
    icon: Sparkles,
  },
  {
    title: 'Built for growth',
    description: 'Keep the foundation clean so the product can expand without becoming fragile.',
    icon: Workflow,
  },
];

export const trustedByLogos: string[] = [
  'Logo placeholder',
  'Logo placeholder',
  'Logo placeholder',
  'Logo placeholder',
  'Logo placeholder',
  'Logo placeholder',
];

export const footerColumns = [
  {
    title: 'Product',
    links: ['Dashboard', 'Products', 'Sales', 'Inventory'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Careers', 'Press'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Support', 'Pricing', 'FAQ'],
  },
] as const;
