import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Loader2, PackageSearch, Plus, RefreshCw, Search, TriangleAlert } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { PageContainer } from '@/shell/page-container';
import { CreateProductDrawer } from '@/features/products/create-product-drawer';
import {
  createProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from '@/features/products/products.api';
import { ProductListSkeleton } from '@/features/products/product-list-skeleton';
import { ProductsTable } from '@/features/products/products-table';
import type { ProductFormValues } from '@/features/products/products.schemas';
import type {
  ProductCreateInput,
  ProductRecord,
  ProductUpdateInput,
} from '@/features/products/products.types';

const PRODUCTS_QUERY_KEY = ['products'] as const;
const TOAST_TIMEOUT_MS = 2800;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

function toCreateProductInput(values: ProductFormValues): ProductCreateInput {
  return {
    name: values.name,
    sku: values.sku,
    barcode: values.barcode || undefined,
    category: values.category,
    sellingPrice: Number(values.sellingPrice),
    costPrice: values.costPrice ? Number(values.costPrice) : 0,
    isService: values.isService ?? false,
    currentStock: values.isService ? 0 : Number(values.currentStock || 0),
    reorderLevel: values.isService ? 0 : Number(values.reorderLevel || 0),
    unitType: values.unitType || 'PCS',
    taxRate: values.taxRate ? Number(values.taxRate) : 0,
  };
}

function toUpdateProductInput(values: ProductFormValues): ProductUpdateInput {
  return {
    name: values.name,
    sku: values.sku,
    barcode: values.barcode || undefined,
    category: values.category,
    sellingPrice: Number(values.sellingPrice),
    costPrice: values.costPrice ? Number(values.costPrice) : undefined,
    isService: values.isService,
    unitType: values.unitType,
    taxRate: values.taxRate ? Number(values.taxRate) : undefined,
    status: values.status,
  };
}

function ProductsToast({ message }: { message: string }): ReactElement {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-[16px] border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-overlay)]">
      {message}
    </div>
  );
}

function ProductsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): ReactElement {
  return (
    <SectionCard
      title="Unable to load products"
      description={message}
      action={
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      }
    >
      <div className="flex items-center gap-3 rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
        <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>We could not load the product list right now.</p>
      </div>
    </SectionCard>
  );
}

export function ProductsPage(): ReactElement {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const urlSearch = searchParams.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim();
    if (normalizedSearch === urlSearch) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (normalizedSearch) {
      nextParams.set('search', normalizedSearch);
    } else {
      nextParams.delete('search');
    }

    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams, urlSearch]);

  const normalizedSearch = debouncedSearch.trim();

  const productsQuery = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, normalizedSearch] as const,
    queryFn: () => fetchProducts(normalizedSearch),
    retry: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const productDetailQuery = useQuery({
    queryKey: ['products', selectedProduct?.id] as const,
    queryFn: async () => {
      if (!selectedProduct?.id) {
        throw new Error('Product id is required.');
      }

      return fetchProduct(selectedProduct.id);
    },
    enabled: drawerMode === 'edit' && Boolean(selectedProduct?.id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      setDrawerError(null);
      setDrawerMode(null);
      setSelectedProduct(null);
      setToastMessage('Product created successfully.');
    },
    onError: (error: unknown) => {
      setDrawerError(getErrorMessage(error));
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (input: ProductUpdateInput) => {
      if (!selectedProduct) {
        throw new Error('Product is required.');
      }

      return updateProduct(selectedProduct.id, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      setDrawerError(null);
      setDrawerMode(null);
      setSelectedProduct(null);
      setToastMessage('Product updated successfully.');
    },
    onError: (error: unknown) => {
      setDrawerError(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, TOAST_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastMessage]);

  const isSearching = productsQuery.isFetching && !productsQuery.isLoading;
  const hasSearch = normalizedSearch.length > 0;
  let content: ReactElement;

  if (productsQuery.isLoading) {
    content = <ProductListSkeleton />;
  } else if (productsQuery.isError) {
    content = (
      <ProductsErrorState
        message={getErrorMessage(productsQuery.error)}
        onRetry={() => void productsQuery.refetch()}
      />
    );
  } else {
    const products = productsQuery.data ?? [];

    if (productsQuery.isFetching && products.length === 0) {
      content = <ProductListSkeleton />;
    } else if (products.length === 0) {
      content = hasSearch ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try a different search term or clear the search."
          primaryAction={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchInput('');
                setDebouncedSearch('');
                setSearchParams(new URLSearchParams(), { replace: true });
              }}
            >
              Clear search
            </Button>
          }
          secondaryAction={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDrawerError(null);
                setSelectedProduct(null);
                setDrawerMode('create');
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Product
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No products have been added yet."
          description="Start building your inventory by creating your first product."
          primaryAction={
            <Button
              type="button"
              onClick={() => {
                setDrawerError(null);
                setSelectedProduct(null);
                setDrawerMode('create');
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Product
            </Button>
          }
        />
      );
    } else {
      content = (
        <ProductsTable
          products={products}
          onEdit={(product) => {
            setDrawerError(null);
            setSelectedProduct(product);
            setDrawerMode('edit');
          }}
        />
      );
    }
  }

  const drawerProduct = drawerMode === 'edit' ? (productDetailQuery.data ?? selectedProduct) : null;
  const isSaving = createProductMutation.isPending || updateProductMutation.isPending;

  const handleDrawerClose = (open: boolean): void => {
    if (open) {
      return;
    }

    setDrawerError(null);
    setDrawerMode(null);
    setSelectedProduct(null);
  };

  const handleDrawerSubmit = async (values: ProductFormValues): Promise<void> => {
    setDrawerError(null);

    if (drawerMode === 'edit') {
      await updateProductMutation.mutateAsync(toUpdateProductInput(values));
      return;
    }

    await createProductMutation.mutateAsync(toCreateProductInput(values));
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        {toastMessage ? <ProductsToast message={toastMessage} /> : null}

        <PageHeader
          eyebrow="Products"
          title="Products"
          description="Manage your catalog with a clean, organized product list."
          actions={
            <Button
              type="button"
              onClick={() => {
                setDrawerError(null);
                setSelectedProduct(null);
                setDrawerMode('create');
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Product
            </Button>
          }
        />

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="pl-9 pr-10"
            />
            {isSearching ? (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : null}
          </div>

          {isSearching ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching
            </div>
          ) : null}
        </div>

        {content}
      </div>

      <CreateProductDrawer
        mode={drawerMode === 'edit' ? 'edit' : 'create'}
        open={drawerMode !== null}
        product={drawerProduct}
        isSaving={isSaving}
        errorMessage={drawerError}
        onOpenChange={handleDrawerClose}
        onSubmit={handleDrawerSubmit}
      />
    </PageContainer>
  );
}
