import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyUserService } from './verify-user.service';
import { VerifyUserController } from './verify-user.controller';
import { VerifyUser, VerifyUserSchema } from './schemas/verifyUser.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerifyUser.name, schema: VerifyUserSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [VerifyUserController],
  providers: [VerifyUserService],
  exports: [VerifyUserService],
})
export class VerifyUserModule {}
