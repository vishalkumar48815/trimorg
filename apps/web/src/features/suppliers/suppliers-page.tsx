import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Truck, Plus, Search, ShieldCheck, ShoppingBag, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { fetchSuppliers } from './suppliers.api';
import { SupplierDrawer } from './supplier-drawer';
import { SuppliersTable } from './suppliers-table';
import type { SupplierRecord } from './suppliers.types';

function formatCurrency(val?: string | number): string {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function SuppliersPage(): ReactElement {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(null);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => fetchSuppliers(),
  });

  const filteredSuppliers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        s.mobile.includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.gst && s.gst.toLowerCase().includes(q)),
    );
  }, [suppliers, search]);

  const metrics = useMemo(() => {
    const totalCount = suppliers.length;
    const gstRegistered = suppliers.filter((s) => Boolean(s.gst)).length;
    const totalOrders = suppliers.reduce((sum, s) => sum + s.totalPurchasesCount, 0);
    const totalSpend = suppliers.reduce((sum, s) => sum + Number(s.totalPurchasesAmount), 0);

    return { totalCount, gstRegistered, totalOrders, totalSpend };
  }, [suppliers]);

  const handleOpenAdd = () => {
    setSelectedSupplier(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (supplier: SupplierRecord) => {
    setSelectedSupplier(supplier);
    setDrawerOpen(true);
  };

  const handleCreatePO = (supplier: SupplierRecord) => {
    navigate('/purchases/purchase-orders', { state: { selectedSupplier: supplier } });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Suppliers & Vendors"
          description="Manage parts distributors, manufacturers, GSTIN records, and purchase history."
          actions={
            <Button type="button" onClick={handleOpenAdd} className="gap-2 shadow-xs">
              <Plus className="size-4" />
              Add Supplier
            </Button>
          }
        />

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Suppliers
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Truck className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Active vendor accounts</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                GST Registered
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-500">{metrics.gstRegistered}</div>
              <p className="text-xs text-muted-foreground mt-1">Compliant tax vendors</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Purchase Orders
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <ShoppingBag className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-blue-500">{metrics.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Total POs issued</p>
            </div>
          </Card>

          <Card className="p-5 border-border/80 bg-surface-primary shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Procured
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <IndianRupee className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(metrics.totalSpend)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime procurement spend</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vendor name, contact, GST..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Directory Content */}
        {isLoading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            <p className="mt-3">Loading supplier directory...</p>
          </Card>
        ) : filteredSuppliers.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={Truck}
              title="No suppliers found"
              description="Keep all your parts manufacturers, wholesalers, and vendors organized in one place."
              primaryAction={
                <Button type="button" onClick={handleOpenAdd} className="gap-2 mt-4">
                  <Plus className="size-4" />
                  Add First Supplier
                </Button>
              }
            />
          </Card>
        ) : (
          <SuppliersTable
            suppliers={filteredSuppliers}
            onEdit={handleOpenEdit}
            onCreatePO={handleCreatePO}
          />
        )}

        {/* Add/Edit Drawer */}
        <SupplierDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          supplier={selectedSupplier}
        />
      </div>
    </PageContainer>
  );
}
