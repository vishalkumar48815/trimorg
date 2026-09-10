import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { fetchCustomers } from './sales.customers';
import { fetchSaleProducts } from './sales.products.api';
import { SalesCheckoutPanel } from './sales-checkout-panel';
import { SalesHeader } from './sales-header';
import { SalesProductCard } from './sales-product-card';
import { SalesSectionCard } from './sales-section-card';
import type { SaleCartItem, SaleProduct } from './sales.types';

const PRODUCTS_QUERY_KEY = ['sales', 'products'] as const;
const CUSTOMERS_QUERY_KEY = ['sales', 'customers'] as const;

function getCartQuantity(cart: SaleCartItem[], productId: string): number {
  return cart.find((item) => item.id === productId)?.quantity ?? 0;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function NewSalePage(): ReactElement {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<null | {
    id: string;
    name: string;
    mobile: string;
  }>(null);
  const [cart, setCart] = useState<SaleCartItem[]>([]);

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchSaleProducts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const customersQuery = useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: fetchCustomers,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const categories = useMemo(() => {
    const categorySet = new Set(products.map((product) => product.category));
    return ['All', ...Array.from(categorySet).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, products, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  const addToCart = (product: SaleProduct): void => {
    if (product.currentStock === 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.currentStock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: string): void => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id || item.quantity >= item.currentStock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  const decreaseQuantity = (id: string): void => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string): void => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <SalesHeader />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.95fr)]">
          <main className="min-w-0 space-y-6">
            <SalesSectionCard
              title="Catalog"
              icon={ShoppingCart}
              description="Tap a product card to add it to the cart. Stock limits are enforced locally."
            >
              <CardlessSearch
                search={search}
                onSearchChange={setSearch}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {productsQuery.isLoading ? (
                <div className="rounded-[16px] border border-dashed border-border bg-surface-secondary/40 p-8 text-center">
                  <p className="text-sm font-medium text-foreground">Loading products...</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fetching the live catalog.</p>
                </div>
              ) : productsQuery.isError ? (
                <EmptyState
                  title="Unable to load products"
                  description="Try again after checking the backend connection."
                />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  title="No products found"
                  description="Try a different search term or category."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <SalesProductCard
                      key={product.id}
                      product={product}
                      cartQuantity={getCartQuantity(cart, product.id)}
                      canAdd={
                        product.currentStock > 0 &&
                        getCartQuantity(cart, product.id) < product.currentStock
                      }
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              )}
            </SalesSectionCard>
          </main>

          <aside>
            <SalesCheckoutPanel
              cart={cart}
              subtotal={subtotal}
              selectedCustomer={selectedCustomer}
              customerSearch={customerSearch}
              customers={customersQuery.data ?? []}
              isCustomersLoading={customersQuery.isLoading}
              isCustomersError={customersQuery.isError}
              isCustomerSheetOpen={isCustomerSheetOpen}
              onCustomerSearchChange={setCustomerSearch}
              onCustomerSheetOpenChange={(open) => {
                setIsCustomerSheetOpen(open);
                if (!open) {
                  setCustomerSearch('');
                }
              }}
              onSelectCustomer={(customer) => {
                setSelectedCustomer(customer);
                setIsCustomerSheetOpen(false);
              }}
              onClearCustomer={() => setSelectedCustomer(null)}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
            />
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

function CardlessSearch({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}): ReactElement {
  return (
    <div className="sticky top-6 z-20 mb-6 space-y-5 rounded-[16px] border border-border/80 bg-surface p-4 shadow-[var(--shadow-raised)] sm:p-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products or SKU"
          aria-label="Search products"
          className="h-12 rounded-[14px] pl-9 text-[15px]"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Categories</p>
          <p className="text-xs text-muted-foreground">Filter by live catalog categories</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'border-foreground bg-foreground text-background shadow-[var(--shadow-overlay)]'
                  : 'border-border bg-surface text-foreground hover:border-foreground/20 hover:bg-surface-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
