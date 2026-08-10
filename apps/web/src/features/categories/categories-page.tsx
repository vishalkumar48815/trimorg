import { Plus, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shell/page-container';

export function CategoriesPage() {
  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
        <Button type="button">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-4 py-16 text-center">
        <Tags className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-medium text-foreground">No categories yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Categories help you organize products. Create your first category to get started.
        </p>
        <Button type="button" variant="outline" className="mt-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>
    </PageContainer>
  );
}
