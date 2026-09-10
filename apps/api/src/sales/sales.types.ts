export interface SaleItemDetail {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: string;
  discount: string;
  subtotal: string;
}

export interface SaleListItem {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDetail extends SaleListItem {
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
}
