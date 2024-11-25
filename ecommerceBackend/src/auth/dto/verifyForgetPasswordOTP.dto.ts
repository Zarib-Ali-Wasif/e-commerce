import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgetPasswordOTP {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;
}
