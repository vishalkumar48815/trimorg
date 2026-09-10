import { useMemo, type ReactElement } from 'react';
import { BarChart3, Boxes, ShieldCheck, Workflow, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { getPageFaqs } from '@/features/marketing-website/public-site.data';

const featureBlocks = [
  {
    icon: Boxes,
    title: 'Product and inventory control',
    description: 'Keep your catalog, stock, and selling data organized in one calm workspace with barcode search and multi-warehouse sync.',
  },
  {
    icon: Workflow,
    title: 'Sales operations & POS',
    description: 'Track orders, split tenders, invoices, and customer dues without jumping between disconnected tools.',
  },
  {
    icon: ShieldCheck,
    title: 'EV & Workshop Job Cards',
    description: 'Specialized vehicle intake, technician assignment, EV battery health telemetry, and service histories.',
  },
  {
    icon: BarChart3,
    title: 'GST & Financial Reporting',
    description: 'Automated tax calculations (CGST, SGST, IGST), profit margins, and single-click GSTR export reports.',
  },
];

export function FeaturesPage(): ReactElement {
  const pageFaqs = useMemo(() => getPageFaqs('features', 303), []);

  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        <PageHeader
          eyebrow="Features"
          title="Engineered for operational mastery"
          description="A comprehensive overview of the core capabilities powering modern retail shops, distributors, and automotive workshops."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {featureBlocks.map((item, index) => {
            const Icon = item.icon;

            return (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/40">
                  <CardHeader className="space-y-4 p-6 sm:p-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <PageReveal>
            <Card className="h-full rounded-2xl border-border/80 bg-surface-secondary/40 shadow-sm p-6 sm:p-7">
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-lg font-bold">Built for speed</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Sub-second barcode lookups and one-click invoice generation keep long checkout lines moving effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
          <PageReveal delay={0.05}>
            <Card className="h-full rounded-2xl border-border/80 bg-surface-secondary/40 shadow-sm p-6 sm:p-7">
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-lg font-bold">Built for offline resilience</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Local browser caching ensures your cashiers keep ringing up sales even during temporary network outages.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
          <PageReveal delay={0.1}>
            <Card className="h-full rounded-2xl border-border/80 bg-surface-secondary/40 shadow-sm p-6 sm:p-7">
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-lg font-bold">Built to scale</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Easily connect multiple stores, regional warehouses, and hundreds of team members without data conflicts.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Feature Capabilities & Workflows
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Answers to technical, operational, and integration questions about TrimOrg features.
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
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Ready to see TrimOrg in action?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Start your 14-day free trial today with zero commitment.</p>
            </div>
            <Button asChild size="lg" className="rounded-xl shadow-md shrink-0">
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
