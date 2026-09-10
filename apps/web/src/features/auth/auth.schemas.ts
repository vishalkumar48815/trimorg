import { z } from 'zod';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.');

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.'),
    businessName: z.string().trim().min(2, 'Business name is required.'),
    email: z.string().trim().email('Enter a valid email address.'),
    mobile: z.string().trim().min(7, 'Enter a valid mobile number.'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(16, 'Reset token is required.'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit OTP.'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
