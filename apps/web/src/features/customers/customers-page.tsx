import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, Plus, Search, UserCheck, TrendingUp, Wallet } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { PageContainer } from '@/shell/page-container';
import {
  createCustomer,
  fetchCustomers,
  updateCustomer,
} from './customers.api';
import { CustomerDrawer } from './customer-drawer';
import { CustomerHistorySheet } from './customer-history-sheet';
import { CustomersTable } from './customers-table';
import type { CustomerFormValues } from './customers.schemas';
import type { CustomerRecord } from './customers.types';

const CUSTOMERS_QUERY_KEY = ['customers'] as const;

function formatCurrency(value?: string | number): string {
  const numeric = Number(value || 0);
  return `₹${numeric.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CustomersPage(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);

  const customersQuery = useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, search] as const,
    queryFn: () => fetchCustomers(search),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const customers = useMemo(() => customersQuery.data ?? [], [customersQuery.data]);

  const stats = useMemo(() => {
    const totalSpent = customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);
    const activeCount = customers.filter((c) => (c.totalSalesCount || 0) > 0).length;
    const avgTicket = customers.length > 0 ? totalSpent / customers.length : 0;

    return {
      totalCount: customers.length,
      activeCount,
      totalSpent,
      avgTicket,
    };
  }, [customers]);

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      setDrawerMode(null);
      setSelectedCustomer(null);
      setDrawerError(null);
    },
    onError: (err: unknown) => {
      setDrawerError(err instanceof Error ? err.message : 'Failed to save customer.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => {
      if (!selectedCustomer) throw new Error('Customer required.');
      return updateCustomer(selectedCustomer.id, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      setDrawerMode(null);
      setSelectedCustomer(null);
      setDrawerError(null);
    },
    onError: (err: unknown) => {
      setDrawerError(err instanceof Error ? err.message : 'Failed to update customer.');
    },
  });

  const handleFormSubmit = async (values: CustomerFormValues) => {
    if (drawerMode === 'edit') {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleBillCustomer = (customer: CustomerRecord) => {
    // Navigate to POS with pre-selected customer state
    navigate('/sales/pos', { state: { selectedCustomer: customer } });
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Customers (CRM)"
          description="Manage your customer directory, vehicle registration profiles, and purchase history."
          actions={
            <Button
              type="button"
              onClick={() => {
                setSelectedCustomer(null);
                setDrawerError(null);
                setDrawerMode('create');
              }}
              className="flex items-center gap-1.5 h-10 rounded-xl font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          }
        />

        {/* Top 3 Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" /> Total Customers
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalCount}</p>
          </div>
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Lifetime Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(stats.totalSpent)}</p>
          </div>
          <div className="rounded-[16px] border border-border bg-surface p-4 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-indigo-500" /> Avg. Spend / Customer
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(stats.avgTicket)}</p>
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
              placeholder="Search by customer name, mobile, GSTIN, or vehicle reg..."
              className="h-10 rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* Content Table / Empty State */}
        {customersQuery.isLoading ? (
          <div className="rounded-[16px] border border-border bg-surface p-8 text-center shadow-xs">
            <p className="text-sm font-medium text-foreground">Loading customer directory...</p>
            <p className="text-xs text-muted-foreground mt-1">Fetching records from server.</p>
          </div>
        ) : customersQuery.isError ? (
          <EmptyState
            title="Unable to load customers"
            description="Check your backend connection and retry."
          />
        ) : customers.length === 0 ? (
          <div className="rounded-[16px] border border-border bg-surface p-12 text-center shadow-xs space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No customers found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search
                ? 'Try a different search query.'
                : 'Start building your customer base by adding your first customer profile.'}
            </p>
            {!search && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedCustomer(null);
                  setDrawerError(null);
                  setDrawerMode('create');
                }}
                className="mt-2"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Customer
              </Button>
            )}
          </div>
        ) : (
          <CustomersTable
            customers={customers}
            onView={(c) => {
              setSelectedCustomer(c);
              setIsHistoryOpen(true);
            }}
            onEdit={(c) => {
              setSelectedCustomer(c);
              setDrawerError(null);
              setDrawerMode('edit');
            }}
            onBillCustomer={handleBillCustomer}
          />
        )}
      </div>

      {/* Customer Add/Edit Drawer */}
      <CustomerDrawer
        mode={drawerMode === 'edit' ? 'edit' : 'create'}
        open={drawerMode !== null}
        customer={selectedCustomer}
        isSaving={createMutation.isPending || updateMutation.isPending}
        errorMessage={drawerError}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerMode(null);
            setSelectedCustomer(null);
            setDrawerError(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Customer Profile & Purchase History Drawer */}
      <CustomerHistorySheet
        customer={selectedCustomer}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        onBillCustomer={handleBillCustomer}
      />
    </PageContainer>
  );
}
