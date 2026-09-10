import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type { ProductIdInput, UpdateProductStockInput } from './inventory.schemas';
import type { ProductListItem } from '../products/products.types';

function serializeProduct(product: Product): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    sellingPrice: product.sellingPrice.toString(),
    currentStock: product.currentStock,
    reorderLevel: product.reorderLevel,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProductStock(
    user: RequestUser,
    id: ProductIdInput['id'],
    input: UpdateProductStockInput,
  ): Promise<ProductListItem> {
    const organizationId = this.requireOrganizationId(user);

    const updatedProduct = await this.prisma.$transaction(async (tx) => {
      const result = await tx.product.updateMany({
        where: {
          id,
          organizationId,
        },
        data: {
          currentStock: input.currentStock,
          reorderLevel: input.reorderLevel,
        },
      });

      if (result.count === 0) {
        return null;
      }

      return tx.product.findFirst({
        where: {
          id,
          organizationId,
        },
      });
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
      .filter((product) => product.currentStock <= product.reorderLevel)
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
