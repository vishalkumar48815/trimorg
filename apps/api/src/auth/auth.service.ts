import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Organization, PendingSignup, User } from '@prisma/client';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { promisify } from 'node:util';
import { PrismaService } from '../prisma/prisma.service';
import { clearAuthCookies, setAuthCookies } from '../common/auth-cookie.util';
import { generateToken, generateVerificationCode, hashToken } from './auth-token.util';
import type {
  AuthResult,
  SessionOrganization,
  SessionUser,
  TokenPair,
  UserRecord,
} from './auth.types';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendOtpInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from './auth.schemas';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from './auth.constants';
import { AuthMailService } from './auth-mail.service';
import { REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_COOKIE } from '../common/auth-cookie.constants';

interface JwtSessionPayload {
  sub: string;
}

const scryptAsync = promisify(scryptCallback);
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;

function isDateValid(date: Date | null | undefined): boolean {
  if (!date) {
    return false;
  }

  return date.getTime() > Date.now();
}

function buildVerificationCodeState(): {
  verificationCode: string;
  verificationCodeHash: string;
  verificationExpiresAt: Date;
} {
  const verificationCode = generateVerificationCode();

  return {
    verificationCode,
    verificationCodeHash: hashToken(verificationCode),
    verificationExpiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
  };
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, PASSWORD_KEY_BYTES)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  const [salt, hash] = passwordHash.split(':');
  if (!salt || !hash) {
    return false;
  }

  const derivedKey = (await scryptAsync(password, salt, PASSWORD_KEY_BYTES)) as Buffer;
  const expectedKey = Buffer.from(hash, 'hex');

  if (expectedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(expectedKey, derivedKey);
}

function serializeUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    mobile: user.mobile,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    onboardingCompletedAt: user.onboardingCompletedAt,
    organizationId: user.organizationId,
  };
}

