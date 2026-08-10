import type { ReactElement, ReactNode } from 'react';
import { SiteFooter } from '@/features/marketing-website/site-footer';
import { SiteHeader } from '@/features/marketing-website/site-header';

interface PublicSiteLayoutProps {
  children: ReactNode;
}

export function PublicSiteLayout({ children }: PublicSiteLayoutProps): ReactElement {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(57,73,171,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(57,73,171,0.08),transparent_28%),linear-gradient(to_bottom,var(--color-background),transparent)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SiteHeader />
        <div className="flex flex-col gap-24">{children}</div>
        <SiteFooter />
      </div>
    </main>
  );
}
