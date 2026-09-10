import { z } from 'zod';

export const supplierIdSchema = z.object({
  id: z.string().trim().min(1, 'Supplier id is required.'),
});

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, 'Supplier name is required.').max(100),
  contactPerson: z.string().trim().max(100).optional(),
  mobile: z.string().trim().min(7, 'Mobile number must be at least 7 digits.').max(20),
  email: z.string().trim().email('Invalid email address.').optional().or(z.literal('')),
  gst: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const suppliersQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export class SupplierIdDto {
  static schema = supplierIdSchema;
  id!: string;
}

export class CreateSupplierDto {
  static schema = createSupplierSchema;
  name!: string;
  contactPerson?: string;
  mobile!: string;
  email?: string;
  gst?: string;
  address?: string;
}

export class UpdateSupplierDto {
  static schema = updateSupplierSchema;
  name?: string;
  contactPerson?: string;
  mobile?: string;
  email?: string;
  gst?: string;
  address?: string;
}

export class SuppliersQueryDto {
  static schema = suppliersQuerySchema;
  search?: string;
}

export type SupplierIdInput = z.infer<typeof supplierIdSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type SuppliersQueryInput = z.infer<typeof suppliersQuerySchema>;
