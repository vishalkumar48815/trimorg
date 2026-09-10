import { useMemo, type ReactElement } from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { COUNTRY_SOLUTIONS, getPageFaqs } from '@/features/marketing-website/public-site.data';

export function CountrySolutionPage(): ReactElement {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country = countrySlug ? COUNTRY_SOLUTIONS[countrySlug] : undefined;

  const pageFaqs = useMemo(() => {
    return getPageFaqs('billing', 404);
  }, []);

  if (!country) {
    return <Navigate to="/features" replace />;
  }

  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        {/* Country Hero */}
        <PageReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="text-base">{country.flag}</span>
              <span>Trimorg for {country.countryName}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground leading-[1.15]">
              {country.heroHeadline}
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {country.heroSubheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl shadow-md font-semibold sm:h-12 sm:px-8">
                <Link to="/signup">
                  Start Free Trial in {country.countryName}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl sm:h-12 sm:px-6">
                <Link to="/pricing">Pricing in {country.currencyCode}</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground font-medium pt-1">
              {country.pricingHighlight}
            </p>
          </div>
        </PageReveal>

        {/* Tax Compliance Callout Box */}
        <PageReveal>
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {country.taxComplianceTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Pre-configured tax rules, statutory invoice formats, and accounting export standards.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {country.taxComplianceDetails.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-4 text-xs sm:text-sm font-medium text-foreground shadow-2xs"
                >
                  <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </PageReveal>

        {/* Localized Features Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Why {country.countryName} Businesses Run on Trimorg
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Optimized for local payment methods, fast cloud servers, and regional workflows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {country.localFeatures.map((feat, index) => (
              <PageReveal key={feat.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm p-6 sm:p-7 hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{feat.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                </Card>
              </PageReveal>
            ))}
          </div>
        </div>

        {/* Country FAQs */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Questions from {country.countryName} Merchants
            </h2>
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

        {/* CTA Card */}
        <PageReveal>
          <Card className="rounded-2xl sm:rounded-3xl border-border/80 bg-primary text-primary-foreground shadow-xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight">
                Get started with Trimorg in {country.countryName} today.
              </h3>
              <p className="text-xs sm:text-sm text-primary-foreground/90">
                Full 14-day access to all POS billing, inventory, and tax compliance tools with zero upfront card requirement.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-xl shadow-md shrink-0 font-semibold h-12 px-8">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </PageReveal>
      </div>
    </PublicSiteLayout>
  );
}
