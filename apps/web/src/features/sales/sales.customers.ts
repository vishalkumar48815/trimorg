import { apiRequest } from '@/lib/api';

export interface SaleCustomer {
  id: string;
  name: string;
  mobile: string;
}

interface RawCustomerRecord {
  id: string;
  name?: string | null;
  fullName?: string | null;
  customerName?: string | null;
  mobile?: string | null;
  mobileNumber?: string | null;
  phone?: string | null;
}

function toCustomerName(record: RawCustomerRecord): string {
  return (
    record.name?.trim() || record.fullName?.trim() || record.customerName?.trim() || 'Customer'
  );
}

function toCustomerMobile(record: RawCustomerRecord): string {
  return record.mobile?.trim() || record.mobileNumber?.trim() || record.phone?.trim() || '-';
}

export async function fetchCustomers(): Promise<SaleCustomer[]> {
  const customers = await apiRequest<RawCustomerRecord[]>('/customers', {
    method: 'GET',
    auth: true,
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: toCustomerName(customer),
    mobile: toCustomerMobile(customer),
  }));
}
