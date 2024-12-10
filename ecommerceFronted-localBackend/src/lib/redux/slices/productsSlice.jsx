import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../services/api";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category, { rejectWithValue }) => {
    try {
      console.log("category", category);
      const endpoint =
        !category || category === "all"
          ? "store/products"
          : `store/products?category=${encodeURIComponent(category)}`;
      console.log("endpoint", endpoint);
      const response = await api.get(endpoint);
      // toast.success("Products fetched successfully");
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
      // toast.success("Categories fetched successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch categories");
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories"
      );
    }
  }
);

// Async thunk to add a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await api.post("store/products", newProduct);
      // toast.success("Product added successfully");
      return response.data; // Returning the newly added product details
    } catch (error) {
      toast.error("Failed to add product");
      return rejectWithValue(error.response?.data || "Failed to add product");
    }
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, dataToUpdate }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `store/products/${productId}`,
        dataToUpdate
      );
      // toast.success("Product updated successfully");
      return response.data; // Returning updated product details
    } catch (error) {
      toast.error("Failed to update product");
      return rejectWithValue(
        error.response?.data || "Failed to update product"
      );
    }
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`store/products/${productId}`);
      // toast.success("Product deleted successfully");
      return productId; // Returning the deleted product's ID to remove from the state
    } catch (error) {
      toast.error("Failed to delete product");
      return rejectWithValue(
        error.response?.data || "Failed to delete product"
      );
    }
  }
);

// Thunk to apply a discount
export const applyDiscount = createAsyncThunk(
  "products/applyDiscount",
  async (
    { selectedCategory, discountName, discountPercent },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch("store/products/apply-discount", {
        category: selectedCategory || undefined,
        discountName: discountName || undefined,
        discountPercent: discountPercent || undefined,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply discount"
      );
    }
  }
);

// Thunk to remove discount
export const removeDiscount = createAsyncThunk(
  "products/removeDiscount",
  async ({ category, discountName }, { rejectWithValue }) => {
    try {
      const response = await api.patch("store/products/remove-discount", {
        category: category || undefined,
        discountName: discountName || undefined,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove discount"
      );
    }
  }
);

//Async thunk to fetch categories stats
export const fetchCategoryStats = createAsyncThunk(
  "products/fetchCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("store/products/categoryStats"); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch categoryStats");
      return rejectWithValue(
        error.response?.data || "Failed to fetch categoryStats"
      );
    }
  }
);

const initialState = {
  productsList: [],
  categories: [],
  categoryStats: {},
  loading: false,
  loadingCategories: false,
  loadingCategoryStats: false,
  loadingDelete: false,
  loadingUpdate: false,
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
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productsList.push(action.payload); // Add the new product to the list
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const index = state.productsList.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.productsList[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.productsList = state.productsList.filter(
          (product) => product.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      })
      // Apply Discount
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove discount
      .addCase(removeDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories stats
      .addCase(fetchCategoryStats.pending, (state) => {
        state.loadingCategoryStats = true;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.loadingCategoryStats = false;
        state.categoryStats = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.loadingCategoryStats = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
