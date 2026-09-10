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
import { ProductsPage } from '@/features/products/products-page';
import { InvoicesPage, NewSalePage } from '@/features/sales';

const DASHBOARD_PATH = '/dashboard';
const CATEGORIES_PATH = '/business/categories';
const PRODUCTS_PATH = '/business/products';
const CUSTOMERS_PATH = '/business/customers';
const SALES_POS_PATH = '/sales/pos';
const SALES_INVOICES_PATH = '/sales/invoices';

const EXPLICIT_ROUTES = new Set([
  DASHBOARD_PATH,
  CATEGORIES_PATH,
  PRODUCTS_PATH,
  CUSTOMERS_PATH,
  SALES_POS_PATH,
  SALES_INVOICES_PATH,
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
      <Route path={SALES_POS_PATH} element={<NewSalePage />} />
      <Route path={SALES_INVOICES_PATH} element={<InvoicesPage />} />
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
