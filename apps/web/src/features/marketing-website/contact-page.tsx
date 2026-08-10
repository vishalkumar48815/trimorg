import type { ReactElement } from 'react';
import { ArrowRight, Mail, MessageSquare, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Use the contact form below or route future sales inquiries through email.',
  },
  {
    icon: PhoneCall,
    title: 'Call back',
    description: 'A dedicated callback workflow can be added when the support process is ready.',
  },
  {
    icon: MessageSquare,
    title: 'Partnerships',
    description: 'Use this page as the landing spot for commercial and integration conversations.',
  },
];

export function ContactPage(): ReactElement {
  return (
    <PublicSiteLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Contact"
          title="Contact Trimorg"
          description="A premium contact page layout for sales, support, and partnership conversations."
        />

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {contactMethods.map((item, index) => {
              const Icon = item.icon;

              return (
                <PageReveal key={item.title} delay={index * 0.05}>
                  <Card className="border-border/80 bg-card shadow-sm">
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

          <PageReveal delay={0.05}>
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="border-b border-border/70 pb-6">
                <CardTitle className="text-xl">Send a message</CardTitle>
                <CardDescription className="text-sm leading-6 sm:text-base">
                  This form is layout only. It is ready for a backend when the business workflow is
                  approved.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="contact-name">
                      Name
                    </label>
                    <Input id="contact-name" type="text" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="contact-email">
                      Email
                    </label>
                    <Input id="contact-email" type="email" placeholder="name@company.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="contact-company">
                    Company
                  </label>
                  <Input id="contact-company" type="text" placeholder="Business name" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Tell us what you need"
                    className="flex min-h-32 w-full rounded-[16px] border border-field-border bg-field-background px-4 py-3 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-field-placeholder focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  />
                </div>

                <Button type="button" size="lg" className="w-full">
                  Send Message
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </PageReveal>
        </div>
      </div>
    </PublicSiteLayout>
  );
}
