import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout"); // Redirect back to the checkout page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payment Failed</h1>
      <p style={styles.message}>
        Oops! Something went wrong with your payment. Please try again.
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRetry}
        style={styles.button}
      >
        Back to Checkout
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  message: {
    fontSize: "1.2rem",
    margin: "20px 0",
  },
  button: {
    marginTop: "20px",
  },
};

export default PaymentFailed;
