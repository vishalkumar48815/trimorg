export interface OnboardingOrganization {
  id: string;
  businessName: string | null;
  businessType: string | null;
  ownerName: string | null;
  mobile: string | null;
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

export interface OnboardingStatus {
  hasOrganization: boolean;
  isComplete: boolean;
  currentStep: 1 | 2 | 3 | 4 | 5;
  organization: OnboardingOrganization | null;
}
