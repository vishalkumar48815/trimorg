export interface SupplierRecord {
  id: string;
  name: string;
  contactPerson: string | null;
  mobile: string;
  email: string | null;
  gst: string | null;
  address: string | null;
  outstandingBalance: string;
  totalPurchasesCount: number;
  totalPurchasesAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierDetail extends SupplierRecord {
  purchases?: {
    id: string;
    purchaseNumber: string;
    status: string;
    grandTotal: string;
    createdAt: string;
  }[];
}

export interface SupplierInput {
  name: string;
  contactPerson?: string;
  mobile: string;
  email?: string;
  gst?: string;
  address?: string;
}
