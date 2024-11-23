import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  image: string; // Optional, defaults to a predefined image URL if not provided.

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsObject()
  @IsOptional()
  discount: {
    name: string;
    discountPercent: number;
  };

  @IsObject()
  @IsOptional()
  rating: {
    rate: number;
    count: number;
  };
}
