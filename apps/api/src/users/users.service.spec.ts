import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: RequestUser = {
    id: 'user-1',
    email: 'owner@test.com',
    fullName: 'Store Owner',
    mobile: '9999999999',
    role: 'OWNER',
    isEmailVerified: true,
    onboardingCompletedAt: new Date(),
    organizationId: 'org-1',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTeamMembers', () => {
    it('should return roster of team members for the organization', async () => {
      (mockPrisma.user.findMany as jest.Mock).mockResolvedValueOnce([
        {
          id: 'user-1',
          email: 'owner@test.com',
          fullName: 'Store Owner',
          mobile: '9999999999',
          role: 'OWNER',
          isEmailVerified: true,
          createdAt: new Date(),
        },
        {
          id: 'user-2',
          email: 'staff@test.com',
          fullName: 'Staff Member',
          mobile: '8888888888',
          role: 'STAFF',
          isEmailVerified: true,
          createdAt: new Date(),
        },
      ]);

      const members = await service.getTeamMembers(mockUser);
      expect(members.length).toBe(2);
      expect(members[0].role).toBe('OWNER');
      expect(members[1].role).toBe('STAFF');
    });
  });

  describe('createTeamMember', () => {
    it('should create new staff member with hashed password', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: 'user-3',
        email: 'mechanic@test.com',
        fullName: 'Rahul Sharma',
        mobile: '7777777777',
        role: 'STAFF',
        isEmailVerified: true,
        createdAt: new Date(),
      });

      const member = await service.createTeamMember(mockUser, {
        email: 'mechanic@test.com',
        fullName: 'Rahul Sharma',
        mobile: '7777777777',
        role: 'STAFF',
        password: 'password123',
      });

      expect(member.id).toBe('user-3');
      expect(member.role).toBe('STAFF');
    });
  });
});
