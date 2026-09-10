import { useState, useMemo, type ReactElement } from 'react';
import { ArrowRight, Check, CheckCircle2, ChevronRight, Zap, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import {
  benefitItems,
  featureItems,
  trustedByLogos,
  workItems,
} from '@/features/marketing-website/landing-page.data';
import { SectionHeading } from '@/features/marketing-website/section-heading';
import {
  getPageFaqs,
  PRICING_PLANS,
  detectUserCurrency,
  type Currency,
  type BillingInterval,
} from '@/features/marketing-website/public-site.data';

export function LandingPage(): ReactElement {
  const [currency] = useState<Currency>(() => detectUserCurrency());
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const pageFaqs = useMemo(() => getPageFaqs('features', 202), []);

  return (
    <PublicSiteLayout>
      <PageReveal>
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 pt-2 sm:pt-4">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground shadow-xs">
              <span className="size-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              SME & Workshop Operating System (BOS)
            </div>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.18] sm:leading-[1.12]">
                One calm workspace for your business operations.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
                Trimorg unifies POS billing, customer CRM, real-time inventory, procurement, and tax reporting in a high-clarity workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="default" className="w-full sm:w-auto rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:h-12 sm:px-6">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="w-full sm:w-auto rounded-xl transition-all duration-300 hover:scale-[1.02] sm:h-12 sm:px-6">
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>

          <div id="demo">
            <Card className="overflow-hidden border-border/80 bg-card shadow-xl rounded-2xl sm:rounded-3xl transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="border-b border-border/70 p-5 sm:p-7">
                <CardTitle className="text-sm sm:text-base font-bold text-foreground">Workspace Overview</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  POS Cashier · Real-Time Stock · Customer Dues · GST Tax Reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  {['Point of Sale', 'Stock Inventory', 'Invoices & Dues', 'GST Reports'].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl sm:rounded-2xl border border-border bg-background/80 p-3.5 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <CheckCircle2 className="size-4 sm:size-5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-foreground">{item}</p>
                          <p className="text-[11px] text-emerald-600 font-medium dark:text-emerald-400">Live Ready</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-dashed border-border bg-muted/20 p-4 sm:p-5">
                  <div className="space-y-2.5">
                    <div className="h-2.5 sm:h-3 w-3/5 rounded-full bg-primary/20" />
                    <div className="h-2.5 sm:h-3 w-4/5 rounded-full bg-primary/10" />
                    <div className="h-2.5 sm:h-3 w-2/3 rounded-full bg-primary/15" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section className="space-y-6 sm:space-y-10">
          <SectionHeading
            eyebrow="Trusted by"
            title="Built for modern retail & repair businesses."
            description="Designed for high-reliability countertop billing, workshop job tracking, and SME supply chains."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trustedByLogos.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="flex h-16 sm:h-20 items-center justify-center rounded-xl sm:rounded-2xl border border-border/80 bg-card text-xs font-semibold text-muted-foreground shadow-xs transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:text-foreground"
              >
                {label}
              </div>
            ))}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="features" className="space-y-6 sm:space-y-10">
          <SectionHeading
            eyebrow="Features"
            title="Core capabilities for daily operating rhythm."
            description="Trimorg keeps the surface focused on the work business owners and staff actually do every day."
          />
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <PageReveal key={item.title} delay={index * 0.05}>
                  <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/40">
                    <CardHeader className="space-y-3 sm:space-y-4 p-5 sm:p-7">
                      <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                        <Icon className="size-4 sm:size-5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base sm:text-lg font-bold text-foreground">{item.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </PageReveal>
              );
            })}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="how-it-works" className="space-y-6 sm:space-y-10">
          <SectionHeading
            eyebrow="How it works"
            title="A simple flow for a complex business."
            description="The product feels obvious to use while providing operational depth across every department."
          />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {workItems.map((item, index) => (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/40">
                  <CardHeader className="space-y-2 sm:space-y-3 p-5 sm:p-7">
                    <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                      Step {index + 1}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">{item.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            ))}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section className="space-y-6 sm:space-y-10">
          <SectionHeading
            eyebrow="Benefits"
            title="Premium structure that stays calm as you grow."
            description="The interface prioritizes clarity, efficiency, and stable visual rhythm over clutter."
          />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {benefitItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <PageReveal key={item.title} delay={index * 0.05}>
                  <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/40">
                    <CardHeader className="space-y-3 sm:space-y-4 p-5 sm:p-7">
                      <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                        <Icon className="size-4 sm:size-5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base sm:text-lg font-bold text-foreground">{item.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </PageReveal>
              );
            })}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="pricing" className="space-y-8 sm:space-y-10">
          <div className="flex flex-col items-center text-center space-y-3">
            <SectionHeading
              eyebrow="Pricing"
              title="Straightforward pricing for every business size."
              description="Transparent tiers tailored for single stores, growing multi-staff workshops, and distributors."
            />

            {/* Controls: Billing Interval Toggle (Monthly / Yearly) */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center rounded-xl p-1 bg-muted/60 border border-border shadow-inner">
                <button
                  type="button"
                  onClick={() => setInterval('monthly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    interval === 'monthly'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setInterval('yearly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    interval === 'yearly'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch pt-2">
            {PRICING_PLANS.map((plan, index) => {
              const pricing = plan.pricing[currency];
              const price = interval === 'yearly' ? pricing.yearly : pricing.monthly;
              const currencySymbol = currency === 'INR' ? '₹' : '$';

              return (
                <PageReveal key={plan.id} delay={index * 0.08} className="overflow-visible">
                  <Card
                    className={`relative flex flex-col h-full rounded-2xl overflow-visible transition-all duration-300 ${
                      plan.popular
                        ? 'border border-primary bg-card shadow-xl ring-1 ring-primary/30 hover:scale-[1.015]'
                        : 'border border-border/80 bg-card/90 shadow-sm hover:border-border hover:shadow-md hover:scale-[1.015]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-0.5 text-xs font-bold text-primary-foreground shadow-md whitespace-nowrap">
                          <Zap className="h-3 w-3 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <CardHeader className="space-y-3 pt-6 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground min-h-[32px]">
                        {plan.description}
                      </CardDescription>

                      {/* Price display */}
                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            {currencySymbol}{price.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">/ month</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {interval === 'yearly'
                            ? `Billed annually (${currencySymbol}${(price * 12).toLocaleString()}/year)`
                            : 'Billed monthly, cancel anytime'}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4 pt-2 pb-4 border-t border-border/40">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Included with {plan.name}:
                      </p>
                      <ul className="space-y-2.5 text-xs sm:text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-muted-foreground">
                            <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Expansion Add-On Costs (+per user, +per branch) */}
                      <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5 bg-muted/30 -mx-6 px-6 py-3 rounded-b-lg">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Users className="size-3.5 text-primary" />
                            Extra Staff / User:
                          </span>
                          <span className="font-semibold text-foreground">
                            {plan.extraStaffCost[currency]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Building2 className="size-3.5 text-primary" />
                            Extra Branch / Store:
                          </span>
                          <span className="font-semibold text-foreground">
                            {plan.extraBranchCost[currency]}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-6">
                      <Button
                        asChild
                        size="lg"
                        variant={plan.popular ? 'default' : 'outline'}
                        className="w-full font-semibold rounded-xl text-xs sm:text-sm shadow-sm"
                      >
                        <Link to="/signup">
                          {plan.ctaText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </PageReveal>
              );
            })}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="faq" className="space-y-6 sm:space-y-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions."
            description="Clear answers about TrimOrg's capabilities, offline resilience, data ownership, and setup."
          />
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible defaultValue="core-1" className="w-full space-y-3">
              {pageFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-border/80 bg-card/90 px-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-md"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground pb-4 pt-1">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section className="space-y-6 sm:space-y-8">
          <Card className="overflow-hidden rounded-2xl sm:rounded-3xl border-border/80 bg-primary text-primary-foreground shadow-xl">
            <CardContent className="flex flex-col gap-6 sm:gap-8 p-6 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-2 sm:space-y-3">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground/80">
                  Get started
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  Build a cleaner operating system for your business.
                </h2>
                <p className="max-w-xl text-xs sm:text-base leading-relaxed text-primary-foreground/90">
                  Start your business operating system today with fast POS checkout, customer vehicle tracking, and real-time inventory.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" size="default" className="w-full sm:w-auto rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] sm:h-12 sm:px-6">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto rounded-xl border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-[1.02] sm:h-12 sm:px-6"
                >
                  <a href="#features">
                    Explore features
                    <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </PageReveal>
    </PublicSiteLayout>
  );
}
