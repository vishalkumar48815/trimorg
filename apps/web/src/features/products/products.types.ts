export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  category: string;
  sellingPrice: string;
  costPrice?: string;
  isService?: boolean;
  currentStock: number;
  reorderLevel: number;
  unitType?: string;
  taxRate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  sellingPrice: string;
  costPrice?: string;
  isService?: boolean;
  currentStock: string;
  reorderLevel: string;
  unitType?: string;
  taxRate?: string;
  status: string;
}

export interface ProductCreateInput {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  sellingPrice: number;
  costPrice?: number;
  isService?: boolean;
  currentStock: number;
  reorderLevel: number;
  unitType?: string;
  taxRate?: number;
}

export interface ProductUpdateInput {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  sellingPrice: number;
  costPrice?: number;
  isService?: boolean;
  unitType?: string;
  taxRate?: number;
  status: string;
}
