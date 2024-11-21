import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <Box sx={{ textAlign: "center", padding: "50px", mt: 15 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thank You for Your Order!
      </Typography>
      <Typography variant="body1" mb={4}>
        Your order has been successfully placed. We will notify you with updates
        soon.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1C4771",
          color: "white",
          "&:hover": {
            backgroundColor: "#163b56",
          },
        }}
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default OrderConfirmation;
