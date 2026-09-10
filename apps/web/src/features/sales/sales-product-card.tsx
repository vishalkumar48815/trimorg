import type { ReactElement } from 'react';
import { Plus, Wrench, Package } from 'lucide-react';
import type { SaleProduct } from './sales.types';
import { formatCurrency } from './sales.utils';

interface SalesProductCardProps {
  product: SaleProduct;
  cartQuantity: number;
  canAdd: boolean;
  onAdd: (product: SaleProduct) => void;
}

export function SalesProductCard({
  product,
  cartQuantity,
  canAdd,
  onAdd,
}: SalesProductCardProps): ReactElement {
  const isOutOfStock = !product.isService && product.currentStock === 0;

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!canAdd}
      aria-label={`Add ${product.name}`}
      className="group flex min-h-40 flex-col justify-between rounded-[16px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-raised)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-overlay)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground truncate">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
          </div>
          {product.isService ? (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 text-[11px] font-medium">
              <Wrench className="h-3 w-3" /> Service
            </span>
          ) : isOutOfStock ? (
            <span className="shrink-0 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
              Out of Stock
            </span>
          ) : (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-border bg-surface-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Package className="h-3 w-3" /> {product.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{product.isService ? 'Type' : 'Available Stock'}</span>
          <span className="font-semibold text-foreground">
            {product.isService
              ? 'Service/Labor'
              : `${product.currentStock} ${product.unitType || 'PCS'}`}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
        <div>
          <p className="text-[11px] text-muted-foreground">Price</p>
          <p className="text-base font-bold text-foreground">
            {formatCurrency(product.sellingPrice)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {cartQuantity > 0 ? (
            <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary">
              Qty: {cartQuantity}
            </span>
          ) : null}
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-110">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}
