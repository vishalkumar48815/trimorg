export interface CustomerRecord {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  gst?: string | null;
  address?: string | null;
  vehicleDetails?: string | null;
  totalSalesCount?: number;
  totalSpent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormValues {
  name: string;
  mobile: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

export interface CustomerCreateInput {
  name: string;
  mobile: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

export interface CustomerUpdateInput {
  name?: string;
  mobile?: string;
  email?: string;
  gst?: string;
  address?: string;
  vehicleDetails?: string;
}

export interface CustomerSaleRecord {
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
  createdAt: string;
}

export interface CustomerDetailRecord extends CustomerRecord {
  sales: CustomerSaleRecord[];
}
