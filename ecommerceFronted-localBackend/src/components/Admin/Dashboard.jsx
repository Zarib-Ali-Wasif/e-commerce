// src/components/Dashboard.jsx
import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Charts from "./Charts";

const Dashboard = () => (
  <Box sx={{ padding: 3, bgcolor: "#F4F5F7", minHeight: "100vh" }}>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ padding: 2, bgcolor: "#FFFFFF" }}>
          <Typography variant="h6">Total Users</Typography>
          <Typography variant="h3">2,345</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ padding: 2, bgcolor: "#FFFFFF" }}>
          <Typography variant="h6">Revenue</Typography>
          <Typography variant="h3">$45,600</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ padding: 2, bgcolor: "#FFFFFF" }}>
          <Typography variant="h6">Analytics</Typography>
          <Charts />
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Dashboard;
