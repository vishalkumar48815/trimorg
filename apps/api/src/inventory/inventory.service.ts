import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Product, StockMovement } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  AdjustStockInput,
  ProductIdInput,
  StockMovementsQueryInput,
  UpdateProductStockInput,
} from './inventory.schemas';
import type { ProductListItem } from '../products/products.types';
import type {
  AdjustStockResult,
  InventorySummary,
  StockMovementListItem,
} from './inventory.types';

function serializeProduct(product: Product): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    category: product.category,
    sellingPrice: product.sellingPrice.toString(),
    costPrice: product.costPrice.toString(),
    isService: product.isService,
    currentStock: product.currentStock,
    reorderLevel: product.reorderLevel,
    unitType: product.unitType,
    taxRate: product.taxRate.toString(),
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function serializeMovement(
  movement: StockMovement & { product?: { name: string; sku: string } },
): StockMovementListItem {
  return {
    id: movement.id,
    productId: movement.productId,
    productName: movement.product?.name ?? 'Unknown Product',
    productSku: movement.product?.sku ?? 'N/A',
    type: movement.type,
    quantityDelta: movement.quantityDelta,
    previousStock: movement.previousStock,
    newStock: movement.newStock,
    referenceId: movement.referenceId,
    reason: movement.reason,
    createdAt: movement.createdAt,
  };
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getInventorySummary(user: RequestUser): Promise<InventorySummary> {
    const organizationId = this.requireOrganizationId(user);

    const [products, totalMovementsCount] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          organizationId,
          status: 'ACTIVE',
        },
      }),
      this.prisma.stockMovement.count({
        where: {
          organizationId,
        },
      }),
    ]);

    const physicalProducts = products.filter((p) => !p.isService);

    let totalValuationCost = 0;
    let totalValuationRetail = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const product of physicalProducts) {
      const stock = product.currentStock;
      const cost = Number(product.costPrice) || 0;
      const selling = Number(product.sellingPrice) || 0;

      totalValuationCost += stock * cost;
      totalValuationRetail += stock * selling;

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= product.reorderLevel) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    }

    return {
      totalItemsCount: physicalProducts.length,
      totalValuationCost: totalValuationCost.toFixed(2),
      totalValuationRetail: totalValuationRetail.toFixed(2),
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalMovementsCount,
    };
  }

  async adjustStock(
    user: RequestUser,
    input: AdjustStockInput,
  ): Promise<AdjustStockResult> {
    const organizationId = this.requireOrganizationId(user);

    const result = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: {
          id: input.productId,
          organizationId,
        },
      });

      if (!product) {
        throw new NotFoundException({
          code: 'ProductNotFound',
          message: 'Product not found.',
        });
      }

      if (product.isService) {
        throw new BadRequestException({
          code: 'ServiceItemCannotHaveStock',
          message: 'Cannot adjust stock for labor/service catalog items.',
        });
      }

      const previousStock = product.currentStock;
      const newStock = previousStock + input.quantityDelta;

      if (newStock < 0) {
        throw new BadRequestException({
          code: 'InsufficientStock',
          message: `Stock cannot be negative. Current stock is ${previousStock}, deduction is ${Math.abs(input.quantityDelta)}.`,
        });
      }

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { currentStock: newStock },
      });

      const movement = await tx.stockMovement.create({
        data: {
          organizationId,
          productId: product.id,
          type: input.type,
          quantityDelta: input.quantityDelta,
          previousStock,
          newStock,
          reason: input.reason || `Manual ${input.type.toLowerCase()} adjustment`,
        },
        include: {
          product: {
            select: { name: true, sku: true },
          },
        },
      });

      return {
        product: updatedProduct,
        movement,
      };
    });

    return {
      product: serializeProduct(result.product),
      movement: serializeMovement(result.movement),
    };
  }

  async getStockMovements(
    user: RequestUser,
    query: StockMovementsQueryInput,
  ): Promise<StockMovementListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();

    const where: Prisma.StockMovementWhereInput = {
      organizationId,
      ...(query.productId ? { productId: query.productId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(search
        ? {
            OR: [
              { product: { name: { contains: search, mode: 'insensitive' } } },
              { product: { sku: { contains: search, mode: 'insensitive' } } },
              { reason: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const movements = await this.prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: query.limit ?? 50,
      skip: query.offset ?? 0,
    });

    return movements.map(serializeMovement);
  }

  async updateProductStock(
    user: RequestUser,
    id: ProductIdInput['id'],
    input: UpdateProductStockInput,
  ): Promise<ProductListItem> {
    const organizationId = this.requireOrganizationId(user);

    const updatedProduct = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.product.findFirst({
        where: {
          id,
          organizationId,
        },
      });

      if (!existing) {
        return null;
      }

      const stockDelta = input.currentStock - existing.currentStock;

      const product = await tx.product.update({
        where: { id: existing.id },
        data: {
          currentStock: input.currentStock,
          reorderLevel: input.reorderLevel,
        },
      });

      if (stockDelta !== 0 && !existing.isService) {
        await tx.stockMovement.create({
          data: {
            organizationId,
            productId: existing.id,
            type: 'ADJUSTMENT',
            quantityDelta: stockDelta,
            previousStock: existing.currentStock,
            newStock: input.currentStock,
            reason: 'Reorder / stock baseline level update',
          },
        });
      }

      return product;
    });

    if (!updatedProduct) {
      throw new NotFoundException({
        code: 'ProductNotFound',
        message: 'Product not found.',
      });
    }

    return serializeProduct(updatedProduct);
  }

  async getLowStockProducts(user: RequestUser): Promise<ProductListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
        status: 'ACTIVE',
      },
      orderBy: [
        {
          currentStock: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return products
      .filter((product) => !product.isService && product.currentStock <= product.reorderLevel)
      .map(serializeProduct);
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
