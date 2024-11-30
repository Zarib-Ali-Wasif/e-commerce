import { createSlice } from "@reduxjs/toolkit";
import { calculateCartSummary } from "../../utils/helperFunctions";

const initialState = {
  cart: [],
  cartSummary: {
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    gst: 0,
    total: 0,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add to Cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find(
        (item) => item.cartItemId === product._id
      );

      if (existingProduct) {
        // If product exists, update the quantity
        state.cart = state.cart.map((item) =>
          item.cartItemId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product doesn't exist, add it with a quantity of 1
        state.cart.push({ cartItemId: product._id, quantity: 1 });
      }
    },

    // Remove from Cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.cartItemId !== action.payload
      );
    },

    // Clear Cart
    clearCart: (state) => {
      state.cart = [];
    },

    // Update Quantity
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.cartItemId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    // Update Cart Summary (when called externally)
    updateCartSummary: (state, action) => {
      const productsList = action.payload;
      state.cartSummary = calculateCartSummary(state.cart, productsList);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setProductsList,
} = cartSlice.actions;

export default cartSlice.reducer;
