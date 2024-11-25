import { Controller } from '@nestjs/common';
import { VerifyUserService } from './verify-user.service';

@Controller('verify-user')
export class VerifyUserController {
  constructor(private readonly verifyUserService: VerifyUserService) {}
}
