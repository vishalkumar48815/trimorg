import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import type { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type { CreateCategoryInput } from './categories.schemas';
import type { CategoryListItem } from './categories.types';

function serializeCategory(category: Category): CategoryListItem {
  return {
    id: category.id,
    name: category.name,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const code = Reflect.get(error, 'code');
  return typeof code === 'string' ? code : undefined;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(user: RequestUser, input: CreateCategoryInput): Promise<CategoryListItem> {
    const organizationId = this.requireOrganizationId(user);
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        organizationId,
        name: {
          equals: input.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCategory) {
      throw new ConflictException({
        code: 'DuplicateCategoryName',
        message: 'Category already exists in this organization.',
      });
    }

    try {
      const category = await this.prisma.category.create({
        data: {
          organizationId,
          name: input.name,
          status: 'ACTIVE',
        },
      });

      return serializeCategory(category);
    } catch (error) {
      if (getErrorCode(error) === 'P2002') {
        throw new ConflictException({
          code: 'DuplicateCategoryName',
          message: 'Category already exists in this organization.',
        });
      }

      throw error;
    }
  }

  async getCategories(user: RequestUser): Promise<CategoryListItem[]> {
    const organizationId = this.requireOrganizationId(user);
    const categories = await this.prisma.category.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories.map(serializeCategory);
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
