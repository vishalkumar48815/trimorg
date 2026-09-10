import type { ReactElement } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SaleCartItem } from './sales.types';
import { formatCurrency } from './sales.utils';

interface SalesCartItemRowProps {
  item: SaleCartItem;
  canIncrease: boolean;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SalesCartItemRow({
  item,
  canIncrease,
  onIncrease,
  onDecrease,
  onRemove,
}: SalesCartItemRowProps): ReactElement {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-4 shadow-[var(--shadow-raised)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.category} · {item.sku}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(item.sellingPrice)}
          </p>
          <p className="text-xs text-muted-foreground">Each</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={() => onDecrease(item.id)}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="inline-flex min-w-11 justify-center rounded-[12px] border border-border bg-surface-secondary px-3 py-2 text-sm font-medium text-foreground">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={() => onIncrease(item.id)}
            disabled={!canIncrease}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-semibold text-foreground">
          {formatCurrency(item.sellingPrice * item.quantity)}
        </span>
      </div>
    </div>
  );
}
