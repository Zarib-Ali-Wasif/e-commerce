import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt'; // 1
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {} // 2

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatch) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);

    if (!user) {
      return { message: 'User not found', statusCode: 404 };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const access_token = await this.createAccessToken(user);

      return {
        UserId: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        access_token,
      };
    }

    return { message: 'Invalid credentials', statusCode: 401 };
  }

  async createAccessToken(user: any) {
    const payload = {
      name: user.name,
      email: user.email,
      sub: user._id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
