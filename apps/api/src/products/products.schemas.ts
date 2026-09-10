import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required.').max(120),
  sku: z.string().trim().min(1, 'SKU is required.').max(80),
  category: z.string().trim().min(1, 'Category is required.').max(120),
  sellingPrice: z.coerce.number().positive('Selling price must be greater than zero.'),
  currentStock: z.coerce.number().int().min(0, 'Opening stock must be zero or greater.').default(0),
  reorderLevel: z.coerce.number().int().min(0, 'Reorder level must be zero or greater.').default(0),
});

export const productIdSchema = z.object({
  id: z.string().trim().min(1, 'Product id is required.'),
});

export const productsQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required.').max(120).optional(),
    sku: z.string().trim().min(1, 'SKU is required.').max(80).optional(),
    category: z.string().trim().min(1, 'Category is required.').max(120).optional(),
    sellingPrice: z.coerce.number().positive('Selling price must be greater than zero.').optional(),
    status: z.string().trim().min(1, 'Status is required.').max(40).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update.',
  });

export class CreateProductDto {
  static schema = createProductSchema;
  name!: string;
  sku!: string;
  category!: string;
  sellingPrice!: number;
  currentStock!: number;
  reorderLevel!: number;
}

export class ProductIdDto {
  static schema = productIdSchema;
  id!: string;
}

export class UpdateProductDto {
  static schema = updateProductSchema;
  name?: string;
  sku?: string;
  category?: string;
  sellingPrice?: number;
  status?: string;
}

export class ProductsQueryDto {
  static schema = productsQuerySchema;
  search?: string;
}

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductsQueryInput = z.infer<typeof productsQuerySchema>;
