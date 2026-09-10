import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockUser: RequestUser = {
    id: 'user-1',
    email: 'owner@test.com',
    fullName: 'Owner User',
    mobile: '9999999999',
    role: 'OWNER',
    isEmailVerified: true,
    onboardingCompletedAt: new Date(),
    organizationId: 'org-1',
  };

  const mockPrisma = {
    sale: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    saleItem: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalesReport', () => {
    it('should calculate aggregated sales, taxes, discounts, and payment methods', async () => {
      (mockPrisma.sale.findMany as jest.Mock).mockResolvedValueOnce([
        {
          id: 'sale-1',
          saleNumber: 'INV-101',
          subtotal: 1000,
          discount: 100,
          tax: 180,
          grandTotal: 1080,
          paidAmount: 1080,
          paymentMethod: 'UPI',
          status: 'COMPLETED',
          createdAt: new Date('2026-09-01T10:00:00Z'),
          customer: { name: 'Rohan', mobile: '9999999999' },
          items: [
            {
              quantity: 2,
              subtotal: 1000,
              product: { category: 'Batteries' },
            },
          ],
        },
        {
          id: 'sale-2',
          saleNumber: 'INV-102',
          subtotal: 500,
          discount: 0,
          tax: 90,
          grandTotal: 590,
          paidAmount: 500,
          paymentMethod: 'CASH',
          status: 'COMPLETED',
          createdAt: new Date('2026-09-02T11:00:00Z'),
          customer: { name: 'Pooja', mobile: '8888888888' },
          items: [
            {
              quantity: 1,
              subtotal: 500,
              product: { category: 'Accessories' },
            },
          ],
        },
      ]);

      const result = await service.getSalesReport(mockUser, '2026-09-01', '2026-09-10');

      expect(result.summary.totalSalesCount).toBe(2);
      expect(result.summary.grossSales).toBe(1500);
      expect(result.summary.totalDiscount).toBe(100);
      expect(result.summary.totalTax).toBe(270);
      expect(result.summary.netSales).toBe(1670);
      expect(result.summary.totalPaid).toBe(1580);
      expect(result.summary.totalDue).toBe(90);

      expect(result.paymentBreakdown.length).toBe(2);
      expect(result.categoryBreakdown.length).toBe(2);
      expect(result.dailyTrends.length).toBe(2);
      expect(result.salesList.length).toBe(2);
    });
  });

  describe('getInventoryReport', () => {
    it('should calculate inventory valuations and classify stock velocity', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([
        {
          id: 'p-1',
          name: '48V Battery',
          sku: 'BAT-48V',
          category: 'Batteries',
          costPrice: 8000,
          sellingPrice: 12000,
          currentStock: 5,
          reorderLevel: 2,
          isService: false,
          status: 'ACTIVE',
        },
        {
          id: 'p-2',
          name: 'General Service',
          sku: 'SRV-GEN',
          category: 'Services',
          costPrice: 0,
          sellingPrice: 500,
          currentStock: 0,
          reorderLevel: 0,
          isService: true,
          status: 'ACTIVE',
        },
      ]);

      (mockPrisma.saleItem.groupBy as jest.Mock).mockResolvedValueOnce([
        {
          productId: 'p-1',
          _sum: {
            quantity: 10,
            subtotal: 120000,
          },
        },
      ]);

      const result = await service.getInventoryReport(mockUser);

      expect(result.summary.totalProductsCount).toBe(2);
      expect(result.summary.totalItemsInStock).toBe(5);
      expect(result.summary.totalCostValuation).toBe(40000); // 5 * 8000
      expect(result.summary.totalRetailValuation).toBe(60000); // 5 * 12000
      expect(result.summary.potentialGrossProfit).toBe(20000);
      expect(result.summary.serviceCount).toBe(1);
      expect(result.summary.inStockCount).toBe(1);

      expect(result.velocity.fastMoving.length).toBe(1);
      expect(result.velocity.fastMoving[0].id).toBe('p-1');
    });
  });
});
