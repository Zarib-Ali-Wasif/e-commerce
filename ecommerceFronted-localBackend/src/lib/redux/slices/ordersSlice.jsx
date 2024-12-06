import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toast } from "react-toastify";

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("orders");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch orders");
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderNumber, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`orders/${orderNumber}`, {
        status,
      });
      // toast.success("Order status updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to update order status");
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);

// Async thunk to fetch recent orders
export const fetchRecentOrders = createAsyncThunk(
  "orders/fetchRecentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("orders/recent");
      // toast.success("Recent Order fetched successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch recent orders");
      return rejectWithValue(
        error.response?.data || "Failed to fetch recent orders"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    ordersList: [],
    recentOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersList = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ordersList.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.ordersList[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
