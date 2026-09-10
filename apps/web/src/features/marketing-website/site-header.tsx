import type { ReactElement } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PUBLIC_NAV_LINKS } from '@/features/marketing-website/public-site.data';
import { ThemeToggle } from '@/shell/theme-toggle';

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps): ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-3 z-50 w-full rounded-2xl border border-border/60 bg-background/75 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-background/90 hover:shadow-md lg:px-6 lg:py-3',
        className,
      )}
    >
      {/* Top Navbar Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 font-bold text-foreground group shrink-0"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105">
            T
          </span>
          <span className="text-base font-bold tracking-tight">Trimorg</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {PUBLIC_NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-surface-secondary hover:text-foreground',
                  isActive ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="shadow-[var(--shadow-raised)]">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Controls (Theme Toggle + Hamburger) */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="rounded-xl text-foreground"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {mobileMenuOpen && (
        <div className="mt-3.5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl lg:hidden animate-in fade-in-50 slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-1">
            {PUBLIC_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleLinkClick}
                className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 hover:text-primary active:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border/70 pt-3 flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full justify-center rounded-xl"
              onClick={handleLinkClick}
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="w-full justify-center rounded-xl shadow-md"
              onClick={handleLinkClick}
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
