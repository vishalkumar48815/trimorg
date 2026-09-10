import { z } from 'zod';

export const stockAdjustmentFormSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  actionType: z.enum(['RESTOCK', 'DAMAGE', 'ADJUSTMENT', 'RETURN'], {
    message: 'Please select an adjustment reason.',
  }),
  quantity: z.number().int().min(1, 'Quantity must be at least 1 unit.'),
  reason: z.string().trim().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentFormSchema>;
