import { apiRequest } from '@/lib/api';
import type { ProductRecord } from '@/features/products/products.types';
import type { SaleProduct } from '@/features/sales/sales.types';

function mapProduct(record: ProductRecord): SaleProduct {
  return {
    id: record.id,
    name: record.name,
    sku: record.sku,
    category: record.category,
    sellingPrice: Number(record.sellingPrice),
    currentStock: record.currentStock,
    status: record.status,
  };
}

export async function fetchSaleProducts(): Promise<SaleProduct[]> {
  const products = await apiRequest<ProductRecord[]>('/products', {
    method: 'GET',
    auth: true,
  });

  return products.map(mapProduct);
}
