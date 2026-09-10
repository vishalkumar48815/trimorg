import type { ReactElement } from 'react';
import { Phone, Mail, Edit2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SupplierRecord } from './suppliers.types';

interface SuppliersTableProps {
  suppliers: SupplierRecord[];
  onEdit: (supplier: SupplierRecord) => void;
  onCreatePO: (supplier: SupplierRecord) => void;
}

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function SuppliersTable({
  suppliers,
  onEdit,
  onCreatePO,
}: SuppliersTableProps): ReactElement {
  return (
    <Card className="overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="border-b border-border py-3 px-4">Supplier / Vendor</th>
              <th className="border-b border-border py-3 px-4">Contact Details</th>
              <th className="border-b border-border py-3 px-4">GSTIN / Tax ID</th>
              <th className="border-b border-border py-3 px-4 text-center">Orders Count</th>
              <th className="border-b border-border py-3 px-4 text-right">Total Procured</th>
              <th className="border-b border-border py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-surface-secondary/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-foreground">{supplier.name}</div>
                  {supplier.contactPerson && (
                    <div className="text-xs text-muted-foreground">Attn: {supplier.contactPerson}</div>
                  )}
                </td>
                <td className="py-3 px-4 text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Phone className="size-3 text-muted-foreground shrink-0" />
                    <span>{supplier.mobile}</span>
                  </div>
                  {supplier.email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="size-3 shrink-0" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {supplier.gst ? (
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-secondary border border-border text-foreground">
                      {supplier.gst}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Unregistered</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-secondary border border-border text-foreground">
                    {supplier.totalPurchasesCount} POs
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-foreground">
                  {formatCurrency(supplier.totalPurchasesAmount)}
                </td>
                <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onCreatePO(supplier)}
                    className="gap-1 text-xs h-8"
                  >
                    <ShoppingBag className="size-3.5" />
                    New PO
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(supplier)}
                    className="gap-1 text-xs h-8"
                  >
                    <Edit2 className="size-3.5" />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
