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
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

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

  @Post('/')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  async addProduct(@Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.addProduct(createProductDTO);
    return product;
  }

  // Apply discount to all products (or a specific category)
  @Patch('/apply-discount')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  async applyDiscount(
    @Body()
    discountDTO: {
      discountName?: string;
      discountPercent: number;
      category?: string;
    },
  ) {
    const { discountName, discountPercent, category } = discountDTO;
    const result = await this.productService.applyDiscountToAllProducts(
      discountName,
      discountPercent,
      category,
    );
    return result;
  }

  // Remove discount from all products or by category or discount name
  @Patch('/remove-discount')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
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

  // Get category stats
  @Get('/categoryStats')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  async getCategoryStats() {
    const getStats = await this.productService.getCategoryStats();
    return getStats;
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Patch('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
