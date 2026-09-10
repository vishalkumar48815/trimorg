import type { ReactElement } from 'react';
import {
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  Sliders,
  RotateCcw,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { StockMovementRecord, StockMovementType } from './inventory.types';

interface InventoryMovementsTableProps {
  movements: StockMovementRecord[];
  isLoading?: boolean;
}

function formatMovementDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMovementBadge(type: StockMovementType): {
  label: string;
  className: string;
  icon: ReactElement;
} {
  switch (type) {
    case 'SALE':
      return {
        label: 'Sale',
        className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: <ShoppingCart className="size-3.5" />,
      };
    case 'RESTOCK':
      return {
        label: 'Restock',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: <PlusCircle className="size-3.5" />,
      };
    case 'DAMAGE':
      return {
        label: 'Damaged / Scrap',
        className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        icon: <MinusCircle className="size-3.5" />,
      };
    case 'ADJUSTMENT':
      return {
        label: 'Audit Correction',
        className: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: <Sliders className="size-3.5" />,
      };
    case 'RETURN':
      return {
        label: 'Customer Return',
        className: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        icon: <RotateCcw className="size-3.5" />,
      };
    case 'PURCHASE':
      return {
        label: 'Purchase Order',
        className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        icon: <Truck className="size-3.5" />,
      };
    default:
      return {
        label: type,
        className: 'bg-muted text-muted-foreground border-border',
        icon: <Sliders className="size-3.5" />,
      };
  }
}

export function InventoryMovementsTable({
  movements,
  isLoading,
}: InventoryMovementsTableProps): ReactElement {
  if (isLoading) {
    return (
      <Card className="p-12 text-center text-sm text-muted-foreground">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        <p className="mt-3">Loading stock movements ledger...</p>
      </Card>
    );
  }

  if (movements.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={FileSpreadsheet}
          title="No stock movements recorded yet"
          description="Stock movements will automatically be logged here whenever sales are completed, restocks arrive, or manual count adjustments are made."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="border-b border-border py-3 px-4">Date & Time</th>
              <th className="border-b border-border py-3 px-4">Product / SKU</th>
              <th className="border-b border-border py-3 px-4">Event Type</th>
              <th className="border-b border-border py-3 px-4 text-right">Change (Delta)</th>
              <th className="border-b border-border py-3 px-4 text-center">Stock Before &rarr; After</th>
              <th className="border-b border-border py-3 px-4">Reason / Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {movements.map((movement) => {
              const badge = getMovementBadge(movement.type);
              const isPositive = movement.quantityDelta > 0;

              return (
                <tr key={movement.id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    {formatMovementDate(movement.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-foreground">{movement.productName}</div>
                    <div className="text-xs text-muted-foreground font-mono">SKU: {movement.productSku}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.className}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-block font-bold text-sm ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? `+${movement.quantityDelta}` : movement.quantityDelta}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-secondary/70 border border-border text-xs font-mono">
                      <span className="text-muted-foreground">{movement.previousStock}</span>
                      <span className="text-muted-foreground font-sans">&rarr;</span>
                      <span className="font-bold text-foreground">{movement.newStock}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                    {movement.reason || movement.referenceId || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
