import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  UserCircle2,
  Banknote,
  CreditCard,
  QrCode,
  Wallet,
  Percent,
  Receipt,
  Car,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SalesCartItemRow } from './sales-cart-item-row';
import { SalesCustomerSheet } from './sales-customer-sheet';
import { SummaryRow } from './sales-summary-row';
import { formatCurrency } from './sales.utils';
import type { SaleCartItem, SaleCustomer } from './sales.types';

interface SalesCheckoutPanelProps {
  cart: SaleCartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT';
  vehicleNotes: string;
  selectedCustomer: SaleCustomer | null;
  customerSearch: string;
  customers: SaleCustomer[];
  isCustomersLoading: boolean;
  isCustomersError: boolean;
  isCustomerSheetOpen: boolean;
  isSubmittingSale: boolean;
  onDiscountChange: (discount: number) => void;
  onTaxChange: (tax: number) => void;
  onPaymentMethodChange: (method: 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT') => void;
  onVehicleNotesChange: (notes: string) => void;
  onCustomerSearchChange: (value: string) => void;
  onCustomerSheetOpenChange: (open: boolean) => void;
  onSelectCustomer: (customer: SaleCustomer) => void;
  onClearCustomer: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onCustomerCreated?: (customer: SaleCustomer) => void;
}

export function SalesCheckoutPanel({
  cart,
  subtotal,
  discount,
  tax,
  paymentMethod,
  vehicleNotes,
  selectedCustomer,
  customerSearch,
  customers,
  isCustomersLoading,
  isCustomersError,
  isCustomerSheetOpen,
  isSubmittingSale,
  onDiscountChange,
  onTaxChange,
  onPaymentMethodChange,
  onVehicleNotesChange,
  onCustomerSearchChange,
  onCustomerSheetOpenChange,
  onSelectCustomer,
  onClearCustomer,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onCustomerCreated,
}: SalesCheckoutPanelProps): ReactElement {
  const [showDetails, setShowDetails] = useState(false);

  const grandTotal = Math.max(0, subtotal - discount + tax);

  const paymentOptions: Array<{
    id: 'CASH' | 'UPI' | 'CARD' | 'CREDIT';
    label: string;
    icon: typeof Banknote;
  }> = [
    { id: 'CASH', label: 'Cash', icon: Banknote },
    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
    { id: 'CARD', label: 'Card', icon: CreditCard },
    { id: 'CREDIT', label: 'Credit (Due)', icon: Wallet },
  ];

  return (
    <>
      <Card className="flex flex-col border-border/80 bg-surface shadow-[var(--shadow-raised)] xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <Receipt className="h-4 w-4" aria-hidden="true" />
              </span>
              Checkout & Billing
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {cart.reduce((s, i) => s + i.quantity, 0)} units
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto pt-4">
          {/* Customer Card */}
          <div className="rounded-[14px] border border-border bg-surface-secondary/40 p-3.5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider">
                <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                Customer
              </div>
              {selectedCustomer ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={onClearCustomer}
                >
                  Remove
                </Button>
              ) : null}
            </div>

            {selectedCustomer ? (
              <div className="space-y-2 rounded-[12px] border border-border bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-foreground">{selectedCustomer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedCustomer.mobile}</p>
                    {selectedCustomer.vehicleDetails && (
                      <p className="text-[11px] font-mono text-primary pt-0.5">
                        🚗 {selectedCustomer.vehicleDetails}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onCustomerSheetOpenChange(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-[12px] border border-dashed border-border bg-surface p-2.5">
                <div className="text-xs text-muted-foreground">Walk-in Customer</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onCustomerSheetOpenChange(true)}
                >
                  + Add / Select
                </Button>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="rounded-[14px] border border-border bg-surface-secondary/30 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Cart Items ({cart.length})
              </h3>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-border bg-surface p-5 text-center">
                <p className="text-xs font-medium text-foreground">Cart is empty</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Click catalog items on the left to add.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <SalesCartItemRow
                    key={item.id}
                    item={item}
                    canIncrease={item.isService || item.quantity < item.currentStock}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = paymentMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onPaymentMethodChange(option.id)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px]">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Details (Discount, Tax, Vehicle Notes) */}
          <div className="rounded-[14px] border border-border bg-surface-secondary/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Discount & Vehicle Notes
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-primary hover:underline font-medium"
              >
                {showDetails ? 'Hide' : '+ Edit'}
              </button>
            </div>

            {showDetails && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Discount (₹)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={discount || ''}
                      onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value)))}
                      placeholder="0.00"
                      className="h-8 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Tax / GST (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      value={tax || ''}
                      onChange={(e) => onTaxChange(Math.max(0, Number(e.target.value)))}
                      placeholder="0.00"
                      className="h-8 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Car className="h-3 w-3" /> Vehicle Reg. / Work Order Notes
                  </label>
                  <Input
                    value={vehicleNotes}
                    onChange={(e) => onVehicleNotesChange(e.target.value)}
                    placeholder="e.g. DL-01-AB-1234 - Brake pad replacement"
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Final Total */}
          <div className="rounded-[14px] border border-border bg-surface-secondary/50 p-3.5 space-y-2 text-xs">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            {discount > 0 && (
              <SummaryRow
                label="Discount"
                value={`-${formatCurrency(discount)}`}
                className="text-emerald-600 dark:text-emerald-400"
              />
            )}
            {tax > 0 && <SummaryRow label="Tax / GST" value={`+${formatCurrency(tax)}`} />}
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between text-base font-bold text-foreground pt-1">
              <span>Grand Total</span>
              <span className="text-lg text-primary">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Checkout Action Button */}
          <Button
            type="button"
            disabled={cart.length === 0 || isSubmittingSale}
            onClick={onCheckout}
            className="w-full h-12 rounded-xl text-base font-semibold shadow-md flex items-center justify-center gap-2"
          >
            {isSubmittingSale ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Sale...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Complete Sale ({formatCurrency(grandTotal)})
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <SalesCustomerSheet
        open={isCustomerSheetOpen}
        customers={customers}
        isLoading={isCustomersLoading}
        isError={isCustomersError}
        search={customerSearch}
        selectedCustomerId={selectedCustomer?.id ?? null}
        onSearchChange={onCustomerSearchChange}
        onSelectCustomer={onSelectCustomer}
        onOpenChange={onCustomerSheetOpenChange}
        onCustomerCreated={onCustomerCreated}
      />
    </>
  );
}
