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
import { ProfilesService } from './profiles.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { ContributorsService } from '../contributors/contributors.service';
import { ADMIN_USER_SUB } from '../auth/auth.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profiles: ProfilesService,
    private readonly contributors: ContributorsService,
  ) {}

  @Get('public/:slug')
  async getPublic(@Param('slug') slug: string) {
    const profile = await this.profiles.findBySlug(slug);
    if (!profile || profile.privacyLevel !== 'public') {
      return { error: 'Not found' };
    }
    return profile;
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  list() {
    return this.profiles.listAll();
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.profiles.findById(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateProfileDto,
  ) {
    const profile = await this.profiles.create(ADMIN_USER_SUB, dto);
    await this.contributors.ensureOwner(profile.profileId, user);
    return profile;
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(id, dto);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.profiles.delete(id);
    return { success: true };
  }
}
