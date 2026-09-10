import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  PieChart,
  Percent,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shell/page-container';
import { fetchSalesReport } from './reports.api';
import { formatCurrency } from '@/features/sales/sales.utils';

function formatDateInput(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function SalesReportsPage() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [startDate, setStartDate] = useState(formatDateInput(firstDayOfMonth));
  const [endDate, setEndDate] = useState(formatDateInput(now));

  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['reports', 'sales', startDate, endDate],
    queryFn: () => fetchSalesReport({ startDate, endDate }),
  });

  const handlePreset = (preset: 'today' | '7days' | 'month' | '30days') => {
    const today = new Date();
    if (preset === 'today') {
      const todayStr = formatDateInput(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
      setStartDate(formatDateInput(sevenDaysAgo));
      setEndDate(formatDateInput(today));
    } else if (preset === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDateInput(startOfMonth));
      setEndDate(formatDateInput(today));
    } else if (preset === '30days') {
      const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
      setStartDate(formatDateInput(thirtyDaysAgo));
      setEndDate(formatDateInput(today));
    }
  };

  const handleExportCSV = () => {
    if (!report || !report.salesList.length) return;

    const headers = [
      'Invoice Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Items Count',
      'Subtotal',
      'Discount',
      'Tax',
      'Grand Total',
      'Paid Amount',
      'Payment Method',
      'Status',
    ];

    const rows = report.salesList.map((s) => [
      s.saleNumber,
      s.date,
      `"${s.customerName.replace(/"/g, '""')}"`,
      s.customerPhone || '',
      s.itemsCount,
      s.subtotal,
      s.discount,
      s.tax,
      s.grandTotal,
      s.paidAmount,
      s.paymentMethod,
      s.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trimorg-sales-report-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = report?.summary;

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Sales & Financial Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              Tax invoices, revenue breakdown, payment collections, and CSV exports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading || !report?.salesList.length}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Date Filters Bar */}
        <Card className="border-border bg-card">
          <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                Presets:
              </span>
              <Button variant="outline" size="sm" onClick={() => handlePreset('today')}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePreset('7days')}>
                Last 7 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePreset('month')}>
                This Month
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePreset('30days')}>
                Last 30 Days
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>From:</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
              <span className="text-xs text-muted-foreground">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" variant="default" onClick={() => refetch()} className="h-8 text-xs">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 4 Financial Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.netSales || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.totalSalesCount || 0} total invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gross Sales</CardTitle>
              <Receipt className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.grossSales || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Before discounts & taxes
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">GST Collected</CardTitle>
              <Percent className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalTax || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Discounts given: {formatCurrency(summary?.totalDiscount || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collections</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalPaid || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Outstanding: {formatCurrency(summary?.totalDue || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Row: Payment Methods & Category Revenue */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment Methods Breakdown */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Method Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : !report?.paymentBreakdown.length ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No payment data in this range</div>
              ) : (
                <div className="space-y-4">
                  {report.paymentBreakdown.map((item) => (
                    <div key={item.method} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{item.method}</span>
                          <span className="text-xs text-muted-foreground">({item.count} orders)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground">{formatCurrency(item.amount)}</span>
                          <span className="text-xs font-semibold text-primary">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4 text-blue-500" /> Revenue by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : !report?.categoryBreakdown.length ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No category data in this range</div>
              ) : (
                <div className="divide-y divide-border/60">
                  {report.categoryBreakdown.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">{cat.units} items sold</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{formatCurrency(cat.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sales Ledger Table */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Invoices & Sales Ledger
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Complete record of sales generated in this period
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              <span>{report?.salesList.length || 0} Records</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading sales ledger...</div>
            ) : !report?.salesList.length ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No invoices found for the selected date range.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3 text-center">Items</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">Tax</th>
                      <th className="py-2.5 px-3 text-right">Grand Total</th>
                      <th className="py-2.5 px-3 text-center">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {report.salesList.map((sale) => (
                      <tr key={sale.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-foreground">
                          {sale.saleNumber}
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">{sale.date}</td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground">{sale.customerName}</p>
                          {sale.customerPhone && (
                            <p className="text-xs text-muted-foreground">{sale.customerPhone}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center text-muted-foreground">{sale.itemsCount}</td>
                        <td className="py-3 px-3 text-right text-muted-foreground">
                          {formatCurrency(sale.subtotal)}
                        </td>
                        <td className="py-3 px-3 text-right text-muted-foreground">
                          {formatCurrency(sale.tax)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          {formatCurrency(sale.grandTotal)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                            {sale.paymentMethod}
                          </span>
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
    </PageContainer>
  );
}
