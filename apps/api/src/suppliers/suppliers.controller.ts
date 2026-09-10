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
import { SuppliersService } from './suppliers.service';
import {
  CreateSupplierDto,
  SupplierIdDto,
  SuppliersQueryDto,
  UpdateSupplierDto,
} from './suppliers.schemas';
import type { SupplierDetail, SupplierListItem } from './suppliers.types';

@Controller('suppliers')
@UseGuards(AuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async createSupplier(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateSupplierDto,
  ): Promise<ApiSuccess<SupplierListItem>> {
    const supplier = await this.suppliersService.createSupplier(this.requireUser(user), body);
    return createSuccessResponse(supplier);
  }

  @Get()
  async getSuppliers(
    @CurrentUser() user: RequestUser | null,
    @Query() query: SuppliersQueryDto,
  ): Promise<ApiSuccess<SupplierListItem[]>> {
    const suppliers = await this.suppliersService.getSuppliers(this.requireUser(user), query);
    return createSuccessResponse(suppliers);
  }

  @Get(':id')
  async getSupplier(
    @CurrentUser() user: RequestUser | null,
    @Param() params: SupplierIdDto,
  ): Promise<ApiSuccess<SupplierDetail>> {
    const supplier = await this.suppliersService.getSupplier(this.requireUser(user), params.id);
    return createSuccessResponse(supplier);
  }

  @Patch(':id')
  async updateSupplier(
    @CurrentUser() user: RequestUser | null,
    @Param() params: SupplierIdDto,
    @Body() body: UpdateSupplierDto,
  ): Promise<ApiSuccess<SupplierListItem>> {
    const supplier = await this.suppliersService.updateSupplier(
      this.requireUser(user),
      params.id,
      body,
    );
    return createSuccessResponse(supplier);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSupplier(
    @CurrentUser() user: RequestUser | null,
    @Param() params: SupplierIdDto,
  ): Promise<void> {
    await this.suppliersService.deleteSupplier(this.requireUser(user), params.id);
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
