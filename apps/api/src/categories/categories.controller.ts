import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse } from '../common/api-response';
import type { ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './categories.schemas';
import type { CategoryListItem } from './categories.types';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateCategoryDto,
  ): Promise<ApiSuccess<CategoryListItem>> {
    const category = await this.categoriesService.createCategory(this.requireUser(user), body);
    return createSuccessResponse(category);
  }

  @Get()
  async getCategories(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<CategoryListItem[]>> {
    const categories = await this.categoriesService.getCategories(this.requireUser(user));
    return createSuccessResponse(categories);
  }

  private requireUser(user: RequestUser | null): RequestUser {
    if (!user) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    return user;
  }
}
