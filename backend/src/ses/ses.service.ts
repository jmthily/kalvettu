import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

/** Amazon SES email delivery for family tree invitations */
@Injectable()
export class SesService {
  private client: SESClient;
  private fromEmail: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('aws.region');
    this.client = new SESClient({ region });
    this.fromEmail = this.config.get<string>('ses.fromEmail') ?? 'noreply@example.com';
  }

  async sendFamilyTreeInviteEmail(
    email: string,
    inviteLink: string,
    profileName: string,
    personName: string,
    relationshipLabel: string,
  ): Promise<void> {
    const subject = "You've been invited to contribute to our Kalvettu family tree";
    const text = `Hi ${personName},

You have been added to the family tree for ${profileName} as ${relationshipLabel}.

Please click the link below to confirm your details and contribute memories, photos, videos, or stories.

${inviteLink}

With love,
The Kalvettu Family`;

    const html = `<p>Hi ${personName},</p>
<p>You have been added to the family tree for <strong>${profileName}</strong> as <strong>${relationshipLabel}</strong>.</p>
<p>Please click the link below to confirm your details and contribute memories, photos, videos, or stories.</p>
<p><a href="${inviteLink}">Accept Invitation</a></p>
<p>With love,<br/>The Kalvettu Family</p>`;

    if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== 'production') {
      console.log(`[SES] Invite to ${email}: ${inviteLink}`);
      return;
    }

    await this.client.send(
      new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: text }, Html: { Data: html } },
        },
      }),
    );
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const subject = 'Reset your Kalvettu admin password';
    const text = `You requested a password reset for your Kalvettu admin account.

Click the link below to set a new password. This link expires in 1 hour.

${resetLink}

If you did not request this, you can ignore this email.`;

    const html = `<p>You requested a password reset for your Kalvettu admin account.</p>
<p><a href="${resetLink}">Set a new password</a></p>
<p>This link expires in 1 hour.</p>
<p>If you did not request this, you can ignore this email.</p>`;

    if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== 'production') {
      console.log(`[SES] Password reset to ${email}: ${resetLink}`);
      return;
    }

    await this.client.send(
      new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: text }, Html: { Data: html } },
        },
      }),
    );
  }

  async sendFriendTributeInviteEmail(
    email: string,
    inviteLink: string,
    profileName: string,
    friendName: string,
  ): Promise<void> {
    const subject = `Share a memory of ${profileName} on Kalvettu`;
    const text = `Hi ${friendName},

You have been invited to share memories and tribute messages for ${profileName} on Kalvettu.

Please click the link below to accept and write your message.

${inviteLink}

With gratitude,
The Kalvettu Family`;

    const html = `<p>Hi ${friendName},</p>
<p>You have been invited to share memories and tribute messages for <strong>${profileName}</strong> on Kalvettu.</p>
<p><a href="${inviteLink}">Accept invitation & share a memory</a></p>
<p>With gratitude,<br/>The Kalvettu Family</p>`;

    if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== 'production') {
      console.log(`[SES] Friend invite to ${email}: ${inviteLink}`);
      return;
    }

    await this.client.send(
      new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: text }, Html: { Data: html } },
        },
      }),
    );
  }
}
