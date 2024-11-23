import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({
    default: 'https://placehold.co/400x400?text=Product+Image',
  })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: Object,
    default: { name: 'None', discountPercent: 0 },
  })
  discount: {
    name: string;
    discountPercent: number;
  };

  @Prop({
    type: Object,
    default: { rate: 0, count: 0 }, // Default rating values
  })
  rating: {
    rate: number;
    count: number;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);
