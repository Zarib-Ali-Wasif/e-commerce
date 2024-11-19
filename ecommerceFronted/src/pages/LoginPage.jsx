// src/pages/LoginPage.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { loginUser } from "../redux/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, loginError } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
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
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="100%" maxWidth={400}>
        <TextField
          label="Username"
          name="username"
          type="username"
          value={credentials.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        {loginError && (
          <Typography color="error" variant="body2">
            {loginError}
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
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

// {
//   "email": "user@example.com",
//   "password": "securepassword"
// }

// {
//   "token": "JWT_TOKEN",
//   "user": {
//     "id": "userId123",
//     "name": "John Doe",
//     "email": "user@example.com"
//   }
// }
