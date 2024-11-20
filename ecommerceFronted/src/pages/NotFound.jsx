import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <Typography variant="h1" fontWeight="bold" color="primary">
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ textTransform: "none" }}
      >
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Go Back to Home
        </NavLink>
      </Button>
    </Box>
  );
};

export default NotFound;
