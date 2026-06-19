import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsEnum(['living', 'memorial', 'ancestor'])
  profileType!: string;

  @IsString()
  fullName!: string;

  @IsOptional() @IsString() tamilName?: string;
  @IsOptional() @IsString() sinhalaName?: string;
  @IsOptional() @IsString() knownAs?: string;
  @IsOptional() @IsString() village?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() countryOfBirth?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() dateOfPassing?: string;
  @IsOptional() @IsString() shortBio?: string;
  @IsOptional() @IsString() lifeHistory?: string;
  @IsOptional() @IsString() migrationStory?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() career?: string;
  @IsOptional() @IsString() marriageFamilyLife?: string;
  @IsOptional() @IsString() communityContribution?: string;
  @IsOptional() @IsString() favouriteSayings?: string;
  @IsOptional() @IsString() lifeLessons?: string;
  @IsOptional() @IsString() blessings?: string;
  @IsOptional() @IsString() profilePhotoUrl?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() tamilName?: string;
  @IsOptional() @IsString() sinhalaName?: string;
  @IsOptional() @IsString() knownAs?: string;
  @IsOptional() @IsString() village?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() countryOfBirth?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() dateOfPassing?: string;
  @IsOptional() @IsString() shortBio?: string;
  @IsOptional() @IsString() lifeHistory?: string;
  @IsOptional() @IsString() migrationStory?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() career?: string;
  @IsOptional() @IsString() marriageFamilyLife?: string;
  @IsOptional() @IsString() communityContribution?: string;
  @IsOptional() @IsString() favouriteSayings?: string;
  @IsOptional() @IsString() lifeLessons?: string;
  @IsOptional() @IsString() blessings?: string;
  @IsOptional() @IsString() profilePhotoUrl?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
}
