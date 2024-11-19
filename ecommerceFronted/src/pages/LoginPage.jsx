// src/pages/LoginPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Typography, Box } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    // Dispatch login action (mocked here)
    dispatch({ type: "auth/login", payload: { email } });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
