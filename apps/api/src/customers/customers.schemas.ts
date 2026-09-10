import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required.').max(120),
  mobile: z.string().trim().min(7, 'Valid mobile number is required.').max(20),
  email: z.string().trim().email('Invalid email address.').max(120).optional().or(z.literal('')),
  gst: z.string().trim().max(30).optional().or(z.literal('')),
  address: z.string().trim().max(250).optional().or(z.literal('')),
  vehicleDetails: z.string().trim().max(150).optional().or(z.literal('')),
});

export const updateCustomerSchema = z
  .object({
    name: z.string().trim().min(1, 'Customer name is required.').max(120).optional(),
    mobile: z.string().trim().min(7, 'Valid mobile number is required.').max(20).optional(),
    email: z.string().trim().email('Invalid email address.').max(120).optional().or(z.literal('')),
    gst: z.string().trim().max(30).optional().or(z.literal('')),
    address: z.string().trim().max(250).optional().or(z.literal('')),
    vehicleDetails: z.string().trim().max(150).optional().or(z.literal('')),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update.',
  });

export const customerIdSchema = z.object({
  id: z.string().trim().min(1, 'Customer id is required.'),
});

export const customersQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});

export class CreateCustomerDto {
  static schema = createCustomerSchema;
  name!: string;
  mobile!: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

export class UpdateCustomerDto {
  static schema = updateCustomerSchema;
  name?: string;
  mobile?: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

export class CustomerIdDto {
  static schema = customerIdSchema;
  id!: string;
}

export class CustomersQueryDto {
  static schema = customersQuerySchema;
  search?: string;
}

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerIdInput = z.infer<typeof customerIdSchema>;
export type CustomersQueryInput = z.infer<typeof customersQuerySchema>;
