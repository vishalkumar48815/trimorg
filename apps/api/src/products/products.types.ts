export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: string;
  currentStock: number;
  reorderLevel: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
