import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from '../../profiles/profiles.service';
import { AuthUserPayload } from '../types';
import { ADMIN_USER_SUB } from '../../auth/auth.service';

/** Phase 1: single admin owns all memorials. */
@Injectable()
export class ProfileOwnerGuard implements CanActivate {
  constructor(private readonly profiles: ProfilesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const profileId =
      req.params.profileId ??
      req.params.id ??
      req.params.memorialId ??
      req.body?.memorialId ??
      req.body?.profileId;
    const user = req.user as AuthUserPayload | undefined;
    if (!user?.sub) throw new ForbiddenException();

    const profile = await this.profiles.findById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (user.role === 'admin' && user.sub === ADMIN_USER_SUB) return true;
    throw new ForbiddenException('Not authorized for this profile');
  }
}
