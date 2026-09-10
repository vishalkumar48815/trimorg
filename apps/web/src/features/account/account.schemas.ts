import { z } from 'zod';
import { businessTypeOptions } from '@/features/onboarding/onboarding.schemas';

const businessTypeSet = new Set<string>(businessTypeOptions);
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.');

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.').max(30),
});

export const businessSettingsSchema = z.object({
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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ProfileValues = z.infer<typeof profileSchema>;
export type BusinessSettingsValues = z.infer<typeof businessSettingsSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
