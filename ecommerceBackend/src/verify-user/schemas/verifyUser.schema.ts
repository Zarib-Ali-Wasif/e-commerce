import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerifyUserDocument = VerifyUser & Document;

@Schema({ timestamps: true })
export class VerifyUser {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: 0 })
  verificationTries: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VerifyUserSchema = SchemaFactory.createForClass(VerifyUser);
