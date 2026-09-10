import { apiRequest } from '@/lib/api';
import type { CategoryFormValues, CategoryRecord } from '@/features/categories/categories.types';

export async function fetchCategories(): Promise<CategoryRecord[]> {
  return apiRequest<CategoryRecord[]>('/categories', { method: 'GET', auth: true });
}

export async function createCategory(input: CategoryFormValues): Promise<CategoryRecord> {
  return apiRequest<CategoryRecord>('/categories', {
    method: 'POST',
    body: input,
    auth: true,
  });
}
