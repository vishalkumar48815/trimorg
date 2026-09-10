import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Purchase, PurchaseItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  CreatePurchaseInput,
  PurchaseIdInput,
  PurchasesQueryInput,
} from './purchases.schemas';
import type { PurchaseDetail, PurchaseItemDetail, PurchaseListItem } from './purchases.types';

type PurchaseWithRelations = Purchase & {
  supplier: { id: string; name: string; mobile: string };
  items: (PurchaseItem & { product?: { name: string; isService: boolean } })[];
};

function serializePurchaseItem(
  item: PurchaseItem & { product?: { name: string } },
): PurchaseItemDetail {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName || item.product?.name || 'Product',
    quantity: item.quantity,
    unitCost: item.unitCost.toString(),
    subtotal: item.subtotal.toString(),
  };
}

function serializePurchaseListItem(
  purchase: Purchase & {
    supplier: { id: string; name: string; mobile: string };
    _count?: { items: number };
    items?: PurchaseItem[];
  },
): PurchaseListItem {
  return {
    id: purchase.id,
    purchaseNumber: purchase.purchaseNumber,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplier.name,
    supplierMobile: purchase.supplier.mobile,
    supplierInvoiceRef: purchase.supplierInvoiceRef,
    status: purchase.status,
    subtotal: purchase.subtotal.toString(),
    tax: purchase.tax.toString(),
    grandTotal: purchase.grandTotal.toString(),
    paidAmount: purchase.paidAmount.toString(),
    notes: purchase.notes,
    itemCount: purchase._count?.items ?? purchase.items?.length ?? 0,
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
  };
}

function serializePurchaseDetail(purchase: PurchaseWithRelations): PurchaseDetail {
  return {
    ...serializePurchaseListItem(purchase),
    items: purchase.items.map(serializePurchaseItem),
  };
}

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(user: RequestUser, input: CreatePurchaseInput): Promise<PurchaseDetail> {
    const organizationId = this.requireOrganizationId(user);

    // Verify supplier exists in organization
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id: input.supplierId,
        organizationId,
      },
    });

    if (!supplier) {
      throw new NotFoundException({
        code: 'SupplierNotFound',
        message: 'Supplier not found.',
      });
    }

    // Verify and map products
    const productIds = input.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        organizationId,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException({
        code: 'InvalidProducts',
        message: 'One or more products do not exist in your catalog.',
      });
    }

    let subtotal = 0;
    const preparedItems = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const lineSubtotal = item.quantity * item.unitCost;
      subtotal += lineSubtotal;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal: lineSubtotal,
      };
    });

    const tax = input.tax ?? 0;
    const grandTotal = subtotal + tax;
    const paidAmount = input.paidAmount ?? 0;

    // Generate PO-YYYYMMDD-XXXX number
    const now = new Date();
    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const purchaseNumber = `PO-${datePrefix}-${randomSuffix}`;

    const purchase = await this.prisma.purchase.create({
      data: {
        organizationId,
        purchaseNumber,
        supplierId: input.supplierId,
        supplierInvoiceRef: input.supplierInvoiceRef || null,
        status: 'ORDERED',
        subtotal,
        tax,
        grandTotal,
        paidAmount,
        notes: input.notes || null,
        items: {
          create: preparedItems,
        },
      },
      include: {
        supplier: {
          select: { id: true, name: true, mobile: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, isService: true },
            },
          },
        },
      },
    });

    return serializePurchaseDetail(purchase);
  }

  async getPurchases(user: RequestUser, query: PurchasesQueryInput): Promise<PurchaseListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();

    const where: Prisma.PurchaseWhereInput = {
      organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(search
        ? {
            OR: [
              { purchaseNumber: { contains: search, mode: 'insensitive' } },
              { supplierInvoiceRef: { contains: search, mode: 'insensitive' } },
              { supplier: { name: { contains: search, mode: 'insensitive' } } },
              { supplier: { mobile: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const purchases = await this.prisma.purchase.findMany({
      where,
      include: {
        supplier: {
          select: { id: true, name: true, mobile: true },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return purchases.map(serializePurchaseListItem);
  }

  async getPurchase(user: RequestUser, id: PurchaseIdInput['id']): Promise<PurchaseDetail> {
    const organizationId = this.requireOrganizationId(user);

    const purchase = await this.prisma.purchase.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        supplier: {
          select: { id: true, name: true, mobile: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, isService: true },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException({
        code: 'PurchaseNotFound',
        message: 'Purchase order not found.',
      });
    }

    return serializePurchaseDetail(purchase);
  }

  async receivePurchase(user: RequestUser, id: PurchaseIdInput['id']): Promise<PurchaseDetail> {
    const organizationId = this.requireOrganizationId(user);

    const purchase = await this.prisma.purchase.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        supplier: {
          select: { id: true, name: true, mobile: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException({
        code: 'PurchaseNotFound',
        message: 'Purchase order not found.',
      });
    }

    if (purchase.status === 'RECEIVED') {
      throw new BadRequestException({
        code: 'PurchaseAlreadyReceived',
        message: 'This purchase order has already been received into inventory.',
      });
    }

    if (purchase.status === 'CANCELLED') {
      throw new BadRequestException({
        code: 'PurchaseCancelled',
        message: 'Cannot receive items for a cancelled purchase order.',
      });
    }

    // Atomic transaction: Increment stock, record StockMovement, update PO status
    const updatedPurchase = await this.prisma.$transaction(async (tx) => {
      for (const item of purchase.items) {
        if (!item.product.isService) {
          const previousStock = item.product.currentStock;
          const newStock = previousStock + item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: newStock,
              costPrice: item.unitCost, // Update latest purchase cost
            },
          });

          await tx.stockMovement.create({
            data: {
              organizationId,
              productId: item.productId,
              type: 'PURCHASE',
              quantityDelta: item.quantity,
              previousStock,
              newStock,
              referenceId: purchase.id,
              reason: `GRN Received PO #${purchase.purchaseNumber} from ${purchase.supplier.name}`,
            },
          });
        }
      }

      const received = await tx.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'RECEIVED',
        },
        include: {
          supplier: {
            select: { id: true, name: true, mobile: true },
          },
          items: {
            include: {
              product: {
                select: { name: true, isService: true },
              },
            },
          },
        },
      });

      return received;
    });

    return serializePurchaseDetail(updatedPurchase);
  }

  async cancelPurchase(user: RequestUser, id: PurchaseIdInput['id']): Promise<PurchaseDetail> {
    const organizationId = this.requireOrganizationId(user);

    const purchase = await this.prisma.purchase.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!purchase) {
      throw new NotFoundException({
        code: 'PurchaseNotFound',
        message: 'Purchase order not found.',
      });
    }

    if (purchase.status === 'RECEIVED') {
      throw new BadRequestException({
        code: 'CannotCancelReceivedPurchase',
        message: 'Cannot cancel a purchase order that has already been received into stock.',
      });
    }

    const cancelled = await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        supplier: {
          select: { id: true, name: true, mobile: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, isService: true },
            },
          },
        },
      },
    });

    return serializePurchaseDetail(cancelled);
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
