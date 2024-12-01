import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import RecentOrders from "./RecentOrders";
import UpdatePassword from "../pages/UpdatePassword";
import { AccountCircle, ShoppingCart, Lock } from "@mui/icons-material";
import { teal, deepOrange } from "@mui/material/colors";

const ProfilePage = () => {
  // Initializing the user info state
  const [userInfo, setUserInfo] = useState({
    name: "Brynn Blackburn",
    email: "shopeasy.mern@gmail.com",
    role: "User",
    age: "72",
    gender: "Female",
    is_emailVerified: true,
    is_Active: true,
    createdAt: "2024-11-29T17:01:41.922Z",
    updatedAt: "2024-11-29T21:13:54.299Z",
  });

  const [activeSection, setActiveSection] = useState("");

  //   // Update URL based on active section
  //   useEffect(() => {
  //     window.history.pushState({}, "", `/profile/${activeSection}`);
  //   }, [activeSection]);

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
        Profile Details
      </Typography>

      {/* Section with buttons to navigate to different sub-sections */}
      <Grid container spacing={4} justifyContent="center" marginBottom={10}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AccountCircle />}
            onClick={() => setActiveSection("me")}
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
            onClick={() => setActiveSection("orders")}
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
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<Lock />}
            onClick={() => setActiveSection("password")}
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
            Update Password
          </Button>
        </Grid>
      </Grid>
      {/* Profile Section */}
      {activeSection === "me" && (
        <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 2 }}>
          {/* Profile Header */}
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                marginRight: 2,
                border: "4px solid #1C4771", // Accent border
              }}
              alt="User Avatar"
            />
            <Box>
              <Typography variant="h5" color="textPrimary" fontWeight={600}>
                {userInfo.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userInfo.role}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ marginY: 2 }} />

          {/* Profile Details */}
          <Box sx={{ paddingBottom: 2 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>Email:</strong> {userInfo.email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Age:</strong> {userInfo.age}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Gender:</strong> {userInfo.gender}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Email Verified:</strong>{" "}
              {userInfo.is_emailVerified ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Active Status:</strong>{" "}
              {userInfo.is_Active ? "Active" : "Inactive"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Account Created:</strong>{" "}
              {new Date(userInfo.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Last Updated:</strong>{" "}
              {new Date(userInfo.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Recent Orders Section */}
      {activeSection === "orders" && <RecentOrders />}

      {/* Update Password Section */}
      {activeSection === "password" && <UpdatePassword />}
    </Box>
  );
};

export default ProfilePage;
