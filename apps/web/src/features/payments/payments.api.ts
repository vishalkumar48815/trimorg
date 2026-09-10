import { apiRequest } from '@/lib/api';
import type {
  DueInvoiceItem,
  PaymentListItem,
  PaymentsResponse,
  RecordPaymentPayload,
} from './payments.types';

export async function fetchPayments(params?: {
  search?: string;
  paymentMethod?: string;
}): Promise<PaymentsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.paymentMethod) query.set('paymentMethod', params.paymentMethod);

  const queryString = query.toString();
  const endpoint = queryString ? `/payments?${queryString}` : '/payments';

  return apiRequest<PaymentsResponse>(endpoint, {
    method: 'GET',
    auth: true,
  });
}

export async function fetchDueInvoices(): Promise<DueInvoiceItem[]> {
  return apiRequest<DueInvoiceItem[]>('/payments/due-invoices', {
    method: 'GET',
    auth: true,
  });
}

export async function recordPayment(payload: RecordPaymentPayload): Promise<PaymentListItem> {
  return apiRequest<PaymentListItem>('/payments', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}
