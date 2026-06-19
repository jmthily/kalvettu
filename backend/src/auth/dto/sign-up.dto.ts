import { IsEmail, IsIn, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  givenName!: string;

  @IsString()
  @MinLength(1)
  familyName!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthdate must be YYYY-MM-DD',
  })
  birthdate!: string;

  @IsIn(['male', 'female', 'other', 'prefer_not_to_say'])
  gender!: string;

  @IsString()
  @MinLength(2)
  locale!: string;

  @IsString()
  @MinLength(2)
  address!: string;
}
