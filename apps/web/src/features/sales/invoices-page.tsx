import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Receipt, Eye, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PageContainer } from '@/shell/page-container';
import { fetchSales, fetchSaleById } from './sales.api';
import { SalesReceiptModal } from './sales-receipt-modal';
import { formatCurrency } from './sales.utils';
import type { SaleRecord } from './sales.types';

export function InvoicesPage(): ReactElement {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const salesQuery = useQuery({
    queryKey: ['sales', 'list'],
    queryFn: () => fetchSales(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const sales = useMemo(() => salesQuery.data ?? [], [salesQuery.data]);

  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.saleNumber.toLowerCase().includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerMobile && s.customerMobile.includes(q)) ||
        (s.vehicleNotes && s.vehicleNotes.toLowerCase().includes(q)),
    );
  }, [sales, search]);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.grandTotal || 0), 0);
    const completedCount = sales.filter((s) => s.status === 'COMPLETED').length;
    return {
      totalRevenue,
      totalCount: sales.length,
      completedCount,
    };
  }, [sales]);

  const handleViewReceipt = async (sale: SaleRecord) => {
    try {
      const fullSale = await fetchSaleById(sale.id);
      setSelectedSale(fullSale);
      setIsReceiptModalOpen(true);
    } catch {
      setSelectedSale(sale);
      setIsReceiptModalOpen(true);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <QrCode className="h-3.5 w-3.5 text-indigo-500" />;
      case 'CARD':
        return <CreditCard className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <Banknote className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Sales & Invoices"
          description="View completed sales, customer invoices, and print receipts."
          actions={
            <Button
              onClick={() => navigate('/sales/pos')}
              className="flex items-center gap-1.5 h-10 rounded-xl font-medium"
            >
              <Plus className="h-4 w-4" />
              New Sale / POS
            </Button>
          }
        />

        {/* Top Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Sales Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Invoices
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalCount}</p>
          </div>
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Completed Orders
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completedCount}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice #, customer, mobile, or vehicle..."
              className="h-10 rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="rounded-[16px] border border-border bg-surface shadow-xs overflow-hidden">
          {salesQuery.isLoading ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-foreground">Loading sales...</p>
              <p className="text-xs text-muted-foreground mt-1">Fetching invoices from database.</p>
            </div>
          ) : salesQuery.isError ? (
            <EmptyState
              title="Unable to load sales"
              description="Check backend connection and retry."
            />
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">No invoices found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {search
                  ? 'Try adjusting your search query.'
                  : 'Create your first sale using the POS checkout.'}
              </p>
              {!search && (
                <Button size="sm" onClick={() => navigate('/sales/pos')} className="mt-2">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Create Sale
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Vehicle / Notes</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-foreground">
                        {sale.saleNumber}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(sale.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-foreground text-xs">
                          {sale.customerName || (
                            <span className="text-muted-foreground">Walk-in</span>
                          )}
                        </div>
                        {sale.customerMobile && (
                          <div className="text-[11px] text-muted-foreground">
                            {sale.customerMobile}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[180px] truncate">
                        {sale.vehicleNotes || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                          {getPaymentIcon(sale.paymentMethod)}
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-foreground text-xs">
                        {formatCurrency(Number(sale.grandTotal))}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReceipt(sale)}
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SalesReceiptModal
        sale={selectedSale}
        open={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onNewSale={() => {
          setIsReceiptModalOpen(false);
          navigate('/sales/pos');
        }}
      />
    </PageContainer>
  );
}
