import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  Users,
  ShoppingCart,
  PlusCircle,
  Warehouse,
  FileInput,
  FileText,
  BarChart3,
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shell/page-container';
import { fetchDashboardMetrics } from './dashboard.api';
import { fetchSaleById } from '@/features/sales/sales.api';
import { SalesReceiptModal } from '@/features/sales/sales-receipt-modal';
import type { SaleRecord } from '@/features/sales/sales.types';
import { formatCurrency } from '@/features/sales/sales.utils';

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [loadingSaleId, setLoadingSaleId] = useState<string | null>(null);

  const { data: metrics, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: fetchDashboardMetrics,
    refetchInterval: 30000,
  });

  const handleOpenReceipt = async (saleId: string) => {
    try {
      setLoadingSaleId(saleId);
      const sale = await fetchSaleById(saleId);
      setSelectedSale(sale);
      setReceiptModalOpen(true);
    } catch {
      // Ignore or fall back
    } finally {
      setLoadingSaleId(null);
    }
  };

  const maxDailyRevenue = Math.max(
    ...(metrics?.revenueTrend.map((d) => d.revenue) || [1]),
    1,
  );

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Executive Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time operational metrics, revenue overview, and inventory health.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/sales/pos')}
              className="gap-2 shadow-xs"
            >
              <ShoppingCart className="h-4 w-4" />
              New Sale / POS
            </Button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Today's Revenue */}
          <Card className="relative overflow-hidden border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </CardTitle>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(metrics?.todayRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics?.todaySalesCount || 0} completed orders today
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Revenue */}
          <Card className="relative overflow-hidden border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invoiced
              </CardTitle>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <Receipt className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(metrics?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {metrics?.totalInvoicesCount || 0} tax invoices
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Low Stock Alerts */}
          <Card
            className={`relative overflow-hidden border-border bg-card transition-colors cursor-pointer hover:border-amber-500/40`}
            onClick={() => navigate('/business/inventory')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Alerts
              </CardTitle>
              <div
                className={`rounded-full p-2 ${
                  (metrics?.lowStockCount || 0) > 0
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : metrics?.lowStockCount || 0}
                </span>
                <span className="text-xs text-muted-foreground">items below threshold</span>
              </div>
              <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                View Inventory <ArrowRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Customers & Products */}
          <Card className="relative overflow-hidden border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Master Directory
              </CardTitle>
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : metrics?.totalCustomersCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active customers & {metrics?.totalProductsCount || 0} items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 7-Day Revenue Trend Chart & Quick Actions Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Trend Chart (2 Cols) */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  7-Day Revenue Trend
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily revenue velocity for the past week
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports/sales')}
                className="text-xs gap-1"
              >
                Detailed Reports <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                  Loading sales analytics...
                </div>
              ) : (
                <div className="flex h-56 items-end gap-2 sm:gap-4 pt-8 pb-2">
                  {metrics?.revenueTrend.map((day) => {
                    const heightPercent = Math.max(
                      Math.round((day.revenue / maxDailyRevenue) * 100),
                      day.revenue > 0 ? 12 : 4,
                    );
                    const formattedDate = new Date(day.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={day.date}
                        className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end"
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-10 z-20 hidden rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md group-hover:block whitespace-nowrap">
                          {formatCurrency(day.revenue)} ({day.orderCount} sales)
                        </div>

                        {/* Bar */}
                        <div className="w-full flex-1 flex items-end">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-md transition-all duration-300 ${
                              day.revenue > 0
                                ? 'bg-primary/80 group-hover:bg-primary shadow-xs'
                                : 'bg-muted/40'
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <span className="text-[11px] text-muted-foreground font-medium truncate w-full text-center">
                          {formattedDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Panel (1 Col) */}
          <Card className="border-border bg-card flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Quick Operations
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Common business shortcuts and workflows
              </p>
            </CardHeader>
            <CardContent className="grid gap-2.5">
              <Button
                variant="outline"
                className="justify-start gap-3 h-11 text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => navigate('/sales/pos')}
              >
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span>New POS Billing</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-11 text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => navigate('/sales/quotations')}
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Create Quotation / Estimate</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-11 text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => navigate('/business/inventory')}
              >
                <Warehouse className="h-4 w-4 text-amber-500" />
                <span>Adjust Physical Stock</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-11 text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => navigate('/purchases/purchase-orders')}
              >
                <FileInput className="h-4 w-4 text-emerald-500" />
                <span>New Purchase Order (PO)</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-11 text-sm font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => navigate('/reports/sales')}
              >
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span>Financial & Tax Reports</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Top Products & Recent Sales */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Top Selling Products
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Best performing items by revenue contribution
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports/inventory')}
                className="text-xs gap-1"
              >
                Stock Velocity <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : !metrics?.topSellingProducts.length ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No sales recorded yet</p>
                  <p className="text-xs text-muted-foreground/70">
                    Complete your first sale to view item rankings
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {metrics.topSellingProducts.map((p, idx) => (
                    <div key={p.productId} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.productName}</p>
                          <p className="text-xs text-muted-foreground">{p.unitsSold} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(p.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Recent Sales & Invoices
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Latest customer billing transactions
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/sales/invoices')}
                className="text-xs gap-1"
              >
                All Invoices <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : !metrics?.recentSales.length ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 gap-2"
                    onClick={() => navigate('/sales/pos')}
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Start First Sale
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {metrics.recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/30 px-2 rounded-lg transition-colors"
                      onClick={() => handleOpenReceipt(sale.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {loadingSaleId === sale.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Receipt className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {sale.saleNumber}
                            </span>
                            <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {sale.paymentMethod}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{sale.customerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(sale.grandTotal)}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                          {sale.status === 'COMPLETED' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Completed
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 text-amber-500" /> {sale.status}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <SalesReceiptModal
        sale={selectedSale}
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onNewSale={() => {
          setReceiptModalOpen(false);
          navigate('/sales/pos');
        }}
      />
    </PageContainer>
  );
}
