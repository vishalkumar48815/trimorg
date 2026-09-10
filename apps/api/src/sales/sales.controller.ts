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
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { SalesService } from './sales.service';
import { CreateSaleDto, SaleIdDto, SalesQueryDto } from './sales.schemas';
import type { SaleDetail, SaleListItem } from './sales.types';

@Controller('sales')
@UseGuards(AuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateSaleDto,
  ): Promise<ApiSuccess<SaleDetail>> {
    const sale = await this.salesService.createSale(this.requireUser(user), body);
    return createSuccessResponse(sale);
  }

  @Get()
  async getSales(
    @CurrentUser() user: RequestUser | null,
    @Query() query: SalesQueryDto,
  ): Promise<ApiSuccess<SaleListItem[]>> {
    const sales = await this.salesService.getSales(this.requireUser(user), query);
    return createSuccessResponse(sales);
  }

  @Get(':id')
  async getSale(
    @CurrentUser() user: RequestUser | null,
    @Param() params: SaleIdDto,
  ): Promise<ApiSuccess<SaleDetail>> {
    const sale = await this.salesService.getSale(this.requireUser(user), params.id);
    return createSuccessResponse(sale);
  }

  @Post(':id/convert-to-invoice')
  async convertQuotationToInvoice(
    @CurrentUser() user: RequestUser | null,
    @Param() params: SaleIdDto,
  ): Promise<ApiSuccess<SaleDetail>> {
    const invoice = await this.salesService.convertQuotationToInvoice(
      this.requireUser(user),
      params.id,
    );
    return createSuccessResponse(invoice);
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
