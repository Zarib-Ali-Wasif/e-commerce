import React from "react";
import { Typography, Button, Box, Toolbar } from "@mui/material";
import Layout from "../components/Layout";
import { NavLink } from "react-router-dom";
import hero from "../assets/hero.jpg"; // Replace this with an appropriate e-commerce banner image

function Home() {
  return (
    <>
      <Layout>
        <Toolbar />

        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "75vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "start",
              height: "60%",
              color: "white",
              gap: "20px",
              ml: 5,
            }}
          >
            <Typography variant="h2" fontWeight="bold">
              Welcome to ShopEasy
            </Typography>
            <Typography variant="h5">Your One-Stop Online Store</Typography>
            <Button variant="contained" sx={{ backgroundColor: "#FF7B00" }}>
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
      </Layout>
    </>
  );
}

export default Home;
