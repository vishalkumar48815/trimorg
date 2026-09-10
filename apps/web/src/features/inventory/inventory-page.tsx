import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  AlertTriangle,
  ArrowDownUp,
  Sliders,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Boxes,
  TrendingDown,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { fetchProducts } from '@/features/products/products.api';
import type { ProductRecord } from '@/features/products/products.types';
import {
  fetchInventorySummary,
  fetchLowStockProducts,
  fetchStockMovements,
} from './inventory.api';
import { InventoryMovementsTable } from './inventory-movements-table';
import { StockAdjustDrawer } from './stock-adjust-drawer';

type ActiveTab = 'CATALOG' | 'MOVEMENTS' | 'LOW_STOCK';

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InventoryPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>('CATALOG');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [movementSearch, setMovementSearch] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('ALL');
  const [adjustDrawerOpen, setAdjustDrawerOpen] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<ProductRecord | null>(null);

  // Queries
  const summaryQuery = useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: fetchInventorySummary,
  });

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const movementsQuery = useQuery({
    queryKey: ['inventory', 'movements'],
    queryFn: () => fetchStockMovements(),
  });

  const lowStockQuery = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: fetchLowStockProducts,
  });

  const physicalProducts = useMemo(() => {
    const list = productsQuery.data ?? [];
    return list.filter((p) => !p.isService);
  }, [productsQuery.data]);

  const filteredCatalog = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    if (!q) return physicalProducts;
    return physicalProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)),
    );
  }, [physicalProducts, catalogSearch]);

  const filteredMovements = useMemo(() => {
    const list = movementsQuery.data ?? [];
    const q = movementSearch.trim().toLowerCase();
    return list.filter((m) => {
      const matchesType = movementTypeFilter === 'ALL' || m.type === movementTypeFilter;
      const matchesSearch =
        !q ||
        m.productName.toLowerCase().includes(q) ||
        m.productSku.toLowerCase().includes(q) ||
        (m.reason && m.reason.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [movementsQuery.data, movementTypeFilter, movementSearch]);

  const handleOpenAdjust = (product?: ProductRecord) => {
    setSelectedProductForAdjust(product || null);
    setAdjustDrawerOpen(true);
  };

  const summary = summaryQuery.data;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Inventory & Stock Control"
          description="Real-time warehouse stock, valuation, low-stock warnings, and audit logs."
          actions={
            <Button
              type="button"
              onClick={() => handleOpenAdjust()}
              className="gap-2 shadow-xs"
            >
              <Sliders className="size-4" />
              Adjust Stock
            </Button>
          }
        />

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stock Valuation (Retail)
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Warehouse className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(summary?.totalValuationRetail ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cost Basis: {formatCurrency(summary?.totalValuationCost ?? 0)}
              </p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Items in Stock
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-500">
                {summary?.inStockCount ?? physicalProducts.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total SKUs: {summary?.totalItemsCount ?? physicalProducts.length}
              </p>
            </div>
          </Card>

          <Card
            onClick={() => setActiveTab('LOW_STOCK')}
            className="p-5 border-border/80 bg-surface-primary shadow-xs cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Low Stock Alerts
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <AlertTriangle className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-500">
                {summary?.lowStockCount ?? lowStockQuery.data?.length ?? 0}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                <TrendingDown className="size-3.5" /> Needs Reordering
              </p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Out of Stock
              </span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <XCircle className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-rose-500">
                {summary?.outOfStockCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Zero units on hand</p>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('CATALOG')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'CATALOG'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Boxes className="size-4" />
            Stock Levels ({physicalProducts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MOVEMENTS')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'MOVEMENTS'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowDownUp className="size-4" />
            Audit Ledger ({movementsQuery.data?.length ?? 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LOW_STOCK')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'LOW_STOCK'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlertTriangle className="size-4" />
            Low Stock Alerts ({lowStockQuery.data?.length ?? 0})
          </button>
        </div>

        {/* Tab 1: Catalog & Stock Levels */}
        {activeTab === 'CATALOG' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, SKU, barcode..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {filteredCatalog.length === 0 ? (
              <Card className="p-8">
                <EmptyState
                  icon={Package}
                  title="No physical products found"
                  description="Products marked as physical inventory will appear here with live stock counts."
                />
              </Card>
            ) : (
              <Card className="overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="border-b border-border py-3 px-4">Product / Category</th>
                        <th className="border-b border-border py-3 px-4">SKU / Barcode</th>
                        <th className="border-b border-border py-3 px-4 text-right">Selling Price</th>
                        <th className="border-b border-border py-3 px-4 text-center">Stock Level</th>
                        <th className="border-b border-border py-3 px-4 text-center">Reorder Point</th>
                        <th className="border-b border-border py-3 px-4 text-right">Stock Valuation</th>
                        <th className="border-b border-border py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-sm">
                      {filteredCatalog.map((product) => {
                        const stock = product.currentStock;
                        const isOutOfStock = stock === 0;
                        const isLowStock = !isOutOfStock && stock <= product.reorderLevel;
                        const valuation = stock * Number(product.sellingPrice);

                        return (
                          <tr key={product.id} className="hover:bg-surface-secondary/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-foreground">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.category}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-mono text-xs font-medium text-foreground">{product.sku}</div>
                              {product.barcode && (
                                <div className="text-[11px] font-mono text-muted-foreground">{product.barcode}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency(product.sellingPrice)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isOutOfStock ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                  <XCircle className="size-3" /> 0 {product.unitType} (Out of Stock)
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  <AlertTriangle className="size-3" /> {stock} {product.unitType} (Low Stock)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  <CheckCircle2 className="size-3" /> {stock} {product.unitType}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center text-xs text-muted-foreground font-medium">
                              {product.reorderLevel} {product.unitType}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-foreground">
                              {formatCurrency(valuation)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenAdjust(product)}
                                className="gap-1.5 text-xs h-8"
                              >
                                <Sliders className="size-3.5" />
                                Adjust
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tab 2: Stock Movement Audit Log */}
        {activeTab === 'MOVEMENTS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search movements, products, notes..."
                  value={movementSearch}
                  onChange={(e) => setMovementSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['ALL', 'SALE', 'RESTOCK', 'DAMAGE', 'ADJUSTMENT', 'RETURN'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMovementTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      movementTypeFilter === type
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-surface-secondary text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <InventoryMovementsTable
              movements={filteredMovements}
              isLoading={movementsQuery.isLoading}
            />
          </div>
        )}

        {/* Tab 3: Low Stock Alerts */}
        {activeTab === 'LOW_STOCK' && (
          <div className="space-y-4">
            {lowStockQuery.data && lowStockQuery.data.length > 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="size-5 shrink-0" />
                  <span>
                    <strong>{lowStockQuery.data.length} items</strong> have reached or fallen below their configured reorder thresholds.
                  </span>
                </div>
              </div>
            ) : null}

            {lowStockQuery.data?.length === 0 ? (
              <Card className="p-8">
                <EmptyState
                  icon={CheckCircle2}
                  title="Inventory is healthy"
                  description="All physical items are currently above their minimum reorder thresholds."
                />
              </Card>
            ) : (
              <Card className="overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-surface-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="border-b border-border py-3 px-4">Product Name</th>
                        <th className="border-b border-border py-3 px-4">SKU</th>
                        <th className="border-b border-border py-3 px-4 text-center">Current Stock</th>
                        <th className="border-b border-border py-3 px-4 text-center">Reorder Threshold</th>
                        <th className="border-b border-border py-3 px-4 text-right">Shortage</th>
                        <th className="border-b border-border py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-sm">
                      {lowStockQuery.data?.map((product) => {
                        const stock = product.currentStock;
                        const shortage = Math.max(0, product.reorderLevel - stock);

                        return (
                          <tr key={product.id} className="hover:bg-surface-secondary/30 transition-colors">
                            <td className="py-3 px-4 font-semibold text-foreground">{product.name}</td>
                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{product.sku}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-bold text-rose-500">
                                {stock} {product.unitType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-muted-foreground">
                              {product.reorderLevel} {product.unitType}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-amber-500">
                              +{shortage + 5} recommended
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleOpenAdjust(product)}
                                className="gap-1.5 text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white"
                              >
                                <Plus className="size-3.5" />
                                Restock Item
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Stock Adjust Drawer */}
        <StockAdjustDrawer
          open={adjustDrawerOpen}
          onOpenChange={setAdjustDrawerOpen}
          product={selectedProductForAdjust}
          allProducts={physicalProducts}
        />
      </div>
    </PageContainer>
  );
}
