import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ItemDTO } from './dtos/item.dto';
import { UpdateDTO } from './dtos/update.dto';

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
    const { productId, price } = itemDTO;
    let quantity = itemDTO.quantity;
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }

    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId,
      );

      if (itemIndex > -1) {
        // Item exists, increment its quantity
        const item = cart.items[itemIndex];
        item.quantity += quantity;
        item.subTotalPrice = item.quantity * item.price;
        cart.items[itemIndex] = item;
      } else {
        // Item does not exist, add it with quantity
        const subTotalPrice = price * quantity;
        cart.items.push({ ...itemDTO, quantity, subTotalPrice });
      }

      this.recalculateCart(cart);
      return cart.save();
    } else {
      // Create new cart with the first item
      const subTotalPrice = price * quantity;
      const newCart = await this.createCart(
        userId,
        { ...itemDTO, quantity },
        subTotalPrice,
      );
      return newCart;
    }
  }

  async updateItemQuantity(
    userId: string,
    updateDTO: UpdateDTO,
  ): Promise<Cart> {
    const { productId, updatedQuantity } = updateDTO; // Receive the updated quantity directly
    const cart = await this.getCart(userId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (itemIndex > -1) {
      const item = cart.items[itemIndex];

      // Validate updated quantity
      if (isNaN(updatedQuantity)) {
        return cart;
      }

      // Update quantity or remove item if quantity is 0
      if (updatedQuantity <= 0) {
        cart.items.splice(itemIndex, 1); // Remove item from cart
      } else {
        item.quantity = updatedQuantity; // Update quantity
        item.subTotalPrice = item.quantity * item.price; // Recalculate subTotalPrice
        cart.items[itemIndex] = item; // Save updated item
      }

      // Recalculate total cart price
      this.recalculateCart(cart);
      return cart.save();
    } else {
      throw new Error('Item not found in cart');
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
