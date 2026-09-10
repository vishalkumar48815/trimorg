import { Navigate, Route, Routes } from 'react-router';
import { flattenNavItems, navigationConfig } from '@/shell/navigation.config';
import { ComingSoonPage } from '@/shell/coming-soon-page';
import { NotFoundPage } from '@/shell/not-found-page';
import { BusinessSettingsPage } from '@/features/account/business-settings-page';
import { ChangePasswordPage } from '@/features/account/change-password-page';
import { ProfilePage } from '@/features/account/profile-page';
import { CategoriesPage } from '@/features/categories/categories-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { ProductsPage } from '@/features/products/products-page';

const DASHBOARD_PATH = '/dashboard';
const CATEGORIES_PATH = '/business/categories';
const PRODUCTS_PATH = '/business/products';

// Leaf items with their own real page are excluded from the generic
// "Coming Soon" loop and given an explicit route below instead.
const leafItems = flattenNavItems(navigationConfig).filter(
  (item) =>
    item.path !== DASHBOARD_PATH && item.path !== CATEGORIES_PATH && item.path !== PRODUCTS_PATH,
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={DASHBOARD_PATH} replace />} />
      <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
      <Route path={PRODUCTS_PATH} element={<ProductsPage />} />
      <Route path={CATEGORIES_PATH} element={<CategoriesPage />} />
      {/* Account routes are reachable only via the User Menu, not the sidebar —
          intentionally not part of navigationConfig. */}
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
