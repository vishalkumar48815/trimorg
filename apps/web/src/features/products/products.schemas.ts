import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required.').max(120),
  sku: z.string().trim().min(1, 'SKU is required.').max(80),
  category: z.string().trim().min(1, 'Category is required.').max(120),
  sellingPrice: z
    .string()
    .trim()
    .min(1, 'Selling price is required.')
    .refine((value) => Number(value) > 0, {
      message: 'Selling price must be greater than zero.',
    }),
  currentStock: z
    .string()
    .trim()
    .refine((value) => Number(value) >= 0, {
      message: 'Opening stock must be zero or greater.',
    }),
  reorderLevel: z
    .string()
    .trim()
    .refine((value) => Number(value) >= 0, {
      message: 'Reorder level must be zero or greater.',
    }),
  status: z.string().trim().min(1, 'Status is required.').max(40),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
