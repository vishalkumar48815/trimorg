import type { StockMovementType } from '@prisma/client';
import type { ProductListItem } from '../products/products.types';

export interface StockMovementListItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: StockMovementType;
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  referenceId: string | null;
  reason: string | null;
  createdAt: Date;
}

export interface InventorySummary {
  totalItemsCount: number;
  totalValuationCost: string;
  totalValuationRetail: string;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalMovementsCount: number;
}

export interface AdjustStockResult {
  product: ProductListItem;
  movement: StockMovementListItem;
}
