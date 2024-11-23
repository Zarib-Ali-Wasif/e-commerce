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
} from '@nestjs/common';
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

  @Get('/:orderNumber')
  async getOrder(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findOne({ orderNumber });
  }

  @Patch('/:orderNumber/status')
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
}