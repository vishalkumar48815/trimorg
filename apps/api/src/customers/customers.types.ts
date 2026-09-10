export interface CustomerListItem {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  gst?: string | null;
  address?: string | null;
  vehicleDetails?: string | null;
  totalSalesCount: number;
  totalSpent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerSaleItem {
  id: string;
  saleNumber: string;
  type: string;
  subtotal: string;
  discount: string;
  tax: string;
  grandTotal: string;
  paidAmount: string;
  paymentMethod: string;
  status: string;
  vehicleNotes?: string | null;
  createdAt: Date;
}

export interface CustomerDetail extends CustomerListItem {
  sales: CustomerSaleItem[];
}
