import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Sale, SaleItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type { CreateSaleInput, SaleIdInput, SalesQueryInput } from './sales.schemas';
import type { SaleDetail, SaleItemDetail, SaleListItem } from './sales.types';

type SaleWithRelations = Sale & {
  customer?: { id: string; name: string; mobile: string } | null;
  items: (SaleItem & { product: { name: string } })[];
  organization?: {
    businessName: string;
    ownerName: string;
    mobile: string;
    gst: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    currencyCode: string | null;
  };
};

function serializeSaleItem(item: SaleItem & { product?: { name: string } }): SaleItemDetail {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName || item.product?.name || 'Product',
    quantity: item.quantity,
    sellingPrice: item.sellingPrice.toString(),
    discount: item.discount.toString(),
    subtotal: item.subtotal.toString(),
  };
}

function serializeSaleListItem(
  sale: Sale & {
    customer?: { id: string; name: string; mobile: string } | null;
    _count?: { items: number };
  },
): SaleListItem {
  return {
    id: sale.id,
    saleNumber: sale.saleNumber,
    type: sale.type,
    customerId: sale.customerId,
    customerName: sale.customer?.name,
    customerMobile: sale.customer?.mobile,
    subtotal: sale.subtotal.toString(),
    discount: sale.discount.toString(),
    tax: sale.tax.toString(),
    grandTotal: sale.grandTotal.toString(),
    paidAmount: sale.paidAmount.toString(),
    paymentMethod: sale.paymentMethod,
    status: sale.status,
    vehicleNotes: sale.vehicleNotes,
    itemCount: sale._count?.items ?? 0,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

function serializeSaleDetail(sale: SaleWithRelations): SaleDetail {
  return {
    id: sale.id,
    saleNumber: sale.saleNumber,
    type: sale.type,
    customerId: sale.customerId,
    customerName: sale.customer?.name,
    customerMobile: sale.customer?.mobile,
    subtotal: sale.subtotal.toString(),
    discount: sale.discount.toString(),
    tax: sale.tax.toString(),
    grandTotal: sale.grandTotal.toString(),
    paidAmount: sale.paidAmount.toString(),
    paymentMethod: sale.paymentMethod,
    status: sale.status,
    vehicleNotes: sale.vehicleNotes,
    itemCount: sale.items.length,
    items: sale.items.map(serializeSaleItem),
    organization: sale.organization
      ? {
          businessName: sale.organization.businessName,
          ownerName: sale.organization.ownerName,
          mobile: sale.organization.mobile,
          gst: sale.organization.gst,
          addressLine1: sale.organization.addressLine1,
          addressLine2: sale.organization.addressLine2,
          city: sale.organization.city,
          state: sale.organization.state,
          postalCode: sale.organization.postalCode,
          currencyCode: sale.organization.currencyCode,
        }
      : undefined,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale(user: RequestUser, input: CreateSaleInput): Promise<SaleDetail> {
    const organizationId = this.requireOrganizationId(user);

    // Fetch products
    const productIds = input.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        organizationId,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException({
        code: 'InvalidProducts',
        message: 'One or more products in the sale do not exist or belong to another organization.',
      });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate physical product stocks
    for (const item of input.items) {
      const product = productMap.get(item.productId)!;
      if (!product.isService && product.currentStock < item.quantity) {
        throw new BadRequestException({
          code: 'InsufficientStock',
          message: `Insufficient stock for "${product.name}". Available: ${product.currentStock}, Requested: ${item.quantity}.`,
        });
      }
    }

    // Calculate totals
    let itemsSubtotal = 0;
    const preparedItems = input.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const discount = item.discount ?? 0;
      const itemSubtotal = item.quantity * item.sellingPrice - discount;
      itemsSubtotal += itemSubtotal;

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        discount,
        subtotal: itemSubtotal,
        isService: product.isService,
      };
    });

    const subtotal = itemsSubtotal;
    const discount = input.discount ?? 0;
    const tax = input.tax ?? 0;
    const grandTotal = Math.max(0, subtotal - discount + tax);
    const paidAmount = input.paidAmount !== undefined ? input.paidAmount : grandTotal;

    // Generate readable sale number: INV-YYYYMMDD-XXXX
    const now = new Date();
    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const saleNumber = `INV-${datePrefix}-${randomSuffix}`;

    // Execute atomic transaction
    const createdSale = await this.prisma.$transaction(async (tx) => {
      // Create Sale
      const sale = await tx.sale.create({
        data: {
          organizationId,
          saleNumber,
          type: input.type,
          customerId: input.customerId || null,
          subtotal,
          discount,
          tax,
          grandTotal,
          paidAmount,
          paymentMethod: input.paymentMethod,
          status: 'COMPLETED',
          vehicleNotes: input.vehicleNotes || null,
          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice,
              discount: item.discount,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          customer: {
            select: { id: true, name: true, mobile: true },
          },
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
          organization: {
            select: {
              businessName: true,
              ownerName: true,
              mobile: true,
              gst: true,
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              currencyCode: true,
            },
          },
        },
      });

      // Decrement stock and record StockMovement audit logs for physical items
      for (const item of preparedItems) {
        if (!item.isService) {
          const product = products.find((p) => p.id === item.productId);
          const previousStock = product?.currentStock ?? 0;
          const newStock = previousStock - item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: newStock,
            },
          });

          await tx.stockMovement.create({
            data: {
              organizationId,
              productId: item.productId,
              type: 'SALE',
              quantityDelta: -item.quantity,
              previousStock,
              newStock,
              referenceId: sale.id,
              reason: `POS Sale #${saleNumber}`,
            },
          });
        }
      }

      return sale;
    });

    return serializeSaleDetail(createdSale);
  }

  async getSales(user: RequestUser, query: SalesQueryInput): Promise<SaleListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();
    const where: Prisma.SaleWhereInput = {
      organizationId,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (search) {
      where.OR = [
        {
          saleNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            mobile: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          vehicleNotes: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const sales = await this.prisma.sale.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: { id: true, name: true, mobile: true },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    return sales.map(serializeSaleListItem);
  }

  async getSale(user: RequestUser, id: SaleIdInput['id']): Promise<SaleDetail> {
    const organizationId = this.requireOrganizationId(user);
    const sale = await this.prisma.sale.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        customer: {
          select: { id: true, name: true, mobile: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
        organization: {
          select: {
            businessName: true,
            ownerName: true,
            mobile: true,
            gst: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            currencyCode: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException({
        code: 'SaleNotFound',
        message: 'Sale transaction not found.',
      });
    }

    return serializeSaleDetail(sale);
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
