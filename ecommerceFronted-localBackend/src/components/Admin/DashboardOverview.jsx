import React from "react";
import { Card, Typography, Grid } from "@mui/material";

const DashboardOverview = () => {
  const metrics = [
    { label: "Total Sales", value: "$12,345" },
    { label: "Total Orders", value: "345" },
    { label: "Active Customers", value: "120" },
    { label: "Inventory", value: "50 Products" },
    { label: "Total Users", value: "500" },
    { label: "Pending Tasks", value: "5 Approvals" },
  ];

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6">{metric.label}</Typography>
            <Typography variant="h4" color="primary">
              {metric.value}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardOverview;
