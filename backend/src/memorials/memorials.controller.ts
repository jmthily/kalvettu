import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { ContributorsService } from '../contributors/contributors.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { ADMIN_USER_SUB } from '../auth/auth.service';
import { toMemorial } from '../common/memorial-mapper';
import { CreateMemorialDto, UpdateMemorialDto } from './dto/memorial.dto';
import {
  memorialToCreateProfile,
  memorialToUpdateProfile,
} from './memorial-mapper.util';

@Controller('memorials')
export class MemorialsController {
  constructor(
    private readonly profiles: ProfilesService,
    private readonly contributors: ContributorsService,
  ) {}

  @Get('public/:slug')
  async getPublic(@Param('slug') slug: string) {
    const profile = await this.profiles.findBySlug(slug);
    if (!profile || profile.privacyLevel !== 'public') {
      throw new NotFoundException('Memorial not found');
    }
    return toMemorial(profile);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  async list() {
    const profiles = await this.profiles.listAll();
    return profiles
      .filter((p) => p.profileType === 'memorial')
      .map(toMemorial);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    const profile = await this.profiles.findById(id);
    if (!profile) throw new NotFoundException('Memorial not found');
    return toMemorial(profile);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateMemorialDto,
  ) {
    const profile = await this.profiles.create(
      ADMIN_USER_SUB,
      memorialToCreateProfile(dto),
    );
    await this.contributors.ensureOwner(profile.profileId, user);
    return toMemorial(profile);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMemorialDto) {
    const profile = await this.profiles.update(
      id,
      memorialToUpdateProfile(dto),
    );
    return toMemorial(profile);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.profiles.delete(id);
    return { success: true };
  }
}
