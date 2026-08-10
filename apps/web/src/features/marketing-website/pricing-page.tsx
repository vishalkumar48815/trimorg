import type { ReactElement } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'For smaller operations that want a clean base to begin with.',
  },
  {
    name: 'Growth',
    description: 'For teams that need more structure as workflows expand.',
  },
  {
    name: 'Enterprise',
    description: 'For larger businesses that need a tailored rollout later on.',
  },
];

export function PricingPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pricing"
          title="Pricing structure"
          description="The commercial model is still being finalized, so the page stays honest while keeping the structure ready."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PageReveal key={plan.name} delay={index * 0.05}>
              <Card className="h-full border-border/80 bg-card shadow-sm">
                <CardHeader className="space-y-4">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {plan.name}
                  </p>
                  <CardTitle className="text-lg">Coming soon</CardTitle>
                  <CardDescription className="text-sm leading-6">{plan.description}</CardDescription>
                </CardHeader>
              </Card>
            </PageReveal>
          ))}
        </div>

        <PageReveal>
          <Card className="border-border/80 bg-surface-secondary/40 shadow-sm">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Pricing placeholder
                </div>
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  We will finalize pricing once the packaging is approved.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Until then, the page keeps the structure visible without inventing numbers or
                  commitments that are not ready.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </PageReveal>
      </div>
    </PublicSiteLayout>
  );
}
