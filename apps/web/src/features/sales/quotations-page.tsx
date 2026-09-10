import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Receipt,
  Car,
  Phone,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { convertQuotationToInvoice, fetchSaleById, fetchSales } from './sales.api';
import { QuotationDrawer } from './quotation-drawer';
import { SalesReceiptModal } from './sales-receipt-modal';
import type { SaleRecord } from './sales.types';

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

export function QuotationsPage(): ReactElement {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuoteForReceipt, setSelectedQuoteForReceipt] = useState<SaleRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetchSales(),
  });

  const quotations = useMemo(() => {
    return sales.filter((s) => s.type === 'QUOTATION');
  }, [sales]);

  const convertedInvoices = useMemo(() => {
    return sales.filter((s) => s.type === 'INVOICE' && s.saleNumber.startsWith('INV-'));
  }, [sales]);

  const convertMutation = useMutation({
    mutationFn: convertQuotationToInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedQuoteForReceipt(data);
      setReceiptModalOpen(true);
    },
  });

  const filteredQuotations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotations;
    return quotations.filter(
      (s) =>
        s.saleNumber.toLowerCase().includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerMobile && s.customerMobile.includes(q)) ||
        (s.vehicleNotes && s.vehicleNotes.toLowerCase().includes(q)),
    );
  }, [quotations, search]);

  const metrics = useMemo(() => {
    const activeCount = quotations.length;
    const totalEstimatedValue = quotations.reduce((sum, q) => sum + Number(q.grandTotal), 0);
    const convertedCount = convertedInvoices.length;
    const avgEstimate = activeCount > 0 ? totalEstimatedValue / activeCount : 0;

    return { activeCount, totalEstimatedValue, convertedCount, avgEstimate };
  }, [quotations, convertedInvoices]);

  const handleViewReceipt = async (quote: SaleRecord) => {
    const fullQuote = await fetchSaleById(quote.id);
    setSelectedQuoteForReceipt(fullQuote);
    setReceiptModalOpen(true);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Quotations & Cost Estimates"
          description="Draft formal repair estimates, spare parts quotations, and convert them to tax invoices with one click."
          actions={
            <Button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="gap-2 shadow-xs"
            >
              <Plus className="size-4" />
              Create Quotation
            </Button>
          }
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Quotations
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FileText className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.activeCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Estimates awaiting approval</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Pipeline
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <TrendingUp className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(metrics.totalEstimatedValue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total quotation value</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tax Invoices
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-500">{metrics.convertedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total completed invoices</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Estimate
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(metrics.avgEstimate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per active estimate</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search quotation #, customer, vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Quotations Table */}
        {isLoading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            <p className="mt-3">Loading quotations...</p>
          </Card>
        ) : filteredQuotations.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={FileText}
              title="No quotations created yet"
              description="Create cost estimates for scooter repairs, servicing, and spare parts. You can convert them to final tax invoices anytime."
              primaryAction={
                <Button type="button" onClick={() => setDrawerOpen(true)} className="gap-2 mt-4">
                  <Plus className="size-4" />
                  Create First Quotation
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
                    <th className="border-b border-border py-3 px-4">Quote # & Date</th>
                    <th className="border-b border-border py-3 px-4">Customer</th>
                    <th className="border-b border-border py-3 px-4">Vehicle Details</th>
                    <th className="border-b border-border py-3 px-4 text-center">Items</th>
                    <th className="border-b border-border py-3 px-4 text-right">Estimate Total</th>
                    <th className="border-b border-border py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {filteredQuotations.map((quote) => (
                    <tr key={quote.id} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground font-mono">{quote.saleNumber}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(quote.createdAt)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {quote.customerName || 'Walk-in Customer'}
                        </div>
                        {quote.customerMobile && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="size-3" /> {quote.customerMobile}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {quote.vehicleNotes ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <Car className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[200px]">{quote.vehicleNotes}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None specified</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {quote.itemCount} items
                      </td>
                      <td className="py-3 px-4 text-right font-black text-foreground">
                        {formatCurrency(quote.grandTotal)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(quote)}
                          className="gap-1 text-xs h-8"
                        >
                          <Eye className="size-3.5" />
                          View / Print
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => convertMutation.mutate(quote.id)}
                          disabled={convertMutation.isPending}
                          className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <ArrowRight className="size-3.5" />
                          {convertMutation.isPending ? 'Converting...' : 'Convert to Invoice'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Drawer for creating Quotation */}
        <QuotationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

        {/* Printable Modal */}
        <SalesReceiptModal
          sale={selectedQuoteForReceipt}
          open={receiptModalOpen}
          onClose={() => {
            setReceiptModalOpen(false);
            setSelectedQuoteForReceipt(null);
          }}
          onNewSale={() => {
            setReceiptModalOpen(false);
            setDrawerOpen(true);
          }}
        />
      </div>
    </PageContainer>
  );
}
