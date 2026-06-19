import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ContributorGuard } from '../common/guards/contributor.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { toMediaDto } from '../common/memorial-mapper';
import {
  GlobalConfirmUploadDto,
  GlobalPresignUploadDto,
} from './dto/media.dto';

/** MVP media upload routes — memorialId in request body. */
@Controller('media')
export class MediaUploadController {
  constructor(private readonly media: MediaService) {}

  @UseGuards(AdminAuthGuard, ContributorGuard)
  @Post('presigned-url')
  presign(@Body() dto: GlobalPresignUploadDto) {
    const { memorialId, ...upload } = dto;
    return this.media.presignUpload(memorialId, upload);
  }

  @UseGuards(AdminAuthGuard, ContributorGuard)
  @Post('complete-upload')
  async complete(
    @Body() dto: GlobalConfirmUploadDto,
    @CurrentUser() user: AuthUserPayload,
  ) {
    const { memorialId, ...confirm } = dto;
    const record = await this.media.confirmUpload(
      memorialId,
      user.sub,
      confirm,
    );
    return toMediaDto(record);
  }
}
