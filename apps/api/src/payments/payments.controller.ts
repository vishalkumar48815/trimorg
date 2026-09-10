import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { PaymentsService } from './payments.service';
import { PaymentsQueryDto, RecordPaymentDto } from './payments.schemas';
import type {
  DueInvoiceItem,
  PaymentListItem,
  PaymentsResponse,
} from './payments.types';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getPayments(
    @CurrentUser() user: RequestUser | null,
    @Query() query: PaymentsQueryDto,
  ): Promise<ApiSuccess<PaymentsResponse>> {
    const data = await this.paymentsService.getPayments(this.requireUser(user), query);
    return createSuccessResponse(data);
  }

  @Get('due-invoices')
  async getDueInvoices(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<DueInvoiceItem[]>> {
    const data = await this.paymentsService.getDueInvoices(this.requireUser(user));
    return createSuccessResponse(data);
  }

  @Post()
  async recordPayment(
    @CurrentUser() user: RequestUser | null,
    @Body() body: RecordPaymentDto,
  ): Promise<ApiSuccess<PaymentListItem>> {
    const data = await this.paymentsService.recordPayment(this.requireUser(user), body);
    return createSuccessResponse(data);
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
