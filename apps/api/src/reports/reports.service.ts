import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  CategoryBreakdown,
  CategoryInventoryValuation,
  DailySalesTrend,
  InventoryReportProductItem,
  InventoryReportResponse,
  PaymentBreakdown,
  ProductVelocityItem,
  SalesReportResponse,
  SalesReportSaleItem,
} from './reports.types';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalesReport(
    user: RequestUser,
    startDateStr?: string,
    endDateStr?: string,
  ): Promise<SalesReportResponse> {
    const organizationId = this.requireOrganizationId(user);
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (startDateStr) {
      const parts = startDateStr.split('-').map(Number);
      startDate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    if (endDateStr) {
      const parts = endDateStr.split('-').map(Number);
      endDate = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
    } else {
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }

    const sales = await this.prisma.sale.findMany({
      where: {
        organizationId,
        status: 'COMPLETED',
        type: { in: ['INVOICE', 'ORDER'] },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            mobile: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let grossSales = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let netSales = 0;
    let totalPaid = 0;

    const paymentMap = new Map<string, { amount: number; count: number }>();
    const categoryMap = new Map<string, { amount: number; units: number }>();
    const dailyMap = new Map<string, { revenue: number; count: number; tax: number }>();

    const salesList: SalesReportSaleItem[] = [];

    for (const sale of sales) {
      const gTotal = Number(sale.grandTotal);
      const sub = Number(sale.subtotal);
      const disc = Number(sale.discount);
      const tx = Number(sale.tax);
      const paid = Number(sale.paidAmount);

      grossSales += sub;
      totalDiscount += disc;
      totalTax += tx;
      netSales += gTotal;
      totalPaid += paid;

      // Payment Breakdown
      const method = sale.paymentMethod || 'CASH';
      const existingPay = paymentMap.get(method) ?? { amount: 0, count: 0 };
      existingPay.amount += gTotal;
      existingPay.count += 1;
      paymentMap.set(method, existingPay);

      // Category breakdown
      for (const item of sale.items) {
        const cat = item.product?.category || 'General';
        const existingCat = categoryMap.get(cat) ?? { amount: 0, units: 0 };
        existingCat.amount += Number(item.subtotal);
        existingCat.units += item.quantity;
        categoryMap.set(cat, existingCat);
      }

      // Daily trends
      const dayKey = sale.createdAt.toISOString().split('T')[0];
      const existingDay = dailyMap.get(dayKey) ?? { revenue: 0, count: 0, tax: 0 };
      existingDay.revenue += gTotal;
      existingDay.count += 1;
      existingDay.tax += tx;
      dailyMap.set(dayKey, existingDay);

      salesList.push({
        id: sale.id,
        saleNumber: sale.saleNumber,
        date: sale.createdAt.toISOString().split('T')[0],
        customerName: sale.customer?.name ?? 'Walk-in Customer',
        customerPhone: sale.customer?.mobile,
        itemsCount: sale.items.length,
        subtotal: sub,
        discount: disc,
        tax: tx,
        grandTotal: gTotal,
        paidAmount: paid,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
      });
    }

    const totalDue = Math.max(0, netSales - totalPaid);

    const paymentBreakdown: PaymentBreakdown[] = Array.from(paymentMap.entries()).map(
      ([method, data]) => ({
        method,
        amount: Number(data.amount.toFixed(2)),
        count: data.count,
        percentage: netSales > 0 ? Number(((data.amount / netSales) * 100).toFixed(1)) : 0,
      }),
    );

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
      ([category, data]) => ({
        category,
        amount: Number(data.amount.toFixed(2)),
        units: data.units,
      }),
    );

    const dailyTrends: DailySalesTrend[] = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        revenue: Number(data.revenue.toFixed(2)),
        invoicesCount: data.count,
        tax: Number(data.tax.toFixed(2)),
      }));

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      summary: {
        totalSalesCount: sales.length,
        grossSales: Number(grossSales.toFixed(2)),
        totalDiscount: Number(totalDiscount.toFixed(2)),
        totalTax: Number(totalTax.toFixed(2)),
        netSales: Number(netSales.toFixed(2)),
        totalPaid: Number(totalPaid.toFixed(2)),
        totalDue: Number(totalDue.toFixed(2)),
      },
      paymentBreakdown,
      categoryBreakdown,
      dailyTrends,
      salesList,
    };
  }

  async getInventoryReport(user: RequestUser): Promise<InventoryReportResponse> {
    const organizationId = this.requireOrganizationId(user);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [products, recentSaleItems] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          organizationId,
          status: 'ACTIVE',
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.saleItem.groupBy({
        by: ['productId'],
        where: {
          sale: {
            organizationId,
            status: 'COMPLETED',
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
      }),
    ]);

    const salesVelocityMap = new Map<string, { unitsSold: number; revenue: number }>();
    for (const item of recentSaleItems) {
      salesVelocityMap.set(item.productId, {
        unitsSold: item._sum.quantity ?? 0,
        revenue: Number(item._sum.subtotal ?? 0),
      });
    }

    let totalItemsInStock = 0;
    let totalCostValuation = 0;
    let totalRetailValuation = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let serviceCount = 0;

    const catMap = new Map<string, { productCount: number; totalStock: number; costVal: number; retailVal: number }>();
    const items: InventoryReportProductItem[] = [];
    const velocityList: ProductVelocityItem[] = [];

    for (const p of products) {
      const stock = p.currentStock;
      const cost = Number(p.costPrice);
      const retail = Number(p.sellingPrice);
      const costVal = p.isService ? 0 : stock * cost;
      const retailVal = p.isService ? 0 : stock * retail;

      if (p.isService) {
        serviceCount += 1;
      } else {
        totalItemsInStock += stock;
        totalCostValuation += costVal;
        totalRetailValuation += retailVal;

        if (stock <= 0) {
          outOfStockCount += 1;
        } else if (stock <= p.reorderLevel) {
          lowStockCount += 1;
        } else {
          inStockCount += 1;
        }

        const cat = p.category || 'General';
        const existingCat = catMap.get(cat) ?? { productCount: 0, totalStock: 0, costVal: 0, retailVal: 0 };
        existingCat.productCount += 1;
        existingCat.totalStock += stock;
        existingCat.costVal += costVal;
        existingCat.retailVal += retailVal;
        catMap.set(cat, existingCat);
      }

      items.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        costPrice: cost,
        sellingPrice: retail,
        currentStock: stock,
        reorderLevel: p.reorderLevel,
        costValue: Number(costVal.toFixed(2)),
        retailValue: Number(retailVal.toFixed(2)),
        status: p.status,
        isService: p.isService,
      });

      const vel = salesVelocityMap.get(p.id) ?? { unitsSold: 0, revenue: 0 };
      velocityList.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        currentStock: stock,
        unitsSold: vel.unitsSold,
        totalRevenue: vel.revenue,
      });
    }

    const categoryValuation: CategoryInventoryValuation[] = Array.from(catMap.entries()).map(
      ([category, data]) => ({
        category,
        productCount: data.productCount,
        totalStock: data.totalStock,
        costValue: Number(data.costVal.toFixed(2)),
        retailValue: Number(data.retailVal.toFixed(2)),
      }),
    );

    // Fast moving vs slow moving items
    const fastMoving = [...velocityList]
      .filter((v) => v.unitsSold > 0)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const slowMoving = [...velocityList]
      .filter((v) => v.currentStock > 0 && v.unitsSold === 0)
      .slice(0, 5);

    return {
      summary: {
        totalProductsCount: products.length,
        totalItemsInStock,
        totalCostValuation: Number(totalCostValuation.toFixed(2)),
        totalRetailValuation: Number(totalRetailValuation.toFixed(2)),
        potentialGrossProfit: Number((totalRetailValuation - totalCostValuation).toFixed(2)),
        inStockCount,
        lowStockCount,
        outOfStockCount,
        serviceCount,
      },
      categoryValuation,
      velocity: {
        fastMoving,
        slowMoving,
      },
      items,
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
