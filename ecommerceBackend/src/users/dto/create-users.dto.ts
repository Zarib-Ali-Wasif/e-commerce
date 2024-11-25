import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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
  @IsEnum(UserRole)
  role: UserRole;

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
