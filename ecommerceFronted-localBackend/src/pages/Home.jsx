import React from "react";
import { Typography, Button, Box, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import hero from "../assets/hero1.jpg"; // Replace this with an appropriate e-commerce banner image

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
            alignItems: { xs: "center", sm: "start" },
            height: "60%",
            color: "#387DA3",
            gap: "20px",
            ml: { xs: 0, sm: 4 },
            textAlign: { xs: "center", sm: "left" },
            px: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            Welcome to ShopEasy
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            Your One-Stop Online Store
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: "10px", sm: "20px" },
              alignItems: { xs: "center", sm: "start" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1C4771",
                "&:hover": { backgroundColor: "#163a57" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
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

            {/* Track Order Button */}
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1C4771",
                borderWidth: "1px",
                color: "#1C4771",
                backgroundColor: "#e5e5e5",
                "&:hover": { backgroundColor: "#1C4771", color: "white" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <NavLink
                to="/track-order"
                style={{
                  textDecoration: "none",
                  fontSize: "16px",
                  color: "inherit",
                  padding: "2px 10px",
                }}
              >
                Track Order
              </NavLink>
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Home;
