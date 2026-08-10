import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { PUBLIC_FOOTER_COLUMNS } from '@/features/marketing-website/public-site.data';

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps): ReactElement {
  return (
    <footer className={cn('space-y-8 border-t border-border/70 pt-8', className)}>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-sm text-primary-foreground shadow-[var(--shadow-raised)]">
              T
            </span>
            <span className="text-base tracking-tight">Trimorg</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Trimorg is built for wholesalers, distributors, and shop owners who need clarity,
            control, and a premium product experience that stays calm as it grows.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PUBLIC_FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h2 className="text-sm font-medium text-foreground">{column.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link className="transition-colors hover:text-foreground" to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Trimorg. All rights reserved.</p>
        <p>Premium SaaS layout, no backend, no fake business logic.</p>
      </div>
    </footer>
  );
}
