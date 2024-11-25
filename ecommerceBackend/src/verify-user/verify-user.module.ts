import { Module } from '@nestjs/common';
import { VerifyUserService } from './verify-user.service';
import { VerifyUserController } from './verify-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyUser, VerifyUserSchema } from './schemas/verifyUser.schema';
import { User, UserSchema } from '../users/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: VerifyUser.name, schema: VerifyUserSchema },
    ]),
  ],
  controllers: [VerifyUserController],
  providers: [VerifyUserService],
  exports: [VerifyUserService], // Ensure VerifyUserService is exported
})
export class VerifyUserModule {}
