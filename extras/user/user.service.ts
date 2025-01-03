import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const { email } = createUserDTO;
    if (await this.findUser(email)) {
      throw new ConflictException('Email already exists');
    }
    const newUser = await this.userModel.create(createUserDTO);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return newUser.save();
  }

  async findUser(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }
}
