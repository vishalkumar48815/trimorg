import { Controller, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.type';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import { ReportsService } from './reports.service';
import { SalesReportQueryDto } from './reports.schemas';
import type { InventoryReportResponse, SalesReportResponse } from './reports.types';

@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  async getSalesReport(
    @CurrentUser() user: RequestUser | null,
    @Query() query: SalesReportQueryDto,
  ): Promise<ApiSuccess<SalesReportResponse>> {
    const validUser = this.requireUser(user);
    const data = await this.reportsService.getSalesReport(
      validUser,
      query.startDate,
      query.endDate,
    );
    return createSuccessResponse(data);
  }

  @Get('inventory')
  async getInventoryReport(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<InventoryReportResponse>> {
    const validUser = this.requireUser(user);
    const data = await this.reportsService.getInventoryReport(validUser);
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
