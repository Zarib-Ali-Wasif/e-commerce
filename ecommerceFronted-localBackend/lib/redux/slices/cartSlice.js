import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toast } from "react-toastify";
export const fetchCustomerCart = createAsyncThunk(
  "cart/fetchCustomerCart",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof localStorage !== "undefined") {
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
          const cartResponse = await api.post(`/cart/get-cart`, {
            customer_id: customerId,
          });
          return cartResponse.data;
        } else {
          throw new Error("customerId not found in localStorage");
        }
      } else {
        throw new Error("localStorage is not available");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteItemFromCart = createAsyncThunk(
  "cart/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      if (typeof localStorage !== "undefined") {
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
          const res = await api.post("/cart/remove-cart-item", {
            customer_id: customerId,
            variant_id: id,
          });
          return res.data;
        } else {
          return rejectWithValue("Customer ID not found in local storage");
        }
      } else {
        return rejectWithValue("localStorage not supported");
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "addToCart",
  async (payload, { rejectWithValue }) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.post("/cart/update-cart", payload);
          if (response.data) {
            toast.success("Item added successfully to cart");
            return response.data;
          }
        } catch (error) {
          console.error(error.message);
          return rejectWithValue(error.message);
        }
      }
    }
  }
);

const cartSlice = createSlice({
  name: "customerCart",
  initialState: {
    loading: true,
    data: null,
    error: null,
  },
  reducers:{
    clearCart: (state) => {
      state.data = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteItemFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(deleteItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(addToCart.pending,(state)=>{
        state.loading = true;
      }).addCase(addToCart.fulfilled,(state,action)=>{
        state.loading = false;
        state.data = action.payload;
      }).addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
