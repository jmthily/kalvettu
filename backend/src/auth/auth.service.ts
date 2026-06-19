import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { AuthUserPayload, AdminRecord } from '../common/types';
import { isoNow } from '../common/utils';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export const ADMIN_USER_SUB = 'admin';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DynamoDbService,
    private readonly config: ConfigService,
  ) {}

  private adminsTable() {
    return this.config.get<string>('dynamodb.admins') ?? 'KalvettuAdmins';
  }

  private jwtSecret(): string {
    const secret = this.config.get<string>('auth.jwtSecret');
    if (!secret) throw new Error('JWT_SECRET is not configured');
    return secret;
  }

  async countAdmins(): Promise<number> {
    const admins = await this.db.scan<AdminRecord>(this.adminsTable());
    return admins.length;
  }

  async setupAdmin(email: string, password: string): Promise<{ success: boolean }> {
    const count = await this.countAdmins();
    if (count > 0) {
      throw new BadRequestException('Admin account already exists');
    }
    const normalized = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    await this.db.put(this.adminsTable(), {
      email: normalized,
      passwordHash,
      createdAt: isoNow(),
    });
    return { success: true };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; email: string }> {
    const normalized = email.trim().toLowerCase();
    const admin = await this.db.get<AdminRecord>(this.adminsTable(), {
      email: normalized,
    });
    if (!admin) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    const accessToken = this.signAdminToken(normalized);
    return { accessToken, email: normalized };
  }

  signAdminToken(email: string): string {
    const payload: AuthUserPayload = {
      sub: ADMIN_USER_SUB,
      email,
      role: 'admin',
    };
    return jwt.sign(payload, this.jwtSecret(), { expiresIn: '7d' });
  }

  signShareToken(profileId: string, tokenHash: string): string {
    const payload: AuthUserPayload = {
      sub: `share:${tokenHash}`,
      role: 'share',
      profileId,
      tokenHash,
    };
    return jwt.sign(payload, this.jwtSecret(), { expiresIn: '30d' });
  }

  verifyToken(token: string): AuthUserPayload {
    try {
      return jwt.verify(token, this.jwtSecret()) as AuthUserPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
