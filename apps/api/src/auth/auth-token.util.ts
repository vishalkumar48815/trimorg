import { createHash, randomBytes, randomInt } from 'crypto';

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
