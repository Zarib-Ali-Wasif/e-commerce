// src/components/HeaderAD.jsx
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const HeaderAD = () => (
  <AppBar position="static" sx={{ bgcolor: "#1E1E2F" }}>
    <Toolbar>
      <Typography variant="h6" component="div">
        Admin Panel
      </Typography>
    </Toolbar>
  </AppBar>
);

export default HeaderAD;
