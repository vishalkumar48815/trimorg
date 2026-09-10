import { apiRequest } from '@/lib/api';
import type {
  CreateTeamMemberPayload,
  StorePreferences,
  TeamMember,
  UpdatePreferencesPayload,
} from './settings.types';

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  return apiRequest<TeamMember[]>('/users/team', {
    method: 'GET',
    auth: true,
  });
}

export async function createTeamMember(payload: CreateTeamMemberPayload): Promise<TeamMember> {
  return apiRequest<TeamMember>('/users/team', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export async function updateTeamMemberRole(
  id: string,
  role: 'ADMIN' | 'STAFF',
): Promise<TeamMember> {
  return apiRequest<TeamMember>(`/users/team/${id}/role`, {
    method: 'PATCH',
    auth: true,
    body: { role },
  });
}

export async function deleteTeamMember(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/users/team/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchStorePreferences(): Promise<StorePreferences> {
  return apiRequest<StorePreferences>('/organization/preferences', {
    method: 'GET',
    auth: true,
  });
}

export async function updateStorePreferences(
  payload: UpdatePreferencesPayload,
): Promise<StorePreferences> {
  return apiRequest<StorePreferences>('/organization/preferences', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}
