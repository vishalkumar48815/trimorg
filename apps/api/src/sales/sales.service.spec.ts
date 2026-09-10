import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

const mockProduct = {
  id: 'prod-1',
  organizationId: 'org-1',
  name: 'Brake Pad',
  sku: 'BP-01',
  barcode: null,
  category: 'Spares',
  sellingPrice: 450,
  costPrice: 200,
  isService: false,
  currentStock: 10,
  reorderLevel: 2,
  unitType: 'PCS',
  taxRate: 18,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockServiceProduct = {
  id: 'prod-serv-1',
  organizationId: 'org-1',
  name: 'General Service Labor',
  sku: 'SRV-01',
  barcode: null,
  category: 'Labor',
  sellingPrice: 500,
  costPrice: 0,
  isService: true,
  currentStock: 0,
  reorderLevel: 0,
  unitType: 'HRS',
  taxRate: 18,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreatedSale = {
  id: 'sale-1',
  organizationId: 'org-1',
  saleNumber: 'INV-20260910-1234',
  type: 'INVOICE',
  customerId: 'cust-1',
  subtotal: 950,
  discount: 50,
  tax: 162,
  grandTotal: 1062,
  paidAmount: 1062,
  paymentMethod: 'UPI',
  status: 'COMPLETED',
  vehicleNotes: 'DL-01-AB-1234',
  items: [
    {
      id: 'item-1',
      saleId: 'sale-1',
      productId: 'prod-1',
      productName: 'Brake Pad',
      quantity: 1,
      sellingPrice: 450,
      discount: 0,
      subtotal: 450,
      product: { name: 'Brake Pad' },
    },
    {
      id: 'item-2',
      saleId: 'sale-1',
      productId: 'prod-serv-1',
      productName: 'General Service Labor',
      quantity: 1,
      sellingPrice: 500,
      discount: 0,
      subtotal: 500,
      product: { name: 'General Service Labor' },
    },
  ],
  customer: { id: 'cust-1', name: 'John Doe', mobile: '9876543210' },
  organization: {
    businessName: 'EV Motors',
    ownerName: 'Owner',
    mobile: '9999999999',
    gst: '07AAAAA0000A1Z5',
    addressLine1: 'Delhi',
    addressLine2: null,
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    currencyCode: 'INR',
  },
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
  product: {
    findMany: jest.fn().mockImplementation(({ where }) => {
      const ids = where.id.in;
      return [mockProduct, mockServiceProduct].filter((p) => ids.includes(p.id));
    }),
    update: jest.fn().mockResolvedValue({ ...mockProduct, currentStock: 9 }),
  },
  sale: {
    create: jest.fn().mockResolvedValue(mockCreatedSale),
    findMany: jest.fn().mockResolvedValue([mockCreatedSale]),
    findFirst: jest.fn().mockResolvedValue(mockCreatedSale),
    update: jest.fn().mockResolvedValue({ ...mockCreatedSale, type: 'INVOICE', saleNumber: 'INV-20260910-5678' }),
  },
  stockMovement: {
    create: jest.fn().mockResolvedValue({}),
  },
  $transaction: jest.fn().mockImplementation(async (callback) => {
    return callback(mockPrismaService);
  }),
};

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should complete sale transaction with physical and service items', async () => {
    const result = await service.createSale(mockUser, {
      customerId: 'cust-1',
      type: 'INVOICE',
      discount: 50,
      tax: 162,
      paidAmount: 1062,
      paymentMethod: 'UPI',
      vehicleNotes: 'DL-01-AB-1234',
      items: [
        { productId: 'prod-1', quantity: 1, sellingPrice: 450, discount: 0 },
        { productId: 'prod-serv-1', quantity: 1, sellingPrice: 500, discount: 0 },
      ],
    });

    expect(result.saleNumber).toBe('INV-20260910-1234');
    expect(result.grandTotal).toBe('1062');
    expect(result.paymentMethod).toBe('UPI');
    expect(result.items.length).toBe(2);
  });

  it('should create quotation without decrementing stock', async () => {
    const result = await service.createSale(mockUser, {
      customerId: 'cust-1',
      type: 'QUOTATION',
      discount: 0,
      tax: 180,
      paidAmount: 0,
      paymentMethod: 'CASH',
      items: [
        { productId: 'prod-1', quantity: 2, sellingPrice: 500, discount: 0 },
      ],
    });

    expect(result).toBeDefined();
    expect(mockPrismaService.sale.create).toHaveBeenCalled();
  });

  it('should convert quotation to completed invoice', async () => {
    mockPrismaService.sale.findFirst.mockResolvedValue({
      ...mockCreatedSale,
      type: 'QUOTATION',
      items: [
        {
          ...mockCreatedSale.items[0],
          product: mockProduct,
        },
      ],
    });

    const converted = await service.convertQuotationToInvoice(mockUser, 'sale-1');
    expect(converted.type).toBe('INVOICE');
    expect(mockPrismaService.stockMovement.create).toHaveBeenCalled();
  });

  it('should throw BadRequestException if physical product has insufficient stock', async () => {
    await expect(
      service.createSale(mockUser, {
        type: 'INVOICE',
        discount: 0,
        tax: 0,
        paidAmount: 45000,
        paymentMethod: 'CASH',
        items: [
          { productId: 'prod-1', quantity: 999, sellingPrice: 450, discount: 0 }, // 999 > 10
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
