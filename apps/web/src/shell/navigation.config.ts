import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Tags,
  Users,
  Truck,
  Warehouse,
  ShoppingCart,
  FileText,
  ClipboardList,
  Receipt,
  CreditCard,
  ShoppingBag,
  FileInput,
  PackageCheck,
  BarChart3,
  TrendingUp,
  PieChart,
  Settings,
  Building,
  UserCog,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  path?: string;
  children?: NavItem[];
  /** Reserved for future RBAC gating. Undefined means visible to everyone. */
  permission?: string;
  /** Reserved for future use (e.g. pending counts). Undefined means no badge. */
  badge?: string;
  /** Reserved for future use. Undefined/false means shown in navigation. */
  hidden?: boolean;
}

export const navigationConfig: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'business',
    title: 'Business',
    icon: Building2,
    children: [
      { id: 'business-products', title: 'Products', icon: Package, path: '/business/products' },
      { id: 'business-categories', title: 'Categories', icon: Tags, path: '/business/categories' },
      { id: 'business-customers', title: 'Customers', icon: Users, path: '/business/customers' },
      { id: 'business-suppliers', title: 'Suppliers', icon: Truck, path: '/business/suppliers' },
      {
        id: 'business-inventory',
        title: 'Inventory',
        icon: Warehouse,
        path: '/business/inventory',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: ShoppingCart,
    children: [
      { id: 'sales-pos', title: 'New Sale / POS', icon: ShoppingCart, path: '/sales/pos' },
      { id: 'sales-invoices', title: 'Invoices', icon: Receipt, path: '/sales/invoices' },
      { id: 'sales-quotations', title: 'Quotations', icon: FileText, path: '/sales/quotations' },
      { id: 'sales-orders', title: 'Orders', icon: ClipboardList, path: '/sales/orders' },
      { id: 'sales-payments', title: 'Payments', icon: CreditCard, path: '/sales/payments' },
    ],
  },
  {
    id: 'purchases',
    title: 'Purchases',
    icon: ShoppingBag,
    children: [
      {
        id: 'purchases-purchase-orders',
        title: 'Purchase Orders',
        icon: FileInput,
        path: '/purchases/purchase-orders',
      },
      {
        id: 'purchases-goods-received',
        title: 'Goods Received',
        icon: PackageCheck,
        path: '/purchases/goods-received',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart3,
    children: [
      { id: 'reports-sales', title: 'Sales Reports', icon: TrendingUp, path: '/reports/sales' },
      {
        id: 'reports-inventory',
        title: 'Inventory Reports',
        icon: PieChart,
        path: '/reports/inventory',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    children: [
      { id: 'settings-company', title: 'Company', icon: Building, path: '/settings/company' },
      { id: 'settings-users', title: 'Users', icon: UserCog, path: '/settings/users' },
      { id: 'settings-roles', title: 'Roles', icon: ShieldCheck, path: '/settings/roles' },
      {
        id: 'settings-preferences',
        title: 'Preferences',
        icon: SlidersHorizontal,
        path: '/settings/preferences',
      },
    ],
  },
];

/** Flattens the tree into leaf (path-bearing) items only — used to generate routes. */
export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.children ? flattenNavItems(item.children) : [item]));
}
