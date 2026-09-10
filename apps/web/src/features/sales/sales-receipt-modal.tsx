import type { ReactElement } from 'react';
import { CheckCircle2, Printer, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from './sales.utils';
import type { SaleRecord } from './sales.types';

interface SalesReceiptModalProps {
  sale: SaleRecord | null;
  open: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

export function SalesReceiptModal({
  sale,
  open,
  onClose,
  onNewSale,
}: SalesReceiptModalProps): ReactElement | null {
  if (!open || !sale) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const org = sale.organization;
  const formattedDate = new Date(sale.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-[20px] border border-border bg-card shadow-2xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-semibold text-foreground">Sale Completed</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Invoice Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            id="printable-receipt"
            className="rounded-[16px] border border-border bg-surface p-6 text-foreground font-mono text-xs sm:text-sm space-y-4"
          >
            {/* Business Info */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-border">
              <h3 className="text-base font-bold text-foreground uppercase tracking-wider">
                {org?.businessName || 'TrimOrg Store'}
              </h3>
              {org?.addressLine1 ? (
                <p className="text-muted-foreground">
                  {org.addressLine1}
                  {org.city ? `, ${org.city}` : ''}
                  {org.state ? `, ${org.state}` : ''}
                </p>
              ) : null}
              <p className="text-muted-foreground">Phone: {org?.mobile || 'N/A'}</p>
              {org?.gst ? <p className="font-semibold text-foreground">GSTIN: {org.gst}</p> : null}
            </div>

            {/* Invoice Meta */}
            <div className="flex justify-between text-muted-foreground py-1 border-b border-dashed border-border text-[11px] sm:text-xs">
              <div>
                <p>
                  <strong className="text-foreground">Invoice:</strong> {sale.saleNumber}
                </p>
                <p>
                  <strong className="text-foreground">Date:</strong> {formattedDate}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <strong className="text-foreground">Payment:</strong> {sale.paymentMethod}
                </p>
                <p>
                  <strong className="text-foreground">Status:</strong> {sale.status}
                </p>
              </div>
            </div>

            {/* Customer & Vehicle Info */}
            {(sale.customerName || sale.vehicleNotes) && (
              <div className="bg-surface-secondary/50 rounded-lg p-2.5 text-[11px] sm:text-xs space-y-1">
                {sale.customerName && (
                  <p>
                    <span className="text-muted-foreground">Customer: </span>
                    <strong className="text-foreground">{sale.customerName}</strong>{' '}
                    {sale.customerMobile && `(${sale.customerMobile})`}
                  </p>
                )}
                {sale.vehicleNotes && (
                  <p>
                    <span className="text-muted-foreground">Vehicle / Notes: </span>
                    <strong className="text-foreground">{sale.vehicleNotes}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Items Table */}
            <div className="pt-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[11px] uppercase tracking-wider">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {sale.items.map((item) => (
                    <tr key={item.id} className="py-2">
                      <td className="py-2 pr-2 font-medium text-foreground">{item.productName}</td>
                      <td className="py-2 px-2 text-center text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-2 text-right text-muted-foreground">
                        {formatCurrency(Number(item.sellingPrice))}
                      </td>
                      <td className="py-2 pl-2 text-right font-semibold text-foreground">
                        {formatCurrency(Number(item.subtotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-dashed border-border space-y-1.5 text-right text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(sale.subtotal))}</span>
              </div>
              {Number(sale.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(Number(sale.discount))}</span>
                </div>
              )}
              {Number(sale.tax) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (GST)</span>
                  <span>+{formatCurrency(Number(sale.tax))}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border text-sm font-bold text-foreground">
                <span>Grand Total</span>
                <span>{formatCurrency(Number(sale.grandTotal))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Amount Paid</span>
                <span>{formatCurrency(Number(sale.paidAmount))}</span>
              </div>
            </div>

            {/* Footer Greeting */}
            <div className="text-center pt-3 border-t border-dashed border-border text-[11px] text-muted-foreground">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 gap-3 bg-card rounded-b-[20px]">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              View Sales
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={onNewSale}
              className="flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              New Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
