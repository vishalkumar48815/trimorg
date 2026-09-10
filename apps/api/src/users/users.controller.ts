import { Body, Controller, Get, Patch, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { UsersService, type UserProfile } from './users.service';
import { UpdateProfileDto } from './users.schemas';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: RequestUser | null): Promise<ApiSuccess<UserProfile>> {
    const profile = await this.usersService.getProfile(this.requireUser(user).id);
    return createSuccessResponse(profile);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: RequestUser | null,
    @Body() body: UpdateProfileDto,
  ): Promise<ApiSuccess<UserProfile>> {
    const profile = await this.usersService.updateProfile(this.requireUser(user).id, body);
    return createSuccessResponse(profile);
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
