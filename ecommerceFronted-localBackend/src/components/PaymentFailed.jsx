import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout"); // Redirect back to the checkout page
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4", // Neutral light gray background
        padding: "0 20px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff", // White card background
          borderRadius: "8px", // Rounded corners
          padding: "40px", // Padding inside the card
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
          textAlign: "center", // Center the text
          width: "100%",
          maxWidth: "500px", // Maximum width for card
          margin: "20px",
        }}
      >
        {/* Icon for failed payment */}
        <ErrorIcon
          sx={{
            fontSize: "3rem",
            color: "#d9534f", // Red color for the error icon
            marginBottom: "20px",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#d9534f", // Soft red color for the title
            marginBottom: "20px",
          }}
        >
          Payment Failed
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#555", // Neutral dark color for the message
            marginBottom: "30px",
          }}
        >
          Oops! Something went wrong with your payment. Please try again.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{
            backgroundColor: "#d9534f",
            color: "#fff",
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "4px", // Rounded button corners
            textTransform: "uppercase", // Uppercase button text
          }}
        >
          Back to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentFailed;
