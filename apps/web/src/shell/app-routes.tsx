import { Navigate, Route, Routes } from 'react-router';
import { flattenNavItems, navigationConfig } from '@/shell/navigation.config';
import { ComingSoonPage } from '@/shell/coming-soon-page';
import { NotFoundPage } from '@/shell/not-found-page';
import { BusinessSettingsPage } from '@/features/account/business-settings-page';
import { ChangePasswordPage } from '@/features/account/change-password-page';
import { ProfilePage } from '@/features/account/profile-page';
import { CategoriesPage } from '@/features/categories/categories-page';
import { CustomersPage } from '@/features/customers';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { InventoryPage } from '@/features/inventory';
import { ProductsPage } from '@/features/products/products-page';
import { GoodsReceivedPage, PurchaseOrdersPage } from '@/features/purchases';
import { InvoicesPage, NewSalePage, OrdersPage, QuotationsPage } from '@/features/sales';
import { PaymentsPage } from '@/features/payments';
import { InventoryReportsPage, SalesReportsPage } from '@/features/reports';
import {
  CompanySettingsPage,
  PreferencesPage,
  RolesPage,
  TeamUsersPage,
} from '@/features/settings';
import { SuppliersPage } from '@/features/suppliers';

const DASHBOARD_PATH = '/dashboard';
const CATEGORIES_PATH = '/business/categories';
const PRODUCTS_PATH = '/business/products';
const CUSTOMERS_PATH = '/business/customers';
const SUPPLIERS_PATH = '/business/suppliers';
const INVENTORY_PATH = '/business/inventory';
const SALES_POS_PATH = '/sales/pos';
const SALES_INVOICES_PATH = '/sales/invoices';
const SALES_QUOTATIONS_PATH = '/sales/quotations';
const SALES_ORDERS_PATH = '/sales/orders';
const SALES_PAYMENTS_PATH = '/sales/payments';
const PURCHASES_PO_PATH = '/purchases/purchase-orders';
const PURCHASES_GRN_PATH = '/purchases/goods-received';
const REPORTS_SALES_PATH = '/reports/sales';
const REPORTS_INVENTORY_PATH = '/reports/inventory';
const SETTINGS_COMPANY_PATH = '/settings/company';
const SETTINGS_USERS_PATH = '/settings/users';
const SETTINGS_ROLES_PATH = '/settings/roles';
const SETTINGS_PREFERENCES_PATH = '/settings/preferences';

const EXPLICIT_ROUTES = new Set([
  DASHBOARD_PATH,
  CATEGORIES_PATH,
  PRODUCTS_PATH,
  CUSTOMERS_PATH,
  SUPPLIERS_PATH,
  INVENTORY_PATH,
  SALES_POS_PATH,
  SALES_INVOICES_PATH,
  SALES_QUOTATIONS_PATH,
  SALES_ORDERS_PATH,
  SALES_PAYMENTS_PATH,
  PURCHASES_PO_PATH,
  PURCHASES_GRN_PATH,
  REPORTS_SALES_PATH,
  REPORTS_INVENTORY_PATH,
  SETTINGS_COMPANY_PATH,
  SETTINGS_USERS_PATH,
  SETTINGS_ROLES_PATH,
  SETTINGS_PREFERENCES_PATH,
]);

// Leaf items with their own real page are excluded from the generic
// "Coming Soon" loop and given an explicit route below instead.
const leafItems = flattenNavItems(navigationConfig).filter(
  (item) => item.path && !EXPLICIT_ROUTES.has(item.path),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={DASHBOARD_PATH} replace />} />
      <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
      <Route path={PRODUCTS_PATH} element={<ProductsPage />} />
      <Route path={CATEGORIES_PATH} element={<CategoriesPage />} />
      <Route path={CUSTOMERS_PATH} element={<CustomersPage />} />
      <Route path={SUPPLIERS_PATH} element={<SuppliersPage />} />
      <Route path={INVENTORY_PATH} element={<InventoryPage />} />
      <Route path={SALES_POS_PATH} element={<NewSalePage />} />
      <Route path={SALES_INVOICES_PATH} element={<InvoicesPage />} />
      <Route path={SALES_QUOTATIONS_PATH} element={<QuotationsPage />} />
      <Route path={SALES_ORDERS_PATH} element={<OrdersPage />} />
      <Route path={SALES_PAYMENTS_PATH} element={<PaymentsPage />} />
      <Route path={PURCHASES_PO_PATH} element={<PurchaseOrdersPage />} />
      <Route path={PURCHASES_GRN_PATH} element={<GoodsReceivedPage />} />
      <Route path={REPORTS_SALES_PATH} element={<SalesReportsPage />} />
      <Route path={REPORTS_INVENTORY_PATH} element={<InventoryReportsPage />} />
      <Route path={SETTINGS_COMPANY_PATH} element={<CompanySettingsPage />} />
      <Route path={SETTINGS_USERS_PATH} element={<TeamUsersPage />} />
      <Route path={SETTINGS_ROLES_PATH} element={<RolesPage />} />
      <Route path={SETTINGS_PREFERENCES_PATH} element={<PreferencesPage />} />
      {/* Account routes are reachable only via the User Menu, not the sidebar */}
      <Route path="/account/profile" element={<ProfilePage />} />
      <Route path="/account/business" element={<BusinessSettingsPage />} />
      <Route path="/account/change-password" element={<ChangePasswordPage />} />
      {leafItems.map(
        (item) =>
          item.path && (
            <Route key={item.id} path={item.path} element={<ComingSoonPage title={item.title} />} />
          ),
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
