import type { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SalesHeader(): ReactElement {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Point of Sale
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            New Sale
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Fast checkout surface for in-store billing with live inventory-aware product selection.
          </p>
        </div>
        <Button type="button" variant="outline" className="shrink-0">
          Recent Orders
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
