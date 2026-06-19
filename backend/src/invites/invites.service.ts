import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDbService } from '../dynamodb/dynamodb.service';
import {
  AuthUserPayload,
  InviteRecord,
  InviteType,
  PersonRecord,
} from '../common/types';
import { addDays, generateInviteToken, hashToken, isoNow } from '../common/utils';
import { PeopleService } from '../people/people.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ContributorsService } from '../contributors/contributors.service';
import { SesService } from '../ses/ses.service';
import { AuthService } from '../auth/auth.service';

interface CreateInviteParams {
  profileId: string;
  inviteType: InviteType;
  email: string;
  personId?: string;
  inviteeName?: string;
  relationshipLabel?: string;
}

@Injectable()
export class InvitesService {
  constructor(
    private readonly db: DynamoDbService,
    private readonly config: ConfigService,
    private readonly people: PeopleService,
    private readonly profiles: ProfilesService,
    private readonly contributors: ContributorsService,
    private readonly ses: SesService,
    private readonly auth: AuthService,
  ) {}

  private table() {
    return this.db.table('invites');
  }

  private inviteLink(inviteType: InviteType, token: string): string {
    const baseUrl = this.config.get<string>('app.publicUrl');
    if (inviteType === 'share') return `${baseUrl}/share/${token}`;
    return `${baseUrl}/invite/${inviteType}/${token}`;
  }

  /** Phase 1 — copy/paste share link (WhatsApp, email). No login for family. */
  async createShareLink(profileId: string): Promise<{ shareLink: string; expiresAt: string }> {
    const profile = await this.profiles.findById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    const { token, tokenHash } = generateInviteToken();
    const days = 30;

    const record: InviteRecord = {
      tokenHash,
      profileId,
      inviteType: 'share',
      email: 'share-link@local',
      status: 'pending',
      expiresAt: addDays(days),
      createdAt: isoNow(),
    };

    await this.db.put(this.table(), record);
    return {
      shareLink: this.inviteLink('share', token),
      expiresAt: record.expiresAt,
    };
  }

  /** Legacy route — family invite by person id on the tree */
  async sendInvite(profileId: string, personId: string): Promise<{ inviteLink: string; inviteType: InviteType }> {
    return this.sendFamilyInvite(profileId, { personId });
  }

  async sendFamilyInvite(
    profileId: string,
    opts: { personId?: string; email?: string },
  ): Promise<{ inviteLink: string; inviteType: InviteType; person: PersonRecord }> {
    const person = await this.resolveFamilyPerson(profileId, opts);

    if (!person.email) {
      throw new BadRequestException(
        'This family member has no email. Add their email on the family tree first.',
      );
    }
    if (person.inviteStatus === 'accepted') {
      throw new BadRequestException(
        'This family member has already accepted their invitation on this memorial',
      );
    }

    const existingContributor = await this.contributors.findByEmail(
      profileId,
      person.email,
    );
    if (existingContributor?.role === 'friend') {
      // Family invite upgrades a friend to full family contributor on this memorial
    } else if (
      existingContributor &&
      this.contributors.isFamilyRole(existingContributor.role)
    ) {
      throw new BadRequestException(
        'This person is already a family contributor on this memorial',
      );
    }

    const profile = await this.profiles.findById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    const { inviteLink } = await this.createAndSendInvite({
      profileId,
      inviteType: 'family',
      email: person.email,
      personId: person.personId,
      inviteeName: person.fullName,
      relationshipLabel: person.relationshipLabel,
    });

    return { inviteLink, inviteType: 'family', person };
  }

  async sendFriendInvite(
    profileId: string,
    email: string,
    inviteeName?: string,
  ): Promise<{ inviteLink: string; inviteType: InviteType }> {
    const normalizedEmail = email.trim().toLowerCase();
    const profile = await this.profiles.findById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    const existingContributor = await this.contributors.findByEmail(
      profileId,
      normalizedEmail,
    );
    if (existingContributor && this.contributors.isFamilyRole(existingContributor.role)) {
      throw new BadRequestException(
        'This person is already a family contributor on this memorial. Each person has one role per memorial.',
      );
    }

    const displayName = inviteeName?.trim() || normalizedEmail.split('@')[0];

    const { inviteLink } = await this.createAndSendInvite({
      profileId,
      inviteType: 'friend',
      email: normalizedEmail,
      inviteeName: displayName,
    });

    return { inviteLink, inviteType: 'friend' };
  }

  private async resolveFamilyPerson(
    profileId: string,
    opts: { personId?: string; email?: string },
  ): Promise<PersonRecord> {
    if (opts.personId) {
      const person = await this.people.findOne(profileId, opts.personId);
      if (!person) {
        throw new NotFoundException(
          'Family member not found on this tree. Add them to the family tree first.',
        );
      }
      if (opts.email && person.email?.toLowerCase() !== opts.email.trim().toLowerCase()) {
        throw new BadRequestException(
          'Email does not match this family member on the tree',
        );
      }
      return person;
    }

    if (opts.email) {
      const person = await this.people.findByEmail(profileId, opts.email);
      if (!person) {
        throw new BadRequestException(
          'No family member with this email on the tree. Add them to the family tree first.',
        );
      }
      return person;
    }

    throw new BadRequestException('Provide personId or email for a family invitation');
  }

