import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required.').max(120),
  mobile: z.string().trim().min(7, 'Valid mobile number is required.').max(20),
  email: z.string().trim().email('Invalid email address.').max(120).optional().or(z.literal('')),
  gst: z.string().trim().max(30).optional().or(z.literal('')),
  address: z.string().trim().max(250).optional().or(z.literal('')),
  vehicleDetails: z.string().trim().max(150).optional().or(z.literal('')),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
