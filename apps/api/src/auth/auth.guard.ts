import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const session = await this.authService.resolveAccessSession(request);

    if (!session) {
      throw new UnauthorizedException({
        code: 'Unauthorized',
        message: 'Authentication is required.',
      });
    }

    request.user = session.user;
    return true;
  }
}
