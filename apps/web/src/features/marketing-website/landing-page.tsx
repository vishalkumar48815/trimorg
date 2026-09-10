import type { ReactElement } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import {
  benefitItems,
  featureItems,
  trustedByLogos,
  workItems,
} from '@/features/marketing-website/landing-page.data';
import { SectionHeading } from '@/features/marketing-website/section-heading';

const faqItems = [
  {
    question: 'Who is Trimorg built for?',
    answer:
      'Trimorg is built for wholesalers, distributors, and shop owners who need one calm place to run operations.',
  },
  {
    question: 'Does Trimorg include business logic on this page?',
    answer:
      'No. This public site is layout-only while the product team finalizes the full application experience.',
  },
  {
    question: 'How do I start?',
    answer:
      'Use the Get Started button to move into the signup flow and create a workspace placeholder.',
  },
  {
    question: 'Is the design responsive?',
    answer:
      'Yes. Every section is built to stack cleanly and remain readable across desktop, tablet, and mobile widths.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'For small operations that want a clean base to begin with.',
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

export function LandingPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <PageReveal>
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Premium SaaS for wholesalers, distributors, and shop owners
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                One calm workspace for wholesale operations.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Trimorg keeps products, orders, billing, and inventory organized in a premium
                surface designed for daily work.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#demo">Watch Demo</a>
              </Button>
            </div>
          </div>

          <div id="demo">
            <Card className="overflow-hidden border-border/80 bg-card shadow-sm">
              <CardHeader className="border-b border-border/70 pb-5">
                <CardTitle className="text-base font-medium">Workspace preview</CardTitle>
                <CardDescription>Layout only. No fake data, no charts, no backend.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {['Products', 'Orders', 'Billing', 'Stock'].map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] border border-border bg-background p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-[14px] bg-muted text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item}</p>
                          <p className="text-sm text-muted-foreground">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[16px] border border-dashed border-border bg-muted/30 p-5">
                  <div className="space-y-3">
                    <div className="h-3 w-3/5 rounded-full bg-muted-foreground/15" />
                    <div className="h-3 w-4/5 rounded-full bg-muted-foreground/10" />
                    <div className="h-3 w-2/3 rounded-full bg-muted-foreground/15" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Trusted by"
            title="A future proof-point area reserved for customer logos."
            description="This slot stays intentionally neutral until brand and customer proof points are finalized."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustedByLogos.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="flex h-20 items-center justify-center rounded-[16px] border border-border bg-card text-sm text-muted-foreground shadow-sm"
              >
                {label}
              </div>
            ))}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="features" className="space-y-8">
          <SectionHeading
            eyebrow="Features"
            title="Core capabilities for the daily operating rhythm."
            description="Trimorg keeps the surface focused on the work business owners actually do every day."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((item, index) => {
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
        </section>
      </PageReveal>

      <PageReveal>
        <section id="how-it-works" className="space-y-8">
          <SectionHeading
            eyebrow="How it works"
            title="A simple flow for a complex business."
            description="The product should feel obvious to use while still supporting operational depth over time."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {workItems.map((item, index) => (
              <PageReveal key={item.title} delay={index * 0.05}>
                <Card className="h-full border-border/80 bg-card shadow-sm">
                  <CardHeader>
                    <p className="text-sm font-medium text-muted-foreground">Step {index + 1}</p>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
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
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Benefits"
            title="Premium structure that stays calm as the product grows."
            description="The interface prioritizes clarity, efficiency, and a stable visual rhythm over novelty."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {benefitItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <PageReveal key={item.title} delay={index * 0.05}>
                  <Card className="h-full border-border/80 bg-card shadow-sm">
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
        </section>
      </PageReveal>

      <PageReveal>
        <section id="pricing" className="space-y-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Pricing that will be finalized later."
            description="This section keeps the commercial structure visible without inventing numbers before they are approved."
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
                    <CardDescription className="text-sm leading-6">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            ))}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section id="faq" className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions, without the noise."
            description="Short answers keep the page scannable while the product and pricing details are finalized."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item, index) => (
              <PageReveal key={item.question} delay={index * 0.05}>
                <Card className="h-full border-border/80 bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                    <CardDescription className="text-sm leading-6">{item.answer}</CardDescription>
                  </CardHeader>
                </Card>
              </PageReveal>
            ))}
          </div>
        </section>
      </PageReveal>

      <PageReveal>
        <section className="space-y-8">
          <Card className="overflow-hidden border-border/80 bg-primary text-primary-foreground shadow-sm">
            <CardContent className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary-foreground/80">
                  Get started
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Build a cleaner operating system for your business.
                </h2>
                <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">
                  Start with a layout that feels premium today and can grow into the full product
                  later.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <a href="#features">
                    Explore features
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
