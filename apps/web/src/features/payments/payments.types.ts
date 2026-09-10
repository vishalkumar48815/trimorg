export interface PaymentListItem {
  id: string;
  paymentNumber: string;
  saleId: string | null;
  saleNumber: string | null;
  customerId: string | null;
  customerName: string;
  customerMobile: string | null;
  amount: number;
  paymentMethod: string;
  transactionRef: string | null;
  notes: string | null;
  createdAt: string;
}

export interface DueInvoiceItem {
  id: string;
  saleNumber: string;
  customerId: string | null;
  customerName: string;
  customerMobile: string | null;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  createdAt: string;
}

export interface PaymentsSummary {
  totalCollected: number;
  todayCollected: number;
  totalOutstandingDue: number;
  totalTransactionsCount: number;
}

export interface PaymentsResponse {
  summary: PaymentsSummary;
  payments: PaymentListItem[];
}

export interface RecordPaymentPayload {
  saleId?: string | null;
  customerId?: string | null;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
  transactionRef?: string | null;
  notes?: string | null;
}
