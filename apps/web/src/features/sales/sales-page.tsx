import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Search, ShoppingCart, AlertCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { createSale } from './sales.api';
import { fetchCustomers } from './sales.customers';
import { fetchSaleProducts } from './sales.products.api';
import { SalesCheckoutPanel } from './sales-checkout-panel';
import { SalesHeader } from './sales-header';
import { SalesProductCard } from './sales-product-card';
import { SalesReceiptModal } from './sales-receipt-modal';
import { SalesSectionCard } from './sales-section-card';
import type { SaleCartItem, SaleProduct, SaleRecord } from './sales.types';

const PRODUCTS_QUERY_KEY = ['sales', 'products'] as const;
const CUSTOMERS_QUERY_KEY = ['sales', 'customers'] as const;

function getCartQuantity(cart: SaleCartItem[], productId: string): number {
  return cart.find((item) => item.id === productId)?.quantity ?? 0;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function NewSalePage(): ReactElement {
  const location = useLocation();
  const locationCustomer = (location.state as { selectedCustomer?: { id: string; name: string; mobile: string; vehicleDetails?: string | null } } | null)?.selectedCustomer;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<null | {
    id: string;
    name: string;
    mobile: string;
    vehicleDetails?: string | null;
  }>(locationCustomer || null);
  const [cart, setCart] = useState<SaleCartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT'>(
    'CASH',
  );
  const [vehicleNotes, setVehicleNotes] = useState<string>(locationCustomer?.vehicleDetails || '');
  const [completedSale, setCompletedSale] = useState<SaleRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: fetchSaleProducts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const customersQuery = useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: () => fetchCustomers(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const checkoutMutation = useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      setCompletedSale(data);
      setIsReceiptModalOpen(true);
      setCheckoutError(null);
      // Invalidate products query to reflect updated stock
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to complete sale transaction.';
      setCheckoutError(message);
    },
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
        product.sku.toLowerCase().includes(normalizedSearch) ||
        (product.barcode ? product.barcode.toLowerCase().includes(normalizedSearch) : false);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, products, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  const addToCart = (product: SaleProduct): void => {
    if (!product.isService && product.currentStock === 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (!product.isService && existingItem.quantity >= product.currentStock) {
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
        if (item.id !== id) return item;
        if (!item.isService && item.quantity >= item.currentStock) {
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutError(null);

    const notes = vehicleNotes || selectedCustomer?.vehicleDetails || undefined;

    checkoutMutation.mutate({
      customerId: selectedCustomer?.id,
      discount,
      tax,
      paymentMethod,
      vehicleNotes: notes,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        discount: item.discount || 0,
      })),
    });
  };

  const resetFormForNewSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
    setTax(0);
    setPaymentMethod('CASH');
    setVehicleNotes('');
    setCompletedSale(null);
    setIsReceiptModalOpen(false);
    setCheckoutError(null);
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        <SalesHeader />

        {checkoutError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(380px,0.95fr)]">
          <main className="min-w-0 space-y-6">
            <SalesSectionCard
              title="Catalog"
              icon={ShoppingCart}
              description="Click any product or service card to add it to the cart. Stock limits apply to physical goods."
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
                  <p className="text-sm font-medium text-foreground">Loading catalog...</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fetching products and services.
                  </p>
                </div>
              ) : productsQuery.isError ? (
                <EmptyState
                  title="Unable to load products"
                  description="Try again after checking the backend connection."
                />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  title="No products or services found"
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
                        product.isService ||
                        (product.currentStock > 0 &&
                          getCartQuantity(cart, product.id) < product.currentStock)
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
              discount={discount}
              tax={tax}
              paymentMethod={paymentMethod}
              vehicleNotes={vehicleNotes}
              selectedCustomer={selectedCustomer}
              customerSearch={customerSearch}
              customers={customersQuery.data ?? []}
              isCustomersLoading={customersQuery.isLoading}
              isCustomersError={customersQuery.isError}
              isCustomerSheetOpen={isCustomerSheetOpen}
              isSubmittingSale={checkoutMutation.isPending}
              onDiscountChange={setDiscount}
              onTaxChange={setTax}
              onPaymentMethodChange={setPaymentMethod}
              onVehicleNotesChange={setVehicleNotes}
              onCustomerSearchChange={setCustomerSearch}
              onCustomerSheetOpenChange={(open) => {
                setIsCustomerSheetOpen(open);
                if (!open) {
                  setCustomerSearch('');
                }
              }}
              onSelectCustomer={(customer) => {
                setSelectedCustomer(customer);
                if (customer.vehicleDetails && !vehicleNotes) {
                  setVehicleNotes(customer.vehicleDetails);
                }
                setIsCustomerSheetOpen(false);
              }}
              onClearCustomer={() => setSelectedCustomer(null)}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
              onCheckout={handleCheckout}
              onCustomerCreated={(customer) => {
                queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
                setSelectedCustomer(customer);
              }}
            />
          </aside>
        </div>
      </div>

      <SalesReceiptModal
        sale={completedSale}
        open={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onNewSale={resetFormForNewSale}
      />
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
    <div className="sticky top-6 z-20 mb-6 space-y-4 rounded-[16px] border border-border/80 bg-surface p-4 shadow-[var(--shadow-raised)] sm:p-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products, services, or SKU..."
          aria-label="Search catalog"
          className="h-11 rounded-[14px] pl-9 text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Categories
          </p>
          <p className="text-[11px] text-muted-foreground">Filter by category</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'border-foreground bg-foreground text-background shadow-xs'
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
