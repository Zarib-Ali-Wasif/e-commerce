import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../services/api";

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("user");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch users");
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// Async thunk to delete a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`user/deleteById/${userId}`);
      toast.success("User deleted successfully");
      return userId;
    } catch (error) {
      toast.error("Failed to delete user");
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

// Fetch user info
export const fetchUserInfo = createAsyncThunk(
  "users/fetchUserInfo",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`user/findUserById/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user info"
      );
    }
  }
);

// Update avatar
export const updateAvatar = createAsyncThunk(
  "users/updateAvatar",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const imageResponse = await api.post("image/upload/single", formData);
      const avatarUrl = imageResponse.data.url;

      const updatedUser = { avatar: avatarUrl };
      await api.put(`user/updateById/${userId}`, updatedUser);

      toast.success("Profile updated successfully!");
      return { userId, avatar: avatarUrl };
    } catch (error) {
      toast.error("Failed to update avatar.");
      return rejectWithValue(error.response?.data || "Failed to update avatar");
    }
  }
);

// Fetch users and orders
export const fetchUsersAndOrders = createAsyncThunk(
  "users/fetchUsersAndOrders",
  async (_, { rejectWithValue }) => {
    try {
      const [usersResponse, ordersResponse] = await Promise.all([
        api.get("user"),
        api.get("orders"),
      ]);

      const usersData = usersResponse.data;
      const ordersData = ordersResponse.data;

      // Map orders to each user
      const userOrderMap = usersData.map((user) => {
        const userOrders = ordersData.filter(
          (order) => order.userId._id === user._id
        );
        const lastOrderDate = userOrders.length
          ? userOrders.reduce((latest, order) =>
              new Date(order.orderDate) > new Date(latest.orderDate)
                ? order
                : latest
            ).orderDate
          : null;

        // Check if last order date is more than 6 months ago
        const currentDate = new Date();
        const diffInMonths = lastOrderDate
          ? (currentDate - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24 * 30)
          : 0;

        // Mark inactive if last order is over 6 months ago
        if (diffInMonths > 6 && user.is_Active) {
          user.is_Active = false;
        }

        return {
          ...user,
          totalOrders: userOrders.length,
          lastOrderDate,
        };
      });

      return userOrderMap;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      await api.patch(`user/status/${userId}`, { status });
      return { userId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userInfo: null,
    filteredUsers: [],
    searchQuery: "",
    statusFilter: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    applyFilters: (state) => {
      let filtered = state.users;

      if (state.searchQuery) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            user.email
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            user.contactNumber.includes(state.searchQuery)
        );
      }
      if (state.statusFilter) {
        filtered = filtered.filter(
          (user) =>
            (state.statusFilter === "Active" && user.is_Active) ||
            (state.statusFilter === "Deactivated" && !user.is_Active)
        );
      }
      state.filteredUsers = filtered;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user info
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update avatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userInfo) {
          state.userInfo.avatar = action.payload.avatar;
        }
        state.error = null;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch users and orders
      .addCase(fetchUsersAndOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAndOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsersAndOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.users = state.users.map((user) =>
          user._id === userId ? { ...user, is_Active: status } : user
        );
        state.filteredUsers = state.filteredUsers.map((user) =>
          user._id === userId ? { ...user, is_Active: status } : user
        );
      });
  },
});

export const { setSearchQuery, setStatusFilter, applyFilters, clearError } =
  usersSlice.actions;
export default usersSlice.reducer;
