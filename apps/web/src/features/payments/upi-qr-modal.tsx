import { useState } from 'react';
import { X, QrCode, Smartphone, Copy, Check, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UpiQrModalProps {
  open: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultInvoice?: string;
  defaultCustomer?: string;
}

export function UpiQrModal({
  open,
  onClose,
  defaultAmount = 500,
  defaultInvoice = '',
  defaultCustomer = '',
}: UpiQrModalProps) {
  const [upiId, setUpiId] = useState('trimorg.pay@upi');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const encodedInvoice = encodeURIComponent(defaultInvoice || 'TrimOrg POS');
  const upiIntent = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('TrimOrg Store')}&am=${amount}&tn=${encodedInvoice}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiIntent)}&margin=8`;

  const handleCopyIntent = () => {
    navigator.clipboard.writeText(upiIntent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-sm flex-col rounded-[20px] border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Dynamic UPI QR</h2>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-center space-y-4">
          {defaultInvoice && (
            <div className="rounded-lg bg-surface-secondary/70 p-2 text-xs text-muted-foreground">
              Collecting for <span className="font-bold text-foreground">{defaultInvoice}</span>
              {defaultCustomer ? ` (${defaultCustomer})` : ''}
            </div>
          )}

          {/* Amount Box */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-3 text-left">
            <label htmlFor="upi-amount" className="text-xs font-semibold text-muted-foreground block mb-1">
              Amount to Pay (₹)
            </label>
            <Input
              id="upi-amount"
              type="number"
              min="1"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="h-9 font-bold text-lg text-primary bg-card"
            />
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-inner border border-border max-w-[240px] mx-auto">
            <img
              src={qrUrl}
              alt="Scan to pay UPI"
              className="h-48 w-48 object-contain rounded-lg"
            />
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
              <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
              <span>GPay · PhonePe · Paytm · BHIM</span>
            </div>
          </div>

          {/* UPI ID setting */}
          <div className="text-left space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground" htmlFor="upi-vpa">
              Store UPI VPA / ID
            </label>
            <div className="flex gap-2">
              <Input
                id="upi-vpa"
                className="h-8 text-xs font-mono"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5"
                onClick={handleCopyIntent}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-card rounded-b-[20px]">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print QR
          </Button>
          <Button size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
