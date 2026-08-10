import type { ReactElement, ReactNode } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';

interface DocumentSection {
  title: string;
  body: ReactNode;
}

interface PublicDocumentPageProps {
  title: string;
  description: string;
  sections: DocumentSection[];
}

export function PublicDocumentPage({
  title,
  description,
  sections,
}: PublicDocumentPageProps): ReactElement {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      <div className="grid gap-4">
        {sections.map((section) => (
          <SectionCard key={section.title} title={section.title}>
            <div className="space-y-3 text-sm leading-6 text-muted-foreground sm:text-base">
              {section.body}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
