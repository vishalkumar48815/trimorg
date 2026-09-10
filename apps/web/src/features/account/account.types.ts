export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
}

export interface OrganizationProfile {
  id: string;
  businessName: string;
  businessType: string;
  gst: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  currencyCode: string | null;
  timezone: string | null;
  logoUrl: string | null;
  logoFileName: string | null;
  logoMimeType: string | null;
}
