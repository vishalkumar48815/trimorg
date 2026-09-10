export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  category: string;
  sellingPrice: string;
  costPrice: string;
  isService: boolean;
  currentStock: number;
  reorderLevel: number;
  unitType: string;
  taxRate: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
