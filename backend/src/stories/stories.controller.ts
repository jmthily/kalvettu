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
import { StoriesService } from './stories.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { ContributorGuard } from '../common/guards/contributor.guard';
import { TributeContributorGuard } from '../common/guards/tribute-contributor.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { ApproveStoryDto, CreateStoryDto } from './dto/story.dto';

@Controller('profiles/:profileId/stories')
export class StoriesController {
  constructor(private readonly stories: StoriesService) {}

  @Get('public')
  listPublic(@Param('profileId') profileId: string) {
    return this.stories.list(profileId, true);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  list(@Param('profileId') profileId: string) {
    return this.stories.list(profileId);
  }

  @UseGuards(OptionalAuthGuard)
  @Post('public-tribute')
  publicTribute(
    @Param('profileId') profileId: string,
    @Body() dto: CreateStoryDto,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    return this.stories.create(profileId, user?.sub, dto, false);
  }

  @UseGuards(AdminAuthGuard, TributeContributorGuard)
  @Post()
  create(
    @Param('profileId') profileId: string,
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateStoryDto,
  ) {
    return this.stories.create(profileId, user.sub, dto, false);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':storyId/approve')
  approve(
    @Param('profileId') profileId: string,
    @Param('storyId') storyId: string,
    @Body() dto: ApproveStoryDto,
  ) {
    return this.stories.setApproved(profileId, storyId, dto.approved);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':storyId')
  async remove(
    @Param('profileId') profileId: string,
    @Param('storyId') storyId: string,
  ) {
    await this.stories.delete(profileId, storyId);
    return { success: true };
  }
}
