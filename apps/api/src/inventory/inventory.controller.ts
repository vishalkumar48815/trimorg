import {
  Body,
  Controller,
  Get,
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
import { InventoryService } from './inventory.service';
import {
  AdjustStockDto,
  ProductIdDto,
  StockMovementsQueryDto,
  UpdateProductStockDto,
} from './inventory.schemas';
import type { ProductListItem } from '../products/products.types';
import type {
  AdjustStockResult,
  InventorySummary,
  StockMovementListItem,
} from './inventory.types';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('summary')
  async getInventorySummary(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<InventorySummary>> {
    const summary = await this.inventoryService.getInventorySummary(this.requireUser(user));
    return createSuccessResponse(summary);
  }

  @Get('movements')
  async getStockMovements(
    @CurrentUser() user: RequestUser | null,
    @Query() query: StockMovementsQueryDto,
  ): Promise<ApiSuccess<StockMovementListItem[]>> {
    const movements = await this.inventoryService.getStockMovements(
      this.requireUser(user),
      query,
    );
    return createSuccessResponse(movements);
  }

  @Post('adjust')
  async adjustStock(
    @CurrentUser() user: RequestUser | null,
    @Body() body: AdjustStockDto,
  ): Promise<ApiSuccess<AdjustStockResult>> {
    const result = await this.inventoryService.adjustStock(this.requireUser(user), body);
    return createSuccessResponse(result);
  }

  @Get('low-stock')
  async getLowStockProducts(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<ProductListItem[]>> {
    const products = await this.inventoryService.getLowStockProducts(this.requireUser(user));
    return createSuccessResponse(products);
  }

  @Patch('products/:id/stock')
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
