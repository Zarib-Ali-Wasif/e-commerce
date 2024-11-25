import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/utility.functions';
import { Gender, Prisma, UserRole } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { VerifyService } from 'src/utils/verify.service';
import { otpSendTemplate } from 'src/mailer/templates/user-template';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private mailerService: MailerService,
    private verifyService: VerifyService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const previousUser = await this.prismaService.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      if (previousUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await hashPassword(createUserDto.password);
      const userCreated = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError
      ) {
        console.error('Known request error:', error);
        throw new InternalServerErrorException(`DB error ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        include: {
          address: true, // Include the address data
          orders: true, // Include the orders data
          restaurants: true, // Include the restaurants data
          Cart: true, // Include the Cart data
          vehicle: true, // Include the vehicle data
          Delivery: true, // Include the Delivery data
        },
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
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
      const userFound = await this.prismaService.user.findFirst({
        where: {
          email: email,
        },
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
      const userToUpdate = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!userToUpdate) {
        throw new BadRequestException('User not found');
      }

      let dataToUpdate: any = { ...updateUserDto };

      // Check if email is being updated and if it already exists
      if (dataToUpdate.email && dataToUpdate.email !== userToUpdate.email) {
        const existingUser = await this.prismaService.user.findUnique({
          where: {
            email: dataToUpdate.email,
          },
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

      const updatedUser = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: dataToUpdate,
      });

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
      const deletedUser = await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });

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
