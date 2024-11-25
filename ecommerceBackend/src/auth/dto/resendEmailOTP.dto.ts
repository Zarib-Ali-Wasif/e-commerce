import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResendEmailOTP {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
