import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Phone,
  Mail,
  Car,
  FileText,
  MapPin,
  ShoppingBag,
  CreditCard,
  Plus,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchCustomerSales } from './customers.api';
import type { CustomerRecord } from './customers.types';

interface CustomerHistorySheetProps {
  customer: CustomerRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillCustomer: (customer: CustomerRecord) => void;
}

function formatCurrency(value?: string | number): string {
  const numeric = Number(value || 0);
  return `₹${numeric.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CustomerHistorySheet({
  customer,
  open,
  onOpenChange,
  onBillCustomer,
}: CustomerHistorySheetProps): ReactElement {
  const salesQuery = useQuery({
    queryKey: ['customers', customer?.id, 'sales'],
    queryFn: () => (customer?.id ? fetchCustomerSales(customer.id) : Promise.resolve([])),
    enabled: Boolean(customer?.id) && open,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const sales = salesQuery.data ?? [];

  if (!customer) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" />
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[540px] sm:max-w-[540px]">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-border px-6 pb-5 pt-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <SheetTitle className="text-lg">{customer.name}</SheetTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Phone className="h-3 w-3" /> {customer.mobile}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onBillCustomer(customer);
                }}
                className="gap-1.5 h-9 rounded-xl font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                New Bill
              </Button>
            </div>
          </SheetHeader>

          {/* Content Body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] border border-border bg-surface-secondary/40 p-3.5 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Lifetime Value
                </span>
                <p className="text-lg font-bold text-foreground">{formatCurrency(customer.totalSpent)}</p>
              </div>
              <div className="rounded-[14px] border border-border bg-surface-secondary/40 p-3.5 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Purchases
                </span>
                <p className="text-lg font-bold text-primary flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" />
                  {customer.totalSalesCount ?? sales.length}
                </p>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="rounded-[14px] border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Customer Profile Details
              </h4>
              <div className="space-y-2 text-xs">
                {customer.vehicleDetails && (
                  <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-2.5 border border-primary/10">
                    <Car className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">Vehicle Reg. & Model:</span>
                      <p className="font-mono text-primary font-medium">{customer.vehicleDetails}</p>
                    </div>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.gst && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>GSTIN: <strong className="font-mono text-foreground">{customer.gst}</strong></span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoices / Purchase History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Invoice & Service History
                </h4>
                <span className="text-xs text-muted-foreground font-medium">{sales.length} records</span>
              </div>

              {salesQuery.isLoading ? (
                <div className="rounded-[14px] border border-border bg-surface p-6 text-center">
                  <p className="text-xs text-muted-foreground">Loading purchase history...</p>
                </div>
              ) : sales.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-border bg-surface p-6 text-center space-y-2">
                  <Receipt className="h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-medium text-foreground">No invoices generated yet</p>
                  <p className="text-[11px] text-muted-foreground">
                    Click &quot;New Bill&quot; above to create the first sale for this customer.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="rounded-[14px] border border-border bg-surface p-3.5 transition-colors hover:border-primary/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-mono text-xs font-bold text-foreground">{sale.saleNumber}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(sale.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(sale.grandTotal)}</p>
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            {sale.status}
                          </span>
                        </div>
                      </div>

                      {sale.vehicleNotes && (
                        <p className="text-[11px] font-mono text-muted-foreground bg-surface-secondary/70 rounded px-2 py-1">
                          🚗 {sale.vehicleNotes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" /> {sale.paymentMethod}
                        </span>
                        <span>Paid: {formatCurrency(sale.paidAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
