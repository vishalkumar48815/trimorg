export interface SupplierListItem {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierDetail extends SupplierListItem {
  purchases?: {
    id: string;
    purchaseNumber: string;
    status: string;
    grandTotal: string;
    createdAt: Date;
  }[];
}
