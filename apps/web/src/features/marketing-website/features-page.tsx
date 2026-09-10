import type { ReactElement } from 'react';
import { BarChart3, Boxes, ShieldCheck, Workflow } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';

const featureBlocks = [
  {
    icon: Boxes,
    title: 'Product and inventory control',
    description: 'Keep your catalog, stock, and selling data organized in one calm workspace.',
  },
  {
    icon: Workflow,
    title: 'Sales operations',
    description: 'Track orders, billing, and customer workflows without jumping between tools.',
  },
  {
    icon: ShieldCheck,
    title: 'Supplier coordination',
    description: 'Stay aligned with purchasing and replenishment across the same operating system.',
  },
  {
    icon: BarChart3,
    title: 'Reporting foundations',
    description: 'Bring visibility to daily operations with a structure that can grow over time.',
  },
];

export function FeaturesPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Features"
          title="Trimorg features"
          description="A focused overview of the product areas that matter most to wholesale and distribution teams."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {featureBlocks.map((item, index) => {
            const Icon = item.icon;

            return (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full border-border/80 bg-card shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1">
                  <CardHeader className="space-y-4">
                    <div className="flex size-11 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PageReveal>
            <Card className="h-full border-border/80 bg-surface-secondary/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Built for clarity</CardTitle>
                <CardDescription className="text-sm leading-6">
                  The surface stays quiet so teams can read the state of the business quickly.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
          <PageReveal delay={0.05}>
            <Card className="h-full border-border/80 bg-surface-secondary/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Built for routine</CardTitle>
                <CardDescription className="text-sm leading-6">
                  The layout supports daily use without adding visual noise or friction.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
          <PageReveal delay={0.1}>
            <Card className="h-full border-border/80 bg-surface-secondary/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Built for scale</CardTitle>
                <CardDescription className="text-sm leading-6">
                  The foundation remains reusable as Trimorg expands into more workflows.
                </CardDescription>
              </CardHeader>
            </Card>
          </PageReveal>
        </div>
      </div>
    </PublicSiteLayout>
  );
}
