import { Controller, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.type';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import { DashboardService } from './dashboard.service';
import type { DashboardMetricsResponse } from './dashboard.types';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<DashboardMetricsResponse>> {
    const validUser = this.requireUser(user);
    const data = await this.dashboardService.getMetrics(validUser);
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
