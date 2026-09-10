import { apiRequest } from '@/lib/api';
import type { ProductRecord } from '@/features/products/products.types';
import type {
  InventorySummary,
  StockAdjustmentInput,
  StockMovementRecord,
  StockUpdateInput,
} from './inventory.types';

export async function fetchInventorySummary(): Promise<InventorySummary> {
  return apiRequest<InventorySummary>('/inventory/summary', { method: 'GET', auth: true });
}

export async function fetchLowStockProducts(): Promise<ProductRecord[]> {
  return apiRequest<ProductRecord[]>('/inventory/low-stock', { method: 'GET', auth: true });
}

export async function fetchStockMovements(params?: {
  productId?: string;
  type?: string;
  search?: string;
  limit?: number;
}): Promise<StockMovementRecord[]> {
  const searchParams = new URLSearchParams();
  if (params?.productId) searchParams.set('productId', params.productId);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const url = query ? `/inventory/movements?${query}` : '/inventory/movements';

  return apiRequest<StockMovementRecord[]>(url, { method: 'GET', auth: true });
}

export async function adjustProductStock(
  input: StockAdjustmentInput,
): Promise<{ product: ProductRecord; movement: StockMovementRecord }> {
  return apiRequest<{ product: ProductRecord; movement: StockMovementRecord }>('/inventory/adjust', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function updateProductStock(
  productId: string,
  input: StockUpdateInput,
): Promise<ProductRecord> {
  return apiRequest<ProductRecord>(`/inventory/products/${productId}/stock`, {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}
