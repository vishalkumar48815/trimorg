export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: string;
  currentStock: number;
  reorderLevel: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  category: string;
  sellingPrice: string;
  currentStock: string;
  reorderLevel: string;
  status: string;
}

export interface ProductCreateInput {
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
}

export interface ProductUpdateInput {
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;
  status: string;
}
