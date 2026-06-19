import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { ContributorRecord, AuthUserPayload, ContributorRole } from '../common/types';
import { isoNow } from '../common/utils';

/** Higher rank wins when the same person accepts multiple invite types on one memorial */
const ROLE_RANK: Record<ContributorRole, number> = {
  owner: 50,
  admin: 40,
  contributor: 30,
  viewer: 20,
  friend: 10,
};

@Injectable()
export class ContributorsService {
  constructor(private readonly db: DynamoDbService) {}

  private table() {
    return this.db.table('contributors');
  }

  async ensureOwner(profileId: string, user: AuthUserPayload): Promise<void> {
    const existing = await this.findOne(profileId, user.sub);
    if (existing) return;
    const record: ContributorRecord = {
      profileId,
      userSub: user.sub,
      email: user.email ?? '',
      name: user.email,
      role: 'owner',
      createdAt: isoNow(),
    };
    await this.db.put(this.table(), record);
  }

  async findOne(profileId: string, userSub: string): Promise<ContributorRecord | null> {
    return this.db.get<ContributorRecord>(this.table(), { profileId, userSub });
  }

  async findByEmail(profileId: string, email: string): Promise<ContributorRecord | null> {
    const normalized = email.trim().toLowerCase();
    const contributors = await this.list(profileId);
    return (
      contributors.find((c) => c.email.trim().toLowerCase() === normalized) ?? null
    );
  }

  async list(profileId: string): Promise<ContributorRecord[]> {
    return this.db.query<ContributorRecord>(this.table(), {
      KeyConditionExpression: 'profileId = :pid',
      ExpressionAttributeValues: { ':pid': profileId },
    });
  }

  /** All memorials this account participates in (any role) */
  async listByUserSub(userSub: string): Promise<ContributorRecord[]> {
    return this.db.scan<ContributorRecord>(this.table(), {
      FilterExpression: 'userSub = :sub',
      ExpressionAttributeValues: { ':sub': userSub },
    });
  }

  async upsertContributor(
    profileId: string,
    userSub: string,
    email: string,
    name: string | undefined,
    role: ContributorRole,
  ): Promise<ContributorRecord> {
    const existing = await this.findOne(profileId, userSub);
    const now = isoNow();

    if (existing && ROLE_RANK[existing.role] > ROLE_RANK[role]) {
      const kept: ContributorRecord = {
        ...existing,
        email: existing.email || email,
        name: existing.name || name,
      };
      await this.db.put(this.table(), kept);
      return kept;
    }

    const record: ContributorRecord = {
      profileId,
      userSub,
      email,
      name: name ?? existing?.name,
      role,
      createdAt: existing?.createdAt ?? now,
    };
    await this.db.put(this.table(), record);
    return record;
  }

  async delete(profileId: string, userSub: string): Promise<void> {
    await this.db.delete(this.table(), { profileId, userSub });
  }

  isFamilyRole(role: ContributorRole): boolean {
    return ['owner', 'admin', 'contributor'].includes(role);
  }
}
