import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useLocation } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  Building2,
  Receipt,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { PageHeader } from '@/components/ui/page-header';
import type { SupplierRecord } from '@/features/suppliers/suppliers.types';
import { cancelPurchase, fetchPurchases, receivePurchase } from './purchases.api';
import { PurchaseOrderDrawer } from './purchase-order-drawer';
import type { PurchaseStatus } from './purchases.types';

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadge(status: PurchaseStatus): {
  label: string;
  className: string;
  icon: ReactElement;
} {
  switch (status) {
    case 'ORDERED':
      return {
        label: 'Pending Inward',
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: <Clock className="size-3.5" />,
      };
    case 'RECEIVED':
      return {
        label: 'Goods Received (GRN)',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: <CheckCircle2 className="size-3.5" />,
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: <XCircle className="size-3.5" />,
      };
  }
}

export function PurchaseOrdersPage(): ReactElement {
  const queryClient = useQueryClient();
  const location = useLocation();
  const locationSupplier = (location.state as { selectedSupplier?: SupplierRecord } | null)?.selectedSupplier;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PurchaseStatus>('ALL');
  const [poDrawerOpen, setPoDrawerOpen] = useState(Boolean(locationSupplier));
  const [preselectedSupplier] = useState<SupplierRecord | null>(locationSupplier || null);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => fetchPurchases(),
  });

  const receiveMutation = useMutation({
    mutationFn: receivePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const filteredPurchases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return purchases.filter((p) => {
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesSearch =
        !q ||
        p.purchaseNumber.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        p.supplierMobile.includes(q) ||
        (p.supplierInvoiceRef && p.supplierInvoiceRef.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [purchases, statusFilter, search]);

  const metrics = useMemo(() => {
    const totalCount = purchases.length;
    const pendingCount = purchases.filter((p) => p.status === 'ORDERED').length;
    const receivedCount = purchases.filter((p) => p.status === 'RECEIVED').length;
    const totalSpend = purchases
      .filter((p) => p.status === 'RECEIVED')
      .reduce((sum, p) => sum + Number(p.grandTotal), 0);

    return { totalCount, pendingCount, receivedCount, totalSpend };
  }, [purchases]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Purchase Orders & Procurement"
          description="Issue purchase orders to suppliers, manage vendor invoices, and track inward shipments."
          actions={
            <Button
              type="button"
              onClick={() => setPoDrawerOpen(true)}
              className="gap-2 shadow-xs"
            >
              <Plus className="size-4" />
              Create Purchase Order
            </Button>
          }
        />

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Orders
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FileText className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime purchase orders</p>
            </div>
          </Card>

          <Card
            onClick={() => setStatusFilter('ORDERED')}
            className="p-5 border-border/80 bg-surface-primary shadow-xs cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Delivery
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-500">{metrics.pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting inward GRN intake</p>
            </div>
          </Card>

          <Card
            onClick={() => setStatusFilter('RECEIVED')}
            className="p-5 border-border/80 bg-surface-primary shadow-xs cursor-pointer hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Goods Received (GRN)
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-500">{metrics.receivedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Stock credited to inventory</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Received Spend
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(metrics.totalSpend)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed purchases total</p>
            </div>
          </Card>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search PO#, supplier, bill ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['ALL', 'ORDERED', 'RECEIVED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-surface-secondary text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : st === 'ORDERED' ? 'Pending (ORDERED)' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Orders Table */}
        {isLoading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            <p className="mt-3">Loading purchase orders...</p>
          </Card>
        ) : filteredPurchases.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={FileText}
              title="No purchase orders found"
              description="Create a purchase order when ordering spare parts, vehicles, or consumables from suppliers."
              primaryAction={
                <Button type="button" onClick={() => setPoDrawerOpen(true)} className="gap-2 mt-4">
                  <Plus className="size-4" />
                  Create First PO
                </Button>
              }
            />
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-separate border-spacing-0">
                <thead>
                  <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="border-b border-border py-3 px-4">PO Number & Date</th>
                    <th className="border-b border-border py-3 px-4">Supplier</th>
                    <th className="border-b border-border py-3 px-4">Invoice Ref</th>
                    <th className="border-b border-border py-3 px-4 text-center">Items</th>
                    <th className="border-b border-border py-3 px-4 text-right">Grand Total</th>
                    <th className="border-b border-border py-3 px-4 text-center">Status</th>
                    <th className="border-b border-border py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {filteredPurchases.map((purchase) => {
                    const badge = getStatusBadge(purchase.status);

                    return (
                      <tr key={purchase.id} className="hover:bg-surface-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground">{purchase.purchaseNumber}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(purchase.createdAt)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <Building2 className="size-3.5 text-muted-foreground" />
                            {purchase.supplierName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="size-3" /> {purchase.supplierMobile}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {purchase.supplierInvoiceRef || '—'}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {purchase.itemCount} items
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-foreground">
                          {formatCurrency(purchase.grandTotal)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                          >
                            {badge.icon}
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          {purchase.status === 'ORDERED' && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => receiveMutation.mutate(purchase.id)}
                                disabled={receiveMutation.isPending}
                                className="gap-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <PackageCheck className="size-3.5" />
                                {receiveMutation.isPending ? 'Receiving...' : 'Receive GRN'}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => cancelMutation.mutate(purchase.id)}
                                disabled={cancelMutation.isPending}
                                className="text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {purchase.status === 'RECEIVED' && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              Stock Updated
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* PO Creation Drawer */}
        <PurchaseOrderDrawer
          open={poDrawerOpen}
          onOpenChange={setPoDrawerOpen}
          preselectedSupplier={preselectedSupplier}
        />
      </div>
    </PageContainer>
  );
}
