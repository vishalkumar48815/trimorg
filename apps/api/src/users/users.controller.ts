import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { createSuccessResponse, type ApiSuccess } from '../common/api-response';
import type { RequestUser } from '../common/request-user.type';
import { UsersService, type TeamMemberItem, type UserProfile } from './users.service';
import {
  CreateTeamMemberDto,
  TeamMemberIdDto,
  UpdateProfileDto,
  UpdateTeamMemberRoleDto,
} from './users.schemas';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: RequestUser | null): Promise<ApiSuccess<UserProfile>> {
    const profile = await this.usersService.getProfile(this.requireUser(user).id);
    return createSuccessResponse(profile);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: RequestUser | null,
    @Body() body: UpdateProfileDto,
  ): Promise<ApiSuccess<UserProfile>> {
    const profile = await this.usersService.updateProfile(this.requireUser(user).id, body);
    return createSuccessResponse(profile);
  }

  @Get('team')
  async getTeamMembers(
    @CurrentUser() user: RequestUser | null,
  ): Promise<ApiSuccess<TeamMemberItem[]>> {
    const members = await this.usersService.getTeamMembers(this.requireUser(user));
    return createSuccessResponse(members);
  }

  @Post('team')
  async createTeamMember(
    @CurrentUser() user: RequestUser | null,
    @Body() body: CreateTeamMemberDto,
  ): Promise<ApiSuccess<TeamMemberItem>> {
    const member = await this.usersService.createTeamMember(this.requireUser(user), body);
    return createSuccessResponse(member);
  }

  @Patch('team/:id/role')
  async updateTeamMemberRole(
    @CurrentUser() user: RequestUser | null,
    @Param() params: TeamMemberIdDto,
    @Body() body: UpdateTeamMemberRoleDto,
  ): Promise<ApiSuccess<TeamMemberItem>> {
    const member = await this.usersService.updateTeamMemberRole(
      this.requireUser(user),
      params.id,
      body,
    );
    return createSuccessResponse(member);
  }

  @Delete('team/:id')
  async deleteTeamMember(
    @CurrentUser() user: RequestUser | null,
    @Param() params: TeamMemberIdDto,
  ): Promise<ApiSuccess<{ message: string }>> {
    const result = await this.usersService.deleteTeamMember(
      this.requireUser(user),
      params.id,
    );
    return createSuccessResponse(result);
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
