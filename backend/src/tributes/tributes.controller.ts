import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoriesService } from '../stories/stories.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { toTribute } from '../common/memorial-mapper';
import { CreateTributeDto, TributeActionDto } from './dto/tribute.dto';

@Controller('memorials/:memorialId/tributes')
export class MemorialTributesController {
  constructor(private readonly stories: StoriesService) {}

  @Get('public')
  async listPublic(@Param('memorialId') memorialId: string) {
    const tributes = await this.stories.listTributes(memorialId, true);
    return tributes.map(toTribute);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  async list(@Param('memorialId') memorialId: string) {
    const tributes = await this.stories.listTributes(memorialId);
    return tributes.map(toTribute);
  }

  @UseGuards(OptionalAuthGuard)
  @Post()
  async createPublic(
    @Param('memorialId') memorialId: string,
    @Body() dto: CreateTributeDto,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    const story = await this.stories.create(
      memorialId,
      user?.sub,
      {
        storyType: 'tribute',
        content: dto.message,
        contributorName: dto.name,
        contributorRelationship: dto.relationship,
        privacyLevel: 'public',
      },
      false,
    );
    return toTribute(story);
  }
}

@Controller('tributes')
export class TributesActionController {
  constructor(private readonly stories: StoriesService) {}

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post(':tributeId/approve')
  async approve(
    @Param('tributeId') tributeId: string,
    @Body() dto: TributeActionDto,
  ) {
    const story = await this.stories.setApproved(
      dto.memorialId,
      tributeId,
      true,
    );
    return toTribute(story);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post(':tributeId/reject')
  async reject(
    @Param('tributeId') tributeId: string,
    @Body() dto: TributeActionDto,
  ) {
    const story = await this.stories.setApproved(
      dto.memorialId,
      tributeId,
      false,
    );
    return toTribute(story);
  }
}
