import { z } from 'zod';

export const purchaseLineItemSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  unitCost: z.number().min(0, 'Cost must be 0 or greater.'),
});

export const purchaseOrderFormSchema = z.object({
  supplierId: z.string().min(1, 'Please select a supplier.'),
  supplierInvoiceRef: z.string().trim().max(100).optional().or(z.literal('')),
  tax: z.number().min(0),
  paidAmount: z.number().min(0),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
  items: z.array(purchaseLineItemSchema).min(1, 'Add at least one line item to the purchase order.'),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;
