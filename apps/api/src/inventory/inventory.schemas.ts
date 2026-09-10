import { z } from 'zod';

export const productIdSchema = z.object({
  id: z.string().trim().min(1, 'Product id is required.'),
});

export const updateProductStockSchema = z.object({
  currentStock: z.coerce.number().int().min(0, 'Opening stock must be zero or greater.'),
  reorderLevel: z.coerce.number().int().min(0, 'Reorder level must be zero or greater.'),
});

export class ProductIdDto {
  static schema = productIdSchema;
  id!: string;
}

export class UpdateProductStockDto {
  static schema = updateProductStockSchema;
  currentStock!: number;
  reorderLevel!: number;
}

export type ProductIdInput = z.infer<typeof productIdSchema>;
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>;