  private async createAndSendInvite(params: CreateInviteParams): Promise<{ inviteLink: string }> {
    const { token, tokenHash } = generateInviteToken();
    const days = this.config.get<number>('app.inviteExpiryDays') ?? 7;

    const record: InviteRecord = {
      tokenHash,
      profileId: params.profileId,
      inviteType: params.inviteType,
      personId: params.personId,
      email: params.email.trim().toLowerCase(),
      inviteeName: params.inviteeName,
      status: 'pending',
      expiresAt: addDays(days),
      createdAt: isoNow(),
    };

    await this.db.put(this.table(), record);

    if (params.inviteType === 'family' && params.personId) {
      await this.people.updateInviteFields(params.profileId, params.personId, {
        inviteStatus: 'invited',
      });
    }

    const profile = await this.profiles.findById(params.profileId);
    if (!profile) throw new NotFoundException('Profile not found');

    const inviteLink = this.inviteLink(params.inviteType, token);

    if (params.inviteType === 'family' && params.personId) {
      const person = await this.people.findOne(params.profileId, params.personId);
      await this.ses.sendFamilyTreeInviteEmail(
        params.email,
        inviteLink,
        profile.fullName,
        person?.fullName ?? params.inviteeName ?? '',
        params.relationshipLabel ?? person?.relationshipLabel ?? 'family member',
      );
    } else {
      await this.ses.sendFriendTributeInviteEmail(
        params.email,
        inviteLink,
        profile.fullName,
        params.inviteeName ?? params.email,
      );
    }

    return { inviteLink };
  }

  async getShareByToken(token: string) {
    const invite = await this.loadPendingInvite(token);
    if (invite.inviteType !== 'share') {
      throw new NotFoundException('Share link not found');
    }
    return this.buildInvitePayload(invite);
  }

  async openShareLink(token: string) {
    const invite = await this.loadPendingInvite(token);
    if (invite.inviteType !== 'share') {
      throw new BadRequestException('Not a share link');
    }

    const tokenHash = hashToken(token);
    await this.db.update(this.table(), { tokenHash }, {
      status: 'accepted',
      acceptedAt: isoNow(),
    });

    const shareToken = this.auth.signShareToken(invite.profileId, tokenHash);
    const profile = await this.profiles.findById(invite.profileId);
    return {
      success: true,
      shareToken,
      profileId: invite.profileId,
      slug: profile?.slug,
    };
  }

  async getByToken(token: string, expectedType?: InviteType) {
    const invite = await this.loadPendingInvite(token);

    if (expectedType && invite.inviteType !== expectedType) {
      throw new NotFoundException(
        `This invitation link is for ${invite.inviteType} invites, not ${expectedType}`,
      );
    }

    return this.buildInvitePayload(invite);
  }

  async respond(
    token: string,
    action: 'accept' | 'decline' | 'correction',
    user: AuthUserPayload | null,
    correctionMessage?: string,
    expectedType?: InviteType,
  ) {
    const invite = await this.loadPendingInvite(token);

    if (expectedType && invite.inviteType !== expectedType) {
      throw new BadRequestException(
        `This invitation link is for ${invite.inviteType} invites, not ${expectedType}`,
      );
    }

    const { profileId, email, inviteType } = invite;
    const tokenHash = hashToken(token);

    if (action === 'accept') {
      if (!user?.sub) {
        return { needsAuth: true, email, inviteType };
      }
      if (user.email?.toLowerCase() !== email.toLowerCase()) {
        throw new BadRequestException(
          'Sign in with the email address that received this invitation',
        );
      }

      await this.db.update(this.table(), { tokenHash }, {
        status: 'accepted',
        acceptedAt: isoNow(),
      });

      if (inviteType === 'family' && invite.personId) {
        const person = await this.people.updateInviteFields(profileId, invite.personId, {
          inviteStatus: 'accepted',
          userSub: user.sub,
          canContribute: true,
        });
        await this.contributors.upsertContributor(
          profileId,
          user.sub,
          email,
          person.fullName,
          'contributor',
        );
      } else {
        await this.contributors.upsertContributor(
          profileId,
          user.sub,
          email,
          invite.inviteeName ?? user.email,
          'friend',
        );
      }

      return { success: true, action: 'accepted', inviteType };
    }

    if (action === 'decline') {
      await this.db.update(this.table(), { tokenHash }, { status: 'declined' });

      if (inviteType === 'family' && invite.personId) {
        await this.people.updateInviteFields(profileId, invite.personId, {
          inviteStatus: 'declined',
          canContribute: false,
        });
      }

      return { success: true, action: 'declined', inviteType };
    }

    if (inviteType !== 'family' || !invite.personId) {
      throw new BadRequestException('Correction requests are only available for family invitations');
    }

    await this.people.updateInviteFields(profileId, invite.personId, {
      inviteStatus: 'needs_correction',
      correctionMessage: correctionMessage ?? '',
    });
    return { success: true, action: 'needs_correction', inviteType };
  }

  private async loadPendingInvite(token: string): Promise<InviteRecord> {
    const tokenHash = hashToken(token);
    const invite = await this.db.get<InviteRecord>(this.table(), { tokenHash });
    if (!invite || invite.status !== 'pending') {
      throw new NotFoundException('Invite not found or expired');
    }
    if (new Date(invite.expiresAt) < new Date()) {
      await this.db.update(this.table(), { tokenHash }, { status: 'expired' });
      throw new NotFoundException('Invite has expired');
    }
    return {
      ...invite,
      inviteType: invite.inviteType ?? 'family',
    };
  }

  private async buildInvitePayload(invite: InviteRecord) {
    const profile = await this.profiles.findById(invite.profileId);
    if (!profile) throw new NotFoundException('Invite data incomplete');

    let person: PersonRecord | null = null;
    if (invite.inviteType === 'family' && invite.personId) {
      person = await this.people.findOne(invite.profileId, invite.personId);
      if (!person) throw new NotFoundException('Family member no longer on this tree');
    }

    return {
      invite: {
        email: invite.email,
        expiresAt: invite.expiresAt,
        inviteType: invite.inviteType,
        inviteeName: invite.inviteeName,
      },
      profile,
      person,
    };
  }
}
