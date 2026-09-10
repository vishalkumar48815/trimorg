import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

const mockCustomer = {
  id: 'cust-1',
  organizationId: 'org-1',
  name: 'John Doe',
  mobile: '9876543210',
  email: 'john@example.com',
  gst: '07AAAAA0000A1Z5',
  address: 'New Delhi',
  vehicleDetails: 'Ather 450X - DL-01-AB-1234',
  sales: [
    {
      id: 'sale-1',
      saleNumber: 'INV-001',
      type: 'INVOICE',
      subtotal: 1000,
      discount: 0,
      tax: 180,
      grandTotal: 1180,
      paidAmount: 1180,
      paymentMethod: 'UPI',
      status: 'COMPLETED',
      vehicleNotes: null,
      createdAt: new Date(),
    },
  ],
  _count: { sales: 1 },
  createdAt: new Date(),
  updatedAt: new Date(),
};

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

const mockPrismaService = {
  customer: {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findMany: jest.fn().mockResolvedValue([mockCustomer]),
    findFirst: jest.fn().mockResolvedValue(mockCustomer),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  sale: {
    findMany: jest.fn().mockResolvedValue(mockCustomer.sales),
  },
};

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new customer with vehicle details', async () => {
    const result = await service.createCustomer(mockUser, {
      name: 'John Doe',
      mobile: '9876543210',
      vehicleDetails: 'Ather 450X - DL-01-AB-1234',
    });

    expect(result.name).toBe('John Doe');
    expect(result.vehicleDetails).toBe('Ather 450X - DL-01-AB-1234');
    expect(mockPrismaService.customer.create).toHaveBeenCalled();
  });

  it('should list customers for organization with totalSpent', async () => {
    const result = await service.getCustomers(mockUser, {});

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('John Doe');
    expect(result[0].totalSpent).toBe('1180.00');
  });

  it('should delete a customer', async () => {
    await expect(service.deleteCustomer(mockUser, 'cust-1')).resolves.not.toThrow();
    expect(mockPrismaService.customer.deleteMany).toHaveBeenCalled();
  });

  it('should get customer sales history', async () => {
    const sales = await service.getCustomerSales(mockUser, 'cust-1');
    expect(sales.length).toBe(1);
    expect(sales[0].saleNumber).toBe('INV-001');
  });
});
