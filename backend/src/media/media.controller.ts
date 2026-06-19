import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ContributorGuard } from '../common/guards/contributor.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { ApproveMediaDto, ConfirmUploadDto, PresignUploadDto } from './dto/media.dto';

@Controller('profiles/:profileId/media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get('public')
  listPublic(@Param('profileId') profileId: string) {
    return this.media.list(profileId, true);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  list(@Param('profileId') profileId: string) {
    return this.media.list(profileId);
  }

  @UseGuards(AdminAuthGuard, ContributorGuard)
  @Post('presign')
  presign(@Param('profileId') profileId: string, @Body() dto: PresignUploadDto) {
    return this.media.presignUpload(profileId, dto);
  }

  @UseGuards(AdminAuthGuard, ContributorGuard)
  @Post('confirm')
  confirm(
    @Param('profileId') profileId: string,
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: ConfirmUploadDto,
  ) {
    return this.media.confirmUpload(profileId, user.sub, dto);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':mediaId/approve')
  approve(
    @Param('profileId') profileId: string,
    @Param('mediaId') mediaId: string,
    @Body() dto: ApproveMediaDto,
  ) {
    return this.media.setApproved(profileId, mediaId, dto.approved);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':mediaId')
  async remove(
    @Param('profileId') profileId: string,
    @Param('mediaId') mediaId: string,
  ) {
    await this.media.delete(profileId, mediaId);
    return { success: true };
  }
}
