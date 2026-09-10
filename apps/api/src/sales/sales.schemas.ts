import { z } from 'zod';

export const createSaleItemSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required.'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1.'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be 0 or greater.'),
  discount: z.coerce.number().min(0, 'Discount must be 0 or greater.').default(0),
});

export const createSaleSchema = z.object({
  customerId: z.string().trim().min(1).optional().nullable(),
  type: z.enum(['INVOICE', 'QUOTATION', 'ORDER']).default('INVOICE'),
  discount: z.coerce.number().min(0, 'Discount must be 0 or greater.').default(0),
  tax: z.coerce.number().min(0, 'Tax must be 0 or greater.').default(0),
  paidAmount: z.coerce.number().min(0, 'Paid amount must be 0 or greater.').default(0),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'CREDIT', 'SPLIT']).default('CASH'),
  vehicleNotes: z.string().trim().max(250).optional().nullable(),
  items: z.array(createSaleItemSchema).min(1, 'At least one item is required in a sale.'),
});

export const saleIdSchema = z.object({
  id: z.string().trim().min(1, 'Sale id is required.'),
});

export const salesQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  type: z.enum(['INVOICE', 'QUOTATION', 'ORDER']).optional(),
  status: z.enum(['DRAFT', 'COMPLETED', 'CANCELLED']).optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type SaleIdInput = z.infer<typeof saleIdSchema>;
export type SalesQueryInput = z.infer<typeof salesQuerySchema>;

export class CreateSaleDto {
  static schema = createSaleSchema;
  customerId?: string | null;
  type!: 'INVOICE' | 'QUOTATION' | 'ORDER';
  discount!: number;
  tax!: number;
  paidAmount!: number;
  paymentMethod!: 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT';
  vehicleNotes?: string | null;
  items!: {
    productId: string;
    quantity: number;
    sellingPrice: number;
    discount: number;
  }[];
}

export class SaleIdDto {
  static schema = saleIdSchema;
  id!: string;
}

export class SalesQueryDto {
  static schema = salesQuerySchema;
  search?: string;
  type?: 'INVOICE' | 'QUOTATION' | 'ORDER';
  status?: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
}
