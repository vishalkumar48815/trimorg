import { useMemo, type ReactElement } from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { SOLUTION_VERTICALS, getPageFaqs } from '@/features/marketing-website/public-site.data';

export function IndustrySolutionPage(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const solution = slug ? SOLUTION_VERTICALS[slug] : undefined;

  const pageFaqs = useMemo(() => {
    if (!solution) return [];
    // Combine specific solution FAQs with fixed core FAQs
    const coreFaqs = getPageFaqs('features', 111);
    const customFaqs = solution.faqs.map((f, i) => ({
      id: `sol-faq-${i}`,
      category: 'features' as const,
      question: f.question,
      answer: f.answer,
    }));
    return [...customFaqs, ...coreFaqs.slice(0, 3)];
  }, [solution]);

  if (!solution) {
    return <Navigate to="/features" replace />;
  }

  const Icon = solution.icon;

  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <PageReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Icon className="size-4" />
              <span>{solution.title}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground leading-[1.15]">
              {solution.heroHeadline}
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {solution.heroSubheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl shadow-md font-semibold sm:h-12 sm:px-8">
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl sm:h-12 sm:px-6">
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </PageReveal>

        {/* Stats Row */}
        <PageReveal delay={0.05}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            {solution.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/80 p-6 text-center shadow-xs"
              >
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </PageReveal>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Why {solution.shortTitle} choose Trimorg
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Purpose-built tools to simplify daily operations, eliminate mistakes, and grow revenue.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {solution.benefits.map((benefit, index) => (
              <PageReveal key={benefit.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm p-6 sm:p-7 hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{benefit.title}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </PageReveal>
            ))}
          </div>
        </div>

        {/* Key Features Breakdown */}
        <PageReveal>
          <div className="rounded-3xl border border-border/80 bg-surface-secondary/40 p-6 sm:p-10 space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Zap className="size-4" />
                Tailored Workflows
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Engineered for {solution.shortTitle}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {solution.keyFeatures.map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold text-foreground">{feat.title}</h4>
                    {feat.badge && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PageReveal>

        {/* FAQs */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Common Questions for {solution.shortTitle}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible defaultValue="sol-faq-0" className="w-full space-y-3">
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
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                <ShieldCheck className="size-4" />
                14-Day Risk-Free Trial
              </div>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight">
                Ready to transform your {solution.shortTitle.toLowerCase()} workflow?
              </h3>
              <p className="text-xs sm:text-sm text-primary-foreground/90">
                Join hundreds of businesses running daily billing, inventory, and ledger on Trimorg.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-xl shadow-md shrink-0 font-semibold h-12 px-8">
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
