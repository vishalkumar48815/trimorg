import { apiRequest } from '@/lib/api';
import type { ProductRecord } from '@/features/products/products.types';
import type { SaleProduct } from '@/features/sales/sales.types';

function mapProduct(record: ProductRecord): SaleProduct {
  return {
    id: record.id,
    name: record.name,
    sku: record.sku,
    barcode: record.barcode,
    category: record.category,
    sellingPrice: Number(record.sellingPrice),
    costPrice: record.costPrice ? Number(record.costPrice) : 0,
    isService: Boolean(record.isService),
    currentStock: record.currentStock,
    unitType: record.unitType || 'PCS',
    taxRate: record.taxRate ? Number(record.taxRate) : 0,
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
