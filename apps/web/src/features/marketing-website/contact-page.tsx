import { useMemo, type ReactElement } from 'react';
import { ArrowRight, Mail, MessageSquare, PhoneCall, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PublicSiteLayout } from '@/features/marketing-website/public-site-layout';
import { PageReveal } from '@/features/marketing-website/page-reveal';
import { getPageFaqs } from '@/features/marketing-website/public-site.data';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email support & sales',
    description: 'Direct inquiries, feature questions, and commercial partnerships.',
  },
  {
    icon: PhoneCall,
    title: 'Phone onboarding',
    description: 'Dedicated phone and WhatsApp walkthroughs for Growth and Business subscribers.',
  },
  {
    icon: MessageSquare,
    title: 'Custom ERP integrations',
    description: 'Tailored API connections, hardware setups, and multi-branch rollouts.',
  },
];

export function ContactPage(): ReactElement {
  const pageFaqs = useMemo(() => getPageFaqs('support', 505), []);

  return (
    <PublicSiteLayout>
      <div className="space-y-12 sm:space-y-16">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch with our team"
          description="Have questions about TrimOrg, need custom enterprise onboarding, or want to discuss pricing? We are here to help."
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {contactMethods.map((item, index) => {
              const Icon = item.icon;

              return (
                <PageReveal key={item.title} delay={index * 0.05}>
                  <Card className="rounded-2xl border-border/80 bg-card shadow-sm p-6">
                    <CardHeader className="p-0 space-y-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </PageReveal>
              );
            })}
          </div>

          <PageReveal delay={0.05}>
            <Card className="rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/70 p-6 sm:p-8">
                <CardTitle className="text-xl font-bold">Send us a message</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Fill out the form below and our team will get back to you within 24 business hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground" htmlFor="contact-name">
                      Full Name
                    </label>
                    <Input id="contact-name" type="text" placeholder="Alex Morgan" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground" htmlFor="contact-email">
                      Email Address
                    </label>
                    <Input id="contact-email" type="email" placeholder="alex@company.com" className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground" htmlFor="contact-company">
                    Business / Shop Name
                  </label>
                  <Input id="contact-company" type="text" placeholder="Speedy Auto Garage & Retail" className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground" htmlFor="contact-message">
                    How can we help?
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us about your workshop scale, current software, or custom needs..."
                    className="flex min-h-28 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-xs transition-all duration-200 ease-out placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
                  />
                </div>

                <Button type="button" size="lg" className="w-full rounded-xl shadow-md font-semibold">
                  Send Message
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </CardContent>
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
              Support & Communication FAQs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Answers to response times, data privacy, and custom onboarding assistance.
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
      </div>
    </PublicSiteLayout>
  );
}
