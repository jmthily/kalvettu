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

/** Admin or share contributor — for stories and tributes. */
@Injectable()
export class TributeContributorGuard implements CanActivate {
  constructor(private readonly profiles: ProfilesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const profileId =
      req.params.profileId ??
      req.params.id ??
      req.params.memorialId;
    const user = req.user as AuthUserPayload | undefined;
    if (!user?.sub) throw new ForbiddenException();

    const profile = await this.profiles.findById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    if (user.role === 'admin' && user.sub === ADMIN_USER_SUB) return true;
    if (user.role === 'share' && user.profileId === profileId) return true;

    throw new ForbiddenException('Contributor access required');
  }
}
