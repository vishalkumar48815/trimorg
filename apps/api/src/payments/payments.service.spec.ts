import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

describe('PaymentsService', () => {
  let service: PaymentsService;

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
    payment: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    sale: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  mockPrisma.$transaction.mockImplementation(async (callback: (tx: typeof mockPrisma) => unknown) => callback(mockPrisma));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPayments', () => {
    it('should calculate collections summary and return payment history', async () => {
      (mockPrisma.payment.findMany as jest.Mock).mockResolvedValueOnce([
        {
          id: 'pay-1',
          paymentNumber: 'PAY-0001',
          saleId: 'sale-1',
          sale: { saleNumber: 'INV-1001' },
          customerId: 'cust-1',
          customer: { name: 'Vikas', mobile: '9876543210' },
          amount: 500,
          paymentMethod: 'UPI',
          transactionRef: 'UPI/123456',
          notes: 'Settlement',
          createdAt: new Date(),
        },
      ]);

      (mockPrisma.payment.aggregate as jest.Mock).mockResolvedValueOnce({
        _sum: { amount: 500 },
      });

      (mockPrisma.sale.findMany as jest.Mock).mockResolvedValueOnce([
        { grandTotal: 1000, paidAmount: 500 },
      ]);

      const result = await service.getPayments(mockUser, {});

      expect(result.summary.totalCollected).toBe(500);
      expect(result.summary.todayCollected).toBe(500);
      expect(result.summary.totalOutstandingDue).toBe(500);
      expect(result.payments.length).toBe(1);
    });
  });

  describe('recordPayment', () => {
    it('should record payment and atomically update invoice paid amount', async () => {
      (mockPrisma.sale.findFirst as jest.Mock).mockResolvedValueOnce({
        id: 'sale-1',
        grandTotal: 1000,
        paidAmount: 200,
        customerId: 'cust-1',
      });

      (mockPrisma.sale.update as jest.Mock).mockResolvedValueOnce({
        id: 'sale-1',
        paidAmount: 700,
      });

      (mockPrisma.payment.count as jest.Mock).mockResolvedValueOnce(0);

      (mockPrisma.payment.create as jest.Mock).mockResolvedValueOnce({
        id: 'pay-2',
        paymentNumber: 'PAY-0001',
        saleId: 'sale-1',
        sale: { saleNumber: 'INV-1001' },
        customerId: 'cust-1',
        customer: { name: 'Vikas', mobile: '9876543210' },
        amount: 500,
        paymentMethod: 'UPI',
        transactionRef: 'UPI/789',
        notes: 'Partial payment',
        createdAt: new Date(),
      });

      const result = await service.recordPayment(mockUser, {
        saleId: 'sale-1',
        amount: 500,
        paymentMethod: 'UPI',
        transactionRef: 'UPI/789',
        notes: 'Partial payment',
      });

      expect(result.id).toBe('pay-2');
      expect(result.amount).toBe(500);
      expect(mockPrisma.sale.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { paidAmount: 700 },
        }),
      );
    });
  });
});
