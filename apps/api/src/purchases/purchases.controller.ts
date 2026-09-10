import {
  Body,
  Controller,
  Get,
  Param,
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
import { PurchasesService } from './purchases.service';
import {
  CreatePurchaseDto,
  PurchaseIdDto,
  PurchasesQueryDto,
} from './purchases.schemas';
import type { PurchaseDetail, PurchaseListItem } from './purchases.types';

@Controller('purchases')
@UseGuards(AuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  async createPurchase(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreatePurchaseDto,
  ): Promise<ApiSuccess<PurchaseDetail>> {
    const purchase = await this.purchasesService.createPurchase(this.requireUser(user), body);
    return createSuccessResponse(purchase);
  }

  @Get()
  async getPurchases(
    @CurrentUser() user: RequestUser | null,
    @Query() query: PurchasesQueryDto,
  ): Promise<ApiSuccess<PurchaseListItem[]>> {
    const purchases = await this.purchasesService.getPurchases(this.requireUser(user), query);
    return createSuccessResponse(purchases);
  }

  @Get(':id')
  async getPurchase(
    @CurrentUser() user: RequestUser | null,
    @Param() params: PurchaseIdDto,
  ): Promise<ApiSuccess<PurchaseDetail>> {
    const purchase = await this.purchasesService.getPurchase(this.requireUser(user), params.id);
    return createSuccessResponse(purchase);
  }

  @Post(':id/receive')
  async receivePurchase(
    @CurrentUser() user: RequestUser | null,
    @Param() params: PurchaseIdDto,
  ): Promise<ApiSuccess<PurchaseDetail>> {
    const purchase = await this.purchasesService.receivePurchase(this.requireUser(user), params.id);
    return createSuccessResponse(purchase);
  }

  @Post(':id/cancel')
  async cancelPurchase(
    @CurrentUser() user: RequestUser | null,
    @Param() params: PurchaseIdDto,
  ): Promise<ApiSuccess<PurchaseDetail>> {
    const purchase = await this.purchasesService.cancelPurchase(this.requireUser(user), params.id);
    return createSuccessResponse(purchase);
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
