import { Document } from 'mongoose';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

export interface RequestUser {
  id: string; // This will correspond to MongoDB's `_id`
  email: string;
  role: Role;
}

export interface User extends Document {
  id: string; // Corresponds to MongoDB's _id field
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: Role;
  age?: string;
  gender?: Gender;
  is_emailVerified?: boolean;
  is_Active?: boolean;
  is_Deleted?: boolean;
  createdAt?: Date; // Added timestamps from schema
  updatedAt?: Date; // Added timestamps from schema
}
