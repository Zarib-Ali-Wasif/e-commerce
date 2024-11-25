import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogInDto } from './dto/login.dto';
import {
  comparePassword,
  hashPassword,
  isEmailOrPhoneNumber,
} from 'src/utils/utility.functions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerifyService } from 'src/utils/verify.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { RequestUser, User } from './entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import {
  forgetPasswordTemplate,
  otpSendTemplate,
} from 'src/mailer/templates/user-template';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyForgetPasswordOTP } from './dto/verifyForgetPasswordOTP.dto';
import { ForgetPassword } from './dto/forgetPassword.dto';
import { ResendEmailOTP } from './dto/resendEmailOTP.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private prismaService: PrismaService,
    private usersService: UsersService,
    private verifyService: VerifyService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: LogInDto) {
    try {
      const userData = await this.usersService.findUserByEmail(loginDto.email);
      await comparePassword(loginDto.password, userData.password);
      const token = await this.generateToken(userData.id, userData.role);

      return { access_token: token, role: userData.role };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email: string, otp: string) {
    try {
      const verifyUser: User = await this.verifyService.verifyOTP(email, otp);
      console.log(verifyUser.role);
      const token = await this.generateToken(verifyUser.id, verifyUser.role);
      return {
        message: `User\u00A0\u00A0'${verifyUser.name}'\u00A0\u00A0is verified successfully. Please use\u00A0\u00A0'${verifyUser.email}'\u00A0\u00A0for login`,
        access_token: token,
        role: verifyUser.role,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(updatePasswordDto: UpdatePasswordDto, user) {
    try {
      if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
        throw new BadRequestException('Passwords did not match');
      }

      const userData = await this.usersService.findOne(user.id);
      await comparePassword(updatePasswordDto.oldPassword, userData.password);
      const updatedHashedPassword = await hashPassword(
        updatePasswordDto.newPassword,
      );
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: updatedHashedPassword,
        },
      });

      return { message: 'Password update successfully' };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {}

  update(id: number) {}

  remove(id: number) {}

  async generateToken(id: string, role: string) {
    const payload = {
      userId: id,
      role: role,
    };

    const jwt_secret = this.configService.get('JWT_SECRET');
    const jwt_expiryTime = this.configService.get('JWT_EXPIRES');

    //TODO : refresh token implementation remove expiry
    const token = await this.jwt.signAsync(payload, {
      expiresIn: jwt_expiryTime,
      secret: jwt_secret,
    });

    return token;
  }

  // Using when hit Forget Password api
  async resendEmailOTP(resendEmailOTP: ResendEmailOTP) {
    const { email } = resendEmailOTP;
    const isUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!isUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const verifyData = await this.verifyService.generateAndStoreOTP(
      isUser.email,
    );

    const getUserDetails = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    // Inside your mailer service method this template or mail is when forgetting pasword
    const content = forgetPasswordTemplate(getUserDetails.name, verifyData.otp);
    const sendEmail = await this.mailerService.sendEmail(
      isUser.email,
      process.env.PASSWOR_RESET_EMAIL_SUBJECT,
      content,
    );

    return { message: `Email sent to ${isUser.email}` };
  }

  async sendForgetPasswordEmail(forgetPassword: ForgetPassword) {
    const { email } = forgetPassword;
    const userFound = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userFound) {
      throw new BadRequestException('User not found');
    }

    const verifyData = await this.verifyService.generateAndStoreOTP(email);
    const content = forgetPasswordTemplate(userFound.name, verifyData.otp);
    await this.mailerService.sendEmail(
      email,
      process.env.PASSWOR_RESET_EMAIL_SUBJECT,
      content,
    );

    return {
      message: 'An OTP code has been sent to your email for password reset',
    };
  }

  async verifyForgetPasswordOTP(
    verifyForgetPasswordOTP: VerifyForgetPasswordOTP,
  ) {
    try {
      const { email, otp } = verifyForgetPasswordOTP;
      const verifyUser: User = await this.verifyService.verifyOTP(email, otp);
      console.log(verifyUser.role);
      const token = await this.generateToken(verifyUser.id, verifyUser.role);
      return {
        message: `OTP\u00A0\u00A0'${otp}'\u00A0\u00A0has been verified, Please enter a new password to reset.`,
        access_token: token,
        role: verifyUser.role,
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword } = resetPasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await hashPassword(newPassword);
    const resetPassword = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    resetPassword;
    if (!resetPassword) {
      throw new BadRequestException('Password not reset');
    }
    return { message: 'Password reset successful' };
  }
}
