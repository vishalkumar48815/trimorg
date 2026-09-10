import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  User,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchCustomers } from '@/features/customers/customers.api';
import type { CustomerRecord } from '@/features/customers/customers.types';
import { fetchProducts } from '@/features/products/products.api';
import { createSale } from './sales.api';

const quotationItemSchema = z.object({
  productId: z.string().min(1, 'Please select a catalog item.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  sellingPrice: z.number().min(0, 'Price must be 0 or greater.'),
  discount: z.number().min(0),
});

const quotationFormSchema = z.object({
  customerId: z.string().optional(),
  vehicleNotes: z.string().trim().max(250).optional(),
  discount: z.number().min(0),
  tax: z.number().min(0),
  items: z.array(quotationItemSchema).min(1, 'Add at least one line item.'),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

interface QuotationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCustomer?: CustomerRecord | null;
  onSuccess?: () => void;
}

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function QuotationDrawer({
  open,
  onOpenChange,
  preselectedCustomer,
  onSuccess,
}: QuotationDrawerProps): ReactElement {
  const queryClient = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomer?.id ?? '',
  );

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchCustomers(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      customerId: preselectedCustomer?.id ?? '',
      vehicleNotes: preselectedCustomer?.vehicleDetails ?? '',
      discount: 0,
      tax: 0,
      items: [{ productId: '', quantity: 1, sellingPrice: 0, discount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount') || 0;
  const watchedTax = watch('tax') || 0;

  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomerId(preselectedCustomer.id);
      setValue('customerId', preselectedCustomer.id);
      if (preselectedCustomer.vehicleDetails) {
        setValue('vehicleNotes', preselectedCustomer.vehicleDetails);
      }
    }
  }, [preselectedCustomer, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        customerId: preselectedCustomer?.id ?? '',
        vehicleNotes: preselectedCustomer?.vehicleDetails ?? '',
        discount: 0,
        tax: 0,
        items: [{ productId: '', quantity: 1, sellingPrice: 0, discount: 0 }],
      });
    }
  }, [open, preselectedCustomer, reset]);

  const mutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    setValue(`items.${index}.productId`, productId);
    if (product) {
      setValue(`items.${index}.sellingPrice`, Number(product.sellingPrice) || 0);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setValue('customerId', customerId);
    const cust = customers.find((c) => c.id === customerId);
    if (cust?.vehicleDetails) {
      setValue('vehicleNotes', cust.vehicleDetails);
    }
  };

  const calculateSubtotal = () => {
    return (watchedItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.sellingPrice) || 0;
      const d = Number(item.discount) || 0;
      return sum + Math.max(0, q * p - d);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const grandTotal = Math.max(0, subtotal - Number(watchedDiscount || 0) + Number(watchedTax || 0));

  const onSubmit = (values: QuotationFormValues) => {
    mutation.mutate({
      type: 'QUOTATION',
      customerId: values.customerId || undefined,
      vehicleNotes: values.vehicleNotes || undefined,
      discount: values.discount,
      tax: values.tax,
      paidAmount: 0,
      paymentMethod: 'CASH',
      items: values.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        sellingPrice: i.sellingPrice,
        discount: i.discount || 0,
      })),
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-surface-primary">
        <SheetHeader className="p-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-foreground">
                Create Quotation / Estimate
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Draft a formal cost estimate for spare parts and workshop repair labor.
              </p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {mutation.isError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Creation Failed</p>
                <p className="text-xs mt-0.5">
                  {mutation.error instanceof Error ? mutation.error.message : 'Could not create quotation.'}
                </p>
              </div>
            </div>
          )}

          {/* Customer Selection & Vehicle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="size-3.5" /> Select Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Walk-in / Unlinked Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.mobile})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Car className="size-3.5" /> Vehicle Model / Reg Number
              </label>
              <Input
                type="text"
                placeholder="e.g. Ather 450X - DL-05-EF-9876"
                {...register('vehicleNotes')}
              />
            </div>
          </div>

          {/* Line Items (Physical Spares & Service Labor) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Estimate Items & Labor Charges <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: '', quantity: 1, sellingPrice: 0, discount: 0 })}
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
                const currentPrice = Number(watchedItems?.[index]?.sellingPrice) || 0;
                const lineTotal = currentQuantity * currentPrice;

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
                          <option value="">-- Choose Product / Service --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.isService ? '🛠️ [Service] ' : '📦 '}
                              {p.name} ({formatCurrency(p.sellingPrice)})
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
                          placeholder="Unit Price"
                          {...register(`items.${index}.sellingPrice`, { valueAsNumber: true })}
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

          {/* Discounts & Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quotation Discount (₹)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                {...register('discount', { valueAsNumber: true })}
              />
            </div>

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
          </div>

          {/* Grand Total Summary Card */}
          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-surface-secondary/40 to-surface-secondary/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estimated Total
              </span>
              <div className="text-xs text-muted-foreground">
                Subtotal: {formatCurrency(subtotal)} - Discount: {formatCurrency(watchedDiscount)} + Tax: {formatCurrency(watchedTax)}
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
              disabled={isSubmitting || mutation.isPending}
              className="gap-2"
            >
              <CheckCircle2 className="size-4" />
              {mutation.isPending ? 'Saving...' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
