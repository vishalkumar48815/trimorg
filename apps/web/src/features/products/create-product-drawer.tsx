import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchCategories } from '@/features/categories/categories.api';
import { productFormSchema, type ProductFormValues } from '@/features/products/products.schemas';
import type { ProductRecord } from '@/features/products/products.types';
import { useQuery } from '@tanstack/react-query';

interface ProductDrawerProps {
  mode: 'create' | 'edit';
  open: boolean;
  product: ProductRecord | null;
  isSaving: boolean;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  sku: '',
  category: '',
  sellingPrice: '',
  currentStock: '0',
  reorderLevel: '0',
  status: 'ACTIVE',
};

function getFormValues(mode: 'create' | 'edit', product: ProductRecord | null): ProductFormValues {
  if (mode === 'edit' && product) {
    return {
      name: product.name,
      sku: product.sku,
      category: product.category,
      sellingPrice: product.sellingPrice,
      currentStock: String(product.currentStock),
      reorderLevel: String(product.reorderLevel),
      status: product.status,
    };
  }

  return DEFAULT_VALUES;
}

export function CreateProductDrawer({
  mode,
  open,
  product,
  isSaving,
  errorMessage,
  onOpenChange,
  onSubmit,
}: ProductDrawerProps): ReactElement {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const categoriesQuery = useQuery({
    queryKey: ['categories'] as const,
    queryFn: fetchCategories,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (open && !form.formState.isDirty) {
      form.reset(getFormValues(mode, product));
    }
  }, [form, form.formState.isDirty, mode, open, product]);

  const title = mode === 'edit' ? 'Edit Product' : 'Create Product';
  const description =
    mode === 'edit'
      ? 'Update the product basics and keep the catalog accurate.'
      : 'Add a product with basic information. You can edit details later.';
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Save Product';
  const categories = categoriesQuery.data ?? [];
  const selectedCategory = form.watch('category');
  const hasSelectedCategory = categories.some((category) => category.name === selectedCategory);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[480px] sm:max-w-[480px]">
        <form
          className="flex h-full flex-col"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <SheetHeader className="border-b border-border px-6 pb-6 pt-6">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {errorMessage ? (
              <div className="rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="product-name">
                Product Name <span className="text-danger">*</span>
              </label>
              <Input
                id="product-name"
                type="text"
                placeholder="Parle-G"
                {...form.register('name')}
              />
              {form.formState.errors.name ? (
                <p className="text-sm text-danger">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="sku">
                SKU <span className="text-danger">*</span>
              </label>
              <Input id="sku" type="text" placeholder="PARLE001" {...form.register('sku')} />
              {form.formState.errors.sku ? (
                <p className="text-sm text-danger">{form.formState.errors.sku.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="category">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                className="flex h-11 w-full rounded-[16px] border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                {...form.register('category')}
                disabled={categoriesQuery.isLoading || categoriesQuery.isError}
              >
                <option value="">
                  {categoriesQuery.isLoading ? 'Loading categories...' : 'Select category'}
                </option>
                {mode === 'edit' && selectedCategory && !hasSelectedCategory ? (
                  <option value={selectedCategory}>{selectedCategory}</option>
                ) : null}
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.category ? (
                <p className="text-sm text-danger">{form.formState.errors.category.message}</p>
              ) : null}
              {categoriesQuery.isError ? (
                <p className="text-sm text-danger">Unable to load categories.</p>
              ) : null}
            </div>

            {mode === 'create' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="current-stock">
                    Opening Stock
                  </label>
                  <Input
                    id="current-stock"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...form.register('currentStock')}
                  />
                  {form.formState.errors.currentStock ? (
                    <p className="text-sm text-danger">
                      {form.formState.errors.currentStock.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="reorder-level">
                    Reorder Level
                  </label>
                  <Input
                    id="reorder-level"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...form.register('reorderLevel')}
                  />
                  {form.formState.errors.reorderLevel ? (
                    <p className="text-sm text-danger">
                      {form.formState.errors.reorderLevel.message}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="selling-price">
                Selling Price <span className="text-danger">*</span>
              </label>
              <Input
                id="selling-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="10"
                {...form.register('sellingPrice')}
              />
              {form.formState.errors.sellingPrice ? (
                <p className="text-sm text-danger">{form.formState.errors.sellingPrice.message}</p>
              ) : null}
            </div>

            {mode === 'edit' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="status">
                  Status <span className="text-danger">*</span>
                </label>
                <Input id="status" type="text" placeholder="ACTIVE" {...form.register('status')} />
                {form.formState.errors.status ? (
                  <p className="text-sm text-danger">{form.formState.errors.status.message}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t border-border bg-surface px-6 py-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? 'Saving...' : submitLabel}
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
