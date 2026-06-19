import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import { S3Service } from '../s3/s3.service';
import { MediaRecord, MediaType, PrivacyLevel } from '../common/types';
import { isoNow, newId } from '../common/utils';
import { ConfirmUploadDto, PresignUploadDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly db: DynamoDbService,
    private readonly s3: S3Service,
  ) {}

  private table() {
    return this.db.table('media');
  }

  async presignUpload(
    profileId: string,
    dto: PresignUploadDto,
  ): Promise<{ mediaId: string; fileKey: string; uploadUrl: string }> {
    this.s3.validateUpload(dto.mediaType, dto.contentType, dto.fileSize);
    const mediaId = newId();
    const fileKey = this.s3.buildKey(profileId, mediaId, dto.mediaType, dto.fileExtension);
    const uploadUrl = await this.s3.getUploadUrl(fileKey, dto.contentType);
    return { mediaId, fileKey, uploadUrl };
  }

  async confirmUpload(
    profileId: string,
    userSub: string,
    dto: ConfirmUploadDto,
  ): Promise<MediaRecord> {
    const readUrl = await this.s3.getReadUrl(dto.fileKey);
    const record: MediaRecord = {
      profileId,
      mediaId: dto.mediaId,
      uploadedByUserSub: userSub,
      mediaType: dto.mediaType as MediaType,
      fileKey: dto.fileKey,
      fileUrl: readUrl,
      caption: dto.caption,
      privacyLevel: (dto.privacyLevel as PrivacyLevel) ?? 'family',
      approved: false,
      createdAt: isoNow(),
    };
    await this.db.put(this.table(), record);
    return record;
  }

  async list(profileId: string, publicApprovedOnly = false): Promise<MediaRecord[]> {
    const items = await this.db.query<MediaRecord>(this.table(), {
      KeyConditionExpression: 'profileId = :pid',
      ExpressionAttributeValues: { ':pid': profileId },
    });
    if (!publicApprovedOnly) {
      return Promise.all(
        items.map(async (m) => ({
          ...m,
          fileUrl: await this.s3.getReadUrl(m.fileKey),
        })),
      );
    }
    const approved = items.filter((m) => m.approved && m.privacyLevel === 'public');
    return Promise.all(
      approved.map(async (m) => ({
        ...m,
        fileUrl: await this.s3.getReadUrl(m.fileKey),
      })),
    );
  }

  async setApproved(profileId: string, mediaId: string, approved: boolean) {
    const item = await this.db.get<MediaRecord>(this.table(), { profileId, mediaId });
    if (!item) throw new NotFoundException('Media not found');
    item.approved = approved;
    await this.db.put(this.table(), item);
    return item;
  }

  async delete(profileId: string, mediaId: string): Promise<void> {
    await this.db.delete(this.table(), { profileId, mediaId });
  }
}
