import type { Organization, User, UserRole } from '@prisma/client';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingCompletedAt: Date | null;
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
  status: string;
  onboardingCompletedAt: Date | null;
}

export interface SessionPayload {
  user: SessionUser;
  organization: SessionOrganization | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends SessionPayload {
  tokens: TokenPair;
}

export type UserRecord = User & {
  organization: Organization | null;
};
