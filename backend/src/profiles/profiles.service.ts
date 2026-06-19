import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { ProfileRecord, PrivacyLevel, ProfileType } from '../common/types';
import { isoNow, newId, slugify } from '../common/utils';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly db: DynamoDbService) {}

  private table() {
    return this.db.table('profiles');
  }

  async create(ownerUserSub: string, dto: CreateProfileDto): Promise<ProfileRecord> {
    const profileId = newId();
    let slug = slugify(dto.fullName);
    const clash = await this.findBySlug(slug);
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;

    const now = isoNow();
    const privacyLevel: PrivacyLevel =
      (dto.privacyLevel as PrivacyLevel) ??
      (dto.profileType === 'living' ? 'private' : 'family');

    const record: ProfileRecord = {
      profileId,
      ownerUserSub,
      slug,
      profileType: dto.profileType as ProfileType,
      fullName: dto.fullName,
      tamilName: dto.tamilName,
      sinhalaName: dto.sinhalaName,
      knownAs: dto.knownAs,
      village: dto.village,
      district: dto.district,
      countryOfBirth: dto.countryOfBirth ?? 'Sri Lanka',
      dateOfBirth: dto.dateOfBirth,
      dateOfPassing: dto.dateOfPassing,
      shortBio: dto.shortBio,
      lifeHistory: dto.lifeHistory,
      migrationStory: dto.migrationStory,
      education: dto.education,
      career: dto.career,
      marriageFamilyLife: dto.marriageFamilyLife,
      communityContribution: dto.communityContribution,
      favouriteSayings: dto.favouriteSayings,
      lifeLessons: dto.lifeLessons,
      blessings: dto.blessings,
      profilePhotoUrl: dto.profilePhotoUrl,
      privacyLevel,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.put(this.table(), record);
    return record;
  }

  async findById(profileId: string): Promise<ProfileRecord | null> {
    return this.db.get<ProfileRecord>(this.table(), { profileId });
  }

  async findBySlug(slug: string): Promise<ProfileRecord | null> {
    const items = await this.db.query<ProfileRecord>(this.table(), {
      IndexName: 'SlugIndex',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: { ':slug': slug },
      Limit: 1,
    });
    return items[0] ?? null;
  }

  async listAll(): Promise<ProfileRecord[]> {
    return this.db.scan<ProfileRecord>(this.table());
  }

  async listByOwner(ownerUserSub: string): Promise<ProfileRecord[]> {
    return this.db.query<ProfileRecord>(this.table(), {
      IndexName: 'OwnerIndex',
      KeyConditionExpression: 'ownerUserSub = :sub',
      ExpressionAttributeValues: { ':sub': ownerUserSub },
    });
  }

  async update(profileId: string, dto: UpdateProfileDto): Promise<ProfileRecord> {
    const existing = await this.findById(profileId);
    if (!existing) throw new NotFoundException('Profile not found');

    const updated: ProfileRecord = {
      ...existing,
      ...dto,
      updatedAt: isoNow(),
    } as ProfileRecord;
    await this.db.put(this.table(), updated);
    return updated;
  }

  async delete(profileId: string): Promise<void> {
    await this.db.delete(this.table(), { profileId });
  }

  isOwner(profile: ProfileRecord, userSub: string): boolean {
    return profile.ownerUserSub === userSub;
  }
}
