export type PurchaseStatus = 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseItemDetail {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: string;
  subtotal: string;
}

export interface PurchaseRecord {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  supplierMobile: string;
  supplierInvoiceRef: string | null;
  status: PurchaseStatus;
  subtotal: string;
  tax: string;
  grandTotal: string;
  paidAmount: string;
  notes: string | null;
  itemCount: number;
  items?: PurchaseItemDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseCreateItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseCreateInput {
  supplierId: string;
  supplierInvoiceRef?: string;
  tax?: number;
  paidAmount?: number;
  notes?: string;
  items: PurchaseCreateItemInput[];
}
