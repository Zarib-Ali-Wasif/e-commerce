import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  productsList: [],
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
      state.cart.push(action.payload);
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

    // Set Products List
    setProductsList: (state, action) => {
      state.productsList = action.payload;
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
