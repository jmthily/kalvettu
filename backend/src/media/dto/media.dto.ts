import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PresignUploadDto {
  @IsEnum(['photo', 'video', 'audio', 'document'])
  mediaType!: string;

  @IsString()
  contentType!: string;

  @IsNumber()
  fileSize!: number;

  @IsString()
  fileExtension!: string;
}

export class ConfirmUploadDto extends PresignUploadDto {
  @IsString()
  mediaId!: string;

  @IsString()
  fileKey!: string;

  @IsOptional() @IsString() caption?: string;
  @IsOptional() @IsEnum(['private', 'family', 'invited', 'public'])
  privacyLevel?: string;
}

import { IsBoolean } from 'class-validator';

export class ApproveMediaDto {
  @IsBoolean()
  approved!: boolean;
}

export class GlobalPresignUploadDto extends PresignUploadDto {
  @IsString()
  memorialId!: string;
}

export class GlobalConfirmUploadDto extends ConfirmUploadDto {
  @IsString()
  memorialId!: string;
}
