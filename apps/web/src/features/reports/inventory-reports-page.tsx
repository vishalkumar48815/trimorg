import { useQuery } from '@tanstack/react-query';
import {
  Warehouse,
  Download,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  PieChart,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/shell/page-container';
import { fetchInventoryReport } from './reports.api';
import { formatCurrency } from '@/features/sales/sales.utils';

export function InventoryReportsPage() {
  const { data: report, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: fetchInventoryReport,
  });

  const handleExportCSV = () => {
    if (!report || !report.items.length) return;

    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Status',
      'Is Service',
      'Current Stock',
      'Reorder Level',
      'Unit Cost Price',
      'Unit Selling Price',
      'Total Cost Valuation',
      'Total Retail Valuation',
    ];

    const rows = report.items.map((p) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      p.status,
      p.isService ? 'YES' : 'NO',
      p.currentStock,
      p.reorderLevel,
      p.costPrice,
      p.sellingPrice,
      p.costValue,
      p.retailValue,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trimorg-inventory-valuation-${new Date().toISOString().split('T')[0]}.csv`);
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
              Inventory Valuation & Stock Health
            </h1>
            <p className="text-sm text-muted-foreground">
              Total asset valuation, stock velocity classification, and warehouse audits.
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
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading || !report?.items.length}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cost Valuation
              </CardTitle>
              <Warehouse className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalCostValuation || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Asset cost locked in {summary?.totalItemsInStock || 0} units
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Retail Worth
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.totalRetailValuation || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Expected revenue at retail price
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expected Margin
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatCurrency(summary?.potentialGrossProfit || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unrealized profit on full inventory
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stock Health
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : summary?.inStockCount || 0}
                </span>
                <span className="text-xs text-muted-foreground">optimal</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.lowStockCount || 0} low stock · {summary?.outOfStockCount || 0} out of stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row: Category Breakdown & Velocity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category-wise Valuation */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" /> Category-wise Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : !report?.categoryValuation.length ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No inventory categories found</div>
              ) : (
                <div className="divide-y divide-border/60">
                  {report.categoryValuation.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.productCount} products · {cat.totalStock} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{formatCurrency(cat.retailValue)}</p>
                        <p className="text-xs text-muted-foreground">Cost: {formatCurrency(cat.costValue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Velocity Ranking */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" /> Stock Velocity (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Fast-Moving Items
                    </h4>
                    {!report?.velocity.fastMoving.length ? (
                      <p className="text-xs text-muted-foreground">No recent item movement</p>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {report.velocity.fastMoving.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {item.unitsSold} sold
                              </span>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                In stock: {item.currentStock}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" /> Slow Moving / Idle Stock
                    </h4>
                    {!report?.velocity.slowMoving.length ? (
                      <p className="text-xs text-muted-foreground">No slow items detected</p>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {report.velocity.slowMoving.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                0 sold / 30d
                              </span>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Stock: {item.currentStock}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Product Valuation Table */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Stock Valuation Ledger
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Per-product inventory valuation and safety levels
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <span>{report?.items.length || 0} Items</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading stock ledger...</div>
            ) : !report?.items.length ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No products registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="py-2.5 px-3">Product / SKU</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Stock</th>
                      <th className="py-2.5 px-3 text-right">Unit Cost</th>
                      <th className="py-2.5 px-3 text-right">Selling Price</th>
                      <th className="py-2.5 px-3 text-right">Cost Value</th>
                      <th className="py-2.5 px-3 text-right">Retail Value</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {report.items.map((p) => {
                      const isLow = !p.isService && p.currentStock > 0 && p.currentStock <= p.reorderLevel;
                      const isOut = !p.isService && p.currentStock <= 0;

                      return (
                        <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-semibold text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.sku}</p>
                          </td>
                          <td className="py-3 px-3 text-xs text-muted-foreground">{p.category}</td>
                          <td className="py-3 px-3 text-center">
                            {p.isService ? (
                              <span className="text-xs text-muted-foreground">Service</span>
                            ) : (
                              <span className="font-bold text-foreground">{p.currentStock}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right text-muted-foreground">
                            {p.isService ? '-' : formatCurrency(p.costPrice)}
                          </td>
                          <td className="py-3 px-3 text-right text-foreground font-medium">
                            {formatCurrency(p.sellingPrice)}
                          </td>
                          <td className="py-3 px-3 text-right text-muted-foreground">
                            {p.isService ? '-' : formatCurrency(p.costValue)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-foreground">
                            {p.isService ? '-' : formatCurrency(p.retailValue)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.isService ? (
                              <span className="inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                                Service
                              </span>
                            ) : isOut ? (
                              <span className="inline-block rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
