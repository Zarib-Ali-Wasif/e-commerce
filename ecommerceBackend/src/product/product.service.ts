import { Body, Get, Injectable, Param, Post } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getFilteredProducts(
    filterProductDTO: FilterProductDTO,
  ): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      );
    }

    if (category) {
      products = products.filter((product) => {
        return (
          product.category.trim().toLowerCase() ===
          category.trim().toLowerCase()
        );
      });
    }

    // Sort products by 'createdAt' field in descending order (latest first)
    products.sort((a, b) => {
      // Check if both createdAt exist, if so compare the dates
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();

    // Sort products by 'createdAt' field in descending order (latest first)
    products.sort((a, b) => {
      // Check if both createdAt exist, if so compare the dates
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    const newProduct = await this.productModel.create(createProductDTO);
    return newProduct.save();
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }

  async applyDiscountToAllProducts(
    discountName: string | undefined,
    discountPercent: number,
    category: string | undefined,
  ): Promise<any> {
    // Build the query to apply the discount
    const query = {};

    // If category is provided and it's not "all", filter by category
    if (category && category !== 'all') {
      query['category'] = category;
    }

    // Prepare the update operation
    const update = {
      $set: {
        'discount.discountPercent': discountPercent,
        'discount.name': discountName || 'Default Discount', // Set discount name if provided
      },
    };

    // Update the products based on the query
    const result = await this.productModel.updateMany(query, update);

    return result;
  }

  async removeDiscountFromAllProducts(removeDiscountDTO: {
    category?: string;
    discountName?: string;
  }): Promise<any> {
    let filter = {};

    if (removeDiscountDTO.category) {
      filter = { ...filter, category: removeDiscountDTO.category };
    }

    if (removeDiscountDTO.discountName) {
      filter = { ...filter, 'discount.name': removeDiscountDTO.discountName };
    }

    const result = await this.productModel.updateMany(filter, {
      $set: { 'discount.discountPercent': 0, 'discount.name': 'None' },
    });
    return result;
  }

  // Apply discount to products in a specific category (only those without an existing discount)
  async applyDiscountToCategory(
    category: string,
    discountPercent: number,
  ): Promise<any> {
    const result = await this.productModel.updateMany(
      { category: category, 'discount.discountPercent': { $eq: 0 } }, // Only apply if no existing discount
      { $set: { 'discount.discountPercent': discountPercent } },
    );
    return result;
  }

  // Get all product categories
  async getAllCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category').exec();
    return categories;
  }

  // Get category statistics
  async getCategoryStats(): Promise<any> {
    // Fetch all products
    const products = await this.getAllProducts();

    // Calculate total product count and total stock count
    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );

    // Initialize category statistics
    const categoryStats = {};

    // Aggregate product and stock counts for each category
    products.forEach((product) => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          productCount: 0,
          stockCount: 0,
        };
      }

      // Increment the product and stock count for the category
      categoryStats[product.category].productCount += 1;
      categoryStats[product.category].stockCount += product.stock;
    });

    // Calculate percentages for product and stock distribution per category
    for (const category in categoryStats) {
      categoryStats[category].productPercentage =
        (categoryStats[category].productCount / totalProducts) * 100;
      categoryStats[category].stockPercentage =
        (categoryStats[category].stockCount / totalStock) * 100;
    }

    // Return the category statistics
    return categoryStats;
  }
}
