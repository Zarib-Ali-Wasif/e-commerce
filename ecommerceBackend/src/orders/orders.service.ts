// orders.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(orderData: CreateOrderDto) {
    const existingOrder = await this.orderModel.findOne({
      orderNumber: orderData.orderNumber,
    });
    if (existingOrder) {
      throw new BadRequestException(
        'Duplicate order number detected. Please retry.',
      );
    }
    const newOrder = new this.orderModel(orderData);
    return newOrder.save();
  }

  async findAll(filter: any): Promise<Order[]> {
    return this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email contactNumber role is_Active createdAt') // Specify fields to populate
      .exec();
  }

  async findOne(filter: any): Promise<Order> {
    return this.orderModel.findOne(filter).exec();
  }

  async updateStatus(orderNumber: string, status: string): Promise<Order> {
    return this.orderModel
      .findOneAndUpdate({ orderNumber }, { status }, { new: true })
      .exec();
  }

  async delete(orderNumber: string): Promise<Order> {
    return this.orderModel.findOneAndDelete({ orderNumber }).exec();
  }

  async getStatistics() {
    const totalOrders = await this.orderModel.countDocuments().exec();
    const pendingOrders = await this.orderModel
      .countDocuments({ status: 'Pending' })
      .exec();
    const completedOrders = await this.orderModel
      .countDocuments({ status: 'Completed' })
      .exec();

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
    };
  }

  async getRevenue(startDate: string, endDate: string) {
    const orders = await this.orderModel
      .find({
        status: 'Completed',
        orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      .exec();

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.summary.total,
      0,
    );

    return { totalRevenue, orders };
  }

  async findRecentOrdersByEmail(userEmail: string) {
    try {
      const recentOrders = await this.orderModel
        .find({ email: userEmail })
        .sort({ createdAt: -1 });

      return recentOrders;
    } catch (err) {
      console.error('Error fetching recent orders: ', err);
      throw new Error('Failed to fetch recent orders.');
    }
  }

  // payment
  async createCheckoutSession(orderDetails: any) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const { orderItems } = orderDetails;
      console.log('Testing get data susscess', orderItems);
      const lineItems = orderItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productName,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      console.log('Testing line item set');

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment', // This is the key fix
        line_items: lineItems,
        success_url: `${process.env.FRONTEND_URL}/order-confirmation`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      });
      console.log('Testing line session success');

      return { id: session.id };
    } catch (err) {
      console.error('Error creating checkout session:  ', err);
      throw new Error('Failed to create checkout session.');
    }
  }
}
