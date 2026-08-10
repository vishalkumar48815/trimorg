import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PUBLIC_NAV_LINKS } from '@/features/marketing-website/public-site.data';

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps): ReactElement {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-sm text-primary-foreground shadow-[var(--shadow-raised)]">
          T
        </span>
        <span className="text-base tracking-tight">Trimorg</span>
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1">
          {PUBLIC_NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="shadow-[var(--shadow-raised)]">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
