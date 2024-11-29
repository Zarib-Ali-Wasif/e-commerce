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

    // Set Products List
    setProductsList: (state, action) => {
      state.productsList = action.payload;
    },
  },
});

const calculateCartSummary = (state) => {
  const subtotal = calculateSubtotal(state.cart, state.productsList);
  const total = calculateTotal(subtotal);

  return {
    subtotal,
    discount: 0, // You can update this with dynamic discount logic
    gst: 16, // Static GST for now, you can change it dynamically
    total,
    totalItems: state.cart.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const calculateSubtotal = (cart, productsList) => {
  return cart.reduce((total, item) => {
    const cartProduct = getCartProductDetails(item.cartItemId, productsList);
    return total + (cartProduct.price || 0) * item.quantity;
  }, 0);
};

const calculateTotal = (subtotal) => {
  const discount = 0; // Dynamic discount can be applied here
  const gst = 16; // Example GST percentage
  const discountAmount = (subtotal * discount) / 100;
  const gstAmount = (subtotal * gst) / 100;
  return (subtotal - discountAmount + gstAmount).toFixed(2);
};

const getCartProductDetails = (cartProductId, productsList) =>
  productsList.find((product) => product._id === cartProductId) || {};

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  setProductsList,
} = cartSlice.actions;

export default cartSlice.reducer;
