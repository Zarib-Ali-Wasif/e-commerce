import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: string; // Explicitly define _id as a string

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  roles: Role;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
