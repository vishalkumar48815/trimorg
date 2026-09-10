import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Loader2, Wrench } from 'lucide-react';
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
  barcode: '',
  category: '',
  sellingPrice: '',
  costPrice: '',
  isService: false,
  currentStock: '0',
  reorderLevel: '0',
  unitType: 'PCS',
  taxRate: '0',
  status: 'ACTIVE',
};

function getFormValues(mode: 'create' | 'edit', product: ProductRecord | null): ProductFormValues {
  if (mode === 'edit' && product) {
    return {
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      category: product.category,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice || '',
      isService: Boolean(product.isService),
      currentStock: String(product.currentStock),
      reorderLevel: String(product.reorderLevel),
      unitType: product.unitType || 'PCS',
      taxRate: product.taxRate || '0',
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

  const isService = form.watch('isService');
  const title = mode === 'edit' ? 'Edit Item' : 'Create Item';
  const description =
    mode === 'edit'
      ? 'Update catalog item information and pricing.'
      : 'Add a new product or service/labor item to your catalog.';
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Save Item';
  const categories = categoriesQuery.data ?? [];
  const selectedCategory = form.watch('category');
  const hasSelectedCategory = categories.some((category) => category.name === selectedCategory);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[500px] sm:max-w-[500px]">
        <form
          className="flex h-full flex-col"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <SheetHeader className="border-b border-border px-6 pb-5 pt-6">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {errorMessage ? (
              <div className="rounded-[14px] border border-danger/20 bg-danger/5 px-4 py-3 text-xs text-danger">
                {errorMessage}
              </div>
            ) : null}

            {/* Service vs Physical Goods Selector */}
            <div className="rounded-[14px] border border-border bg-surface-secondary/40 p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register('isService')}
                  className="size-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <div>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                    This is a Service / Labor charge
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Service items (e.g. EV Repair Labor) don&apos;t require physical stock tracking.
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="product-name">
                Item Name <span className="text-danger">*</span>
              </label>
              <Input
                id="product-name"
                type="text"
                placeholder={
                  isService ? 'e.g. Brake Service Labor' : 'e.g. Front Brake Pad (Ather)'
                }
                {...form.register('name')}
                className="h-10 text-sm"
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-danger">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="sku">
                  SKU / Code <span className="text-danger">*</span>
                </label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="e.g. BP-01"
                  {...form.register('sku')}
                  className="h-10 text-sm"
                />
                {form.formState.errors.sku ? (
                  <p className="text-xs text-danger">{form.formState.errors.sku.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="barcode">
                  Barcode (Optional)
                </label>
                <Input
                  id="barcode"
                  type="text"
                  placeholder="Scan / EAN"
                  {...form.register('barcode')}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="category">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                className="flex h-10 w-full rounded-[14px] border border-field-border bg-field-background px-3 text-sm text-foreground shadow-xs focus-visible:border-primary focus-visible:outline-none"
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
                <p className="text-xs text-danger">{form.formState.errors.category.message}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="selling-price">
                  Selling Price (₹) <span className="text-danger">*</span>
                </label>
                <Input
                  id="selling-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('sellingPrice')}
                  className="h-10 text-sm"
                />
                {form.formState.errors.sellingPrice ? (
                  <p className="text-xs text-danger">
                    {form.formState.errors.sellingPrice.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="cost-price">
                  Cost / Buy Price (₹)
                </label>
                <Input
                  id="cost-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('costPrice')}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Inventory fields (only for physical goods) */}
            {!isService && mode === 'create' ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="current-stock">
                    Opening Stock
                  </label>
                  <Input
                    id="current-stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...form.register('currentStock')}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="reorder-level">
                    Reorder Alert
                  </label>
                  <Input
                    id="reorder-level"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...form.register('reorderLevel')}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="unit-type">
                    Unit
                  </label>
                  <select
                    id="unit-type"
                    {...form.register('unitType')}
                    className="flex h-10 w-full rounded-[14px] border border-field-border bg-field-background px-2 text-xs text-foreground focus-visible:outline-none"
                  >
                    <option value="PCS">PCS</option>
                    <option value="SET">SET</option>
                    <option value="HRS">HRS</option>
                    <option value="LTR">LTR</option>
                    <option value="MTR">MTR</option>
                  </select>
                </div>
              </div>
            ) : null}

            {mode === 'edit' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="status">
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  id="status"
                  {...form.register('status')}
                  className="flex h-10 w-full rounded-[14px] border border-field-border bg-field-background px-3 text-sm text-foreground focus-visible:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t border-border bg-surface px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row w-full">
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
