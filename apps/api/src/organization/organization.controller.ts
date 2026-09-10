import { Body, Controller, Get, Patch, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { OrganizationService, type OrganizationProfile } from './organization.service';
import { UpdateOrganizationDto } from './organization.schemas';

@Controller('organization')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async getOrganization(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<OrganizationProfile>> {
    const organization = await this.organizationService.getForUser(this.requireUser(user).id);
    return createSuccessResponse(organization);
  }

  @Patch()
  async updateOrganization(
    @CurrentUser() user: RequestUser | null,
    @Body() body: UpdateOrganizationDto,
  ): Promise<ApiSuccess<OrganizationProfile>> {
    const organization = await this.organizationService.updateForUser(
      this.requireUser(user).id,
      body,
    );
    return createSuccessResponse(organization);
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
