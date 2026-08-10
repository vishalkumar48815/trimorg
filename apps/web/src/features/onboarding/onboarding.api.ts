import { apiRequest } from '@/lib/api';
import type { OnboardingStatus } from '@/features/onboarding/onboarding.types';

export interface BusinessStepInput {
  businessName: string;
  businessType: string;
}

export interface OrganizationStepInput {
  businessName: string;
  businessType: string;
  ownerName: string;
  mobile: string;
  gst?: string;
}

export interface AddressStepInput {
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
}

export interface PreferencesStepInput {
  currencyCode: string;
  timezone: string;
  financialYearStartMonth: number;
}

export interface LogoStepInput {
  logoDataUrl?: string;
  logoFileName?: string;
  logoMimeType?: string;
}

export async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/current', { method: 'GET', auth: true });
}

export async function saveBusinessStep(input: BusinessStepInput): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/business', {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function saveOrganizationStep(input: OrganizationStepInput): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/organization', {
    method: 'POST',
    body: input,
    auth: true,
  });
}

export async function saveAddressStep(input: AddressStepInput): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/address', {
    method: 'PATCH',
    body: input,
    auth: true,
  });
}

export async function savePreferencesStep(input: PreferencesStepInput): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/preferences', {
    method: 'PUT',
    body: input,
    auth: true,
  });
}

export async function saveLogoStep(input: LogoStepInput): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/logo', {
    method: 'PUT',
    body: input,
    auth: true,
  });
}

export async function completeOnboarding(): Promise<OnboardingStatus> {
  return apiRequest<OnboardingStatus>('/onboarding/complete', {
    method: 'POST',
    auth: true,
  });
}
