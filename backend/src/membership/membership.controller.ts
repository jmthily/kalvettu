import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload } from '../common/types';
import { MembershipService } from './membership.service';

@Controller('profiles')
export class MembershipController {
  constructor(private readonly membership: MembershipService) {}

  @UseGuards(AdminAuthGuard)
  @Get('memberships')
  listMemberships(@CurrentUser() user: AuthUserPayload) {
    return this.membership.listForUser(user);
  }
}
