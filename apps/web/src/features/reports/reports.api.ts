import { apiRequest } from '@/lib/api';
import type { InventoryReportResponse, SalesReportResponse } from './reports.types';

export async function fetchSalesReport(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<SalesReportResponse> {
  const query = new URLSearchParams();
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);

  const queryString = query.toString();
  const endpoint = queryString ? `/reports/sales?${queryString}` : '/reports/sales';

  return apiRequest<SalesReportResponse>(endpoint, {
    method: 'GET',
    auth: true,
  });
}

export async function fetchInventoryReport(): Promise<InventoryReportResponse> {
  return apiRequest<InventoryReportResponse>('/reports/inventory', {
    method: 'GET',
    auth: true,
  });
}
