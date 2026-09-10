import type { ReactElement } from 'react';
import { useState } from 'react';
import { Plus, Search, User, Phone, Car, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { createCustomer } from './sales.customers';
import type { SaleCustomer } from './sales.types';

interface SalesCustomerSheetProps {
  open: boolean;
  customers: SaleCustomer[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  selectedCustomerId: string | null;
  onSearchChange: (value: string) => void;
  onSelectCustomer: (customer: SaleCustomer) => void;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated?: (customer: SaleCustomer) => void;
}

export function SalesCustomerSheet({
  open,
  customers,
  isLoading,
  isError,
  search,
  selectedCustomerId,
  onSearchChange,
  onSelectCustomer,
  onOpenChange,
  onCustomerCreated,
}: SalesCustomerSheetProps): ReactElement {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newVehicle, setNewVehicle] = useState('');
  const [newGst, setNewGst] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.mobile} ${customer.vehicleDetails || ''}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim()) {
      setErrorMessage('Name and mobile number are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const created = await createCustomer({
        name: newName.trim(),
        mobile: newMobile.trim(),
        vehicleDetails: newVehicle.trim() || undefined,
        gst: newGst.trim() || undefined,
      });

      if (onCustomerCreated) {
        onCustomerCreated(created);
      }
      onSelectCustomer(created);
      setIsCreating(false);
      setNewName('');
      setNewMobile('');
      setNewVehicle('');
      setNewGst('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create customer.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[500px] sm:max-w-[500px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-6 pb-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SheetTitle>{isCreating ? 'New Customer' : 'Select Customer'}</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isCreating
                    ? 'Add a new customer profile'
                    : 'Search or add a customer for this bill'}
                </p>
              </div>
              <Button
                type="button"
                variant={isCreating ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => {
                  setIsCreating(!isCreating);
                  setErrorMessage(null);
                }}
                className="gap-1.5"
              >
                {isCreating ? (
                  'Back to list'
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Add New
                  </>
                )}
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {isCreating ? (
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> Customer Name *
                  </label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Mobile Number *
                  </label>
                  <Input
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-muted-foreground" /> Vehicle Model & Reg. No
                    (Optional)
                  </label>
                  <Input
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    placeholder="e.g. Ola S1 Pro - DL-01-AB-1234"
                    className="h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-muted-foreground" /> GSTIN (Optional)
                  </label>
                  <Input
                    value={newGst}
                    onChange={(e) => setNewGst(e.target.value)}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    className="h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newName.trim() || !newMobile.trim()}
                    className="w-full h-11 rounded-xl text-sm font-medium"
                  >
                    {isSubmitting ? 'Saving...' : 'Save & Select Customer'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search by name, mobile, or vehicle..."
                    aria-label="Search customers"
                    className="h-11 rounded-[14px] pl-9 text-sm"
                  />
                </div>

                {isLoading ? (
                  <div className="rounded-[16px] border border-border bg-surface p-4 shadow-[var(--shadow-raised)]">
                    <p className="text-sm font-medium text-foreground">Loading customers...</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Fetching saved customer records.
                    </p>
                  </div>
                ) : isError ? (
                  <EmptyState
                    title="Unable to load customers"
                    description="Check backend connection and retry."
                  />
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-muted-foreground">No matching customer found.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreating(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add New Customer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredCustomers.map((customer) => {
                      const isSelected = customer.id === selectedCustomerId;

                      return (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => onSelectCustomer(customer)}
                          className={`w-full rounded-[14px] border p-3.5 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-xs'
                              : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm text-foreground">
                                {customer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{customer.mobile}</p>
                              {customer.vehicleDetails && (
                                <p className="text-[11px] font-mono text-primary/80">
                                  🚗 {customer.vehicleDetails}
                                </p>
                              )}
                            </div>
                            {isSelected ? (
                              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                                Selected
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
