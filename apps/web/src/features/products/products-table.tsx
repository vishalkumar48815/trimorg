import type { ReactElement } from 'react';
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
    <span className="inline-flex h-8 items-center rounded-full border border-border bg-surface-secondary px-3 text-xs font-medium text-foreground">
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
            <tr className="bg-surface-secondary/60 text-left text-sm font-medium text-muted-foreground">
              <th className="border-b border-border px-6 py-4">Product</th>
              <th className="border-b border-border px-6 py-4">SKU</th>
              <th className="border-b border-border px-6 py-4">Category</th>
              <th className="border-b border-border px-6 py-4">Stock</th>
              <th className="border-b border-border px-6 py-4">Selling Price</th>
              <th className="border-b border-border px-6 py-4">Status</th>
              <th className="border-b border-border px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{product.currentStock}</p>
                    <p className="text-xs text-muted-foreground">
                      Reorder at {product.reorderLevel}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {formatSellingPrice(product.sellingPrice)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled>
                      Delete
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
