import { IsEmail, IsOptional, IsString } from 'class-validator';

/** Send family invite by tree person id or by email (must match someone on the tree). */
export class SendFamilyInviteDto {
  @IsOptional()
  @IsString()
  personId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
