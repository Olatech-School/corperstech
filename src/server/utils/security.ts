import crypto from 'crypto';

/**
 * Hashes a plain-text password using SHA-256 algorithm.
 */
export function hashPassword(password: string): string {
  if (!password) return '';
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verifies a plain-text password against a hashed value.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
