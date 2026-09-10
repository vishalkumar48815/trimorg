import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

describe('DashboardService', () => {
  let service: DashboardService;

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
      aggregate: jest.fn(),
      count: jest.fn(),
    },
    purchase: {
      count: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    customer: {
      count: jest.fn(),
    },
    saleItem: {
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return aggregated dashboard metrics', async () => {
    (mockPrisma.sale.findMany as jest.Mock)
      .mockResolvedValueOnce([{ grandTotal: 250 }]) // todaySales
      .mockResolvedValueOnce([ // recentSales
        {
          id: 's-1',
          saleNumber: 'INV-1001',
          customer: { name: 'Alice' },
          grandTotal: 250,
          paymentMethod: 'UPI',
          status: 'COMPLETED',
          type: 'INVOICE',
          createdAt: new Date(),
        },
      ])
      .mockResolvedValueOnce([ // sevenDaySales
        { grandTotal: 250, createdAt: new Date() },
      ]);

    (mockPrisma.sale.aggregate as jest.Mock).mockResolvedValueOnce({
      _sum: { grandTotal: 5000 },
    });

    (mockPrisma.sale.count as jest.Mock).mockResolvedValueOnce(15);
    (mockPrisma.purchase.count as jest.Mock).mockResolvedValueOnce(3);
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 'p-1', currentStock: 2, reorderLevel: 5 },
      { id: 'p-2', currentStock: 10, reorderLevel: 2 },
    ]);
    (mockPrisma.customer.count as jest.Mock).mockResolvedValueOnce(8);
    (mockPrisma.saleItem.groupBy as jest.Mock).mockResolvedValueOnce([
      { productId: 'p-1', productName: 'Brake Pad', _sum: { quantity: 12, subtotal: 1200 } },
    ]);

    const result = await service.getMetrics(mockUser);

    expect(result.todayRevenue).toBe(250);
    expect(result.todaySalesCount).toBe(1);
    expect(result.totalRevenue).toBe(5000);
    expect(result.totalInvoicesCount).toBe(15);
    expect(result.pendingOrdersCount).toBe(3);
    expect(result.lowStockCount).toBe(1);
    expect(result.totalProductsCount).toBe(2);
    expect(result.totalCustomersCount).toBe(8);
    expect(result.recentSales.length).toBe(1);
    expect(result.topSellingProducts.length).toBe(1);
    expect(result.revenueTrend.length).toBe(7);
  });
});
