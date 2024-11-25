import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender } from 'src/auth/enums/gender.enum';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  image?: string;

  @Prop({ enum: Role, default: 'User' }) // Adjust roles as needed
  role?: string;

  @Prop()
  age?: string;

  @Prop({ enum: Gender, required: false }) // Adjust genders
  gender?: string;

  @Prop({ default: false })
  is_emailVerified?: boolean;

  @Prop({ default: true })
  is_Active?: boolean;

  @Prop({ default: false })
  is_Deleted?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
