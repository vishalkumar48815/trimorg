import { apiRequest } from '@/lib/api';
import type {
  CustomerCreateInput,
  CustomerDetailRecord,
  CustomerRecord,
  CustomerSaleRecord,
  CustomerUpdateInput,
} from './customers.types';

function buildCustomersPath(search?: string): string {
  const normalizedSearch = search?.trim();
  if (!normalizedSearch) {
    return '/customers';
  }

  const params = new URLSearchParams({
    search: normalizedSearch,
  });

  return `/customers?${params.toString()}`;
}

export async function fetchCustomers(search?: string): Promise<CustomerRecord[]> {
  return apiRequest<CustomerRecord[]>(buildCustomersPath(search), {
    method: 'GET',
    auth: true,
  });
}

export async function fetchCustomer(id: string): Promise<CustomerDetailRecord> {
  return apiRequest<CustomerDetailRecord>(`/customers/${id}`, {
    method: 'GET',
    auth: true,
  });
}

export async function createCustomer(input: CustomerCreateInput): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>('/customers', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function updateCustomer(
  id: string,
  input: CustomerUpdateInput,
): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>(`/customers/${id}`, {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiRequest<void>(`/customers/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchCustomerSales(id: string): Promise<CustomerSaleRecord[]> {
  return apiRequest<CustomerSaleRecord[]>(`/customers/${id}/sales`, {
    method: 'GET',
    auth: true,
  });
}
