import { z } from 'zod';

const businessTypes = [
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

const businessTypeSet = new Set<string>(businessTypes);

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

export const organizationStepSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required.').max(120),
  businessType: z.string().trim().min(2, 'Business type is required.').max(120),
  ownerName: z.string().trim().min(2, 'Owner name is required.').max(120),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.').max(30),
  gst: z.string().trim().max(32).optional().or(z.literal('')),
});

export const addressStepSchema = z.object({
  businessAddress: z.string().trim().min(2, 'Business address is required.').max(160),
  country: z.string().trim().min(2, 'Country is required.').max(100),
  state: z.string().trim().min(2, 'State is required.').max(100),
  city: z.string().trim().min(2, 'City is required.').max(100),
  pincode: z.string().trim().min(2, 'Pincode is required.').max(20),
});

export const preferencesStepSchema = z.object({
  currencyCode: z.string().trim().min(3, 'Currency is required.').max(3),
  timezone: z.string().trim().min(3, 'Timezone is required.').max(100),
  financialYearStartMonth: z.number().int().min(1).max(12),
});

export const logoStepSchema = z.object({
  logoDataUrl: z.string().trim().max(1_000_000).optional().or(z.literal('')),
  logoFileName: z.string().trim().max(255).optional().or(z.literal('')),
  logoMimeType: z.string().trim().max(120).optional().or(z.literal('')),
});

export class BusinessStepDto {
  static schema = businessStepSchema;
  businessName!: string;
  businessType!: string;
}

export class OrganizationStepDto {
  static schema = organizationStepSchema;
  businessName!: string;
  businessType!: string;
  ownerName!: string;
  mobile!: string;
  gst?: string;
}

export class AddressStepDto {
  static schema = addressStepSchema;
  businessAddress!: string;
  country!: string;
  state!: string;
  city!: string;
  pincode!: string;
}

export class PreferencesStepDto {
  static schema = preferencesStepSchema;
  currencyCode!: string;
  timezone!: string;
  financialYearStartMonth!: number;
}

export class LogoStepDto {
  static schema = logoStepSchema;
  logoDataUrl?: string;
  logoFileName?: string;
  logoMimeType?: string;
}

export type OrganizationStepInput = z.infer<typeof organizationStepSchema>;
export type BusinessStepInput = z.infer<typeof businessStepSchema>;
export type AddressStepInput = z.infer<typeof addressStepSchema>;
export type PreferencesStepInput = z.infer<typeof preferencesStepSchema>;
export type LogoStepInput = z.infer<typeof logoStepSchema>;
