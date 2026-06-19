import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RespondInviteDto {
  @IsEnum(['accept', 'decline', 'correction'])
  action!: 'accept' | 'decline' | 'correction';

  @IsOptional() @IsString()
  correctionMessage?: string;
}
