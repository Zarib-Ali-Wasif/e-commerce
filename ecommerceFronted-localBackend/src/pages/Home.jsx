import React from "react";
import { Typography, Button, Box, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import hero from "../assets/hero1.jpg"; // Replace this with an appropriate e-commerce banner image
import { ToastContainer } from "react-toastify";

function Home() {
  return (
    <>
      <Toolbar />

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            height: "60%",
            color: "#387DA3",
            gap: "20px",
            ml: { xs: 2, sm: 4 },
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Welcome to ShopEasy
          </Typography>
          <Typography variant="h5">Your One-Stop Online Store</Typography>
          <Button variant="contained" sx={{ backgroundColor: "#1C4771" }}>
            <NavLink
              to="/products"
              style={{
                textDecoration: "none",
                fontSize: "16px",
                color: "white",
                padding: "2px 10px",
              }}
            >
              Explore Products
            </NavLink>
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Home;
