export interface SaleProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  category: string;
  sellingPrice: number;
  costPrice?: number;
  isService: boolean;
  currentStock: number;
  unitType?: string;
  taxRate?: number;
  status: string;
}

export interface SaleCartItem extends SaleProduct {
  quantity: number;
  discount?: number;
}

export interface SaleCustomer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  gst?: string | null;
  address?: string | null;
  vehicleDetails?: string | null;
}

export interface CreateSaleItemPayload {
  productId: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
}

export interface CreateSalePayload {
  customerId?: string | null;
  type?: 'INVOICE' | 'QUOTATION' | 'ORDER';
  discount?: number;
  tax?: number;
  paidAmount?: number;
  paymentMethod?: 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT';
  vehicleNotes?: string | null;
  items: CreateSaleItemPayload[];
}

export interface SaleItemDetail {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: string;
  discount: string;
  subtotal: string;
}

export interface SaleRecord {
  id: string;
  saleNumber: string;
  type: string;
  customerId?: string | null;
  customerName?: string | null;
  customerMobile?: string | null;
  subtotal: string;
  discount: string;
  tax: string;
  grandTotal: string;
  paidAmount: string;
  paymentMethod: string;
  status: string;
  vehicleNotes?: string | null;
  itemCount: number;
  items: SaleItemDetail[];
  organization?: {
    businessName: string;
    ownerName: string;
    mobile: string;
    gst?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    currencyCode?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
