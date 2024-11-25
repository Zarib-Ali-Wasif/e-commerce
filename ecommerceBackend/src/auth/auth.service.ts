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
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { RequestUser } from './entities/user.entity';
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
    private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private verifyService: VerifyService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: LogInDto) {
    try {
      const userData = await this.userModel.findOne({ email: loginDto.email });
      await comparePassword(loginDto.password, userData.password);
      const token = await this.generateToken(userData.id, userData.role);

      return { access_token: token, role: userData.role };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email: string, otp: string) {
    try {
      const verifyUser: any = await this.verifyService.verifyOTP(email, otp);
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

      const userData = await this.userModel.findById(user.id);
      await comparePassword(updatePasswordDto.oldPassword, userData.password);
      const updatedHashedPassword = await hashPassword(
        updatePasswordDto.newPassword,
      );
      await this.userModel.updateOne(
        { _id: user.id },
        { $set: { password: updatedHashedPassword } },
      );

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

    const token = await this.jwt.signAsync(payload, {
      expiresIn: jwt_expiryTime,
      secret: jwt_secret,
    });

    return token;
  }

  async resendEmailOTP(resendEmailOTP: ResendEmailOTP) {
    const { email } = resendEmailOTP;
    const isUser = await this.userModel.findOne({ email: email });

    if (!isUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const verifyData = await this.verifyService.generateAndStoreOTP(
      isUser.email,
    );

    const getUserDetails = await this.userModel.findOne({ email: email });

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
    const userFound = await this.userModel.findOne({ email: email });

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
      const verifyUser: any = await this.verifyService.verifyOTP(email, otp);
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
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await hashPassword(newPassword);
    const resetPassword = await this.userModel.updateOne(
      { _id: user.id },
      { $set: { password: hashedPassword } },
    );

    if (!resetPassword) {
      throw new BadRequestException('Password not reset');
    }
    return { message: 'Password reset successful' };
  }
}
