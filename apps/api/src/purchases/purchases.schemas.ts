import { z } from 'zod';

export const purchaseIdSchema = z.object({
  id: z.string().trim().min(1, 'Purchase ID is required.'),
});

export const createPurchaseItemSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required.'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
  unitCost: z.coerce.number().min(0, 'Unit cost must be zero or greater.'),
});

export const createPurchaseSchema = z.object({
  supplierId: z.string().trim().min(1, 'Supplier is required.'),
  supplierInvoiceRef: z.string().trim().max(100).optional(),
  tax: z.coerce.number().min(0).default(0).optional(),
  paidAmount: z.coerce.number().min(0).optional(),
  notes: z.string().trim().max(500).optional(),
  items: z.array(createPurchaseItemSchema).min(1, 'At least one line item is required.'),
});

export const purchasesQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['ORDERED', 'RECEIVED', 'CANCELLED']).optional(),
  supplierId: z.string().trim().optional(),
});

export class PurchaseIdDto {
  static schema = purchaseIdSchema;
  id!: string;
}

export class CreatePurchaseDto {
  static schema = createPurchaseSchema;
  supplierId!: string;
  supplierInvoiceRef?: string;
  tax?: number;
  paidAmount?: number;
  notes?: string;
  items!: {
    productId: string;
    quantity: number;
    unitCost: number;
  }[];
}

export class PurchasesQueryDto {
  static schema = purchasesQuerySchema;
  search?: string;
  status?: 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  supplierId?: string;
}

export type PurchaseIdInput = z.infer<typeof purchaseIdSchema>;
export type CreatePurchaseItemInput = z.infer<typeof createPurchaseItemSchema>;
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type PurchasesQueryInput = z.infer<typeof purchasesQuerySchema>;
