export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF';

export interface TeamMember {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface CreateTeamMemberPayload {
  fullName: string;
  email: string;
  mobile: string;
  role: 'ADMIN' | 'STAFF';
  password: string;
}

export interface StorePreferences {
  invoicePrefix: string;
  quotationPrefix: string;
  purchasePrefix: string;
  receiptPaperWidth: '80MM' | '58MM' | 'A4';
  defaultTaxRate: number;
  financialYearStartMonth: number;
  currencyCode: string;
}

export interface UpdatePreferencesPayload {
  invoicePrefix: string;
  quotationPrefix: string;
  purchasePrefix: string;
  receiptPaperWidth: '80MM' | '58MM' | 'A4';
  defaultTaxRate: number;
  financialYearStartMonth: number;
  currencyCode: string;
}
