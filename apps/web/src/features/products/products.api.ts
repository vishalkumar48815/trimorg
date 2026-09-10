import { apiRequest } from '@/lib/api';
import type {
  ProductCreateInput,
  ProductRecord,
  ProductUpdateInput,
} from '@/features/products/products.types';

function buildProductsPath(search?: string): string {
  const normalizedSearch = search?.trim();
  if (!normalizedSearch) {
    return '/products';
  }

  const params = new URLSearchParams({
    search: normalizedSearch,
  });

  return `/products?${params.toString()}`;
}

export async function fetchProducts(search?: string): Promise<ProductRecord[]> {
  return apiRequest<ProductRecord[]>(buildProductsPath(search), { method: 'GET', auth: true });
}

export async function fetchProduct(productId: string): Promise<ProductRecord> {
  return apiRequest<ProductRecord>(`/products/${productId}`, { method: 'GET', auth: true });
}

export async function createProduct(input: ProductCreateInput): Promise<ProductRecord> {
  return apiRequest<ProductRecord>('/products', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function updateProduct(
  productId: string,
  input: ProductUpdateInput,
): Promise<ProductRecord> {
  return apiRequest<ProductRecord>(`/products/${productId}`, {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}
