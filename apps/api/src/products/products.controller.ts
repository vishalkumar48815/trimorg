import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse } from '../common/api-response';
import type { ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductIdDto,
  ProductsQueryDto,
  UpdateProductDto,
} from './products.schemas';
import type { ProductListItem } from './products.types';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateProductDto,
  ): Promise<ApiSuccess<ProductListItem>> {
    const product = await this.productsService.createProduct(this.requireUser(user), body);
    return createSuccessResponse(product);
  }

  @Get()
  async getProducts(
    @CurrentUser() user: RequestUser | null,
    @Query() query: ProductsQueryDto,
  ): Promise<ApiSuccess<ProductListItem[]>> {
    const products = await this.productsService.getProducts(this.requireUser(user), query);
    return createSuccessResponse(products);
  }

  @Get(':id')
  async getProduct(
    @CurrentUser() user: RequestUser | null,
    @Param() params: ProductIdDto,
  ): Promise<ApiSuccess<ProductListItem>> {
    const product = await this.productsService.getProduct(this.requireUser(user), params.id);
    return createSuccessResponse(product);
  }

  @Patch(':id')
  async updateProduct(
    @CurrentUser() user: RequestUser | null,
    @Param() params: ProductIdDto,
    @Body() body: UpdateProductDto,
  ): Promise<ApiSuccess<ProductListItem>> {
    const product = await this.productsService.updateProduct(
      this.requireUser(user),
      params.id,
      body,
    );
    return createSuccessResponse(product);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(
    @CurrentUser() user: RequestUser | null,
    @Param() params: ProductIdDto,
  ): Promise<void> {
    await this.productsService.deleteProduct(this.requireUser(user), params.id);
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
