import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { ProfileOwnerGuard } from '../common/guards/profile-owner.guard';
import { CurrentUser } from '../auth/user.decorator';
import type { AuthUserPayload, InviteType } from '../common/types';
import { RespondInviteDto } from './dto/respond-invite.dto';
import { SendFamilyInviteDto } from './dto/send-family-invite.dto';
import { SendFriendInviteDto } from './dto/send-friend-invite.dto';

@Controller()
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post('profiles/:profileId/share-links')
  createShareLink(@Param('profileId') profileId: string) {
    return this.invites.createShareLink(profileId);
  }

  @Get('share/:token')
  getShare(@Param('token') token: string) {
    return this.invites.getShareByToken(token);
  }

  @Post('share/:token/open')
  openShare(@Param('token') token: string) {
    return this.invites.openShareLink(token);
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post('profiles/:profileId/people/:personId/invite')
  sendInviteByPerson(
    @Param('profileId') profileId: string,
    @Param('personId') personId: string,
  ) {
    return this.invites.sendFamilyInvite(profileId, { personId });
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post('profiles/:profileId/invites/family')
  sendFamilyInvite(
    @Param('profileId') profileId: string,
    @Body() dto: SendFamilyInviteDto,
  ) {
    return this.invites.sendFamilyInvite(profileId, {
      personId: dto.personId,
      email: dto.email,
    });
  }

  @UseGuards(AdminAuthGuard, ProfileOwnerGuard)
  @Post('profiles/:profileId/invites/friend')
  sendFriendInvite(
    @Param('profileId') profileId: string,
    @Body() dto: SendFriendInviteDto,
  ) {
    return this.invites.sendFriendInvite(profileId, dto.email, dto.inviteeName);
  }

  @Get('invites/family/:token')
  getFamilyInvite(@Param('token') token: string) {
    return this.invites.getByToken(token, 'family');
  }

  @Get('invites/friend/:token')
  getFriendInvite(@Param('token') token: string) {
    return this.invites.getByToken(token, 'friend');
  }

  @Get('invites/:token')
  getInviteLegacy(@Param('token') token: string) {
    return this.invites.getByToken(token);
  }

  @UseGuards(OptionalAuthGuard)
  @Post('invites/family/:token/respond')
  respondFamily(
    @Param('token') token: string,
    @Body() dto: RespondInviteDto,
    @CurrentUser() user: AuthUserPayload | undefined,
  ) {
    return this.invites.respond(
      token,
      dto.action,
      user ?? null,
      dto.correctionMessage,
      'family' satisfies InviteType,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Post('invites/friend/:token/respond')
  respondFriend(
    @Param('token') token: string,
    @Body() dto: RespondInviteDto,
    @CurrentUser() user: AuthUserPayload | undefined,
  ) {
    return this.invites.respond(
      token,
      dto.action,
      user ?? null,
      dto.correctionMessage,
      'friend' satisfies InviteType,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Post('invites/:token/respond')
  respondLegacy(
    @Param('token') token: string,
    @Body() dto: RespondInviteDto,
    @CurrentUser() user: AuthUserPayload | undefined,
  ) {
    return this.invites.respond(token, dto.action, user ?? null, dto.correctionMessage);
  }
}
