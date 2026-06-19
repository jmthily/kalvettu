import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

/** Sets req.user when a valid token is present; does not require auth. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    if (auth?.startsWith('Bearer ')) {
      try {
        req.user = this.auth.verifyToken(auth.slice(7));
      } catch {
        req.user = null;
      }
    }
    return true;
  }
}
