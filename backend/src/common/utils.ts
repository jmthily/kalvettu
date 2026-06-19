import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export function newId(): string {
  return uuidv4();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate a secure invite token and its SHA-256 hash for storage */
export function generateInviteToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  return { token, tokenHash };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
