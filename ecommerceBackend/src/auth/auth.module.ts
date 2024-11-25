import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyService } from 'src/utils/verify.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule, MongooseModule, MailerModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, VerifyService],
  exports: [AuthService],
})
export class AuthModule {}
