import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SlidersHorizontal, Loader2, CheckCircle2, Printer, Percent, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/shell/page-container';
import { fetchStorePreferences, updateStorePreferences } from './settings.api';
import type { StorePreferences } from './settings.types';

export function PreferencesPage() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [quotationPrefix, setQuotationPrefix] = useState('QT-');
  const [purchasePrefix, setPurchasePrefix] = useState('PO-');
  const [receiptPaperWidth, setReceiptPaperWidth] = useState<'80MM' | '58MM' | 'A4'>('80MM');
  const [defaultTaxRate, setDefaultTaxRate] = useState(18);
  const [financialYearStartMonth, setFinancialYearStartMonth] = useState(4);
  const [currencyCode, setCurrencyCode] = useState('INR');

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: fetchStorePreferences,
  });

  useEffect(() => {
    if (preferences) {
      setInvoicePrefix(preferences.invoicePrefix || 'INV-');
      setQuotationPrefix(preferences.quotationPrefix || 'QT-');
      setPurchasePrefix(preferences.purchasePrefix || 'PO-');
      setReceiptPaperWidth(preferences.receiptPaperWidth || '80MM');
      setDefaultTaxRate(preferences.defaultTaxRate ?? 18);
      setFinancialYearStartMonth(preferences.financialYearStartMonth || 4);
      setCurrencyCode(preferences.currencyCode || 'INR');
    }
  }, [preferences]);

  const mutation = useMutation({
    mutationFn: updateStorePreferences,
    onSuccess: (data: StorePreferences) => {
      queryClient.setQueryData(['settings', 'preferences'], data);
      setSuccessMsg('Store preferences updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      invoicePrefix: invoicePrefix.trim(),
      quotationPrefix: quotationPrefix.trim(),
      purchasePrefix: purchasePrefix.trim(),
      receiptPaperWidth,
      defaultTaxRate: Number(defaultTaxRate),
      financialYearStartMonth: Number(financialYearStartMonth),
      currencyCode: currencyCode.trim(),
    });
  };

  return (
    <PageContainer width="constrained">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Store & Billing Preferences
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure document sequence prefixes, POS printer formats, and tax rules.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading preferences...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Numbering & Sequences */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" /> Document Numbering Prefixes
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="inv-prefix">
                    Invoice Prefix
                  </label>
                  <Input
                    id="inv-prefix"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    placeholder="INV-"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">e.g. INV-1001</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="qt-prefix">
                    Quotation Prefix
                  </label>
                  <Input
                    id="qt-prefix"
                    value={quotationPrefix}
                    onChange={(e) => setQuotationPrefix(e.target.value)}
                    placeholder="QT-"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">e.g. QT-1001</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="po-prefix">
                    Purchase Order Prefix
                  </label>
                  <Input
                    id="po-prefix"
                    value={purchasePrefix}
                    onChange={(e) => setPurchasePrefix(e.target.value)}
                    placeholder="PO-"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">e.g. PO-1001</p>
                </div>
              </CardContent>
            </Card>

            {/* Thermal Printer Preference */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Printer className="h-4 w-4 text-blue-500" /> POS & Thermal Printer Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setReceiptPaperWidth('80MM')}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      receiptPaperWidth === '80MM'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <span className="font-bold text-sm text-foreground">80mm Thermal (3 Inch)</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Standard retail receipt printers (EPSON / TVS / Citizen)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReceiptPaperWidth('58MM')}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      receiptPaperWidth === '58MM'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <span className="font-bold text-sm text-foreground">58mm Thermal (2 Inch)</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Compact Bluetooth & Handheld POS billing terminals
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReceiptPaperWidth('A4')}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      receiptPaperWidth === 'A4'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <span className="font-bold text-sm text-foreground">A4 Full Page</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Standard Laser / Inkjet office printers & PDF exports
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Financial & Tax Defaults */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4 text-purple-500" /> Tax & Fiscal Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="tax-rate">
                    Default GST Rate (%)
                  </label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Auto-applied on new items</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="fy-month">
                    Financial Year Start
                  </label>
                  <select
                    id="fy-month"
                    value={financialYearStartMonth}
                    onChange={(e) => setFinancialYearStartMonth(Number(e.target.value))}
                    className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value={4}>April (Standard India FY)</option>
                    <option value={1}>January (Calendar Year)</option>
                    <option value={7}>July</option>
                    <option value={10}>October</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground" htmlFor="currency-code">
                    Store Currency
                  </label>
                  <select
                    id="currency-code"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={mutation.isPending} className="gap-2">
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageContainer>
  );
}
