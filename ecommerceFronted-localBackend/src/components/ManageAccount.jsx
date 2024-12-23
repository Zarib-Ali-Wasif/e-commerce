import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import RecentOrders from "./RecentOrders";
import UpdatePassword from "./UpdatePassword";
import { AccountCircle, ShoppingCart, Lock } from "@mui/icons-material";
import ProfilePage from "./ProfilePage";

const ManageAccount = () => {
  const [activeSection, setActiveSection] = useState("ProfilePage");

  return (
    <Box
      sx={{
        mt: 20,
        minHeight: "100vh",
        height: "100%",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h3"
        // color="primary"
        sx={{ fontWeight: 600, mb: 6, textAlign: "center", color: "#1C4771" }}
      >
        Manage Account
      </Typography>

      {/* Section with buttons to navigate to different sub-sections */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        textAlign="center"
        marginBottom={10}
      >
        <Grid item xs={12} sm="auto">
          <Button
            variant="outlined"
            startIcon={<AccountCircle />}
            onClick={() => setActiveSection("ProfilePage")}
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
                // backgroundColor: teal[200],
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            My Profile
          </Button>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="outlined"
            startIcon={<ShoppingCart />}
            onClick={() => setActiveSection("RecentOrders")}
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
                // backgroundColor: teal[200],
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },

              transition: "all 0.3s ease",
            }}
          >
            My Orders
          </Button>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="outlined"
            startIcon={<Lock />}
            onClick={() => setActiveSection("UpdatePassword")}
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
                // backgroundColor: teal[200],
                backgroundColor: "#1C4771",
                color: "white",
                boxShadow: 8,
              },
              transition: "all 0.3s ease",
            }}
          >
            Update Password
          </Button>
        </Grid>
      </Grid>

      {/* My Profile Section */}
      {activeSection === "ProfilePage" && <ProfilePage />}

      {/* Recent Orders Section */}
      {activeSection === "RecentOrders" && <RecentOrders />}

      {/* Update Password Section */}
      {activeSection === "UpdatePassword" && <UpdatePassword />}
    </Box>
  );
};

export default ManageAccount;
