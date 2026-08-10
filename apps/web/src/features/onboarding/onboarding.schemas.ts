import { z } from 'zod';

export const businessTypeOptions = [
  'Grocery Store',
  'Electrical Shop',
  'Hardware Store',
  'Mobile Shop',
  'Pharmacy',
  'Cosmetics',
  'Restaurant',
  'Distributor',
  'Wholesaler',
  'Other',
] as const;

const businessTypeSet = new Set<string>(businessTypeOptions);

export const businessStepSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required.').max(120),
  businessType: z
    .string()
    .trim()
    .min(1, 'Business type is required.')
    .refine((value) => businessTypeSet.has(value), {
      message: 'Business type is required.',
    }),
});

export const addressStepSchema = z.object({
  businessAddress: z.string().trim().min(2, 'Business address is required.').max(160),
  country: z.string().trim().min(2, 'Country is required.').max(100),
  state: z.string().trim().min(2, 'State is required.').max(100),
  city: z.string().trim().min(2, 'City is required.').max(100),
  pincode: z.string().trim().min(2, 'Pincode is required.').max(20),
});

export const organizationStepSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required.'),
  businessType: z.string().trim().min(2, 'Business type is required.'),
  ownerName: z.string().trim().min(2, 'Owner name is required.'),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.'),
  gst: z.string().trim().optional().or(z.literal('')),
});

export const preferencesStepSchema = z.object({
  currencyCode: z.string().trim().min(3, 'Currency is required.'),
  timezone: z.string().trim().min(2, 'Timezone is required.'),
  financialYearStartMonth: z.number().int().min(1).max(12),
});

export const logoStepSchema = z.object({
  logoDataUrl: z.string().trim().optional().or(z.literal('')),
  logoFileName: z.string().trim().optional().or(z.literal('')),
  logoMimeType: z.string().trim().optional().or(z.literal('')),
});

export type BusinessStepValues = z.infer<typeof businessStepSchema>;
export type AddressStepValues = z.infer<typeof addressStepSchema>;
export type OrganizationStepValues = z.infer<typeof organizationStepSchema>;
export type PreferencesStepValues = z.infer<typeof preferencesStepSchema>;
export type LogoStepValues = z.infer<typeof logoStepSchema>;
