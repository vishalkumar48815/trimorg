import { Body, Controller, Get, Patch, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { AuthGuard } from '../auth/auth.guard';
import { OnboardingService, type OnboardingStatus } from './onboarding.service';
import {
  AddressStepDto,
  BusinessStepDto,
  LogoStepDto,
  OrganizationStepDto,
  PreferencesStepDto,
} from './onboarding.schemas';
import type { ApiSuccess } from '../common/api-response';

@Controller('onboarding')
@UseGuards(AuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('current')
  async getCurrent(@CurrentUser() user: RequestUser | null): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.getStatus(this.requireUser(user).id);
    return createSuccessResponse(status);
  }

  @Patch('business')
  async saveBusiness(
    @CurrentUser() user: RequestUser | null,
    @Body() body: BusinessStepDto,
  ): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.saveBusinessStep(this.requireUser(user).id, body);
    return createSuccessResponse(status);
  }

  @Post('organization')
  async saveOrganization(
    @CurrentUser() user: RequestUser | null,
    @Body() body: OrganizationStepDto,
  ): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.saveOrganizationStep(this.requireUser(user).id, body);
    return createSuccessResponse(status);
  }

  @Patch('address')
  async saveAddress(
    @CurrentUser() user: RequestUser | null,
    @Body() body: AddressStepDto,
  ): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.saveAddressStep(this.requireUser(user).id, body);
    return createSuccessResponse(status);
  }

  @Put('preferences')
  async savePreferences(
    @CurrentUser() user: RequestUser | null,
    @Body() body: PreferencesStepDto,
  ): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.savePreferencesStep(this.requireUser(user).id, body);
    return createSuccessResponse(status);
  }

  @Put('logo')
  async saveLogo(
    @CurrentUser() user: RequestUser | null,
    @Body() body: LogoStepDto,
  ): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.saveLogoStep(this.requireUser(user).id, body);
    return createSuccessResponse(status);
  }

  @Post('complete')
  async complete(@CurrentUser() user: RequestUser | null): Promise<ApiSuccess<OnboardingStatus>> {
    const status = await this.onboardingService.complete(this.requireUser(user).id);
    return createSuccessResponse(status);
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
