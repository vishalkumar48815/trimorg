import { Navigate, Route, Routes } from 'react-router';
import { flattenNavItems, navigationConfig } from '@/shell/navigation.config';
import { ComingSoonPage } from '@/shell/coming-soon-page';
import { NotFoundPage } from '@/shell/not-found-page';

const leafItems = flattenNavItems(navigationConfig);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
