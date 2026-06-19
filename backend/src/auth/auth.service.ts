import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { SesService } from '../ses/ses.service';
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
    private readonly ses: SesService,
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

  private assertAdmin(user: AuthUserPayload): string {
    if (user.role !== 'admin' || user.sub !== ADMIN_USER_SUB || !user.email) {
      throw new ForbiddenException('Admin access required');
    }
    return user.email;
  }

  async changePassword(
    user: AuthUserPayload,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const email = this.assertAdmin(user);
    const admin = await this.db.get<AdminRecord>(this.adminsTable(), { email });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.db.put(this.adminsTable(), admin);
    return { success: true };
  }

  private signPasswordResetToken(email: string): string {
    return jwt.sign({ email, purpose: 'password_reset' }, this.jwtSecret(), {
      expiresIn: '1h',
    });
  }

  /** Always returns success — do not reveal whether the email exists. */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const normalized = email.trim().toLowerCase();
    const admin = await this.db.get<AdminRecord>(this.adminsTable(), {
      email: normalized,
    });

    if (admin) {
      const token = this.signPasswordResetToken(normalized);
      const siteUrl =
        this.config.get<string>('app.publicUrl') ?? 'http://localhost:3020';
      const resetLink = `${siteUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
      await this.ses.sendPasswordResetEmail(normalized, resetLink);
    }

    return {
      success: true,
      message:
        'If an account exists for that email, a reset link has been sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    let payload: { email?: string; purpose?: string };
    try {
      payload = jwt.verify(token, this.jwtSecret()) as {
        email?: string;
        purpose?: string;
      };
    } catch {
      throw new BadRequestException('Invalid or expired reset link');
    }

    if (payload.purpose !== 'password_reset' || !payload.email) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const admin = await this.db.get<AdminRecord>(this.adminsTable(), {
      email: payload.email,
    });
    if (!admin) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.db.put(this.adminsTable(), admin);
    return { success: true };
  }
}
