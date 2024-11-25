import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import {
  generateRandom4DigitNumber,
  isEmailOrPhoneNumber,
} from './utility.functions';
import { UserRole } from '@prisma/client';

@Injectable()
export class VerifyService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateAndStoreOTP(email: string) {
    try {
      const previousUser = await this.prismaService.verifyUser.findUnique({
        // check if user is already in db, if yes then delete the entry
        where: {
          email: email,
        },
      });
      if (previousUser) {
        await this.prismaService.verifyUser.delete({
          where: {
            id: previousUser.id,
          },
        });
      }

      const randomNumber = generateRandom4DigitNumber();
      const userToVerify = await this.prismaService.verifyUser.create({
        data: {
          email: email,
          otp: randomNumber,
        },
      });
      return userToVerify;
    } catch (error) {
      throw new Error(
        `Failed to generate and store random number: ${error.message}`,
      );
    }
  }

  // here user name is a email
  async verifyOTP(email: string, otp: string): Promise<object> {
    try {
      console.log('email: ', email);
      console.log('otp: ', otp);
      const userToVerify = await this.prismaService.verifyUser.findFirst({
        where: {
          email: email,
        },
      });

      if (!userToVerify) {
        throw new BadRequestException(
          `User with email : ${email} does not exist for verification`,
        );
      }
      if (userToVerify.verificationTries >= 3) {
        // Delete user from both tables if verification tries exceed 3
        await this.prismaService.verifyUser.delete({
          where: {
            email: userToVerify.email,
          },
        });
        await this.prismaService.user.delete({
          where: {
            email: userToVerify.email,
          },
        });
        throw new NotAcceptableException(`Too many tries. User deleted`);
      }

      // Check if the OTP record was created within the last 5 minutes
      const createdAt = new Date(userToVerify.createdAt).getTime();
      const currentTime = new Date().getTime();
      const fiveMinutesInMilliseconds = 5 * 60 * 1000;

      if (currentTime - createdAt > fiveMinutesInMilliseconds) {
        // Delete user from both tables if OTP is expired
        await this.prismaService.verifyUser.delete({
          where: {
            email: userToVerify.email,
          },
        });
        await this.prismaService.user.delete({
          where: {
            email: userToVerify.email,
          },
        });
        throw new BadRequestException(`OTP expired for email : ${email}`);
      }
      console.log('userToVerify.otp:  ', userToVerify.otp);
      console.log('otp:  ', otp);
      if (userToVerify.otp !== otp) {
        // Increment verification tries if OTP is incorrect
        await this.prismaService.verifyUser.update({
          where: {
            id: userToVerify.id,
          },
          data: {
            verificationTries: { increment: 1 },
          },
        });
        throw new BadRequestException(`Incorrect OTP`);
      }

      // Update user to be verified in the user table
      const verifyemail = await this.prismaService.user.update({
        where: {
          email: userToVerify.email,
        },
        data: {
          is_emailVerified: true,
        },
      });

      // Delete user from the verifyUser table
      await this.prismaService.verifyUser.delete({
        where: {
          email: userToVerify.email,
        },
      });

      return verifyemail;
      // return {
      //   message: `User ${verifyemail.name} is verified successfully. Please use ${verifyemail.email} for login`,
      //   data: verifyemail,
      // };
    } catch (error) {
      throw error;
    }
  }
}
