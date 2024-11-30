import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category, { rejectWithValue }) => {
    try {
      const endpoint =
        category === "all"
          ? "store/products"
          : `store/products?category=${category}`;
      const response = await api.get(endpoint);
      toast.success("Products fetched successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch products");
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("store/products/categories");
      toast.success("Categories fetched successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch categories");
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories"
      );
    }
  }
);

const initialState = {
  productsList: [],
  categories: [],
  loading: false,
  loadingCategories: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsList = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
