import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { ShieldCheck, Zap, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PUBLIC_FOOTER_COLUMNS } from '@/features/marketing-website/public-site.data';

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps): ReactElement {
  return (
    <footer className={cn('space-y-10 border-t border-border/70 pt-12 pb-8', className)}>
      {/* Top Value Banner */}
      <div className="grid gap-6 rounded-2xl border border-border/80 bg-card/60 p-6 sm:grid-cols-2 lg:grid-cols-4 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Zap className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Fast POS & Invoicing</p>
            <p className="text-[11px] text-muted-foreground">Under 2s barcode checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">100% Tax Compliant</p>
            <p className="text-[11px] text-muted-foreground">GST, VAT & Sales Tax ready</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Lock className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">256-Bit Encrypted</p>
            <p className="text-[11px] text-muted-foreground">Daily automated cloud backups</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Globe className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Multi-Region Support</p>
            <p className="text-[11px] text-muted-foreground">India, UK, Australia & US</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="grid gap-10 lg:grid-cols-[1fr_2.5fr]">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-foreground group">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105">
              T
            </span>
            <span className="text-base font-bold tracking-tight">Trimorg</span>
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Trimorg is the modern Business Operating System (BOS) for wholesale distributors, retail shop owners, grocery stores, and trade contractors.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational (99.99% Uptime)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Trimorg Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span className="text-border">•</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span className="text-border">•</span>
          <Link to="/security" className="hover:text-foreground transition-colors">
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}
