import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';

@Controller('profiles/:profileId/contributors')
export class ContributorsController {
  constructor(private readonly contributors: ContributorsService) {}

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Get()
  list(@Param('profileId') profileId: string) {
    return this.contributors.list(profileId);
  }
}
