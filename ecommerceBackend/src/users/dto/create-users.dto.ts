import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Gender } from 'src/auth/enums/gender.enum';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Invalid Email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and should have more than 8 characters',
  })
  password: string;

  @ApiProperty()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @ApiProperty()
  @IsString()
  age?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;
}
