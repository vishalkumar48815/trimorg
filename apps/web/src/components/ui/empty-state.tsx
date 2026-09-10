import type { ReactElement, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps): ReactElement {
  return (
    <Card className={cn('border-dashed border-border-subtle bg-surface-secondary/60', className)}>
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-5 px-6 py-10 text-center">
        {Icon ? (
          <div className="flex size-14 items-center justify-center rounded-[16px] border border-border bg-surface text-muted-foreground shadow-[var(--shadow-raised)]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        ) : null}
        <div className="space-y-2">
          <p className="text-lg font-semibold tracking-tight text-foreground">{title}</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {primaryAction || secondaryAction ? (
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
