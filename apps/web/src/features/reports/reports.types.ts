export interface SalesReportSummary {
  totalSalesCount: number;
  grossSales: number;
  totalDiscount: number;
  totalTax: number;
  netSales: number;
  totalPaid: number;
  totalDue: number;
}

export interface PaymentBreakdown {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  units: number;
}

export interface DailySalesTrend {
  date: string;
  revenue: number;
  invoicesCount: number;
  tax: number;
}

export interface SalesReportSaleItem {
  id: string;
  saleNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  itemsCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  paymentMethod: string;
  status: string;
}

export interface SalesReportResponse {
  startDate: string;
  endDate: string;
  summary: SalesReportSummary;
  paymentBreakdown: PaymentBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
  dailyTrends: DailySalesTrend[];
  salesList: SalesReportSaleItem[];
}

export interface InventoryReportSummary {
  totalProductsCount: number;
  totalItemsInStock: number;
  totalCostValuation: number;
  totalRetailValuation: number;
  potentialGrossProfit: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  serviceCount: number;
}

export interface CategoryInventoryValuation {
  category: string;
  productCount: number;
  totalStock: number;
  costValue: number;
  retailValue: number;
}

export interface ProductVelocityItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  unitsSold: number;
  totalRevenue: number;
}

export interface InventoryReportProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  costValue: number;
  retailValue: number;
  status: string;
  isService: boolean;
}

export interface InventoryReportResponse {
  summary: InventoryReportSummary;
  categoryValuation: CategoryInventoryValuation[];
  velocity: {
    fastMoving: ProductVelocityItem[];
    slowMoving: ProductVelocityItem[];
  };
  items: InventoryReportProductItem[];
}
