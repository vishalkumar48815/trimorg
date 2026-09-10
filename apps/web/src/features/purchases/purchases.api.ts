import { apiRequest } from '@/lib/api';
import type { PurchaseCreateInput, PurchaseRecord, PurchaseStatus } from './purchases.types';

export async function fetchPurchases(params?: {
  search?: string;
  status?: PurchaseStatus;
  supplierId?: string;
}): Promise<PurchaseRecord[]> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.supplierId) searchParams.set('supplierId', params.supplierId);

  const query = searchParams.toString();
  const url = query ? `/purchases?${query}` : '/purchases';

  return apiRequest<PurchaseRecord[]>(url, { method: 'GET', auth: true });
}

export async function fetchPurchase(id: string): Promise<PurchaseRecord> {
  return apiRequest<PurchaseRecord>(`/purchases/${id}`, { method: 'GET', auth: true });
}

export async function createPurchase(input: PurchaseCreateInput): Promise<PurchaseRecord> {
  return apiRequest<PurchaseRecord>('/purchases', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function receivePurchase(id: string): Promise<PurchaseRecord> {
  return apiRequest<PurchaseRecord>(`/purchases/${id}/receive`, {
    method: 'POST',
    auth: true,
  });
}

export async function cancelPurchase(id: string): Promise<PurchaseRecord> {
  return apiRequest<PurchaseRecord>(`/purchases/${id}/cancel`, {
    method: 'POST',
    auth: true,
  });
}
