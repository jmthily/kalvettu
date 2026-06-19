import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ALLOWED_TYPES: Record<string, string[]> = {
  photo: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/webm'],
  document: ['application/pdf', 'image/jpeg', 'image/png'],
};

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;
  private maxBytes: number;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('aws.region');
    this.client = new S3Client({ region });
    this.bucket = this.config.get<string>('s3.bucket') ?? 'kalvettu-media';
    this.maxBytes = this.config.get<number>('s3.maxUploadBytes') ?? 52428800;
  }

  validateUpload(mediaType: string, contentType: string, size: number) {
    const allowed = ALLOWED_TYPES[mediaType];
    if (!allowed?.includes(contentType)) {
      throw new BadRequestException(`File type ${contentType} not allowed for ${mediaType}`);
    }
    if (size > this.maxBytes) {
      throw new BadRequestException('File exceeds maximum upload size');
    }
  }

  buildKey(profileId: string, mediaId: string, mediaType: string, ext: string): string {
    const folder =
      mediaType === 'photo'
        ? 'photos'
        : mediaType === 'video'
          ? 'videos'
          : mediaType === 'audio'
            ? 'audio'
            : 'documents';
    return `profiles/${profileId}/${folder}/${mediaId}.${ext}`;
  }

  async getUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.client, command, { expiresIn: 900 });
  }

  async getReadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}
