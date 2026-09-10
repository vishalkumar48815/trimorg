import type { ReactElement } from 'react';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { SaleCustomer } from './sales.customers';

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
}: SalesCustomerSheetProps): ReactElement {
  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.mobile}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[480px] sm:max-w-[480px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-6 pb-6 pt-6">
            <SheetTitle>Select Customer</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Search and attach an existing customer to this sale.
            </p>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by name or mobile"
                aria-label="Search customers"
                className="h-12 rounded-[14px] pl-9 text-[15px]"
              />
            </div>

            {isLoading ? (
              <div className="rounded-[16px] border border-border bg-surface p-4 shadow-[var(--shadow-raised)]">
                <p className="text-sm font-medium text-foreground">Loading customers...</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fetching saved customers for this organization.
                </p>
              </div>
            ) : isError ? (
              <EmptyState
                title="Unable to load customers"
                description="Try again after checking the backend connection."
              />
            ) : filteredCustomers.length === 0 ? (
              <EmptyState
                title="No customers found"
                description="There are no saved customers yet."
              />
            ) : (
              <div className="space-y-3">
                {filteredCustomers.map((customer) => {
                  const isSelected = customer.id === selectedCustomerId;

                  return (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => onSelectCustomer(customer)}
                      className={`w-full rounded-[16px] border px-4 py-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-[var(--shadow-overlay)]'
                          : 'border-border bg-surface hover:border-primary/20 hover:bg-surface-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.mobile}</p>
                        </div>
                        {isSelected ? (
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
