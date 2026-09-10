import type { ReactElement } from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ProductRecord } from '@/features/products/products.types';

interface ProductsTableProps {
  products: ProductRecord[];
  onEdit: (product: ProductRecord) => void;
}

function formatSellingPrice(value: string): string {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return `₹${numericValue.toFixed(2)}`;
}

function StatusBadge({ status }: { status: string }): ReactElement {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-border bg-surface-secondary px-2.5 text-xs font-medium text-foreground">
      {status}
    </span>
  );
}

export function ProductsTable({ products, onEdit }: ProductsTableProps): ReactElement {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="border-b border-border px-6 py-4">Product / Service</th>
              <th className="border-b border-border px-6 py-4">SKU / Barcode</th>
              <th className="border-b border-border px-6 py-4">Category</th>
              <th className="border-b border-border px-6 py-4">Stock</th>
              <th className="border-b border-border px-6 py-4">Selling Price</th>
              <th className="border-b border-border px-6 py-4">Status</th>
              <th className="border-b border-border px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border/70 last:border-b-0 hover:bg-surface-secondary/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{product.name}</p>
                      {product.isService ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-[10px] font-medium">
                          <Wrench className="h-3 w-3" /> Service
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-mono font-medium text-foreground">{product.sku}</p>
                  {product.barcode ? (
                    <p className="text-[11px] font-mono text-muted-foreground">{product.barcode}</p>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-foreground">
                  {product.category}
                </td>
                <td className="px-6 py-4">
                  {product.isService ? (
                    <span className="text-xs text-muted-foreground italic">Non-inventory</span>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="font-semibold text-xs text-foreground">
                        {product.currentStock} {product.unitType || 'PCS'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Reorder at {product.reorderLevel}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-foreground">
                  {formatSellingPrice(product.sellingPrice)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
