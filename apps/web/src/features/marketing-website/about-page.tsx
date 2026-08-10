import type { ReactElement } from 'react';
import { BarChart3, Boxes, Sparkles, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';

const principles = [
  {
    icon: Boxes,
    title: 'Operational clarity',
    description: 'Trimorg is designed to help teams understand the business at a glance.',
  },
  {
    icon: Workflow,
    title: 'Reusable structure',
    description: 'The product grows through reusable components instead of ad hoc screens.',
  },
  {
    icon: Sparkles,
    title: 'Premium restraint',
    description: 'The interface stays calm, minimal, and professional even as capabilities expand.',
  },
  {
    icon: BarChart3,
    title: 'Room to scale',
    description: 'The foundation is intentionally clean so future workflows remain maintainable.',
  },
];

export function AboutPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="About"
          title="About Trimorg"
          description="Trimorg is being built as a modern business operating system for wholesalers, distributors, and shop owners."
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <PageReveal>
            <Card className="h-full border-border/80 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Our mission</CardTitle>
                <CardDescription className="text-sm leading-6 sm:text-base">
                  Give growing businesses a single, calm workspace that feels trustworthy within
                  seconds and stays maintainable over years of real use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground sm:text-base">
                <p>
                  Trimorg favors clarity over clutter, structure over novelty, and reusable
                  foundations over one-off experiences.
                </p>
                <p>
                  Every surface is meant to support long days of inventory, billing, and sales work
                  without exhausting the person using it.
                </p>
              </CardContent>
            </Card>
          </PageReveal>

          <PageReveal delay={0.05}>
            <Card className="h-full border-border/80 bg-surface-secondary/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Product principles</CardTitle>
                <CardDescription className="text-sm leading-6 sm:text-base">
                  A few design rules guide every screen and interaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Premium, not flashy', 'Reusable, not one-off', 'Calm, not crowded'].map((item) => (
                  <div
                    key={item}
                    className="rounded-[16px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </PageReveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item, index) => {
            const Icon = item.icon;

            return (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full border-border/80 bg-card shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1">
                  <CardHeader className="space-y-4">
                    <div className="flex size-11 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            );
          })}
        </div>
      </div>
    </PublicSiteLayout>
  );
}
