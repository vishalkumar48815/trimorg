import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { CategoryRecord } from '@/features/categories/categories.types';

interface CategoriesTableProps {
  categories: CategoryRecord[];
}

function StatusBadge({ status }: { status: string }): ReactElement {
  return (
    <span className="inline-flex h-8 items-center rounded-full border border-border bg-surface-secondary px-3 text-xs font-medium text-foreground">
      {status}
    </span>
  );
}

export function CategoriesTable({ categories }: CategoriesTableProps): ReactElement {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface-secondary/60 text-left text-sm font-medium text-muted-foreground">
              <th className="border-b border-border px-6 py-4">Category</th>
              <th className="border-b border-border px-6 py-4">Status</th>
              <th className="border-b border-border px-6 py-4">Products Count</th>
              <th className="border-b border-border px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{category.name}</p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={category.status} />
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" disabled>
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
