import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  PlusCircle,
  Download,
  QrCode,
  TrendingUp,
  AlertCircle,
  Search,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { fetchPayments } from './payments.api';
import { RecordPaymentDrawer } from './record-payment-drawer';
import { UpiQrModal } from './upi-qr-modal';
import type { DueInvoiceItem } from './payments.types';
import { formatCurrency } from '@/features/sales/sales.utils';

export function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [selectedDueInvoice, setSelectedDueInvoice] = useState<DueInvoiceItem | null>(null);

  const { data: response, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['payments', search, methodFilter],
    queryFn: () => fetchPayments({ search, paymentMethod: methodFilter || undefined }),
  });

  const handleOpenQrForInvoice = (invoice: DueInvoiceItem) => {
    setSelectedDueInvoice(invoice);
    setUpiModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!response || !response.payments.length) return;

    const headers = [
      'Payment Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Invoice Number',
      'Amount',
      'Payment Method',
      'Transaction Ref',
      'Notes',
    ];

    const rows = response.payments.map((p) => [
      p.paymentNumber,
      p.createdAt,
      `"${p.customerName.replace(/"/g, '""')}"`,
      p.customerMobile || '',
      p.saleNumber || '',
      p.amount,
      p.paymentMethod,
      `"${(p.transactionRef || '').replace(/"/g, '""')}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trimorg-payments-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = response?.summary;

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Payments & Collections Ledger
            </h1>
            <p className="text-sm text-muted-foreground">
              Record invoice settlements, track outstanding dues, and generate dynamic UPI QR codes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDueInvoice(null);
                setUpiModalOpen(true);
              }}
              className="gap-2"
            >
              <QrCode className="h-4 w-4 text-primary" />
              UPI QR Code
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading || !response?.payments.length}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>

            <Button size="sm" onClick={() => setDrawerOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Collections
              </CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalCollected || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {summary?.totalTransactionsCount || 0} recorded payments
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Inflow
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.todayCollected || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Collected today via Cash / UPI / Card
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding Dues
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalOutstandingDue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unpaid customer balances
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payment #, customer, or invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary"
              >
                <option value="">All Payment Methods</option>
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
                <option value="BANK_TRANSFER">BANK TRANSFER</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching || isLoading}
                className="h-9 gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Ledger Table */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Transactions Ledger
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Chronological log of customer payments and settlements
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              <span>{response?.payments.length || 0} Records</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading payment transactions...
              </div>
            ) : !response?.payments.length ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No payment transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="py-3 px-3">Payment #</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Invoice Ref</th>
                      <th className="py-3 px-3 text-center">Method</th>
                      <th className="py-3 px-3">Transaction ID</th>
                      <th className="py-3 px-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {response.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-foreground">
                          {p.paymentNumber}
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', {
                            dateStyle: 'medium',
                          })}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground">{p.customerName}</p>
                          {p.customerMobile && (
                            <p className="text-xs text-muted-foreground">{p.customerMobile}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs">
                          {p.saleNumber ? (
                            <span className="font-semibold text-primary">{p.saleNumber}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Direct</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-muted-foreground">
                          {p.transactionRef || '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          {formatCurrency(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RecordPaymentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenUpiQr={handleOpenQrForInvoice}
      />

      <UpiQrModal
        open={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        defaultAmount={selectedDueInvoice?.dueAmount || 500}
        defaultInvoice={selectedDueInvoice?.saleNumber || ''}
        defaultCustomer={selectedDueInvoice?.customerName || ''}
      />
    </PageContainer>
  );
}
