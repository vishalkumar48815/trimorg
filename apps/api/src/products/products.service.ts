import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type {
  CreateProductInput,
  ProductIdInput,
  ProductsQueryInput,
  UpdateProductInput,
} from './products.schemas';
import type { ProductListItem } from './products.types';

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

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const code = Reflect.get(error, 'code');
  return typeof code === 'string' ? code : undefined;
}

function buildProductUpdateData(input: UpdateProductInput): Prisma.ProductUpdateManyMutationInput {
  const data: Prisma.ProductUpdateManyMutationInput = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.sku !== undefined) {
    data.sku = input.sku;
  }

  if (input.barcode !== undefined) {
    data.barcode = input.barcode;
  }

  if (input.category !== undefined) {
    data.category = input.category;
  }

  if (input.sellingPrice !== undefined) {
    data.sellingPrice = input.sellingPrice;
  }

  if (input.costPrice !== undefined) {
    data.costPrice = input.costPrice;
  }

  if (input.isService !== undefined) {
    data.isService = input.isService;
  }

  if (input.unitType !== undefined) {
    data.unitType = input.unitType;
  }

  if (input.taxRate !== undefined) {
    data.taxRate = input.taxRate;
  }

  if (input.status !== undefined) {
    data.status = input.status;
  }

  return data;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(user: RequestUser, input: CreateProductInput): Promise<ProductListItem> {
    if (!user.organizationId) {
      throw new BadRequestException({
        code: 'OrganizationRequired',
        message: 'Organization is required.',
      });
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          organizationId: user.organizationId,
          name: input.name,
          sku: input.sku,
          barcode: input.barcode,
          category: input.category,
          sellingPrice: input.sellingPrice,
          costPrice: input.costPrice ?? 0,
          isService: input.isService ?? false,
          currentStock: input.isService ? 0 : (input.currentStock ?? 0),
          reorderLevel: input.isService ? 0 : (input.reorderLevel ?? 0),
          unitType: input.unitType ?? 'PCS',
          taxRate: input.taxRate ?? 0,
          status: 'ACTIVE',
        },
      });

      return serializeProduct(product);
    } catch (error) {
      if (getErrorCode(error) === 'P2002') {
        throw new ConflictException({
          code: 'DuplicateSku',
          message: 'SKU already exists in this organization.',
        });
      }

      throw error;
    }
  }

  async getProducts(user: RequestUser, query: ProductsQueryInput): Promise<ProductListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();
    const where: Prisma.ProductWhereInput = {
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
          sku: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          barcode: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(serializeProduct);
  }

  async getProduct(user: RequestUser, id: ProductIdInput['id']): Promise<ProductListItem> {
    const product = await this.findProduct(user, id);

    if (!product) {
      throw new NotFoundException({
        code: 'ProductNotFound',
        message: 'Product not found.',
      });
    }

    return serializeProduct(product);
  }

  async updateProduct(
    user: RequestUser,
    id: ProductIdInput['id'],
    input: UpdateProductInput,
  ): Promise<ProductListItem> {
    const organizationId = this.requireOrganizationId(user);
    const data = buildProductUpdateData(input);

    try {
      const updatedProduct = await this.prisma.$transaction(async (tx) => {
        const result = await tx.product.updateMany({
          where: {
            id,
            organizationId,
          },
          data,
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
    } catch (error) {
      if (getErrorCode(error) === 'P2002') {
        throw new ConflictException({
          code: 'DuplicateSku',
          message: 'SKU already exists in this organization.',
        });
      }

      throw error;
    }
  }

  async deleteProduct(user: RequestUser, id: ProductIdInput['id']): Promise<void> {
    const organizationId = this.requireOrganizationId(user);
    const result = await this.prisma.product.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException({
        code: 'ProductNotFound',
        message: 'Product not found.',
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

  private async findProduct(user: RequestUser, id: string): Promise<Product | null> {
    const organizationId = this.requireOrganizationId(user);
    return this.prisma.product.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }
}
