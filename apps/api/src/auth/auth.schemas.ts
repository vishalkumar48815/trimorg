import { z } from 'zod';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long.');

export const registerSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
  businessName: z.string().trim().min(2, 'Enter a business name.').max(120),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.').max(30),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(16, 'Reset token is required.'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  otp: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit OTP.'),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
});

export class RegisterDto {
  static schema = registerSchema;
  email!: string;
  fullName!: string;
  businessName!: string;
  mobile!: string;
  password!: string;
}

export class LoginDto {
  static schema = loginSchema;
  email!: string;
  password!: string;
}

export class ForgotPasswordDto {
  static schema = forgotPasswordSchema;
  email!: string;
}

export class ResetPasswordDto {
  static schema = resetPasswordSchema;
  token!: string;
  password!: string;
  confirmPassword!: string;
}

export class VerifyEmailDto {
  static schema = verifyEmailSchema;
  email!: string;
  otp!: string;
}

export class ResendOtpDto {
  static schema = resendOtpSchema;
  email!: string;
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
