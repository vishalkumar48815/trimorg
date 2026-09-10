import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

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
  contactPerson: 'Ramesh Patel',
  mobile: '9876543210',
  email: 'ramesh@electraspares.com',
  gst: '07AAAAA1234A1Z5',
  address: 'Plot 45, Okhla Phase 3, New Delhi',
  outstandingBalance: '0.00',
  purchases: [
    {
      id: 'po-1',
      purchaseNumber: 'PO-202609-1001',
      status: 'RECEIVED',
      grandTotal: '15000.00',
      createdAt: new Date(),
    },
  ],
  _count: { purchases: 1 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('SuppliersService', () => {
  let service: SuppliersService;

  const mockPrismaService = {
    supplier: {
      create: jest.fn().mockResolvedValue(mockSupplier),
      findMany: jest.fn().mockResolvedValue([mockSupplier]),
      findFirst: jest.fn().mockResolvedValue(mockSupplier),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a supplier with contact and GST', async () => {
    const result = await service.createSupplier(mockUser, {
      name: 'Electra Spares Distributor',
      contactPerson: 'Ramesh Patel',
      mobile: '9876543210',
      email: 'ramesh@electraspares.com',
      gst: '07AAAAA1234A1Z5',
    });

    expect(result.name).toBe('Electra Spares Distributor');
    expect(result.contactPerson).toBe('Ramesh Patel');
    expect(mockPrismaService.supplier.create).toHaveBeenCalled();
  });

  it('should list suppliers with aggregated purchases amount', async () => {
    const list = await service.getSuppliers(mockUser, {});
    expect(list.length).toBe(1);
    expect(list[0].totalPurchasesAmount).toBe('15000.00');
  });

  it('should delete a supplier', async () => {
    await expect(service.deleteSupplier(mockUser, 'supp-1')).resolves.not.toThrow();
    expect(mockPrismaService.supplier.deleteMany).toHaveBeenCalled();
  });
});
