import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { createSuccessResponse } from '../common/api-response';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.type';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './auth.schemas';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);
    return createSuccessResponse(result);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(body, response);
    return createSuccessResponse(result);
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout(request, response);
    return createSuccessResponse(result);
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refresh(request, response);
    return createSuccessResponse(result);
  }

  @Get('session')
  async session(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.getSession(request, response);
    return createSuccessResponse(result);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(body);
    return createSuccessResponse(result);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const result = await this.authService.resetPassword(body);
    return createSuccessResponse(result);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(body);
    return createSuccessResponse(result);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    const result = await this.authService.resendOtp(body);
    return createSuccessResponse(result);
  }

  @Get('me')
  async me(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.getSession(request, response);
    return createSuccessResponse(result);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@CurrentUser() user: RequestUser | null, @Body() body: ChangePasswordDto) {
    if (!user) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    const result = await this.authService.changePassword(user.id, body);
    return createSuccessResponse(result);
  }
}
