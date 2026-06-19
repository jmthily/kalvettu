import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { StoryRecord, PrivacyLevel, StoryType } from '../common/types';
import { isoNow, newId } from '../common/utils';
import { CreateStoryDto } from './dto/story.dto';

@Injectable()
export class StoriesService {
  constructor(private readonly db: DynamoDbService) {}

  private table() {
    return this.db.table('stories');
  }

  async create(
    profileId: string,
    userSub: string | undefined,
    dto: CreateStoryDto,
    autoApprove = false,
  ): Promise<StoryRecord> {
    const storyId = newId();
    const record: StoryRecord = {
      profileId,
      storyId,
      contributorUserSub: userSub,
      personId: dto.personId,
      storyType: (dto.storyType as StoryType) ?? 'tribute',
      title: dto.title,
      content: dto.content ?? dto.message ?? '',
      mediaUrl: dto.mediaUrl,
      contributorName: dto.contributorName ?? dto.name,
      contributorRelationship: dto.contributorRelationship ?? dto.relationship,
      privacyLevel: (dto.privacyLevel as PrivacyLevel) ?? 'public',
      approved: autoApprove,
      createdAt: isoNow(),
    };
    await this.db.put(this.table(), record);
    return record;
  }

  async list(profileId: string, approvedOnly = false): Promise<StoryRecord[]> {
    const stories = await this.db.query<StoryRecord>(this.table(), {
      KeyConditionExpression: 'profileId = :pid',
      ExpressionAttributeValues: { ':pid': profileId },
    });
    if (!approvedOnly) return stories;
    return stories.filter((s) => s.approved && s.privacyLevel === 'public');
  }

  async listTributes(
    profileId: string,
    approvedOnly = false,
  ): Promise<StoryRecord[]> {
    const stories = await this.list(profileId, approvedOnly);
    return stories.filter((s) => s.storyType === 'tribute');
  }

  async findOne(profileId: string, storyId: string): Promise<StoryRecord | null> {
    return this.db.get<StoryRecord>(this.table(), { profileId, storyId });
  }

  async setApproved(profileId: string, storyId: string, approved: boolean) {
    const story = await this.findOne(profileId, storyId);
    if (!story) throw new NotFoundException('Story not found');
    story.approved = approved;
    await this.db.put(this.table(), story);
    return story;
  }

  async delete(profileId: string, storyId: string): Promise<void> {
    await this.db.delete(this.table(), { profileId, storyId });
  }
}
