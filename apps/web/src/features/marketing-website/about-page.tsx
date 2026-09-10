import { useMemo, type ReactElement } from 'react';
import { BarChart3, Boxes, Sparkles, Workflow, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { getPageFaqs } from '@/features/marketing-website/public-site.data';

const principles = [
  {
    icon: Boxes,
    title: 'Operational clarity',
    description: 'Trimorg is designed to help teams understand the real-time state of their business at a single glance.',
  },
  {
    icon: Workflow,
    title: 'Reusable structure',
    description: 'The product grows through reusable, reliable components instead of fragmented ad hoc screens.',
  },
  {
    icon: Sparkles,
    title: 'Premium restraint',
    description: 'The interface stays calm, minimal, and professional even as complex capabilities expand.',
  },
  {
    icon: BarChart3,
    title: 'Room to scale',
    description: 'The architecture is intentionally clean so future workflows remain performant and maintainable.',
  },
];

export function AboutPage(): ReactElement {
  const pageFaqs = useMemo(() => getPageFaqs('support', 404), []);

  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        <PageHeader
          eyebrow="About"
          title="About Trimorg"
          description="Trimorg is built as a modern business operating system for wholesalers, distributors, retail shops, and automotive workshops."
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <PageReveal>
            <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm p-6 sm:p-8">
              <CardHeader className="p-0 space-y-3 pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold">Our mission</CardTitle>
                <CardDescription className="text-sm leading-relaxed sm:text-base text-muted-foreground">
                  Give growing businesses a single, calm workspace that feels trustworthy within seconds and stays maintainable over years of continuous use.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <p>
                  Trimorg favors clarity over clutter, structure over novelty, and reusable foundations over one-off experiences.
                </p>
                <p>
                  Every surface is engineered to support long days of inventory, billing, and sales work without exhausting the person using it.
                </p>
              </CardContent>
            </Card>
          </PageReveal>

          <PageReveal delay={0.05}>
            <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-surface-secondary/40 shadow-sm p-6 sm:p-8">
              <CardHeader className="p-0 space-y-2 pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold">Product principles</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Core design philosophies guiding every screen and interaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {['Premium, not flashy', 'Reusable, not one-off', 'Calm, not crowded'].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-border bg-background/80 px-4 py-3 text-xs sm:text-sm font-semibold text-foreground shadow-xs"
                    >
                      {item}
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </PageReveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/40">
                  <CardHeader className="space-y-4 p-6 sm:p-7">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                      <Icon className="h-5 w-5" aria-hidden="true" />
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

        {/* FAQ Section */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              About TrimOrg & Our Vision
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Learn more about how TrimOrg is structured, our engineering philosophy, and customer support.
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

        {/* CTA */}
        <PageReveal>
          <Card className="rounded-2xl border-border/80 bg-card shadow-lg p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Transform your business operations today.</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Get started in minutes with our 14-day free trial.</p>
            </div>
            <Button asChild size="lg" className="rounded-xl shadow-md shrink-0">
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
