import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, CreditCard, Loader2, QrCode, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchDueInvoices, recordPayment } from './payments.api';
import { formatCurrency } from '@/features/sales/sales.utils';
import type { DueInvoiceItem } from './payments.types';

interface RecordPaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenUpiQr: (invoice: DueInvoiceItem) => void;
}

export function RecordPaymentDrawer({
  open,
  onClose,
  onOpenUpiQr,
}: RecordPaymentDrawerProps) {
  const queryClient = useQueryClient();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER'>('CASH');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: dueInvoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ['payments', 'due-invoices'],
    queryFn: fetchDueInvoices,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      handleClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to record payment.';
      setErrorMsg(msg);
    },
  });

  const handleClose = () => {
    setSelectedInvoiceId('');
    setAmount(0);
    setPaymentMethod('CASH');
    setTransactionRef('');
    setNotes('');
    setErrorMsg(null);
    onClose();
  };

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    setErrorMsg(null);
    const invoice = dueInvoices?.find((i) => i.id === invId);
    if (invoice) {
      setAmount(invoice.dueAmount);
    } else {
      setAmount(0);
    }
  };

  const selectedInvoice = dueInvoices?.find((i) => i.id === selectedInvoiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (amount <= 0) {
      setErrorMsg('Payment amount must be greater than zero.');
      return;
    }

    mutation.mutate({
      saleId: selectedInvoiceId || null,
      customerId: selectedInvoice?.customerId || null,
      amount,
      paymentMethod,
      transactionRef: transactionRef.trim() || null,
      notes: notes.trim() || null,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Record Payment Received</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Invoice Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="invoice-select">
              Select Invoice / Customer Due
            </label>
            <select
              id="invoice-select"
              value={selectedInvoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-1 focus:ring-primary"
            >
              <option value="">Direct / Unlinked Payment</option>
              {loadingInvoices ? (
                <option disabled>Loading due invoices...</option>
              ) : (
                dueInvoices?.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.saleNumber} — {inv.customerName} (Due: {formatCurrency(inv.dueAmount)})
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedInvoice && (
            <div className="rounded-xl border border-border bg-surface-secondary/50 p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Invoice Total:</span>
                <span className="font-semibold text-foreground">{formatCurrency(selectedInvoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Already Paid:</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(selectedInvoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground pt-1 border-t border-border font-bold">
                <span className="text-foreground">Remaining Due:</span>
                <span className="text-primary">{formatCurrency(selectedInvoice.dueAmount)}</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2 gap-1.5 text-xs"
                onClick={() => onOpenUpiQr(selectedInvoice)}
              >
                <QrCode className="h-3.5 w-3.5 text-primary" /> Generate UPI QR for this invoice
              </Button>
            </div>
          )}

          {/* Payment Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="pay-amt">
              Payment Amount (₹) *
            </label>
            <Input
              id="pay-amt"
              type="number"
              min="1"
              step="0.01"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    paymentMethod === method
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                      : 'border-border text-foreground hover:bg-muted/40'
                  }`}
                >
                  {method === 'BANK_TRANSFER' ? 'Net Banking' : method}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Ref */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="tx-ref">
              Transaction / UPI Reference #
            </label>
            <Input
              id="tx-ref"
              placeholder="e.g. UPI/3498239482 or Card Auth ID"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground" htmlFor="pay-notes">
              Payment Remarks / Notes
            </label>
            <Input
              id="pay-notes"
              placeholder="Optional notes or check details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
