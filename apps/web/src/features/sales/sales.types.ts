export interface SaleProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;
  currentStock: number;
  status: string;
}

export interface SaleCartItem extends SaleProduct {
  quantity: number;
}
