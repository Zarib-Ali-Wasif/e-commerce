import React, { useState } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import { AccountCircle, ShoppingCart, Lock } from "@mui/icons-material";
import RecentOrders from "../RecentOrders";
import UpdatePassword from "../UpdatePassword";
import ProfilePage from "../ProfilePage";

const AdminSetting = () => {
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
        Admin Settings
      </Typography>

      {/* Section with buttons to navigate to different sub-sections */}
      <Grid container spacing={4} justifyContent="center" marginBottom={10}>
        <Grid item>
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
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<ShoppingCart />}
            onClick={() => setActiveSection("MyTestOrders")}
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
            My Test Orders
          </Button>
        </Grid>
        <Grid item>
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
      {activeSection === "MyTestOrders" && <RecentOrders />}

      {/* Update Password Section */}
      {activeSection === "UpdatePassword" && <UpdatePassword />}
    </Box>
  );
};

export default AdminSetting;
