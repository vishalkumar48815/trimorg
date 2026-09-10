import { apiRequest } from '@/lib/api';
import type { ProductRecord } from '@/features/products/products.types';
import type { StockUpdateInput } from '@/features/inventory/inventory.types';

export async function fetchLowStockProducts(): Promise<ProductRecord[]> {
  return apiRequest<ProductRecord[]>('/products/low-stock', { method: 'GET', auth: true });
}

export async function updateProductStock(
  productId: string,
  input: StockUpdateInput,
): Promise<ProductRecord> {
  return apiRequest<ProductRecord>(`/products/${productId}/stock`, {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}
