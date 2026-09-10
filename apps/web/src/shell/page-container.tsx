import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  /**
   * 'constrained' (default) suits forms and text-heavy content, per DesignSystem.md §8.
   * 'full' suits data-dense views (tables, dashboards) that should use available width.
   */
  width?: 'constrained' | 'full';
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-6 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
