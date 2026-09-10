import { apiRequest } from '@/lib/api';
import type { SaleCustomer } from './sales.types';

export interface CreateCustomerPayload {
  name: string;
  mobile: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

interface RawCustomerRecord {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  gst?: string | null;
  address?: string | null;
  vehicleDetails?: string | null;
}

export async function fetchCustomers(search?: string): Promise<SaleCustomer[]> {
  const query = search ? `?search=${encodeURIComponent(search.trim())}` : '';
  const customers = await apiRequest<RawCustomerRecord[]>(`/customers${query}`, {
    method: 'GET',
    auth: true,
  });

  return customers.map((c) => ({
    id: c.id,
    name: c.name,
    mobile: c.mobile,
    email: c.email,
    gst: c.gst,
    address: c.address,
    vehicleDetails: c.vehicleDetails,
  }));
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<SaleCustomer> {
  const created = await apiRequest<RawCustomerRecord>('/customers', {
    method: 'POST',
    auth: true,
    body: payload,
  });

  return {
    id: created.id,
    name: created.name,
    mobile: created.mobile,
    email: created.email,
    gst: created.gst,
    address: created.address,
    vehicleDetails: created.vehicleDetails,
  };
}
