import type { ReactElement } from 'react';
import { UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesCartItemRow } from './sales-cart-item-row';
import { SalesCustomerSheet } from './sales-customer-sheet';
import { SummaryRow } from './sales-summary-row';
import { formatCurrency } from './sales.utils';
import type { SaleCartItem } from './sales.types';
import type { SaleCustomer } from './sales.customers';

interface SalesCheckoutPanelProps {
  cart: SaleCartItem[];
  subtotal: number;
  selectedCustomer: SaleCustomer | null;
  customerSearch: string;
  customers: SaleCustomer[];
  isCustomersLoading: boolean;
  isCustomersError: boolean;
  isCustomerSheetOpen: boolean;
  onCustomerSearchChange: (value: string) => void;
  onCustomerSheetOpenChange: (open: boolean) => void;
  onSelectCustomer: (customer: SaleCustomer) => void;
  onClearCustomer: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SalesCheckoutPanel({
  cart,
  subtotal,
  selectedCustomer,
  customerSearch,
  customers,
  isCustomersLoading,
  isCustomersError,
  isCustomerSheetOpen,
  onCustomerSearchChange,
  onCustomerSheetOpenChange,
  onSelectCustomer,
  onClearCustomer,
  onIncrease,
  onDecrease,
  onRemove,
}: SalesCheckoutPanelProps): ReactElement {
  return (
    <>
      <Card className="flex flex-col border-border/80 bg-surface shadow-[var(--shadow-raised)] xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="inline-flex size-8 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
              <UserCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
            Customer
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 overflow-y-auto">
          <div className="rounded-[16px] border border-border bg-surface-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <UserCircle2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Customer
              </div>
              {selectedCustomer ? (
                <Button type="button" variant="ghost" size="sm" onClick={onClearCustomer}>
                  Clear Customer
                </Button>
              ) : null}
            </div>

            {selectedCustomer ? (
              <div className="space-y-3 rounded-[16px] border border-border bg-surface p-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.mobile}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onCustomerSheetOpenChange(true)}
                >
                  Change Customer
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-[16px] border border-border bg-surface p-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Walk-in Customer</p>
                  <p className="text-sm text-muted-foreground">No customer linked to this sale.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onCustomerSheetOpenChange(true)}
                >
                  Change Customer
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-border bg-surface-secondary/30 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-foreground">Cart Items</h3>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {cart.length} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-border bg-surface p-6 text-center">
                <p className="text-sm font-medium text-foreground">Cart is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add products from the catalog to start the order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <SalesCartItemRow
                    key={item.id}
                    item={item}
                    canIncrease={item.quantity < item.currentStock}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-border bg-surface-secondary/30 p-4">
            <h3 className="mb-4 text-sm font-medium text-foreground">Order Summary</h3>
            <div className="space-y-3">
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <div className="h-px bg-border" />
              <SummaryRow label="Grand Total" value={formatCurrency(subtotal)} emphasis />
            </div>
          </div>
        </CardContent>
      </Card>

      <SalesCustomerSheet
        open={isCustomerSheetOpen}
        customers={customers}
        isLoading={isCustomersLoading}
        isError={isCustomersError}
        search={customerSearch}
        selectedCustomerId={selectedCustomer?.id ?? null}
        onSearchChange={onCustomerSearchChange}
        onSelectCustomer={onSelectCustomer}
        onOpenChange={onCustomerSheetOpenChange}
      />
    </>
  );
}
