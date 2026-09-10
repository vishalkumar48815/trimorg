import { apiRequest } from '@/lib/api';
import type { OrganizationProfile, UserProfile } from '@/features/account/account.types';
import type {
  BusinessSettingsValues,
  ChangePasswordValues,
  ProfileValues,
} from '@/features/account/account.schemas';

export async function fetchProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', { method: 'GET', auth: true });
}

export async function updateProfile(input: ProfileValues): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function fetchOrganizationProfile(): Promise<OrganizationProfile> {
  return apiRequest<OrganizationProfile>('/organization', { method: 'GET', auth: true });
}

export async function updateOrganizationProfile(
  input: BusinessSettingsValues,
): Promise<OrganizationProfile> {
  return apiRequest<OrganizationProfile>('/organization', {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function changePassword(input: ChangePasswordValues): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: input,
    auth: true,
  });
}
