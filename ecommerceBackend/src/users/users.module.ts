import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { VerifyService } from 'src/utils/verify.service';
import { ImageService } from 'src/image/image.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, VerifyService, ImageService],
  exports: [UsersService],
})
export class UserModule {}
