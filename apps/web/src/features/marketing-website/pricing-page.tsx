import { useState, useMemo, type ReactElement } from 'react';
import { ArrowRight, Check, Zap, Shield, HelpCircle, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import {
  getPageFaqs,
  PRICING_PLANS,
  detectUserCurrency,
  type Currency,
  type BillingInterval,
} from '@/features/marketing-website/public-site.data';

export function PricingPage(): ReactElement {
  const [currency] = useState<Currency>(() => detectUserCurrency());
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const pageFaqs = useMemo(() => getPageFaqs('billing', 101), []);

  return (
    <PublicSiteLayout>
      <div className="space-y-8 sm:space-y-10">
        {/* Top Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-primary">
            Simple, Transparent Pricing
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Invest in clarity. Scale with confidence.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Choose the plan that fits your business scale. All plans include a 14-day risk-free trial.
          </p>

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

        {/* Pricing Cards Grid */}
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

        {/* Enterprise & Custom Callout */}
        <PageReveal>
          <Card className="rounded-2xl border-border/80 bg-surface-secondary/40 shadow-sm overflow-hidden">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Custom Requirements?
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Running 10+ branches or need custom ERP integrations?
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  We offer custom deployments, dedicated database instances, custom feature builds, and on-premise configurations for large automotive networks.
                </p>
              </div>
              <Button asChild size="lg" variant="outline" className="rounded-xl shrink-0">
                <Link to="/contact">
                  Talk to Sales
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </PageReveal>

        {/* FAQ Section with Accessible Radix Accordions & Schema.org Structured Data */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about TrimOrg billing, tiers, data security, and setup.
            </p>
          </div>

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
        </div>
      </div>
    </PublicSiteLayout>
  );
}
