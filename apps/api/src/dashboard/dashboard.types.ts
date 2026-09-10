export interface DashboardRecentSale {
  id: string;
  saleNumber: string;
  customerName: string;
  grandTotal: number;
  paymentMethod: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface DashboardTopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface DashboardDailyTrend {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface DashboardMetricsResponse {
  todayRevenue: number;
  todaySalesCount: number;
  totalRevenue: number;
  totalInvoicesCount: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  totalProductsCount: number;
  totalCustomersCount: number;
  recentSales: DashboardRecentSale[];
  topSellingProducts: DashboardTopProduct[];
  revenueTrend: DashboardDailyTrend[];
}
