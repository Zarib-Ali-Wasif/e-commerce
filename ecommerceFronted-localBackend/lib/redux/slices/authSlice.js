import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

// Async thunk to handle user login
export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/login", data);
      return response.data;
    } catch (error) {
      console.error("An error occurred:", error.message);
      return rejectWithValue(error.response.data); // Return error payload
    }
  }
);

// Load initial state from localStorage
const initialState = {
  token: localStorage.getItem("token") || "",
  loading: false,
  user: localStorage.getItem("user") || "",
  role: localStorage.getItem("role") || "",
  userId: localStorage.getItem("userId") || "",
  email: localStorage.getItem("email") || "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear Redux state
      state.token = "";
      state.role = "";
      state.userId = "";
      state.email = "";
      state.loading = false;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("isAuthenticated");

      setTimeout(() => {
        toast.info("Logged out successfully!");
      }, 500);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload;

        if (response) {
          state.token = response.access_token;
          const decodedToken = jwtDecode(response.access_token);

          // Set Redux state
          state.user = decodedToken;
          state.userId = decodedToken.userId;
          state.email = decodedToken.email;
          state.role = decodedToken.role;
          state.isAuthenticated = true;

          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(decodedToken));
          localStorage.setItem("token", response.access_token);
          localStorage.setItem("userId", decodedToken.userId);
          localStorage.setItem("email", decodedToken.email);
          localStorage.setItem("role", decodedToken.role);
          localStorage.setItem("isAuthenticated", true);

          toast.success("Login successful!");
        } else {
          toast.error("Login failed. Please try again.");
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        toast.error(
          "An error occurred: " +
            (action.payload?.message || action.error.message)
        );
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
