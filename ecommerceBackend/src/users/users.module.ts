import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { ImageService } from 'src/image/image.service';
import { User, UserSchema } from './schemas/user.schema';
import { VerifyUserService } from 'src/verify-user/verify-user.service';
import { VerifyUserSchema } from 'src/verify-user/schemas/verifyUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'VerifyUser', schema: VerifyUserSchema },
    ]),
    MailerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, VerifyUserService, ImageService],
  exports: [UsersService],
})
export class UserModule {}
