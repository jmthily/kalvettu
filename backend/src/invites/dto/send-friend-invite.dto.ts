import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SendFriendInviteDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  inviteeName?: string;
}
