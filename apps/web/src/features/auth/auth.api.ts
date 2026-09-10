import { apiRequest } from '@/lib/api';
import type { AuthMutationResult, SessionData } from '@/features/auth/auth.types';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  fullName: string;
  businessName: string;
  mobile: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResendOtpInput {
  email: string;
}

export async function fetchSession(): Promise<SessionData> {
  return apiRequest<SessionData>('/auth/session', { method: 'GET', auth: false });
}

export async function login(input: LoginInput): Promise<SessionData> {
  return apiRequest<SessionData>('/auth/login', {
    method: 'POST',
    body: input,
  });
}

export async function register(input: RegisterInput): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/register', {
    method: 'POST',
    body: input,
  });
}

export async function logout(): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/logout', {
    method: 'POST',
  });
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/forgot-password', {
    method: 'POST',
    body: input,
  });
}

export async function resetPassword(input: ResetPasswordInput): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/reset-password', {
    method: 'POST',
    body: input,
  });
}

export async function verifyEmail(input: VerifyEmailInput): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/verify-email', {
    method: 'POST',
    body: input,
  });
}

export async function resendOtp(input: ResendOtpInput): Promise<AuthMutationResult> {
  return apiRequest<AuthMutationResult>('/auth/resend-otp', {
    method: 'POST',
    body: input,
  });
}

export async function refreshSession(): Promise<SessionData> {
  return apiRequest<SessionData>('/auth/refresh', {
    method: 'POST',
  });
}
