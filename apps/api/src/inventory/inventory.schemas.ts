import { z } from 'zod';

export const productIdSchema = z.object({
  id: z.string().trim().min(1, 'Product id is required.'),
});

export const updateProductStockSchema = z.object({
  currentStock: z.coerce.number().int().min(0, 'Current stock must be zero or greater.'),
  reorderLevel: z.coerce.number().int().min(0, 'Reorder level must be zero or greater.'),
});

export const adjustStockSchema = z.object({
  productId: z.string().trim().min(1, 'Product id is required.'),
  type: z.enum(['ADJUSTMENT', 'DAMAGE', 'RESTOCK', 'RETURN', 'INITIAL'], {
    message: 'Movement type is required.',
  }),
  quantityDelta: z.coerce.number().int().refine((val) => val !== 0, {
    message: 'Quantity delta cannot be zero.',
  }),
  reason: z.string().trim().max(500, 'Reason cannot exceed 500 characters.').optional(),
});

export const stockMovementsQuerySchema = z.object({
  productId: z.string().trim().optional(),
  type: z.enum(['SALE', 'PURCHASE', 'ADJUSTMENT', 'RETURN', 'DAMAGE', 'RESTOCK', 'INITIAL']).optional(),
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
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

export class AdjustStockDto {
  static schema = adjustStockSchema;
  productId!: string;
  type!: 'ADJUSTMENT' | 'DAMAGE' | 'RESTOCK' | 'RETURN' | 'INITIAL';
  quantityDelta!: number;
  reason?: string;
}

export class StockMovementsQueryDto {
  static schema = stockMovementsQuerySchema;
  productId?: string;
  type?: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGE' | 'RESTOCK' | 'INITIAL';
  search?: string;
  limit?: number;
  offset?: number;
}

export type ProductIdInput = z.infer<typeof productIdSchema>;
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type StockMovementsQueryInput = z.infer<typeof stockMovementsQuerySchema>;
