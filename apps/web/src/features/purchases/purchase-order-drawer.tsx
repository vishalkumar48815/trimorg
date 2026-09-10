import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchProducts } from '@/features/products/products.api';
import { fetchSuppliers } from '@/features/suppliers/suppliers.api';
import type { SupplierRecord } from '@/features/suppliers/suppliers.types';
import { createPurchase } from './purchases.api';
import {
  purchaseOrderFormSchema,
  type PurchaseOrderFormValues,
} from './purchases.schemas';

interface PurchaseOrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedSupplier?: SupplierRecord | null;
  onSuccess?: () => void;
}

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PurchaseOrderDrawer({
  open,
  onOpenChange,
  preselectedSupplier,
  onSuccess,
}: PurchaseOrderDrawerProps): ReactElement {
  const queryClient = useQueryClient();
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    preselectedSupplier?.id ?? '',
  );

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => fetchSuppliers(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const physicalProducts = products.filter((p) => !p.isService);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      supplierId: preselectedSupplier?.id ?? '',
      supplierInvoiceRef: '',
      tax: 0,
      paidAmount: 0,
      notes: '',
      items: [{ productId: '', quantity: 1, unitCost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedTax = watch('tax') || 0;

  useEffect(() => {
    if (preselectedSupplier) {
      setSelectedSupplierId(preselectedSupplier.id);
      setValue('supplierId', preselectedSupplier.id);
    }
  }, [preselectedSupplier, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        supplierId: preselectedSupplier?.id ?? '',
        supplierInvoiceRef: '',
        tax: 0,
        paidAmount: 0,
        notes: '',
        items: [{ productId: '', quantity: 1, unitCost: 0 }],
      });
    }
  }, [open, preselectedSupplier, reset]);

  const mutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleProductSelect = (index: number, productId: string) => {
    const product = physicalProducts.find((p) => p.id === productId);
    setValue(`items.${index}.productId`, productId);
    if (product) {
      setValue(`items.${index}.unitCost`, Number(product.costPrice) || 0);
    }
  };

  const calculateSubtotal = () => {
    return (watchedItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const c = Number(item.unitCost) || 0;
      return sum + q * c;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const grandTotal = subtotal + Number(watchedTax || 0);

  const onSubmit = (values: PurchaseOrderFormValues) => {
    mutation.mutate({
      supplierId: values.supplierId,
      supplierInvoiceRef: values.supplierInvoiceRef || undefined,
      tax: values.tax,
      paidAmount: values.paidAmount,
      notes: values.notes || undefined,
      items: values.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitCost: i.unitCost,
      })),
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-card">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-foreground">
                Create Purchase Order (PO)
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issue a procurement order to a supplier. Receiving items will automatically increment warehouse stock.
              </p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5 bg-card">
          {mutation.isError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Creation Failed</p>
                <p className="text-xs mt-0.5">
                  {mutation.error instanceof Error ? mutation.error.message : 'Could not create purchase order.'}
                </p>
              </div>
            </div>
          )}

          {/* Supplier Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Supplier / Vendor <span className="text-destructive">*</span>
              </label>
              <select
                {...register('supplierId')}
                value={selectedSupplierId}
                onChange={(e) => {
                  setSelectedSupplierId(e.target.value);
                  setValue('supplierId', e.target.value);
                }}
                className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Select Vendor --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.mobile})
                  </option>
                ))}
              </select>
              {errors.supplierId && <p className="text-xs text-destructive">{errors.supplierId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Supplier Invoice / Bill Ref
              </label>
              <Input
                type="text"
                placeholder="e.g. ELEC-INV-2026-90"
                {...register('supplierInvoiceRef')}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order Line Items <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: '', quantity: 1, unitCost: 0 })}
                className="gap-1.5 text-xs h-8"
              >
                <Plus className="size-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-2.5">
              {fields.map((field, index) => {
                const currentProductId = watchedItems?.[index]?.productId;
                const currentQuantity = Number(watchedItems?.[index]?.quantity) || 0;
                const currentCost = Number(watchedItems?.[index]?.unitCost) || 0;
                const lineTotal = currentQuantity * currentCost;

                return (
                  <div
                    key={field.id}
                    className="p-3.5 rounded-xl border border-border bg-surface-secondary/40 space-y-2.5"
                  >
                    <div className="grid grid-cols-12 gap-2.5 items-center">
                      <div className="col-span-12 sm:col-span-5">
                        <select
                          value={currentProductId || ''}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="w-full rounded-lg border border-border bg-surface-primary px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">-- Choose Product --</option>
                          {physicalProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          type="number"
                          min={1}
                          placeholder="Qty"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-3">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Cost Price"
                          {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1 text-right font-mono text-xs font-bold text-foreground">
                        {formatCurrency(lineTotal)}
                      </div>

                      <div className="col-span-1 text-right">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.items && <p className="text-xs text-destructive">{errors.items.message}</p>}
          </div>

          {/* Tax & Financials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                GST / Tax (₹)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                {...register('tax', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Advance Paid (₹)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                {...register('paidAmount', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Order Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Procurement Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Delivery expected via DTDC logistics by Friday."
              {...register('notes')}
              className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Grand Total Summary Card */}
          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-surface-secondary/40 to-surface-secondary/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Payable
              </span>
              <div className="text-xs text-muted-foreground">
                Subtotal: {formatCurrency(subtotal)} + Tax: {formatCurrency(watchedTax)}
              </div>
            </div>
            <div className="text-2xl font-black text-primary">
              {formatCurrency(grandTotal)}
            </div>
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
              disabled={isSubmitting || mutation.isPending || !selectedSupplierId}
              className="gap-2"
            >
              <CheckCircle2 className="size-4" />
              {mutation.isPending ? 'Issuing PO...' : 'Create Purchase Order'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
