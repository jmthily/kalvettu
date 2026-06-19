import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsOptional()
  @IsEnum([
    'tribute',
    'memory',
    'recipe',
    'lesson',
    'funny_story',
    'blessing',
    'migration_story',
  ])
  storyType?: string;

  @IsOptional() @IsString() content?: string;

  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() personId?: string;
  @IsOptional() @IsString() mediaUrl?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
  @IsOptional() @IsString() contributorName?: string;
  @IsOptional() @IsString() contributorRelationship?: string;
  /** MVP tribute form aliases */
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() relationship?: string;
  @IsOptional() @IsString() message?: string;
}

export class ApproveStoryDto {
  @IsBoolean()
  approved!: boolean;
}
