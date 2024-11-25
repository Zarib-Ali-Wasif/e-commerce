import { Gender, UserRole } from '@prisma/client';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  role?: UserRole; // Making role optional
  age?: string;
  gender?: Gender;
  createdAt?: string;
  updatedAt?: string;
  is_emailVerified?: boolean;
  is_Active?: boolean;
  is_Deleted?: boolean;
}
