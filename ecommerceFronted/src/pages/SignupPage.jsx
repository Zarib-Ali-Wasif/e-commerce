// src/pages/SignupPage.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { signupUser } from "../redux/authSlice";

const SignupPage = () => {
  const dispatch = useDispatch();
  const { loading, signupError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="100%" maxWidth={400}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        {signupError && (
          <Typography color="error" variant="body2">
            {signupError}
          </Typography>
        )}
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Signup"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupPage;

// {
//     "name": "John Doe",
//     "email": "john@example.com",
//     "password": "securepassword"
//   }

//   {
//     "id": "userId123",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "token": "JWT_TOKEN"
//   }
