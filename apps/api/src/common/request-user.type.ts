import type { UserRole } from '@prisma/client';

export interface RequestUser {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingCompletedAt: Date | null;
  organizationId: string | null;
}
