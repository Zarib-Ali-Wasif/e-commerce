import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
//import { Role } from "src/roleGuard/role.enum"

export class ForgetPassword {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
