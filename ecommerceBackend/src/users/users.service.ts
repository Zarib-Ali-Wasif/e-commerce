import { Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from 'src/utils/utility.functions';
import { MailerService } from 'src/mailer/mailer.service';
import { otpSendTemplate } from 'src/mailer/templates/user-template';
import { VerifyUserService } from 'src/verify-user/verify-user.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    private mailerService: MailerService,
    private verifyService: VerifyUserService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const previousUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (previousUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await hashPassword(createUserDto.password);
      const userCreated = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      if (!userCreated) {
        throw new BadRequestException('User not created');
      }
      const verifyData = await this.verifyService.generateAndStoreOTP(
        userCreated.email,
      );

      // Inside your mailer service method
      const content = otpSendTemplate(userCreated.name, verifyData.otp);
      const sendEmail = await this.mailerService.sendEmail(
        userCreated.email,
        process.env.EMAIL_SUBJECT,
        content,
      );

      return {
        message: 'User created. Verify your account',
        data: userCreated,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const userFound = await this.userModel.findById(id).select({
        password: 0,
        __v: 0,
      });

      if (!userFound) {
        throw new BadRequestException('User not found');
      }

      return userFound;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      const userFound = await this.userModel
        .findOne({
          email: email,
        })
        .select({
          password: 0,
          __v: 0,
        });

      if (!userFound) {
        throw new BadRequestException('User not found');
      }

      if (!userFound.is_emailVerified) {
        const verifyData = await this.verifyService.generateAndStoreOTP(email);
        const content = otpSendTemplate(userFound.name, verifyData.otp);
        await this.mailerService.sendEmail(
          email,
          process.env.EMAIL_SUBJECT,
          content,
        );
        throw new UnauthorizedException(
          'Email found, but user not verified. Resent verification email.',
        );
      }

      return userFound;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.userModel.findById(id);

      if (!userToUpdate) {
        throw new BadRequestException('User not found');
      }

      let dataToUpdate: any = { ...updateUserDto };

      // Check if email is being updated and if it already exists
      if (dataToUpdate.email && dataToUpdate.email !== userToUpdate.email) {
        const existingUser = await this.userModel.findOne({
          email: dataToUpdate.email,
        });

        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      // Hash the password if it's included in the update data
      if (updateUserDto.password) {
        const hashedPassword = await hashPassword(updateUserDto.password);
        dataToUpdate.password = hashedPassword;
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: dataToUpdate },
        { new: true },
      );

      if (!updatedUser) {
        throw new InternalServerErrorException('User update failed');
      }

      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new BadRequestException('User delete failed');
      }

      return {
        message: 'User deleted successfully',
        data: deletedUser,
      };
    } catch (error) {
      throw error;
    }
  }
}
