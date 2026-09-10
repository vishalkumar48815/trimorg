import type { ReactElement } from 'react';
import { Plus } from 'lucide-react';
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
  const isOutOfStock = product.currentStock === 0;

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!canAdd}
      aria-label={`Add ${product.name}`}
      className="group flex min-h-44 flex-col justify-between rounded-[16px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-raised)] transition-[transform,box-shadow,border-color,opacity] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-overlay)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-base font-semibold leading-5 text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
          {isOutOfStock ? (
            <span className="rounded-full bg-danger/10 px-2.5 py-1 text-[11px] font-medium text-danger">
              Out of Stock
            </span>
          ) : (
            <span className="rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {product.category}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Current stock</span>
          <span className="font-medium text-foreground">{product.currentStock}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Selling Price</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(product.sellingPrice)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cartQuantity > 0 ? (
            <span className="inline-flex h-8 items-center rounded-full bg-primary/10 px-3 text-xs font-medium text-primary">
              In cart: {cartQuantity}
            </span>
          ) : null}
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}
