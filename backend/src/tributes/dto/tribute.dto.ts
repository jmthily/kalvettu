import { IsOptional, IsString } from 'class-validator';

export class CreateTributeDto {
  @IsString()
  name!: string;

  @IsOptional() @IsString() relationship?: string;

  @IsString()
  message!: string;
}

export class TributeActionDto {
  @IsString()
  memorialId!: string;
}
