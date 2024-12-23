import React, { useState } from "react";
import { Grid, Button, Typography, Box, CircularProgress } from "@mui/material";
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
  const [loading, setLoading] = useState({
    DashboardOverview: false,
    CustomerManagement: false,
    ProductsManagement: false,
    OrdersManagement: false,
    CustomerSupport: false,
  });
  const navigate = useNavigate();

  const handleClick = (section) => {
    setLoading((prevState) => ({ ...prevState, [section]: true }));
    setTimeout(() => {
      if (section === "CustomerSupport") {
        navigate("/admin-panel-chat-support");
      } else {
        setActiveSection(section);
      }
      setLoading((prevState) => ({ ...prevState, [section]: false }));
    }, 1000); // Simulate a delay for loader
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
        {[
          {
            label: "Overview",
            section: "DashboardOverview",
            icon: <Dashboard />,
          },
          {
            label: "Manage Customers",
            section: "CustomerManagement",
            icon: <People />,
          },
          {
            label: "Manage Products",
            section: "ProductsManagement",
            icon: <Inventory />,
          },
          {
            label: "Manage Orders",
            section: "OrdersManagement",
            icon: <ShoppingCart />,
          },
          {
            label: "Customer Support",
            section: "CustomerSupport",
            icon: <SupportAgent />,
          },
        ].map(({ label, section, icon }) => (
          <Grid item key={section}>
            <Button
              variant="outlined"
              startIcon={
                loading[section] ? (
                  <CircularProgress size={20} sx={{ color: "#1C4771" }} />
                ) : (
                  icon
                )
              }
              onClick={() => handleClick(section)}
              sx={{
                minWidth: 202,
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
              disabled={loading[section]}
            >
              {label}
            </Button>
          </Grid>
        ))}
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
