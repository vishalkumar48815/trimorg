import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/auth-token.util';
import type { RequestUser } from '../common/request-user.type';
import type {
  CreateTeamMemberInput,
  UpdateProfileInput,
  UpdateTeamMemberRoleInput,
} from './users.schemas';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
}

export interface TeamMemberItem {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
}

function serializeProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    mobile: user.mobile,
  };
}

function serializeTeamMember(user: User): TeamMemberItem {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    mobile: user.mobile,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'User not found.',
      });
    }

    return serializeProfile(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: input.fullName,
        mobile: input.mobile,
      },
    });

    return serializeProfile(user);
  }

  async getTeamMembers(user: RequestUser): Promise<TeamMemberItem[]> {
    const organizationId = this.requireOrganizationId(user);

    const members = await this.prisma.user.findMany({
      where: {
        organizationId,
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return members.map(serializeTeamMember);
  }

  async createTeamMember(
    user: RequestUser,
    input: CreateTeamMemberInput,
  ): Promise<TeamMemberItem> {
    const organizationId = this.requireOrganizationId(user);

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      throw new ForbiddenException({
        code: 'InsufficientPermissions',
        message: 'Only Owners and Admins can add team members.',
      });
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EmailAlreadyInUse',
        message: 'A user with this email address already exists.',
      });
    }

    const passwordHash = await hashPassword(input.password);

    const createdMember = await this.prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        mobile: input.mobile,
        role: input.role,
        passwordHash,
        organizationId,
        isEmailVerified: true,
        onboardingCompletedAt: new Date(),
      },
    });

    return serializeTeamMember(createdMember);
  }

  async updateTeamMemberRole(
    user: RequestUser,
    memberId: string,
    input: UpdateTeamMemberRoleInput,
  ): Promise<TeamMemberItem> {
    const organizationId = this.requireOrganizationId(user);

    if (user.role !== 'OWNER') {
      throw new ForbiddenException({
        code: 'OwnerPermissionRequired',
        message: 'Only the store owner can modify staff roles.',
      });
    }

    const targetUser = await this.prisma.user.findFirst({
      where: { id: memberId, organizationId },
    });

    if (!targetUser) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'Team member not found.',
      });
    }

    if (targetUser.role === 'OWNER') {
      throw new BadRequestException({
        code: 'CannotChangeOwnerRole',
        message: 'The organization owner role cannot be changed.',
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: memberId },
      data: {
        role: input.role,
      },
    });

    return serializeTeamMember(updated);
  }

  async deleteTeamMember(
    user: RequestUser,
    memberId: string,
  ): Promise<{ message: string }> {
    const organizationId = this.requireOrganizationId(user);

    if (user.role !== 'OWNER') {
      throw new ForbiddenException({
        code: 'OwnerPermissionRequired',
        message: 'Only the store owner can remove team members.',
      });
    }

    if (user.id === memberId) {
      throw new BadRequestException({
        code: 'CannotDeleteSelf',
        message: 'You cannot remove your own owner account.',
      });
    }

    const targetUser = await this.prisma.user.findFirst({
      where: { id: memberId, organizationId },
    });

    if (!targetUser) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'Team member not found.',
      });
    }

    if (targetUser.role === 'OWNER') {
      throw new BadRequestException({
        code: 'CannotDeleteOwner',
        message: 'The organization owner account cannot be deleted.',
      });
    }

    await this.prisma.user.delete({
      where: { id: memberId },
    });

    return { message: 'Team member removed successfully.' };
  }

  private requireOrganizationId(user: RequestUser): string {
    if (!user.organizationId) {
      throw new BadRequestException({
        code: 'OrganizationRequired',
        message: 'Organization is required.',
      });
    }

    return user.organizationId;
  }
}
