import { z } from 'zod';
import { businessTypeOptions } from '../onboarding/onboarding.schemas';

const businessTypeSet = new Set<string>(businessTypeOptions);

export const updateOrganizationSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required.').max(120),
  businessType: z
    .string()
    .trim()
    .min(1, 'Business type is required.')
    .refine((value) => businessTypeSet.has(value), {
      message: 'Business type is required.',
    }),
  gst: z.string().trim().max(20).optional().or(z.literal('')),
  addressLine1: z.string().trim().min(2, 'Address line 1 is required.').max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required.').max(100),
  state: z.string().trim().min(2, 'State is required.').max(100),
  postalCode: z.string().trim().min(2, 'Pincode is required.').max(20),
  country: z.string().trim().min(2, 'Country is required.').max(100),
  currencyCode: z.string().trim().min(3, 'Currency is required.').max(3),
  timezone: z.string().trim().min(2, 'Timezone is required.'),
  logoDataUrl: z.string().trim().optional().or(z.literal('')),
  logoFileName: z.string().trim().max(200).optional().or(z.literal('')),
  logoMimeType: z.string().trim().max(100).optional().or(z.literal('')),
});

export class UpdateOrganizationDto {
  static schema = updateOrganizationSchema;
  businessName!: string;
  businessType!: string;
  gst?: string;
  addressLine1!: string;
  addressLine2?: string;
  city!: string;
  state!: string;
  postalCode!: string;
  country!: string;
  currencyCode!: string;
  timezone!: string;
  logoDataUrl?: string;
  logoFileName?: string;
  logoMimeType?: string;
}

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
