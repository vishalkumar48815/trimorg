import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser: RequestUser = {
  id: 'u1',
  email: 'test@example.com',
  fullName: 'Test User',
  mobile: '9999999999',
  role: 'OWNER',
  isEmailVerified: true,
  onboardingCompletedAt: new Date(),
  organizationId: 'org-1',
};

const mockProduct = {
  id: 'prod-1',
  organizationId: 'org-1',
  name: 'Brake Pad Set',
  sku: 'BP-001',
  barcode: '8901234567890',
  category: 'Spares',
  sellingPrice: '500.00',
  costPrice: '300.00',
  isService: false,
  currentStock: 10,
  reorderLevel: 5,
  unitType: 'SET',
  taxRate: '18.00',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockServiceProduct = {
  id: 'prod-2',
  organizationId: 'org-1',
  name: 'General Service Labor',
  sku: 'SRV-001',
  barcode: null,
  category: 'Services',
  sellingPrice: '800.00',
  costPrice: '0.00',
  isService: true,
  currentStock: 0,
  reorderLevel: 0,
  unitType: 'HR',
  taxRate: '18.00',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMovement = {
  id: 'mov-1',
  organizationId: 'org-1',
  productId: 'prod-1',
  type: 'RESTOCK',
  quantityDelta: 15,
  previousStock: 10,
  newStock: 25,
  referenceId: null,
  reason: 'Stock shipment received',
  createdAt: new Date(),
  product: {
    name: 'Brake Pad Set',
    sku: 'BP-001',
  },
};

describe('InventoryService', () => {
  let service: InventoryService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    stockMovement: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInventorySummary', () => {
    it('should calculate accurate valuation and stock metrics', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([
        mockProduct,
        {
          ...mockProduct,
          id: 'prod-3',
          currentStock: 2, // Low stock (<= 5)
        },
        {
          ...mockProduct,
          id: 'prod-4',
          currentStock: 0, // Out of stock
        },
        mockServiceProduct,
      ]);
      mockPrismaService.stockMovement.count.mockResolvedValue(12);

      const summary = await service.getInventorySummary(mockUser);

      expect(summary.totalItemsCount).toBe(3); // 3 physical products
      expect(summary.inStockCount).toBe(1); // prod-1 (10 > 5)
      expect(summary.lowStockCount).toBe(1); // prod-3 (2 <= 5)
      expect(summary.outOfStockCount).toBe(1); // prod-4 (0)
      expect(summary.totalMovementsCount).toBe(12);
      // Valuation cost: (10 * 300) + (2 * 300) + (0 * 300) = 3600
      expect(summary.totalValuationCost).toBe('3600.00');
      // Valuation retail: (10 * 500) + (2 * 500) + (0 * 500) = 6000
      expect(summary.totalValuationRetail).toBe('6000.00');
    });
  });

  describe('adjustStock', () => {
    it('should successfully increase stock and record movement', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          product: {
            findFirst: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue({
              ...mockProduct,
              currentStock: 25,
            }),
          },
          stockMovement: {
            create: jest.fn().mockResolvedValue(mockMovement),
          },
        };
        return callback(tx);
      });

      const result = await service.adjustStock(mockUser, {
        productId: 'prod-1',
        type: 'RESTOCK',
        quantityDelta: 15,
        reason: 'Shipment received',
      });

      expect(result.product.currentStock).toBe(25);
      expect(result.movement.type).toBe('RESTOCK');
      expect(result.movement.quantityDelta).toBe(15);
    });

    it('should throw BadRequestException for service items', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          product: {
            findFirst: jest.fn().mockResolvedValue(mockServiceProduct),
          },
        };
        return callback(tx);
      });

      await expect(
        service.adjustStock(mockUser, {
          productId: 'prod-2',
          type: 'ADJUSTMENT',
          quantityDelta: 5,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if stock goes negative', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          product: {
            findFirst: jest.fn().mockResolvedValue(mockProduct), // stock: 10
          },
        };
        return callback(tx);
      });

      await expect(
        service.adjustStock(mockUser, {
          productId: 'prod-1',
          type: 'DAMAGE',
          quantityDelta: -15, // 10 - 15 = -5 (invalid)
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product is missing', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          product: {
            findFirst: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(tx);
      });

      await expect(
        service.adjustStock(mockUser, {
          productId: 'prod-999',
          type: 'RESTOCK',
          quantityDelta: 5,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStockMovements', () => {
    it('should return serialized stock movement records', async () => {
      mockPrismaService.stockMovement.findMany.mockResolvedValue([mockMovement]);

      const movements = await service.getStockMovements(mockUser, {
        limit: 10,
      });

      expect(movements.length).toBe(1);
      expect(movements[0].productName).toBe('Brake Pad Set');
      expect(movements[0].type).toBe('RESTOCK');
    });
  });

  describe('getLowStockProducts', () => {
    it('should filter only physical products at or below reorder level', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([
        mockProduct, // stock 10 > reorder 5 (NOT low)
        {
          ...mockProduct,
          id: 'prod-low',
          name: 'Throttle Cable',
          currentStock: 3, // stock 3 <= reorder 5 (LOW)
        },
        mockServiceProduct, // Service (Ignored)
      ]);

      const lowStock = await service.getLowStockProducts(mockUser);

      expect(lowStock.length).toBe(1);
      expect(lowStock[0].id).toBe('prod-low');
    });
  });
});
