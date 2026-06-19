import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  fullName!: string;

  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() relationshipLabel!: string;
  @IsOptional() @IsString() relationshipType?: string;
  @IsOptional() @IsString() parentPersonId?: string;
  @IsOptional() @IsString() spousePersonId?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsBoolean() isLiving?: boolean;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() photoUrl?: string;
}

export class UpdatePersonDto extends CreatePersonDto {}
