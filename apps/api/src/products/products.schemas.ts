import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required.').max(120),
  sku: z.string().trim().min(1, 'SKU is required.').max(80),
  barcode: z.string().trim().max(80).optional(),
  category: z.string().trim().min(1, 'Category is required.').max(120),
  sellingPrice: z.coerce.number().positive('Selling price must be greater than zero.'),
  costPrice: z.coerce.number().min(0, 'Cost price must be zero or greater.').default(0),
  isService: z.boolean().default(false),
  currentStock: z.coerce.number().int().min(0, 'Opening stock must be zero or greater.').default(0),
  reorderLevel: z.coerce.number().int().min(0, 'Reorder level must be zero or greater.').default(0),
  unitType: z.string().trim().min(1).max(20).default('PCS'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
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
    barcode: z.string().trim().max(80).optional(),
    category: z.string().trim().min(1, 'Category is required.').max(120).optional(),
    sellingPrice: z.coerce.number().positive('Selling price must be greater than zero.').optional(),
    costPrice: z.coerce.number().min(0).optional(),
    isService: z.boolean().optional(),
    unitType: z.string().trim().min(1).max(20).optional(),
    taxRate: z.coerce.number().min(0).max(100).optional(),
    status: z.string().trim().min(1, 'Status is required.').max(40).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update.',
  });

export class CreateProductDto {
  static schema = createProductSchema;
  name!: string;
  sku!: string;
  barcode?: string;
  category!: string;
  sellingPrice!: number;
  costPrice!: number;
  isService!: boolean;
  currentStock!: number;
  reorderLevel!: number;
  unitType!: string;
  taxRate!: number;
}

export class ProductIdDto {
  static schema = productIdSchema;
  id!: string;
}

export class UpdateProductDto {
  static schema = updateProductSchema;
  name?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  sellingPrice?: number;
  costPrice?: number;
  isService?: boolean;
  unitType?: string;
  taxRate?: number;
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
