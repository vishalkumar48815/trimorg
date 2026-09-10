import type { ComponentType, ReactElement, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesSectionCardProps {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  description?: string;
}

export function SalesSectionCard({
  title,
  icon: Icon,
  children,
  description,
}: SalesSectionCardProps): ReactElement {
  return (
    <Card className="border-border/80 bg-surface shadow-[var(--shadow-raised)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="inline-flex size-8 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{title}</span>
        </CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
