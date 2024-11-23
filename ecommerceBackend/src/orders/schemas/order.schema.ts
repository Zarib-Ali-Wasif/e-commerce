import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  orderNumber: string; // Unique order number

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ type: Array, required: true })
  orderItems: Array<{
    productId: string;
    productName: string;
    productCategory: string;
    quantity: number;
    price: number;
    total: number;
  }>;

  @Prop({ type: Object, required: true })
  summary: {
    subtotal: number;
    discount: number;
    gst: number;
    total: number;
  };

  @Prop({ default: 'Pending' }) // Default order status
  status: string;

  @Prop({ required: true })
  orderDate: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
