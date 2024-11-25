import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/users/users.module';
import { VerifyUserService } from 'src/verify-user/verify-user.service';
import { User, UserSchema } from 'src/users/schemas/user.schema'; // Import User model
import { VerifyUserModule } from 'src/verify-user/verify-user.module';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User model
    MailerModule,
    UserModule,
    VerifyUserModule, // Add this line to import VerifyUserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, VerifyUserService],
  exports: [AuthService],
})
export class AuthModule {}
