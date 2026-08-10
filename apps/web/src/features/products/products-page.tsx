import { Filter, PackageSearch, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';

export function ProductsPage() {
  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Products
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Manage your inventory catalog and prepare products for sales and operations.
            </p>
          </div>

          <Button type="button" className="sm:self-start">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Product
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search products"
              aria-label="Search products"
              className="pl-9"
            />
          </div>

          <Button type="button" variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-muted/40 text-left text-sm font-medium text-muted-foreground">
                    <th className="border-b border-border px-6 py-4">Product</th>
                    <th className="border-b border-border px-6 py-4">SKU</th>
                    <th className="border-b border-border px-6 py-4">Category</th>
                    <th className="border-b border-border px-6 py-4">Stock</th>
                    <th className="border-b border-border px-6 py-4">Selling Price</th>
                    <th className="border-b border-border px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex min-h-[14rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-background px-6 py-10 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                          <PackageSearch className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-foreground">
                            No products have been added yet.
                          </p>
                          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                            Start building your inventory by creating your first product.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
