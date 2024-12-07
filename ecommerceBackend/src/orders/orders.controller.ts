// orders.controller.ts
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = {
      ...createOrderDto,
      status: 'Pending', // Default status
    };
    return this.ordersService.createOrder(newOrder);
  }

  @Get()
  async getAllOrders(
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (startDate && endDate) {
      filter.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    return this.ordersService.findAll(filter);
  }
  @UseGuards(JwtGuard) // Protect the endpoint
  @Get('/recent')
  async getUserRecentOrders(@Req() req: any) {
    const userEmail = req.user.email; // Extract user's email from JWT payload
    return this.ordersService.findRecentOrdersByEmail(userEmail);
  }

  // Route to create a checkout session
  @Post('/create-checkout-session')
  async createCheckoutSession(@Body() orderDetails: any) {
    return this.ordersService.createCheckoutSession(orderDetails);
  }

  // Route to fetch order statistics
  @Get('/statistics')
  async getStatistics() {
    return await this.ordersService.getStatistics();
  }

  // Route to fetch revenue within a specific date range
  @Get('/revenue')
  async getRevenue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.ordersService.getRevenue(startDate, endDate);
  }

  @Get('/:orderNumber')
  async getOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findOne({ orderNumber });
  }

  @Patch('status/:orderNumber')
  async updateOrderStatus(
    @Param('orderNumber') orderNumber: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(orderNumber, status);
  }

  @Delete('/:orderNumber')
  async deleteOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.delete(orderNumber);
  }
}
