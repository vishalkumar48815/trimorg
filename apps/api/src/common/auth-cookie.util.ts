import type { Response } from 'express';
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_TTL_SECONDS } from './auth-cookie.constants';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
};

export function setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
  response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_BASE_OPTIONS,
    path: '/',
    maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
  });

  response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_BASE_OPTIONS,
    path: '/api/v1/auth',
    maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
  });
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/v1/auth' });
}
