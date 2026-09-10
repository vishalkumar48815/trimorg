import { apiRequest } from '@/lib/api';
import type { SupplierDetail, SupplierInput, SupplierRecord } from './suppliers.types';

export async function fetchSuppliers(search?: string): Promise<SupplierRecord[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<SupplierRecord[]>(`/suppliers${query}`, { method: 'GET', auth: true });
}

export async function fetchSupplier(id: string): Promise<SupplierDetail> {
  return apiRequest<SupplierDetail>(`/suppliers/${id}`, { method: 'GET', auth: true });
}

export async function createSupplier(input: SupplierInput): Promise<SupplierRecord> {
  return apiRequest<SupplierRecord>('/suppliers', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function updateSupplier(
  id: string,
  input: Partial<SupplierInput>,
): Promise<SupplierRecord> {
  return apiRequest<SupplierRecord>(`/suppliers/${id}`, {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function deleteSupplier(id: string): Promise<void> {
  return apiRequest<void>(`/suppliers/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
