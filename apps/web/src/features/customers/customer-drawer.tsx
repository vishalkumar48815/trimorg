import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Loader2, User, Phone, Mail, Car, FileCheck, MapPin } from 'lucide-react';
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
import { customerFormSchema, type CustomerFormValues } from './customers.schemas';
import type { CustomerRecord } from './customers.types';

interface CustomerDrawerProps {
  mode: 'create' | 'edit';
  open: boolean;
  customer: CustomerRecord | null;
  isSaving: boolean;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
}

const DEFAULT_VALUES: CustomerFormValues = {
  name: '',
  mobile: '',
  email: '',
  gst: '',
  address: '',
  vehicleDetails: '',
};

function getFormValues(mode: 'create' | 'edit', customer: CustomerRecord | null): CustomerFormValues {
  if (mode === 'edit' && customer) {
    return {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email || '',
      gst: customer.gst || '',
      address: customer.address || '',
      vehicleDetails: customer.vehicleDetails || '',
    };
  }

  return DEFAULT_VALUES;
}

export function CustomerDrawer({
  mode,
  open,
  customer,
  isSaving,
  errorMessage,
  onOpenChange,
  onSubmit,
}: CustomerDrawerProps): ReactElement {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open && !form.formState.isDirty) {
      form.reset(getFormValues(mode, customer));
    }
  }, [customer, form, form.formState.isDirty, mode, open]);

  const title = mode === 'edit' ? 'Edit Customer' : 'Add New Customer';
  const description =
    mode === 'edit'
      ? 'Update customer contact and vehicle profile information.'
      : 'Add a new customer profile with contact, billing, and vehicle info.';
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Create Customer';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[480px] sm:max-w-[480px]">
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

            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-name">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Customer Full Name <span className="text-danger">*</span>
              </label>
              <Input
                id="cust-name"
                placeholder="e.g. Ramesh Kumar"
                {...form.register('name')}
                className="h-10 text-sm"
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-danger">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-mobile">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Mobile Phone <span className="text-danger">*</span>
              </label>
              <Input
                id="cust-mobile"
                placeholder="e.g. 9876543210"
                {...form.register('mobile')}
                className="h-10 text-sm"
              />
              {form.formState.errors.mobile ? (
                <p className="text-xs text-danger">{form.formState.errors.mobile.message}</p>
              ) : null}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-email">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address (Optional)
              </label>
              <Input
                id="cust-email"
                type="email"
                placeholder="e.g. ramesh@example.com"
                {...form.register('email')}
                className="h-10 text-sm"
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-danger">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-vehicle">
                <Car className="h-3.5 w-3.5 text-muted-foreground" />
                Vehicle Model & Registration No. (Optional)
              </label>
              <Input
                id="cust-vehicle"
                placeholder="e.g. Ola S1 Pro - DL-01-AB-1234"
                {...form.register('vehicleDetails')}
                className="h-10 text-sm font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Helpful for EV repair workshops, maintenance records, and service reminders.
              </p>
            </div>

            {/* GSTIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-gst">
                <FileCheck className="h-3.5 w-3.5 text-muted-foreground" />
                GSTIN / Tax ID (Optional for B2B)
              </label>
              <Input
                id="cust-gst"
                placeholder="e.g. 07AAAAA0000A1Z5"
                {...form.register('gst')}
                className="h-10 text-sm font-mono text-xs"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5" htmlFor="cust-address">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Billing / Street Address (Optional)
              </label>
              <Input
                id="cust-address"
                placeholder="e.g. Shop 12, Main Market, Sector 15"
                {...form.register('address')}
                className="h-10 text-sm"
              />
            </div>
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
