import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { createSupplier, updateSupplier } from './suppliers.api';
import {
  supplierFormSchema,
  type SupplierFormValues,
} from './suppliers.schemas';
import type { SupplierRecord } from './suppliers.types';

interface SupplierDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: SupplierRecord | null;
  onSuccess?: () => void;
}

export function SupplierDrawer({
  open,
  onOpenChange,
  supplier,
  onSuccess,
}: SupplierDrawerProps): ReactElement {
  const queryClient = useQueryClient();
  const isEditing = Boolean(supplier);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      mobile: '',
      email: '',
      gst: '',
      address: '',
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contactPerson: supplier.contactPerson || '',
        mobile: supplier.mobile,
        email: supplier.email || '',
        gst: supplier.gst || '',
        address: supplier.address || '',
      });
    } else {
      reset({
        name: '',
        contactPerson: '',
        mobile: '',
        email: '',
        gst: '',
        address: '',
      });
    }
  }, [supplier, reset, open]);

  const mutation = useMutation({
    mutationFn: (values: SupplierFormValues) => {
      if (supplier) {
        return updateSupplier(supplier.id, values);
      }
      return createSupplier(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const onSubmit = (values: SupplierFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-surface-primary">
        <SheetHeader className="p-6 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Truck className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-foreground">
                {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage vendor details, GSTIN, and supply chain contact records.
              </p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {mutation.isError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Operation Failed</p>
                <p className="text-xs mt-0.5">
                  {mutation.error instanceof Error ? mutation.error.message : 'Could not save supplier.'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company / Vendor Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Electra Auto Components Ltd."
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact Person
              </label>
              <Input
                type="text"
                placeholder="e.g. Rajesh Sharma"
                {...register('contactPerson')}
              />
              {errors.contactPerson && <p className="text-xs text-destructive">{errors.contactPerson.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mobile Number <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 9876543210"
                {...register('mobile')}
              />
              {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="sales@electraauto.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                GSTIN / Tax ID
              </label>
              <Input
                type="text"
                placeholder="07AAAAA1234A1Z5"
                {...register('gst')}
              />
              {errors.gst && <p className="text-xs text-destructive">{errors.gst.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Warehouse / Office Address
            </label>
            <textarea
              rows={3}
              placeholder="Plot 45, Industrial Area, New Delhi..."
              {...register('address')}
              className="w-full rounded-lg border border-border bg-surface-primary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
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
              {mutation.isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
