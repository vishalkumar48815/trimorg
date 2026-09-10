import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Supplier } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  CreateSupplierInput,
  SupplierIdInput,
  SuppliersQueryInput,
  UpdateSupplierInput,
} from './suppliers.schemas';
import type { SupplierDetail, SupplierListItem } from './suppliers.types';

type SupplierWithPurchases = Supplier & {
  purchases?: { grandTotal: Prisma.Decimal | number | string }[];
  _count?: { purchases: number };
};

function serializeSupplier(supplier: SupplierWithPurchases): SupplierListItem {
  const purchases = supplier.purchases ?? [];
  const totalAmount = purchases.reduce((sum, p) => sum + Number(p.grandTotal), 0);

  return {
    id: supplier.id,
    name: supplier.name,
    contactPerson: supplier.contactPerson,
    mobile: supplier.mobile,
    email: supplier.email,
    gst: supplier.gst,
    address: supplier.address,
    outstandingBalance: supplier.outstandingBalance.toString(),
    totalPurchasesCount: supplier._count?.purchases ?? purchases.length,
    totalPurchasesAmount: totalAmount.toFixed(2),
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(user: RequestUser, input: CreateSupplierInput): Promise<SupplierListItem> {
    const organizationId = this.requireOrganizationId(user);

    const supplier = await this.prisma.supplier.create({
      data: {
        organizationId,
        name: input.name,
        contactPerson: input.contactPerson || null,
        mobile: input.mobile,
        email: input.email || null,
        gst: input.gst || null,
        address: input.address || null,
      },
    });

    return serializeSupplier(supplier);
  }

  async getSuppliers(user: RequestUser, query: SuppliersQueryInput): Promise<SupplierListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();

    const where: Prisma.SupplierWhereInput = {
      organizationId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { contactPerson: { contains: search, mode: 'insensitive' } },
              { mobile: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { gst: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const suppliers = await this.prisma.supplier.findMany({
      where,
      include: {
        purchases: {
          select: { grandTotal: true },
        },
        _count: {
          select: { purchases: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return suppliers.map(serializeSupplier);
  }

  async getSupplier(user: RequestUser, id: SupplierIdInput['id']): Promise<SupplierDetail> {
    const organizationId = this.requireOrganizationId(user);

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        purchases: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { purchases: true },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException({
        code: 'SupplierNotFound',
        message: 'Supplier not found.',
      });
    }

    const base = serializeSupplier(supplier);
    return {
      ...base,
      purchases: supplier.purchases?.map((p) => ({
        id: p.id,
        purchaseNumber: p.purchaseNumber,
        status: p.status,
        grandTotal: p.grandTotal.toString(),
        createdAt: p.createdAt,
      })),
    };
  }

  async updateSupplier(
    user: RequestUser,
    id: SupplierIdInput['id'],
    input: UpdateSupplierInput,
  ): Promise<SupplierListItem> {
    const organizationId = this.requireOrganizationId(user);

    const updated = await this.prisma.supplier.updateMany({
      where: {
        id,
        organizationId,
      },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.contactPerson !== undefined ? { contactPerson: input.contactPerson || null } : {}),
        ...(input.mobile !== undefined ? { mobile: input.mobile } : {}),
        ...(input.email !== undefined ? { email: input.email || null } : {}),
        ...(input.gst !== undefined ? { gst: input.gst || null } : {}),
        ...(input.address !== undefined ? { address: input.address || null } : {}),
      },
    });

    if (updated.count === 0) {
      throw new NotFoundException({
        code: 'SupplierNotFound',
        message: 'Supplier not found.',
      });
    }

    return this.getSupplier(user, id);
  }

  async deleteSupplier(user: RequestUser, id: SupplierIdInput['id']): Promise<void> {
    const organizationId = this.requireOrganizationId(user);

    const deleted = await this.prisma.supplier.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException({
        code: 'SupplierNotFound',
        message: 'Supplier not found.',
      });
    }
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
