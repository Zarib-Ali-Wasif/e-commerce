import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDTO) {}
