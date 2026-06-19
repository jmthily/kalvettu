import { Injectable } from '@nestjs/common';
import { AuthUserPayload, ContributorRole, MembershipKind, ProfileRecord } from '../common/types';
import { ProfilesService } from '../profiles/profiles.service';
import { ADMIN_USER_SUB } from '../auth/auth.service';

export interface ProfileMembership {
  profile: ProfileRecord;
  role: ContributorRole;
  membershipKind: MembershipKind;
  relationshipLabel?: string | null;
}

@Injectable()
export class MembershipService {
  constructor(private readonly profiles: ProfilesService) {}

  /** Phase 1 — single admin sees all memorials they own. */
  async listForUser(_user: AuthUserPayload): Promise<ProfileMembership[]> {
    const profiles = await this.profiles.listByOwner(ADMIN_USER_SUB);
    return profiles.map((profile) => ({
      profile,
      role: 'owner' as const,
      membershipKind: 'owner' as const,
      relationshipLabel: null,
    }));
  }
}
