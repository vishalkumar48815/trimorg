import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Customer, Prisma, Sale } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  CreateCustomerInput,
  CustomerIdInput,
  CustomersQueryInput,
  UpdateCustomerInput,
} from './customers.schemas';
import type { CustomerDetail, CustomerListItem, CustomerSaleItem } from './customers.types';

type CustomerWithSales = Customer & {
  sales?: Sale[];
  _count?: { sales: number };
};

function serializeSaleSummary(sale: Sale): CustomerSaleItem {
  return {
    id: sale.id,
    saleNumber: sale.saleNumber,
    type: sale.type,
    subtotal: sale.subtotal.toString(),
    discount: sale.discount.toString(),
    tax: sale.tax.toString(),
    grandTotal: sale.grandTotal.toString(),
    paidAmount: sale.paidAmount.toString(),
    paymentMethod: sale.paymentMethod,
    status: sale.status,
    vehicleNotes: sale.vehicleNotes,
    createdAt: sale.createdAt,
  };
}

function serializeCustomer(customer: CustomerWithSales): CustomerListItem {
  const sales = customer.sales ?? [];
  const totalSpent = sales.reduce((sum, s) => sum + Number(s.grandTotal), 0);
  const totalSalesCount = customer._count?.sales ?? sales.length;

  return {
    id: customer.id,
    name: customer.name,
    mobile: customer.mobile,
    email: customer.email,
    gst: customer.gst,
    address: customer.address,
    vehicleDetails: customer.vehicleDetails,
    totalSalesCount,
    totalSpent: totalSpent.toFixed(2),
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  };
}

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(user: RequestUser, input: CreateCustomerInput): Promise<CustomerListItem> {
    const organizationId = this.requireOrganizationId(user);

    const customer = await this.prisma.customer.create({
      data: {
        organizationId,
        name: input.name,
        mobile: input.mobile,
        email: input.email || null,
        gst: input.gst || null,
        address: input.address || null,
        vehicleDetails: input.vehicleDetails || null,
      },
      include: {
        _count: {
          select: { sales: true },
        },
      },
    });

    return serializeCustomer(customer);
  }

  async getCustomers(user: RequestUser, query: CustomersQueryInput): Promise<CustomerListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();
    const where: Prisma.CustomerWhereInput = {
      organizationId,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          mobile: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          vehicleDetails: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          gst: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const customers = await this.prisma.customer.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sales: {
          select: {
            grandTotal: true,
          },
        },
        _count: {
          select: { sales: true },
        },
      },
    });

    return customers.map((c) => {
      const totalSpent = c.sales.reduce((sum, s) => sum + Number(s.grandTotal), 0);
      return {
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        email: c.email,
        gst: c.gst,
        address: c.address,
        vehicleDetails: c.vehicleDetails,
        totalSalesCount: c._count.sales,
        totalSpent: totalSpent.toFixed(2),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });
  }

  async getCustomer(user: RequestUser, id: CustomerIdInput['id']): Promise<CustomerDetail> {
    const organizationId = this.requireOrganizationId(user);
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        sales: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: { sales: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException({
        code: 'CustomerNotFound',
        message: 'Customer not found.',
      });
    }

    const base = serializeCustomer(customer);
    return {
      ...base,
      sales: customer.sales.map(serializeSaleSummary),
    };
  }

  async updateCustomer(
    user: RequestUser,
    id: CustomerIdInput['id'],
    input: UpdateCustomerInput,
  ): Promise<CustomerListItem> {
    const organizationId = this.requireOrganizationId(user);

    const data: Prisma.CustomerUpdateManyMutationInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.mobile !== undefined) data.mobile = input.mobile;
    if (input.email !== undefined) data.email = input.email || null;
    if (input.gst !== undefined) data.gst = input.gst || null;
    if (input.address !== undefined) data.address = input.address || null;
    if (input.vehicleDetails !== undefined) data.vehicleDetails = input.vehicleDetails || null;

    const result = await this.prisma.customer.updateMany({
      where: {
        id,
        organizationId,
      },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException({
        code: 'CustomerNotFound',
        message: 'Customer not found.',
      });
    }

    const updated = await this.prisma.customer.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        sales: {
          select: { grandTotal: true },
        },
        _count: {
          select: { sales: true },
        },
      },
    });

    if (!updated) {
      throw new NotFoundException({
        code: 'CustomerNotFound',
        message: 'Customer not found.',
      });
    }

    const totalSpent = updated.sales.reduce((sum, s) => sum + Number(s.grandTotal), 0);
    return {
      id: updated.id,
      name: updated.name,
      mobile: updated.mobile,
      email: updated.email,
      gst: updated.gst,
      address: updated.address,
      vehicleDetails: updated.vehicleDetails,
      totalSalesCount: updated._count.sales,
      totalSpent: totalSpent.toFixed(2),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteCustomer(user: RequestUser, id: CustomerIdInput['id']): Promise<void> {
    const organizationId = this.requireOrganizationId(user);

    const result = await this.prisma.customer.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException({
        code: 'CustomerNotFound',
        message: 'Customer not found.',
      });
    }
  }

  async getCustomerSales(
    user: RequestUser,
    id: CustomerIdInput['id'],
  ): Promise<CustomerSaleItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const sales = await this.prisma.sale.findMany({
      where: {
        customerId: id,
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sales.map(serializeSaleSummary);
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
