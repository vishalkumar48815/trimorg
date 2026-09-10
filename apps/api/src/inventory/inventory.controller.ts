import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse } from '../common/api-response';
import type { ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { InventoryService } from './inventory.service';
import { ProductIdDto, UpdateProductStockDto } from './inventory.schemas';
import type { ProductListItem } from '../products/products.types';

@Controller('products')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('low-stock')
  async getLowStockProducts(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<ProductListItem[]>> {
    const products = await this.inventoryService.getLowStockProducts(this.requireUser(user));
    return createSuccessResponse(products);
  }

  @Patch(':id/stock')
  async updateProductStock(
    @CurrentUser() user: RequestUser | null,
    @Param() params: ProductIdDto,
    @Body() body: UpdateProductStockDto,
  ): Promise<ApiSuccess<ProductListItem>> {
    const product = await this.inventoryService.updateProductStock(
      this.requireUser(user),
      params.id,
      body,
    );

    return createSuccessResponse(product);
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
