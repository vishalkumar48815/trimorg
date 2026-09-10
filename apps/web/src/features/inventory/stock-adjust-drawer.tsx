import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { ProductRecord } from '@/features/products/products.types';
import { adjustProductStock } from './inventory.api';
import {
  stockAdjustmentFormSchema,
  type StockAdjustmentFormValues,
} from './inventory.schemas';

interface StockAdjustDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductRecord | null;
  allProducts?: ProductRecord[];
  onSuccess?: () => void;
}

export function StockAdjustDrawer({
  open,
  onOpenChange,
  product,
  allProducts = [],
  onSuccess,
}: StockAdjustDrawerProps): ReactElement {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string>(product?.id ?? '');
  const [adjustDirection, setAdjustDirection] = useState<'ADD' | 'DEDUCT'>('ADD');

  const activeProduct = product || allProducts.find((p) => p.id === selectedProductId) || null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: {
      productId: product?.id ?? '',
      actionType: 'RESTOCK',
      quantity: 1,
      reason: '',
    },
  });

  const actionType = watch('actionType');
  const quantityInput = watch('quantity') || 0;

  useEffect(() => {
    if (product) {
      setSelectedProductId(product.id);
      setValue('productId', product.id);
    }
  }, [product, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        productId: product?.id ?? '',
        actionType: 'RESTOCK',
        quantity: 1,
        reason: '',
      });
      setAdjustDirection('ADD');
    }
  }, [open, product, reset]);

  const mutation = useMutation({
    mutationFn: adjustProductStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const onSubmit = (values: StockAdjustmentFormValues) => {
    let delta = Number(values.quantity);

    if (values.actionType === 'DAMAGE') {
      delta = -Math.abs(delta);
    } else if (values.actionType === 'RESTOCK' || values.actionType === 'RETURN') {
      delta = Math.abs(delta);
    } else if (values.actionType === 'ADJUSTMENT') {
      delta = adjustDirection === 'DEDUCT' ? -Math.abs(delta) : Math.abs(delta);
    }

    mutation.mutate({
      productId: values.productId,
      type: values.actionType,
      quantityDelta: delta,
      reason: values.reason,
    });
  };

  const currentStock = activeProduct?.currentStock ?? 0;
  let projectedDelta = Number(quantityInput) || 0;
  if (actionType === 'DAMAGE') {
    projectedDelta = -Math.abs(projectedDelta);
  } else if (actionType === 'ADJUSTMENT' && adjustDirection === 'DEDUCT') {
    projectedDelta = -Math.abs(projectedDelta);
  }
  const projectedStock = currentStock + projectedDelta;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Sliders className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-foreground">Adjust Inventory Stock</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Record stock adjustments with mandatory audit trail logging.
              </p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6 bg-card">
          {mutation.isError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Adjustment Failed</p>
                <p className="text-xs mt-0.5">
                  {mutation.error instanceof Error ? mutation.error.message : 'Could not adjust stock.'}
                </p>
              </div>
            </div>
          )}

          {/* Product Selection / Preview */}
          {product ? (
            <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-foreground">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Package className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku} • Unit: {product.unitType}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Product <span className="text-destructive">*</span>
              </label>
              <select
                {...register('productId')}
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setValue('productId', e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Choose a physical product --</option>
                {allProducts
                  .filter((p) => !p.isService)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Current: {p.currentStock} {p.unitType}
                    </option>
                  ))}
              </select>
              {errors.productId && <p className="text-xs text-destructive">{errors.productId.message}</p>}
            </div>
          )}

          {/* Adjustment Reason / Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason / Movement Type <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setValue('actionType', 'RESTOCK')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  actionType === 'RESTOCK'
                    ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500 text-foreground'
                    : 'border-border bg-surface-secondary/50 hover:bg-surface-secondary text-muted-foreground'
                }`}
              >
                <PlusCircle className={`size-4 shrink-0 mt-0.5 ${actionType === 'RESTOCK' ? 'text-emerald-500' : ''}`} />
                <div>
                  <div className="text-xs font-bold text-foreground">Restock / Add</div>
                  <div className="text-[11px] text-muted-foreground">Supplier inbound shipment</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('actionType', 'DAMAGE')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  actionType === 'DAMAGE'
                    ? 'border-rose-500/50 bg-rose-500/10 ring-1 ring-rose-500 text-foreground'
                    : 'border-border bg-surface-secondary/50 hover:bg-surface-secondary text-muted-foreground'
                }`}
              >
                <MinusCircle className={`size-4 shrink-0 mt-0.5 ${actionType === 'DAMAGE' ? 'text-rose-500' : ''}`} />
                <div>
                  <div className="text-xs font-bold text-foreground">Damaged / Scrap</div>
                  <div className="text-[11px] text-muted-foreground">Defective or broken item</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('actionType', 'ADJUSTMENT')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  actionType === 'ADJUSTMENT'
                    ? 'border-primary/50 bg-primary/10 ring-1 ring-primary text-foreground'
                    : 'border-border bg-surface-secondary/50 hover:bg-surface-secondary text-muted-foreground'
                }`}
              >
                <Sliders className={`size-4 shrink-0 mt-0.5 ${actionType === 'ADJUSTMENT' ? 'text-primary' : ''}`} />
                <div>
                  <div className="text-xs font-bold text-foreground">Audit Count</div>
                  <div className="text-[11px] text-muted-foreground">Physical count mismatch</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('actionType', 'RETURN')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  actionType === 'RETURN'
                    ? 'border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500 text-foreground'
                    : 'border-border bg-surface-secondary/50 hover:bg-surface-secondary text-muted-foreground'
                }`}
              >
                <RotateCcw className={`size-4 shrink-0 mt-0.5 ${actionType === 'RETURN' ? 'text-blue-500' : ''}`} />
                <div>
                  <div className="text-xs font-bold text-foreground">Customer Return</div>
                  <div className="text-[11px] text-muted-foreground">Item returned to inventory</div>
                </div>
              </button>
            </div>
            {errors.actionType && <p className="text-xs text-destructive">{errors.actionType.message}</p>}
          </div>

          {/* Direction toggle for Audit Count */}
          {actionType === 'ADJUSTMENT' && (
            <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Audit Direction</span>
              <div className="flex items-center gap-1 bg-surface-primary p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setAdjustDirection('ADD')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    adjustDirection === 'ADD' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  + Increase Stock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustDirection('DEDUCT')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    adjustDirection === 'DEDUCT' ? 'bg-rose-500 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  - Decrease Stock
                </button>
              </div>
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quantity to Adjust <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min={1}
              step={1}
              placeholder="e.g. 5"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>

          {/* Stock Calculation Preview Card */}
          {activeProduct && (
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-surface-secondary/40 to-surface-secondary/80 space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Stock Impact Calculation
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-surface-primary border border-border">
                  <div className="text-xs text-muted-foreground">Current Stock</div>
                  <div className="text-base font-bold text-foreground mt-0.5">{currentStock}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-primary border border-border">
                  <div className="text-xs text-muted-foreground">Adjustment</div>
                  <div className={`text-base font-bold mt-0.5 ${projectedDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {projectedDelta >= 0 ? `+${projectedDelta}` : projectedDelta}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-primary border border-border">
                  <div className="text-xs text-muted-foreground">New Stock</div>
                  <div className={`text-base font-bold mt-0.5 ${projectedStock < 0 ? 'text-destructive font-black' : 'text-primary'}`}>
                    {projectedStock}
                  </div>
                </div>
              </div>
              {projectedStock < 0 && (
                <div className="text-xs text-destructive font-medium flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" />
                  Warning: Resulting stock cannot be negative.
                </div>
              )}
            </div>
          )}

          {/* Reason / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Audit Reason / Notes
            </label>
            <textarea
              {...register('reason')}
              rows={3}
              placeholder="e.g. Discrepancy found during quarterly physical inventory count."
              className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending || projectedStock < 0 || !activeProduct}
              className="gap-2"
            >
              <CheckCircle2 className="size-4" />
              {mutation.isPending ? 'Saving...' : 'Confirm Stock Adjustment'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
