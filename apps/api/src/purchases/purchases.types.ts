import type { PurchaseStatus } from '@prisma/client';

export interface PurchaseItemDetail {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: string;
  subtotal: string;
}

export interface PurchaseListItem {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseDetail extends PurchaseListItem {
  items: PurchaseItemDetail[];
}
