import type { ReactElement } from 'react';
import { Phone, Mail, Car, ShoppingBag, Eye, Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { CustomerRecord } from './customers.types';

interface CustomersTableProps {
  customers: CustomerRecord[];
  onView: (customer: CustomerRecord) => void;
  onEdit: (customer: CustomerRecord) => void;
  onBillCustomer: (customer: CustomerRecord) => void;
}

function formatCurrency(value?: string | number): string {
  const numeric = Number(value || 0);
  return `₹${numeric.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CustomersTable({
  customers,
  onView,
  onEdit,
  onBillCustomer,
}: CustomersTableProps): ReactElement {
  return (
    <Card className="overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="border-b border-border px-6 py-4">Customer</th>
              <th className="border-b border-border px-5 py-4">Contact</th>
              <th className="border-b border-border px-5 py-4">Vehicle Details</th>
              <th className="border-b border-border px-5 py-4 text-center">Orders</th>
              <th className="border-b border-border px-5 py-4 text-right">Lifetime Spend</th>
              <th className="border-b border-border px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border/70 last:border-b-0 hover:bg-surface-secondary/40 transition-colors"
              >
                {/* Customer Name & Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-foreground">{customer.name}</p>
                      {customer.gst ? (
                        <p className="text-[11px] font-mono text-muted-foreground">GST: {customer.gst}</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact (Phone & Email) */}
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {customer.mobile}
                    </p>
                    {customer.email ? (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate max-w-[180px]">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {customer.email}
                      </p>
                    ) : null}
                  </div>
                </td>

                {/* Vehicle Details */}
                <td className="px-5 py-4">
                  {customer.vehicleDetails ? (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface-secondary px-2.5 py-1 text-xs font-mono text-foreground border border-border/60">
                      <Car className="h-3.5 w-3.5 text-primary" />
                      {customer.vehicleDetails}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">-</span>
                  )}
                </td>

                {/* Invoices Count */}
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <ShoppingBag className="h-3 w-3" />
                    {customer.totalSalesCount ?? 0}
                  </span>
                </td>

                {/* Total Spend */}
                <td className="px-5 py-4 text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onBillCustomer(customer)}
                      className="h-8 px-2.5 text-xs text-primary font-medium hover:bg-primary/10"
                      title="New Bill"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Bill
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onView(customer)}
                      className="h-8 px-2.5 text-xs gap-1"
                      title="View Details & Invoices"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      History
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(customer)}
                      className="h-8 px-2.5 text-xs"
                      title="Edit Customer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
