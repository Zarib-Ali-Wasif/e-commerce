import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { request } from 'http';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyForgetPasswordOTP } from './dto/verifyForgetPasswordOTP.dto';
import { ForgetPassword } from './dto/forgetPassword.dto';
import { ResendEmailOTP } from './dto/resendEmailOTP.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verifyUser')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' }, // Define properties of the request body
        otp: { type: 'string' },
      },
      required: ['email', 'otp'], // Define required properties
    },
  })
  verifyUser(@Body() request) {
    console.log(request);
    const { email, otp } = request;
    return this.authService.verifyUser(email, otp);
  }

  // Using when hit Forget Password api
  @Post('resendEmailOTP')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' }, // Define properties of the request body
      },
      required: ['email'], // Define required properties
    },
  })
  resendEmailOTP(@Body() resendEmailOTP: ResendEmailOTP) {
    return this.authService.resendEmailOTP(resendEmailOTP);
  }

  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Get('getUserData')
  @ApiBody({
    schema: {
      properties: {},
      required: [],
    },
  })
  getUserDetails(@Req() req, @GetUser() user: User) {
    console.log(req.user);
    console.log(user);
    // both are getting user, in @GetUser() here we make it as a decorator, and write a code in this to get the req user data

    return req.user;
    // return this.authService.findUser(req.user)
  }

  @UseGuards(JwtGuard)
  @Post('updatePassword')
  @ApiBody({
    schema: {
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  updateUserPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ) {
    return this.authService.updateUserPassword(updatePasswordDto, user);
  }

  @Post('forgetPassword')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
      required: ['email'],
    },
  })
  async forgetPassword(@Body() forgetPassword: ForgetPassword) {
    return this.authService.sendForgetPasswordEmail(forgetPassword);
  }

  @Post('verifyForgetPasswordOTP')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
      },
      required: ['email', 'otp'],
    },
  })
  async verifyForgetPasswordOTP(
    @Body() verifyForgetPasswordOTP: VerifyForgetPasswordOTP,
  ) {
    return this.authService.verifyForgetPasswordOTP(verifyForgetPasswordOTP);
  }

  // Use endpoint for the forgetpassword API
  @Post('resetPassword')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        otp: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['email', 'otp', 'newPassword'],
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
