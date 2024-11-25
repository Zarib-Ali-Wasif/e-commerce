import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/users/users.module';
import { VerifyUserModule } from 'src/verify-user/verify-user.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
    UserModule,
    VerifyUserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
