export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingCompletedAt: string | null;
  organizationId: string | null;
}

export interface SessionOrganization {
  id: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  mobile: string;
  gst: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  currencyCode: string | null;
  timezone: string | null;
  financialYearStartMonth: number | null;
  logoUrl: string | null;
  logoMimeType: string | null;
  logoFileName: string | null;
  status: 'DRAFT' | 'ACTIVE';
  onboardingCompletedAt: string | null;
}

export interface SessionData {
  user: SessionUser;
  organization: SessionOrganization | null;
}

export interface AuthMutationResult {
  message?: string;
  requiresVerification?: boolean;
}

export interface AuthResponse<T> {
  data: T;
  success: boolean;
}
