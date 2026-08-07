import { useState } from 'react';
import { AppRoutes } from '@/shell/app-routes';
import { MobileDrawer } from '@/shell/mobile-drawer';
import { Sidebar } from '@/shell/sidebar';
import { TopNav } from '@/shell/top-nav';

export function AppShell() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileDrawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
