import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
  NotFoundException,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CartService } from './cart.service';
import { ItemDTO } from './dtos/item.dto';
import { UpdateDTO } from './dtos/update.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.User)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('/')
  async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
    const userId = req.user.userId;
    const cart = await this.cartService.addItemToCart(userId, itemDTO);
    return cart;
  }

  @Get('/')
  async getCart(@Request() req) {
    const userId = req.user.userId;
    const cart = await this.cartService.getCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }

  @Put('/')
  async updateItemQuantity(@Request() req, @Body() updateDTO: UpdateDTO) {
    const userId = req.user.userId;
    const cart = await this.cartService.updateItemQuantity(userId, updateDTO);
    return cart;
  }

  @Delete('/')
  async removeItemFromCart(@Request() req, @Body() { productId }) {
    const userId = req.user.userId;
    const cart = await this.cartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

  @Delete('/:id')
  async deleteCart(@Param('id') userId: string) {
    const cart = await this.cartService.deleteCart(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
