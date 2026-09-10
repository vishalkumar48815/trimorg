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
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  CustomerIdDto,
  CustomersQueryDto,
  UpdateCustomerDto,
} from './customers.schemas';
import type { CustomerDetail, CustomerListItem, CustomerSaleItem } from './customers.types';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateCustomerDto,
  ): Promise<ApiSuccess<CustomerListItem>> {
    const customer = await this.customersService.createCustomer(this.requireUser(user), body);
    return createSuccessResponse(customer);
  }

  @Get()
  async getCustomers(
    @CurrentUser() user: RequestUser | null,
    @Query() query: CustomersQueryDto,
  ): Promise<ApiSuccess<CustomerListItem[]>> {
    const customers = await this.customersService.getCustomers(this.requireUser(user), query);
    return createSuccessResponse(customers);
  }

  @Get(':id')
  async getCustomer(
    @CurrentUser() user: RequestUser | null,
    @Param() params: CustomerIdDto,
  ): Promise<ApiSuccess<CustomerDetail>> {
    const customer = await this.customersService.getCustomer(this.requireUser(user), params.id);
    return createSuccessResponse(customer);
  }

  @Patch(':id')
  async updateCustomer(
    @CurrentUser() user: RequestUser | null,
    @Param() params: CustomerIdDto,
    @Body() body: UpdateCustomerDto,
  ): Promise<ApiSuccess<CustomerListItem>> {
    const customer = await this.customersService.updateCustomer(
      this.requireUser(user),
      params.id,
      body,
    );
    return createSuccessResponse(customer);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCustomer(
    @CurrentUser() user: RequestUser | null,
    @Param() params: CustomerIdDto,
  ): Promise<void> {
    await this.customersService.deleteCustomer(this.requireUser(user), params.id);
  }

  @Get(':id/sales')
  async getCustomerSales(
    @CurrentUser() user: RequestUser | null,
    @Param() params: CustomerIdDto,
  ): Promise<ApiSuccess<CustomerSaleItem[]>> {
    const sales = await this.customersService.getCustomerSales(this.requireUser(user), params.id);
    return createSuccessResponse(sales);
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
