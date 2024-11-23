import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('/')
  async getProducts(@Query() filterProductDTO: FilterProductDTO) {
    if (Object.keys(filterProductDTO).length) {
      const filteredProducts = await this.productService.getFilteredProducts(
        filterProductDTO,
      );
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Post('/')
  async addProduct(@Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.addProduct(createProductDTO);
    return product;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDTO,
  ) {
    const product = await this.productService.updateProduct(
      id,
      createProductDTO,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }

  // Apply discount to all products (without existing offer)
  @Post('/apply-discount')
  async applyDiscount(@Body() discountDTO: { discountPercent: number }) {
    const result = await this.productService.applyDiscountToAllProducts(
      discountDTO.discountPercent,
    );
    return result;
  }

  // Remove discount from all products or by category or discount name
  @Post('/remove-discount')
  async removeDiscount(
    @Body() removeDiscountDTO: { category?: string; discountName?: string },
  ) {
    const result = await this.productService.removeDiscountFromAllProducts(
      removeDiscountDTO,
    );
    return result;
  }

  // Apply discount category-wise (without existing offer)
  @Post('/apply-discount/:category')
  async applyDiscountCategoryWise(
    @Param('category') category: string,
    @Body() discountDTO: { discountPercent: number },
  ) {
    const result = await this.productService.applyDiscountToCategory(
      category,
      discountDTO.discountPercent,
    );
    return result;
  }

  // Get all categories
  @Get('/categories')
  async getAllCategories() {
    const categories = await this.productService.getAllCategories();
    return categories;
  }
}
