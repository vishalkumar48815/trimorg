import type { ReactElement } from 'react';

function SkeletonBar({ className }: { className: string }): ReactElement {
  return <div className={`animate-pulse rounded-full bg-muted ${className}`} />;
}

export function ProductListSkeleton(): ReactElement {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-raised)]">
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
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={`product-skeleton-${index}`}
                className="border-b border-border/70 last:border-b-0"
              >
                <td className="px-6 py-4">
                  <SkeletonBar className="h-4 w-40" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBar className="h-4 w-28" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBar className="h-4 w-32" />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <SkeletonBar className="h-4 w-14" />
                    <SkeletonBar className="h-3 w-24" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <SkeletonBar className="h-4 w-24" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBar className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <SkeletonBar className="h-9 w-16 rounded-[16px]" />
                    <SkeletonBar className="h-9 w-16 rounded-[16px]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
