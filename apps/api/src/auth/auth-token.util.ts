import { createHash, randomBytes, randomInt, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scryptCallback);
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, PASSWORD_KEY_BYTES)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}
