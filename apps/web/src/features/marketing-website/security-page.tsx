import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { SECURITY_FEATURES } from '@/features/marketing-website/public-site.data';

export function SecurityPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <PageReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4" />
              <span>Enterprise Security & Trust</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground leading-[1.15]">
              Your business data, protected with uncompromising standards.
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Trimorg is engineered from the ground up with military-grade encryption, continuous backups, and strict data isolation so you can run operations with total confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl shadow-md font-semibold sm:h-12 sm:px-8">
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl sm:h-12 sm:px-6">
                <Link to="/contact">Contact Security Team</Link>
              </Button>
            </div>
          </div>
        </PageReveal>

        {/* Core Security Pillars Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {SECURITY_FEATURES.map((item, index) => {
            const Icon = item.icon;

            return (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm hover:border-primary/40 hover:shadow-xl transition-all p-6 sm:p-7 space-y-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">{item.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </Card>
              </PageReveal>
            );
          })}
        </div>

        {/* Security Commitments Breakdown */}
        <PageReveal>
          <div className="rounded-3xl border border-border/80 bg-surface-secondary/40 p-6 sm:p-10 space-y-6 max-w-5xl mx-auto">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Lock className="size-4" />
                Data Privacy & Compliance Guarantees
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Our Non-Negotiable Security Principles
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <CheckCircle2 className="size-4.5 text-emerald-500" />
                  <span>Zero Third-Party Data Selling</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We never monetize, share, or sell your business transactions, customer databases, or vendor pricing to third parties or advertising networks.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <CheckCircle2 className="size-4.5 text-emerald-500" />
                  <span>Role-Based Staff Access (RBAC)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cashiers and billing clerks only see the POS billing counter. Purchase costs, supplier margins, and financial reports remain restricted to owners.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <CheckCircle2 className="size-4.5 text-emerald-500" />
                  <span>Complete Data Ownership & Portability</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Export all your historical invoices, inventory movements, customer lists, and tax summaries to Excel or PDF format anytime with zero lock-in.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <CheckCircle2 className="size-4.5 text-emerald-500" />
                  <span>Encrypted Automated Cloud Snapshots</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Daily automated database backups are encrypted and stored across redundant disaster recovery zones with point-in-time recovery.
                </p>
              </div>
            </div>
          </div>
        </PageReveal>

        {/* CTA */}
        <PageReveal>
          <Card className="rounded-2xl sm:rounded-3xl border-border/80 bg-primary text-primary-foreground shadow-xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Experience enterprise-grade security for your business.
              </h3>
              <p className="text-xs sm:text-sm text-primary-foreground/90">
                Start your 14-day free trial today with full access and complete peace of mind.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-xl shadow-md shrink-0 font-semibold">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </PageReveal>
      </div>
    </PublicSiteLayout>
  );
}
