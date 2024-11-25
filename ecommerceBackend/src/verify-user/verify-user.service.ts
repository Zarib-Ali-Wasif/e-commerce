import {
  Injectable,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateRandom4DigitNumber } from 'src/utils/utility.functions';
import { User } from 'src/users/schemas/user.schema';
import { VerifyUser } from './schemas/verifyUser.schema';

@Injectable()
export class VerifyUserService {
  constructor(
    @InjectModel(VerifyUser.name) private readonly verifyUserModel: Model<any>,
    @InjectModel(User.name) private readonly userModel: Model<any>,
  ) {}

  async generateAndStoreOTP(email: string) {
    try {
      const previousUser = await this.verifyUserModel.findOne({ email });
      if (previousUser) {
        await this.verifyUserModel.deleteOne({ _id: previousUser._id });
      }

      const randomNumber = generateRandom4DigitNumber();
      const userToVerify = await this.verifyUserModel.create({
        email,
        otp: randomNumber,
      });
      return userToVerify;
    } catch (error) {
      throw new Error(`Failed to generate and store random number: ${error}`);
    }
  }

  async verifyOTP(email: string, otp: string): Promise<object> {
    try {
      const userToVerify = await this.verifyUserModel.findOne({ email });

      if (!userToVerify) {
        throw new BadRequestException(
          `User with email : ${email} does not exist for verification`,
        );
      }
      if (userToVerify.verificationTries >= 3) {
        await this.verifyUserModel.deleteOne({ email: userToVerify.email });
        await this.userModel.deleteOne({ email: userToVerify.email });
        throw new NotAcceptableException(`Too many tries. User deleted`);
      }

      const createdAt = new Date(userToVerify.createdAt).getTime();
      const currentTime = new Date().getTime();
      const fiveMinutesInMilliseconds = 5 * 60 * 1000;

      if (currentTime - createdAt > fiveMinutesInMilliseconds) {
        await this.verifyUserModel.deleteOne({ email: userToVerify.email });
        await this.userModel.deleteOne({ email: userToVerify.email });
        throw new BadRequestException(`OTP expired for email : ${email}`);
      }

      if (userToVerify.otp !== otp) {
        await this.verifyUserModel.updateOne(
          { _id: userToVerify._id },
          { $inc: { verificationTries: 1 } },
        );
        throw new BadRequestException(`Incorrect OTP`);
      }

      const verifyemail = await this.userModel.updateOne(
        { email: userToVerify.email },
        { is_emailVerified: true },
      );

      await this.verifyUserModel.deleteOne({ email: userToVerify.email });

      return verifyemail;
    } catch (error) {
      throw error;
    }
  }
}
