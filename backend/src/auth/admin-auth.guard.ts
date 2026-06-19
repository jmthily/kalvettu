import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserPayload } from '../common/types';

/** Validates Bearer JWT (admin or share contributor). */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const user = this.auth.verifyToken(auth.slice(7));
    req.user = user as AuthUserPayload;
    return true;
  }
}
