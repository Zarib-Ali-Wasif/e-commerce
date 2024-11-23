import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({
    default:
      'https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Nnw5Vjd4MllXSWFjSXx8ZW58MHx8fHx8&auto=format&fit=crop&w=400',
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
