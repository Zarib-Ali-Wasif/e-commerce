import { Body, Get, Injectable, Param, Post } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FilterProductDTO } from './dtos/filter-product.dto';

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
      products = products.filter((product) => product.category === category);
    }

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
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
    createProductDTO: CreateProductDTO,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDTO,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }
  // Apply discount to all products (only those without an existing discount)
  async applyDiscountToAllProducts(discountPercent: number): Promise<any> {
    const result = await this.productModel.updateMany(
      { 'discount.discountPercent': { $eq: 0 } }, // Only apply if no existing discount
      { $set: { 'discount.discountPercent': discountPercent } },
    );
    return result;
  }

  // Remove discount from all products or by category or discount name
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
    //  else {
    //   // If no discount name is provided, remove all discounts
    //   filter = { ...filter, 'discount.discountPercent': { $ne: 0 } };
    // }

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
}
