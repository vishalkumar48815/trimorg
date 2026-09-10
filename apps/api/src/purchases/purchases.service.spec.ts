import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
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

const mockSupplier = {
  id: 'supp-1',
  organizationId: 'org-1',
  name: 'Electra Spares Distributor',
  mobile: '9876543210',
};

const mockProduct = {
  id: 'prod-1',
  organizationId: 'org-1',
  name: 'Brake Pad Set',
  currentStock: 10,
  costPrice: '300.00',
  isService: false,
};

const mockPurchase = {
  id: 'po-1',
  organizationId: 'org-1',
  purchaseNumber: 'PO-202609-1001',
  supplierId: 'supp-1',
  supplierInvoiceRef: 'INV-999',
  status: 'ORDERED' as const,
  subtotal: 3000,
  tax: 540,
  grandTotal: 3540,
  paidAmount: 3540,
  notes: 'Urgent stock order',
  supplier: mockSupplier,
  items: [
    {
      id: 'item-1',
      purchaseId: 'po-1',
      productId: 'prod-1',
      productName: 'Brake Pad Set',
      quantity: 10,
      unitCost: 300,
      subtotal: 3000,
      product: mockProduct,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PurchasesService', () => {
  let service: PurchasesService;

  const mockPrismaService = {
    supplier: {
      findFirst: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    purchase: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPurchase', () => {
    it('should create PO in ORDERED status', async () => {
      mockPrismaService.supplier.findFirst.mockResolvedValue(mockSupplier);
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.purchase.create.mockResolvedValue(mockPurchase);

      const result = await service.createPurchase(mockUser, {
        supplierId: 'supp-1',
        items: [{ productId: 'prod-1', quantity: 10, unitCost: 300 }],
        tax: 540,
      });

      expect(result.purchaseNumber).toBe('PO-202609-1001');
      expect(result.status).toBe('ORDERED');
      expect(mockPrismaService.purchase.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      mockPrismaService.supplier.findFirst.mockResolvedValue(null);

      await expect(
        service.createPurchase(mockUser, {
          supplierId: 'supp-missing',
          items: [{ productId: 'prod-1', quantity: 10, unitCost: 300 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('receivePurchase', () => {
    it('should atomically increment product stock and record PURCHASE movement', async () => {
      mockPrismaService.purchase.findFirst.mockResolvedValue(mockPurchase);
      mockPrismaService.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          product: {
            update: jest.fn().mockResolvedValue({ ...mockProduct, currentStock: 20 }),
          },
          stockMovement: {
            create: jest.fn().mockResolvedValue({}),
          },
          purchase: {
            update: jest.fn().mockResolvedValue({
              ...mockPurchase,
              status: 'RECEIVED',
            }),
          },
        };
        return callback(tx);
      });

      const result = await service.receivePurchase(mockUser, 'po-1');
      expect(result.status).toBe('RECEIVED');
    });

    it('should throw BadRequestException if purchase is already received', async () => {
      mockPrismaService.purchase.findFirst.mockResolvedValue({
        ...mockPurchase,
        status: 'RECEIVED',
      });

      await expect(service.receivePurchase(mockUser, 'po-1')).rejects.toThrow(BadRequestException);
    });
  });
});
