import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { SiteHeader } from '@/features/marketing-website/site-header';

interface AuthHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthLayoutProps {
  heroTitle: string;
  heroDescription: string;
  highlights: AuthHighlight[];
  cardTitle: string;
  cardDescription: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthLayout({
  heroTitle,
  heroDescription,
  highlights,
  cardTitle,
  cardDescription,
  footer,
  children,
}: AuthLayoutProps): ReactElement {
  return (
    <main className="min-h-svh bg-background text-foreground flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>

      <div className="flex-1 grid lg:grid-cols-[1.05fr_0.95fr] max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 gap-8 items-center">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm flex flex-col justify-between gap-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {heroTitle}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {heroDescription}
              </p>
            </div>

            <div className="grid gap-3.5">
              {highlights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <PageReveal key={item.title} delay={index * 0.05}>
                    <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-background/80 p-4 transition-all duration-300 hover:scale-[1.015] hover:shadow-md">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </PageReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <PageReveal className="w-full">
            <Card className="border-border/80 bg-card shadow-lg rounded-3xl">
              <CardHeader className="space-y-2 border-b border-border/70 p-6 sm:p-8">
                <CardTitle className="text-2xl font-bold tracking-tight">{cardTitle}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground sm:text-base">
                  {cardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-8">{children}</CardContent>
            </Card>
          </PageReveal>
          <div className="mt-6 w-full">{footer}</div>
        </section>
      </div>
    </main>
  );
}
