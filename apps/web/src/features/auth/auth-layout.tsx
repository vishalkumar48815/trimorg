import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageReveal } from '@/features/marketing-website/page-reveal';

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
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden border-b border-border bg-card px-4 py-8 sm:px-6 lg:flex lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(57,73,171,0.14),transparent_34%),linear-gradient(to_bottom,var(--color-card),transparent)]" />
          <div className="mx-auto flex w-full max-w-xl flex-col justify-between gap-12">
            <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-sm text-primary-foreground shadow-[var(--shadow-raised)]">
                T
              </span>
              <span className="text-base tracking-tight">Trimorg</span>
            </Link>

            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {heroTitle}
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {heroDescription}
                </p>
              </div>

              <div className="grid gap-3">
                {highlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <PageReveal key={item.title} delay={index * 0.05}>
                      <div className="flex items-start gap-3 rounded-[16px] border border-border bg-background px-4 py-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </PageReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <PageReveal className="w-full max-w-lg">
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="space-y-3 border-b border-border/70 pb-6">
                <CardTitle className="text-2xl font-semibold tracking-tight">{cardTitle}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground sm:text-base">
                  {cardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-8">{children}</CardContent>
            </Card>
          </PageReveal>
          <div className="mt-6 w-full max-w-lg">{footer}</div>
        </section>
      </div>
    </main>
  );
}
