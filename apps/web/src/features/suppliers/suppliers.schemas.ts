import { z } from 'zod';

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, 'Supplier name is required.').max(100),
  contactPerson: z.string().trim().max(100).optional().or(z.literal('')),
  mobile: z.string().trim().min(7, 'Mobile must be at least 7 digits.').max(20),
  email: z.string().trim().email('Invalid email address.').optional().or(z.literal('')),
  gst: z.string().trim().max(20).optional().or(z.literal('')),
  address: z.string().trim().max(500).optional().or(z.literal('')),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
