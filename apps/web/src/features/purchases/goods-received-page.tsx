import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { fetchPurchases, receivePurchase } from './purchases.api';

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

export function GoodsReceivedPage(): ReactElement {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');

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

  const pendingDeliveries = useMemo(() => {
    return purchases.filter((p) => p.status === 'ORDERED');
  }, [purchases]);

  const completedDeliveries = useMemo(() => {
    return purchases.filter((p) => p.status === 'RECEIVED');
  }, [purchases]);

  const filteredList = useMemo(() => {
    const list = activeTab === 'PENDING' ? pendingDeliveries : completedDeliveries;
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.purchaseNumber.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q) ||
        p.supplierMobile.includes(q) ||
        (p.supplierInvoiceRef && p.supplierInvoiceRef.toLowerCase().includes(q)),
    );
  }, [activeTab, pendingDeliveries, completedDeliveries, search]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Goods Received Notes (GRN)"
          description="Process inward deliveries from suppliers, confirm received quantities, and credit inventory in real time."
        />

        {/* Status Alert Banner */}
        {pendingDeliveries.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-amber-500" />
              <span>
                <strong>{pendingDeliveries.length} purchase orders</strong> are currently awaiting inward warehouse delivery confirmation.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              View Pending &rarr;
            </button>
          </div>
        )}

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'PENDING'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="size-4" />
              Pending Deliveries ({pendingDeliveries.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HISTORY')}
              className={`pb-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'HISTORY'
                  ? 'border-emerald-500 text-emerald-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="size-4" />
              Received GRN History ({completedDeliveries.length})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search PO#, vendor, bill ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Deliveries List */}
        {isLoading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            <p className="mt-3">Loading deliveries...</p>
          </Card>
        ) : filteredList.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={PackageCheck}
              title={
                activeTab === 'PENDING'
                  ? 'No pending inward deliveries'
                  : 'No goods received history yet'
              }
              description={
                activeTab === 'PENDING'
                  ? 'All purchase orders have been received and credited to warehouse inventory.'
                  : 'When deliveries arrive and are confirmed, their receipt records will appear here.'
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredList.map((po) => (
              <Card
                key={po.id}
                className="p-5 border-border/80 bg-surface-primary shadow-xs hover:border-border transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-base text-foreground font-mono">
                        {po.purchaseNumber}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          po.status === 'RECEIVED'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {po.status === 'RECEIVED' ? (
                          <>
                            <CheckCircle2 className="size-3" /> Received into Stock
                          </>
                        ) : (
                          <>
                            <Clock className="size-3" /> Awaiting Inward GRN
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        {po.supplierName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {po.supplierMobile}
                      </span>
                      {po.supplierInvoiceRef && (
                        <span className="font-mono">Bill Ref: {po.supplierInvoiceRef}</span>
                      )}
                      <span>Order Date: {formatDate(po.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-muted-foreground">
                        {po.itemCount} line items
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {formatCurrency(po.grandTotal)}
                      </div>
                    </div>

                    {po.status === 'ORDERED' ? (
                      <Button
                        type="button"
                        onClick={() => receiveMutation.mutate(po.id)}
                        disabled={receiveMutation.isPending}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        <PackageCheck className="size-4" />
                        {receiveMutation.isPending ? 'Crediting Stock...' : 'Confirm Delivery (Receive Stock)'}
                      </Button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        Stock Credited
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
