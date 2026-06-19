import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMemorialDto {
  @IsString()
  fullName!: string;

  @IsOptional() @IsString() tamilName?: string;
  @IsOptional() @IsString() knownAs?: string;
  @IsOptional() @IsString() village?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() dateOfPassing?: string;
  @IsOptional() @IsString() biography?: string;
  @IsOptional() @IsString() lifeHistory?: string;
  @IsOptional() @IsString() profilePhotoUrl?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
}

export class UpdateMemorialDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() tamilName?: string;
  @IsOptional() @IsString() knownAs?: string;
  @IsOptional() @IsString() village?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() dateOfPassing?: string;
  @IsOptional() @IsString() biography?: string;
  @IsOptional() @IsString() lifeHistory?: string;
  @IsOptional() @IsString() profilePhotoUrl?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
}
