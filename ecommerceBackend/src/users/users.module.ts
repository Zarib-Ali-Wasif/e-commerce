import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { VerifyService } from 'src/utils/verify.service';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [PrismaModule, MailerModule],
  controllers: [UsersController],
  providers: [UsersService, VerifyService, ImageService],
  exports: [UsersService],
})
export class UsersModule {}
