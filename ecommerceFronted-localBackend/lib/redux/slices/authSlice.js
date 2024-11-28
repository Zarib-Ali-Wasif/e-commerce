import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

export const loginUserAsync = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await api.post("auth/login", data);
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error; // Rethrow the error to let the rejection case handle it
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    loading: false,
    role: "",
    userId: "",
    email: "",
  },
  reducers: {
    setState: (state) => {
      state.loading = false;
      state.token = "";
      state.role = "";
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
          localStorage.setItem("token", state.token);
          const decodedToken = jwtDecode(state.token);
          state.userId = decodedToken.userId;
          state.email = decodedToken.email;
          state.role = decodedToken.role;
          localStorage.setItem("user", JSON.stringify(decodedToken));
          localStorage.setItem("userId", JSON.stringify(decodedToken.userId));
          localStorage.setItem("email", JSON.stringify(decodedToken.email));
          localStorage.setItem("role", JSON.stringify(decodedToken.role));
          toast.success("Login successful!");
        } else {
          toast.error("Error: Failed to Login. Please try again later.");
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        toast.error("An error occurred: " + action.error.message);
      });
  },
});

export default authSlice.reducer;
export const { setState } = authSlice.actions;
