import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type { DashboardDailyTrend, DashboardMetricsResponse, DashboardRecentSale, DashboardTopProduct } from './dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(user: RequestUser): Promise<DashboardMetricsResponse> {
    const organizationId = this.requireOrganizationId(user);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // 7 days ago start
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);

    const [
      todaySales,
      allCompletedSales,
      invoicesCount,
      pendingPurchasesCount,
      products,
      customersCount,
      recentSalesRecords,
      saleItemsSummary,
      sevenDaySales,
    ] = await Promise.all([
      // Today sales (completed)
      this.prisma.sale.findMany({
        where: {
          organizationId,
          status: 'COMPLETED',
          type: { in: ['INVOICE', 'ORDER'] },
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        select: {
          grandTotal: true,
        },
      }),

      // All-time completed sales total
      this.prisma.sale.aggregate({
        where: {
          organizationId,
          status: 'COMPLETED',
          type: { in: ['INVOICE', 'ORDER'] },
        },
        _sum: {
          grandTotal: true,
        },
      }),

      // Total invoice count
      this.prisma.sale.count({
        where: {
          organizationId,
          type: 'INVOICE',
        },
      }),

      // Pending purchases (status: ORDERED)
      this.prisma.purchase.count({
        where: {
          organizationId,
          status: 'ORDERED',
        },
      }),

      // All active products to compute low stock count
      this.prisma.product.findMany({
        where: {
          organizationId,
          status: 'ACTIVE',
          isService: false,
        },
        select: {
          id: true,
          currentStock: true,
          reorderLevel: true,
        },
      }),

      // Total customers count
      this.prisma.customer.count({
        where: {
          organizationId,
        },
      }),

      // 5 most recent sales
      this.prisma.sale.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Top selling products (aggregated from sale items)
      this.prisma.saleItem.groupBy({
        by: ['productId', 'productName'],
        where: {
          sale: {
            organizationId,
            status: 'COMPLETED',
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            subtotal: 'desc',
          },
        },
        take: 5,
      }),

      // 7-day sales for trend
      this.prisma.sale.findMany({
        where: {
          organizationId,
          status: 'COMPLETED',
          type: { in: ['INVOICE', 'ORDER'] },
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          grandTotal: true,
          createdAt: true,
        },
      }),
    ]);

    const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.grandTotal), 0);
    const todaySalesCount = todaySales.length;
    const totalRevenue = Number(allCompletedSales._sum.grandTotal ?? 0);
    const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;
    const totalProductsCount = products.length;

    const recentSales: DashboardRecentSale[] = recentSalesRecords.map((s) => ({
      id: s.id,
      saleNumber: s.saleNumber,
      customerName: s.customer?.name ?? 'Walk-in Customer',
      grandTotal: Number(s.grandTotal),
      paymentMethod: s.paymentMethod,
      status: s.status,
      type: s.type,
      createdAt: s.createdAt.toISOString(),
    }));

    const topSellingProducts: DashboardTopProduct[] = saleItemsSummary.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitsSold: item._sum.quantity ?? 0,
      totalRevenue: Number(item._sum.subtotal ?? 0),
    }));

    // Generate 7-day buckets
    const trendMap = new Map<string, { revenue: number; count: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      trendMap.set(key, { revenue: 0, count: 0 });
    }

    for (const sale of sevenDaySales) {
      const key = sale.createdAt.toISOString().split('T')[0];
      const entry = trendMap.get(key);
      if (entry) {
        entry.revenue += Number(sale.grandTotal);
        entry.count += 1;
      }
    }

    const revenueTrend: DashboardDailyTrend[] = Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      revenue: Number(data.revenue.toFixed(2)),
      orderCount: data.count,
    }));

    return {
      todayRevenue: Number(todayRevenue.toFixed(2)),
      todaySalesCount,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalInvoicesCount: invoicesCount,
      pendingOrdersCount: pendingPurchasesCount,
      lowStockCount,
      totalProductsCount,
      totalCustomersCount: customersCount,
      recentSales,
      topSellingProducts,
      revenueTrend,
    };
  }

  private requireOrganizationId(user: RequestUser): string {
    if (!user.organizationId) {
      throw new BadRequestException({
        code: 'OrganizationRequired',
        message: 'Organization is required.',
      });
    }

    return user.organizationId;
  }
}
