import { apiRequest } from '@/lib/api';
import type { CreateSalePayload, SaleRecord } from './sales.types';

export async function createSale(payload: CreateSalePayload): Promise<SaleRecord> {
  return apiRequest<SaleRecord>('/sales', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export async function fetchSales(params?: {
  search?: string;
  type?: string;
  status?: string;
}): Promise<SaleRecord[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.type) query.set('type', params.type);
  if (params?.status) query.set('status', params.status);

  const queryString = query.toString();
  const endpoint = queryString ? `/sales?${queryString}` : '/sales';

  return apiRequest<SaleRecord[]>(endpoint, {
    method: 'GET',
    auth: true,
  });
}

export async function fetchSaleById(id: string): Promise<SaleRecord> {
  return apiRequest<SaleRecord>(`/sales/${id}`, {
    method: 'GET',
    auth: true,
  });
}