function serializeOrganization(organization: Organization | null): SessionOrganization | null {
  if (!organization) {
    return null;
  }

  return {
    id: organization.id,
    businessName: organization.businessName,
    businessType: organization.businessType,
    ownerName: organization.ownerName,
    mobile: organization.mobile,
    gst: organization.gst,
    addressLine1: organization.addressLine1,
    addressLine2: organization.addressLine2,
    city: organization.city,
    state: organization.state,
    postalCode: organization.postalCode,
    country: organization.country,
    currencyCode: organization.currencyCode,
    timezone: organization.timezone,
    financialYearStartMonth: organization.financialYearStartMonth,
    logoUrl: organization.logoUrl,
    logoMimeType: organization.logoMimeType,
    logoFileName: organization.logoFileName,
    status: organization.status,
    onboardingCompletedAt: organization.onboardingCompletedAt,
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authMailService: AuthMailService,
  ) {}

  async register(input: RegisterInput): Promise<{ requiresVerification: true; message?: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new ConflictException({
          code: 'EmailAlreadyRegistered',
          message: 'Email already registered.',
        });
      }

      const verificationCodeState = this.issueVerificationCode();

      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          fullName: input.fullName,
          mobile: input.mobile,
          passwordHash: await hashPassword(input.password),
          emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
          emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
        },
      });

      if (existingUser.organizationId && existingUser.organization) {
        await this.prisma.organization.update({
          where: { id: existingUser.organizationId },
          data: {
            businessName: input.businessName,
            ownerName: input.fullName,
            mobile: input.mobile,
          },
        });
      }

      await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

      return {
        requiresVerification: true,
        message: 'Account already exists but is not verified. A new OTP has been generated.',
      };
    }

    const existingPendingSignup = await this.prisma.pendingSignup.findUnique({
      where: { email: input.email },
    });

    if (existingPendingSignup) {
      const verificationCodeState = this.issueVerificationCode();

      await this.prisma.pendingSignup.update({
        where: { email: input.email },
        data: {
          fullName: input.fullName,
          businessName: input.businessName,
          mobile: input.mobile,
          passwordHash: await hashPassword(input.password),
          emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
          emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
        },
      });

      await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

      return {
        requiresVerification: true,
        message: 'Account already exists but is not verified. A new OTP has been generated.',
      };
    }

    const passwordHash = await hashPassword(input.password);
    const verificationCodeState = this.issueVerificationCode();

    await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          businessName: input.businessName,
          businessType: 'Pending',
          ownerName: input.fullName,
          mobile: input.mobile,
        },
      });

      await tx.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          mobile: input.mobile,
          passwordHash,
          emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
          emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
          organizationId: organization.id,
        },
      });
    });

    await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

    return {
      requiresVerification: true,
    };
  }

  async login(input: LoginInput, response: Response): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (user) {
      const isPasswordValid = await verifyPassword(user.passwordHash, input.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException({
          code: 'InvalidCredentials',
          message: 'Invalid email or password.',
        });
      }

      if (!user.isEmailVerified) {
        const verificationCodeState = this.issueVerificationCode();

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
            emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
          },
        });

        await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

        throw new ForbiddenException({
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Email not verified.',
          requiresVerification: true,
          details: {
            requiresVerification: true,
          },
        });
      }

      const authResult = await this.issueAuthSession(user);
      setAuthCookies(response, authResult.tokens.accessToken, authResult.tokens.refreshToken);
      return authResult;
    }

    const pendingSignup = await this.prisma.pendingSignup.findUnique({
      where: { email: input.email },
    });

    if (!pendingSignup) {
      throw new UnauthorizedException({
        code: 'InvalidCredentials',
        message: 'Invalid email or password.',
      });
    }

    const isPasswordValid = await verifyPassword(pendingSignup.passwordHash, input.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'InvalidCredentials',
        message: 'Invalid email or password.',
      });
    }

    const verificationCodeState = this.issueVerificationCode();

    await this.prisma.pendingSignup.update({
      where: { email: pendingSignup.email },
      data: {
        emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
        emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
      },
    });

    await this.printVerificationCode(pendingSignup.email, verificationCodeState.verificationCode);

    throw new ForbiddenException({
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Email not verified.',
      requiresVerification: true,
      details: {
        requiresVerification: true,
      },
    });
  }

  async logout(request: Request, response: Response): Promise<{ message: string }> {
    const refreshToken = this.getCookieValue(request, REFRESH_TOKEN_COOKIE);

    if (refreshToken) {
      const user = await this.findUserByRefreshToken(refreshToken);
      if (user) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
          },
        });
      }
    }

    clearAuthCookies(response);
    return { message: 'Signed out successfully.' };
  }

  async refresh(request: Request, response: Response): Promise<AuthResult> {
    const refreshToken = this.getCookieValue(request, REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      throw new UnauthorizedException({
        code: 'RefreshTokenMissing',
        message: 'Refresh token is missing.',
      });
    }

    const user = await this.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException({
        code: 'RefreshTokenInvalid',
        message: 'Refresh token is invalid.',
      });
    }

    const authResult = await this.issueAuthSession(user);
    setAuthCookies(response, authResult.tokens.accessToken, authResult.tokens.refreshToken);
    return authResult;
  }

  async getSession(request: Request, response?: Response): Promise<AuthResult> {
    const accessSession = await this.resolveAccessSession(request);
    if (accessSession) {
      return accessSession;
    }

    const refreshToken = this.getCookieValue(request, REFRESH_TOKEN_COOKIE);
    if (!refreshToken || !response) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    const user = await this.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    const authResult = await this.issueAuthSession(user);
    setAuthCookies(response, authResult.tokens.accessToken, authResult.tokens.refreshToken);
    return authResult;
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      return {
        message: 'If an account exists for that email, a reset link has been sent.',
      };
    }

    const resetToken = generateToken();
    const resetTokenHash = hashToken(resetToken);
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: resetExpiresAt,
      },
    });

    await this.authMailService.sendPasswordResetEmail(
      user.email,
      this.buildFrontendLink('/reset-password', resetToken),
    );

    return {
      message: 'If an account exists for that email, a reset link has been sent.',
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const user = await this.findUserByToken(
      'passwordResetTokenHash',
      'passwordResetExpiresAt',
      input.token,
    );
    if (!user) {
      throw new BadRequestException({
        code: 'PasswordResetTokenInvalid',
        message: 'Reset token is invalid or has expired.',
      });
    }

    const passwordHash = await hashPassword(input.password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });

    return {
      message: 'Password updated successfully.',
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    const isCurrentPasswordValid = await verifyPassword(user.passwordHash, input.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException({
        code: 'InvalidCurrentPassword',
        message: 'Current password is incorrect.',
      });
    }

    const passwordHash = await hashPassword(input.newPassword);

    // Mirrors resetPassword: invalidate the refresh token so other sessions require
    // a fresh login, without forcing an abrupt logout of the current session.
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });

    return {
      message: 'Password updated successfully.',
    };
  }

  async verifyEmail(input: VerifyEmailInput): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (user && !user.isEmailVerified) {
      this.assertVerificationCodeIsValid(
        user.emailVerificationTokenHash,
        user.emailVerificationExpiresAt,
        input.otp,
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationTokenHash: null,
          emailVerificationExpiresAt: null,
        },
      });

      return {
        message: 'Email verified successfully.',
      };
    }

    if (user?.isEmailVerified) {
      throw new BadRequestException({
        code: 'EMAIL_ALREADY_VERIFIED',
        message: 'Email is already verified.',
      });
    }

    const pendingSignup = await this.prisma.pendingSignup.findUnique({
      where: { email: input.email },
    });

    if (pendingSignup) {
      this.assertVerificationCodeIsValid(
        pendingSignup.emailVerificationTokenHash,
        pendingSignup.emailVerificationExpiresAt,
        input.otp,
      );

      await this.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            businessName: pendingSignup.businessName,
            businessType: 'Pending',
            ownerName: pendingSignup.fullName,
            mobile: pendingSignup.mobile,
          },
        });

        await tx.user.create({
          data: {
            email: pendingSignup.email,
            fullName: pendingSignup.fullName,
            mobile: pendingSignup.mobile,
            passwordHash: pendingSignup.passwordHash,
            isEmailVerified: true,
            organizationId: organization.id,
          },
        });

        await tx.pendingSignup.delete({
          where: { id: pendingSignup.id },
        });
      });

      return {
        message: 'Email verified successfully.',
      };
    }

    throw new BadRequestException({
      code: 'EMAIL_VERIFICATION_INVALID',
      message: 'Email verification failed.',
    });
  }

  async resendOtp(input: ResendOtpInput): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (user) {
      if (user.isEmailVerified) {
        throw new ConflictException({
          code: 'EmailAlreadyRegistered',
          message: 'Email already registered.',
        });
      }

      const verificationCodeState = this.issueVerificationCode();

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
          emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
        },
      });

      await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

      return {
        message: 'OTP resent successfully.',
      };
    }

    const pendingSignup = await this.prisma.pendingSignup.findUnique({
      where: { email: input.email },
    });

    if (pendingSignup) {
      const verificationCodeState = this.issueVerificationCode();

      await this.prisma.pendingSignup.update({
        where: { email: pendingSignup.email },
        data: {
          emailVerificationTokenHash: verificationCodeState.verificationCodeHash,
          emailVerificationExpiresAt: verificationCodeState.verificationExpiresAt,
        },
      });

      await this.printVerificationCode(input.email, verificationCodeState.verificationCode);

      return {
        message: 'OTP resent successfully.',
      };
    }

    throw new BadRequestException({
      code: 'EMAIL_NOT_FOUND',
      message: 'No account found for that email.',
    });
  }

  async resolveAccessSession(request: Request): Promise<AuthResult | null> {
    const accessToken = this.getCookieValue(request, ACCESS_TOKEN_COOKIE);
    if (!accessToken) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtSessionPayload>(accessToken, {
        secret: this.getAccessSecret(),
      });
      const user = await this.findUserById(payload.sub);
      if (!user) {
        return null;
      }

      return this.buildAuthResult(user);
    } catch {
      return null;
    }
  }

  private async issueAuthSession(user: UserRecord): Promise<AuthResult> {
    const tokens = await this.createTokenPair(user.id);
    const refreshTokenHash = hashToken(tokens.refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const storedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
        refreshTokenExpiresAt,
      },
      include: { organization: true },
    });

    return {
      user: serializeUser(storedUser),
      organization: serializeOrganization(storedUser.organization),
      tokens,
    };
  }

  private async createTokenPair(userId: string): Promise<TokenPair> {
    const payload: JwtSessionPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: ACCESS_TOKEN_TTL,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }

  private buildAuthResult(user: UserRecord): AuthResult {
    return {
      user: serializeUser(user),
      organization: serializeOrganization(user.organization),
      tokens: {
        accessToken: '',
        refreshToken: '',
      },
    };
  }

  private async findUserById(userId: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });
  }

  private async findUserByRefreshToken(refreshToken: string): Promise<UserRecord | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtSessionPayload>(refreshToken, {
        secret: this.getRefreshSecret(),
      });
      const user = await this.findUserById(payload.sub);
      if (!user || !user.refreshTokenHash || !isDateValid(user.refreshTokenExpiresAt)) {
        return null;
      }

      return hashToken(refreshToken) === user.refreshTokenHash ? user : null;
    } catch {
      return null;
    }
  }

  private async findUserByToken(
    hashField: 'emailVerificationTokenHash' | 'passwordResetTokenHash',
    expiresField: 'emailVerificationExpiresAt' | 'passwordResetExpiresAt',
    token: string,
  ): Promise<UserRecord | null> {
    const tokenHash = hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: {
        [hashField]: tokenHash,
        [expiresField]: {
          gt: new Date(),
        },
      },
      include: { organization: true },
    });

    return user;
  }

  private async findPendingSignupByToken(token: string): Promise<PendingSignup | null> {
    const tokenHash = hashToken(token);
    return this.prisma.pendingSignup.findFirst({
      where: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  private async completePendingSignup(pendingSignup: PendingSignup): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          businessName: pendingSignup.businessName,
          businessType: 'Pending',
          ownerName: pendingSignup.fullName,
          mobile: pendingSignup.mobile,
        },
      });

      await tx.user.create({
        data: {
          email: pendingSignup.email,
          fullName: pendingSignup.fullName,
          mobile: pendingSignup.mobile,
          passwordHash: pendingSignup.passwordHash,
          isEmailVerified: true,
          organizationId: organization.id,
        },
      });

      await tx.pendingSignup.delete({
        where: { id: pendingSignup.id },
      });
    });
  }

  private issueVerificationCode(): {
    verificationCode: string;
    verificationCodeHash: string;
    verificationExpiresAt: Date;
  } {
    return buildVerificationCodeState();
  }

  private async printVerificationCode(email: string, verificationCode: string): Promise<void> {
    await this.authMailService.sendVerificationEmail(email, verificationCode);
  }

  private assertVerificationCodeIsValid(
    storedHash: string | null,
    expiresAt: Date | null,
    providedCode: string,
  ): void {
    if (!storedHash || !expiresAt) {
      throw new BadRequestException({
        code: 'EMAIL_VERIFICATION_INVALID',
        message: 'Email verification failed.',
      });
    }

    if (expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException({
        code: 'EMAIL_VERIFICATION_EXPIRED',
        message: 'Email verification code has expired.',
      });
    }

    if (storedHash !== hashToken(providedCode)) {
      throw new BadRequestException({
        code: 'EMAIL_VERIFICATION_INVALID',
        message: 'Email verification failed.',
      });
    }
  }

  private getCookieValue(request: Request, cookieName: string): string | undefined {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    return cookies?.[cookieName];
  }

  private getAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET') ?? 'trimorg-access-secret';
  }

  private getRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'trimorg-refresh-secret';
  }

  private buildFrontendLink(path: string, token: string): string {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
    return `${frontendUrl}${path}?token=${encodeURIComponent(token)}`;
  }
}
