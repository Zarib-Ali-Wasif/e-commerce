import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
  ) {}

  async createCart(
    userId: string,
    itemDTO: ItemDTO,
    subTotalPrice: number,
  ): Promise<Cart> {
    const newCart = await this.cartModel.create({
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice: subTotalPrice, // Use subTotalPrice as the initial totalPrice
    });
    return newCart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ userId });
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const deletedCart = await this.cartModel.findOneAndRemove({ userId });
    return deletedCart;
  }

  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity, price } = itemDTO;

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      );

      if (itemIndex > -1) {
        let item = cart.items[itemIndex];

        const newQuantity = Number(item.quantity) + Number(quantity);

        if (newQuantity <= 0) {
          // Remove item if the updated quantity is zero or less
          cart.items.splice(itemIndex, 1);
        } else {
          // Update the item with new quantity and subTotalPrice
          item.quantity = newQuantity;
          item.subTotalPrice = item.quantity * item.price;
          cart.items[itemIndex] = item;
        }

        this.recalculateCart(cart);
        return cart.save();
      } else {
        if (quantity > 0) {
          // Add new item if it does not exist in the cart
          const subTotalPrice = quantity * price;
          cart.items.push({ ...itemDTO, subTotalPrice });
          this.recalculateCart(cart);
          return cart.save();
        }
      }
    } else {
      // Create a new cart if no cart exists
      const subTotalPrice = quantity * price;
      const newCart = await this.createCart(userId, itemDTO, subTotalPrice);
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      this.recalculateCart(cart);
      return cart.save();
    }
  }
}
