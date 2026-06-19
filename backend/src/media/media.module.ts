import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaUploadController } from './media-upload.controller';
import { MediaService } from './media.service';
import { S3Module } from '../s3/s3.module';
import { GuardsModule } from '../common/guards/guards.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ContributorsModule } from '../contributors/contributors.module';

@Module({
  imports: [S3Module, GuardsModule, ProfilesModule, ContributorsModule],
  controllers: [MediaController, MediaUploadController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
