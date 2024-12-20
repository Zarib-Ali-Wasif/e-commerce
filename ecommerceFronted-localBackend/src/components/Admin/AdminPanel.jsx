import React, { useState } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import DashboardOverview from "./DashboardOverview";
import OrdersManagement from "./OrdersManagement";
import ProductsManagement from "./ProductsManagement";
import CustomerManagement from "./CustomerManagement";
import { useNavigate } from "react-router-dom";
import {
  Dashboard,
  ShoppingCart,
  Inventory,
  People,
  SupportAgent,
} from "@mui/icons-material";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("DashboardOverview");
  const navigate = useNavigate();

  const handleAdminChatSupport = () => {
    navigate("/admin-panel-chat-support");
  };

  return (
    <Box sx={{ mt: 20, minHeight: "100vh", padding: "20px" }}>
      {/* Heading */}
      <Typography
        variant="h3"
        sx={{ fontWeight: 600, mb: 6, textAlign: "center", color: "#1C4771" }}
      >
        Admin Dashboard
      </Typography>

      {/* Navigation Buttons */}
      <Grid container spacing={4} justifyContent="center" marginBottom={5}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<Dashboard />}
            onClick={() => setActiveSection("DashboardOverview")}
            sx={{
              minWidth: 180,
              borderRadius: "12px",
              padding: "12px 24px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 4,
              border: "1px solid #1C4771",
              color: "#1C4771",
              "&:hover": {
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Overview
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            startIcon={<People />}
            onClick={() => setActiveSection("CustomerManagement")}
            sx={{
              minWidth: 180,
              borderRadius: "12px",
              padding: "12px 12px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 4,
              border: "1px solid #1C4771",
              color: "#1C4771",
              "&:hover": {
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Manage Customers
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            startIcon={<Inventory />}
            onClick={() => setActiveSection("ProductsManagement")}
            sx={{
              minWidth: 180,
              borderRadius: "12px",
              padding: "12px 12px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 4,
              border: "1px solid #1C4771",
              color: "#1C4771",
              "&:hover": {
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Manage Products
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            startIcon={<ShoppingCart />}
            onClick={() => setActiveSection("OrdersManagement")}
            sx={{
              minWidth: 180,
              borderRadius: "12px",
              padding: "12px 24px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 4,
              border: "1px solid #1C4771",
              color: "#1C4771",
              "&:hover": {
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Manage Orders
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            startIcon={<SupportAgent />}
            onClick={() => handleAdminChatSupport()}
            sx={{
              minWidth: 180,
              borderRadius: "12px",
              padding: "12px 18px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 4,
              border: "1px solid #1C4771",
              color: "#1C4771",
              "&:hover": {
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Customer Support
          </Button>
        </Grid>
      </Grid>

      {/* Dynamic Section Rendering */}
      {activeSection === "DashboardOverview" && <DashboardOverview />}
      {activeSection === "OrdersManagement" && <OrdersManagement />}
      {activeSection === "ProductsManagement" && <ProductsManagement />}
      {activeSection === "CustomerManagement" && <CustomerManagement />}
    </Box>
  );
};

export default AdminPanel;
